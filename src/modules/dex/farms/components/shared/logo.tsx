import {WrappedTokenInfo} from "@dex/hooks/use-supported-tokens";
import {Image} from "@chakra-ui/react";
import React, {useMemo, useState} from "react";
import {QuestionOutlineIcon} from "@chakra-ui/icons";

const getTokenLogoURL = (address: string) => {
  return `https://dd.dexscreener.com/ds-data/tokens/cronos/${address}.png?size=sm`;
}

export function CurrencyLogo({currency, size = '24px', style}: { currency?: Currency; size?: string; style?: React.CSSProperties}) {
  // const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined);
  //
  // const srcs: string[] = useMemo(() => {
  //   if (currency === ETHER) return [];
  //
  //   if (currency instanceof Token) {
  //     if (currency instanceof WrappedTokenInfo) {
  //       return [...uriLocations, getTokenLogoURL(currency.address)];
  //     }
  //
  //     return [getTokenLogoURL(currency.address)];
  //   }
  //   return [];
  // }, [currency, uriLocations]);

  // if (currency === ETHER) {
  //   return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />;
  // }
  //
  // if (currency?.symbol?.toLowerCase() === 'wcro') {
  //   return <StyledEthereumLogo src={WcroLogo} size={size} style={style} />;
  // }
  //
  // if (currency?.symbol?.toLowerCase() === 'usdc') {
  //   return <StyledEthereumLogo src={UsdcLogo} size={size} style={style} />;
  // }

  return <Logo src={currency instanceof WrappedTokenInfo ? currency.logoURI : undefined} alt={`${currency?.symbol ?? 'token'} logo`} />;
}

interface LogoProps {
  src?: string;
  alt: string;
}

export function Logo({ src, alt }: LogoProps) {
  if (!!src && !BAD_SRCS[src]) {
    return <Image src={src} w='30px' alt={alt} rounded='full' />;
  }

  return <QuestionOutlineIcon />;
}

const BAD_SRCS: { [tokenAddress: string]: true } = {};

export function PairLogo({ pair }: { pair: Token[] }) {
  const [srcs, setSrcs] = useState<string[]>([]);

  useMemo(() => {
    const newSrcs = pair.map((token) => getTokenLogoURL(token.address));
    setSrcs(newSrcs);
  }, [pair]);

  return <Logo src={srcs[0]} alt='Pair logo' />;
}