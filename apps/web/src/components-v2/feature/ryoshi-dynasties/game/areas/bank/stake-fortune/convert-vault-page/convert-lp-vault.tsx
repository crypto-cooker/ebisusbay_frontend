import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react';
import { ChainLogo } from '@dex/components/logo';
import { useCurrencyByChainId } from '@eb-pancakeswap-web/hooks/tokens';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { useCallWithGasPrice } from '@eb-pancakeswap-web/hooks/useCallWithGasPrice';
import { useSwitchNetwork } from '@eb-pancakeswap-web/hooks/useSwitchNetwork';
import { useCurrencyBalance } from '@eb-pancakeswap-web/state/wallet/hooks';
import { createSuccessfulTransactionToastContent, findNextLowestNumber, round } from '@market/helpers/utils';
import useAuthedFunctionWithChainID from '@market/hooks/useAuthedFunctionWithChainID';
import { CurrencyAmount, MaxUint256 } from '@pancakeswap/swap-sdk-core';
import { RdButton } from '@src/components-v2/feature/ryoshi-dynasties/components';
import { RdModalBox } from '@src/components-v2/feature/ryoshi-dynasties/components/rd-modal';
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps,
  VaultType
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context';
import LpContextSelection from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/convert-vault-page/lp-context-selection';
import {
  TypeOption
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/convert-vault-page/types';
import StakePreview from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/create-vault-page/stake-preview';
import useFrtnStakingPair from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/use-frtn-staking-pair';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context';
import { useUser } from '@src/components-v2/useUser';
import { useAppChainConfig } from '@src/config/hooks';
import { FortuneStakingAccount } from '@src/core/services/api-service/graph/types';
import { useBankContract } from '@src/global/hooks/contracts';
import { parseErrorMessage } from '@src/helpers/validator';
import { commify } from 'ethers/lib/utils';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Address, formatEther, parseEther, parseUnits } from 'viem';

interface ImportVaultFormProps {
  frtnVault: FortuneStakingAccount;
  toType: TypeOption;
  onComplete: (amount: number) => void;
}

interface Benefits {
  frtn: BenefitGroup;
  lp: BenefitGroup;
  referenceLp?: BenefitGroup;
  diff?: BenefitGroup;
}

interface BenefitGroup {
  apr: number;
  troops: number;
  mitama: number;
}

const ConvertLpVault = ({frtnVault, toType, onComplete}: ImportVaultFormProps) => {
  const user = useUser();
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: bankChainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chainId: activeChainId} = useActiveChainId();
  const bankContract = useBankContract(bankChainId);
  const { callWithGasPrice } = useCallWithGasPrice();
  const [runAuthedFunction] = useAuthedFunctionWithChainID(bankChainId);

  const [pairConfig, setPairConfig] = useState<{name: string, pair: Address, address1: Address, address2: Address}>();
  const [targetLpVault, setTargetLpVault] = useState<FortuneStakingAccount>();

  const stakingPair = useFrtnStakingPair({
    pairAddress: pairConfig?.pair,
    chainId: chainConfig.chain.id
  });

  // Convention: address1 is always FRTN, address2 is always the other side of the pair
  const currencyA = useCurrencyByChainId(pairConfig?.address1, bankChainId);
  const currencyB = useCurrencyByChainId(pairConfig?.address2, bankChainId);
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

  const vaultBalanceEth = formatEther(BigInt(frtnVault.balance));
  const [frtnInputAmount, setFrtnInputAmount] = useState(vaultBalanceEth);
  const [dependentInputAmount, setDependentInputAmount] = useState('');
  const [frtnInputError, setFrtnInputError] = useState('');
  const [dependentInputError, setDependentInputError] = useState('');
  const prevLpAddressRef = useRef<string>();

  const stakingDays = frtnVault.length / 86400;

  const dependentAmountFromFrtn = (amount: string) => {
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

    const amountWei = parseUnits(dependentAmount, tokenB.decimals);
    const inputCurrency = CurrencyAmount.fromRawAmount(tokenB, amountWei);
    const wrappedIndependentAmount = inputCurrency?.wrapped
    const dependentTokenAmount = stakingPair.pair.priceOf(stakingPair.otherCurrency).quote(wrappedIndependentAmount);

    return dependentTokenAmount.toSignificant(6);
  }

  const maxFormInput = useMemo(()  => {
    const frtnBalance = Number(vaultBalanceEth);
    const dependentBalance = Number(currencyBBalance?.toSignificant(6) ?? 0);
    const dependentAmountInFrtn = Number(frtnAmountFromDependent(dependentBalance.toString()));

    if (frtnBalance > dependentAmountInFrtn) {
      return {
        frtn: dependentAmountInFrtn,
        dependent: dependentBalance,
        side: 'dependent'
      }
    } else {
      return {
        frtn: frtnBalance,
        dependent: Number(dependentAmountFromFrtn(frtnBalance.toString())),
        side: 'frtn'
      }
    }
  }, [vaultBalanceEth, currencyBBalance]);

  const syncAmountsFromFrtn = (frtnAmount: string | number) => {
    if (typeof frtnAmount === 'number') frtnAmount = frtnAmount.toString();
    setFrtnInputAmount(frtnAmount);
    setDependentInputAmount(dependentAmountFromFrtn(frtnAmount));
  }

  const syncAmountsFromDependent = (dependentAmount: string | number) => {
    if (typeof dependentAmount === 'number') dependentAmount = dependentAmount.toString();
    setDependentInputAmount(dependentAmount);
    setFrtnInputAmount(frtnAmountFromDependent(dependentAmount));
  }

  const handleChangeFrtnAmount = (valueAsString: string) => syncAmountsFromFrtn(valueAsString);
  const handleChangeDependentAmount = (valueAsString: string) => syncAmountsFromDependent(valueAsString);
  const handleMaxAmount = () => syncAmountsFromFrtn(maxFormInput.frtn);
  const handleMaxFromFrtnAmount = () => syncAmountsFromFrtn(vaultBalanceEth);
  const handleMaxFromDependentAmount = () => syncAmountsFromDependent(currencyBBalance?.toSignificant(6) ?? '0');

  const handleChangeLpVaultOption = (newPairConfig: any, newVault?: any) => {
    setPairConfig(newPairConfig);
    setTargetLpVault(newVault);
  }

  const validateInput = async () => {
    setExecutingLabel('Validating');
    setFrtnInputError('');
    setDependentInputError('');

    if (!currencyB) {
      toast.error('Invalid currency');
      return;
    }

    if (!stakingPair.pair) {
      toast.error('Invalid LP pair');
      return;
    }

    if (toType === TypeOption.Existing && !targetLpVault) {
      toast.error('Target LP Vault not found');
      return;
    }

    if (BigInt(frtnVault.balance) < parseEther(frtnInputAmount)) {
      toast.error("Not enough balance in FRTN vault");
      return;
    }

    if (!currencyBBalance || BigInt(currencyBBalance.lessThan(parseUnits(dependentInputAmount, currencyB.decimals)))) {
      toast.error(`Not enough ${currencyBBalance?.currency.symbol} balance`);
      return;
    }

    if(toType === TypeOption.New && Number(frtnInputAmount) < rdConfig.bank.staking.fortune.minimum) {
      setFrtnInputError(`At least ${rdConfig.bank.staking.fortune.minimum} in FRTN required`);
      return false;
    }

    if(toType === TypeOption.Existing && Number(frtnInputAmount) < 1) {
      setFrtnInputError(`At least 1 FRTN required`);
      return false;
    }

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
      const desiredLpAmount = parseEther(frtnInputAmount.toString());

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

      const dependentAmountWei = parseUnits(dependentInputAmount, currencyB!.decimals)
      if (toType === TypeOption.Existing) {
        const tx = await callWithGasPrice(bankContract, 'convertFRTNVaultToExistingLP', [
          frtnVault.index,
          stakingPair.pair!.liquidityToken.address,
          targetLpVault!.index,
          desiredLpAmount,
          dependentAmountWei
        ]);

        toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));
        onComplete(Number(frtnInputAmount));
      } else {
        const tx = await callWithGasPrice(bankContract, 'convertFRTNVaultToNewLP', [
          frtnVault.index,
          stakingPair.pair!.liquidityToken.address,
          desiredLpAmount,
          dependentAmountWei
        ]);

        toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));
        onComplete(Number(frtnInputAmount));
      }
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const calculateLpBenefits = (amount: string | number) => {
    if (typeof amount === 'string') amount = Number(amount);

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
    const mitama = (amount * stakingDays) / 1080;
    const multipliedLpMitama = Math.floor(mitama * 2.5 * 0.98); // 2% slippage

    let newTroops = Math.floor(multipliedLpMitama / mitamaTroopsRatio);
    if (newTroops < 1 && amount > 0) newTroops = 1;
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
    const mitama = Math.floor((Number(frtnInputAmount) * stakingDays) / 1080);
    let newTroops = Math.floor(mitama / mitamaTroopsRatio);
    if (newTroops < 1 && Number(frtnInputAmount) > 0) newTroops = 1;
    benefitGroup.troops = newTroops;
    benefitGroup.mitama = mitama;

    return benefitGroup;
  }

  // Set the benefits preview values
  useEffect(() => {
    const frtnBenefits = calculateFrtnBenefits();
    let referenceLpBenefits = calculateLpBenefits(frtnInputAmount);
    let lpBenefits = referenceLpBenefits;
    let lpDiff: BenefitGroup | undefined = undefined;

    if (targetLpVault) {
      // const derivedFrtnAmount = stakingPair.frtnReserve?.multiply(parseEther(`${amountToStake}`)).divide(stakingPair.totalSupply ?? 0).toExact() ?? '0';
      const derivedReferenceFrtnAmount = stakingPair.frtnReserve?.multiply(targetLpVault.balance).divide(stakingPair.totalSupply ?? 0).toExact() ?? '0';

      referenceLpBenefits =  calculateLpBenefits(derivedReferenceFrtnAmount);
      lpBenefits = calculateLpBenefits(Number(derivedReferenceFrtnAmount) + Number(frtnInputAmount));
      lpDiff = {
        apr: lpBenefits.apr - referenceLpBenefits.apr,
        troops: lpBenefits.troops - referenceLpBenefits.troops,
        mitama: lpBenefits.mitama - referenceLpBenefits.mitama
      }
    }

    setBenefits({
      frtn: frtnBenefits,
      lp: lpBenefits,
      referenceLp: referenceLpBenefits,
      diff: lpDiff
    });
  }, [frtnVault.length, frtnInputAmount, stakingDays, targetLpVault?.id]);

  // Initialize form values
  useEffect(() => {
    syncAmountsFromFrtn(vaultBalanceEth);
  }, []);

  // Set dependent amount when LP pair changes
  useEffect(() => {
    const newLpAddress = pairConfig?.pair;
    const prevLpAddress = prevLpAddressRef.current;

    if (prevLpAddress === null || prevLpAddress !== newLpAddress) {
      setDependentInputAmount(dependentAmountFromFrtn(frtnInputAmount));

      prevLpAddressRef.current = newLpAddress;
    }
  }, [pairConfig?.pair, frtnInputAmount]);


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
            <FormControl maxW='250px'>
              <LpContextSelection
                type={toType}
                onSelected={handleChangeLpVaultOption}
              />
            </FormControl>
          </VStack>
          <VStack align='stretch'>
            <Text>Max Stake</Text>
            <Text
              fontSize={{base: 'sm', sm: 'md'}}
              my='auto'
              onClick={handleMaxAmount}
              cursor='pointer'
            >
              {maxFormInput.side === 'frtn' ? (
                <>
                  {maxFormInput.frtn} FRTN 
                  {maxFormInput.frtn > 0 && <Text as='span' fontSize='sm'> (~{maxFormInput.dependent} {currencyBBalance?.currency.symbol})</Text>}
                </>
              ) : (
                <>
                  {maxFormInput.dependent} {currencyBBalance?.currency.symbol} 
                  {maxFormInput.dependent > 0 && <Text as='span' fontSize='sm'> (~{maxFormInput.frtn} FRTN)</Text>}
                </>
              )}
            </Text>
          </VStack>
          <VStack align='stretch'>
            <Text>FRTN to stake</Text>
            <Stack direction='row'>
              <FormControl maxW='200px' isInvalid={!!frtnInputError}>
                <NumberInput
                  min={1}
                  max={maxFormInput.frtn}
                  name="quantity"
                  onChange={handleChangeFrtnAmount}
                  value={frtnInputAmount}
                  precision={7}
                >
                  <NumberInputField />
                </NumberInput>
                <FormErrorMessage>{frtnInputError}</FormErrorMessage>
              </FormControl>
              <Button textColor='#e2e8f0' fontSize='sm' onClick={handleMaxFromFrtnAmount}>MAX</Button>
            </Stack>
            <Text
              fontSize='xs'
              onClick={handleMaxFromFrtnAmount}
              cursor='pointer'
            >
              Vault Balance: {commify(round(vaultBalanceEth, 4))}
            </Text>
          </VStack>

          <VStack align='stretch'>
            <Text visibility={!!currencyBBalance ? 'visible' : 'hidden'}>{stakingPair.otherCurrency?.symbol} to stake</Text>
            {!!currencyBBalance && (
              <>
                <Stack direction='row'>
                  <FormControl maxW='200px' isInvalid={!!dependentInputError}>
                    <NumberInput
                      min={1}
                      max={maxFormInput.dependent}
                      name="quantity"
                      onChange={handleChangeDependentAmount}
                      value={dependentInputAmount}
                      precision={7}
                    >
                      <NumberInputField />
                    </NumberInput>
                    <FormErrorMessage>{dependentInputError}</FormErrorMessage>
                  </FormControl>
                  <Button textColor='#e2e8f0' fontSize='sm' onClick={handleMaxFromDependentAmount}>MAX</Button>
                </Stack>
                <Text
                  fontSize='xs'
                  onClick={handleMaxFromDependentAmount}
                  cursor='pointer'
                >
                  {stakingPair.otherCurrency?.symbol} Balance: {currencyBBalance?.toSignificant(6)}
                </Text>
              </>
            )}
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
            fortuneToStake={Number(frtnInputAmount)}
            daysToStake={stakingDays}
            vaultType={VaultType.LP}
            apr={benefits.lp.apr}
            mitama={benefits.lp.mitama}
            troops={benefits.lp.troops}
            title='Benefits based on LP vault'
            aprDiff={benefits.diff?.apr}
            mitamaDiff={benefits.diff?.mitama}
            troopsDiff={benefits.diff?.troops}
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

export default ConvertLpVault;