import { useState, useRef, useEffect, useCallback} from "react";
import { useSelector } from "react-redux";
import {
  ModalBody,
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
  HStack,
  Center
} from "@chakra-ui/react"

import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {commify} from "ethers/lib/utils";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import moment from 'moment';

//contracts
import {Contract, ethers, BigNumber} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Bank from "@src/Contracts/Bank.json";
import Fortune from "@src/Contracts/Fortune.json";
import { createSuccessfulTransactionToastContent } from '@src/utils';


const StakePage = ({ onBack, onClose}) => {
 
  const [isExecuting, setIsExecuting] = useState(false);
  // const [setIsLoading] = useState(true);
  const [isLoading, getSigner] = useCreateSigner();
  const config = appConfig();

  const user = useSelector((state) => state.user);
  const [executingLabel, setExecutingLabel] = useState('Staking...');

  const [daysToStake, setDaysToStake] = useState(90)
  const [fortuneToStake, setFortuneToStake] = useState(1000);
  const [mitama, setMitama] = useState(0)
  const [userFortune, setUserFortune] = useState(0)

  //deposit info
  const [hasDeposited, setHasDeposited] = useState(false);
  const [amountDeposited, setAmountDeposited] = useState(0);
  const [depositLength, setDepositLength] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [depositsView, setDepositsView] = useState([])

  const[minAmountToStake, setMinAmountToStake] = useState(1000);
  const[minLengthOfTime, setMinLengthOfTime] = useState(90);
  

  const handleChangeFortuneAmount = (value) => {
    setFortuneToStake(value)
  }
  const handleChangeDays = (value) => {
    setDaysToStake(value)
  }
  const CheckForApproval = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
    const totalApproved = await fortuneContract.allowance(user.address.toLowerCase(), config.contracts.bank);
    return totalApproved;
  }
  const CheckForFortune = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
    const totalFortune = await fortuneContract.balanceOf(user.address.toLowerCase());
    const formatedFortune = Number(ethers.utils.hexValue(BigNumber.from(totalFortune)))/1000000000000000000;
    setUserFortune(formatedFortune);
  }
  const CheckForDeposits = async () => {
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

      const newNumber = Number(ethers.utils.hexValue(BigNumber.from(deposits[0])));
      setAmountDeposited(newNumber/1000000000000000000);
      setDepositLength(daysToAdd);
      setStartTime(moment(newerDate).format("MMM D yyyy"));

      setMinAmountToStake(Number(ethers.utils.hexValue(BigNumber.from(deposits[0]))/1000000000000000000));
      setMinLengthOfTime(daysToAdd);
    }
    else
    {
      console.log("no deposits")
    }
    return deposits;
  }

  function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

  const StakeFortune = async () => {
    setIsExecuting(true)
      try {
        setExecutingLabel('Checking for Approval...');
        //check for approval
        const totalApproved = await CheckForApproval();
        const desiredFortuneAmount = Number(ethers.utils.hexValue(BigNumber.from(totalApproved)));
        const convertedFortuneAmount = desiredFortuneAmount / 1000000000000;

        if(convertedFortuneAmount < fortuneToStake){
          // toast.error("Please approve the contract to spend your resources")
          const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
          const tx = await fortuneContract.approve(config.contracts.bank, fortuneToStake);
          const receipt = await tx.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        }

        setExecutingLabel('Staking...');
        const bankContract = new Contract(config.contracts.bank, Bank, user.provider.getSigner());

        if(hasDeposited){
          //check if amount was increased
          // console.log("has deposited");
          // console.log(amountDeposited);
          // console.log(fortuneToStake);
          if(amountDeposited < Number(fortuneToStake)){
            const additionalFortune = fortuneToStake - amountDeposited;
            console.log("additional fortune to stake: " + additionalFortune);
            const tx = await bankContract.increaseDeposit(ethers.utils.parseEther(String(additionalFortune)));
            const receipt = await tx.wait();
            toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
          }
          
          //check if time was increased
          if(depositLength < daysToStake){
            console.log("increasing days");
            const additonalDays = daysToStake - depositLength;
            const tx = await bankContract.increaseDepositLength(additonalDays*86400);
            const receipt = await tx.wait();
            toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
          }
          CheckForDeposits();
        }
        else
        {
          console.log("new deposit");
          const tx = await bankContract.openAccount(ethers.utils.parseEther(fortuneToStake), daysToStake*86400);
          const receipt = await tx.wait();
          console.log(receipt);
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        }
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

    setIsExecuting(false)
    console.log("Done")
  }

  useEffect(() => {
    setMitama((fortuneToStake*daysToStake)/1080)
  }, [fortuneToStake, daysToStake])

  useEffect(() => {
    CheckForDeposits();
    CheckForFortune();
  }, [])

  useEffect(() => {
    setDepositsView(
      <>
      <Center>
      <Box 
        bgColor='#292626' 
        w='95%' 
        borderRadius={'5px'}
        paddingTop='2' 
        paddingBottom='2' 
        color='white' 
        textAlign={'center'}>
      <Center>
        <Flex justifyContent='space-between' w='90%'>
          <Text w='30%'>Staked:</Text>
          <Text w='30%'>Length: </Text>
          <Text w='40%'>Withdraw Date: </Text>
        </Flex>
      </Center>

      <Center>
        <Flex justifyContent='space-between' w='90%'>
          <Text w='30%'>{amountDeposited}</Text>
          <Text w='30%'>{depositLength} Days</Text>
          <Text w='40%'>{startTime}</Text>
        </Flex>
      </Center>
      </Box>
      </Center>

      <Spacer h='6'/>
      <Center>
        <Flex justifyContent='space-between' w='90%'>
          <Text align='center' > Increase Amount Staked or Length of Time</Text>
        </Flex>
      </Center>

      </>
      )
  }, [amountDeposited, depositLength, startTime])

  return (
    <ModalBody
    padding={2}>
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

      <Center>
        <HStack align='start'
        paddingTop='2'
        >
          <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>Your</Text>
          <Image src='/img/battle-bay/bankinterior/fortune_token.svg' alt="walletIcon" boxSize={6}/>
          <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>$Fortune: {kFormatter(userFortune)}</Text>
        </HStack>
      </Center>
        
        <Spacer m='4'/>
      { !isLoading ? 
       hasDeposited ? (<>
        {depositsView}
        </>)
        : (<>
          <Center>
          <Flex justifyContent='space-between' w='90%' >
            <Text textAlign='left' fontSize={'14px'}>Fortune Tokens to Stake:</Text>
            <Text textAlign='right' fontSize={'14px'}>Duration (Days):</Text>
          </Flex>
          </Center>
          </>)
      : (<></>)}

      <Center>
        <Flex justifyContent='space-between' w='90%' >
          <FormControl w='50%'>
            <NumberInput 
              defaultValue={minAmountToStake} 
              min={minAmountToStake} 
              name="quantity" 
              onChange={handleChangeFortuneAmount}
              value={fortuneToStake} type ='number'
              step={1000}>
            <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl w='33%'>
            <NumberInput 
              defaultValue={minLengthOfTime} 
              min={minLengthOfTime} 
              max={1080} 
              name="quantity" 
              step={90}
              onChange={handleChangeDays}
              value={daysToStake} type ='number'>
            <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
         </Flex>
      </Center>

      <Flex marginTop={'16px'} justifyContent={'center'}>
          <Text textAlign={'center'} fontSize={'14px'}>$Mitama = [$Fortune * Days Staked / 1080] </Text>
      </Flex>

      <Flex justifyContent={'center'}>
          <Box bgColor='#292626' w='95%' borderRadius={'5px'} p={4} color='white' textAlign={'center'}>
          <Text textAlign={'center'} fontSize={'24px'}> $Mitama {mitama.toFixed(0)}</Text>
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
                onClick={() => {StakeFortune()}}
                isLoading={isExecuting}
                disabled={isExecuting}
              >
                {user.address ? (
                  <>{isExecuting ? executingLabel : 'Stake $Fortune'}</>
                ) : (
                  <>Connect</>
                )}
              </RdButton>
            </Box>
        </Flex>
      <Spacer h='8'/>
    </Box>
    </ModalBody>
    
  )
}

export default StakePage;