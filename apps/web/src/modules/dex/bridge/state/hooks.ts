import { useAtomValue } from "jotai"
import { bridgeReducerAtom } from "./reducer"
import React, { FC, useState } from "react"
import { Box } from "@chakra-ui/react"

export function useBridgeState() {
  return useAtomValue(bridgeReducerAtom)
}

export function useNetworkSelectorModal() {

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return {
    openModal,
    closeModal,
  }
}