import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import {createSuccessfulTransactionToastContent, findNextLowestNumber, pluralize, round} from "@src/utils";
import {commify} from "ethers/lib/utils";
import RdButton from "../../../../components/rd-button";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useAppSelector} from "@src/Store/hooks";
import {toast} from "react-toastify";
import {BigNumber, Contract, ethers} from "ethers";
import Fortune from "@src/Contracts/Fortune.json";
import Bank from "@src/Contracts/Bank.json";
import {appConfig} from "@src/Config";
import {useDispatch} from "react-redux";
import ImageService from "@src/core/services/image";

const config = appConfig();

const steps = {
  form: 'form',
  complete: 'complete'
};

interface CreateVaultPageProps {
  vaultIndex: number;
  onReturn: () => void;
}

const CreateVaultPage = ({vaultIndex, onReturn}: CreateVaultPageProps) => {
  const dispatch = useDispatch();
  const { config: rdConfig, refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useAppSelector((state) => state.user);

  const [currentStep, setCurrentStep] = useState(steps.form);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('Staking...');
  const [isRetrievingFortune, setIsRetrievingFortune] = useState(false);

  const [fortuneToStake, setFortuneToStake] = useState(1250);
  const [daysToStake, setDaysToStake] = useState(rdConfig.bank.staking.fortune.termLength)
  const [userFortune, setUserFortune] = useState(0)

  const [lengthError, setLengthError] = useState('');
  const [inputError, setInputError] = useState('');

  const [newApr, setNewApr] = useState(0);
  const [newTroops, setNewTroops] = useState(0);


  const handleChangeFortuneAmount = (valueAsString: string, valueAsNumber: number) => {
    setFortuneToStake(!isNaN(valueAsNumber) ? Math.floor(valueAsNumber) : 0);
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

  const validateInput = async () => {
    setExecutingLabel('Validating');

    if (userFortune < fortuneToStake) {
      toast.error("Not enough Fortune");
      return;
    }

    if(fortuneToStake < rdConfig.bank.staking.fortune.minimum) {
      setInputError(`At least ${rdConfig.bank.staking.fortune.minimum} required`);
      return false;
    }
    setInputError('');

    if (daysToStake < rdConfig.bank.staking.fortune.termLength) {
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
      setExecutingLabel('Approving');
      //check for approval
      const totalApproved = await checkForApproval();
      const desiredFortuneAmount = ethers.utils.parseEther(Math.floor(fortuneToStake).toString());

      if(totalApproved.lt(desiredFortuneAmount)){
        const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
        const tx = await fortuneContract.approve(config.contracts.bank, desiredFortuneAmount);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      }

      setExecutingLabel('Staking');
      const bankContract = new Contract(config.contracts.bank, Bank, user.provider.getSigner());

      const tx = await bankContract.openVault(desiredFortuneAmount, daysToStake*86400, vaultIndex);
      const receipt = await tx.wait();

      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setCurrentStep(steps.complete);
      refreshUser();
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
    const numTerms = Math.floor(daysToStake / rdConfig.bank.staking.fortune.termLength);
    const availableAprs = rdConfig.bank.staking.fortune.apr as any;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    setNewApr(availableAprs[aprKey] ?? availableAprs[1]);

    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    let newTroops = Math.floor(((fortuneToStake * daysToStake) / 1080) / mitamaTroopsRatio);
    if (newTroops < 1 && fortuneToStake > 0) newTroops = 1;
    setNewTroops(newTroops);
  }, [daysToStake, fortuneToStake]);


  useEffect(() => {
    if (!!user.address) {
      checkForFortune();
    }
  }, [user.address]);

  return (
    <Box mx={1} pb={6}>
      {currentStep === steps.complete ? (
        <StakeComplete amount={fortuneToStake} duration={daysToStake} onReturn={onReturn} />
      ) : (
        <>
          <Box bg='#272523' p={2} roundedBottom='md'>
            <Box textAlign='center' w='full'>
              <Flex>
                <Spacer />
                <HStack>
                  <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>Your</Text>
                  <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/fortune.svg').convert()} alt="fortuneIcon" boxSize={6}/>
                  <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>
                    $Fortune: {isRetrievingFortune ? <Spinner size='sm'/> : commify(round(userFortune))}
                  </Text>
                </HStack>
                <Spacer />
              </Flex>
            </Box>
          </Box>
          {!isRetrievingFortune && userFortune > 0 ? (
            <Box px={6} pt={6}>
              <SimpleGrid columns={2} fontSize='sm'>
                <VStack>
                  <Text>Amount to stake</Text>
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
                  <Flex>
                    <Button textColor='#e2e8f0' variant='link' fontSize='sm' onClick={() => setFortuneToStake(Math.floor(userFortune))}>Stake all</Button>
                  </Flex>
                </VStack>

                <VStack>
                  <Text>Duration (days)</Text>
                  <FormControl maxW='250px' isInvalid={!!lengthError}>
                    <Select onChange={handleChangeDays} value={daysToStake} bg='none'>
                      {[...Array(12).fill(0)].map((_, i) => (
                        <option key={i} value={`${(i + 1) * rdConfig.bank.staking.fortune.termLength}`}>
                          {(i + 1)} {pluralize((i + 1), 'Season')} ({(i + 1) * rdConfig.bank.staking.fortune.termLength} days)
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{lengthError}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </SimpleGrid>

              <Box bgColor='#292626' rounded='md' p={4} mt={4} textAlign='center'>
                <SimpleGrid columns={2}>
                  <Text>APR</Text>
                  <Text>Troops</Text>
                  <Text fontSize={24} fontWeight='bold'>{newApr * 100}%</Text>
                  <Text fontSize={24} fontWeight='bold'>{commify(round(newTroops))}</Text>
                  <Text fontSize={12} color='#aaa'>{commify(daysToStake)} day commitment</Text>
                  <Text fontSize={12} color='#aaa'>{commify(fortuneToStake)} $Fortune stake</Text>
                </SimpleGrid>
              </Box>


              <Spacer h='8'/>
              <Flex alignContent={'center'} justifyContent={'center'}>
                <Box ps='20px'>
                  <RdButton
                    fontSize={{base: 'xl', sm: '2xl'}}
                    stickyIcon={true}
                    onClick={handleStake}
                    isLoading={isExecuting}
                    disabled={isExecuting}
                    loadingText={executingLabel}
                  >
                    {user.address ? (
                      <>Stake $Fortune</>
                    ) : (
                      <>Connect</>
                    )}
                  </RdButton>
                </Box>
              </Flex>
            </Box>
          ) : !isRetrievingFortune && (
            <Box textAlign='center' mt={4}>
              <Text>You currently have no Fortune in your wallet.</Text>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

interface StakeCompleteProps {
  amount: number;
  duration: number;
  onReturn: () => void;
}

const StakeComplete = ({amount, duration, onReturn}: StakeCompleteProps) => {
  return (
    <Box py={4}>
      <Box textAlign='center' mt={2}>
        {amount} $Fortune has now been staked for {duration} days!
      </Box>
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

export default CreateVaultPage;