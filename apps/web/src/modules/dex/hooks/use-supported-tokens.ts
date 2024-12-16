import {appConfig} from "@src/config";
import fallbackTokens from '@dex/config/tokens.json';
import {useMemo} from "react";
import {Token} from "@pancakeswap/sdk";
import {Address} from "viem";
import { useAtomValue } from 'jotai/index';
import { globalTokensAtom } from '@src/components-v2/global-data-fetcher';

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
  const storedTokens = useAtomValue(globalTokensAtom);

  return useMemo(() => {
    const tokens = storedTokens ?? fallbackTokens.tokens;

    const supportedTokens = tokens
      ?.map((token) =>  new WrappedTokenInfo(token))
      .filter((token) => token.chainId === (chainId || defaultChainId));

    // const commonBases = supportedTokens.filter((token) =>
    //   tokens.commonBases.map((base) => base.toLowerCase()).includes(token.symbol!.toLowerCase())
    // );

    return {
      supportedTokens,
      // commonBases
    };
  }, [storedTokens, fallbackTokens, chainId]);
}