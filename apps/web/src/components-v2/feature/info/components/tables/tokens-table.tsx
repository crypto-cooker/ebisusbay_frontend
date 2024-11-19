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
import { breakpoints } from '@src/global/theme/break-points';
import { FilterOptionButton } from '@src/components-v2/feature/info/components/tables/shared';
import useMatchBreakpoints from '@src/global/hooks/use-match-breakpoints';


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
  priceUSD: 'priceUSD',
  priceChange: 'priceChange',
  volumeUSD24h: 'volumeUSD24h',
  totalLiquidityUSD: 'totalLiquidityUSD',
};

const FILTER_HEAD ={
  priceUSD: 'Price',
  priceChange: 'Price Change',
  volumeUSD24h: 'Volume 24H',
  totalLiquidityUSD: 'Liquidity',
}

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

const DataRow = ({ TokenData, index, filter }: { TokenData: TokenData; index: number, filter: string }) => {
  const chainId = useChainIdByQuery();
  const chainPath = useChainPathByQuery();
  const symbol = TokenData.symbol;
  const theme = useUserTheme()
  const color = TokenData.priceChange < 0 ? theme.colors.failure : theme.colors.success;
  const getStyledAmount = (filter: string) => {
    if (filter.includes(SORT_FIELD.priceChange)) {
      return `${formatAmount(TokenData[filter as keyof TokenData] as number)}%`;
    } else return `$${formatAmount(TokenData[filter as keyof TokenData] as number)}`;
  };


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
        <DecimalAbbreviatedNumber value={getStyledAmount(filter)} />
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
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>(SORT_FIELD.priceUSD);

  // for responsive breakpoints
  const { isXxs, isSm, isXs, isMd, isLg, isXl, isXxl } = useMatchBreakpoints();

  useEffect(() => {
    if (isLg) {
      setFilterOptions([SORT_FIELD.totalLiquidityUSD]);
      setFilter(SORT_FIELD.priceUSD);
    } else if (isMd) {
      setFilterOptions([SORT_FIELD.volumeUSD24h, SORT_FIELD.totalLiquidityUSD]);
      setFilter(SORT_FIELD.priceUSD);
    } else if (isSm || isXs || isXxs) {
      setFilterOptions([SORT_FIELD.priceChange, SORT_FIELD.volumeUSD24h, SORT_FIELD.totalLiquidityUSD]);
    } else setFilterOptions([]);
  }, [isXxs, isSm, isXs, isMd, isLg, isXl, isXxl]);

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
          <HStack>
            <ClickableColumnHeader
              color="secondary"
              fontSize="12px"
              onClick={() => handleSort(SORT_FIELD.priceUSD)}
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
                    <DataRow index={(page - 1) * ITEMS_PER_INFO_TABLE_PAGE + i} TokenData={tokenData} filter={filter}/>
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
