import { ArrowBackIcon, ArrowForwardIcon, Box, Flex, Skeleton, Text } from '@pancakeswap/uikit';
import { NextLinkFromReactRouter } from '@src/components-v2/foundation/button';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  useChainIdByQuery,
  useChainNameByQuery,
  useChainPathByQuery,
} from '@src/components-v2/feature/info/hooks/chain';
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers';
import styled from 'styled-components';
import { TokenData } from '@src/components-v2/feature/info/state/types';
import { ITEMS_PER_INFO_TABLE_PAGE } from '../../state/constants';
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from './shared';
import { Card } from '@src/components-v2/foundation/card';
import { CurrencyLogo, CurrencyLogoByAddress, DoubleCurrencyLogo } from '@dex/components/logo';
import { useCurrency } from '@dex/swap/imported/pancakeswap/web/hooks/tokens';
import { HStack } from '@chakra-ui/react';

/**
 *  Columns on different layouts
 *  5 = | # | Pool | TVL | Volume 24H | Volume 7D |
 *  4 = | # | Pool |     | Volume 24H | Volume 7D |
 *  3 = | # | Pool |     | Volume 24H |           |
 *  2 = |   | Pool |     | Volume 24H |           |
 */
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 3.5fr repeat(4, 1fr);

  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(2, 1fr);
    & :nth-child(4),
    & :nth-child(5)
     {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 1.5fr repeat(1, 1fr);
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
`;

const LinkWrapper = styled(NextLinkFromReactRouter)`
  text-decoration: none;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

const SORT_FIELD = {
  volumeUSD: 'volumeUSD',
  liquidityUSD: 'liquidityUSD',
  lpFees24h: 'lpFees24h',
  lpApr7d: 'lpApr24h',
};

const LoadingRow: React.FC<React.PropsWithChildren> = () => (
  <ResponsiveGrid>
    {/* <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton /> */}
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
  const chainName = useChainNameByQuery();
  const chainId = useChainIdByQuery();
  const chainPath = useChainPathByQuery();
  const token0symbol = TokenData.token0.symbol;
  const token1symbol = TokenData.token1.symbol;

  return (
    <LinkWrapper to={`/info${chainPath}/pairs/${TokenData.pairAddress}`}>
      <ResponsiveGrid>
        <Text>{index + 1}</Text>
        <Flex>
          <HStack display={{base: 'none', md: 'flex'}}>
            <CurrencyLogoByAddress address={TokenData.token0.address} chainId={chainId} />
            <CurrencyLogoByAddress address={TokenData.token1.address} chainId={chainId} />
          </HStack>
          <Text ml="8px">
            {token0symbol}/{token1symbol}
          </Text>
        </Flex>
        <Text>${formatAmount(TokenData.dailyVolumeUSD)}</Text>
        <Text>${formatAmount(TokenData.lpFees24h)}</Text>
        <Text>{formatAmount(TokenData.lpApr24h)}%</Text>
        <Text>${formatAmount(TokenData.liquidityUSD)}</Text>
      </ResponsiveGrid>
    </LinkWrapper>
  );
};

interface PairTableProps {
  TokenDatas: (TokenData | undefined)[];
  loading?: boolean; // If true shows indication that SOME pools are loading, but the ones already fetched will be shown
}

const PairTable: React.FC<React.PropsWithChildren<PairTableProps>> = ({ TokenDatas, loading }) => {
  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD);
  const [sortDirection, setSortDirection] = useState<boolean>(true);

  // pagination
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  useEffect(() => {
    let extraPages = 1;
    if (TokenDatas.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
      extraPages = 0;
    }
    setMaxPage(Math.floor(TokenDatas.length / ITEMS_PER_INFO_TABLE_PAGE) + extraPages);
  }, [TokenDatas]);
  const sortedPools = useMemo(() => {
    return TokenDatas
      ? TokenDatas
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
  }, [page, TokenDatas, sortDirection, sortField]);

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
          <Text color="secondary" fontSize="12px" bold>
            #
          </Text>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            Pair
          </Text>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.volumeUSD)}
            textTransform="uppercase"
          >
            {'Volume 24H'} {arrow(SORT_FIELD.volumeUSD)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.lpFees24h)}
            textTransform="uppercase"
          >
            {'LP reward fees 24H'} {arrow(SORT_FIELD.lpFees24h)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.lpApr7d)}
            textTransform="uppercase"
          >
            {'LP reward APR'} {arrow(SORT_FIELD.lpApr7d)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.liquidityUSD)}
            textTransform="uppercase"
          >
            {'Liquidity'} {arrow(SORT_FIELD.liquidityUSD)}
          </ClickableColumnHeader>
        </ResponsiveGrid>
        <Break />
        {sortedPools.length > 0 ? (
          <>
            {sortedPools.map((TokenData, i) => {
              if (TokenData) {
                return (
                  <Fragment key={TokenData.pairAddress}>
                    <DataRow index={(page - 1) * ITEMS_PER_INFO_TABLE_PAGE + i} TokenData={TokenData} />
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
                <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>

              <Text>{`Page ${page} of ${maxPage}`}</Text>

              <Arrow
                onClick={() => {
                  setPage(page === maxPage ? page : page + 1);
                }}
              >
                <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
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

export default PairTable;
