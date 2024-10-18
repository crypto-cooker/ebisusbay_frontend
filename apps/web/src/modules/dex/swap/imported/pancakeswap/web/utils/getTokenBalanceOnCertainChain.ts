import { Contract, getDefaultProvider, utils, ethers } from 'ethers';
import { erc20Abi } from 'viem';
import { appConfig } from '@src/config';
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
