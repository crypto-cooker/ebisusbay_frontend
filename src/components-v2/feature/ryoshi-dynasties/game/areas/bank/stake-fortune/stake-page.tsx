import React, {ChangeEvent, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
  Box,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  VStack
} from "@chakra-ui/react"
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {commify} from "ethers/lib/utils";
import moment from 'moment';

//contracts
import {BigNumber, Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import Bank from "@src/Contracts/Bank.json";
import Fortune from "@src/Contracts/Fortune.json";
import {createSuccessfulTransactionToastContent, pluralize} from '@src/utils';
import {useAppSelector} from "@src/Store/hooks";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";


const StakePage = () => {
  const dispatch = useDispatch();
 
  const [isExecuting, setIsExecuting] = useState(false);
  const config = appConfig();

  const user = useAppSelector((state) => state.user);

  const [executingLabel, setExecutingLabel] = useState('Staking...');
  const [isRetrievingFortune, setIsRetrievingFortune] = useState(false);

  const [daysToStake, setDaysToStake] = useState(90)
  const [fortuneToStake, setFortuneToStake] = useState(1000);
  const [mitama, setMitama] = useState(0)
  const [userFortune, setUserFortune] = useState(0)

  //deposit info
  const [hasDeposited, setHasDeposited] = useState(false);
  const [amountDeposited, setAmountDeposited] = useState(0);
  const [depositLength, setDepositLength] = useState(0);
  const [withdrawDate, setWithdrawDate] = useState<string>();

  const [minAmountToStake, setMinAmountToStake] = useState(1000);
  const [minLengthOfTime, setMinLengthOfTime] = useState(90);

  const [inputError, setInputError] = useState('');
  const [lengthError, setLengthError] = useState('');

  const handleChangeFortuneAmount = (valueAsString: string, valueAsNumber: number) => {
    setFortuneToStake(valueAsNumber)
  }

  const handleChangeDays = (e: ChangeEvent<HTMLSelectElement>) => {
    setDaysToStake(Number(e.target.value))
  }

  const checkForApproval = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
    const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), config.contracts.bank);
    return totalApproved as BigNumber;
  }

  const checkForFortune = async () => {
    try {
      setIsRetrievingFortune(true);
      const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
      const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
      const totalFortune = await fortuneContract.balanceOf(user.address?.toLowerCase());
      const formatedFortune = Number(ethers.utils.hexValue(BigNumber.from(totalFortune)))/1000000000000000000;
      setUserFortune(formatedFortune);
    } finally {
      setIsRetrievingFortune(false);
    }
  }

  const checkForDeposits = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const bank = new Contract(config.contracts.bank, Bank, readProvider);
    const deposits = await bank.deposits(user.address?.toLowerCase());
    console.log('deposits', deposits.amount.toString())

    //if has deposits, set state
    if(deposits[0].gt(0)){
      setHasDeposited(true);
      const daysToAdd = Number(deposits[1].div(86400));
      const newDate = new Date(Number(deposits[2].mul(1000)));
      const newerDate = newDate.setDate(newDate.getDate() + daysToAdd);

      setAmountDeposited(Number(ethers.utils.formatEther(deposits[0])));
      setDepositLength(daysToAdd);
      setWithdrawDate(moment(newerDate).format("MMM D yyyy"));

      setMinAmountToStake(1000);
      setMinLengthOfTime(90);
    } else {
      console.log("no deposits")
    }
    return deposits;
  }

  const validateInput = async () => {
    setExecutingLabel('Validating');

    if (userFortune < fortuneToStake) {
      toast.error("Not enough Fortune");
      return;
    }

    if (fortuneToStake < minAmountToStake) {
      setInputError(`At least ${minAmountToStake} required`);
      return false;
    }
    setInputError('');

    if (daysToStake < minLengthOfTime) {
      setLengthError(`At least ${minLengthOfTime} days required`);
      return false;
    }
    setLengthError('');

    return true;
  }

  const handleStake = async () => {
    if (user.address) {
      if (!await validateInput()) return;
      await executeStakeFortune();
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  }

  const executeStakeFortune = async () => {
    try {
      setIsExecuting(true);
      setExecutingLabel('Approving');
      //check for approval
      const totalApproved = await checkForApproval();
      const desiredFortuneAmount = ethers.utils.parseEther(fortuneToStake.toString());
      // const convertedFortuneAmount = desiredFortuneAmount / 1000000000000;

      console.log('approved amount', totalApproved.lt(desiredFortuneAmount));
      if(totalApproved.lt(desiredFortuneAmount)){
        const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
        const tx = await fortuneContract.approve(config.contracts.bank, desiredFortuneAmount);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      }

      setExecutingLabel('Staking');
      const bankContract = new Contract(config.contracts.bank, Bank, user.provider.getSigner());

      if (hasDeposited) {
        //check if amount was increased
        console.log("has deposited");
        console.log(amountDeposited);
        console.log(fortuneToStake);
        const hasIncreasedAmount = fortuneToStake > 0;
        const hasIncreasedDays = depositLength < daysToStake;

        if (hasIncreasedAmount) {
          const additionalFortune = fortuneToStake - amountDeposited;
          console.log("additional fortune to stake: " + additionalFortune);
          const tx = await bankContract.increaseDeposit(ethers.utils.parseEther(String(fortuneToStake)));
          const receipt = await tx.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        } else if (!hasIncreasedDays) {
          toast.error("Must increase amount or length of time.");
          return;
        }

        //check if time was increased
        if (hasIncreasedDays) {
          console.log("increasing days");
          const additonalDays = daysToStake - depositLength;
          const tx = await bankContract.increaseDepositLength(additonalDays*86400);
          const receipt = await tx.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        } else if (!hasIncreasedAmount) {
          toast.error("Must increase amount or length of time.");
          return;
        }

        checkForDeposits();
      } else {
        console.log("new deposit");
        const tx = await bankContract.openAccount(desiredFortuneAmount, daysToStake*86400);
        const receipt = await tx.wait();
        console.log(receipt);
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      }
    } catch (error: any) {
      console.log(error)
      if(error.response !== undefined) {
        console.log(error)
        toast.error(error.response.data.error.metadata.message)
      }
      else {
        toast.error(error);
      }
    } finally {
      setIsExecuting(false);
    }
  }

  useEffect(() => {
    setMitama( ((fortuneToStake + amountDeposited )* daysToStake) / 1080)
  }, [fortuneToStake, daysToStake])

  useEffect(() => {
    if (user.address) {
      checkForDeposits();
      checkForFortune();
    }
  }, [user.address]);

  return (
    <>
      <Box mx={1} pb={6}>
        <Box mb={4} bg='#272523' p={2} roundedBottom='md'>
          {user.address ? (
            <Box textAlign='center' w='full'>
              <Flex>
                <Spacer />
                <HStack>
                  <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>Your</Text>
                  <Image src='/img/battle-bay/bankinterior/fortune_token.svg' alt="walletIcon" boxSize={6}/>
                  <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>
                    $Fortune: {isRetrievingFortune ? <Spinner size='sm'/> : commify(userFortune)}
                  </Text>
                </HStack>
                <Spacer />
              </Flex>
            </Box>
          ) : (
            <Box fontSize='sm' textAlign='center' w='full'>Connect wallet to purchase</Box>
          )}
          {hasDeposited && (
            <Box textAlign='center' mt={2}>
              <hr />
              <SimpleGrid columns={3} pt={2}>
                <Box>
                  <Text fontSize='sm'>Staked</Text>
                  <Text fontWeight='bold'>{amountDeposited}</Text>
                </Box>
                <Box>
                  <Text fontSize='sm'>Length</Text>
                  <Text fontWeight='bold'>{depositLength}</Text>
                </Box>
                <Box>
                  <Text fontSize='sm'>Withdraw Date</Text>
                  <Text fontWeight='bold'>{withdrawDate}</Text>
                </Box>
              </SimpleGrid>
            </Box>
          )}
        </Box>

        { user.address && hasDeposited ? (
          <>
            <Center mt={4} mb={2}>
              <Text align='center'>Increase current stake</Text>
            </Center>
          </>
        ) : (
          <Center>
            <Flex justifyContent='space-between' w='90%' >
              <Text textAlign='left' fontSize={'14px'}>Fortune Tokens to Stake:</Text>
              <Text textAlign='right' fontSize={'14px'}>Duration (Days):</Text>
            </Flex>
          </Center>
        )}

        <Box px={6}>
          <Flex direction={{base: 'column', sm: 'row'}} justify='space-between'>
            <FormControl maxW='200px' isInvalid={!!inputError}>
              <NumberInput
                defaultValue={minAmountToStake}
                min={minAmountToStake}
                name="quantity"
                onChange={handleChangeFortuneAmount}
                value={fortuneToStake}
                step={1000}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{inputError}</FormErrorMessage>
            </FormControl>
            <Box w={10}/>
            <FormControl maxW='250px' isInvalid={!!lengthError}>
              <Select onChange={handleChangeDays} value={daysToStake} bg='none'>
                {[...Array(12).fill(0)].map((_, i) => (
                  <option key={i} value={`${(i + 1) * 90}`}>
                    {(i + 1)} {pluralize((i + 1), 'Season')} ({(i + 1) * 90} days)
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{lengthError}</FormErrorMessage>
            </FormControl>
           </Flex>
          <VStack bgColor='#292626' rounded='md' p={4} mt={4} spacing={0}>
            <Text>You Receive</Text>
            <Text fontSize={24} fontWeight='bold'>$Mitama {mitama.toFixed(0)}</Text>
            <Text fontSize={12} color='#aaa'>$Mitama = [$Fortune * Days Staked / 1080] </Text>
          </VStack>
        </Box>


        <Spacer h='8'/>
          <Flex alignContent={'center'} justifyContent={'center'}>
            <Box ps='20px'>
              <RdButton
                w='250px'
                fontSize={{base: 'xl', sm: '2xl'}}
                stickyIcon={true}
                onClick={handleStake}
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
      </Box>
    </>
    
  )
}

export default StakePage;