import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React, {useMemo} from "react";
import {Box, Card, CardBody, Center, Flex, Heading, HStack, Image, Link, Text} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {Spinner} from "react-bootstrap";
import ResponsiveRewardsCollectionsTable
  from "@src/components-v2/shared/responsive-table/responsive-rewards-collections-table";
import {round} from "@src/utils";
import ImageService from "@src/core/services/image";
import {useAppSelector} from "@src/Store/hooks";
import {useGlobalPrice} from "@src/hooks/useGlobalPrices";
import {appConfig} from "@src/Config";

const config = appConfig();

const Rewards = () => {
  const user = useAppSelector(state => state.user);
  const { data: fortunePrice, isLoading: isFortunePriceLoading } = useGlobalPrice(config.chain.id);

  const {data, error, status,} = useQuery(
    ['RewardsCollections'],
    () => ApiService.withoutKey().getRewardedEntities(7),
    {
      staleTime: 1
    }
  )

  const { data: rewards, isLoading: isRewardsLoading, isError: isRewardsError } = useQuery(
    ['BankSeasonalRewards', user.address],
    () => ApiService.withoutKey().ryoshiDynasties.getSeasonalRewards(user.address!, 1),
    {
      enabled: !!user.address,
      refetchOnWindowFocus: false,
    }
  );

  const content = useMemo(() => {
    return status === "loading" ? (
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
        title="Rewards"
        description="View the top performing collections on Ebisu's Bay Marketplace"
        url="/collections"
      />
      <PageHeader
        title={'Get Rewarded With FRTN'}
        subtitle={'Earn FRTN by listing NFTs on Ebisu\'s Bay. Stake your FRTN for even more rewards and benefits!'}
      />
      <Box className="gl-legacy container no-top" mt={4}>
        <Card variant='outline' mt={2}>
          <CardBody>
            <Flex direction='column'>
              <Text fontSize='26px' fontWeight='bold'>Claim Rewards</Text>
              <Text fontSize='sm'>Get rewarded by listing NFTs on Ebisu's Bay. Rewards are calculated at the end of every game of <Link href='/ryoshi'>Ryoshi Dynasties</Link> and accumulate daily.</Text>
            </Flex>
            {user.address ? (
              <>
                <Heading size='md' fontWeight='normal' mt={4}>Total Pending Rewards</Heading>
                {!isRewardsLoading && !isFortunePriceLoading ? (
                  <>
                    {!isRewardsError ? (
                      <>
                        <HStack>
                          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/fortune.svg').convert()} alt="fortuneIcon" boxSize={6} />
                          <Text fontSize='2xl' fontWeight='bold'>{round(rewards?.data.rewards.totalRewards, 3)}</Text>
                          <Text as='span' ms={1} fontSize='sm' className="text-muted">~${round((fortunePrice ? Number(fortunePrice.usdPrice) : 0) * rewards?.data.rewards.totalRewards, 2)}</Text>
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
          </Flex>
        </Box>
        <Box mt={4}>
          {content}
        </Box>
      </Box>
    </Box>
  )
}

export default Rewards;