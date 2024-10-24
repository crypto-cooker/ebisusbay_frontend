import { ChainId } from "@pancakeswap/chains"
import {CHAINS} from "@src/config/chains";
import {cronos} from "wagmi/chains";
import { Contract, utils, ethers } from 'ethers';
import { erc20Abi } from 'viem';

// Get the token balance of certain address on given chain
export async function getTokenBalanceOnCertainChain(tokenAddress: string, rpcUrl: string, account: string) {
  const readProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  try {
    const tokenContract = new Contract(tokenAddress, erc20Abi, readProvider);
    const balance = await tokenContract.balanceOf(account);
    const decimals = await tokenContract.decimals();
    const formattedBalance = utils.formatUnits(balance, decimals);
    return formattedBalance;
  } catch (error) {
    console.log(error);
    return null;
  }
}


export function getBlockExplorerLink(
  data: string | number | undefined | null,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainIdOverride?: number,
): string {
  const chainId = chainIdOverride || ChainId.CRONOS
  const chain = CHAINS.find((c) => c.id === chainId)
  if (!chain || !data) return cronos.blockExplorers.default.url

  switch (type) {
    case 'transaction': {
      return `${chain?.blockExplorers?.default.url}/tx/${data}`
    }
    case 'token': {
      if (typeof data === 'string' && chain.blockExplorers?.default.url.includes('explorer.zkevm.cronos.org')) {
        data = data.replace('a=', 'tokenId=')
      }
      return `${chain?.blockExplorers?.default.url}/token/${data}`
    }
    case 'block': {
      return `${chain?.blockExplorers?.default.url}/block/${data}`
    }
    case 'countdown': {
      return `${chain?.blockExplorers?.default.url}/block/countdown/${data}`
    }
    default: {
      return `${chain?.blockExplorers?.default.url}/address/${data}`
    }
  }
}

export function getBlockExplorerName(chainIdOverride?: number) {
  const chainId = chainIdOverride || ChainId.CRONOS
  const chain = CHAINS.find((c) => c.id === chainId)

  return chain?.blockExplorers?.default.name || cronos.blockExplorers.default.name
}