import { INITIAL_ALLOWED_SLIPPAGE } from "@dex/swap/constants"
import { V2TradeAndStableSwap } from "@dex/swap/constants/types"
import useAccountActiveChain from "@eb-pancakeswap-web/hooks/useAccountActiveChain"
import { usePaymaster } from '@eb-pancakeswap-web/hooks/usePaymaster'
import { calculateGasMargin } from "@eb-pancakeswap-web/utils"
import { basisPointsToPercent } from "@eb-pancakeswap-web/utils/exchange"
import { isUserRejected } from "@eb-pancakeswap-web/utils/sentry"
import { transactionErrorToUserReadableMessage } from "@eb-pancakeswap-web/utils/transactionErrorToUserReadableMessage"
import isZero from '@pancakeswap/utils/isZero'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { Hash, hexToBigInt, isAddress, SendTransactionReturnType } from 'viem'
import { useGasPrice, useSendTransaction } from "wagmi"
import { useUser } from "@src/components-v2/useUser"
import { BridgeContract } from "../constants/types"
import { Field } from "../state/actions"
import { useBridgeState } from "../state/hooks"
import { toast } from "react-toastify";
import { Contract, utils } from "ethers"
import { useState, useMemo, useCallback } from "react"
import { useAppChainConfig } from "@src/config/hooks"
import BridgeAbi from "@src/global/contracts/Bridge.json";
import { parseErrorMessage } from "@src/helpers/validator"

export function useBridgeCallback(): { callback: (() => Promise<void>), executing: boolean } {
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


  const callback = useCallback(async () => {
    try {
      setExecuting(true);
      if (typeof currencyId == "undefined") return
      const bridge: BridgeContract | undefined = config.bridges.find((bridge) => bridge.currencyId.toLocaleLowerCase().includes(currencyId.toLocaleLowerCase()));
      console.log({bridge})
      if (typeof bridge?.address == "undefined") return
      console.log(currencyId, typedValue)
      const contract = new Contract(bridge?.address, BridgeAbi, user.provider.signer);
      const fee: BigInt = await contract.fee();
      console.log({fee})
      const tx = await contract.bridge(toChainId, user.address, typedValue, {
        value: utils.parseEther(fee.toString())
      })
      await tx.wait();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecuting(false);
    }
  }, [currencyId, fromChainId, toChainId])

  return { callback, executing } as const;
}
