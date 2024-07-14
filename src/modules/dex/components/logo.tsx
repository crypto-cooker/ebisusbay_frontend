import {WrappedTokenInfo} from "@dex/hooks/use-supported-tokens";
import {Image, SpaceProps} from "@chakra-ui/react";
import React, {memo, useMemo, useState} from "react";
import {QuestionOutlineIcon} from "@chakra-ui/icons";
import {isChainSupported} from "@src/wagmi";
import ImageService from "@src/core/services/image";
import {ChainId} from "@pancakeswap/chains";
import uriToHttp from "@pancakeswap/utils/uriToHttp";
import memoize from "lodash/memoize";
import {Token} from "@pancakeswap/swap-sdk-core";
import {Address, getAddress} from "viem";
import {bscTokens, cronosTokens, ethereumTokens} from "@pancakeswap/tokens";
import {NATIVE} from "@pancakeswap/swap-sdk-evm";

const getTokenLogoURL = (address: string) => {
  return `https://dd.dexscreener.com/ds-data/tokens/cronos/${address}.png?size=sm`;
}

export type CurrencyInfo = {
  address?: Address;
  symbol?: string;
  chainId?: number;
  isToken?: boolean;
  isNative?: boolean;
};

export default function useHttpLocations(uri: string | undefined): string[] {
  return useMemo(() => {
    return uri ? uriToHttp(uri) : []
  }, [uri])
}


export function CurrencyLogo({
                               currency,
                               size = "24px",
                               style,
                               useTrustWalletUrl,
                               ...props
                             }: {
  currency?: CurrencyInfo & {
    logoURI?: string | undefined;
  };
  size?: string;
  style?: React.CSSProperties;
  useTrustWalletUrl?: boolean;
} & SpaceProps) {
  const uriLocations = useHttpLocations(currency?.logoURI);

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return [];

    if (currency?.isToken) {
      const logoUrls = getCurrencyLogoUrlsByInfo(currency, { useTrustWallet: useTrustWalletUrl });

      if (currency?.logoURI) {
        return [...uriLocations, ...logoUrls];
      }
      return [...logoUrls];
    }
    return [];
  }, [currency, uriLocations, useTrustWalletUrl]);

  console.log('=CCC', currency, srcs);
  if (currency?.isNative) {
    return (
      <TokenLogo
        size={size}
        srcs={[`https://assets.pancakeswap.finance/web/native/${currency.chainId}.png`]}
        width={size}
        style={style}
        {...props}
      />
    );
  }

  return <TokenLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? "token"} logo`} style={style} {...props} />;
}


export interface TokenLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcs: string[];
  useFilledIcon?: boolean;
}

const TokenLogo: React.FC<React.PropsWithChildren<TokenLogoProps>> = ({ srcs, useFilledIcon, alt, ...rest }) => {
  const [, refresh] = useState<number>(0);

  const src: string | undefined = srcs.find((s) => !BAD_SRCS[s]);

  if (src) {
    return (
      <Image
        w='30px'
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          // eslint-disable-next-line no-param-reassign
          if (src) BAD_SRCS[src] = true;
          refresh((i) => i + 1);
        }}
      />
    );
  }

  return useFilledIcon ? <QuestionOutlineIcon {...rest} /> : <QuestionOutlineIcon {...rest} />;
};

const BAD_SRCS: { [tokenAddress: string]: true } = {};

export function PairLogo({ pair }: { pair: Token[] }) {
  const [srcs, setSrcs] = useState<string[]>([]);

  useMemo(() => {
    const newSrcs = pair.map((token) => getTokenLogoURL(token.address));
    setSrcs(newSrcs);
  }, [pair]);

  return <Logo src={srcs[0]} alt='Pair logo' />;
}

export const ChainLogo = memo(
  ({ chainId, width = 24, height = 24 }: { chainId?: number; width?: number; height?: number }) => {
    if (chainId && isChainSupported(chainId)) {
      return (
        <Image
          alt={`chain-${chainId}`}
          style={{ maxHeight: `${height}px` }}
          src={ImageService.translate(`/files/dex/images/chains/${chainId}.webp`).fixedWidth(width, height)}
          width={`${width}px`}
          height={`${height}px`}
          rounded='full'
        />
      )
    }

    return <QuestionOutlineIcon width={width} height={height} />
  },
)

const mapping: { [key: number]: string } = {
  [ChainId.BSC]: "smartchain",
  [ChainId.ETHEREUM]: "ethereum",
  [ChainId.POLYGON_ZKEVM]: "polygonzkevm",
  [ChainId.ARBITRUM_ONE]: "arbitrum",
  [ChainId.ZKSYNC]: "zksync",
  [ChainId.BASE]: "base",
  [ChainId.LINEA]: "linea",
  [ChainId.OPBNB]: "opbnb",
};

export const chainName: { [key: number]: string } = {
  [ChainId.BSC]: "",
  [ChainId.ETHEREUM]: "eth",
  [ChainId.POLYGON_ZKEVM]: "polygon-zkevm",
  [ChainId.ARBITRUM_ONE]: "arbitrum",
  [ChainId.ZKSYNC]: "zksync",
  [ChainId.LINEA]: "linea",
  [ChainId.BASE]: "base",
  [ChainId.OPBNB]: "opbnb",
};

const commonCurrencySymbols = [
  ethereumTokens.usdt,
  ethereumTokens.usdc,
  bscTokens.cake,
  bscTokens.usdv,
  ethereumTokens.wbtc,
  ethereumTokens.weth,
  NATIVE[ChainId.BSC],
  bscTokens.busd,
  ethereumTokens.dai,
  cronosTokens.usdc,
  cronosTokens.frtn,
].map(({ symbol }) => symbol);

export const getTokenListTokenUrl = (token: Pick<Token, 'chainId' | 'address' | 'symbol'>) =>
  Object.keys(chainName).includes(String(token.chainId))
    ? `https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${
      token.chainId === ChainId.CRONOS ? '' : `${chainName[token.chainId]}/`
    }${token.symbol.toLowerCase()}.webp`
    : null;

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && mapping[chainId]) {
      return `https://assets-cdn.trustwallet.com/blockchains/${mapping[chainId]}/assets/${getAddress(
        address
      )}/logo.png`;
    }
    return null;
  },
  (address, chainId) => `${chainId}#${address}`
);

export const getCommonCurrencyUrlBySymbol = memoize(
  (symbol?: string): string | undefined =>
    symbol && commonCurrencySymbols.includes(symbol)
      ? `https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${symbol.toLocaleLowerCase()}.webp`
      : undefined,
  (symbol?: string) => `logoUrls#symbol#${symbol}`
);

type GetLogoUrlsOptions = {
  useTrustWallet?: boolean;
};

export const getCurrencyLogoUrlsByInfo = memoize(
  (currency: CurrencyInfo | undefined, { useTrustWallet = true }: GetLogoUrlsOptions = {}): string[] => {
    if (!currency) {
      return [];
    }
    const { chainId, address, symbol } = currency;
    const trustWalletLogo = getTokenLogoURLByAddress(address, chainId);
    const logoUrl = chainId && address ? getTokenListTokenUrl({ chainId, address }) : null;
    return [getCommonCurrencyUrlBySymbol(symbol), useTrustWallet ? trustWalletLogo : undefined, logoUrl].filter(
      (url): url is string => !!url
    );
  },
  (currency, options) =>
    `logoUrls#${currency?.chainId}#${currency?.symbol}#${currency?.address}#${options ? JSON.stringify(options) : ""}`
);
