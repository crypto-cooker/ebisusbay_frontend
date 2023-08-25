import {useInfiniteQuery} from "@tanstack/react-query";
import { Center, Spinner, Box, HStack, } from "@chakra-ui/react";
import { useMemo } from "react";
import { ApiService } from "@src/core/services/api-service";
import {Text,Grid, GridItem, Flex,SimpleGrid } from "@chakra-ui/react";
import {getHandName, getCardName, Player } from "@src/core/poker-rank-players";
import { useEffect, useState, Fragment } from "react";
import {RankPlayers} from "@src/core/poker-rank-players"
import InfiniteScroll from "react-infinite-scroll-component";
import Button from "@src/Components/components/Button";


const PokerLeaderboardComponent = () => {

	const [rankedPlayers, setRankedPlayers] = useState<Player[]>([])
  	const params = {} // whatever needed
	const { data, fetchNextPage, hasNextPage, status, error} = useInfiniteQuery(['RyoshiDiamondsLeaderboard'],
	  ({page = 1}) => ApiService.withoutKey().getRyoshiDiamondsLeaderboard(page, 500), {

		getNextPageParam: (lastPage, pages) => {
	      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
	    },

	    refetchOnWindowFocus: false,
	    staleTime: 60,
	    cacheTime: 65
	  }
	)

	const Rank = async() => {
		// const newPlayers = await RankPlayers(data?.pages[0])
		// setRankedPlayers(data?.pages[0])
	}
	const loadMore = () => {
		fetchNextPage();
	  };

	useEffect(() => {
		if(!data) return; 
		
		console.log(data)
		console.log(data?.pages[0])
		// setRankedPlayers()
		// Rank();

	}, [data])

	// useEffect(() => {
	// 	if(!rankedPlayers) return; 
	// 	console.log(rankedPlayers)
	// }, [rankedPlayers])

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
				spacingX={8}
				gridTemplateColumns={'50px 375px 150px 100px'}
				rounded={'md'}
				// justifyItems={'center'}
			>
				<GridItem  as='b' maxW='50px' >
					<Text>Rank</Text>
				</GridItem>

				<GridItem as='b'> 
					<Text>Address</Text>
				</GridItem>
		
				<GridItem  as='b'>
					<Text>Best Hand</Text>
				</GridItem>
		
				{/* <GridItem >
					<Text as='b'>Primary</Text>
				</GridItem>
		 */}
				<GridItem as='b'>
					<Text>Secondary</Text>
				</GridItem>
		
				{/* <GridItem as='b'>
					<Text>All Cards</Text>
				</GridItem> */}

		
				{data?.pages[0].data.map((player: Player, i : number) => (
				<>
				<GridItem maxW='50px'  >
					{i+1}
				</GridItem>

				<GridItem   >
					<Text>{player.address}</Text>
				</GridItem>
		
				<GridItem>
					<Text>{getHandName(player.bestHand.handRef)} ({player.bestHand.handDescription})</Text>
				</GridItem>
		
				{/* <GridItem>
					<Text>{getCardName(player.bestHand.primaryValue)}</Text>
				</GridItem> */}
		
				<GridItem>
					<HStack>
						<Text>{getCardName(player.bestHand.secondaryValue)}</Text>
						{player?.bestHand?.secondaryCardEdition! > 0 &&
							<Text
							fontSize={12}
							color={'gray.500'}
						>id:{player.bestHand.secondaryCardEdition}</Text>
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
		{content}
	  </Flex>
	);
}

export default PokerLeaderboardComponent;