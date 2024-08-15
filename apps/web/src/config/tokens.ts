import {ChainId} from "@pancakeswap/chains";
import {cronosTestnetTokens, cronosTokens, cronosZkEvmTokens, cronosZkEvmTestnetTokens} from "@pancakeswap/tokens";
import {SupportedChainId} from "@src/config/chains";
import {ERC20Token} from "@pancakeswap/swap-sdk-evm";

// interface AppToken {
//   name: string;
//   symbol: string;
//   address: string;
//   decimals: number;
//   logoURI?: string;
// }

type AppToken = {
  readonly chainId: ChainId;
  readonly address: `0x${string}`;
  readonly decimals: number;
  readonly symbol: string;
  readonly name: string;
  readonly projectLink?: string;
};

type TokenKeys<T> = keyof T;

type AppTokenMap<T> = { [chainId in SupportedChainId]: { [key in TokenKeys<T>]: T[key] } };
type AppTokenList = AppTokenMap<Record<string, ERC20Token>>;

export const supportedTokens: AppTokenList = {
  [ChainId.CRONOS]: cronosTokens,
  [ChainId.CRONOS_TESTNET]: cronosTestnetTokens,
  [ChainId.CRONOS_ZKEVM]: cronosZkEvmTokens,
  [ChainId.CRONOS_ZKEVM_TESTNET]: cronosZkEvmTestnetTokens
}