import {useInfiniteQuery} from "@tanstack/react-query";
import { Center, Spinner, Box, HStack, useMediaQuery, VStack, Link, Button} from "@chakra-ui/react";
import { useMemo } from "react";
import { ApiService } from "@src/core/services/api-service";
import {Text,Grid, GridItem, Flex,SimpleGrid } from "@chakra-ui/react";
import {getHandName, getCardName, Player } from "@src/core/poker-rank-players";
import { useEffect, useState, Fragment } from "react";
import {RankPlayers} from "@src/core/poker-rank-players"
import InfiniteScroll from "react-infinite-scroll-component";
import {shortAddress} from "@src/utils";
import NextLink from "next/link";
import { InfoIcon, LinkIcon } from "@chakra-ui/icons";

const PokerLeaderboardComponent = () => {

	const [rankedPlayers, setRankedPlayers] = useState<Player[]>([])
  	const params = {} // whatever needed
	const isMobile = useMediaQuery("(max-width: 768px)")[0];
	const [updatedAt, setUpdatedAt] = useState<string>();


	const { data, fetchNextPage, hasNextPage, status, error, dataUpdatedAt} = useInfiniteQuery(
		['RyoshiDiamondsLeaderboard'],
	  ({pageParam = 1}) => ApiService.withoutKey().getRyoshiDiamondsLeaderboard(pageParam, 500),
		{
			getNextPageParam: (lastPage, pages) => {
				return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
			},
		// onSuccess: (data) => {
		// 	const [refreshTime, setRefreshTime] = useState('00:00:00');
		// 	setRefreshTime(new Date().toLocaleTimeString())
		// },
	    refetchOnWindowFocus: false,
	    staleTime: 60,
	    cacheTime: 65
	  }
	)

	const loadMore = () => {
		fetchNextPage();
	  };

	useEffect(() => {
		if(!data) return; 

	}, [data])

	useEffect(() => {
		if(!dataUpdatedAt) return; 

		const date = new Date(dataUpdatedAt);
		const dateTimeFormat = new Intl.DateTimeFormat('en', {hour: 'numeric', minute: 'numeric', hour12: false })
		setUpdatedAt(dateTimeFormat.format(date))
	}, [dataUpdatedAt])

	const content = useMemo(() => {

		const PrintOutPlayerCards = (cardRanks: number[]) => {
			let cardRanksString = "";
			cardRanks.sort((a, b) => b - a);
			cardRanks.forEach((cardRank) => {
			  cardRanksString += getCardName(cardRank) + " ";
			})
			return cardRanksString;
		  }

	    return status === "loading" ? (
	      <Center>
	        <Spinner />
	      </Center>
	    ) : status === "error" ? (
	      <Box textAlign='center'>
	        Error: {(error as any).message}
	      </Box>
	    ) : (<>
			<HStack>
		<Text fontSize={{base: 12, md:14}} textAlign='center'>Must be holding at least 5 cards to be ranked</Text>
			<Link 
				as={NextLink} 
				href={'https://blog.ebisusbay.com/crypto-hodlem-round-2-ryoshi-clubs-playing-cards-collection-6e7d869f87ee'} 
				isExternal={true}>
				<Button variant={'ghost'} maxW='250px' rightIcon={<InfoIcon/>}>Full Rules</Button>
			</Link> 
			</HStack>
			<InfiniteScroll
				dataLength={data?.pages ? data.pages.flat().length : 0}
				next={loadMore}
				hasMore={hasNextPage ?? false}
				style={{ overflow: 'hidden' }}
				loader={
				<div className="row">
					<div className="col-lg-12 text-center">
					<Spinner animation="border" role="status">
						<span className="visually-hidden">Loading...</span>
					</Spinner>
					</div>
				</div>
				}
			>
			<SimpleGrid  
				border={'2px solid white'}
				maxW={'1000px'}
			 	columns={4}
				gap={0}
				justifyItems='left'
				padding={4}
				justifySelf={'center'}
				spacingX={{base: 4, md: 12}}
				gridTemplateColumns={{base: '15px 50px 125px 50px', md:'50px 350px 150px 100px'}}
				rounded={'md'}
				// justifyItems={'center'}
			>
				<GridItem  as='b' maxW='50px' >
					<Text fontSize={{base: 12, md:14}}>Rank</Text>
				</GridItem>

				<GridItem as='b'> 
					<Text fontSize={{base: 12, md:14}}>Address</Text>
				</GridItem>
		
				<GridItem  as='b'>
					<Text fontSize={{base: 12, md:14}}>Best Hand</Text>
				</GridItem>
		
				{/* <GridItem >
					<Text as='b'>Primary</Text>
				</GridItem>
		 */}
				<GridItem as='b'>
					<Text fontSize={{base: 12, md:14}}>Secondary</Text>
				</GridItem>
		
				{/* <GridItem as='b'>
					<Text>All Cards</Text>
				</GridItem> */}

		
				{data?.pages[0].data.map((player: Player, i : number) => (
				<>
				<GridItem maxW='50px'  >
				<Text fontSize={{base: 12, md:14}}> {i+1}</Text>
				</GridItem>

				<GridItem >
					<Text fontSize={{base: 12, md:14}}>{isMobile ? shortAddress(player.address) : player.address}</Text>
				</GridItem>
		
				<GridItem>
					<Text fontSize={{base: 12, md:14}}>{getHandName(player.bestHand.handRef)} ({player.bestHand.handDescription})</Text>
				</GridItem>
		
				{/* <GridItem>
					<Text>{getCardName(player.bestHand.primaryValue)}</Text>
				</GridItem> */}
		
				<GridItem>
					<HStack>
						<Text>{getCardName(player.bestHand.secondaryValue)}</Text>
						{player?.bestHand?.secondaryCardEdition! >= 0 &&
							<Text
							fontSize={{base: 8, md:12}}
							color={'gray.500'}
						>id:{player.bestHand.secondaryCardEdition!}</Text>
						}
					</HStack>
				</GridItem>
{/* 		
				<GridItem>
					<Text isTruncated maxW={'80px'} fontSize={12}>{PrintOutPlayerCards(player.cardRanks)}</Text>
				</GridItem> */}
				</>
				))}
			</SimpleGrid > 
			{hasNextPage && <>
				<Button maxW='250px' onClick={() => loadMore()}>Load More</Button>
			</> }
		  </InfiniteScroll>
		</>
	    )
	  }, [data, status]);
	
	return (
	  <Flex w={'100%'} justifyContent={'center'} >
		<VStack>
			{updatedAt && <Text fontSize={{base: 12, md:14}} as={'i'} textAlign='center'>Last refreshed at {updatedAt}</Text>}
			{content}
		</VStack>
	  </Flex>
	);
}

export default PokerLeaderboardComponent;