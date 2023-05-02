import { useState, useRef, useEffect, useCallback} from "react";
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
  Image
} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";

const StakePage = ({ onBack, onClose}) => {
 
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
    <ModalBody
    padding={4}>
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
      <Button
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
      </Button>
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
            px={12}
            fontSize={{base: 'lg', sm: '2xl', md: '3xl'}}
            my='auto'
            justify='center'
            direction='column'
          >
            <>Stake Fortune</>
          </Flex>
        </Box>
      
      <Flex justifyContent='space-between' >
        <Box w='0.51%'/>
            <FormLabel fontSize={'14px'}>Fortune Tokens to Stake:</FormLabel>
            <FormLabel fontSize={'14px'}>Duration (Days):</FormLabel>
        <Box w='0.5%'/>
      </Flex>
      <Flex justifyContent='space-between' >
        <Box w='0.5%'/>
          <FormControl w='45%'>
            <NumberInput defaultValue={1000} min={1000} name="quantity" 
              onChange={handleChangeFortuneAmount}
              value={fortuneStaked} type ='number'
              step={1000}>
            <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl w='40%'>
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
        <Box w='0.5%'/>
      </Flex>

      <Flex marginTop={'16px'} justifyContent={'center'}>
          <Heading textAlign={'center'} fontSize={'14px'}>$Mitama [$Fortune * daysLocked / maxDays] </Heading>
      </Flex>

      <Flex justifyContent={'center'}>
          <Box bgColor='#353638' w='90%' p={4} color='white' textAlign={'center'}>
          {mitama.toPrecision(5)}
          </Box>
      </Flex>

      <Flex margin={'24px'} justify={'center'}>
        <Button justifyContent={'center'} w='200px' margin={2} colorScheme='white' variant='outline'
          onClick={() => {onOpenStake()}}>Stake Fortune</Button>
      </Flex>

    </Box>
    </ModalBody>
    
  )
}

export default StakePage;