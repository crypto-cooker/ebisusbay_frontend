import {useAppChainConfig} from "@src/config/hooks";
import Fortune from "@src/global/contracts/Fortune.json";
import {useContract} from "@eb-pancakeswap-web/hooks/useContract";
import {SupportedChainId} from "@src/config/chains";
import {Address, erc20Abi} from "viem";
import Bank from "@src/global/contracts/Bank.json";
import PlatformRewards from "@src/global/contracts/PlatformRewards.json";


export function useFrtnContract(chainId: SupportedChainId) {
  const {config} = useAppChainConfig(chainId);

  return useContract(config.contracts.fortune, erc20Abi, {chainId})
}

export function useBankContract(chainId: SupportedChainId) {
  const {config} = useAppChainConfig(chainId);

  return useContract(config.contracts.bank, Bank as any, {chainId})
}

export function usePlatformRewardsContract(chainId: SupportedChainId) {
  const {config} = useAppChainConfig(chainId);

  return useContract(config.contracts.rewards, PlatformRewards as any, {chainId})
}

export function useTokenContract(tokenAddress?: Address, chainId?: SupportedChainId) {
  return useContract(tokenAddress, erc20Abi, {chainId})
}