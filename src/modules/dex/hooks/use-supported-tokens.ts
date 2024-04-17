import {appConfig} from "@src/Config";
import tokens from '@dex/configs/tokens.json';
import {DexToken} from "@dex/types";
import {ciEquals} from "@market/helpers/utils";

const config = appConfig();



export default function useSupportedTokens() {
  const supportedTokens = tokens.tokens.filter((token: DexToken) => token.chainId === parseInt(config.chain.id));
  const commonBases = supportedTokens.filter((token: DexToken) => tokens.commonBases.map((base) => base.toLowerCase()).includes(token.symbol.toLowerCase()));

  return {
    supportedTokens,
    commonBases
  }
}