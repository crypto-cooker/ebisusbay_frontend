import { Box, Flex, Skeleton, Text, useDisclosure } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import Link from 'next/link';
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
import {
  Arrow,
  Break,
  ClickableColumnHeader,
  PageButtons,
  TableWrapper,
} from '@src/components-v2/feature/info/components/tables/shared';
import { Card } from '@src/components-v2/foundation/card';
import { CurrencyLogoByAddress } from '@dex/components/logo';
import { HStack } from '@chakra-ui/react';
import useMatchBreakpoints from '@src/global/hooks/use-match-breakpoints';
import { breakpoints } from '@src/global/theme/break-points';
import { FilterOptionButton } from '@src/components-v2/feature/info/components/tables/shared';

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 30px 2fr repeat(4, 1fr);

  padding: 0 24px;
  @media screen and (max-width: ${breakpoints.lg}px) {
    grid-template-columns: 30px 1.5fr repeat(3, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }
  @media screen and (max-width: ${breakpoints.md}px) {
    grid-template-columns: 30px 1.5fr repeat(2, 1fr);
    & :nth-child(5),
    & :nth-child(6) {
      display: none;
    }
  }
  @media screen and (max-width: ${breakpoints.sm}px) {
    grid-template-columns: 30px 1.5fr repeat(1, 1fr);
    & :nth-child(4),
    & :nth-child(5),
    & :nth-child(6) {
      display: none;
    }
  }
  @media screen and (max-width: ${breakpoints.xs}px) {
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
    opacity: 0.6;
  }
`;

const SORT_FIELD = {
  dailyVolumeUSD: 'dailyVolumeUSD',
  liquidityUSD: 'liquidityUSD',
  lpFees24h: 'lpFees24h',
  lpApr24h: 'lpApr24h',
};

const FILTER_HEAD = {
  dailyVolumeUSD: 'Volume 24H',
  liquidityUSD: 'Liquidity',
  lpFees24h: 'LP reward fees 24H',
  lpApr24h: 'LP reward APR',
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

const DataRow = ({ PairData, index, filter }: { PairData: PairData; index: number; filter: any }) => {
  const chainName = useChainNameByQuery();
  const chainId = useChainIdByQuery();
  const chainPath = useChainPathByQuery();
  const token0symbol = PairData.token0.symbol;
  const token1symbol = PairData.token1.symbol;

  const getStyledAmount = (filter: string) => {
    if (filter.includes(SORT_FIELD.lpApr24h)) {
      return `${formatAmount(PairData[filter as keyof PairData] as number)}%`;
    } else return `$${formatAmount(PairData[filter as keyof PairData] as number)}`;
  };

  return (
    <LinkWrapper href={`/info${chainPath}/pairs/${PairData.id}`}>
      <ResponsiveGrid>
        <Text>{index + 1}</Text>
        <Flex>
          <HStack display={{ base: 'none', md: 'flex' }}>
            <CurrencyLogoByAddress size="20px" address={PairData.token0.address} chainId={chainId} />
            <CurrencyLogoByAddress size="20px" address={PairData.token1.address} chainId={chainId} />
          </HStack>
          <Text ml="8px">
            {token0symbol}/{token1symbol}
          </Text>
        </Flex>
        <Text>{getStyledAmount(filter)}</Text>
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
  const [sortField, setSortField] = useState(SORT_FIELD.dailyVolumeUSD);
  const [sortDirection, setSortDirection] = useState<boolean>(true);
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>(SORT_FIELD.dailyVolumeUSD);

  // for responsive breakpoints
  const { isXxs, isSm, isXs, isMd, isLg, isXl, isXxl } = useMatchBreakpoints();

  useEffect(() => {
    if (isLg) {
      setFilterOptions([SORT_FIELD.liquidityUSD]);
      setFilter(SORT_FIELD.dailyVolumeUSD);
    } else if (isMd) {
      setFilterOptions([SORT_FIELD.lpApr24h, SORT_FIELD.liquidityUSD]);
      setFilter(SORT_FIELD.dailyVolumeUSD);
    } else if (isSm || isXs || isXxs) {
      setFilterOptions([SORT_FIELD.lpFees24h, SORT_FIELD.lpApr24h, SORT_FIELD.liquidityUSD]);
    } else setFilterOptions([]);
  }, [isXxs, isSm, isXs, isMd, isLg, isXl, isXxl]);

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
          <Text color="secondary" fontSize="12px" fontWeight="bold">
            #
          </Text>
          <Text color="secondary" fontSize="12px" fontWeight="bold" textTransform="uppercase">
            Pair
          </Text>
          <HStack>
            <ClickableColumnHeader
              color="secondary"
              fontSize="12px"
              onClick={() => handleSort(SORT_FIELD.dailyVolumeUSD)}
              textTransform="uppercase"
            >
              {FILTER_HEAD[filter as keyof typeof FILTER_HEAD]} {arrow(SORT_FIELD[filter as keyof typeof FILTER_HEAD])}
            </ClickableColumnHeader>
            {filterOptions.length > 0 && (
              <FilterOptionButton
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                setFilter={setFilter}
                filterHead={FILTER_HEAD}
              />
            )}
          </HStack>
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
                    <DataRow index={(page - 1) * ITEMS_PER_INFO_TABLE_PAGE + i} PairData={PairData} filter={filter} />
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
