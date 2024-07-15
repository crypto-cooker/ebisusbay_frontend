import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React, {useMemo, useState} from "react";
import {
  Box,
  Card,
  CardBody,
  Center,
  Flex,
  Heading,
  HStack,
  Image as ChakraImage,
  Link,
  Spinner,
  Text
} from "@chakra-ui/react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import ResponsiveXPLeaderboardTable from "@src/components-v2/shared/responsive-table/responsive-xp-leaderboard-table";
import ImageService from "@src/core/services/image";
import {appConfig} from "@src/config";
import axios from "axios";
import {XPProfile} from "@src/core/services/api-service/types";
import Blockies from "react-blockies";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import InfiniteScroll from "react-infinite-scroll-component";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

interface QueryParams {
  timeframe?: string;
  pageSize?: number;
  page?: number;
  walletAddress?: string;
}

const tabs = {
  week: 'week',
  month: 'month',
  all: 'all'
};

const XPLeaderboard = () => {
  const user = useUser();
  const [queryParams, setQueryParams] = useState<QueryParams>({
    timeframe: 'week',
    pageSize: 50
  });
  const [currentTab, setCurrentTab] = React.useState(tabs.week);

  const updateTimeframe = (key: string) => {
    setQueryParams({
      ...queryParams,
      timeframe: key
    });
  }

  const handleTabChange = (key: string) => (e: any) => {
    setCurrentTab(key);
    updateTimeframe(key);
  };

  const getLeaderboard = async (params: QueryParams) => {
    const response = await api.get(`ryoshi-dynasties/experience/leaderboard`, {
      params
    });

    return response.data;
  }

  const getXpProfiles = async ({ pageParam = 1 }) => {
    const params = {
      ...queryParams,
      page: pageParam
    }

    const results = (await getLeaderboard(params)).data;
    return new PagedList<XPProfile>(results, params.page, results.length >= params.pageSize!);
  };

  const getXpProfile = async () => {
    const profile = await getLeaderboard({walletAddress: user.address!});
    return profile.data;
  }

  const {data, error, status, fetchNextPage, hasNextPage} = useInfiniteQuery({
    queryKey: ['XpLeaderboard', queryParams],
    queryFn: getXpProfiles,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const {data: userProfile, status: profileStatus} = useQuery({
    queryKey: ['XpLeaderboardUser', user.address],
    queryFn: getXpProfile,
    refetchOnWindowFocus: false,
    enabled: !!user.address
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
      <ResponsiveXPLeaderboardTable data={data} />
    )
  }, [data, status]);

  return (
    <Box>
      <PageHead
        title="XP Leaderboard"
        description="Earn XP by playing Ryoshi Dynasties and listing NFTs on Ebisu's Bay."
        url="/xp-leaderboard"
      />
      <PageHeader
        title='XP Leaderboard'
        subtitle={'Earn XP by playing Ryoshi Dynasties and listing NFTs on Ebisu\'s Bay.'}
      />
      <Box className="gl-legacy container no-top" mt={4}>
        <Card variant='outline' mt={2}>
          <CardBody minH={'130px'}>
            <Flex direction='column'>
              {/* <Text fontSize='26px' fontWeight='bold'>My XP</Text> */}
              {/* <Text fontSize='sm'>Unlock epic Fortune rewards by listing NFTs on Ebisu's Bay. Rewards are calculated at the end of every game of <Link href='/ryoshi'>Ryoshi Dynasties</Link> and accumulate daily.</Text> */}
            </Flex>
            {user.address ? (
              <>
                {profileStatus !== 'pending' && !!userProfile ? (
                  <>
                    {status !== 'error' ? (
                      <>
                        <HStack>
                        {userProfile.avatar ? (
                            <Box
                              width='40px'
                              height='40px'
                              position='relative'
                              rounded='full'
                              overflow='hidden'
                            >
                              <ChakraImage
                                src={ImageService.translate(userProfile.avatar).avatar()}
                                alt={userProfile.username}
                              />
                            </Box>
                          ) : (
                            <Blockies seed={userProfile.walletAddress.toLowerCase()} size={10} scale={5} />
                          )}
                          {/* <FortuneIcon boxSize={6} /> */}
                          <Text fontSize='2xl' fontWeight='bold'>{userProfile.username}</Text>
                          {/* <Text as='span' ms={1} fontSize='sm' className="text-muted">~${playerProfile.experience}</Text> */}
                          <Text fontSize='2xl' className="text-muted">{userProfile.experience}xp</Text>
                        </HStack>
                        {/* <Text fontSize='sm' className="text-muted">{playerProfile.experience}</Text> */}
                        {/* <Text mt={6} fontSize='sm'>Visit the Ryoshi Dynasties bank to claim.</Text> */}
                      </>
                    ) : (
                      <Text fontSize='2xl' fontWeight='bold'>0</Text>
                    )}
                <Heading size='md' fontWeight='normal' mt={4}>Your Current Rank : { userProfile.rank > 0 ? userProfile.rank : "Unranked"}</Heading>
                  </>
                ) : (
                  <Spinner />
                )}
              </>
            ) : (
              <Box mt={4}>Connect wallet to view your ranking</Box>
            )}
          </CardBody>
        </Card>
        <Box mt={8}>
          <Flex direction='column'>
            <Text fontSize='26px' fontWeight='bold'>Leading Players</Text>
            <Box fontSize='sm'>
              <Text as='span'>Users with the highest amount of Experience.{' '}</Text>
              <Text as='span' fontWeight='bold' className='color'><Link href='https://ebisusbay.notion.site/Levels-and-Experience-Points-91658dcfd1b64fcf93b7f5b3af8c069c' isExternal>Learn more</Link></Text>
            </Box>
          </Flex>
        </Box>
        <Box mt={4}>
          <ul className="de_nav mb-2">
            <li id="Mainbtn0" className={`tab ${currentTab === tabs.week ? 'active' : ''}`}>
              <span onClick={handleTabChange(tabs.week)}>Week</span>
            </li>
            <li id="Mainbtn0"className={`tab ${currentTab === tabs.month ? 'active' : ''}`}>
              <span onClick={handleTabChange(tabs.month)}>Month</span>
            </li>
            <li id="Mainbtn1" className={`tab ${currentTab === tabs.all ? 'active' : ''}`}>
              <span onClick={handleTabChange(tabs.all)}>All Time</span>
            </li>
          </ul>
          <InfiniteScroll
            dataLength={data?.pages ? data.pages.flat().length : 0}
            next={fetchNextPage}
            hasMore={hasNextPage ?? false}
            style={{ overflow: 'none' }}
            loader={
              <Center>
                <Spinner />
              </Center>
            }
          >
            <Center>
              {content}
            </Center>
          </InfiniteScroll>
        </Box>
      </Box>
    </Box>
  )
}

export default XPLeaderboard;