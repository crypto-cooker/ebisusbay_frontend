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
} from "@chakra-ui/react"
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import styles from './App.module.scss';
import { createSuccessfulTransactionToastContent } from '@src/utils';
//contracts
import {constants, Contract} from "ethers";
import {ERC20} from "@src/Contracts/Abis";

import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import PurchaseFortune from "@src/Contracts/PurchaseFortune.json";
import './App.module.scss';

const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
})

import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";

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

        // Convert the desired amount of $Fortune to $USDC
        var desiredAmount = fortuneToPurchase / 1000;

        // Instantiate USDC contract and check how much USDC the user has already approved
        const usdcContract = new Contract(usdcAddress, ERC20, user.provider.getSigner());
        const allowance = await usdcContract.allowance(user.address, config.contracts.purchaseFortune);

        // If the user has not approved the token sale contract to spend enough of their USDC, approve it
        if (allowance.sub(desiredAmount) < 0) {
          await usdcContract.approve(config.contracts.purchaseFortune, constants.MaxUint256);
        }

        const purchaseFortuneContract = new Contract(config.contracts.purchaseFortune, PurchaseFortune, user.provider.getSigner());
        const tx = await purchaseFortuneContract.purchase(fortuneToPurchase)
        const receipt = await tx.wait();

        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        console.log('Purchased $Fortune!')

      } catch (error) {
        console.log(error)
      }
    } 
  }
  return (
    <Modal onClose={onClose} isOpen={isOpen}  size="lg"> 
    {/* isCentered */}
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
          {/* <ModalHeader className="text-center"></ModalHeader> */}
            {/* <ModalCloseButton color={getTheme(user.theme).colors.textColor4} /> */}
            {/* <ModalBody> */}

            <div style={{position:"absolute", width: "100%",height: "50%"}} justifyContent='center'>
              <Image src='img\battle-bay\bankinterior\bank_menu_background.png' style={{position:"absolute", zIndex:"1"}}/>

              <Box style={{position:"absolute", zIndex:"2",top:"0%",left:"0%",width: "100%",height: "100%"}} justifyContent='center'>
                
                <Text  fontSize='sm' theme={theme} className="font-link"></Text>
                <Grid
                  h='5px'
                  templateRows='repeat(2, 1fr)'
                  templateColumns='repeat(4, 1fr)'
                  gap={{ base: '2', md: '4'}} 
                  padding={{ base: '10', md: '12'}} 
                  >
                  <GridItem colSpan={4} bg=''>
                    <Center >
                      <Text className={[styles.gotham_xLight]}
                       style={{ textAlign:"right"}}
                       fontSize={{ base: '16px', md: '18px' }} 
                        >Fortune Purchase Menu</Text>
                    </Center>
                  </GridItem>

                  <GridItem 
                  colSpan={{ base: '2', md: '2' }} 
                  bg=''>
                    <Text className={[styles.gotham_book]}
                      fontSize={{ base: '12px', md: '12px' }} 
                     >How much $FRTN would you like to purchase? </Text>
                  </GridItem>
                  <GridItem colSpan={{ base: '2', md: '2' }}  bg=''>
                  <FormControl>
                    <NumberInput defaultValue={0} min={1000} name="quantity" 
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
                    <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '18px' }} >Current Price of $FRTN token: </Text>
                  </GridItem>
                  <GridItem colSpan={2} bg=''style={{ textAlign:"right"}}>
                    <Text fontSize={{ base: '12px', md: '18px' }}   >USD ${fortunePrice} </Text>
                  </GridItem>

                  <GridItem colSpan={2} bg=''>
                    <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '18px' }}  >Your total cost: </Text>
                  </GridItem>
                  <GridItem colSpan={2} bg=''style={{paddingBottom:"25%", textAlign:"right"}}>
                    <Text className={[styles.gotham_book]} fontSize={{ base: '12px', md: '18px' }}  >{totalPrice} </Text>
                  </GridItem>

                  <GridItem colSpan={4} style={{paddingBottom:"27%"}} >
                    <Center >
                    <Image style={{ content: buyImage, position:"absolute"}} 
                    width={{ base: '50%', md: '70%' }} 
                    height={{ base: '50px', md: '100px' }}
                      onMouseEnter={() => setbuyImage(buy_h)} onMouseOut={() => setbuyImage(buy)} onClick={() => attemptPurchase()}/> 
                    </Center>
                  </GridItem>
                  <GridItem colSpan={4}  >
                    <Center >
                    <Image src="/img/battle-bay/bankinterior/progress_bar_background.png" 
                    style={{ position:"absolute"}}
                    width={{ base: '95%', md: '95%' }} 
                    height={{ base: '50px', md: '70px' }}
                    marginTop={{ base: '-50px', md: '-75px' }}
                    /> 
                    <Image src="/img/battle-bay/bankinterior/progress_bar.png" 
                    style={{ position:"absolute"}}
                    width={{ base: '75%', md: '75%' }} 
                    height={{ base: '40px', md: '50px' }}
                    marginTop={{ base: '-50px', md: '-75px' }}
                    /> 
                    <Image src="/img/battle-bay/bankinterior/progress_bar_overlay.png" 
                    style={{ position:"absolute"}}
                    width={{ base: '75%', md: '75%' }} 
                    height={{ base: '40px', md: '50px' }}
                    marginTop={{ base: '-50px', md: '-75px' }}
                    /> 
                    </Center>
                  </GridItem>
                  
                </Grid>
              </Box>
            </div>
            {/* </ModalBody> */}
            {/* <ModalFooter className="border-0"/> */}
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

