import { Currency } from '@pancakeswap/sdk'
import { CSSProperties, ReactElement } from "react";
import { BaseCurrency } from "@pancakeswap/swap-sdk-core";
import styled from "styled-components";
import {Box, Button, Flex, HStack, Text, useBreakpointValue, VStack} from "@chakra-ui/react";
import {CurrencyLogo, ListLogo} from "@dex/components/logo";

// const TokenSection = styled.div<{ dim?: boolean }>`
//   padding: 4px 20px;
//   height: 56px;
//   display: grid;
//   grid-template-columns: auto minmax(auto, 1fr) auto;
//   grid-gap: 10px;
//   align-items: center;
//
//   opacity: ${({ dim }) => (dim ? "0.4" : "1")};
//
//   ${({ theme }) => theme.mediaQueries.md} {
//     grid-gap: 16px;
//   }
// `;

const NameOverflow = styled(Flex)`
  white-space: nowrap;
  overflow: hidden;
  align-items: center;
  text-overflow: ellipsis;
  max-width: 210px;
  gap: 8px;
`;

interface CurrencyLogoPropsType<T> {
  currency?: T;
  size?: string;
  style?: React.CSSProperties;
}

function TokenRowWithCurrencyLogo<T extends BaseCurrency>(
  CurrencyLogo: (props: CurrencyLogoPropsType<T>) => ReactElement
) {
  return ({
            token,
            style,
            dim,
            onCurrencySelect,
            list,
            isActive,
            children,
          }: {
    token: T;
    style?: CSSProperties;
    dim?: boolean;
    onCurrencySelect?: (currency: T) => void;
    list: any;
    isActive: boolean;
    children: ReactElement;
  }) => {
    const isMobile = useBreakpointValue({base: true, sm: false}, {fallback: 'sm'});

    return (
      <Flex
        justify='space-between'
        style={style}
      >
        <HStack>
          <CurrencyLogo currency={token} size={isMobile ? "20px" : "24px"} style={{ opacity: dim ? "0.6" : "1" }} />
          <VStack align='stretch' style={{ opacity: dim ? "0.6" : "1" }}>
            <HStack>
              <NameOverflow title={token.name}>
                {token.symbol}
                <Text className="text-muted" fontSize="12px">
                  {token.name}
                </Text>
              </NameOverflow>
            </HStack>
            {list && list.logoURI && (
              <HStack>
                <Text fontSize={isMobile ? "10px" : "14px"} mr="4px" color="textSubtle">
                  via {list.name}
                </Text>
                <ListLogo logoURI={list.logoURI} size="12px" />
              </HStack>
            )}
          </VStack>
        </HStack>
        {children}
      </Flex>
    );
  };
}

export default TokenRowWithCurrencyLogo<Currency>(CurrencyLogo)
