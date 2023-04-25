import { useState, useRef, useEffect } from 'react';
import {
  Heading,
  
  Select,
  Button,
  Box,
  Flex,
  Text,
  Spacer,
  Container,
  List,
  ListItem,
  UnorderedList,
  Center,
  Image,
  VStack,
  StackDivider,
  useDisclosure,
  AspectRatio,
  useMediaQuery,
  ImageBackground,

} from '@chakra-ui/react';
import StakeForm from './StakeForm';
import WithdrawForm from './WithdrawForm';
// note: 1 troop for 500 tokens with minimum lock period
const Bank = ({onBack}) => {

  const { isOpen: isOpenStake, onOpen: onOpenStake, onClose: onCloseStake} = useDisclosure();
  const { isOpen: isOpenWithdraw, onOpen: onOpenWithdraw, onClose: onCloseWithdraw} = useDisclosure();

  const [isLargerThan1280] = useMediaQuery('(min-width: 1280px)')
  const [powerUps, setPowerUps] = useState([])
  const [currentGif, setCurrentGif] = useState('img/battle-bay/gifBanker/eyeBlink.gif')
  var blink = 'img/battle-bay/gifBanker/eyeBlink.gif';
  var mouth = 'img/battle-bay/gifBanker/mouth.gif';
  var ok = 'img/battle-bay/gifBanker/OK.gif';
  var welcome = 'img/battle-bay/gifBanker/welcome.gif';

  useEffect(() => {
    setPowerUps([<Button height={'20px'}>Power Ups</Button>])
  }, [])

  const talk = async () => {
    setCurrentGif(mouth);
    await new Promise(r => setTimeout(r, 1000));
    setCurrentGif(blink);
  }

  return (
    <section>
    <Box
     position='relative'
     bg=''
     h='calc(100vh - 74px)'
   >

      {/* <Image src='img/battle-bay/bankinterior/bankBackground.png' position={'absolute'} /> */}
      <Box p='6'>
      <div style={{position:"absolute", zIndex:"1",width: "95%",height: "30%"}}>
        <div style={{position:"absolute", zIndex:"1",width: "100%",height: "100%"}} >
        <Image src='img/battle-bay/bankinterior/bankBackground.png' />
        </div>
        <div style={{position:"absolute", zIndex:"1",bottom:"5%",width: "50%",height: "100%"}}>
        <Image src={currentGif} style={{position:"absolute", zIndex:"2"}}/>
        </div>
        <div style={{position:"absolute", zIndex:"1",left:"50%",width: "40%",height: "40%"}} justifyContent='center'>
          <Image src='img\battle-bay\bankinterior\bank_menu_background.png' style={{position:"absolute", zIndex:"2"}}/>
          <Button justifyContent={'center'} w='200px' zIndex={"7"} colorScheme='blue' onClick={() => {talk()}}>Talk</Button>
      <Button zIndex={"7"} position={'absolute'} colorScheme='blue'  onClick={onBack}>Back to Village Map</Button>
        </div>
      </div>
        
        
        {/* scale:"50%", marginTop: "-33.5%", marginLeft: "-27%", */}
      </Box>

      

      {/* <StakeForm isOpen={isOpenStake} onClose={onCloseStake}/>
      <WithdrawForm isOpen={isOpenWithdraw} onClose={onCloseWithdraw}/> */}


        <Heading className="title text-center">Bank</Heading>
        <Heading size='m' textAlign={'center'}>Stake your Fortune to obtain Mitama</Heading>


        <Flex margin={'24px'} justify={'center'}>
          {/* <Button justifyContent={'center'} w='200px' margin={2} colorScheme='white' variant='outline'
                  onClick={() => {onOpenStake()}}>Stake Fortune</Button>
          <Button justifyContent={'center'} w='200px' margin={2} colorScheme='red' variant='outline'
                  onClick={() => {onOpenWithdraw()}}>Emergency Withdraw</Button> */}

          
        </Flex>
          
        {/* <Box textAlign={'center'} marginBottom={'36px'}>
          <p>To receive $Mitama, you must stake $Fortune for AT LEAST the duration of 1 season (90 days).
          If you stake longer than 1 season, you will receive bonus spirit multiplier for each additional season.
          APR from staking goes into the seasonal release pool for user.
          These rewards will be released linearly counting down to end of current season. 
          You can spend out of your rewards pool early to buy {powerUps} without penalty.
          </p>
        </Box> */}


      {/* <Text>
        {isLargerThan1280 ? 'desktop' : 'mobile'}
      </Text> */}
        
{/* 
      <Heading size='m' textAlign={'center'}>APR</Heading>
        <p>Staking will also generate a traditional APR yield with boosts per season locked.
        </p> */}
      {/* <VStack
      divider={<StackDivider borderColor='gray.200' />}
      spacing={4}
      align='stretch'>
      
      
      <Spacer />
      <Box>
        <UnorderedList>
          <ListItem>1 season 12%</ListItem>
          <ListItem>2 17%</ListItem>
          <ListItem>3 20%</ListItem>
          <ListItem>4 30%</ListItem>
          <ListItem>8 120%</ListItem>
          <ListItem>12 200%</ListItem>
        </UnorderedList>
      </Box>

      </VStack> */}
    
      

      </Box>
    </section>
  )
};


export default Bank;