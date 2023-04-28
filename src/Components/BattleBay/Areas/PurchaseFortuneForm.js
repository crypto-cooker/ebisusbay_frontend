import { useState, useRef, useEffect, Component} from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Flex,
  Spacer,
  Box,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Text,
  Image,
  extendTheme,
  Grid,
  GridItem,
  Center,
  Progress,
  Link,
  VStack,
  StackDivider,
  UnorderedList,
  ListItem,
  Stack

} from "@chakra-ui/react"
import { ExternalLinkIcon } from '@chakra-ui/icons'

import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

//contracts
import {constants, Contract} from "ethers";
import {ERC20} from "@src/Contracts/Abis";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import { createSuccessfulTransactionToastContent } from '@src/utils';
import FortunePresale from "@src/Contracts/FortunePresale.json"; 

import './App.module.scss';
import styles from './App.module.scss';

import { Spinner } from 'react-bootstrap';

const PurchaseFortuneForm = ({ isOpen, onClose}) => {

  const config = appConfig();
  const buy = 'url("/img/battle-bay/bankinterior/buy_FRTN_button.png")';
  const buy_h = 'url("/img/battle-bay/bankinterior/buy_FRTN_button_hover.gif")';
  const [buyImage, setbuyImage] = useState(buy);

  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const [fortuneToPurchase, setFortuneToPurchase] = useState(1000);
  const fortunePrice = 0.03;
  const [totalPrice, setTotalPrice] = useState(fortuneToPurchase * fortunePrice);

  //usdc and fortune wallet balances
  const [walletUSDC, setWalletUSDC] = useState(0);
  const [walletFortune, setWalletFortune] = useState(0);
  const [amountReserved, setAmountReserved] = useState(50);

  const updateFortuneAmount = (value) =>
  {
    setFortuneToPurchase(value);
    setTotalPrice(value * fortunePrice);
  }

  const attemptPurchase = async () => {

    // console.log(fortuneToPurchase)
    const usdcAddress = config.contracts.usdc;

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {

        setIsLoading(true);
        // Convert the desired amount of $Fortune to $USDC
        var desiredAmount = fortuneToPurchase / 1000;

        // Instantiate USDC contract and check how much USDC the user has already approved
        const usdcContract = new Contract(usdcAddress, ERC20, user.provider.getSigner());
        const allowance = await usdcContract.allowance(user.address, config.contracts.purchaseFortune);

        // If the user has not approved the token sale contract to spend enough of their USDC, approve it
        if (allowance.sub(desiredAmount) < 0) {
          await usdcContract.approve(config.contracts.purchaseFortune, constants.MaxUint256);
        }

        const purchaseFortuneContract = new Contract(config.contracts.purchaseFortune, FortunePresale, user.provider.getSigner());
        const tx = await purchaseFortuneContract.purchase(fortuneToPurchase)
        const receipt = await tx.wait();

        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        console.log('Purchased $Fortune!')

      } catch (error) {
        console.log(error)
      }
      setIsLoading(false);
    } 
  }

  const faqPanel = (
    <Grid
    h='5px'
    templateRows='repeat(2, 1fr)'
    templateColumns='repeat(4, 1fr)'
    gap={{ base: '1', md: '8'}} 
    padding={{ base: '10', md: '24'}} 
    >
    <GridItem colSpan={4} bg=''>
      <Center >
        <Text className={[styles.gotham_xLight]}
         style={{ textAlign:"right"}}
         fontSize={{ base: '16px', md: '48px' }} 
         marginTop={{ base: '-6px', md: '-12px' }}
          >Presale FAQ Page</Text>
      </Center>
    </GridItem>

    <GridItem colSpan={4} bg=''
         marginTop={{ base: '-6px', md: '-30px' }}
         >
      <Stack spacing={3}>
      <Text className={[styles.gotham_xLight]} fontSize={{ base: '12px', md: '12px' }} > ***As you approach the banker's counter, he looks up from his bag of Fortune tokens and greets you with a friendly smile.*** </Text>
      <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '16px' }} > Hello there, traveler. I couldn't help but notice that NFT you're carrying in your wallet. That tells me you're quite the loyal explorer of the Lotus Galaxy.</Text>
      <Text className={[styles.gotham_xLight]} fontSize={{ base: '12px', md: '12px' }} > ***The banker pauses for a moment, as he looks at you from your feet upwards.*** </Text>
      <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '16px' }} >You're in luck because we're currently holding a presale for Fortune tokens, 
      only for the hardiest of the explorers in the Lotus Galaxy, like yourself. Just as Ebisu would want it… </Text>
      <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '16px' }} > In this presale, the minimum purchase is 1000 tokens. Each token is priced at $0.03.</Text>
      <Text className={[styles.gotham_xLight]} fontSize={{ base: '12px', md: '12px' }} > ***The banker leans in closer and whispers,***</Text>
      <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '16px' }} >The tokens will be locked for three seasons and linearly released, but don't worry,
       you'll receive free registration for the season 1 of Ryoshi Dynasties and you will 
       have access to your troops during the vesting period. On top of that, you’ll be able to get beta access to Ryoshi Dynasties and practice your war strategies with testnet tokens.</Text>
      <Center>
      <UnorderedList>
        <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >1000, 5000, 25000, 50000, 250000</Text></ListItem>
        {/* <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >- 5000</Text></ListItem>
        <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >- 25000</Text></ListItem>
        <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >- 50000</Text></ListItem>
        <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >- 250000</Text></ListItem> */}
      </UnorderedList>
      </Center>
      
      <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '16px' }} >Only up to 1% of the total supply of Fortune tokens will be sold during the presale. Anything left over after one week will go to community rewards.</Text>
      <Text className={[styles.gotham_xLight]} fontSize={{ base: '12px', md: '12px' }} >***He leans back and gives you a reassuring smile.*** </Text>
      <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '16px' }} >"So, what do you say? Are you ready to purchase some tokens?</Text>
      <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '16px' }} >”… I wish I were an adventurer like you… </Text>
      <Text className={[styles.gotham_xLight]} fontSize={{ base: '12px', md: '12px' }} > ***he mumbles, silently, looking down.***</Text>
      </Stack>
    </GridItem>
  </Grid>
    // <VStack
    // align='center'
    // >
    // <Box>

    // </Box>

    // </VStack>
  )
  const purchasePanel = (
  <Grid
    h='5px'
    templateRows='repeat(2, 1fr)'
    templateColumns='repeat(4, 1fr)'
    gap={{ base: '1', md: '8'}} 
    padding={{ base: '10', md: '24'}} 
    >
    <GridItem colSpan={4} bg=''>
      <Center >
        <Text className={[styles.gotham_xLight]}
         style={{ textAlign:"right"}}
         fontSize={{ base: '16px', md: '48px' }} 
         marginTop={{ base: '-6px', md: '-12px' }}
          >Fortune Reservation Menu</Text>
      </Center>
    </GridItem>

    <GridItem colSpan={2} bg=''>
      <Image position='absolute' src='/img/battle-bay/bankinterior/usdc.svg' alt="walletIcon" 
      // width={{ base: '95%', md: '95%' }} 
      height={{ base: '15px', md: '30px' }}
      />
      <Text className={[styles.gotham_book]}
         marginLeft={{ base: '20px', md: '35px' }}
         fontSize={{ base: '12px', md: '24px' }}>USDC ${walletUSDC.toFixed(2)}</Text>
      <Link href='https://chakra-ui.com' isExternal className={[styles.gotham_book]} 
      fontSize={{ base: '8px', md: '16px' }}>Purchase additional USDC <ExternalLinkIcon mx='2px' /></Link >
    </GridItem>
    <GridItem colSpan={2} bg=''style={{ textAlign:"right"}}>
    <Image position='absolute' src='/img/battle-bay/bankinterior/fortune_token.svg' alt="walletIcon" 
      height={{ base: '15px', md: '30px' }}
      marginLeft={{ base: '42', md: '155' }}
      />
      <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '24px' }}>Fortune ${walletFortune.toFixed(2)} </Text>
    </GridItem>

    <GridItem 
    colSpan={{ base: '2', md: '2' }} 
    bg=''>
      <Text className={[styles.gotham_book]}
        fontSize={{ base: '12px', md: '24px' }} 
       >How much Fortune would you like to reserve? </Text>
    </GridItem>
    <GridItem colSpan={{ base: '2', md: '2' }}  bg=''
    size={{base:'md', md:'lg'}}>
    <FormControl>
      <NumberInput defaultValue={1000} min={1000} step={500}  name="quantity" 
        onChange={updateFortuneAmount}
        value={fortuneToPurchase} type ='number'>
      <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
        </NumberInput>
      </FormControl>
    </GridItem>

    <GridItem colSpan={2} bg=''>
      <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '24px' }} >Current Price of Fortune token: </Text>
    </GridItem>
    <GridItem colSpan={2} bg=''style={{ textAlign:"right"}}>
      <Text fontSize={{ base: '12px', md: '24px' }} 
      
        >USDC ${fortunePrice} </Text>
    </GridItem>

    <GridItem colSpan={2} bg=''>
      <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '24px' }}  >Your total cost: </Text>
    </GridItem>
    <GridItem colSpan={2} bg=''style={{paddingBottom:"25%", textAlign:"right"}}>
      <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '24px' }} >${totalPrice.toFixed(2)} </Text>
    </GridItem>

    <GridItem colSpan={4} 
    marginTop={{ base: '-10px', md: '-75px' }}
    >
      <Center >
      <Image style={{ content: buyImage, position:"absolute"}} 
      width={{ base: '50%', md: '351px' }} 
      height={{ base: '50px', md: '97px' }}
        onMouseEnter={() => setbuyImage(buy_h)} onMouseOut={() => setbuyImage(buy)} onClick={() => attemptPurchase()}/> 
      </Center>
    </GridItem>
    
    <GridItem colSpan={4} 
    marginTop={{ base: '10px', md: '-55px' }}
    >
      <Center >
      <Link href='https://cdn.ebisusbay.com/terms-of-service.html' isExternal className={[styles.gotham_book]} 
      fontSize={{ base: '6px', md: '12px' }}>By completing this purchase you agree to our terms of service<ExternalLinkIcon mx='2px' /></Link >

      </Center>
    </GridItem>
    

    <GridItem colSpan={4} 
    paddingTop={{ base: '25px', md: '55px' }}
    >
      <Center >
      <Image src="/img/battle-bay/bankinterior/progress_bar_background.png" 
      style={{ position:"absolute"}}
      width={{ base: '95%', md: '95%' }} 
      height={{ base: '50px', md: '70px' }}
      /> 
      {/* <Image src="/img/battle-bay/bankinterior/progress_bar.png" 
      style={{ position:"absolute"}}
      width={{ base: '75%', md: '100%' }} 
      height={{ base: '40px', md: '850px' }}
      />  */}
      <Progress style={{ position:"absolute"}} colorScheme='cyan' value={amountReserved}
      height= {{ base: '35px', md:'40px' }}
      width= {{ base: '280px', md: '700px' }}
      />
      <Image src="/img/battle-bay/bankinterior/progress_bar_overlay.png" 
      style={{ position:"absolute"}}
      width={{ base: '75%', md: '75%' }} 
      height={{ base: '40px', md: '50px' }}
      />  
      </Center>
    </GridItem>
  </Grid>)

  const [purchaseActive, setPurchaseActive] = useState(false);

  
  return (
    <Modal onClose={onClose} isOpen={isOpen}  size="xlg"> 
    {/* isCentered */}
      <ModalOverlay />
      <ModalContent >
        {!isLoading ? (
          <>
          {/* <ModalHeader className="text-center"></ModalHeader> */}
            {/* <ModalCloseButton color={getTheme(user.theme).colors.textColor4} /> */}
            {/* <ModalBody> */}
            <Center>
            <Box style={{position:"absolute", height: "70%"}}
            width={{ base: '100%', md: '50%'}} 
            marginTop={{ base: '0%', md: '10%'}}
             justifyContent='center'>
              <Center>
              <Image src='img\battle-bay\bankinterior\bank_menu_background.png' style={{ zIndex:"1"}}
                height={{ base: '100%', md: '100%'}}
                />
              </Center>
              <Box style={{position:"absolute", zIndex:"2",top:"0%",left:"0%",width: "100%",height: "100%"}} justifyContent='center'>
                

                 <Image 
                    style={{position:"absolute"}}
                    src="img\battle-bay\bankinterior\bank_menu_question.png"
                    zIndex='5'
                    marginTop={{ base: '10px', md: '30px' }}
                    marginLeft={{ base: '10px', md: '30px' }}
                    height={{ base: '45px', md: '100px'}}
                    onClick={() => setPurchaseActive(!purchaseActive)}
                    />
                  <Image 
                    style={{position:"absolute"}}
                    src="img\battle-bay\bankinterior\bank_menu_x.png"
                    zIndex='5'
                    marginTop={{ base: '10px', md: '30px' }}
                    marginLeft={{ base: '320px', md: '825px' }}
                    height={{ base: '45px', md: '100px'}}
                    onClick={() => onClose()}
                    />
                {purchaseActive==true ? purchasePanel : faqPanel}

              </Box>
            </Box>
            {/* </ModalBody> */}
            {/* <ModalFooter className="border-0"/> */}
            </Center>
          </>
        ) : (
          <Spinner animation="border" role="status" size="sm" className="ms-1">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </ModalContent>
    </Modal>
    
  )
}

export default PurchaseFortuneForm;

