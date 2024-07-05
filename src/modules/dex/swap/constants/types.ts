import {Token} from "@pancakeswap/sdk";
import {ChainId} from "@pancakeswap/chains";

export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>