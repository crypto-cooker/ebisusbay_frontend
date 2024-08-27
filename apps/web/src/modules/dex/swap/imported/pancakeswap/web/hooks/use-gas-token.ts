import { Currency } from '@pancakeswap/swap-sdk-core'
import {DEFAULT_PAYMASTER_TOKEN, isSupportedPaymasterChainId, SupportedPaymasterChain} from '@src/config/paymaster'
import { atom, useAtom } from 'jotai'
import {ChainId} from "@pancakeswap/chains";

export const gasTokenAtom = atom<Record<SupportedPaymasterChain, Currency>>(DEFAULT_PAYMASTER_TOKEN)

export const useGasToken = () => {
  return useAtom(gasTokenAtom)
}

export const useGasTokenByChain = <T extends ChainId>(chainId: T): T extends SupportedPaymasterChain ? [Currency, (newToken: Currency) => void] : [Currency | undefined, (newToken: Currency) => void] => {
  const [gasTokens, setGasTokens] = useAtom(gasTokenAtom);

  // Getter: returns the gas token for the specific chainId, or undefined if not supported
  const gasToken = isSupportedPaymasterChainId(chainId) ? gasTokens[chainId] : undefined;

  // Setter: only updates the gas token if the chainId is supported
  const setGasToken = (newToken: Currency) => {
    if (isSupportedPaymasterChainId(chainId)) {
      setGasTokens((prevTokens) => ({
        ...prevTokens,
        [chainId]: newToken,
      }));
    }
  };

  return [gasToken, setGasToken] as T extends SupportedPaymasterChain ? [Currency, (newToken: Currency) => void] : [Currency | undefined, (newToken: Currency) => void];
};