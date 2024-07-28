import { Token } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import { createSelector } from '@reduxjs/toolkit'
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {RootState} from "@market/state/redux/store";

const selectUserTokens = ({ pancakeUser: { tokens } }: RootState) => tokens

export const userAddedTokenSelector = (chainId?: number) =>
  createSelector(selectUserTokens, (serializedTokensMap) =>
    Object.values((chainId && serializedTokensMap?.[chainId]) ?? {}).map(deserializeToken),
  )
export default function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => userAddedTokenSelector(chainId), [chainId]))
}
