import useNativeCurrency from '@eb-pancakeswap-web/hooks/useNativeCurrency';
import { ethers } from 'ethers';

export function useSerializedNativeCurrency(chainId: number) {
  const nativeCurrency = useNativeCurrency(chainId);
  return {
    chainId: nativeCurrency.chainId,
    address: ethers.constants.AddressZero,
    decimals: nativeCurrency.decimals,
    symbol: nativeCurrency.symbol,
    name: nativeCurrency.name
  };
}