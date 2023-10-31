import {useInfiniteQuery} from "@tanstack/react-query";
import { Center, Spinner, Box, HStack, useMediaQuery, VStack, Link, Button, useColorModeValue, Card,CardBody } from "@chakra-ui/react";
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
import {PokerCollection} from "@src/core/services/api-service/types";
import ImageService from "@src/core/services/image";
import {useAppSelector} from "@src/Store/hooks";

interface PokerLeaderboardProps {
	pokerCollection: PokerCollection;
}

const PokerLeaderboardComponent = ({pokerCollection} : PokerLeaderboardProps) => {
	const isMobile = useMediaQuery("(max-width: 768px)")[0];
	const [updatedAt, setUpdatedAt] = useState<string>();
	const user = useAppSelector(state => state.user);
	const hoverBackground = useColorModeValue('gray.100', '#424242');

	const GetRules = () => {
		switch(pokerCollection){
			case PokerCollection.Clubs:
				return 'https://blog.ebisusbay.com/crypto-hodlem-round-2-ryoshi-clubs-playing-cards-collection-6e7d869f87ee'
			case PokerCollection.Diamonds:
				return'https://blog.ebisusbay.com/unveiling-ebisus-bay-latest-playing-cards-collection-ryoshi-diamonds-c9298741f496'
			case PokerCollection.Live:	
				return 'https://blog.ebisusbay.com/crypto-hodlem-round-3-ryoshi-hearts-%EF%B8%8F-playing-cards-collection-e5ae3361c32e'
		}
	}
	
	const GenerateJson = () => {
		if(!data) return;

		interface Reward {
			address: string;
			amount: number;
		}

		const rewards: Reward[] = [];

		const GetRewardAmount = (index: number) => {
			if(index <= 15) return 8500;
			if(index <= 35) return 6500;
			if(index <= 65) return 5000;
			if(index <= 115) return 1700;
			if(index <= 215) return 350;
			if(index <= 315) return 200;
			return 0;
		}

		data.pages[0].data.forEach((player: any, i: number) => {
			if(i < 315){
				console.log(i, player)
				rewards.push({
					address: player.address,
					amount:	GetRewardAmount(i+1),
				})
			}
		})

		// data.pages[0].data.forEach((player: any, i: number) =>  {
		// 	if(i >= 314 && i < 400){
		// 		rewards.push({
		// 			address: player.address,
		// 			amount:	1
		// 		})
		// 	}
		// })

		function download(content:any, fileName:any, contentType:any ){
			const a = document.createElement("a");
			const file = new Blob([content], { type: contentType });
			a.href = URL.createObjectURL(file);
			a.download = fileName;
			a.click();
		} 

		// console.log(JSON.stringify(rewards));
		download(JSON.stringify(rewards), "diamondsRankedPlayersNFTS.json", "text/plain");
	}

	const { data, fetchNextPage, hasNextPage, status, error, dataUpdatedAt} = useInfiniteQuery({
		queryKey: ['RyoshiDiamondsLeaderboard'],
		queryFn: ({pageParam = 1}) => ApiService.withoutKey().getRyoshiDiamondsLeaderboardAtBlock(pageParam, 500, pokerCollection),
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => {
			return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
		},
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60
	})

	const loadMore = () => {
		fetchNextPage();
	  };

	useEffect(() => {
		if(!data) return; 
		// GenerateJson();
	}, [data])

	const [playerProfile, setPlayerProfile] = useState<Player>();
	const [playerRank, setPlayerRank] = useState<number>(0);

	const FindPlayerInData = () => {
		if(!data) return;
		if(!user.address) return;

		data.pages[0].data.map((player: Player, i : number) => (
			player.address === user.address && (
				setPlayerProfile(player),
				setPlayerRank(i+1)
			)
		))
	}

	useEffect(() => {
		if(!data) return;
		if(!user.address) return;
		FindPlayerInData();
		
	}, [data, user.address])

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

	    return status === 'pending' ? (

		<Card variant='outline' mt={2}>
           <CardBody textAlign='center'>
             <Text fontSize='xl' fontWeight='bold'>Preparing Leaderboard...</Text>
             <Text>Previous game winners will be available shortly!</Text>
				<Center>
					<Spinner />
				</Center>
           </CardBody>
          </Card> 
	    ) : status === "error" ? (
	      <Box textAlign='center'>
	        Error: {(error as any).message}
	      </Box>
	    ) : (<>
			<HStack>
		<Text fontSize={{base: 12, md:14}} textAlign='center'>Must be holding at least 5 cards to be ranked</Text>
			<Link 
				as={NextLink} 
				href={GetRules()} 
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
		
				<GridItem as='b'>
					<Text fontSize={{base: 12, md:14}}>Secondary</Text>
				</GridItem>
		
				{/* <GridItem as='b'>
					<Text>All Cards</Text>
				</GridItem> */}
				{user.address && (
					<>
					<GridItem backgroundColor={'gray.800'} colSpan ={4} _hover={{bg: hoverBackground}} rounded={'md'}>
					<HStack minW={'100%'} backgroundColor={'blue.800'} spacing={{base: 4, md: 12}} justifyItems='left' pb={2} pt={2}>
						<Text as={'b'} w={{base: '15px', md:'50px'}} fontSize={{base: 12, md:14}}>{playerRank === 0 ? "NA" : playerRank}</Text>
						<GridItem w={{base: '50px', md:'350px'}} >
							<Text fontSize={{base: 10, md:14}} noOfLines={1}>{isMobile ? shortAddress(user.address) : user.address}</Text>
						</GridItem>
						<GridItem w={{base: '125px', md:'150px'}}>
							<Text as={'b'} fontSize={{base: 12, md:14}}>
								{playerProfile ? 
								( getHandName(playerProfile.bestHand.handRef) + " (" 
								+ playerProfile.bestHand.handDescription + ")") : "NA"}
							</Text>
						</GridItem>
				
						{/* <GridItem>
							<Text>{playerProfile ? getCardName(playerProfile.bestHand.primaryValue) : "NA"}</Text>
						</GridItem> */}
				
						<GridItem w={{base: '50px', md:'100px'}}>
							<HStack>
								<Text as={'b'} >{ playerProfile ? getCardName(playerProfile.bestHand.secondaryValue) : "NA"}</Text>
								{playerProfile?.bestHand?.secondaryCardEdition! >= 0 &&
									<Text
									as={'b'} 
									fontSize={{base: 8, md:12}}
									color={'gray.500'}
								>id:{playerProfile && playerProfile.bestHand.secondaryCardEdition}</Text>
								}
							</HStack>
						</GridItem>
					</HStack>
					</GridItem>
					</>
				)}
				

		
				{data?.pages[0].data.map((player: Player, i : number) => (
				<>
				<GridItem maxW='50px'  >
				<Text fontSize={{base: 12, md:14}}> {i+1}</Text>
				</GridItem>

				<GridItem _hover={{bg: hoverBackground}}>
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
	  }, [data, status, playerProfile]);
	
	return (
	  <Flex w={'100%'} justifyContent={'center'} >
		<VStack>
			{pokerCollection === PokerCollection.Diamonds && updatedAt && <Text fontSize={{base: 12, md:14}} as={'i'} textAlign='center'>Snapshot taken at Sep-12-2023 04:00:01 PM +UTC</Text>}
			{pokerCollection === PokerCollection.Clubs && updatedAt && <Text fontSize={{base: 12, md:14}} as={'i'} textAlign='center'>Snapshot taken at Oct-12-2023 04:00:01 PM +UTC</Text>}
			{pokerCollection === PokerCollection.Live && updatedAt && <Text fontSize={{base: 12, md:14}} as={'i'} textAlign='center'>Last refreshed at {updatedAt}</Text>}
			{content}
		</VStack>
	  </Flex>
	);
}

export default PokerLeaderboardComponent;