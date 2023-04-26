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

//contracts
import {Contract} from "ethers";
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

    console.log(fortuneToPurchase)

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        // console.log(config.contracts.purchaseFortune)
        // console.log(PurchaseFortune)
        // console.log(user.provider.getSigner())
        // console.log(user.address.toLowerCase())
        //0x0000000000000000000000000000000000000001

        const purchaseFortuneContract = new Contract(config.contracts.purchaseFortune, PurchaseFortune, user.provider.getSigner());
        const tx = await purchaseFortuneContract.purchase(fortuneToPurchase)
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        console.log('Registered')
      } catch (error) {
        console.log(error)
      }
    } 
  }
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="lg" sx={{bgColor:"rgba(255, 0, 0, 0.3)"}}>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
          {/* <ModalHeader className="text-center"></ModalHeader> */}
            {/* <ModalCloseButton color={getTheme(user.theme).colors.textColor4} /> */}
            {/* <ModalBody> */}

            <div style={{position:"absolute", zIndex:"1",top:"50%",left:"0%",width: "100%",height: "100%"}} justifyContent='center'>
              <Image src='img\battle-bay\bankinterior\bank_menu_background.png' style={{position:"absolute", zIndex:"1"}}/>

              <Box style={{position:"absolute", zIndex:"2",top:"0%",left:"0%",width: "100%",height: "100%"}} justifyContent='center'>
                
                <Text  fontSize='sm' theme={theme} className="font-link"></Text>
                <Grid
                  h='5px'
                  templateRows='repeat(2, 1fr)'
                  templateColumns='repeat(4, 1fr)'
                  gap={4}
                  padding={12}
                >
                  <GridItem colSpan={4} bg=''>
                    <Center >
                      <Text className={[styles.gotham_xLight]} style={{ textAlign:"right", fontSize:"24px"}} >Fortune Purchase Menu</Text>
                    </Center>
                  </GridItem>

                  <GridItem colSpan={3} bg=''>
                    <Text style={{fontSize:"18px"}}>How much $FRTN would you like to purchase? </Text>
                  </GridItem>
                  <GridItem colSpan={1} bg=''>
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
                    <Text  >Current Price of $FRTN token: </Text>
                  </GridItem>
                  <GridItem colSpan={2} bg=''style={{ textAlign:"right"}}>
                    <Text style={{fontSize:"18px"}}  >USD ${fortunePrice} </Text>
                  </GridItem>

                  <GridItem colSpan={2} bg=''>
                    <Text style={{fontSize:"18px", fontFamily:styles.gotham_xLight}}  >Your total cost: </Text>
                  </GridItem>
                  <GridItem colSpan={2} bg=''style={{paddingBottom:"25%", textAlign:"right"}}>
                    <Text style={{fontSize:"18px", fontFamily:styles.gotham_narrow_book.fontFamily}} >{totalPrice} </Text>
                  </GridItem>

                  <GridItem colSpan={4} style={{paddingBottom:"27%"}} >
                    <Center >
                    <Image style={{ content: buyImage, position:"absolute",width: "65%",height: "100px"}} 
                      onMouseEnter={() => setbuyImage(buy_h)} onMouseOut={() => setbuyImage(buy)} onClick={() => attemptPurchase()}/> 
                    </Center>
                  </GridItem>
                  <GridItem colSpan={4}  >
                    <Center >
                    <Image src="/img/battle-bay/bankinterior/progress_bar_background.png" style={{ position:"absolute",width: "95%",height: "70px"}} /> 
                    <Image src="/img/battle-bay/bankinterior/progress_bar.png" style={{ position:"absolute",width: "75%",height: "50px"}} /> 
                    <Image src="/img/battle-bay/bankinterior/progress_bar_overlay.png" style={{ position:"absolute",width: "75%",height: "50px"}} /> 
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

