import { useState, useRef, useEffect, Component} from "react";
import { useSelector } from "react-redux";
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
} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";

const WithdrawForm = ({ isOpen, onClose}) => {
 
  const [isLoading, setIsLoading] = useState(false);
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
      <ModalContent>
        {!isLoading ? (
          <>
          <ModalHeader className="text-center">Emergency Early Withdraw</ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
              <Flex marginBottom={'16px'} textAlign={'center'}>
                Will return 50% of staked tokens and burn the rest.
              </Flex>

              <Flex alignContent={'center'} justifyContent={'center'}>
                <Box textAlign={'center'}>
                  Fortune Tokens Staked: {remainingFortune}
                </Box>
                <Spacer />
                <Box>
                  <FormControl>
                    <FormLabel textAlign={'center'}>Fortune Tokens to Withdraw:</FormLabel>
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
          
                <Flex alignContent={'center'} justifyContent={'center'}>
                <Button justifyContent={'center'} w='200px' marginTop={8} colorScheme='red' variant='outline'
                    onClick={() => {WithdrawFortune(); onClose()}}>Withdraw</Button>
                </Flex>

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

export default WithdrawForm;