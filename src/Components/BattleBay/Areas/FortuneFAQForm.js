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
  Container,
  FormControl,
  FormLabel,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  StackDivider,
  UnorderedList,
  ListItem,

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

import './App.module.scss';

const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
})

import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";

const FortuneFAQForm = ({ isOpen, onClose}) => {

  const config = appConfig();
  const buy = 'url("/img/battle-bay/bankinterior/buy_FRTN_button.png")';
  const buy_h = 'url("/img/battle-bay/bankinterior/buy_FRTN_button_hover.gif")';
  const [buyImage, setbuyImage] = useState(buy);

  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

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
                  gap={4}
                  padding={12}
                >
                  <GridItem colSpan={4} bg=''>
                    <Center >
                      <Text className={[styles.gotham_xLight]} style={{ textAlign:"right", fontSize:"24px"}} >Bank</Text>
                    </Center>
                  </GridItem>

                  <GridItem colSpan={4} bg=''>
     
          
        <Box textAlign={'center'}>
          <Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px", marginTop:"-12px", paddingBottom:"12px"}} >To receive $Mitama, you must stake $Fortune for AT LEAST the duration of 1 season (90 days).
          If you stake longer than 1 season, you will receive bonus spirit multiplier for each additional season.
          </Text>
          <Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >
          APR from staking goes into the seasonal release pool for user.
          These rewards will be released linearly counting down to end of current season. 
          You can spend out of your rewards pool early to buy powerUps without penalty.
          </Text>
        </Box>

      <Text className={[styles.gotham_book]} style={{marginTop:"-12px",}}  textAlign={'center'}>About APR</Text>
      <Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >Staking will also generate a traditional APR yield with boosts per season locked.</Text>
      <VStack
      align='center'
      >
      <Box>
        <UnorderedList>
          <ListItem >
          <Text className={[styles.gotham_xLight]} style={{ textAlign:"left", marginTop:"-12px", fontSize:"12px"}} >1 season 12%</Text>
            </ListItem>
          <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >2 17%</Text></ListItem>
          <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >3 20%</Text></ListItem>
          <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >4 30%</Text></ListItem>
          <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >8 120%</Text></ListItem>
          <ListItem><Text className={[styles.gotham_xLight]} style={{ textAlign:"left", fontSize:"12px"}} >12 200%</Text></ListItem>
        </UnorderedList>
      </Box>

      </VStack>
    
      

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

export default FortuneFAQForm;

