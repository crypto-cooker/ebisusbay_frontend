import { useAtomValue } from "jotai"
import { bridgeReducerAtom } from "./reducer"
import React, { FC, useState } from "react"
import { Box } from "@chakra-ui/react"

export function useBridgeState() {
  return useAtomValue(bridgeReducerAtom)
}