import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React, {useMemo} from "react";
import {Box, Card, CardBody, Center, Flex, Heading, HStack, Link, Spinner, Text} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import ResponsiveRewardsCollectionsTable
  from "@src/components-v2/shared/responsive-table/responsive-rewards-collections-table";
import {round} from "@src/utils";
import {useFortunePrice} from "@src/hooks/useGlobalPrices";
import {appConfig} from "@src/Config";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();
const currentGameId = 141;

const Rewards = () => {
  const user = useUser();
  const { data: fortunePrice, isLoading: isFortunePriceLoading } = useFortunePrice(config.chain.id);

  const {data, error, status,} = useQuery({
    queryKey: ['RewardsCollections', currentGameId],
    queryFn: () => ApiService.withoutKey().getRewardedEntities(currentGameId),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 35,
    refetchOnWindowFocus: false,
  });

  const { data: rewards, isLoading: isRewardsLoading, isError: isRewardsError } = useQuery({
    queryKey: ['BankSeasonalRewards', user.address],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getSeasonalRewards(user.address!, 1),
    enabled: !!user.address,
    refetchOnWindowFocus: false,
  });

  const content = useMemo(() => {
    return status === 'pending' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === "error" ? (
      <Box textAlign='center'>
        Error: {(error as any).message}
      </Box>
    ) : (
      <ResponsiveRewardsCollectionsTable
        data={data}
        onSort={() => {}}
      />
    )
  }, [data, status]);

  return (
    <Box>
      <PageHead
        title="Earn Rewards with FRTN"
        description="Get rewarded with FRTN by playing Ryoshi Dynasties and listing NFTs on Ebisu's Bay"
        url="/rewards"
      />
      <PageHeader
        title='Earn Rewards with FRTN'
        subtitle={'Earn FRTN by playing Ryoshi Dynasties and listing NFTs on Ebisu\'s Bay. Stake your FRTN to multiply your rewards!'}
      />
      <Box className="gl-legacy container no-top" mt={4}>
        <Card variant='outline' mt={2}>
          <CardBody>
            <Flex direction='column'>
              <Text fontSize='26px' fontWeight='bold'>My Rewards</Text>
              <Text fontSize='sm'>Unlock epic Fortune rewards by listing NFTs on Ebisu's Bay. Rewards are calculated at the end of every game of <Link href='/ryoshi'>Ryoshi Dynasties</Link> and accumulate daily.</Text>
            </Flex>
            {user.address ? (
              <>
                <Heading size='md' fontWeight='normal' mt={4}>Your Pending Rewards</Heading>
                {!isRewardsLoading && !isFortunePriceLoading ? (
                  <>
                    {!isRewardsError ? (
                      <>
                        <HStack>
                          <FortuneIcon boxSize={6} />
                          <Text fontSize='2xl' fontWeight='bold'>{round(rewards?.data.rewards.currentRewards, 3)}</Text>
                          <Text as='span' ms={1} fontSize='sm' className="text-muted">~${round((fortunePrice ? Number(fortunePrice.usdPrice) : 0) * rewards?.data.rewards.currentRewards, 2)}</Text>
                        </HStack>
                        <Text fontSize='sm' className="text-muted">{round(rewards?.data.rewards.aprRewards, 3)} staking + {round(rewards?.data.rewards.listingRewards, 3)} listing rewards</Text>
                        <Text mt={6} fontSize='sm'>Visit the Ryoshi Dynasties bank to claim.</Text>
                      </>
                    ) : (
                      <Text fontSize='2xl' fontWeight='bold'>0</Text>
                    )}
                  </>
                ) : (
                  <Spinner />
                )}
              </>
            ) : (
              <Box mt={4}>Connect wallet to view pending rewards</Box>
            )}
            {/*<Button variant='primary'>*/}
            {/*  Claim*/}
            {/*</Button>*/}
          </CardBody>
        </Card>
        <Box mt={8}>
          <Flex direction='column'>
            <Text fontSize='26px' fontWeight='bold'>Current Rewards</Text>
            <Box fontSize='sm'>
              <Text as='span'>Users will be able to earn rewards by listing NFTs from any eligible collections below. Eligible users in the list will be able to earn rewards by listing any of their NFTs.{' '}</Text>
              <Text as='span' fontWeight='bold' className='color'><Link href='https://ebisusbay.notion.site/Rewards-aa425cc2207c42a996e1a5e8b03fc00a' isExternal>Learn more</Link></Text>
            </Box>
            <Box fontSize='sm'>
            <Text as='span'>The FRTN reward values listed below are based on the previous day's distributions and are approximations - they will change everyday based on collection volume and the number of eligible listings.{' '}</Text>
            </Box>
          </Flex>
        </Box>
        <Box mt={4}>
          {/*<Card variant='outline' mt={2}>*/}
          {/*  <CardBody textAlign='center'>*/}
          {/*    <Text fontSize='xl' fontWeight='bold'>Preparing Leaderboard...</Text>*/}
          {/*    <Text>Previous game winners will be available shortly!</Text>*/}
          {/*  </CardBody>*/}
          {/*</Card>*/}
          {content}
        </Box>
      </Box>
    </Box>
  )
}

export default Rewards;