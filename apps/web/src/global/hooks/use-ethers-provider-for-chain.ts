import {DEFAULT_CHAIN_ID, SupportedChainId} from "@src/config/chains";
import {ChainId} from "@pancakeswap/chains";
import {useAppChainConfig} from "@src/config/hooks";
import {ethers} from "ethers";
import {useMemo} from "react";


export function useJsonRpcProviderForChain(chainId?: SupportedChainId) {
  const {config} = useAppChainConfig(chainId ?? DEFAULT_CHAIN_ID)
  return useMemo(() => new ethers.providers.JsonRpcProvider(config.chain.rpcUrls.default.http[0]), [chainId]);
}
