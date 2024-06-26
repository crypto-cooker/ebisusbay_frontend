import {Token} from "@pancakeswap/sdk";
import {ChainId} from "@eb-pancakeswap/chains";

export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>