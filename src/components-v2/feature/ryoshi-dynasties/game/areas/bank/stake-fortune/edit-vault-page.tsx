import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  VStack
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import RdButton from "../../../../components/rd-button";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useAppSelector} from "@src/Store/hooks";
import {BigNumber, Contract, ethers} from "ethers";
import Fortune from "@src/Contracts/Fortune.json";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, findNextLowestNumber, pluralize, round} from "@src/utils";
import Bank from "@src/Contracts/Bank.json";
import {appConfig} from "@src/Config";
import {useDispatch} from "react-redux";
import {FortuneStakingAccount} from "@src/core/services/api-service/graph/types";
import {commify} from "ethers/lib/utils";
import moment from "moment/moment";
import {useQueryClient} from "@tanstack/react-query";

const config = appConfig();

const steps = {
  form: 'form',
  complete: 'complete'
};

interface EditVaultPageProps {
  vault: FortuneStakingAccount;
  type: string;
  onReturn: () => void;
}

const EditVaultPage = ({vault, type, onReturn}: EditVaultPageProps) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const {config: rdConfig} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(steps.form);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('Staking...');
  const [isRetrievingFortune, setIsRetrievingFortune] = useState(false);
  const [maxDurationIncrease, setMaxDurationIncrease] = useState(rdConfig.bank.staking.fortune.maxTerms);

  const [fortuneToStake, setFortuneToStake] = useState(1000);
  const [daysToStake, setDaysToStake] = useState(rdConfig.bank.staking.fortune.termLength)
  const [userFortune, setUserFortune] = useState(0);

  const [lengthError, setLengthError] = useState('');
  const [inputError, setInputError] = useState('');

  const [currentApr, setCurrentApr] = useState(0);
  const [currentTroops, setCurrentTroops] = useState(0);
  const [newApr, setNewApr] = useState(0);
  const [newTroops, setNewTroops] = useState(0);
  const [newWithdrawDate, setNewWithdrawDate] = useState(vault.endTime);

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

  const handleDepositPct = useCallback((pct: number) => {
    setFortuneToStake(Math.floor(userFortune * (pct / 100)));
  }, [userFortune]);

  const validateInput = async () => {
    setExecutingLabel('Validating');

    const isAddingDuration = type === 'duration';

    if (!isAddingDuration && userFortune < fortuneToStake) {
      toast.error("Not enough Fortune");
      return;
    }

    if(!isAddingDuration && fortuneToStake < rdConfig.bank.staking.fortune.minimum){
      setInputError(`At least ${rdConfig.bank.staking.fortune.minimum} required`);
      return false;
    }
    setInputError('');

    if (isAddingDuration && daysToStake < rdConfig.bank.staking.fortune.termLength) {
      setLengthError(`At least ${rdConfig.bank.staking.fortune.termLength} days required`);
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
      setExecutingLabel('Staking');

      const bankContract = new Contract(config.contracts.bank, Bank, user.provider.getSigner());

      if (type === 'duration') {
        const tx = await bankContract.increaseLengthForVault(daysToStake * 86400, vault.index);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      } else {
        const totalApproved = await checkForApproval();
        const desiredFortuneAmount = ethers.utils.parseEther(fortuneToStake.toString());

        if(totalApproved.lt(desiredFortuneAmount)){
          const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
          const tx = await fortuneContract.approve(config.contracts.bank, desiredFortuneAmount);
          const receipt = await tx.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        }

        const tx = await bankContract.increaseDepositForVault(ethers.utils.parseEther(String(fortuneToStake)), vault.index);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      }
      setCurrentStep(steps.complete);
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

  // Calculate APR and Troops from vault plus input
  useEffect(() => {
    const isAddingDuration = type === 'duration';
    const depositLength = vault.length / 86400;

    let totalDays = depositLength;
    const canUseDuration = isAddingDuration;
    if (canUseDuration) {
      totalDays += daysToStake;
    }
    const numTerms = Math.floor(totalDays / rdConfig.bank.staking.fortune.termLength);
    const availableAprs = rdConfig.bank.staking.fortune.apr as any;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    setNewApr(availableAprs[aprKey] ?? availableAprs[1]);

    let totalFortune = Number(ethers.utils.formatEther(vault.balance));
    if (!isAddingDuration) {
      totalFortune += fortuneToStake;
    }
    const daysForTroops = canUseDuration ? totalDays : depositLength;
    setNewTroops(Math.floor(((totalFortune * daysForTroops) / 1080) / 10));

    setNewWithdrawDate((Number(vault.endTime) + (daysToStake * 86400))*1000);
  }, [daysToStake, fortuneToStake]);

  // Calculate APR and Troops from current vault
  useEffect(() => {
    const vaultDays = Number(vault.length / 86400);
    const vaultFortune = Number(ethers.utils.formatEther(vault.balance));
    const numTerms = Math.floor(vaultDays / rdConfig.bank.staking.fortune.termLength);
    const availableAprs = rdConfig.bank.staking.fortune.apr as any;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    setCurrentApr(availableAprs[aprKey] ?? availableAprs[1]);

    setCurrentTroops(Math.floor(((vaultFortune * vaultDays) / 1080) / 10));
  }, [vault]);

  // Check for fortune on load
  useEffect(() => {
    if (!!user.address) {
      checkForFortune();
    }
  }, [user.address]);

  // Set max duration increase
  useEffect(() => {
    const vaultTerms = vault.length / 86400 / rdConfig.bank.staking.fortune.termLength;
    const maxTerms = rdConfig.bank.staking.fortune.maxTerms;
    console.log('TESTY', maxTerms, vaultTerms, maxTerms - vaultTerms);
    setMaxDurationIncrease(maxTerms - vaultTerms);
  }, [vault, rdConfig]);

  return (
    <Box mx={1} pb={6}>
      {currentStep === steps.complete ? (
        <StakeComplete
          amount={type === 'amount' ? fortuneToStake : 0}
          duration={type === 'duration' ? daysToStake : 0}
          onReturn={onReturn}
        />
      ) : (
        <>
          <Box textAlign='center' bgColor='#292626' roundedBottom='md' p={4}>
            <SimpleGrid columns={{base: 2, sm: 4}} gap={2}>
              <Box>
                <Text fontSize='sm'>Staked</Text>
                <Text fontWeight='bold'>{commify(round(Number(ethers.utils.formatEther(vault.balance))))}</Text>
              </Box>
              <Box>
                <Text fontSize='sm'>APR</Text>
                <Text fontWeight='bold'>{currentApr * 100}%</Text>
              </Box>
              <Box>
                <Text fontSize='sm'>Troops</Text>
                <Text fontWeight='bold'>{currentTroops}</Text>
              </Box>
              <Box>
                <Text fontSize='sm'>Withdraw Date</Text>
                <Text fontWeight='bold'>{moment(vault.endTime * 1000).format("MMM D yyyy")}</Text>
              </Box>
            </SimpleGrid>
          </Box>
          <Box bgColor='#292626' rounded='md' mt={1} p={4}>
            <SimpleGrid columns={type === 'amount' ? 2 : 1}>
              {type === 'amount' && (
                <VStack align='start'>
                  <Box fontSize='sm' fontWeight='bold'>Deposit Amount</Box>
                  <FormControl maxW='200px' isInvalid={!!inputError}>
                    <NumberInput
                      defaultValue={1000}
                      min={rdConfig.bank.staking.fortune.minimum}
                      name="quantity"
                      onChange={handleChangeFortuneAmount}
                      value={fortuneToStake}
                      step={1000}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper color='#ffffffcc' />
                        <NumberDecrementStepper color='#ffffffcc'/>
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{inputError}</FormErrorMessage>
                  </FormControl>
                </VStack>
              )}
              {type === 'duration' && (
                <VStack align='start'>
                  <Text>Increase duration by</Text>
                  <FormControl maxW='250px' isInvalid={!!lengthError}>
                    <Select onChange={handleChangeDays} value={daysToStake} bg='none'>
                      {[...Array(maxDurationIncrease).fill(0)].map((_, i) => (
                        <option key={i} value={`${(i + 1) * rdConfig.bank.staking.fortune.termLength}`}>
                          {(i + 1)} {pluralize((i + 1), 'Season')} ({(i + 1) * rdConfig.bank.staking.fortune.termLength} days)
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{lengthError}</FormErrorMessage>
                  </FormControl>
                </VStack>
              )}
              {type === 'amount' && (
                <VStack align='end' textAlign='end'>
                  <Box fontSize='sm' fontWeight='bold'>Balance: {isRetrievingFortune ? <Spinner size='sm'/> : commify(round(userFortune))}</Box>
                  <Flex justify='end'>
                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/fortune.svg').convert()} alt="fortuneIcon" boxSize={6}/>
                    <Box ms={1}>$Fortune</Box>
                  </Flex>
                </VStack>
              )}
            </SimpleGrid>
            {type === 'amount' && (
              <Flex mt={8} justify='center'>
                <ButtonGroup>
                  <Button rounded='2xl' size={{base: 'sm' , sm: 'md'}} onClick={() => handleDepositPct(25)}>25%</Button>
                  <Button rounded='2xl' size={{base: 'sm' , sm: 'md'}} onClick={() => handleDepositPct(50)}>50%</Button>
                  <Button rounded='2xl' size={{base: 'sm' , sm: 'md'}} onClick={() => handleDepositPct(75)}>75%</Button>
                  <Button rounded='2xl' size={{base: 'sm' , sm: 'md'}} onClick={() => handleDepositPct(100)}>MAX</Button>
                </ButtonGroup>
              </Flex>
            )}
          </Box>

          <SimpleGrid columns={2} my={4} px={1}>
            <Box>APR</Box>
            <Box textAlign='end' fontWeight='bold'>{newApr * 100}%</Box>
            <Box>Troops</Box>
            <Box textAlign='end' fontWeight='bold'>{newTroops}</Box>
            <Box>End Date</Box>
            <Box textAlign='end' fontWeight='bold'>{moment(newWithdrawDate).format("MMM D yyyy")}</Box>
          </SimpleGrid>

          <Box bgColor='#292626' rounded='md' p={4} fontSize='sm'>
            <Text>You will not be able to withdraw your tokens before the period end date.</Text>
            <Text mt={4}>APR figures are estimates provided for your convenience only, and by no means represent guaranteed returns.</Text>
          </Box>

          <Box mt={8} textAlign='center'>
            <RdButton
              fontSize={{base: 'xl', sm: '2xl'}}
              stickyIcon={true}
              onClick={handleStake}
              isLoading={isExecuting}
              disabled={isExecuting}
            >
              {user.address ? (
                <>{isExecuting ? executingLabel : 'Update'}</>
              ) : (
                <>Connect</>
              )}
            </RdButton>
          </Box>
        </>
      )}
    </Box>
  )
}

interface StakeCompleteProps {
  amount?: number;
  duration?: number;
  onReturn: () => void;
}

const StakeComplete = ({amount, duration, onReturn}: StakeCompleteProps) => {
  return (
    <Box py={4}>
      {!!amount && amount > 0 && (
        <Center>
          <Box>An extra {amount} $Fortune has now been staked to this vault!</Box>
        </Center>
      )}
      {!!duration && duration > 0 && (
        <Center>
          <Box mt={2}>An extra {duration} days has now been added to this vault!</Box>
        </Center>
      )}
      <Box textAlign='center' mt={8} mx={2}>
        <Box ps='20px'>
          <RdButton
            fontSize={{base: 'xl', sm: '2xl'}}
            stickyIcon={true}
            onClick={onReturn}
          >
            Back To Vaults
          </RdButton>
        </Box>
      </Box>
    </Box>
  )
}

export default EditVaultPage;