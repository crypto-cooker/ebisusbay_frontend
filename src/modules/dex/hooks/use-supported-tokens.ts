import {appConfig} from "@src/Config";
import tokens from '@dex/configs/tokens.json';
import {DexToken} from "@dex/types/types";
import {useMemo} from "react";

const config = appConfig();
const defaultChainId = parseInt(config.chain.id);


export default function useSupportedTokens(chainId?: number) {
  return useMemo(() => {
    const supportedTokens = tokens.tokens.filter((token: DexToken) => token.chainId === (chainId || defaultChainId));
    const commonBases = supportedTokens.filter((token: DexToken) =>
      tokens.commonBases.map((base) => base.toLowerCase()).includes(token.symbol.toLowerCase())
    );

    return {
      supportedTokens,
      commonBases
    };
  }, [tokens.tokens]);
}