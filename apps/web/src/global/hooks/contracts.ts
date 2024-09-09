import {useAppChainConfig} from "@src/config/hooks";
import Fortune from "@src/global/contracts/Fortune.json";
import {useContract} from "@eb-pancakeswap-web/hooks/useContract";
import {SupportedChainId} from "@src/config/chains";
import {erc20Abi} from "viem";


export function useFrtnContract(chainId: SupportedChainId) {
  const {config} = useAppChainConfig(chainId);

  return useContract(config.contracts.fortune, Fortune as any, {chainId})
}