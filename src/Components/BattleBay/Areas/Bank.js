import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Box,
  Flex,
  Image,
  useDisclosure,
  useMediaQuery,
  Text,

} from '@chakra-ui/react';

import WithdrawForm from './bank/components/WithdrawForm';
import StakeFortune from './bank/components/StakeFortune';
import StakeNFTs from './bank/components/StakeNFTs';

import styles from './App.module.scss';
import { Stack } from 'react-bootstrap';

const Bank = ({onBack}) => {

  const { isOpen: isOpenStakeFortune, onOpen: onOpenStakeFortune, onClose: onCloseStakeFortune} = useDisclosure();
  const { isOpen: isOpenStakeNFTs, onOpen: onOpenStakeNFTs, onClose: onCloseStakeNFTs} = useDisclosure();
  const { isOpen: isOpenWithdraw, onOpen: onOpenWithdraw, onClose: onCloseWithdraw} = useDisclosure();

  var blink = 'img/battle-bay/gifBanker/eyeBlink.gif';
  var mouth = 'img/battle-bay/gifBanker/mouth.gif';
  var ok = 'img/battle-bay/gifBanker/OK.gif';
  var welcome = 'img/battle-bay/gifBanker/welcome.gif';

 var greetings = ['Greetings, traveler. I am the best person to talk to when it comes to your $Fortune possessions… or lack-thereof… which I could help you address.',
                  'Hail, brave hero! How may I assist you with your $Fortune possessions today? Stake, purchase, or withdraw?',
                  'Welcome, honored guest! Ready to ride the waves of fortune? Stake, purchase, or withdraw your tokens with me.',
                  'Welcome, traveler. It seems that since Ebisu has created all these Fortune tokens, that our world has gone through quite an evolution.', 
                  'I am here to help all citizens of the Lotus Galaxy stake, purchase or withdraw their tokens. How may I help?',
                  'Blessings, traveler! Let me guess, you want me to help with your Fortune possessions. Say no more. What can I do for you today?']
  
  const randomGreeting = useState(greetings[Math.floor(Math.random() * greetings.length)]);

  return (
    <section>

    <StakeFortune isOpen={isOpenStakeFortune} onClose={onCloseStakeFortune}/>
    <StakeNFTs isOpen={isOpenStakeNFTs} onClose={onCloseStakeNFTs}/>
    <WithdrawForm isOpen={isOpenWithdraw} onClose={onCloseWithdraw}/>

    <Box
     position='relative'
     bg=''
     h='calc(100vh - 74px)'
    >
      
      <div style={{position:"absolute", zIndex:"2",width: "40%", height: "100%", left:"0%",top:"5%"}} >
        <Image style={{position:"absolute"}} src='\img\battle-bay\bankinterior\banker_chat_background.png' /> 
        <Text 
        fontSize={{ base: '6px', md: '12px', lg:'16', xl: '18px' }} 
        padding ={{ base: '10px', md: '25px', lg:'40px', xl: '60px'}}
        style={{position:"absolute", zIndex:"3", color:"white"}} className={[styles.gotham_book]}>{randomGreeting}</Text>
      </div>

      <div style={{position:"absolute", zIndex:"1",width: "100%",height: "30%"}}>

      <div style={{position:"absolute", zIndex:"1"}} >
        <Image src='img/battle-bay/bankinterior/bank_interior_background_desktop.png'
        height={{ base: '100%', md: '100%' }} 
        width={{ base: '100%', md: '100%' }}
        />
      </div>

      <div style={{position:"absolute", zIndex:"1",top:"60%",width: "40%",height: "100%"}}>
      </div>

      <div style={{position:"absolute", zIndex:"2",left:"80%",top:"30%"}}  >
        <Stack direction="row" spacing={1}>
          <Button style={{zIndex:"2"}} onClick={() => onOpenStakeFortune()}> Stake $Fortune </Button>
          <Button style={{zIndex:"2"}} onClick={() => onOpenStakeNFTs()}> Stake NFTs </Button>
          <Button style={{zIndex:"2"}} onClick={() => onOpenWithdraw()}> Emergency Withdraw </Button>
          <Button style={{zIndex:"2"}} onClick={() => onBack()}> Exit </Button>
        </Stack>
      </div>

      </div>
      </Box>

      <Flex margin={'24px'} justify={'center'}>
      </Flex>

    </section>
  )
};


export default Bank;