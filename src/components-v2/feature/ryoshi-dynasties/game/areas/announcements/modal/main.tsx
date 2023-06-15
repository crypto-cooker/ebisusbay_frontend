import React, {useEffect, useRef, useState} from "react";
import {Box, Center, Grid, GridItem, Stack, Text,Image, VStack, HStack, Flex, Spacer} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import {getRewardsStreak} from "@src/core/api/RyoshiDynastiesAPICalls";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

interface Props {
  handleShowLeaderboard: () => void;
  onOpenDailyCheckin: () => void;
}

const MainPage = ({handleShowLeaderboard, onOpenDailyCheckin}: Props) => {
 
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const [isLoading2, getSigner] = useCreateSigner();

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
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => { startTimer(e); }, 1000) 
    Ref.current = id;
  }

  const getRewardsStreakData = async () => {
    if (!user.address) return;

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await getRewardsStreak(user.address, signatureInStorage);
        if(!data.data.data.nextClaim || data.data.data.nextClaim <= Date.now()) {
          setCanClaim(true)
        }
        else{
          setCanClaim(false)
          clearTimer(data.data.data.nextClaim)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
      getRewardsStreakData();
  }, [user.address])


  return (
    <VStack padding='2'>
      <Box 
       bg='#272523' 
       rounded='md' 
      //  backgroundImage="/img/battle-bay/announcementBoard/seashrineAd.png"
       minWidth='100%'
       minHeight='100%'
       position='relative'
       >
      {/* <Image position='absolute' src="/img/battle-bay/announcementBoard/seashrineAd.png"/> */}
      <Image 
      //  src="/img/battle-bay/announcementBoard/seashrineAd.png" 
        src="/img/battle-bay/imgs/vvs.png" 
        w='100%'
        // filter={sepia(100%) saturate(300%) brightness(70%) hue-rotate(180deg);}
        // filter={'brightness(0.7)' + ' ' + 'sepia(0.1)'}
        filter={'brightness(0.8)'}
        />
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
        <RdButton
          position='absolute' 
          marginLeft={{base: '30%', sm: '32%'}}
          marginTop={{base: '-12%', sm: '-12%'}}
          // marginLeft={{base: '62%', sm: '60%'}}
          // marginTop={{base: '-12%', sm: '-12%'}}
          w={{base: '125px', sm: '200px'}}
          fontSize={{base: '8px', sm: 'sm'}}
          hoverIcon={false}
          onClick={() => {
            window.location.href='https://seashrine.io/';
            }}
        >
          Farm Fortune on VVS
        </RdButton>
      </Box> 

      <HStack justify='space-between' w='100%'>
        <Flex bg='#272523' rounded='md' 
           w={{base: '150px', sm: '270px'}}
           h={{base: '185px', sm: '185px'}}>
          <VStack padding='2' w='100%' >
            <Text className={gothamBook.className} fontSize={{ base: '12px', md: '24px' }}>Information</Text>
            <Box
              as="button"
              bg=""
              py={1}
              px={4}
              ml={3}
              rounded="md"
              className={gothamBook.className} fontSize={{ base: '8px', md: '16px' }}
              color="white"
              _hover={{ bg: "yellow.900" }}
              _focus={{ boxShadow: "outline" }}
              onClick={() => {
                window.location.href='https://seashrine.io/';
                }}
            >
              Token Launch
            </Box>
            <Box
              as="button"
              bg=""
              py={1}
              px={4}
              ml={3}
              rounded="md"
              className={gothamBook.className} fontSize={{ base: '8px', md: '16px' }}
              color="white"
              _hover={{ bg: "yellow.900" }}
              _focus={{ boxShadow: "outline" }}
              onClick={() => {
                window.location.href='https://seashrine.io/';
                }}
            >
              Kickstarter
            </Box>
            <Box
              as="button"
              bg=""
              py={1}
              px={4}
              ml={3}
              rounded="md"
              className={gothamBook.className} fontSize={{ base: '8px', md: '16px' }}
              color="white"
              _hover={{ bg: "yellow.900" }}
              _focus={{ boxShadow: "outline" }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href='https://seashrine.io/';
                }}
            >
              Whitepaper
            </Box>
          </VStack>
        </Flex> 
        <Flex>

        <VStack w='100%' >
          <Flex bg='#272523' rounded='md'
          w={{base: '150px', sm: '300px'}}
          h={{base: '125px', sm: '100px'}}
          >
            <VStack padding='2' w='100%' >
              <Text textAlign='center'
                className={gothamBook.className} 
                fontSize={{ base: '12px', md: '16px' }}
                > Claim Checkin Rewards</Text>
              <Spacer h='4'/>
              <RdButton
                w={{base: '125px', sm: '250px'}}
                fontSize={{base: 'sm', sm: 'md'}}
                hoverIcon={false}
                onClick={onOpenDailyCheckin}
              >
                {canClaim ? 'Claim Daily Reward!' : 'Claim in ' + timer}
              </RdButton>
                {/* <Image src="/img/battle-bay/announcementBoard/Koban.svg"> </Image> */}
            </VStack>
          </Flex> 

          <Spacer h='2'/>

          <Flex bg='#272523' rounded='md'
          w={{base: '150px', sm: '300px'}}
          h={{base: '48px', sm: '60px'}}
          >
            <VStack padding='2' w='100%' 
            onClick={handleShowLeaderboard}>
              <RdButton 
                textAlign='center'
                // className={gothamBook.className} 
                // fontSize={{ base: '12px', md: '16px' }}
                fontSize={{base: '8px', sm: 'sm'}}
                > View Leaderboards</RdButton>
            </VStack>
          </Flex> 
        </VStack>
        </Flex>
      </HStack>
    </VStack>
  );
}

export default MainPage;