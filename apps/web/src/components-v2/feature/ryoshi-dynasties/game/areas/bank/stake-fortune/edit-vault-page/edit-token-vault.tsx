import {FortuneStakingAccount} from "@src/core/services/api-service/graph/types";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
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
import {commify, formatEther} from "ethers/lib/utils";
import {createSuccessfulTransactionToastContent, findNextLowestNumber, pluralize, round} from "@market/helpers/utils";
import {ethers} from "ethers";
import moment from "moment";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import {useAppChainConfig} from "@src/config/hooks";
import {useBankContract, useFrtnContract} from "@src/global/hooks/contracts";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useUser} from "@src/components-v2/useUser";
import useAuthedFunctionWithChainID from "@market/hooks/useAuthedFunctionWithChainID";
import {Address, parseEther} from "viem";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useCallWithGasPrice} from "@eb-pancakeswap-web/hooks/useCallWithGasPrice";

interface EditVaultPageProps {
  vault: FortuneStakingAccount;
  type: string;
  onSuccess: (amount: number, days: number) => void;
}

const EditTokenVault = ({vault, type, onSuccess}: EditVaultPageProps) => {
  const {config: rdConfig} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: bankChainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);
  const frtnContract = useFrtnContract(bankChainId);
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chainId: activeChainId} = useActiveChainId();
  const bankContract = useBankContract(bankChainId);
  const { callWithGasPrice } = useCallWithGasPrice();

  const user = useUser();
  const [runAuthedFunction] = useAuthedFunctionWithChainID(bankChainId);

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
  const [newMitama, setNewMitama] = useState(0);
  const [newWithdrawDate, setNewWithdrawDate] = useState(vault.endTime);

  const handleChangeFortuneAmount = (valueAsString: string, valueAsNumber: number) => {
    setFortuneToStake(!isNaN(valueAsNumber) ? Math.floor(valueAsNumber) : 0);
  }

  const handleChangeDays = (e: ChangeEvent<HTMLSelectElement>) => {
    setDaysToStake(Number(e.target.value))
  }

  const checkForApproval = async () => {
    const totalApproved = await frtnContract?.read.allowance([user.address as Address, chainConfig.contracts.bank]);
    return totalApproved as bigint;
  }

  const checkForFortune = async () => {
    try {
      setIsRetrievingFortune(true);
      const totalFortune = await frtnContract?.read.balanceOf([user.address as Address]);
      const formatedFortune = +formatEther(totalFortune as bigint);
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

    if(!isAddingDuration && fortuneToStake < 1){
      setInputError(`At least 1 Fortune required`);
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
    runAuthedFunction(async() => {
      if (!await validateInput()) return;
      await executeStakeFortune();
    });
  }

  const executeStakeFortune = async () => {
    try {
      setIsExecuting(true);
      setExecutingLabel('Staking');

      if (activeChainId !== bankChainId) {
        await switchNetworkAsync(bankChainId);
        return;
      }

      if (type === 'duration') {
        const tx = await callWithGasPrice(bankContract, 'increaseLengthForVault', [daysToStake * 86400, vault.index]);
        toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));
      } else {
        const totalApproved = await checkForApproval();
        const desiredFortuneAmount = parseEther(Math.floor(fortuneToStake).toString());

        if (totalApproved < desiredFortuneAmount) {
          const txHash = await frtnContract?.write.approve(
            [chainConfig.contracts.bank as `0x${string}`, desiredFortuneAmount],
            {
              account: user.address!,
              chain: chainConfig.chain
            }
          );
          toast.success(createSuccessfulTransactionToastContent(txHash ?? '', bankChainId));
        }

        const tx = await callWithGasPrice(bankContract, 'increaseDepositForVault', [parseEther(String(fortuneToStake)), vault.index]);
        toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));
      }
      onSuccess(fortuneToStake, daysToStake);
    } catch (error: any) {
      console.log(error)
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  // Calculate APR and Troops from vault plus input
  useEffect(() => {
    const isAddingDuration = type === 'duration';

    let totalDays = vault.length / 86400;
    if (isAddingDuration) {
      totalDays += daysToStake;
    }
    const numTerms = Math.floor(totalDays / rdConfig.bank.staking.fortune.termLength);
    const availableAprs = rdConfig.bank.staking.fortune.apr as any;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    setNewApr(availableAprs[aprKey] ?? availableAprs[1]);

    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    const sumDays = Number(vault.length / (86400)) + (type === 'duration' ? daysToStake : 0);
    const sumAmount = Number(ethers.utils.formatEther(vault.balance)) + (type === 'amount' ? fortuneToStake : 0);
    const mitama = Math.floor((sumAmount * sumDays) / 1080);
    let newTroops = Math.floor(mitama / mitamaTroopsRatio);
    if (newTroops < 1 && sumAmount > 0) newTroops = 1;
    setNewTroops(newTroops);
    setNewMitama(mitama);

    if (isAddingDuration) {
      setNewWithdrawDate((Number(vault.endTime) + (daysToStake * 86400)) * 1000);
    } else {
      setNewWithdrawDate(Number(vault.endTime) * 1000);
    }
  }, [daysToStake, fortuneToStake, vault]);

  // Calculate APR and Troops from current vault
  useEffect(() => {
    const vaultDays = Number(vault.length / 86400);
    const vaultFortune = Number(ethers.utils.formatEther(vault.balance));
    const numTerms = Math.floor(vaultDays / rdConfig.bank.staking.fortune.termLength);
    const availableAprs = rdConfig.bank.staking.fortune.apr as any;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    setCurrentApr(availableAprs[aprKey] ?? availableAprs[1]);

    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    let newTroops = Math.floor(((vaultFortune * vaultDays) / 1080) / mitamaTroopsRatio);
    if (newTroops < 1 && vaultFortune > 0) newTroops = 1;
    setCurrentTroops(newTroops);
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
    setMaxDurationIncrease(maxTerms - vaultTerms);
  }, [vault, rdConfig]);

  return (
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
                  defaultValue={rdConfig.bank.staking.fortune.minimum}
                  min={1}
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
              <Flex justify='end' align='center'>
                <FortuneIcon boxSize={6} />
                <Box ms={1}>$FRTN</Box>
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
        <Box textAlign='end' fontWeight='bold'>{commify(newTroops)}</Box>
        <Box>Mitama</Box>
        <Box textAlign='end' fontWeight='bold'>{commify(newMitama)}</Box>
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
          loadingText={isExecuting ? executingLabel : 'Update'}
        >
          {user.address ? (
            <>Update</>
          ) : (
            <>Connect</>
          )}
        </RdButton>
      </Box>
    </>
  )
}

export default EditTokenVault;