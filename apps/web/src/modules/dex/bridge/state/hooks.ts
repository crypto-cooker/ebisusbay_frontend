import { useAtomValue } from "jotai"
import { bridgeReducerAtom } from "./reducer"
import React, { FC, useState } from "react"
import { Box } from "@chakra-ui/react"
import { useAppChainConfig } from "@src/config/hooks"
import { useUser } from "@src/components-v2/useUser"
import BridgeAbi from "@src/global/contracts/Bridge.json";
import { Contract } from "ethers"
import { Field } from "./actions"
import {toast} from "react-toastify"
import { parseErrorMessage } from "@src/helpers/validator"


export function useBridgeState() {
  return useAtomValue(bridgeReducerAtom)
}

export function useQuote() {

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
    recipient } = useBridgeState()

  const excute = async (amount: number) => {
    try {
      setExecuting(true);
      const contract = new Contract(config.bridges[currencyId], BridgeAbi, user.provider.signer);
      const tx = await contract.bridge(toChainId, user.address, amount);
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