import {Box, Flex, Skeleton, Text } from '@chakra-ui/react';
import {ArrowBackIcon, ArrowForwardIcon} from '@chakra-ui/icons'
import { NextLinkFromReactRouter } from '@src/components-v2/foundation/button';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  useChainIdByQuery,
  useChainNameByQuery,
  useChainPathByQuery,
} from '@src/components-v2/feature/info/hooks/chain';
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers';
import styled from 'styled-components';
import { PairData } from '@src/components-v2/feature/info/state/types';
import { ITEMS_PER_INFO_TABLE_PAGE } from '@src/components-v2/feature/info/state/constants';
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
  grid-template-columns: 30px 2fr repeat(4, 1fr);

  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 30px 1.5fr repeat(2, 1fr);
    & :nth-child(4),
    & :nth-child(5)
     {
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
`;

const LinkWrapper = styled(NextLinkFromReactRouter)`
  text-decoration: none;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const SORT_FIELD = {
  volumeUSD: 'volumeUSD',
  liquidityUSD: 'liquidityUSD',
  lpFees24h: 'lpFees24h',
  lpApr24h: 'lpApr24h',
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

const DataRow = ({ PairData, index }: { PairData: PairData; index: number }) => {
  const chainName = useChainNameByQuery();
  const chainId = useChainIdByQuery();
  const chainPath = useChainPathByQuery();
  const token0symbol = PairData.token0.symbol;
  const token1symbol = PairData.token1.symbol;

  return (
    <LinkWrapper to={`/info${chainPath}/pairs/${PairData.id}`}>
      <ResponsiveGrid>
        <Text>{index + 1}</Text>
        <Flex>
          <HStack display={{base: 'none', md: 'flex'}}>
            <CurrencyLogoByAddress size='20px' address={PairData.token0.address} chainId={chainId} />
            <CurrencyLogoByAddress size='20px' address={PairData.token1.address} chainId={chainId} />
          </HStack>
          <Text ml="8px">
            {token0symbol}/{token1symbol}
          </Text>
        </Flex>
        <Text>${formatAmount(PairData.dailyVolumeUSD)}</Text>
        <Text>${formatAmount(PairData.lpFees24h)}</Text>
        <Text>{formatAmount(PairData.lpApr24h)}%</Text>
        <Text>${formatAmount(PairData.liquidityUSD)}</Text>
      </ResponsiveGrid>
    </LinkWrapper>
  );
};

interface PairTableProps {
  pairDatas: (PairData | undefined)[];
  loading?: boolean; // If true shows indication that SOME pools are loading, but the ones already fetched will be shown
}

const PairTable: React.FC<React.PropsWithChildren<PairTableProps>> = ({ pairDatas, loading }) => {
  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD);
  const [sortDirection, setSortDirection] = useState<boolean>(true);

  // pagination
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  useEffect(() => {
    let extraPages = 1;
    if (pairDatas.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
      extraPages = 0;
    }
    setMaxPage(Math.floor(pairDatas.length / ITEMS_PER_INFO_TABLE_PAGE) + extraPages);
  }, [pairDatas]);
  const sortedPools = useMemo(() => {
    return pairDatas
      ? pairDatas
          .sort((a, b) => {
            if (a && b) {
              const aElement = a[sortField as keyof PairData];
              const bElement = b[sortField as keyof PairData];
              const predicate = aElement !== undefined && bElement !== undefined ? aElement > bElement : false;
              return predicate ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1;
            }
            return -1;
          })
          .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : [];
  }, [page, pairDatas, sortDirection, sortField]);

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
          <Text color="secondary" fontSize="12px" fontWeight='bold'>
            #
          </Text>
          <Text color="secondary" fontSize="12px" fontWeight='bold' textTransform="uppercase">
            Pair
          </Text>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            onClick={() => handleSort(SORT_FIELD.volumeUSD)}
            textTransform="uppercase"
          >
            {'Volume 24H'} {arrow(SORT_FIELD.volumeUSD)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            onClick={() => handleSort(SORT_FIELD.lpFees24h)}
            textTransform="uppercase"
          >
            {'LP reward fees 24H'} {arrow(SORT_FIELD.lpFees24h)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            onClick={() => handleSort(SORT_FIELD.lpApr24h)}
            textTransform="uppercase"
          >
            {'LP reward APR'} {arrow(SORT_FIELD.lpApr24h)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            onClick={() => handleSort(SORT_FIELD.liquidityUSD)}
            textTransform="uppercase"
          >
            {'Liquidity'} {arrow(SORT_FIELD.liquidityUSD)}
          </ClickableColumnHeader>
        </ResponsiveGrid>
        <Break />
        {sortedPools.length > 0 ? (
          <>
            {sortedPools.map((PairData, i) => {
              if (PairData) {
                return (
                  <Fragment key={PairData.id}>
                    <DataRow index={(page - 1) * ITEMS_PER_INFO_TABLE_PAGE + i} PairData={PairData} />
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

export default PairTable;
