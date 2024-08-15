import {appConfig} from "@src/config";
import tokens from '@dex/config/tokens.json';
import {useMemo} from "react";
import {Token} from "@pancakeswap/sdk";
import {Address} from "viem";

const config = appConfig();
const defaultChainId = parseInt(config.chain.id);

export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: any;
  constructor(tokenInfo: any) {
    super(
      tokenInfo.chainId,
      tokenInfo.address as Address,
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