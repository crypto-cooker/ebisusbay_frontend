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
  Heading,
  Text,
} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";

const StakeForm = ({ isOpen, onClose}) => {
 
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const [daysStaked, setDaysStaked] = useState(90)
  const [fortuneAvailable, setFortuneAvailable] = useState(20)
  const [fortuneStaked, setFortuneStaked] = useState();
  const [mitama, setMitama] = useState(0)

  const handleChangeFortuneAmount = (value) =>
  {
    setFortuneStaked(value)
    setMitama(((daysStaked*value)/1080))
  }

  const handleChangeDays = (value) => {
    setDaysStaked(value)
    setMitama((fortuneStaked*value)/1080)
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
          <ModalHeader className="text-center">Stake Fortune</ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
              
              <Flex>
                <Box>
                  <FormControl>
                    <FormLabel>Fortune Tokens to Stake:</FormLabel>
                    <NumberInput defaultValue={0} min={0} name="quantity" 
                      onChange={handleChangeFortuneAmount}
                      value={fortuneStaked} type ='number'>
                    <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Box>
                <Spacer/>
                <Box>
                  <FormControl>
                    <FormLabel>Duration (Days):</FormLabel>
                    <NumberInput defaultValue={90} min={90} max={1080} name="quantity" 
                      onChange={handleChangeDays}
                      value={daysStaked} type ='number'>
                    <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Box>
              </Flex>

              <Flex marginTop={'16px'} justifyContent={'center'}>
                  <Heading textAlign={'center'} fontSize={'18px'}>$Mitama = {mitama.toPrecision(5)}</Heading>
              </Flex>
              <Flex justifyContent={'center'}>
                  <Text as='i' textAlign={'center'}>
                    $Fortune * daysLocked / maxDays
                  </Text>
              </Flex>
              <Flex margin={'24px'} justify={'center'}>
                <Button justifyContent={'center'} w='200px' margin={2} colorScheme='white' variant='outline'
                  onClick={() => {onOpenStake()}}>Stake Fortune</Button>
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

export default StakeForm;