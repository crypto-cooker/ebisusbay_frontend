import {ChainId} from "@dex/swap/constants/chainId";
import {Token} from "@pancakeswap/sdk";

export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>