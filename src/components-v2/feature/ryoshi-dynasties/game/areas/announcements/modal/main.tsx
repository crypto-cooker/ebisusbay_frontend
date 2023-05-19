import {useState} from "react";
import {Box, Center, Grid, GridItem, Stack, Text,Image, VStack, HStack, Flex, Spacer} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

interface Props {
  onShowLeaderboard: () => void;
}

const MainPage = ({onShowLeaderboard}: Props) => {
 
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const[dailyRewardClaimed, setDailyRewardClaimed] = useState(false);

  const claimReward = async () => {
    console.log('claim reward');
  }

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
      <Image  src="/img/battle-bay/announcementBoard/seashrineAd.png" w='100%'/>
      <Text 
        marginLeft={{base: '10%', sm: '10%'}}
        marginTop={{base: '-20%', sm: '-17%'}}
        fontSize={{ base: '24px', md: '24px' }} 
        position='absolute' 
        >SEASHRINE</Text>
      <Text 
        marginLeft={{base: '10%', sm: '10%'}}
        marginTop={{base: '-10%', sm: '-12%'}}
        fontSize={{ base: '12px', md: '12px' }} 
        position='absolute' 
        >RELOADED</Text>
      <Text 
        marginLeft={{base: '10%', sm: '50%'}}
        marginTop={{base: '-10%', sm: '-17%'}}
        fontSize={{ base: '0px', md: '16px' }} 
        position='absolute' 
        >Join in the quest for sea treasures</Text>
        <RdButton
          position='absolute' 
          marginLeft={{base: '62%', sm: '60%'}}
          marginTop={{base: '-12%', sm: '-12%'}}
          w={{base: '100px', sm: '150px'}}
          fontSize={{base: '8px', sm: 'sm'}}
          hideIcon={true}
          onClick={(e) => {
            e.preventDefault();
            window.location.href='https://seashrine.io/';
            }}
        >
          Visit Seashrine
        </RdButton>
      </Box> 

      <HStack justify='space-between' w='100%'>
        <Flex bg='#272523' rounded='md' 
           w={{base: '150px', sm: '270px'}}
           h={{base: '165px', sm: '165px'}}>
          <VStack padding='2' w='100%' >
            <Text className={gothamBook.className} fontSize={{ base: '12px', md: '24px' }}>Information</Text>
            <Text className={gothamBook.className} fontSize={{ base: '8px', md: '16px' }}>How To Play?</Text>
            <Text className={gothamBook.className} fontSize={{ base: '8px', md: '16px' }}>Want to place an ad?</Text>
            <Text className={gothamBook.className} fontSize={{ base: '8px', md: '16px' }}>About Ebisus's Bay</Text>
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
                hideIcon={true}
                onClick={claimReward}
              >
                {dailyRewardClaimed ? 'Return Tomorrow!' : 'Claim Daily Reward!'}
              </RdButton>
                {/* <Image src="/img/battle-bay/announcementBoard/Koban.svg"> </Image> */}
            </VStack>
          </Flex> 

          <Spacer h='2'/>

          <Flex bg='#272523' rounded='md'
          w={{base: '150px', sm: '300px'}}
          h={{base: '30px', sm: '50px'}}
          >
            <VStack padding='2' w='100%' 
            onClick={onShowLeaderboard}>
              <Text 
                textAlign='center'
                className={gothamBook.className} 
                fontSize={{ base: '12px', md: '16px' }}
                > View Leaderboards</Text>
            </VStack>
          </Flex> 
        </VStack>
        </Flex>
      </HStack>
    </VStack>
  );
}

export default MainPage;