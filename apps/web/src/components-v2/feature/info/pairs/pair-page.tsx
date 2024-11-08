/* eslint-disable no-nested-ternary */
import { Link, Box, Breadcrumb, Flex, Heading, Image, Text, BreadcrumbSeparator } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import { Card } from '@src/components-v2/foundation/card';
import { NextLinkFromReactRouter } from '@src/components-v2/foundation/button';

import truncateHash from '@pancakeswap/utils/truncateHash';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useTokenDataQuery } from '@src/components-v2/feature/info/hooks/useTokenDataQuery';
import { useTokenChartDataVolumeQuery } from '@src/components-v2/feature/info/hooks/useTokenChartDataVolumeQuery';

import { useTokenTransactionsQuery } from '@src/components-v2/feature/info/hooks/useTokenTransactionsQuery';
import { useChainIdByQuery, useChainPathByQuery } from '@src/components-v2/feature/info/hooks/chain';
import styled from 'styled-components';
import { getBlockExploreLink } from '../components/tables/transaction-table';
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers';
import { CurrencyLogoByAddress } from '@dex/components/logo';
import ChartCard from '@src/components-v2/feature/info/components/charts/chart-card';
import PairTable from '../components/tables/pairs-table';
import TransactionTable from '../components/tables/transaction-table';
import Percent from '@src/components-v2/feature/info/components/percent';
import useCMCLink from '../hooks/useCMCLink';
import { usePairDatasForToken } from '../hooks';

dayjs.extend(duration);

const ContentLayout = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-gap: 1em;
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`;

const StyledCMCLink = styled(Link)`
  width: 24px;
  height: 24px;
  margin-right: 8px;

  &:hover {
    opacity: 0.8;
  }
`;
const DEFAULT_TIME_WINDOW = dayjs.duration(1, 'weeks');

const TokenPage: React.FC<React.PropsWithChildren<{ routeAddress: string }>> = ({ routeAddress }) => {
  const chainId = useChainIdByQuery();

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  const address = routeAddress.toLocaleLowerCase();

  const cmcLink = useCMCLink(address);

  const tokenData = useTokenDataQuery(address);
  const pairData = usePairDataQuery(address);
  const { pairDatas } = usePairDatasForToken(address);
  const transactions = useTokenTransactionsQuery(address);
  const volumeChartData = useTokenChartDataVolumeQuery(address);

  // pricing data
  // const priceData = useTokenPriceDataQuery(address, ONE_HOUR_SECONDS, DEFAULT_TIME_WINDOW);

  const chainPath = useChainPathByQuery();
  const tokenSymbol = tokenData?.symbol;
  const tokenName = tokenData?.name;

  return (
    <Box>
      {tokenData ? (
        tokenData?.id == undefined ? (
          <Card>
            <Box p="16px">
              <Text>
                No pair has been created with this token yet. Create one
                <NextLinkFromReactRouter style={{ display: 'inline', marginLeft: '6px' }} to={`/add/${address}`}>
                  here.
                </NextLinkFromReactRouter>
              </Text>
            </Box>
          </Card>
        ) : (
          <>
            {/* Stuff on top */}
            <Flex justifyContent="space-between" mb="24px" flexDirection={['column', 'column', 'row']}>
              <Breadcrumb mb="32px">
                <NextLinkFromReactRouter to={`/info${chainPath}`}>
                  <Text color="primary">{'Info'}</Text>
                </NextLinkFromReactRouter>
                <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>
                <NextLinkFromReactRouter to={`/info${chainPath}/tokens`}>
                  <Text color="primary">{'Tokens'}</Text>
                </NextLinkFromReactRouter>
                <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>
                <Flex>
                  <Text mr="8px">{tokenSymbol}</Text>
                  <Text>{`(${truncateHash(address)})`}</Text>
                </Flex>
              </Breadcrumb>
              <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
                <Link mr="8px" color="primary" href={getBlockExploreLink(address, 'address', chainId)}>
                  {'View on Explorer'}
                </Link>
                {cmcLink && (
                  <StyledCMCLink
                    href={cmcLink}
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    title="CoinMarketCap"
                  >
                    <Image src="/img/cmc_mark.jpeg" rounded='full' height={22} width={22} alt={'View token on CoinMarketCap'} />
                  </StyledCMCLink>
                )}
                {/* <SaveIcon
                  fill={savedTokens.includes(address)}
                  onClick={() => (savedTokens.includes(address) ? removeToken(address) : addToken(address))}
                /> */}
                {/* <CopyButton ml="4px" text={address} tooltipMessage={'Token address copied'} /> */}
              </Flex>
            </Flex>
            <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
              <Flex flexDirection="column" mb={['8px', null]}>
                <Flex alignItems="center">
                  <CurrencyLogoByAddress size="32px" address={address} chainId={chainId} />
                  <Text
                    ml="12px"
                    fontWeight={'bold'}
                    lineHeight="0.7"
                    fontSize={'40px'}
                    id="info-token-name-title"
                  >
                    {tokenName}
                  </Text>
                  <Text ml="12px" lineHeight="1" color="textSubtle" fontSize={'20px'}>
                    ({tokenSymbol})
                  </Text>
                </Flex>
                <Flex mt="8px" ml="46px" alignItems="center">
                  <Text mr="16px" fontWeight={'bold'} fontSize="24px">
                    ${formatAmount(tokenData.priceUSD, { notation: 'standard' })}
                  </Text>
                  <Percent value={tokenData.priceChange} fontWeight={600} />
                </Flex>
              </Flex>
              {/* <Flex>
                <NextLinkFromReactRouter to={`/dex/liquidity}`}>
                  <Button mr="8px" variant="secondary">
                    {'Add Liquidity'}
                  </Button>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter to={`/dex/swap`}>
                  <Button>{'Trade'}</Button>
                </NextLinkFromReactRouter>
              </Flex> */}
            </Flex>

            {/* data on the right side of chart */}
            <ContentLayout>
              <Card>
                <Box p="24px">
                  <Text fontWeight={'bold'} color="secondary" fontSize="12px" textTransform="uppercase">
                    {'Liquidity'}
                  </Text>
                  <Text fontWeight={'bold'} fontSize="24px">
                    ${formatAmount(tokenData.totalLiquidityUSD)}
                  </Text>
                  <Percent value={tokenData.totalLiquidity24h} />

                  <Text mt="24px" fontWeight={'bold'} color="secondary" fontSize="12px" textTransform="uppercase">
                    {'Volume 24H'}
                  </Text>
                  <Text fontWeight={'bold'} fontSize="24px" textTransform="uppercase">
                    ${formatAmount(tokenData.tradeVolumeUSD)}
                  </Text>
                  <Percent value={tokenData.volumeUSD24h} />

                  <Text mt="24px" fontWeight={'bold'} color="secondary" fontSize="12px" textTransform="uppercase">
                    {'Transactions 24H'}
                  </Text>
                  <Text fontWeight={'bold'} fontSize="24px">
                    {formatAmount(tokenData.txCount, { isInteger: true })}
                  </Text>
                </Box>
              </Card>
              {/* charts card */}
              <ChartCard
                variant="token"
                volumeChartData={volumeChartData}
                tvlChartData={volumeChartData}
                tokenData={tokenData}
                tokenPriceData={undefined}
              />
            </ContentLayout>

            <Heading scale="lg" mb="16px" mt="40px">
              {'Transactions'}
            </Heading>

            <TransactionTable transactions={transactions} />
          </>
        )
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Box>
  );
};

export default TokenPage;
