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
import { useState, useEffect, useCallback} from "react";
import localFont from "next/font/local";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {getProfile} from "@src/core/cms/endpoints/profile";
import { getAuthSignerInStorage } from '@src/helpers/storage';

import {useSelector} from "react-redux";
import {CloseIcon} from "@chakra-ui/icons";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

//contracts
import {Contract, ethers, BigNumber} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Bank from "@src/Contracts/Bank.json";
import { createSuccessfulTransactionToastContent } from '@src/utils';
import moment from 'moment';

const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })


const EmergencyWithdraw = ({ isOpen, onClose}) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const user = useSelector((state) => state.user);
  const [getSigner] = useCreateSigner();
  const config = appConfig();

  //deposit info
  const [hasDeposited, setHasDeposited] = useState(false);
  const [amountDeposited, setAmountDeposited] = useState(0);
  const [depositLength, setDepositLength] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [depositsView, setDepositsView] = useState([])

  // const [remainingFortune, setRemainingFortune] = useState(0);
  // const [fortuneStaked, setFortuneStaked] = useState(amountDeposited);
  // const [fortuneToWithdraw, setFortuneToWithdraw] = useState(0);

  const [executingLabel, setExecutingLabel] = useState('Staking...');


  // const handleChangeFortune = (value) => {
  //   if(fortuneStaked - (value*2) >= 0) {
  //     setRemainingFortune(fortuneStaked - (value*2))
  //     setFortuneToWithdraw(value)
  //   }
  // }
  // const WithdrawFortune = async () => {
  //   setFortuneStaked(fortuneStaked - (fortuneToWithdraw*2))
  //   setRemainingFortune(fortuneStaked - (fortuneToWithdraw*2))
  //   setFortuneToWithdraw(0)
  // }

  const CheckForDeposits = async () => {
    console.log("Checking for deposits")
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const bank = new Contract(config.contracts.bank, Bank, readProvider);
    const deposits = await bank.deposits(user.address.toLowerCase());

    function addDays(date, days) {
      date.setDate(date.getDate() + days);
      return date;
    }

    //if has deposits, set state
    if(Number(ethers.utils.hexValue(BigNumber.from(deposits[0]))) > 0){
      setHasDeposited(true);
      const daysToAdd = Number(ethers.utils.hexValue(BigNumber.from(deposits[1]))/86400);
      const date = Date(Number(ethers.utils.hexValue(BigNumber.from(deposits[2]))));
      const newDate = new Date(date);
      const newerDate = addDays(newDate, daysToAdd);

      setAmountDeposited(Number(ethers.utils.hexValue(BigNumber.from(deposits[0]))/1000000));
      setDepositLength(daysToAdd);
      setStartTime(moment(newerDate).format("MMM D yyyy"));
    }
    setIsLoading(false);
  }
  const EmergencyWithdraw = async () => {
    setExecutingLabel('Staking...');
    setIsExecuting(true)
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
          setExecutingLabel('Approving...');
          const bank = new Contract(config.contracts.bank, Bank, user.provider.getSigner());
          const tx = await bank.emergencyClose();
          const receipt = await tx.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
          CheckForDeposits();

      } catch (error) {
        console.log(error)
        if(error.response !== undefined) {
          console.log(error)
          toast.error(error.response.data.error.metadata.message)
        }
        else {
          toast.error(error);
        }
      }
    }
    setIsExecuting(false)
    console.log("Done")
  }

 
  useEffect(() => {
    CheckForDeposits();
  }, [])

  // useEffect(() => {
  //   setFortuneStaked(amountDeposited);
  //   setRemainingFortune(amountDeposited);
  // }, [amountDeposited])
 
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
            fontSize={{base: 'lg', sm: '2xl', md: '2xl'}}
            my='auto'
            justify='center'
            direction='column'
          >
            <>Emergency Withdraw</>
          </Flex>
        </Box>
        <Flex marginTop={'16px'} justifyContent={'center'}>
              <Text textAlign={'center'}  w='95%' fontSize='14'>Will return 50% of staked tokens and burn the rest</Text>
        </Flex>

        {hasDeposited ? (<>
          
          <Spacer h='8'/>
              <Text align='center' fontSize='14'>$Fortune Tokens Staked: {amountDeposited}</Text>
              <Text align='center' fontSize='14'>$Fortune Tokens to Withdraw: {amountDeposited/2}</Text>

          <Flex alignContent={'center'} justifyContent={'center'}>
            {/* <Box textAlign={'center'}>
              <FormControl>
                <FormLabel textAlign={'center'}></FormLabel>
                <NumberInput 
                  defaultValue={0} 
                  min={0}
                  max={fortuneStaked/2}
                  name="quantity" 
                  onChange={handleChangeFortune}
                  value={fortuneToWithdraw} type ='number'>
                <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Box> */}
            </Flex>
            <Spacer h='8'/>
            <Flex alignContent={'center'} justifyContent={'center'}>
            <Box
                  ps='20px'>
                  <RdButton
                    w='250px'
                    fontSize={{base: 'xl', sm: '2xl'}}
                    stickyIcon={true}
                    onClick={() => {EmergencyWithdraw()}}
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
        </>) : (<>
            <Spacer h='50'/>
          <Text textAlign={'center'} fontSize='14'>You have no deposits to withdraw.</Text>
            <Spacer h='50'/>
        </>)}
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