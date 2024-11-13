/* eslint-disable no-nested-ternary */
import { Box, Button, Breadcrumb, Flex, Heading, Spinner, Text, HStack, BreadcrumbSeparator } from '@chakra-ui/react';
import Link from 'next/link';
import { Card } from '@src/components-v2/foundation/card';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { getBlockExploreLink } from '@src/components-v2/feature/info/components/tables/transaction-table';
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers';
import { CurrencyLogoByAddress } from '@dex/components/logo';
import ChartCard from '@src/components-v2/feature/info/components/charts/chart-card';
import TransactionTable from '@src/components-v2/feature/info/components/tables/transaction-table';
import Percent from '@src/components-v2/feature/info/components/percent';
import { useChainIdByQuery, useChainPathByQuery } from '../hooks/chain';
import { usePairDataQuery } from '../hooks/usePairDataQuery';
import { usePairChartVolumeDataQuery } from '../hooks/usePairChartVolumeDataQuery';
import { usePairTransactionsQuery } from '../hooks/usePairTransactionsQuery';
import { Pair } from '@pancakeswap/sdk';
import { PrimaryButton } from '@src/components-v2/foundation/button';

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 1em;
  margin-top: 16px;
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`;

const TokenButton = styled(Flex)`
  padding: 8px 0px;
  margin-right: 16px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const LockedTokensContainer = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  border-radius: 16px;
  max-width: 280px;
`;

const CustomBreadcrumb = styled(Breadcrumb)`
  ol {
    padding: 0;
  }
`

const PairPage: React.FC<React.PropsWithChildren<{ routeAddress: string }>> = ({ routeAddress }) => {
  const [showWeeklyData, setShowWeeklyData] = useState(0);

  const PairData = usePairDataQuery(routeAddress);
  const volumeChartData = usePairChartVolumeDataQuery(routeAddress);
  const transactions = usePairTransactionsQuery(routeAddress);


  const chainId = useChainIdByQuery();
  const [pairSymbol, symbol0, symbol1] = useMemo(() => {
    const s0 = PairData?.token0.symbol;
    const s1 = PairData?.token1.symbol;
    return [`${s0} / ${s1}`, s0, s1];
  }, [chainId, PairData?.token0.address, PairData?.token0.symbol, PairData?.token1.address, PairData?.token1.symbol]);
  const chainPath = useChainPathByQuery();

  const hasSmallDifference = useMemo(() => {
    return PairData ? Math.abs(PairData.token1.derivedUSD - PairData.token0.derivedUSD) < 1 : false;
  }, [PairData]);

  return (
    <Box>
      {PairData ? (
        <>
          <Flex justifyContent="space-between" mt="16px" flexDirection={['column', 'column', 'row']}>
            <CustomBreadcrumb mb="32px">
              <Link href={`/info${chainPath}`}>
                <Text color="primary">{'Info'}</Text>
              </Link>
              <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>
              <Link href={`/info${chainPath}/pairs`}>
                <Text color="primary">{'Pairs'}</Text>
              </Link>
              <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>
              <Flex>
                <Text mr="8px">{pairSymbol}</Text>
              </Flex>
            </CustomBreadcrumb>
            <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
              <Link style={{marginRight: '8px', color: 'primary'}} href={getBlockExploreLink(routeAddress, 'address', chainId)}>
                {'View on Explorer'}
              </Link>
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb={['8px', null]}>
              <HStack display={{ base: 'none', md: 'flex' }}>
                <CurrencyLogoByAddress size={'32px'} address={PairData.token0.address} chainId={chainId} />
                <CurrencyLogoByAddress size={'32px'} address={PairData.token1.address} chainId={chainId} />
              </HStack>
              <Text ml="38px" fontWeight={'bold'} fontSize={'24px'} id="info-pool-pair-title">
                {pairSymbol}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
              <Flex flexDirection={['column', 'column', 'row']} mb={['8px', '8px', null]}>
                <Link href={`/info${chainPath}/tokens/${PairData.token0.address}`}>
                  <TokenButton>
                    <CurrencyLogoByAddress address={PairData.token0.address} size="24px" chainId={chainId} />
                    <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
                      {`1 ${symbol0} =  ${formatAmount(PairData.token1.derivedUSD, {
                        notation: 'standard',
                        displayThreshold: 0.001,
                        tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
                      })} ${symbol1}`}
                    </Text>
                  </TokenButton>
                </Link>
                <Link href={`/info${chainPath}/tokens/${PairData.token1.address}`}>
                  <TokenButton ml={[null, null, '10px']}>
                    <CurrencyLogoByAddress address={PairData.token1.address} size="24px" chainId={chainId} />
                    <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
                      {`1 ${symbol1} =  ${formatAmount(PairData.token0.derivedUSD, {
                        notation: 'standard',
                        displayThreshold: 0.001,
                        tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
                      })} ${symbol0}`}
                    </Text>
                  </TokenButton>
                </Link>
              </Flex>
              <Flex>
              <Link href={`/dex/add/v2/${PairData.token0.address}`}>
                  <PrimaryButton mr="8px">
                    {'Add Liquidity'}
                  </PrimaryButton>
                </Link>
                <Link href={`/dex/swap?outputCurrency=${PairData.token1.address}&inputCurrency=${PairData.token0.address}`}>
                  <PrimaryButton>{'Trade'}</PrimaryButton>
                </Link>
              </Flex>
            </Flex>
          </Flex>
          <ContentLayout>
            <Box>
              <Card>
                <Flex justifyContent="space-between">
                  <Flex flex="1" flexDirection="column">
                    <Text color="secondary" fontWeight={'bold'} fontSize="12px" textTransform="uppercase">
                      {'Liquidity'}
                    </Text>
                    <Text fontSize="24px" fontWeight={'bold'}>
                      ${formatAmount(PairData.liquidityUSD)}
                    </Text>
                    <Percent value={PairData.liquidityUSDChange} />
                  </Flex>
                  <Flex flex="1" flexDirection="column">
                    <Text color="secondary" fontWeight={'bold'} fontSize="12px" textTransform="uppercase">
                      {'LP reward APR'}
                    </Text>
                    <Text fontSize="24px" fontWeight={'bold'}>
                      {formatAmount(PairData.lpApr24h)}%
                    </Text>
                    <Flex alignItems="center">
                      <Text mr="4px" fontSize="12px" color="textSubtle">
                        {'24 performance'}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Text color="secondary" fontWeight={'bold'} mt="24px" fontSize="12px" textTransform="uppercase">
                  {'Total Tokens Locked'}
                </Text>
                <LockedTokensContainer>
                  <Flex justifyContent="space-between">
                    <Flex>
                      <CurrencyLogoByAddress address={PairData.token0.address} size="24px" chainId={chainId} />
                      <Text color="textSubtle" ml="8px">
                        {symbol0}
                      </Text>
                    </Flex>
                    <Text>{formatAmount(PairData.token0.totalLiquidity)}</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Flex>
                      <CurrencyLogoByAddress address={PairData.token1.address} size="24px" chainId={chainId} />
                      <Text color="textSubtle" ml="8px">
                        {symbol1}
                      </Text>
                    </Flex>
                    <Text>{formatAmount(PairData.token1.totalLiquidity)}</Text>
                  </Flex>
                </LockedTokensContainer>
              </Card>
              <Card mt="16px" pt='16px'>
                <Flex flexDirection="column">
                  {/* <ButtonMenu activeIndex={showWeeklyData}>
                    <ButtonMenuItem onClick={() => {setShowWeeklyData(0)}}>{'24H'}</ButtonMenuItem>
                    <ButtonMenuItem onClick={() => {setShowWeeklyData(1)}}>{'7D'}</ButtonMenuItem>
                  </ButtonMenu> */}
                  <Flex flexDirection="column" gap='16px'>
                    <Flex flex="1" flexDirection="column">
                      <Text color="secondary" fontSize="12px" fontWeight={'bold'} textTransform="uppercase">
                        {'Volume 24H'}
                      </Text>
                      <Text fontSize="24px" fontWeight={'bold'}>
                        ${formatAmount(PairData.volumeUSD)}
                      </Text>
                      <Percent value={PairData.dailyVolumeUSD} />
                    </Flex>
                    <Flex flex="1" flexDirection="column">
                      <Text color="secondary" fontSize="12px" fontWeight={'bold'} textTransform="uppercase">
                        {showWeeklyData ? 'LP reward fees 7D' : 'LP reward fees 24H'}
                      </Text>
                      <Text fontSize="24px" fontWeight={'bold'}>
                        ${formatAmount(PairData.totalFees24h)}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
            </Box>
            <ChartCard variant="pool" volumeChartData={volumeChartData} tvlChartData={volumeChartData} />
          </ContentLayout>
          <Heading mb="16px" mt="40px" scale="lg">
            {'Transactions'}
          </Heading>
          <TransactionTable transactions={transactions} />
        </>
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Box>
  );
};

export default PairPage;
