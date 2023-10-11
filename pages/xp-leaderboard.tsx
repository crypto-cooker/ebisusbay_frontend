import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React, {useEffect, useMemo, useState} from "react";
import {Box, Card, CardBody, Center, Flex, Heading, HStack, Image as ChakraImage, Link, Spinner, Text} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import ResponsiveXPLeaderboardTable
  from "@src/components-v2/shared/responsive-table/responsive-xp-leaderboard-table";
import {round} from "@src/utils";
import ImageService from "@src/core/services/image";
import {useAppSelector} from "@src/Store/hooks";
import {useFortunePrice} from "@src/hooks/useGlobalPrices";
import {appConfig} from "@src/Config";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {useInfiniteQuery} from "@tanstack/react-query";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import axios from "axios";
import {XPProfile} from "@src/core/services/api-service/types";
import Blockies from "react-blockies";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

interface QueryParams{
  // addresss?: string;
  // signature?: string;
  page?: number;
}

const XPLeaderboard = () => {
  const user = useAppSelector(state => state.user);
  const [queryParams, setQueryParams] = useState<QueryParams>({});
  const [playerProfile, setPlayerProfile] = useState<XPProfile | undefined>(undefined);
  const [playerRank, setPlayerRank] = useState<number>();

  const getFactions = async (query?: QueryParams): Promise<PagedList<XPProfile>> => {
    const response = await api.get(`ryoshi-dynasties/experience/leaderboard`, {
      params: query
    });

    return response.data;
  }
  const fetcher = async ({ pageParam = 1 }) => {
    const data = await getFactions({
      ...queryParams,
      page: pageParam,
    });

    return data;
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    status,
    isLoading: isLeaderboardLoading,
    isError: isLeaderboardError,
  } = useInfiniteQuery(
    ['Factions', queryParams],
    fetcher,
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
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
      <ResponsiveXPLeaderboardTable
        data={data}
        onSort={() => {}}
      />
    )
  }, [data, status]);

  const GetPlayerRank = () =>{
    if(!data) return;
    if(!user.address) return;
    
    const playerRank = data.pages.find((page) => {
      return page.data.find((entity, index) => {
        if(entity.walletAddress === user.address){
            setPlayerProfile(entity);
            setPlayerRank(index + 1);
        }
      });
    });
  }

  useEffect(() => {
    GetPlayerRank();

  }, [data, user]);

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
          <CardBody>
            <Flex direction='column'>
              {/* <Text fontSize='26px' fontWeight='bold'>My XP</Text> */}
              {/* <Text fontSize='sm'>Unlock epic Fortune rewards by listing NFTs on Ebisu's Bay. Rewards are calculated at the end of every game of <Link href='/ryoshi'>Ryoshi Dynasties</Link> and accumulate daily.</Text> */}
            </Flex>
            {user.address ? (
              <>
                {!isLeaderboardLoading && playerProfile ? (
                  <>
                    {!isLeaderboardError ? (
                      <>
                        <HStack>
                        {playerProfile.profileImage ? (
                            <Box
                              width='40px'
                              height='40px'
                              position='relative'
                              rounded='full'
                              overflow='hidden'
                            >
                              <ChakraImage
                                src={ImageService.translate(playerProfile.profileImage).avatar()}
                                alt={playerProfile.username}
                              />
                            </Box>
                          ) : (
                            <Blockies seed={playerProfile.walletAddress.toLowerCase()} size={10} scale={5} />
                          )}
                          {/* <FortuneIcon boxSize={6} /> */}
                          <Text fontSize='2xl' fontWeight='bold'>{playerProfile.username}</Text>
                          {/* <Text as='span' ms={1} fontSize='sm' className="text-muted">~${playerProfile.experience}</Text> */}
                          <Text fontSize='2xl' className="text-muted">{playerProfile.experience}xp</Text>
                        </HStack>
                        {/* <Text fontSize='sm' className="text-muted">{playerProfile.experience}</Text> */}
                        {/* <Text mt={6} fontSize='sm'>Visit the Ryoshi Dynasties bank to claim.</Text> */}
                      </>
                    ) : (
                      <Text fontSize='2xl' fontWeight='bold'>0</Text>
                    )}
                <Heading size='md' fontWeight='normal' mt={4}>Your Current Rank : {playerRank}</Heading>
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
            <Text fontSize='26px' fontWeight='bold'>Leading Players</Text>
            <Box fontSize='sm'>
              <Text as='span'>Users with the highest amount of Experience.{' '}</Text>
              <Text as='span' fontWeight='bold' className='color'><Link href='https://ebisusbay.notion.site/Rewards-aa425cc2207c42a996e1a5e8b03fc00a' isExternal>Learn more</Link></Text>
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

export default XPLeaderboard;