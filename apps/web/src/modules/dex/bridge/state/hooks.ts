import { useAtomValue } from "jotai"
import { bridgeReducerAtom } from "./reducer"
import { useState, useMemo } from "react"
import { useAppChainConfig } from "@src/config/hooks"
import { useUser } from "@src/components-v2/useUser"
import BridgeAbi from "@src/global/contracts/Bridge.json";
import { Contract, utils } from "ethers"
import { Field } from "./actions"
import { toast } from "react-toastify"
import { parseErrorMessage } from "@src/helpers/validator"
import { Bridge } from "../constants/types"
import { useAccount } from "wagmi"
import { useGetENSAddressByName } from "@dex/swap/imported/pancakeswap/web/hooks/useGetENSAddressByName"
import { safeGetAddress } from "@dex/swap/imported/pancakeswap/web/utils"
import { useCurrencyBalances, useCurrencyBalance } from "@dex/swap/imported/pancakeswap/web/state/wallet/hooks"
import tryParseAmount from "@pancakeswap/utils/tryParseAmount"
import { BAD_RECIPIENT_ADDRESSES } from "@dex/swap/imported/pancakeswap/web/state/swap/hooks"
import { Currency, CurrencyAmount, Native, Token } from '@pancakeswap/sdk'


export function useBridgeState() {
  return useAtomValue(bridgeReducerAtom)
}
export function useDerivedBridgeInfo(
  typedValue: string,
  currency: Currency | undefined,
  recipient: string,
): {
  currency: { [field in Field]?: Currency }
  currencyBalance: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  inputError?: string
} {
  const { address: account } = useAccount()
  const recipientENSAddress = useGetENSAddressByName(recipient)

  const to: string | null =
    (recipient === null ? account : safeGetAddress(recipient) || safeGetAddress(recipientENSAddress) || null) ?? null

  const currencyBalance = useCurrencyBalance(
    account ?? undefined,
    useMemo(() => [currency ?? undefined], [currency]),
  )

  const parsedAmount = tryParseAmount(typedValue, currency ?? undefined)

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

  const formattedTo = safeGetAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? 'Enter a recipient'
  } else if (BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1) {
    inputError = inputError ?? 'Invalid recipient'
  }

  if (currencyBalance && typedValue && currencyBalance.lessThan(typedValue)) {
    inputError = `Insufficient ${currency.symbol} balance`
  }

  return {
    currency,
    currencyBalance,
    parsedAmount,
    inputError,
  }
}


export function useBridge() {
  const user = useUser();
  const { config } = useAppChainConfig();
  const [executing, setExecuting] = useState(false);
  const {
    currencyId,
    typedValue,
    [Field.INPUT]: {
      chainId: fromChainId
    },
    [Field.OUTPUT]: {
      chainId: toChainId
    },
    recipient } = useBridgeState();


  const excute = async (amount: number) => {
    try {
      setExecuting(true);
      if (typeof currencyId == "undefined") return
      const bridge: Bridge | undefined = config.bridges.find((bridge) => bridge.currencyId.includes(currencyId?.toLocaleLowerCase()));
      if (typeof bridge?.address == "undefined") return
      const contract = new Contract(bridge?.address, BridgeAbi, user.provider.signer);
      const fee: BigInt = await contract.fee();
      const tx = await contract.bridge(toChainId, user.address, amount, {
        value: utils.parseEther(fee.toString())
      })
      await tx.wait();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecuting(false);
    }
  }

  return [excute, executing] as const;
}