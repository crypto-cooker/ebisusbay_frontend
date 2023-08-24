import {useInfiniteQuery} from "@tanstack/react-query";
import { Center, Spinner, Box, HStack } from "@chakra-ui/react";
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

	const PrintOutPlayerCards = (cardRanks: number[]) => {
		let cardRanksString = "";
		cardRanks.sort((a, b) => b - a);
		cardRanks.forEach((cardRank) => {
		  cardRanksString += getCardName(cardRank) + " ";
		//   cardRanksString += cardRank + " ";
		})
		return cardRanksString;
	  }
	
	return (
	  <Flex
		w={'100%'}
		justifyContent={'center'}
		>
			<SimpleGrid  
				border={'2px solid white'}
				maxW={'1000px'}
			 	columns={6}
				gap={0}
				justifyItems='left'
				padding={4}
				justifySelf={'center'}
				spacingX={8}
				gridTemplateColumns={'50px 250px 150px 50px 100px 150px'}
				// justifyItems={'center'}
			>
				<GridItem maxW='50px' >
					<Text>Rank</Text>
				</GridItem>

				<GridItem> 
					<Text>Address</Text>
				</GridItem>
		
				<GridItem >
					<Text>Best Hand</Text>
				</GridItem>
		
				<GridItem >
					<Text>Primary</Text>
				</GridItem>
		
				<GridItem>
					<Text>Secondary</Text>
				</GridItem>
		
				<GridItem>
					<Text>All Cards</Text>
				</GridItem>
		
				{rankedPlayers.map((player: Player, i : number) => (
				<>
				<GridItem maxW='50px'  >
					{i+1}
				</GridItem>

				<GridItem   >
					<Text isTruncated maxW={'250px'}>{player.address}</Text>
				</GridItem>
		
				<GridItem>
					<Text>{getHandName(player.bestHand.handRef)} ({player.bestHand.handDescription})</Text>
				</GridItem>
		
				<GridItem>
					<Text>{getCardName(player.bestHand.primaryValue)}</Text>
				</GridItem>
		
				<GridItem>
					<HStack>
						<Text>{getCardName(player.bestHand.secondaryValue)}</Text>
						<Text
							fontSize={12}
							color={'gray.500'}
						>id:{player.bestHand.secondaryCardEdition}</Text>
					</HStack>
				</GridItem>
		
				<GridItem>
					<Text isTruncated maxW={'150px'} fontSize={12}>{PrintOutPlayerCards(player.cardRanks)}</Text>
				</GridItem>
				</>
				))}
			</SimpleGrid > 
	  </Flex>
	);
}

export default PokerLeaderboardComponent;