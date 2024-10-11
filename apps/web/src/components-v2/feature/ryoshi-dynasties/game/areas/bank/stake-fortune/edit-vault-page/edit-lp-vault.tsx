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
import {commify} from "ethers/lib/utils";
import {
  ciEquals,
  createSuccessfulTransactionToastContent,
  findNextLowestNumber,
  pluralize,
  round
} from "@market/helpers/utils";
import {ethers} from "ethers";
import moment from "moment/moment";
import React, {ChangeEvent, useCallback, useContext, useEffect, useMemo, useState} from "react";
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
import {Address, formatEther, parseEther} from "viem";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useCallWithGasPrice} from "@eb-pancakeswap-web/hooks/useCallWithGasPrice";
import useStakingPair from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/use-staking-pair";
import { useTokenContract } from "@dex/swap/imported/pancakeswap/web/hooks/useContract";

interface EditVaultPageProps {
  vault: FortuneStakingAccount;
  type: string;
  onSuccess: (amount: number, days: number) => void;
}

const EditLpVault = ({vault, type, onSuccess}: EditVaultPageProps) => {
  const {config: rdConfig} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: bankChainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chainId: activeChainId} = useActiveChainId();
  const bankContract = useBankContract(bankChainId);
  const { callWithGasPrice } = useCallWithGasPrice();
  const vaultConfig = useMemo(() => chainConfig.lpVaults.find((v) => ciEquals(v.pair, vault.pool)), [vault, chainConfig]);

  const user = useUser();
  const [runAuthedFunction] = useAuthedFunctionWithChainID(bankChainId);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('Staking...');
  const [isRetrievingToken, setIsRetrievingToken] = useState(false);
  const [maxDurationIncrease, setMaxDurationIncrease] = useState(rdConfig.bank.staking.fortune.maxTerms);

  const [amountToStake, setAmountToStake] = useState('');
  const [daysToStake, setDaysToStake] = useState(rdConfig.bank.staking.fortune.termLength)
  const [tokenBalance, setTokenBalance] = useState('0');
  const [tokenBalanceWei, setTokenBalanceWei] = useState<bigint>(0n);

  const [lengthError, setLengthError] = useState('');
  const [inputError, setInputError] = useState('');

  const [currentApr, setCurrentApr] = useState(0);
  const [currentTroops, setCurrentTroops] = useState(0);
  const [newApr, setNewApr] = useState(0);
  const [newTroops, setNewTroops] = useState(0);
  const [additionalMitama, setAdditionalMitama] = useState(0);
  const [newMitama, setNewMitama] = useState(0);
  const [newWithdrawDate, setNewWithdrawDate] = useState(vault.endTime);

  const stakingPair = useStakingPair({pairAddress: vaultConfig!.pair, chainId: bankChainId});

  const lpContract = useTokenContract(vaultConfig!.pair, bankChainId);

  const derivedFrtnAmount = (amount: number | string) => {
    if (!stakingPair || !stakingPair.totalSupply || stakingPair.totalSupply.equalTo(0)) {
      return '0'
    }
    return stakingPair.frtnReserve?.multiply(parseEther(`${amount}`)).divide(stakingPair.totalSupply ?? 0).toExact() ?? '0';
  };

  

  const handleChangeFortuneAmount = (valueAsString: string, valueAsNumber: number) => {
    setAmountToStake(valueAsString);
  }

  const handleChangeDays = (e: ChangeEvent<HTMLSelectElement>) => {
    setDaysToStake(Number(e.target.value))
  }

  const checkForApproval = async () => {
    const totalApproved = await lpContract?.read.allowance([user.address as Address, chainConfig.contracts.bank]);
    return totalApproved as bigint;
  }

  const checkTokenBalance = async () => {
    try {
      setIsRetrievingToken(true);
      const tokenBalance = await stakingPair.tokenContract?.read.balanceOf([user.address as Address]);
      const formattedAmount = formatEther(tokenBalance as bigint);
      setTokenBalance(formattedAmount);
      setTokenBalanceWei(tokenBalance ?? 0n);
    } finally {
      setIsRetrievingToken(false);
    }
  }

  const handleDepositPct = useCallback((pct: number) => {
    const percentageBigInt = BigInt(pct);
    const result = (parseEther(tokenBalance) * percentageBigInt) / BigInt(100);
    setAmountToStake(formatEther(result));
  }, [tokenBalance]);


  const validateInput = async () => {
    setExecutingLabel('Validating');

    const isAddingDuration = type === 'duration';

    if (!isAddingDuration && tokenBalanceWei < parseEther(amountToStake)) {
      toast.error("Not enough LP");
      return;
    }

    if(!isAddingDuration && Number(derivedFrtnAmount(amountToStake)) < 1){
      setInputError(`At least 1 LP token required`);
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
        const tx = await callWithGasPrice(bankContract, 'increaseLengthForLPVault', [
          daysToStake * 86400,
          vault.pool,
          vault.index
        ]);
        toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));
      } else {
        const totalApproved = await checkForApproval();
        const desiredFortuneAmount = parseEther(amountToStake.toString());


        if (totalApproved < desiredFortuneAmount) {
          const txHash = await lpContract?.write.approve(
            [chainConfig.contracts.bank as `0x${string}`, desiredFortuneAmount],
            {
              account: user.address!,
              chain: chainConfig.chain
            }
          );
          toast.success(createSuccessfulTransactionToastContent(txHash ?? '', bankChainId));
        }


        // console.log( parseEther(`${amountToStake}`), vaultConfig?.pair, daysToStake*86400);
        // const expectedMitama = await bankContract?.read.mitamaForLp([
        //   parseEther(`${amountToStake}`),
        //   vaultConfig?.pair,
        //   vault.length,
        // ]);
        // console.log(expectedMitama, newMitama);

        const tx = await callWithGasPrice(bankContract, 'increaseDepositForLPVault', [
          parseEther(String(amountToStake)),
          vault.index,
          vault.pool,
          additionalMitama
        ]);
        toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));
      }
      onSuccess(Number(amountToStake), daysToStake);
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
    const availableAprs = rdConfig.bank.staking.fortune.lpApr as any;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    setNewApr(availableAprs[aprKey] ?? availableAprs[1]);

    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    const sumDays = Number(vault.length / (86400)) + (type === 'duration' ? daysToStake : 0);
    const sumAmount = Number(derivedFrtnAmount(formatEther(vault.balance))) + (type === 'amount' ? Number(derivedFrtnAmount(amountToStake)) : 0);
    const mitama = (sumAmount * sumDays) / 1080;
    const multipliedLpMitama = Math.floor(mitama * 2.5 * 0.98); // 2% slippage

    const additionalAmount = (type === 'amount') ? Number(derivedFrtnAmount(amountToStake)) : 0;
    const additionalMitama = (additionalAmount * daysToStake) / 1080;
    const multipliedAdditionalLpMitama = Math.floor(additionalMitama * 2.5 * 0.98); // 2% slippage;
    setAdditionalMitama(multipliedAdditionalLpMitama);

    let newTroops = Math.floor(multipliedLpMitama / mitamaTroopsRatio);
    if (newTroops < 1 && sumAmount > 0) newTroops = 1;
    setNewTroops(newTroops);
    setNewMitama(multipliedLpMitama);

    if (isAddingDuration) {
      setNewWithdrawDate((Number(vault.endTime) + (daysToStake * 86400)) * 1000);
    } else {
      setNewWithdrawDate(Number(vault.endTime) * 1000);
    }
  }, [daysToStake, amountToStake, vault]);

  // Calculate APR and Troops from current vault
  useEffect(() => {
    const vaultDays = Number(vault.length / 86400);
    const vaultFortune = Number(ethers.utils.formatEther(vault.balance));
    const numTerms = Math.floor(vaultDays / rdConfig.bank.staking.fortune.termLength);
    const availableAprs = rdConfig.bank.staking.fortune.lpApr as any;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    setCurrentApr(availableAprs[aprKey] ?? availableAprs[1]);

    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    let newTroops = Math.floor(((vaultFortune * vaultDays) / 1080) / mitamaTroopsRatio);
    if (newTroops < 1 && vaultFortune > 0) newTroops = 1;
    setCurrentTroops(newTroops);
  }, [vault]);

  // Check for fortune on load
  useEffect(() => {
    if (!!user.address && !!stakingPair.tokenContract) {
      checkTokenBalance();
    }
  }, [user.address, stakingPair.tokenContract]);

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
            <Text fontWeight='bold'>{commify(round(Number(ethers.utils.formatEther(vault.balance)), 7))}</Text>
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
              <Box fontSize='sm' fontWeight='bold'>Deposit LP Amount</Box>
              <FormControl maxW='200px' isInvalid={!!inputError}>
                <NumberInput
                  defaultValue={rdConfig.bank.staking.fortune.minimum}
                  min={0.000000001}
                  name="quantity"
                  onChange={handleChangeFortuneAmount}
                  value={amountToStake}
                  step={10}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper color='#ffffffcc' />
                    <NumberDecrementStepper color='#ffffffcc'/>
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{inputError}</FormErrorMessage>
              </FormControl>
              <Flex fontSize='sm'>
                FRTN: <>{commify(round(+derivedFrtnAmount(amountToStake), 3))}</>
              </Flex>
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
              <Box fontSize='sm' fontWeight='bold'>Balance: {isRetrievingToken ? <Spinner size='sm'/> : commify(round(Number(tokenBalance), 7))}</Box>
              <Flex justify='end' align='center'>
                <Box ms={1} fontSize='sm'>{vaultConfig?.name} LP</Box>
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
        <Text mt={4}>Flucuations of the price may cause the awarded amount of Mitama to change. This is the minimum amount to be accepted once the vault is created the amount of Mitama will not change.</Text>
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

export default EditLpVault;