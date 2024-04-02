import React, {useContext, useEffect, useRef, useState} from "react";
import {Box, Grid, GridItem, Image, Link, Text, useMediaQuery, VStack} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {useRouter} from "next/router";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import ImageService from "@src/core/services/image";
import NextImage from "next/image";
import NextLink from "next/link";
import {useUser} from "@src/components-v2/useUser";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

interface Props {
  handleShowLeaderboard: () => void;
  onOpenDailyCheckin: () => void;
}

const MainPageOld = ({handleShowLeaderboard, onOpenDailyCheckin}: Props) => {
  const router = useRouter();
  const { user: rdUserContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [isMobile] = useMediaQuery("(max-width: 480px)");
  const user = useUser();

  //timer
  const Ref = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState('00:00:00');
  const [canClaim, setCanClaim] = useState(false);

    //timer functions
  const getTimeRemaining = (e:any) => {
    const total = Date.parse(e) - Date.now();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
        total, days, hours, minutes, seconds
    };
  }
  const startTimer = (e:any) => {
      let { total, hours, days, minutes, seconds } = getTimeRemaining(e);
      if (total >= 0) {
          setTimer(
              ((days) > 0 ? (days + ' days ') : (
              (hours > 9 ? hours : '0' + hours) + ':' +
              (minutes > 9 ? minutes : '0' + minutes) + ':' +
              (seconds > 9 ? seconds : '0' + seconds)))
          )
      }
  }
  const clearTimer = (e:any) => {
    startTimer(e);
    if (Ref.current) clearInterval(Ref.current as any);
    const id = setInterval(() => { startTimer(e); }, 1000) 
    Ref.current = id;
  }

  useEffect(() => {
      if (!user.address || !rdUserContext) {
        setCanClaim(false);
        return;
      }

      const claimData = rdUserContext.dailyRewards;
      if(!claimData.nextClaim) {
        setCanClaim(true);
      } else if(Date.parse(claimData.nextClaim) <= Date.now()) {
        setCanClaim(true);
      } else {
        setCanClaim(false);
        clearTimer(claimData.nextClaim);
      }
  }, [user.address, rdUserContext])

  return (
    <VStack padding='2'>
      <RdModalBox textAlign='center'>
        <Text>
          Welcome to Ryoshi Dynasties by Ebisu's Bay! A captivating gamified DAO experience, combining NFT marketplace, battles, and strategic gameplay. Build your dynasty, collect rare NFTs, and earn rewards.
        </Text>
      </RdModalBox>
      <Box 
        bg='#272523'
        rounded='md'
        //  backgroundImage="/img/battle-bay/announcementBoard/seashrineAd.png"
        minWidth='100%'
        minHeight='100%'
        position='relative'
        overflow='hidden'
      >
      {/* <Image position='absolute' src="/img/battle-bay/announcementBoard/seashrineAd.png"/> */}
      {/*<Image */}
      {/*//  src="/img/battle-bay/announcementBoard/seashrineAd.png" */}
      {/*  src="/img/battle-bay/imgs/vvs.png" */}
      {/*  w='100%'*/}
      {/*  // filter={sepia(100%) saturate(300%) brightness(70%) hue-rotate(180deg);}*/}
      {/*  // filter={'brightness(0.7)' + ' ' + 'sepia(0.1)'}*/}
      {/*  filter={'brightness(0.8)'}*/}
      {/*/>*/}
        <Link as={NextLink} href='https://swap.ebisusbay.com/#/swap?outputCurrency=0xaF02D78F39C0002D14b95A3bE272DA02379AfF21' isExternal>
          {isMobile ? (
            <Image
              alt="Buy FRTN on VVS"
              src={ImageService.translate('/img/ryoshi-dynasties/announcements/ads/vvs-sm.gif').convert()}
            />
          ) : (
            <Image
              alt="Buy FRTN on VVS"
              src={ImageService.translate('/img/ryoshi-dynasties/announcements/ads/vvs.webp').convert()}
            />
          )}
        </Link>
      {/* <Text 
        marginLeft={{base: '10%', sm: '10%'}}
        marginTop={{base: '-20%', sm: '-17%'}}
        fontSize={{ base: '24px', md: '24px' }} 
        position='absolute'
        as='b'
        >SEASHRINE</Text>
      <Text 
        marginLeft={{base: '10%', sm: '10%'}}
        marginTop={{base: '-10%', sm: '-12%'}}
        fontSize={{ base: '12px', md: '12px' }} 
        position='absolute' 
        as='b'
        >RELOADED</Text>
      <Text 
        marginLeft={{base: '10%', sm: '50%'}}
        marginTop={{base: '-10%', sm: '-17%'}}
        fontSize={{ base: '0px', md: '16px' }} 
        position='absolute' 
        as='b'
        >Join in the quest for sea treasures</Text> */}
      </Box>

      <Grid
        h='240px'
        templateRows='repeat(2, 1fr)'
        templateColumns='repeat(4, 1fr)'
        gap={3}
        w='full'
      >
        <GridItem rowSpan={2} colSpan={2} bg='#272523' p={4} textAlign='center' rounded='md'>
          <Text fontSize={{ base: 'sm', md: 'xl' }} fontWeight='bold'>Information</Text>
          <VStack mt={4}>
            <Box
              as="button"
              bg=""
              py={1}
              px={4}
              rounded="md"
              className={gothamBook.className}
              color="white"
              _hover={{ bg: "yellow.900" }}
              _focus={{ boxShadow: "outline" }}
              onClick={() => {
                window.open('https://ebisusbay.notion.site/ebisusbay/Ryoshi-Dynasties-8cb0bb21ad194af092cf1e1f8a8846c6','_blank');
              }}
            >
              Whitepaper
            </Box>
            <Box
              as="button"
              bg=""
              py={1}
              px={4}
              rounded="md"
              className={gothamBook.className}
              color="white"
              _hover={{ bg: "yellow.900" }}
              _focus={{ boxShadow: "outline" }}
              onClick={() => {
                router.push('/marketplace');
              }}
            >
              Marketplace
            </Box>
            <Box
              as="button"
              bg=""
              py={1}
              px={4}
              rounded="md"
              className={gothamBook.className}
              color="white"
              _hover={{ bg: "yellow.900" }}
              _focus={{ boxShadow: "outline" }}
              onClick={() => {
                window.open('https://swap.ebisusbay.com/#/swap?outputCurrency=0xaF02D78F39C0002D14b95A3bE272DA02379AfF21','_blank');              }}
            >
              Buy FRTN
            </Box>
          </VStack>
        </GridItem>
        <GridItem colSpan={2} bg='#272523' p={2} textAlign='center' rounded='md'>
          <Text fontSize={{ base: 'sm', md: 'md' }}>Claim Daily Rewards</Text>
          <RdButton
            mt={2}
            w='full'
            maxW='200px'
            fontSize={{base: '12px', sm: 'md'}}
            onClick={onOpenDailyCheckin}
          >
            {canClaim ? 'Claim Now!' : 'Claim in ' + timer}
          </RdButton>
        </GridItem>
        <GridItem colSpan={2} bg='#272523' p={2} textAlign='center' rounded='md'>
          <Text fontSize={{ base: 'sm', md: 'md' }}>Leaderboards</Text>
            <RdButton
              mt={2}
              w='full'
              maxW='200px'
              fontSize={{base: '12px', sm: 'md'}}
              onClick={handleShowLeaderboard}
            >
              View Leaderboards
            </RdButton>
        </GridItem>
      </Grid>
    </VStack>
  );
}

export default MainPageOld;