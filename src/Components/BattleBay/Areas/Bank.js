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
import PurchaseFortuneForm from './PurchaseFortuneForm';
import FortuneFAQForm from './FortuneFAQForm';
import styles from './App.module.scss';
import { Stack } from 'react-bootstrap';

const Bank = ({onBack}) => {

  const { isOpen: isOpenStake, onOpen: onOpenStake, onClose: onCloseStake} = useDisclosure();
  const { isOpen: isOpenFAQ, onOpen: onOpenWithdraw, onClose: onCloseFAQ} = useDisclosure();

  const [isLargerThan1280] = useMediaQuery('(min-width: 1280px)')
  const [powerUps, setPowerUps] = useState([])
  const [currentGif, setCurrentGif] = useState('img/battle-bay/gifBanker/eyeBlink.gif')

  const faq = 'url("/img/battle-bay/bankinterior/bank_button_FRTN_FAQ.png")';
  const faq_h = 'url("/img/battle-bay/bankinterior/bank_button_FRTN_FAQ_hover.png")';

  const buy = 'url("/img/battle-bay/bankinterior/bank_button_buy_fortune.png")';
  const buy_h = 'url("/img/battle-bay/bankinterior/bank_button_buy_fortune_hover.png")';

  const exit = 'url("/img/battle-bay/bankinterior/bank_button_exit.png")';
  const exit_h = 'url("/img/battle-bay/bankinterior/bank_button_exit_hover.png")';

  const [faqImage, setfaqImage] = useState(faq);
  const [buyImage, setbuyImage] = useState(buy);
  const [exitImage, setexitImage] = useState(exit);

  var blink = 'img/battle-bay/gifBanker/eyeBlink.gif';
  var mouth = 'img/battle-bay/gifBanker/mouth.gif';
  var ok = 'img/battle-bay/gifBanker/OK.gif';
  var welcome = 'img/battle-bay/gifBanker/welcome.gif';
  
  const breakpoints = {
    sm: '30em', // 480px
    md: '48em', // 768px
    lg: '62em', // 992px
    xl: '80em', // 1280px
    '2xl': '96em', // 1536px
  }

 var greetings = ['Greetings, traveler. I am the best person to talk to when it comes to your $Fortune possessions… or lack-thereof… which I could help you address.',
                  'Hail, brave hero! How may I assist you with your $Fortune possessions today? Stake, purchase, or withdraw?',
                  'Welcome, honored guest! Ready to ride the waves of fortune? Stake, purchase, or withdraw your tokens with me.',
                  'Welcome, traveler. It seems that since Ebisu has created all these Fortune tokens, that our world has gone through quite an evolution.', 
                  'I am here to help all citizens of the Lotus Galaxy stake, purchase or withdraw their tokens. How may I help?',
                  'Blessings, traveler! Let me guess, you want me to help with your Fortune possessions. Say no more. What can I do for you today?']
  
  const randomGreeting = useState(greetings[Math.floor(Math.random() * greetings.length)]);

  useEffect(() => {
    setCurrentGif(blink);
    // talk();
  }, [])

  useEffect(() => {
    setPowerUps([<Button height={'20px'}>Power Ups</Button>])
  }, [])

  const talk = async () => {
    setCurrentGif(mouth);
    console.log(randomGreeting)
    await new Promise(r => setTimeout(r, 1000));
    setCurrentGif(blink);
  }

  return (
    <section>

    <PurchaseFortuneForm isOpen={isOpenStake} onClose={onCloseStake}/>
    <FortuneFAQForm isOpen={isOpenFAQ} onClose={onCloseFAQ}/>

    <Box
     position='relative'
     bg=''
     h='calc(100vh - 74px)'
    >
      <Box p='6'>
      
      <div style={{position:"absolute", zIndex:"2",width: "40%", height: "100%", left:"0%",top:"5%"}} >
        <Image style={{position:"absolute"}} src='\img\battle-bay\bankinterior\banker_chat_background.png' /> 
        <Text 
        fontSize={{ base: '6px', md: '12px', lg:'16', xl: '18px' }} 
        padding ={{ base: '10px', md: '25px', lg:'40px', xl: '60px'}}
        style={{position:"absolute", zIndex:"3", color:"white"}} className={[styles.gotham_book]}>{randomGreeting}</Text>
    </div>

      <div style={{position:"absolute", zIndex:"1",width: "95%",height: "30%"}}>

      <div style={{position:"absolute", zIndex:"1"}} >
        <Image src='img/battle-bay/bankinterior/bank_interior_background_desktop.png'
        height={{ base: '100%', md: '100%' }} 
        width={{ base: '100%', md: '100%' }}
        />
      </div>

      <div style={{position:"absolute", zIndex:"1",bottom:"5%",width: "50%",height: "100%"}}>
        <Image src={currentGif} style={{position:"absolute", zIndex:"2"}}/>
      </div>

      

      <div style={{position:"absolute", zIndex:"2",left:"80%",top:"30%"}}  >
        <Stack direction="row" spacing={1}>
          <Image style={{ content: buyImage }} onMouseEnter={() => setbuyImage(buy_h)} onMouseOut={() => setbuyImage(buy)} onClick={() => onOpenStake()}
          /> 
          <Image style={{ content: exitImage }} onMouseEnter={() => setexitImage(exit_h)} onMouseOut={() => setexitImage(exit)} onClick={() => onBack()}/> 
           {/* <div style={{position:"absolute", zIndex:"2",width: "20%", height: "100%", left:"80%",top:"65%"}} onClick={() => onOpenWithdraw()}>
          <Image style={{ content: faqImage }} onMouseEnter={() => setfaqImage(faq_h)} onMouseOut={() => setfaqImage(faq)} /> 
        </div> */}
        </Stack>
      </div>

      </div>
      </Box>

      <Flex margin={'24px'} justify={'center'}>
      </Flex>

      </Box>
    </section>
  )
};


export default Bank;