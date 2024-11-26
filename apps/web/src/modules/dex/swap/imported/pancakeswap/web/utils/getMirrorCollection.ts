import { ChainId } from '@pancakeswap/chains';
import chainConfigs from '@src/config/chains';
import { wagmiConfig } from '@src/wagmi';
import { readContract } from '@wagmi/core';
import { erc721Abi, zeroAddress } from 'viem';
import { Address } from 'viem';

export const getMirrorCollection = async (currencyId: string | undefined, chainId: number) => {
  try {
    const res = await readContract(wagmiConfig, {
      chainId,
      address: currencyId as Address,
      functionName: 'mirrorERC721',
      abi: [
        {
          type: 'function',
          name: 'mirrorERC721',
          stateMutability: 'view',
          inputs: [],
          outputs: [
            {
              type: 'address',
            },
          ],
        },
      ],
    });
    return res as string;
  } catch (error) {
    return zeroAddress as string;
  }
};
