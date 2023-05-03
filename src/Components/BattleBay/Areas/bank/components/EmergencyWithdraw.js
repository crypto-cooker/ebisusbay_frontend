import { useState, useEffect, useCallback} from "react";
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
  Image
} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import StakePage from "@src/Components/BattleBay/Areas/bank/components/StakePage.js";
import FaqPage from "@src/Components/BattleBay/Areas/bank/components/FaqPage.js";
import localFont from "next/font/local";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {getProfile} from "@src/core/cms/endpoints/profile";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import {CloseIcon} from "@chakra-ui/icons";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })


const EmergencyWithdraw = ({ isOpen, onClose}) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const user = useSelector((state) => state.user);
  const [fortuneStaked, setFortuneStaked] = useState(20);
  const [remainingFortune, setRemainingFortune] = useState(fortuneStaked);
  const [fortuneToWithdraw, setFortuneToWithdraw] = useState(0);
  const handleChangeFortune = (value) => {
    if(fortuneStaked - (value*2) < 0) {
    }
    else
    {
      setRemainingFortune(fortuneStaked - (value*2))
      setFortuneToWithdraw(value)
    }
  }
  const WithdrawFortune = () => {
    setFortuneStaked(fortuneStaked - (fortuneToWithdraw*2))
    setRemainingFortune(fortuneStaked - (fortuneToWithdraw*2))
    setFortuneToWithdraw(0)
  }
 
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent
        borderWidth='1px'
        borderStyle='solid'
        borderLeftColor='#45433C'
        borderRightColor='#684918'
        borderTopColor='#625C4D'
        borderBottomColor='#181514'
        rounded='3xl'
        bg='linear-gradient(#1C1917, #272624, #000000)'
        className={gothamBook.className}
        >
        {!isLoading ? (
          <> 
             <ModalBody
    padding={2}
    >
    <Box
        position='absolute'
        left={2}
        top={2}
        rounded='full'
        zIndex={1}
        _groupHover={{
          cursor: 'pointer'
        }}
        data-group
      >
      {/* <Button
        bg='#C17109'
        rounded='full'
        border='8px solid #F48F0C'
        w={14}
        h={14}
        fontSize='28px'
        onClick={onBack}
        _groupHover={{
          bg: '#de8b08',
          borderColor: '#f9a50b',
        }}
      >
        
        <ArrowBackIcon />
      </Button> */}
    </Box>
    
    <Box
        position='absolute'
        right={2}
        top={2}
        rounded='full'
        zIndex={1}
        _groupHover={{
          cursor: 'pointer'
        }}
        data-group
      >
      <Button
        bg='#C17109'
        rounded='full'
        border='8px solid #F48F0C'
        w={14}
        h={14}
        onClick={onClose}
        _groupHover={{
          bg: '#de8b08',
          borderColor: '#f9a50b',
        }}
      >
      <CloseIcon />
    </Button>
    </Box>

    <Box
        bg='#564D4A'
        h='full'
        m={6}
        roundedBottom='3xl'
        className='rd-bank-modal-mask1'
      >
        <Box
          color='#FFF'
          textAlign='center'
          verticalAlign='middle'
          className='rd-bank-modal-mask2'
          p={1}
        >
          <Flex
            bg='#272523'
            h='55px'
            px={10}
            fontSize={{base: 'lg', sm: '2xl', md: '3xl'}}
            my='auto'
            justify='center'
            direction='column'
          >
            <>Emergency Withdraw</>
          </Flex>
        </Box>

      <Flex marginTop={'16px'} justifyContent={'center'}>
          <Heading textAlign={'center'}  w='90%' fontSize={'14px'}>Will return 50% of staked tokens and burn the rest</Heading>
      </Flex>
      <Spacer h='8'/>
          <Text align='center' fontSize={'14px'}>Fortune Tokens Staked: {remainingFortune}</Text>
          <Text align='center' fontSize={'14px'} >Fortune Tokens to Withdraw:</Text>

      <Flex alignContent={'center'} justifyContent={'center'}>
        <Box textAlign={'center'}>
          <FormControl>
            <FormLabel textAlign={'center'}></FormLabel>
            <NumberInput defaultValue={0} min={0} name="quantity" 
              onChange={handleChangeFortune}
              value={fortuneToWithdraw} type ='number'>
            <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Box>
        </Flex>
  
      <Spacer h='8'/>
        <Flex alignContent={'center'} justifyContent={'center'}>
        <Box
              ps='20px'>
              <RdButton
                w='250px'
                fontSize={{base: 'xl', sm: '2xl'}}
                stickyIcon={true}
                onClick={() => {WithdrawFortune(); onClose()}}
                isLoading={isExecuting}
                disabled={isExecuting}
              >
                {user.address ? (
                  <>{isExecuting ? executingLabel : 'Withdraw'}</>
                ) : (
                  <>Connect</>
                )}
              </RdButton>
            </Box>
        </Flex>
        <Spacer h='8'/>
    </Box>
    
    </ModalBody>
          <ModalFooter className="border-0"/>
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

export default EmergencyWithdraw;