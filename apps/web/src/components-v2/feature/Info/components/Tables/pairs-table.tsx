import { ArrowBackIcon, ArrowForwardIcon, Box, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@src/components-v2/foundation/button'

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useChainIdByQuery, useChainNameByQuery, useChainPathByQuery } from '@src/components-v2/feature/info/hooks/chain'
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers'
import styled from 'styled-components'
import { PairData } from '@src/components-v2/feature/info/state/types'
import { ITEMS_PER_INFO_TABLE_PAGE } from '../../state/constants'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from './shared'

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
  grid-template-columns: 20px 3.5fr repeat(5, 1fr);

  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4),
    & :nth-child(5) {
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
`

const LinkWrapper = styled(NextLinkFromReactRouter)`
  text-decoration: none;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const SORT_FIELD = {
  volumeUSD: 'volumeUSD',
  liquidityUSD: 'liquidityUSD',
  volumeUSDWeek: 'volumeUSDWeek',
  lpFees24h: 'lpFees24h',
  lpApr7d: 'lpApr7d',
}

const LoadingRow: React.FC<React.PropsWithChildren> = () => (
  <ResponsiveGrid>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </ResponsiveGrid>
)

const TableLoader: React.FC<React.PropsWithChildren> = () => (
  <>
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </>
)

const DataRow = ({ PairData, index }: { PairData: PairData; index: number }) => {
  const chainName = useChainNameByQuery()
  const chainId = useChainIdByQuery()
  const chainPath = useChainPathByQuery()
  const token0symbol = PairData.token0.symbol
  const token1symbol = PairData.token1.symbol

  return (
    <LinkWrapper to={`/info${chainPath}/pairs/${PairData.pairAddres}`}>
      <ResponsiveGrid>
        <Text>{index + 1}</Text>
        <Flex>
          {/* <DoubleCurrencyLogo
            address0={PairData.token0.address}
            address1={PairData.token1.address}
            chainName={chainName}
          /> */}
          <Text ml="8px">
            {token0symbol}/{token1symbol}
          </Text>
        </Flex>
        <Text>${formatAmount(PairData.volumeUSD)}</Text>
        <Text>${formatAmount(PairData.volumeUSDWeek)}</Text>
        <Text>${formatAmount(PairData.lpFees24h)}</Text>
        <Text>{formatAmount(PairData.lpApr24h)}%</Text>
        <Text>${formatAmount(PairData.liquidityUSD)}</Text>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

interface PairTableProps {
  pairDatas: (PairData | undefined)[]
  loading?: boolean // If true shows indication that SOME pools are loading, but the ones already fetched will be shown
}

const PairTable: React.FC<React.PropsWithChildren<PairTableProps>> = ({ pairDatas, loading }) => {
  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  useEffect(() => {
    let extraPages = 1
    if (pairDatas.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(pairDatas.length / ITEMS_PER_INFO_TABLE_PAGE) + extraPages)
  }, [pairDatas])
  const sortedPools = useMemo(() => {
    return pairDatas
      ? pairDatas
          .sort((a, b) => {
            if (a && b) {
              const aElement = a[sortField as keyof PairData]
              const bElement = b[sortField as keyof PairData]
              const predicate = aElement !== undefined && bElement !== undefined ? aElement > bElement : false
              return predicate ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : []
  }, [page, pairDatas, sortDirection, sortField])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  return (
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
          onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
          textTransform="uppercase"
        >
          {'Volume 7D'} {arrow(SORT_FIELD.volumeUSDWeek)}
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
          {sortedPools.map((PairData, i) => {
            if (PairData) {
              return (
                <Fragment key={PairData.pairAddres}>
                  <DataRow index={(page - 1) * ITEMS_PER_INFO_TABLE_PAGE + i} PairData={PairData} />
                  <Break />
                </Fragment>
              )
            }
            return null
          })}
          {loading && <LoadingRow />}
          <PageButtons>
            <Arrow
              onClick={() => {
                setPage(page === 1 ? page : page - 1)
              }}
            >
              <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
            </Arrow>

            <Text>{`Page ${page} of ${maxPage}`}</Text>

            <Arrow
              onClick={() => {
                setPage(page === maxPage ? page : page + 1)
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
  )
}

export default PairTable
