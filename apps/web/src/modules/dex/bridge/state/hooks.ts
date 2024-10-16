import { useAtomValue, useAtom } from "jotai"
import { bridgeReducerAtom } from "./reducer"
import { useState, useMemo, useEffect, useCallback } from "react"
import { useAppChainConfig } from "@src/config/hooks"
import { useUser } from "@src/components-v2/useUser"
import BridgeAbi from "@src/global/contracts/Bridge.json";
import { BigNumber, Contract, utils } from "ethers"
import { Field } from "./actions"
import { toast } from "react-toastify"
import { parseErrorMessage } from "@src/helpers/validator"
import { BridgeContract } from "../constants/types"
import { useAccount } from "wagmi"
import { useGetENSAddressByName } from "@dex/swap/imported/pancakeswap/web/hooks/useGetENSAddressByName"
import { safeGetAddress } from "@dex/swap/imported/pancakeswap/web/utils"
import { useCurrencyBalances, useCurrencyBalance } from "@dex/swap/imported/pancakeswap/web/state/wallet/hooks"
import tryParseAmount from "@pancakeswap/utils/tryParseAmount"
import { BAD_RECIPIENT_ADDRESSES } from "@dex/swap/imported/pancakeswap/web/state/swap/hooks"
import { Currency, CurrencyAmount, Native, Token, Trade, TradeType } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { useActiveChainId } from "@dex/swap/imported/pancakeswap/web/hooks/useActiveChainId"
import useNativeCurrency from "@dex/swap/imported/pancakeswap/web/hooks/useNativeCurrency"
import { useRouter } from "next/router"
import { FRTN, STABLE_COIN, USDC, USDT } from '@pancakeswap/tokens'
import { replaceBridgeState } from "./actions"
import chainConfigs from "@src/config/chains"
import { chains } from "@src/wagmi"
import { BridgeState } from "./reducer"
import { DEFAULT_INPUT_CURRENCY } from "@dex/swap/constants/exchange"
import { ParsedUrlQuery } from "querystring"





export function useBridgeState() {
  return useAtomValue(bridgeReducerAtom)
}
export function useDerivedBridgeInfo(
  fromChainId: ChainId,
  toChainId: ChainId,
  typedValue: string | undefined,
  currency: Currency | undefined,
): {
  currency: { [field in Field]?: Currency }
  currencyBalance: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  bridge: Trade<Currency, Currency, TradeType> | undefined
  inputError?: string
} {
  const { address: account } = useAccount()

  const currencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  )

  const parsedAmount = tryParseAmount(typedValue, currency ?? undefined);

  const fee = useBridgeFee();

  const bridge = {
    fee,
    fromChainId,
    toChainId,
    currency,
    amount: parsedAmount
  }

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'Enter an amount'
  }

  if (!currency) {
    inputError = inputError ?? 'Select a token'
  }

  if (currencyBalance && parsedAmount && currencyBalance.lessThan(parsedAmount)) {
    inputError = `Insufficient ${currency.symbol} balance`
  }

  return {
    bridge,
    currency,
    currencyBalance,
    parsedAmount,
    inputError,
  }
}

export async function useBridgeFee() {
  const { currencyId } = useBridgeState();
  const { config } = useAppChainConfig();
  const [fee, setFee] = useState(0);

  const user = useUser();

  useEffect(() => {
    feeCallback;
  }, [currencyId, user])

  const feeCallback = useCallback(async () => {
    if (typeof currencyId == "undefined") return 0
    const bridge: BridgeContract | undefined = config.bridges.find((bridge) => bridge.currencyId.toLocaleLowerCase().includes(currencyId.toLocaleLowerCase()));
    if (typeof bridge?.address == "undefined") return 0
    const contract = new Contract(bridge?.address, BridgeAbi, user.provider.signer);
    let fee = 0;
    if(contract) {
      fee = await contract.fee();
      setFee(fee);
    }
  }, [currencyId, user])

  return fee;
}


function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !Number.isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = safeGetAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

export function queryParameterstoBridgeState(
  parsedQs: ParsedUrlQuery,
  nativeSymbol?: string,
  defaultCurrency?: string
) {
  let currencyId = defaultCurrency || (nativeSymbol ?? DEFAULT_INPUT_CURRENCY)

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    currencyId,
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    recipient,
  }
}

export function useDefaultCurrency(): { currencyId: string | undefined; } | undefined {
  const { chainId } = useActiveChainId()
  const [, dispatch] = useAtom(bridgeReducerAtom)
  const native = useNativeCurrency()
  const { query, isReady } = useRouter()
  const [result, setResult] = useState<{ currencyId: string | undefined } | undefined>()

  useEffect(() => {
    if (!chainId || !native || !isReady) return
    const parsed = queryParameterstoBridgeState(
      query,
      native.symbol,
      FRTN[chainId as keyof typeof FRTN]?.address ??
      STABLE_COIN[chainId]?.address ?? USDC[chainId as keyof typeof USDC]?.address ??
      USDT[chainId as keyof typeof USDT]?.address,
    )

    const toChain = chains.find((chain) => chain.id != chainId);

    dispatch(
      replaceBridgeState({
        typedValue: parsed.typedValue,
        currencyId: parsed.currencyId,
        fromChainId: chainId,
        toChainId: toChain?.id,
        recipient: '',
      }),
    )
    setResult({ currencyId: parsed.currencyId })
  }, [dispatch, chainId, query, native, isReady])

  return result
}
