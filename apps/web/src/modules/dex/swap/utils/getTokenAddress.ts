import {ChainId, NATIVE, WNATIVE} from "@pancakeswap/sdk";

export const getTokenAddress = (chainId: number | undefined, tokenAddress: string | undefined) => {
  if (!tokenAddress || !chainId) {
    return ''
  }
  const lowerCaseAddress = tokenAddress.toLowerCase()
  const nativeToken = NATIVE[chainId as ChainId]
  const nativeSymbol = nativeToken?.symbol?.toLowerCase() || ''
  if (lowerCaseAddress === nativeSymbol) {
    return WNATIVE[chainId as ChainId].address.toLowerCase()
  }

  return lowerCaseAddress
}