import { WrappedTokenInfo } from '@dex/hooks/use-supported-tokens';
import { Image, Flex, SpaceProps, Box, Avatar, BoxProps, HStack } from '@chakra-ui/react';
import React, { memo, useMemo, useState } from 'react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { isChainSupported } from '@src/wagmi';
import ImageService from '@src/core/services/image';
import { ChainId } from '@pancakeswap/chains';
import uriToHttp from '@pancakeswap/utils/uriToHttp';
import memoize from 'lodash/memoize';
import { Currency, Token } from '@pancakeswap/swap-sdk-core';
import { Address, getAddress } from 'viem';
import { bscTokens, cronosTokens, cronosZkEvmTokens, ethereumTokens } from '@pancakeswap/tokens';
import { NATIVE } from '@pancakeswap/swap-sdk-evm';
import styled from 'styled-components';
import { ethers } from 'ethers';

export type CurrencyInfo = {
  address?: Address;
  symbol?: string;
  chainId?: number;
  isToken?: boolean;
  isNative?: boolean;
};

export default function useHttpLocations(uri: string | undefined): string[] {
  return useMemo(() => {
    return uri ? uriToHttp(uri) : [];
  }, [uri]);
}

export function CurrencyLogoByAddress({
  address,
  chainId,
  size,
  ...props
}: { address: string; chainId: number; size?: string } & SpaceProps) {
  const currency: CurrencyInfo = useMemo(() => {
    const isNative = address === ethers.constants.AddressZero;
    const nativeSymbol = NATIVE[chainId as ChainId]?.symbol ?? '';

    return {
      address: address as Address,
      chainId,
      symbol: isNative ? nativeSymbol : '',
      isToken: !isNative,
      isNative,
    };
  }, [address]);

  return <CurrencyLogo currency={currency} size={size} {...props} />;
}

export function CurrencyLogo({
  currency,
  size = '30px',
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
} & BoxProps) {
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

  if (currency?.isNative) {
    return (
      <TokenLogo
        size={size}
        srcs={[ImageService.translate(`files/dex/images/native/${currency.chainId}.webp`).convert()]}
        width={size}
        height={size}
        style={style}
        {...props}
      />
    );
  }

  return <TokenLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} {...props} />;
}

export interface TokenLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcs: string[];
  useFilledIcon?: boolean;
  size: string;
}

const TokenLogo: React.FC<React.PropsWithChildren<TokenLogoProps>> = ({ srcs, useFilledIcon, size, alt, ...rest }) => {
  const [, refresh] = useState<number>(0);

  const src: string | undefined = srcs.find((s) => !BAD_SRCS[s]);

  if (src) {
    return (
      <Image
        w={size}
        rounded="full"
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

  return <QuestionOutlineIcon fontSize={size} />;
};

const BAD_SRCS: { [tokenAddress: string]: true } = {};

// export function PairLogo({ pair }: { pair: Token[] }) {
//   const [srcs, setSrcs] = useState<string[]>([]);
//
//   useMemo(() => {
//     const newSrcs = pair.map((token) => getTokenLogoURL(token.address));
//     setSrcs(newSrcs);
//   }, [pair]);
//
//   return <Logo src={srcs[0]} alt='Pair logo' />;
// }

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
          rounded="full"
        />
      );
    }

    return <QuestionOutlineIcon width={width} height={height} />;
  },
);

const StyledListLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

export function ListLogo({
  logoURI,
  style,
  size = '24px',
  alt,
}: {
  logoURI: string;
  size?: string;
  style?: React.CSSProperties;
  alt?: string;
}) {
  const srcs: string[] = useHttpLocations(logoURI);

  return <StyledListLogo alt={alt} size={size} srcs={srcs} style={style} />;
}

const mapping: { [key: number]: string } = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.POLYGON_ZKEVM]: 'polygonzkevm',
  [ChainId.CRONOS]: 'cronos',
  [ChainId.CRONOS_ZKEVM]: 'cronoszkevm',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ZKSYNC]: 'zksync',
  [ChainId.BASE]: 'base',
  [ChainId.LINEA]: 'linea',
  [ChainId.OPBNB]: 'opbnb',
};

export const chainName: { [key: number]: string } = {
  [ChainId.BSC]: '',
  [ChainId.ETHEREUM]: 'eth',
  [ChainId.POLYGON_ZKEVM]: 'polygon-zkevm',
  [ChainId.CRONOS]: 'cronos',
  [ChainId.CRONOS_ZKEVM]: 'cronos-zkevm',
  [ChainId.CRONOS_ZKEVM_TESTNET]: 'cronos-zkevm-testnet',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ZKSYNC]: 'zksync',
  [ChainId.LINEA]: 'linea',
  [ChainId.BASE]: 'base',
  [ChainId.OPBNB]: 'opbnb',
};

const commonCurrencySymbols = [
  ethereumTokens.usdt,
  ethereumTokens.usdc,
  bscTokens.cake,
  bscTokens.usdv,
  ethereumTokens.wbtc,
  ethereumTokens.weth,
  NATIVE[ChainId.CRONOS],
  bscTokens.busd,
  ethereumTokens.dai,
  cronosTokens.usdc,
  cronosTokens.frtn,
  cronosZkEvmTokens.wcro,
  cronosZkEvmTokens.frtn,
  cronosZkEvmTokens.vusd,
  cronosZkEvmTokens.veth,
].map(({ symbol }) => symbol);

export const getTokenListTokenUrl = (token: Pick<Token, 'chainId' | 'address' | 'symbol'>) =>
  Object.keys(chainName).includes(String(token.chainId))
    ? `https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${chainName[token.chainId]}/${token.address.toLowerCase()}.webp`
    : null;

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && mapping[chainId]) {
      return `https://assets-cdn.trustwallet.com/blockchains/${mapping[chainId]}/assets/${getAddress(
        address,
      )}/logo.png`;
    }
    return null;
  },
  (address, chainId) => `${chainId}#${address}`,
);

export const getCommonCurrencyUrlBySymbol = memoize(
  (symbol?: string): string | undefined =>
    symbol && commonCurrencySymbols.includes(symbol)
      ? `https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${symbol.toLocaleLowerCase()}.webp`
      : undefined,
  (symbol?: string) => `logoUrls#symbol#${symbol}`,
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
    const logoUrl = chainId && address ? getTokenListTokenUrl({ chainId, address, symbol }) : null;
    return [getCommonCurrencyUrlBySymbol(symbol), useTrustWallet ? trustWalletLogo : undefined, logoUrl].filter(
      (url): url is string => !!url,
    );
  },
  (currency, options) =>
    `logoUrls#${currency?.chainId}#${currency?.symbol}#${currency?.address}#${options ? JSON.stringify(options) : ''}`,
);

interface DoubleCurrencyLogoProps {
  margin?: boolean;
  size?: number;
  currency0?: Currency;
  currency1?: Currency;
}

export function DoubleCurrencyLogo({ currency0, currency1, size = 20, margin = false }: DoubleCurrencyLogoProps) {
  return (
    <Flex direction="row" me={2}>
      {currency0 && <CurrencyLogo currency={currency0} size={`${size.toString()}px`} style={{ marginRight: '4px' }} />}
      {currency1 && <CurrencyLogo currency={currency1} size={`${size.toString()}px`} />}
    </Flex>
  );
}

interface DoubleCurrencyLayeredLogoProps {
  address1: string;
  address2: string;
  chainId?: number;
  size1?: number;
  size2?: number;
  variant?: 'horizontal' | 'diagonal';
}

export function DoubleCurrencyLayeredLogo({
  address1,
  address2,
  chainId,
  size1 = 24,
  size2 = 32,
  variant,
}: DoubleCurrencyLayeredLogoProps) {
  const currency1: CurrencyInfo = useMemo(() => {
    const isNative = address1 === ethers.constants.AddressZero;
    const nativeSymbol = NATIVE[chainId as ChainId]?.symbol ?? '';

    return {
      address: address1 as Address,
      chainId,
      symbol: isNative ? nativeSymbol : '',
      isToken: !isNative,
      isNative,
    };
  }, [address1]);

  const currency2: CurrencyInfo = useMemo(() => {
    const isNative = address2 === ethers.constants.AddressZero;
    const nativeSymbol = NATIVE[chainId as ChainId]?.symbol ?? '';

    return {
      address: address2 as Address,
      chainId,
      symbol: isNative ? nativeSymbol : '',
      isToken: !isNative,
      isNative,
    };
  }, [address2]);

  return (
    <Box position="relative" w={`40px`} h={`${variant === 'diagonal' ? 40 : 24}px`}>
      <CurrencyLogo currency={currency1} size={`${size1}px`} />
      <CurrencyLogo
        currency={currency2}
        size={`${size2}px`}
        position="absolute"
        bottom={variant === 'diagonal' ? 0 : undefined}
        top={variant !== 'diagonal' ? 0 : undefined}
        right={0}
      />

      {/*<Avatar*/}
      {/*  src={`https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${info.row.original.data.pair.token0.symbol.toLowerCase()}.webp`}*/}
      {/*  rounded='full'*/}
      {/*  size='xs'*/}
      {/*/>*/}
      {/*<Avatar*/}
      {/*  src={`https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${info.row.original.data.pair.token1.symbol.toLowerCase()}.webp`}*/}
      {/*  rounded='full'*/}
      {/*  size='sm'*/}
      {/*  position='absolute'*/}
      {/*  bottom={0}*/}
      {/*  right={0}*/}
      {/*/>*/}
    </Box>
  );
}
