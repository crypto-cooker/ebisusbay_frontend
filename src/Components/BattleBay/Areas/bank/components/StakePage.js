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

//contracts
import {Contract, ethers, BigNumber} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Bank from "@src/Contracts/Bank.json";
import FortunePresale from "@src/Contracts/FortunePresale.json";
import { createSuccessfulTransactionToastContent } from '@src/utils';


const StakePage = ({ onBack, onClose}) => {
 
  const [isExecuting, setIsExecuting] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [isLoading, getSigner] = useCreateSigner();
  const config = appConfig();

  const user = useSelector((state) => state.user);
  const [executingLabel, setExecutingLabel] = useState('Staking...');

  const [daysToStake, setDaysToStake] = useState(90)
  const [fortuneToStake, setFortuneToStake] = useState(1000);
  const [mitama, setMitama] = useState(0)

  const handleChangeFortuneAmount = (value) => {
    setFortuneToStake(value)
  }
  const handleChangeDays = (value) => {
    setDaysToStake(value)
  }
  const CheckForApproval = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const purchaseFortuneContract = new Contract(config.contracts.purchaseFortune, FortunePresale, readProvider);
    const tx = await purchaseFortuneContract.isApprovedForAll(user.address.toLowerCase(), config.contracts.bank);
    // const tx = await purchaseFortuneContract.purchase(desiredFortuneAmount)
    console.log(tx)
    return tx;
  }

  const StakeFortune = async () => {
    setExecutingLabel('Staking...');
    setIsExecuting(true)
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        //check for approval
        const approved = await CheckForApproval();

        if(!approved){
          toast.error("Please approve the contract to spend your resources")
          setExecutingLabel('Approving contract...');
          const purchaseFortuneContract = new Contract(config.contracts.purchaseFortune, FortunePresale, user.provider.getSigner());
          const tx = await purchaseFortuneContract.setApprovalForAll(config.contracts.bank, true);
          const receipt = await tx.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        }

        setExecutingLabel('Staking...');
        const bankContract = new Contract(config.contracts.bank, Bank, user.provider.getSigner());
        const tx = await bankContract.openAccount(fortuneToStake, daysToStake*86400);
        const receipt = await tx.wait();
        console.log(receipt);
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

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
    setMitama((fortuneToStake*daysToStake)/1080)
  }, [fortuneToStake, daysToStake])


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
      <HStack align='start'>
        <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>Your</Text>
        <Image src='/img/battle-bay/bankinterior/fortune_token.svg' alt="walletIcon" boxSize={6}/>
        <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>$Fortune: {commify(user.tokenSale.fortune)}</Text>
      </HStack>
      </Center>
      
      <Spacer m='4'/>

      <Center>
      <Flex justifyContent='space-between' w='90%' >
        <Text textAlign='left' fontSize={'14px'}>Fortune Tokens to Stake:</Text>
        <Text textAlign='right' fontSize={'14px'}>Duration (Days):</Text>
      </Flex>
      </Center>

      <Center>
        <Flex justifyContent='space-between' w='90%' >
          <FormControl w='50%'>
            <NumberInput defaultValue={1000} min={1000} name="quantity" 
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
              defaultValue={90} 
              min={90} 
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
          <Text textAlign={'center'} fontSize={'24px'}> $Mitama {mitama.toPrecision(5)}</Text>
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