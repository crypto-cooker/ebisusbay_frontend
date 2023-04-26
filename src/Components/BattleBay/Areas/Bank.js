import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Box,
  Flex,
  Image,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import PurchaseFortuneForm from './PurchaseFortuneForm';
import WithdrawForm from './WithdrawForm';

const Bank = ({onBack}) => {

  const { isOpen: isOpenStake, onOpen: onOpenStake, onClose: onCloseStake} = useDisclosure();
  const { isOpen: isOpenWithdraw, onOpen: onOpenWithdraw, onClose: onCloseWithdraw} = useDisclosure();

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

    <PurchaseFortuneForm isOpen={isOpenStake} onClose={onCloseStake}/>
    <WithdrawForm isOpen={isOpenWithdraw} onClose={onCloseWithdraw}/>

    <Box
     position='relative'
     bg=''
     h='calc(100vh - 74px)'
    >
      <Box p='6'>
      <div style={{position:"absolute", zIndex:"1",width: "95%",height: "30%"}}>

      <div style={{position:"absolute", zIndex:"1",width: "100%",height: "100%"}} >
        <Image src='img/battle-bay/bankinterior/bank_interior_background_desktop.png' />
      </div>

      <div style={{position:"absolute", zIndex:"1",bottom:"5%",width: "50%",height: "100%"}}>
        <Image src={currentGif} style={{position:"absolute", zIndex:"2"}}/>
      </div>

      <div style={{position:"absolute", zIndex:"2",width: "20%", height: "100%", left:"80%",top:"35%"}} onClick={() => onOpenStake()}>
        <Image style={{ content: buyImage }} onMouseEnter={() => setbuyImage(buy_h)} onMouseOut={() => setbuyImage(buy)} /> 
      </div>

      <div style={{position:"absolute", zIndex:"2",width: "20%", height: "100%", left:"80%",top:"65%"}} onClick={() => onBack()}>
        <Image style={{ content: faqImage }} onMouseEnter={() => setfaqImage(faq_h)} onMouseOut={() => setfaqImage(faq)} /> 
      </div>

      <div style={{position:"absolute", zIndex:"2",width: "20%", height: "100%", left:"80%",top:"95%"}} onClick={() => onBack()}>
        <Image style={{ content: exitImage }} onMouseEnter={() => setexitImage(exit_h)} onMouseOut={() => setexitImage(exit)} /> 
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