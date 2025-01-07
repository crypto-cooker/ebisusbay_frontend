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
  BankStakeTokenContextProps,
  VaultType
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context';
import { useAppChainConfig } from '@src/config/hooks';
import { useSwitchNetwork } from '@eb-pancakeswap-web/hooks/useSwitchNetwork';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { useBankContract } from '@src/global/hooks/contracts';
import { useCallWithGasPrice } from '@eb-pancakeswap-web/hooks/useCallWithGasPrice';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context';
import { createSuccessfulTransactionToastContent, findNextLowestNumber, round } from '@market/helpers/utils';
import useFrtnStakingPair
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/use-frtn-staking-pair';
import StakePreview
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/create-vault-page/stake-preview';
import { Address, formatEther, parseEther } from 'viem';
import { RdModalBox } from '@src/components-v2/feature/ryoshi-dynasties/components/rd-modal';
import { RdButton } from '@src/components-v2/feature/ryoshi-dynasties/components';
import { useUser } from '@src/components-v2/useUser';
import { useCurrencyByChainId } from '@eb-pancakeswap-web/hooks/tokens';
import { CurrencyAmount, MaxUint256 } from '@pancakeswap/swap-sdk-core';
import { commify } from 'ethers/lib/utils';
import { toast } from 'react-toastify';
import { parseErrorMessage } from '@src/helpers/validator';
import useAuthedFunctionWithChainID from '@market/hooks/useAuthedFunctionWithChainID';
import { useCurrencyBalance } from '@eb-pancakeswap-web/state/wallet/hooks';

interface ImportVaultFormProps {
  vault: FortuneStakingAccount;
  onComplete: () => void;
}

interface Benefits {
  frtn: BenefitGroup;
  lp: BenefitGroup;
  diff: BenefitGroup;
}

interface BenefitGroup {
  apr: number;
  troops: number;
  mitama: number;
}

const ConvertExistingLpVault = ({vault, onComplete}: ImportVaultFormProps) => {
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
  const currencyBBalance = useCurrencyBalance(user.address ?? undefined, currencyB ?? undefined);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('Converting...');

  const [benefits, setBenefits] = useState<Benefits>({
    frtn: {
      apr: 0,
      troops: 0,
      mitama: 0
    },
    lp: {
      apr: 0,
      troops: 0,
      mitama: 0
    },
    diff: {
      apr: 0,
      troops: 0,
      mitama: 0
  }});

  const vaultBalanceEth = formatEther(BigInt(vault.balance));
  const [amountToStake, setAmountToStake] = useState(vaultBalanceEth);
  const [inputError, setInputError] = useState('');

  const stakingDays = vault.length / 86400;

  const dependentAmountFromInput = (amount: string) => {
    const tokenA = currencyA?.wrapped;
    const tokenB = currencyB?.wrapped;
    if (!tokenA || !tokenB || !stakingPair.pair) return '0';

    const amountWei = parseEther(amount);
    const inputCurrency = CurrencyAmount.fromRawAmount(tokenA, amountWei);
    const wrappedIndependentAmount = inputCurrency?.wrapped
    const dependentTokenAmount = stakingPair.pair.priceOf(stakingPair.frtnCurrency).quote(wrappedIndependentAmount);


    return dependentTokenAmount.toSignificant(6);
  }

  const frtnAmountFromDependent = (dependentAmount?: string) => {
    if (!dependentAmount) return '0';

    const tokenA = currencyA?.wrapped;
    const tokenB = currencyB?.wrapped;
    if (!tokenA || !tokenB || !stakingPair.pair) return '0';

    const amountWei = parseEther(dependentAmount);
    const inputCurrency = CurrencyAmount.fromRawAmount(tokenB, amountWei);
    const wrappedIndependentAmount = inputCurrency?.wrapped
    const dependentTokenAmount = stakingPair.pair.priceOf(stakingPair.otherCurrency).quote(wrappedIndependentAmount);

    return dependentTokenAmount.toSignificant(6);
  }

  const maxFormInput = ()  => {
    const frtnBalance = Number(vaultBalanceEth);
    const dependentBalance = Number(currencyBBalance?.toSignificant(6) ?? 0);
    const dependentAmountInFrtn = Number(frtnAmountFromDependent(dependentBalance.toString()));

    if (frtnBalance > dependentAmountInFrtn) {
      return dependentAmountInFrtn.toString();
    } else {
      return vaultBalanceEth;
    }
  }

  const dependentAmount = useMemo(() => {
    return dependentAmountFromInput(amountToStake);
  }, [currencyA?.wrapped, currencyB?.wrapped, stakingPair.pair, pairConfig, amountToStake]);

  const handleChangeToken = (e: ChangeEvent<HTMLSelectElement>) => {
    const _pairConfig = chainConfig.lpVaults.find((v) => v.pair === e.target.value);
    if (!_pairConfig) return;

    setPairConfig(_pairConfig);
  }

  const handleChangeTokenAmount = (valueAsString: string, valueAsNumber: number) => {
    const _dependentAmountFromInput = Number(dependentAmountFromInput(valueAsString));
    const maxPossibleDependentAmount = Number(currencyBBalance?.toSignificant(6) ?? 0);

    if (_dependentAmountFromInput > maxPossibleDependentAmount) {

    }
    const newAmount = valueAsNumber;
    // const newAmount = valueAsNumber > maxPossibleDependentAmount ? maxPossibleDependentAmount : valueAsNumber;
    setAmountToStake(round(newAmount).toString());
  }

  const handleMaxAmount = () => {
    setAmountToStake(maxFormInput());
  }

  const handleMaxFromFrtnAmount = () => {
    setAmountToStake(vaultBalanceEth);
  }

  const handleMaxFromDependentAmount = () => {
    const amount = frtnAmountFromDependent(currencyBBalance?.toSignificant(6) ?? '0')
    setAmountToStake(amount);
  }

  const validateInput = async () => {
    setExecutingLabel('Validating');

    if (BigInt(vault.balance) < parseEther(amountToStake)) {
      toast.error("Not enough balance in FRTN vault");
      return;
    }

    if(Number(amountToStake) < rdConfig.bank.staking.fortune.minimum) {
      setInputError(`At least ${rdConfig.bank.staking.fortune.minimum} in FRTN required`);
      return false;
    }
    setInputError('');

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

      const dependentAmountWei = parseEther(dependentAmount)
      const tx = await callWithGasPrice(bankContract, 'convertFRTNVaultToNewLP', [
        vault.index,
        stakingPair.pair!.liquidityToken.address,
        desiredLpAmount,
        dependentAmountWei
      ]);

      toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));
      onComplete(Number(amountToStake), stakingDays);
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const calculateLpBenefits = () => {
    const benefitGroup: BenefitGroup = {
      apr: 0,
      troops: 0,
      mitama: 0
    }
    const numTerms = Math.floor(stakingDays / rdConfig.bank.staking.fortune.termLength);
    const availableAprs = rdConfig.bank.staking.fortune.lpApr;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    benefitGroup.apr = availableAprs[aprKey] ?? availableAprs[1];

    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    const mitama = (Number(amountToStake) * stakingDays) / 1080;
    const multipliedLpMitama = Math.floor(mitama * 2.5 * 0.98); // 2% slippage

    let newTroops = Math.floor(multipliedLpMitama / mitamaTroopsRatio);
    if (newTroops < 1 && Number(amountToStake) > 0) newTroops = 1;
    benefitGroup.troops = newTroops;
    benefitGroup.mitama = multipliedLpMitama;

    return benefitGroup;
  }

  const calculateFrtnBenefits = () => {
    const benefitGroup: BenefitGroup = {
      apr: 0,
      troops: 0,
      mitama: 0
    }
    const numTerms = Math.floor(stakingDays / rdConfig.bank.staking.fortune.termLength);
    const availableAprs = rdConfig.bank.staking.fortune.apr;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    benefitGroup.apr = availableAprs[aprKey] ?? availableAprs[1];

    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    const mitama = Math.floor((Number(amountToStake) * stakingDays) / 1080);
    console.log('MITAMA', mitama, amountToStake, Number(amountToStake), Number(amountToStake) / 1080)
    let newTroops = Math.floor(mitama / mitamaTroopsRatio);
    if (newTroops < 1 && Number(amountToStake) > 0) newTroops = 1;
    benefitGroup.troops = newTroops;
    benefitGroup.mitama = mitama;

    return benefitGroup;
  }

  useEffect(() => {
    const frtnBenefits = calculateFrtnBenefits();
    const lpBenefits = calculateLpBenefits();
    setBenefits({
      frtn: frtnBenefits,
      lp: lpBenefits,
      diff: {
        apr: lpBenefits.apr - frtnBenefits.apr,
        troops: lpBenefits.troops - frtnBenefits.troops,
        mitama: lpBenefits.mitama - frtnBenefits.mitama
      }
    });
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
        <SimpleGrid columns={{ base: 1, sm: 2 }} fontSize='sm' gap={4}>
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
            <Text>FRTN Vault Balance</Text>
            <Text
              fontSize={{base: 'sm', sm: 'md'}}
              my='auto'
              onClick={handleMaxFromFrtnAmount}
              cursor='pointer'
            >
              {commify(round(vaultBalanceEth, 4))}
            </Text>
          </VStack>
          <VStack align='stretch'>
            <Text>FRTN to stake</Text>
            <Stack direction='row'>
              <FormControl maxW='200px' isInvalid={!!inputError}>
                <NumberInput
                  defaultValue={vaultBalanceEth}
                  min={1}
                  max={parseFloat(maxFormInput())}
                  name="quantity"
                  onChange={handleChangeTokenAmount}
                  value={amountToStake}
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
              <Button textColor='#e2e8f0' fontSize='sm' onClick={handleMaxAmount}>MAX</Button>
            </Stack>
            <Flex fontSize='xs'>
              {stakingPair.otherCurrency?.symbol} Required: {commify(dependentAmount ?? 0)}
            </Flex>
          </VStack>

          <VStack align='stretch'>
            <Text>{stakingPair.otherCurrency?.symbol} Balance</Text>
            <Text
              fontSize={{base: 'sm', sm: 'md'}}
              mt={2}
              onClick={handleMaxFromDependentAmount}
              cursor='pointer'
            >
              {currencyBBalance?.toSignificant(6)} <Text as='span' fontSize='sm'>(~{frtnAmountFromDependent(currencyBBalance?.toSignificant(6))} FRTN)</Text>
            </Text>
          </VStack>
        </SimpleGrid>
        <RdModalBox mt={2}>
          <Text fontWeight='bold' fontSize='sm'>Benefits converted from FRTN vault</Text>
         <SimpleGrid columns={2}>
           <Box>APR</Box>
           <Box textAlign='end'>{benefits.frtn.apr * 100}%</Box>
           <Box>Troops</Box>
           <Box textAlign='end'>{commify(benefits.frtn.mitama)}</Box>
           <Box>Mitama</Box>
           <Box textAlign='end'>{commify(benefits.frtn.troops)}</Box>
         </SimpleGrid>
        </RdModalBox>
        <Box mt={2}>
          <StakePreview
            fortuneToStake={Number(amountToStake)}
            daysToStake={stakingDays}
            vaultType={VaultType.LP}
            apr={benefits.lp.apr}
            mitama={benefits.lp.mitama}
            troops={benefits.lp.troops}
            title='Benefits based on LP vault'
          />
        </Box>
        <RdModalBox mt={2} fontSize='xs'>
           Values above are for the LP vault being created. These are estimates and may be subject to change based on current dex rates and slippage.
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

export default ConvertExistingLpVault;