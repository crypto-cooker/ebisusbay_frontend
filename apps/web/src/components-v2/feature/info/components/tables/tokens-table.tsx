import { Box, Flex, Skeleton, Text } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  useChainIdByQuery,
  useChainPathByQuery,
} from '@src/components-v2/feature/info/hooks/chain';
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers';
import styled from 'styled-components';
import { TokenData } from '@src/components-v2/feature/info/state/types';
import { ITEMS_PER_INFO_TABLE_PAGE } from '@src/components-v2/feature/info/state/constants';
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from '@src/components-v2/feature/info/components/tables/shared';
import { Card } from '@src/components-v2/foundation/card';
import { CurrencyLogoByAddress } from '@dex/components/logo';
import { HStack } from '@chakra-ui/react';
import { useUserTheme } from '@src/components-v2/useUser';
import DecimalAbbreviatedNumber from "@src/components-v2/shared/decimal-abbreviated-number";

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 30px 1.5fr repeat(4, 1fr);

  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 30px 1.5fr repeat(2, 1fr);
    & :nth-child(4),
    & :nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 30px 1.5fr repeat(1, 1fr);
    & :nth-child(4),
    & :nth-child(5),
    & :nth-child(6),
    & :nth-child(7) {
      display: none;
    }
  }
  @media screen and (max-width: 480px) {
    grid-template-columns: 2.5fr repeat(1, 1fr);
    > *:nth-child(1) {
      display: none;
    }
  }
  &:hover {
    color: #cccccc;
  }
`;

const LinkWrapper = styled(Link)`
  text-decoration: none;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

const SORT_FIELD = {
  priceUSD: 'priceUSD',
  priceChange: 'priceChange',
  volumeUSD24h: 'volumeUSD24h',
  totalLiquidityUSD: 'totalLiquidityUSD',
};

const LoadingRow: React.FC<React.PropsWithChildren> = () => (
  <ResponsiveGrid>
    <Skeleton width="full" height="20px" />
    <Skeleton width="full" height="20px" />
    <Skeleton width="full" height="20px" />
    <Skeleton width="full" height="20px" />
    <Skeleton width="full" height="20px" />
    <Skeleton width="full" height="20px" />
  </ResponsiveGrid>
);

const TableLoader: React.FC<React.PropsWithChildren> = () => (
  <>
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </>
);

const DataRow = ({ TokenData, index }: { TokenData: TokenData; index: number }) => {
  const chainId = useChainIdByQuery();
  const chainPath = useChainPathByQuery();
  const symbol = TokenData.symbol;
  const theme = useUserTheme()
  const color = TokenData.priceChange < 0 ? theme.colors.failure : theme.colors.success;

  return (
    <LinkWrapper href={`/info${chainPath}/tokens/${TokenData.id}`}>
      <ResponsiveGrid>
        <Text>{index + 1}</Text>
        <Flex>
          <HStack display={{ base: 'none', md: 'flex' }}>
            <CurrencyLogoByAddress size="20px" address={TokenData.id} chainId={chainId} />
          </HStack>
          <Text ml="8px">{symbol}</Text>
        </Flex>
        <DecimalAbbreviatedNumber value={TokenData.priceUSD} />
        <Text color={color}>{formatAmount(TokenData.priceChange)}%</Text>
        <Text>${formatAmount(TokenData.volumeUSD24h)}</Text>
        <Text>${formatAmount(TokenData.totalLiquidityUSD)}</Text>
      </ResponsiveGrid>
    </LinkWrapper>
  );
};

interface TokenTableProps {
  tokenDatas: (TokenData | undefined)[];
  loading?: boolean; // If true shows indication that SOME pools are loading, but the ones already fetched will be shown
}

const TokenTable: React.FC<React.PropsWithChildren<TokenTableProps>> = ({ tokenDatas, loading }) => {
  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD24h);
  const [sortDirection, setSortDirection] = useState<boolean>(true);

  // pagination
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  useEffect(() => {
    let extraPages = 1;
    if (tokenDatas.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
      extraPages = 0;
    }
    setMaxPage(Math.floor(tokenDatas.length / ITEMS_PER_INFO_TABLE_PAGE) + extraPages);
  }, [tokenDatas]);
  const sortedTokens = useMemo(() => {
    return tokenDatas
      ? tokenDatas
          .sort((a, b) => {
            if (a && b) {
              const aElement = a[sortField as keyof TokenData];
              const bElement = b[sortField as keyof TokenData];
              const predicate = aElement !== undefined && bElement !== undefined ? aElement > bElement : false;
              return predicate ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1;
            }
            return -1;
          })
          .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : [];
  }, [page, tokenDatas, sortDirection, sortField]);

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField);
      setSortDirection(sortField !== newField ? true : !sortDirection);
    },
    [sortDirection, sortField],
  );

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓';
      return sortField === field ? directionArrow : '';
    },
    [sortDirection, sortField],
  );

  return (
    <Card>
      <TableWrapper>
        <ResponsiveGrid>
          <Text color="secondary" fontSize="12px" fontWeight="bold">
            #
          </Text>
          <Text color="secondary" fontSize="12px" fontWeight="bold" textTransform="uppercase">
            Tokens
          </Text>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            onClick={() => handleSort(SORT_FIELD.priceUSD)}
            textTransform="uppercase"
          >
            {'Price'} {arrow(SORT_FIELD.priceUSD)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            onClick={() => handleSort(SORT_FIELD.priceChange)}
            textTransform="uppercase"
          >
            {'Price Change'} {arrow(SORT_FIELD.priceChange)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            onClick={() => handleSort(SORT_FIELD.volumeUSD24h)}
            textTransform="uppercase"
          >
            {'Volume 24H'} {arrow(SORT_FIELD.volumeUSD24h)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            onClick={() => handleSort(SORT_FIELD.totalLiquidityUSD)}
            textTransform="uppercase"
          >
            {'Liquidity'} {arrow(SORT_FIELD.totalLiquidityUSD)}
          </ClickableColumnHeader>
        </ResponsiveGrid>
        <Break />
        {sortedTokens.length > 0 ? (
          <>
            {sortedTokens.map((tokenData, i) => {
              if (tokenData) {
                return (
                  <Fragment key={tokenData.id}>
                    <DataRow index={(page - 1) * ITEMS_PER_INFO_TABLE_PAGE + i} TokenData={tokenData} />
                    <Break />
                  </Fragment>
                );
              }
              return null;
            })}
            {loading && <LoadingRow />}
            <PageButtons>
              <Arrow
                onClick={() => {
                  setPage(page === 1 ? page : page - 1);
                }}
              >
                <ArrowBackIcon color={page === 1 ? '' : '#1E7EE6'} />
              </Arrow>

              <Text>{`Page ${page} of ${maxPage}`}</Text>

              <Arrow
                onClick={() => {
                  setPage(page === maxPage ? page : page + 1);
                }}
              >
                <ArrowForwardIcon color={page === maxPage ? '' : '#1E7EE6'} />
              </Arrow>
            </PageButtons>
          </>
        ) : (
          <>
            <TableLoader />
            {/* spacer */}
            <Box />
          </>
        )}
      </TableWrapper>
    </Card>
  );
};

export default TokenTable;
