import { FortuneStakingAccount } from '@src/core/services/api-service/graph/types';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react';
import { ChainLogo } from '@dex/components/logo';
import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context';
import { useAppChainConfig } from '@src/config/hooks';
import { useSwitchNetwork } from '@eb-pancakeswap-web/hooks/useSwitchNetwork';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { useBankContract, useTokenContract } from '@src/global/hooks/contracts';
import { useCallWithGasPrice } from '@eb-pancakeswap-web/hooks/useCallWithGasPrice';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context';
import {
  ciEquals,
  createSuccessfulTransactionToastContent,
  findNextLowestNumber,
  round,
  timeSince
} from '@market/helpers/utils';
import useFrtnStakingPair
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/use-frtn-staking-pair';
import StakePreview
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/create-vault-page/stake-preview';
import { Address, formatEther, parseEther, parseUnits } from 'viem';
import { RdModalBox } from '@src/components-v2/feature/ryoshi-dynasties/components/rd-modal';
import { RdButton } from '@src/components-v2/feature/ryoshi-dynasties/components';
import { useUser } from '@src/components-v2/useUser';
import { useCurrencyByChainId } from '@eb-pancakeswap-web/hooks/tokens';
import { CurrencyAmount, MaxUint256 } from '@pancakeswap/swap-sdk-core';
import { commify } from 'ethers/lib/utils';
import { Field } from '@eb-pancakeswap-web/state/mint/actions';
import { toast } from 'react-toastify';
import { parseErrorMessage } from '@src/helpers/validator';
import useAuthedFunctionWithChainID from '@market/hooks/useAuthedFunctionWithChainID';
import { Contract } from 'ethers';
import Bank from "@src/global/contracts/Bank.json";

interface ImportVaultFormProps {
  vault: FortuneStakingAccount;
  onComplete: () => void;
}

const ConvertNewLpVault = ({vault, onComplete}: ImportVaultFormProps) => {
  const user = useUser();
  const { config: rdConfig, refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: bankChainId, vaultType } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chainId: activeChainId} = useActiveChainId();
  const bankContract = useBankContract(bankChainId);
  const { callWithGasPrice } = useCallWithGasPrice();
  const [runAuthedFunction] = useAuthedFunctionWithChainID(bankChainId);

  const [pairConfig, setPairConfig] = useState(chainConfig.lpVaults[0]);

  const stakingPair = useFrtnStakingPair({
    pairAddress: pairConfig.pair,
    chainId: chainConfig.chain.id
  });


  const currencyA = useCurrencyByChainId(pairConfig.address1, bankChainId);
  const currencyB = useCurrencyByChainId(pairConfig.address2, bankChainId);
  // const tokenA = useTokenByChainId(pairConfig.address1, bankChainId);
  // const tokenB = useTokenByChainId(pairConfig.address2, bankChainId);
  // const [pairState, pair] = useV2Pair(tokenA, tokenB)


  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('Converting...');

  const [newApr, setNewApr] = useState(0);
  const [newTroops, setNewTroops] = useState(0);
  const [newMitama, setNewMitama] = useState(0);

  const vaultBalanceEth = formatEther(BigInt(vault.balance));
  const [amountToStake, setAmountToStake] = useState(round(vaultBalanceEth).toString());
  const [inputError, setInputError] = useState('');

  const stakingDays = vault.length / 86400;

  const dependentAmount = useMemo(() => {
    const tokenA = currencyA?.wrapped;
    const tokenB = currencyB?.wrapped;
    if (!tokenA || !tokenB || !stakingPair.pair) return '0';

    const amountWei = parseEther(amountToStake);
    const inputCurrency = CurrencyAmount.fromRawAmount(tokenA, amountWei);
    const wrappedIndependentAmount = inputCurrency?.wrapped
    const dependentTokenAmount = stakingPair.pair.priceOf(stakingPair.frtnCurrency).quote(wrappedIndependentAmount);

    console.log({
        a_pair: stakingPair.pair.liquidityToken.address,
        b_tokenA: tokenA?.address,
        c_tokenB: tokenB?.address,
        d_independentAmount: inputCurrency.wrapped.quotient,
        e_dependentTokenAmount: dependentTokenAmount.quotient,
        f: inputCurrency.currency
      }
    );
    return dependentTokenAmount.toSignificant(6);
  }, [currencyA?.wrapped, currencyB?.wrapped, stakingPair.pair, pairConfig])

  const handleChangeToken = (e: ChangeEvent<HTMLSelectElement>) => {
    const _pairConfig = chainConfig.lpVaults.find((v) => v.pair === e.target.value);
    if (!_pairConfig) return;

    setPairConfig(_pairConfig);
  }

  const handleChangeTokenAmount = (valueAsString: string, valueAsNumber: number) => {
    setAmountToStake(round(valueAsNumber).toString());
  }

  const validateInput = async () => {
    setExecutingLabel('Validating');

    // if (tokenBalanceWei < parseEther(amountToStake)) {
    //   toast.error("Not enough LP");
    //   return;
    // }
    //
    // if(Number(derivedFrtnAmount) < rdConfig.bank.staking.fortune.minimum) {
    //   setInputError(`At least ${rdConfig.bank.staking.fortune.minimum} in FRTN required`);
    //   return false;
    // }
    // setInputError('');
    //
    // if (daysToStake < rdConfig.bank.staking.fortune.termLength) {
    //   setLengthError(`At least ${rdConfig.bank.staking.fortune.termLength} days required`);
    //   return false;
    // }
    // setLengthError('');

    return true;
  }

  const checkForApproval = async () => {
    if (!stakingPair.otherContract) return 0;

    const totalApproved = await stakingPair.otherContract.read.allowance([user.address as Address, chainConfig.contracts.bank]);
    return totalApproved as bigint;
  }

  const handleConvert = async () => {
    runAuthedFunction(async() => {
      if (!await validateInput()) return;
      await executeConvert();
    });
  }

  const executeConvert = async () => {
    try {
      setIsExecuting(true);
      setExecutingLabel('Approving');

      if (activeChainId !== bankChainId) {
        await switchNetworkAsync(bankChainId);
        return;
      }

      //check for approval
      const totalApproved = await checkForApproval();
      const desiredLpAmount = parseEther(amountToStake.toString());

      if (totalApproved < MaxUint256) {
        const txHash = await stakingPair.otherContract?.write.approve(
          [chainConfig.contracts.bank as `0x${string}`, MaxUint256],
          {
            account: user.address!,
            chain: chainConfig.chain
          }
        );
        toast.success(createSuccessfulTransactionToastContent(txHash ?? '', bankChainId));
      }

      setExecutingLabel('Staking');

      // const mitamaForLp = await bankContract?.read.mitamaForLp([parseEther(amountToStake), liquidityToken?.address, daysToStake*86400])

      const dependentAmountWei = parseEther(dependentAmount)
      // console.log([
      //   vault.index,
      //   stakingPair.pair.liquidityToken.address,
      //   desiredLpAmount,
      //   testDAmt
      // ])
      // const eContract = new Contract(chainConfig.contracts.bank, Bank, user.provider.signer);
      // await eContract.convertFRTNVaultToNewLP(vault.index,
      //   stakingPair.pair.liquidityToken.address,
      //   desiredLpAmount,
      //   testDAmt);
      const tx = await callWithGasPrice(bankContract, 'convertFRTNVaultToNewLP', [
        vault.index,
        stakingPair.pair.liquidityToken.address,
        desiredLpAmount,
        dependentAmountWei
      ]);

      toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));
      onSuccess(Number(amountToStake), daysToStake);
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  useEffect(() => {
    const numTerms = Math.floor(stakingDays / rdConfig.bank.staking.fortune.termLength);
    const availableAprs = rdConfig.bank.staking.fortune.lpApr;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    setNewApr(availableAprs[aprKey] ?? availableAprs[1]);

    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    const mitama = (Number(amountToStake) * stakingDays) / 1080;
    const multipliedLpMitama = Math.floor(mitama * 2.5 * 0.98); // 2% slippage

    let newTroops = Math.floor(multipliedLpMitama / mitamaTroopsRatio);
    if (newTroops < 1 && Number(amountToStake) > 0) newTroops = 1;
    setNewTroops(newTroops);
    setNewMitama(multipliedLpMitama);
  }, [vault.length, amountToStake, stakingDays]);

  return (
    <>
      <Box bg='#272523' p={2} roundedBottom='md'>
        <Box textAlign='center' w='full'>
          <Flex justify='space-between'>
            <HStack>
              <ChainLogo chainId={bankChainId} />
              <Text fontSize='sm'>{chainConfig.name}</Text>
            </HStack>
          </Flex>
        </Box>
      </Box>
      <Box px={6} pt={6}>
        <SimpleGrid columns={2} fontSize='sm' gap={4}>
          <VStack align='stretch'>
            <Text>LP Token</Text>
            <FormControl maxW='250px'>
              <Select onChange={handleChangeToken} value={pairConfig.pair} bg='none'>
                {chainConfig.lpVaults.map((vaultConfig) => (
                  <option key={vaultConfig.pair} value={vaultConfig.pair}>{vaultConfig.name}</option>
                ))}
              </Select>
            </FormControl>
          </VStack>
          <VStack align='stretch'>
            <Text>Vault Time Remaining</Text>
            <Text fontSize={{base: 'sm', sm: 'md'}} my='auto'>
              {timeSince(vault.endTime * 1000)}
            </Text>
          </VStack>
          <VStack align='stretch'>
            <Text>FRTN to stake</Text>
            <Stack direction='row'>
              <FormControl maxW='200px' isInvalid={!!inputError}>
                <NumberInput
                  defaultValue={vaultBalanceEth}
                  min={1}
                  max={parseFloat(vaultBalanceEth)}
                  name="quantity"
                  onChange={handleChangeTokenAmount}
                  value={amountToStake}
                  step={10}
                  precision={7}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper color='#ffffffcc' />
                    <NumberDecrementStepper color='#ffffffcc'/>
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{inputError}</FormErrorMessage>
              </FormControl>
              <Button textColor='#e2e8f0' fontSize='sm' onClick={() => setAmountToStake(vaultBalanceEth)}>MAX</Button>
            </Stack>
          </VStack>

          <VStack align='stretch'>
            <Text>{stakingPair.otherCurrency?.symbol} Required</Text>
            <Text fontSize={{base: 'sm', sm: 'md'}} my='auto'>
              {commify(dependentAmount ?? 0)}
            </Text>
          </VStack>
        </SimpleGrid>

        <RdModalBox mt={4}>
          <Text fontWeight='bold' fontSize='sm'>Output changes</Text>
         <SimpleGrid columns={2}>
           <Box>APR</Box>
           <Box textAlign='end'>+ 12%</Box>
           <Box>Troops</Box>
           <Box textAlign='end'>+ 345</Box>
           <Box>Mitama</Box>
           <Box textAlign='end'>+ 678</Box>
         </SimpleGrid>
        </RdModalBox>
        <StakePreview
          fortuneToStake={Number(amountToStake)}
          daysToStake={stakingDays}
          vaultType={vaultType}
          apr={newApr}
          mitama={newMitama}
          troops={newTroops}
        />
        <RdModalBox mt={2}>
           Values above are for the LP vault being created
        </RdModalBox>

        <Box mt={8} textAlign='center'>
          <RdButton
            fontSize={{base: 'xl', sm: '2xl'}}
            stickyIcon={true}
            onClick={handleConvert}
            isLoading={isExecuting}
            disabled={isExecuting}
            loadingText={isExecuting ? executingLabel : 'Convert'}
          >
            {user.address ? (
              <>Convert</>
            ) : (
              <>Connect</>
            )}
          </RdButton>
        </Box>
      </Box>
    </>
  )
}

export default ConvertNewLpVault;