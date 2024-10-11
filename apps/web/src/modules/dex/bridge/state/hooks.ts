import { useAtom, useAtomValue } from "jotai"
import { bridgeReducerAtom } from "./reducer"
import React, { FC, useEffect, useState } from "react"
import { Box } from "@chakra-ui/react"
import { getBridgeContract, useAppChainConfig, useBridgeContract } from "@src/config/hooks"
import { useUser } from "@src/components-v2/useUser"
import BridgeAbi from "@src/global/contracts/Bridge.json";
import { Contract } from "ethers"
import { Field } from "./actions"
import { toast } from "react-toastify"
import { parseErrorMessage } from "@src/helpers/validator"
import { Address } from "viem"
import { useBridgeActionHandlers } from "./useBridgeActionHandler"


export function useBridgeState() {
  return useAtomValue(bridgeReducerAtom)
}

export function useQuote() {
  const user = useUser()
  const [quote, setQuote] = useState(0);
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

  const { config } = useAppChainConfig();
  useEffect(() => {
    const contractAddress = config.bridges.find((bridge) => bridge.currencyId == currencyId)
    console.log({config, contractAddress, currencyId})
    const getQuote = async () => {
      console.log("here")
      const contract = new Contract("0x5BFa2B69D5EF18CefBF5CD471126DE5efc1460Fa", BridgeAbi, user.provider.signer);
      const fee = await contract.fee();
      console.log("Quote Value", Number(typedValue) * (1000 - fee) / 1000)
      setQuote(Number(typedValue) * (1000 - fee) / 1000)
    }
    console.log({ typedValue })
    getQuote()
  }, [typedValue])

  return quote
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
  const contractAddress = config.bridges.find((bridge) => bridge.currencyId == currencyId)


  const excute = async (amount: number) => {
    try {
      setExecuting(true);
      const contract = new Contract(contractAddress as Address, BridgeAbi, user.provider.signer);
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