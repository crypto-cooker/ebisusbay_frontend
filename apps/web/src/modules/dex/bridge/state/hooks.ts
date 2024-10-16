import { useAtomValue, useAtom } from "jotai"
import { bridgeReducerAtom } from "./reducer"
import { useState, useMemo, useEffect, useCallback } from "react"
import { useAppChainConfig } from "@src/config/hooks"
import { useUser } from "@src/components-v2/useUser"
import BridgeAbi from "@src/global/contracts/Bridge.json";
import { BigNumber, Contract, utils } from "ethers"
import { Field } from "./actions"
import { useAccount } from "wagmi"
import { safeGetAddress } from "@dex/swap/imported/pancakeswap/web/utils"
import { useCurrencyBalance } from "@dex/swap/imported/pancakeswap/web/state/wallet/hooks"
import tryParseAmount from "@pancakeswap/utils/tryParseAmount"
import { Currency, CurrencyAmount, Native, Token, Trade, TradeType } from '@pancakeswap/sdk'
import { useActiveChainId } from "@dex/swap/imported/pancakeswap/web/hooks/useActiveChainId"
import useNativeCurrency from "@dex/swap/imported/pancakeswap/web/hooks/useNativeCurrency"
import { useRouter } from "next/router"
import { FRTN, STABLE_COIN, USDC, USDT } from '@pancakeswap/tokens'
import { replaceBridgeState } from "./actions"
import { chains } from "@src/wagmi"
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

  const { fee } = useBridgeFee()

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

export function useBridgeFee() {
  const { currencyId, [Field.INPUT]: { chainId: fromChainId } } = useBridgeState()
  const { config } = useAppChainConfig();
  const [fee, setFee] = useState<BigNumber | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useUser();
  const chainId =  useActiveChainId()

  // Memoize bridge to avoid recalculating unless currencyId changes
  const bridge = useMemo(() => {
    if (!currencyId) return undefined;
    return config.bridges.find((bridge) =>
      bridge.currencyId.toLowerCase().includes(currencyId.toLowerCase())
    );
  }, [currencyId, config]);

  // Fetch fee only when required
  const getFee = useCallback(async () => {
    if (!bridge || !bridge.address || !user?.provider?.signer) return;
    setLoading(true);
    try {
      const contract = new Contract(bridge.address, BridgeAbi, user.provider.signer);
      const fetchedFee = await contract.fee(); // Assuming this is the correct function
      setFee(fetchedFee);
    } catch (error) {
      console.error("Error fetching bridge fee:", error);
      setFee(undefined); // Reset fee on error
    } finally {
      setLoading(false);
    }
  }, [bridge, user, fromChainId, currencyId]);

  // Only fetch the fee when necessary (currencyId, user, or bridge changes)
  useEffect(() => {
    if (bridge) {
      getFee();
    }
  }, [bridge, currencyId, chainId]);
  return { fee, loading };
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
