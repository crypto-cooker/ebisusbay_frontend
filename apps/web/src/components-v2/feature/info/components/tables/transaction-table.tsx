// TODO PCS refactor ternaries
/* eslint-disable no-nested-ternary */
import { Box, Flex, HStack, Radio, RadioGroup, Skeleton, Stack, Text } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import truncateHash from '@pancakeswap/utils/truncateHash';
import { ITEMS_PER_INFO_TABLE_PAGE } from '../../state/constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useChainIdByQuery } from '../../hooks/chain';
import { Transaction, TransactionType } from '../../state/types';
import styled from 'styled-components';
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers';
import { Arrow, Break, ClickableColumnHeader, FilterOptionButton, PageButtons, TableWrapper } from './shared';
import { CHAINS } from '@src/config/chains';
import { Link } from '@chakra-ui/react';
import { Card } from '@src/components-v2/foundation/card';
import { breakpoints } from '@src/global/theme/break-points';
import useMatchBreakpoints from '@src/global/hooks/use-match-breakpoints';
dayjs.extend(relativeTime);

const Wrapper = styled.div`
  width: 100%;
`;

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 2fr 0.8fr repeat(4, 1fr);
  padding: 0 24px;
  @media screen and (max-width: ${breakpoints.lg}px) {
    grid-template-columns: 2fr repeat(3, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
  }
  @media screen and (max-width: ${breakpoints.md}px) {
    grid-template-columns: 2fr repeat(2, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
  }
  @media screen and (max-width: ${breakpoints.sm}px) {
    grid-template-columns: 2fr 1fr;
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(2) {
      display: none;
    }
  }
`;

const RadioContainer = styled(RadioGroup)`
  align-items: center;
  margin-right: 16px;
  margin-top: 8px;
  cursor: pointer;
`;

const SORT_FIELD = {
  amountUSD: 'amountUSD',
  timestamp: 'timestamp',
  sender: 'sender',
  amountToken0: 'amountToken0',
  amountToken1: 'amountToken1',
};

const FILTER_HEAD = {
  amountUSD: 'Total Value',
  timestamp: 'Time',
  sender: 'Account',
  amountToken0: 'Token Amount',
  amountToken1: 'Token Amount',
};

const TableLoader: React.FC<React.PropsWithChildren> = () => {
  const loadingRow = (
    <ResponsiveGrid>
      <Skeleton width="full" height="20px" />
      <Skeleton width="full" height="20px" />
      <Skeleton width="full" height="20px" />
      <Skeleton width="full" height="20px" />
      <Skeleton width="full" height="20px" />
      <Skeleton width="full" height="20px" />
    </ResponsiveGrid>
  );
  return (
    <>
      {loadingRow}
      {loadingRow}
      {loadingRow}
    </>
  );
};

const DataRow: React.FC<React.PropsWithChildren<{ transaction: Transaction; filter: string }>> = ({
  transaction,
  filter,
}) => {
  const abs0 = Math.abs(transaction.amountToken0);
  const abs1 = Math.abs(transaction.amountToken1);
  const chainId = useChainIdByQuery();
  // const { domainName } = useDomainNameForAddress(transaction.sender);
  const token0Symbol = transaction.token0Symbol;
  const token1Symbol = transaction.token1Symbol;

  const outputTokenSymbol = transaction.amountToken0 < 0 ? token0Symbol : token1Symbol;
  const inputTokenSymbol = transaction.amountToken1 < 0 ? token1Symbol : token0Symbol;

  const getStyledValue = (filter: string) => {
    if (filter.includes(SORT_FIELD.amountUSD)) {
      return <Text>{`$${formatAmount(transaction[filter as keyof Transaction] as number)}`}</Text>;
    } else if (filter.includes(SORT_FIELD.amountToken0) || filter.includes(SORT_FIELD.amountToken1)) {
      const abs = filter.includes(SORT_FIELD.amountToken0) ? abs0 : abs1;
      return <Text>{`${formatAmount(abs)} ${token0Symbol}`}</Text>;
    } else if (filter.includes(SORT_FIELD.timestamp)) {
      return <Text>{dayjs.unix(parseInt(transaction.timestamp, 10)).toNow(true)}</Text>;
    } else if (filter.includes(SORT_FIELD.sender)) {
      return (
        <Link href={getBlockExploreLink(transaction.sender, 'address', chainId)} target="_blank">
          {truncateHash(transaction.sender)}
        </Link>
      );
    }
  };
  return (
    <ResponsiveGrid>
      <Link href={getBlockExploreLink(transaction.hash, 'transaction', chainId)} target="_blank">
        <Text>
          {transaction.type === TransactionType.MINT
            ? `Add ${token0Symbol} and ${token1Symbol}`
            : transaction.type === TransactionType.SWAP
              ? `Swap ${inputTokenSymbol} for ${outputTokenSymbol}`
              : `Remove ${token0Symbol} and ${token1Symbol}`}
        </Text>
      </Link>
      <Text>
        <Text>{`$${formatAmount(transaction.amountUSD)}`}</Text>
      </Text>
      <Text>
        <Text>{`${formatAmount(abs0)} ${token0Symbol}`}</Text>
      </Text>
      <Text>
        <Text>{`${formatAmount(abs1)} ${token1Symbol}`}</Text>
      </Text>
      <Link href={getBlockExploreLink(transaction.sender, 'address', chainId)} target="_blank">
        {truncateHash(transaction.sender)}
      </Link>
      {getStyledValue(filter)}
    </ResponsiveGrid>
  );
};

const TransactionTable: React.FC<
  React.PropsWithChildren<{
    transactions: Transaction[] | undefined;
  }>
> = ({ transactions }) => {
  const [sortField, setSortField] = useState(SORT_FIELD.timestamp);
  const [sortDirection, setSortDirection] = useState<boolean>(true);
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>(SORT_FIELD.timestamp);

  // for responsive breakpoints
  const { isXxs, isSm, isXs, isMd, isLg, isXl, isXxl } = useMatchBreakpoints();

  useEffect(() => {
    if (isLg) {
      setFilterOptions([SORT_FIELD.sender]);
      setFilter(SORT_FIELD.timestamp);
    } else if (isMd) {
      setFilterOptions([SORT_FIELD.amountToken0, SORT_FIELD.sender]);
      setFilter(SORT_FIELD.timestamp);
    } else if (isSm || isXs || isXxs) {
      setFilterOptions([SORT_FIELD.amountToken1, SORT_FIELD.amountToken0, SORT_FIELD.sender]);
    } else setFilterOptions([]);
  }, [isXxs, isSm, isXs, isMd, isLg, isXl, isXxl]);

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [txFilter, setTxFilter] = useState<TransactionType | undefined>(undefined);

  const sortedTransactions = useMemo(() => {
    const toBeAbsList = [SORT_FIELD.amountToken0, SORT_FIELD.amountToken1];
    return transactions
      ? [...transactions]
          .sort((a, b) => {
            if (a && b) {
              const firstField = a[sortField as keyof Transaction];
              const secondField = b[sortField as keyof Transaction];
              const [first, second] = toBeAbsList.includes(sortField)
                ? [Math.abs(firstField as number), Math.abs(secondField as number)]
                : [firstField, secondField];
              if (!first || !second) return -1;
              return first > second ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1;
            }
            return -1;
          })
          .filter((x) => {
            return txFilter === undefined || x.type === txFilter;
          })
          .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : [];
  }, [transactions, page, sortField, sortDirection, txFilter]);

  // Update maxPage based on amount of items & applied filtering
  useEffect(() => {
    if (transactions) {
      const filteredTransactions = transactions.filter((tx) => {
        return txFilter === undefined || tx.type === txFilter;
      });
      if (filteredTransactions.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
        setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_INFO_TABLE_PAGE));
      } else {
        setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_INFO_TABLE_PAGE) + 1);
      }
    }
  }, [transactions, txFilter]);

  // const handleFilter = useCallback(
  //   (newFilter: TransactionType | undefined) => {
  //     if (newFilter !== txFilter) {
  //       setTxFilter(newFilter);
  //       setPage(1);
  //     }
  //   },
  //   [txFilter],
  // );

  const handleFilter = useCallback(
    (value: string) => {
      if (Number(value) !== txFilter) {
        const newTxFilter = isNaN(Number(value)) ? undefined : Number(value);
        setTxFilter(newTxFilter);
        setPage(1);
      }
    },
    [txFilter],
  );

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
    <>
      <Flex mb="16px">
        <RadioGroup onChange={handleFilter}>
          <Stack direction="row">
            <Radio value="all">All</Radio>
            <Radio value="0">Swaps</Radio>
            <Radio value="1">Adds</Radio>
            <Radio value="2">Removes</Radio>
          </Stack>
        </RadioGroup>
        {/* <Flex flexDirection={['column', 'row']}>
          <RadioGroup onClick={() => handleFilter(undefined)}>
            <Radio onChange={() => null} scale="sm" checked={txFilter === undefined} />
            <Text ml="8px">All</Text>
          </RadioGroup>

          <RadioGroup onClick={() => handleFilter(TransactionType.SWAP)}>
            <Radio onChange={() => null} scale="sm" checked={txFilter === TransactionType.SWAP} />
            <Text ml="8px">Swaps</Text>
          </RadioGroup>
        </Flex>

        <Flex flexDirection={['column', 'row']}>
          <RadioGroup onClick={() => handleFilter(TransactionType.MINT)}>
            <Radio onChange={() => null} scale="sm" checked={txFilter === TransactionType.MINT} />
            <Text ml="8px">Adds</Text>
          </RadioGroup>

          <RadioGroup onClick={() => handleFilter(TransactionType.BURN)}>
            <Radio onChange={() => null} scale="sm" checked={txFilter === TransactionType.BURN} />
            <Text ml="8px">Removes</Text>
          </RadioGroup>
        </Flex> */}
      </Flex>
      <Card>
        <Wrapper>
          <TableWrapper>
            <ResponsiveGrid>
              <Text color="secondary" fontSize="12px" textTransform="uppercase">
                Action
              </Text>
              <ClickableColumnHeader
                color="secondary"
                fontSize="12px"
                onClick={() => handleSort(SORT_FIELD.amountUSD)}
                textTransform="uppercase"
              >
                Total Value {arrow(SORT_FIELD.amountUSD)}
              </ClickableColumnHeader>
              <ClickableColumnHeader
                color="secondary"
                fontSize="12px"
                onClick={() => handleSort(SORT_FIELD.amountToken0)}
                textTransform="uppercase"
              >
                Token Amount {arrow(SORT_FIELD.amountToken0)}
              </ClickableColumnHeader>
              <ClickableColumnHeader
                color="secondary"
                fontSize="12px"
                onClick={() => handleSort(SORT_FIELD.amountToken1)}
                textTransform="uppercase"
              >
                Token Amount {arrow(SORT_FIELD.amountToken1)}
              </ClickableColumnHeader>
              <ClickableColumnHeader
                color="secondary"
                fontSize="12px"
                onClick={() => handleSort(SORT_FIELD.sender)}
                textTransform="uppercase"
              >
                Account {arrow(SORT_FIELD.sender)}
              </ClickableColumnHeader>
              <HStack>
                <ClickableColumnHeader
                  color="secondary"
                  fontSize="12px"
                  onClick={() => handleSort(SORT_FIELD.timestamp)}
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
            </ResponsiveGrid>
            <Break />

            {transactions ? (
              <>
                {sortedTransactions.map((transaction, index) => {
                  if (transaction) {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <Fragment key={index}>
                        <DataRow transaction={transaction} filter={filter} />
                        <Break />
                      </Fragment>
                    );
                  }
                  return null;
                })}
                {sortedTransactions.length === 0 ? (
                  <Flex justifyContent="center">
                    <Text>No Transactions</Text>
                  </Flex>
                ) : undefined}
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
        </Wrapper>
      </Card>
    </>
  );
};

export default TransactionTable;

export function getBlockExploreLink(
  data: string | number | undefined | null,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainId?: number,
): string {
  const chainConfig: any = CHAINS.find((chainConfig: any) => chainConfig.id == chainId);
  switch (type) {
    case 'transaction': {
      return `${chainConfig?.blockExplorers?.default.url}tx/${data}`;
    }
    case 'token': {
      return `${chainConfig?.blockExplorers?.default.url}token/${data}`;
    }
    case 'block': {
      return `${chainConfig?.blockExplorers?.default.url}block/${data}`;
    }
    case 'countdown': {
      return `${chainConfig?.blockExplorers?.default.url}block/countdown/${data}`;
    }
    default: {
      return `${chainConfig?.blockExplorers?.default.url}address/${data}`;
    }
  }
}
