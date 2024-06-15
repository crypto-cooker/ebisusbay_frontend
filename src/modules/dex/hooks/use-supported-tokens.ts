import {appConfig} from "@src/Config";
import tokens from '@dex/configs/tokens.json';
import {useMemo} from "react";
import {Token} from "@uniswap/sdk-core";
import {TokenInfo} from "@uniswap/token-lists";
import {toChecksumAddress} from "web3-utils";

const config = appConfig();
const defaultChainId = parseInt(config.chain.id);

export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo;
  constructor(tokenInfo: TokenInfo) {
    super(
      tokenInfo.chainId,
      toChecksumAddress(tokenInfo.address),
      tokenInfo.decimals,
      tokenInfo.symbol,
      tokenInfo.name
    );
    this.tokenInfo = tokenInfo;
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI;
  }
}

export default function useSupportedTokens(chainId?: number) {
  return useMemo(() => {
    const supportedTokens = tokens.tokens
      .map((token) =>  new WrappedTokenInfo(token))
      .filter((token) => token.chainId === (chainId || defaultChainId));

    const commonBases = supportedTokens.filter((token) =>
      tokens.commonBases.map((base) => base.toLowerCase()).includes(token.symbol!.toLowerCase())
    );

    return {
      supportedTokens,
      commonBases
    };
  }, [tokens.tokens]);
}