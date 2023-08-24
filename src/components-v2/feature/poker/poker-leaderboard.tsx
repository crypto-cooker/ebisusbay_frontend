import {useInfiniteQuery} from "@tanstack/react-query";
import { Center, Spinner, Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { ApiService } from "@src/core/services/api-service";
import {Text,Grid, GridItem, Flex,SimpleGrid } from "@chakra-ui/react";
import {getHandName, getCardName, Player } from "@src/core/poker-rank-players";
import { useEffect, useState, Fragment } from "react";
import {RankPlayers} from "@src/core/poker-rank-players"


const PokerLeaderboardComponent = () => {

	const [rankedPlayers, setRankedPlayers] = useState<Player[]>([])
  	const params = {} // whatever needed
	const { data, fetchNextPage, hasNextPage, status, error 
	} = useInfiniteQuery(['RyoshiDiamondsLeaderboard'],
	  ({pageParam = 1}) => ApiService.withoutKey().getRyoshiDiamondsLeaderboard(), {
		getNextPageParam: (lastPage, pages) => {
	      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
	    },
	    refetchOnWindowFocus: false,
	    staleTime: 60,
	    cacheTime: 65
	  }
	)

	const Rank = async() => {
		const newPlayers = await RankPlayers(data?.pages[0])
		setRankedPlayers(newPlayers)
	}

	useEffect(() => {
		if(!data) return;
		// console.log(data)
		Rank();

	}, [data])

	const printCardRanks = (cardRanks: number[]) => {
		let cardRanksString = "";
		cardRanks.sort((a, b) => b - a);
		cardRanks.forEach((cardRank) => {
		  cardRanksString += getCardName(cardRank) + " ";
		//   cardRanksString += cardRank + " ";
		})
		return cardRanksString;
	  }
	
	//   useEffect(() => {
	// 	if(players.length === 0) return;
	
	// 	players.forEach(
	// 	  (player) => {
	// 		player.bestHand = SearchForHand(player.cardRanks);
	// 		// console.log(player.address + " " + getHandName(player.bestHand.handRef) + " " + getCardName(player.bestHand.primaryValue) + " " + getCardName(player.bestHand.secondaryValue))
	// 	  }
	// 	)
	// 	console.log(players)
	// 	RankPlayersByCards(players);
	//   }, [players])
	
	// const content = useMemo(() => {
	// 	console.log("UseMemo " + data)
	// 	return status === "loading" ? (
	// 	  <Center>
	// 		<Spinner />
	// 	  </Center> 
	// 	) : status === "error" ? (
	// 	  <Box textAlign='center'>
	// 		Error: {(error as any).message}
	// 	  </Box>
	// 	) : (
	// 	  <>
	// 	  <Text>Poker Component</Text>
	// 	  {console.log(data)}
	// 	  {/* {data?.pages.map((items, index) => (
	// 		<Fragment key={index}>
	// 			{items.data.map((player, index) => (
	// 			<Box key={`${player.address}`}>
	// 			  <Text>{player.address}</Text>
	// 			</Box>
	// 		  ))}
	// 		</Fragment>
	// 		))} */}

	// 		{/* <Grid 
	// 			templateColumns="repeat(5, 1fr)"
	// 			gap={0}
	// 		>
	// 			<GridItem>
	// 				<Text>Address</Text>
	// 			</GridItem>
		
	// 			<GridItem w={'200px'}>
	// 				<Text>Hand Rank</Text>
	// 			</GridItem>
		
	// 			<GridItem >
	// 				<Text>Primary</Text>
	// 			</GridItem>
		
	// 			<GridItem>
	// 				<Text>Secondary</Text>
	// 			</GridItem>
		
	// 			<GridItem>
	// 				<Text>All Cards</Text>
	// 			</GridItem>
		
	// 			{rankedPlayers.map((player) => (
	// 			<>
	// 			<GridItem>
	// 				<Text>{player.address}</Text>
	// 			</GridItem>
		
	// 			<GridItem>
	// 				<Text>{getHandName(player.bestHand.handRef)} ({player.bestHand.handDescription})</Text>
	// 			</GridItem>
		
	// 			<GridItem>
	// 				<Text>{getCardName(player.bestHand.primaryValue)}</Text>
	// 			</GridItem>
		
	// 			<GridItem>
	// 				<Text>{getCardName(player.bestHand.secondaryValue)}</Text>
	// 			</GridItem>
		
	// 			<GridItem>
	// 				<Text fontSize={'sm'}>{printCardRanks(player.cardRanks)}</Text>
	// 			</GridItem>
	// 			</>
	// 			))}
	// 		</Grid> */}
			
	// 	  </>
	// 	)
	// 	}, [data, status]);
	
	return (
	  <Box
	  >
			<SimpleGrid  
				border={'2px solid white'}
				maxW={'1600px'}
			 	columns={7}
				// templateColumns="repeat(5, 1fr)"
				gap={0}
				justifyItems='left'
				padding={4}
			>
				<GridItem maxW='50px' >
					<Text>Rank</Text>
				</GridItem>

				<GridItem  w='50%' > 
					<Text>Address</Text>
				</GridItem>
		
				<GridItem w={'100%'}>
					<Text>Best Hand</Text>
				</GridItem>
		
				<GridItem >
					<Text>Primary</Text>
				</GridItem>
		
				<GridItem>
					<Text>Secondary</Text>
				</GridItem>

				<GridItem>
					<Text>Secondary Card Edition</Text>
				</GridItem>
		
				<GridItem>
					<Text>All Cards</Text>
				</GridItem>
		
				{rankedPlayers.map((player: Player, i : number) => (
				<>
				<GridItem maxW='50px'  >
					{i+1}
				</GridItem>

				<GridItem  w='50%' >
					<Text>{player.address.slice(0,10)}</Text>
				</GridItem>
		
				<GridItem w={'100%'}>
					<Text>{getHandName(player.bestHand.handRef)} ({player.bestHand.handDescription})</Text>
				</GridItem>
		
				<GridItem>
					<Text>{getCardName(player.bestHand.primaryValue)}</Text>
				</GridItem>
		
				<GridItem>
					<Text>{getCardName(player.bestHand.secondaryValue)}</Text>
				</GridItem>

				<GridItem>
					<Text>{player.bestHand.secondaryCardEdition}</Text>
				</GridItem>
		
				<GridItem>
					<Text fontSize={12}>{printCardRanks(player.cardRanks)}</Text>
				</GridItem>
				</>
				))}
			</SimpleGrid > 
		 {/* {content} */}
	  </Box>
	);
}

export default PokerLeaderboardComponent;