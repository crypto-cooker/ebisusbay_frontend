import React, {ChangeEvent, useContext, useEffect, useMemo, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import {useAppChainConfig} from "@src/config/hooks";
import {useBankContract, useTokenContract} from "@src/global/hooks/contracts";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useReadContract} from "wagmi";
import {useCallWithGasPrice} from "@eb-pancakeswap-web/hooks/useCallWithGasPrice";
import {useUser} from "@src/components-v2/useUser";
import useAuthedFunctionWithChainID from "@market/hooks/useAuthedFunctionWithChainID";
import {Address, parseEther} from "viem";
import {commify, formatEther} from "ethers/lib/utils";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, pluralize, round} from "@market/helpers/utils";
import {parseErrorMessage} from "@src/helpers/validator";
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
  Spacer,
  Spinner,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react";
import RdButton from "../../../../../components/rd-button";
import {ChainLogo} from "@dex/components/logo";
import StakePreview
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/create-vault-page/stake-preview";
import {useToken} from "@eb-pancakeswap-web/hooks/tokens";
import {ERC20Token} from "@pancakeswap/swap-sdk-evm";
import useTotalSupply from "@eb-pancakeswap-web/hooks/useTotalSupply";
import {CurrencyAmount} from "@pancakeswap/swap-sdk-core";
import {Pair, pancakePairV2ABI} from '@pancakeswap/sdk'

interface CreateLpVaultProps {
  vaultIndex: number;
  onSuccess: (amount: number, days: number) => void;
}

const CreateLpVault = ({vaultIndex, onSuccess}: CreateLpVaultProps) => {
  const { config: rdConfig, refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: bankChainId, vaultType } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chainId: activeChainId} = useActiveChainId();
  const bankContract = useBankContract(bankChainId);
  const { callWithGasPrice } = useCallWithGasPrice();

  const user = useUser();
  const [runAuthedFunction] = useAuthedFunctionWithChainID(bankChainId);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('Staking...');
  const [isRetrievingToken, setIsRetrievingToken] = useState(false);

  const [amountToStake, setAmountToStake] = useState('');
  const [daysToStake, setDaysToStake] = useState(rdConfig.bank.staking.fortune.termLength)
  const [tokenBalance, setTokenBalance] = useState(0)

  const [lengthError, setLengthError] = useState('');
  const [inputError, setInputError] = useState('');

  const [frtnAddress, setFrtnAddress] = useState<Address>(chainConfig.lpVaults[0].address1);
  const [otherAddress, setOtherAddress] = useState<Address>(chainConfig.lpVaults[0].address2);
  const frtnCurrency = useToken(frtnAddress) as ERC20Token;
  const otherCurrency = useToken(otherAddress) as ERC20Token;

  const { data: pairData } = useReadContract({
    address: Pair.getAddress(frtnCurrency, otherCurrency),
    abi: pancakePairV2ABI,
    functionName: 'getReserves',
    // chainId: bankChainId,
  });

  const pair = useMemo(() => {
    if (!pairData) return;

    const [reserve0, reserve1] = pairData

    return new Pair(
      CurrencyAmount.fromRawAmount(frtnCurrency, reserve0.toString()),
      CurrencyAmount.fromRawAmount(otherCurrency, reserve1.toString()),
    )
  }, [frtnCurrency, otherCurrency, pairData]);

  const liquidityToken = pair?.liquidityToken;
  const tokenContract = useTokenContract(liquidityToken?.address, bankChainId);
  const totalSupply = useTotalSupply(liquidityToken);
  const frtnReserve = pair?.reserve0;

  const derivedMinimumFrtn = useMemo(() => {
    if (!totalSupply || totalSupply.equalTo(0) || !frtnReserve) {
      return '0';
    }

    const minimumFrtnAmount = CurrencyAmount.fromRawAmount(frtnReserve.currency, rdConfig.bank.staking.fortune.minimum);
    const lpAmount = minimumFrtnAmount.multiply(totalSupply).divide(frtnReserve);

    return lpAmount.toExact(); // Converts to string for display
  }, [totalSupply, frtnReserve, rdConfig.bank.staking.fortune.minimum]);

  const derivedFrtnAmount = useMemo(() => {
    if (!frtnReserve || !totalSupply || totalSupply.equalTo(0)) {
      return '0'
    }

    return frtnReserve.multiply(parseEther(`${amountToStake}`)).divide(totalSupply).toExact();
  }, [frtnReserve, totalSupply, amountToStake]);

  const handleChangeToken = (e: ChangeEvent<HTMLSelectElement>) => {
    const vaultConfig = chainConfig.lpVaults.find((v) => v.name === e.target.value);
    if (!vaultConfig) return;

    setFrtnAddress(vaultConfig.address1);
    setOtherAddress(vaultConfig.address2);
  }

  const handleChangeTokenAmount = (valueAsString: string, valueAsNumber: number) => {
    setAmountToStake(valueAsString);
  }

  const handleChangeDays = (e: ChangeEvent<HTMLSelectElement>) => {
    setDaysToStake(Number(e.target.value))
  }

  const checkForApproval = async () => {
    const totalApproved = await tokenContract?.read.allowance([user.address as Address, chainConfig.contracts.bank]);
    return totalApproved as bigint;
  }

  const checkTokenBalance = async () => {
    try {
      setIsRetrievingToken(true);
      const totalFortune = await tokenContract?.read.balanceOf([user.address as Address]);
      const formatedFortune = +formatEther(totalFortune as bigint);
      setTokenBalance(formatedFortune);
    } finally {
      setIsRetrievingToken(false);
    }
  }

  const validateInput = async () => {
    setExecutingLabel('Validating');

    if (tokenBalance < Number(amountToStake)) {
      toast.error("Not enough LP");
      return;
    }

    if(Number(derivedFrtnAmount) < rdConfig.bank.staking.fortune.minimum) {
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
    runAuthedFunction(async() => {
      if (!await validateInput()) return;
      await executeStakeFortune();
    });
  }

  const executeStakeFortune = async () => {
    try {
      setIsExecuting(true);
      setExecutingLabel('Approving');

      if (activeChainId !== bankChainId) {
        await switchNetworkAsync(bankChainId);
        return;
      }

      //check for approval
      const totalApproved = await checkForApproval();
      const desiredFortuneAmount = parseEther(amountToStake.toString());

      if (totalApproved < desiredFortuneAmount) {
        const txHash = await tokenContract?.write.approve(
          [chainConfig.contracts.bank as `0x${string}`, desiredFortuneAmount],
          {
            account: user.address!,
            chain: chainConfig.chain
          }
        );
        toast.success(createSuccessfulTransactionToastContent(txHash ?? '', bankChainId));
      }

      setExecutingLabel('Staking');

      const expectedMitama = await bankContract?.read.mitamaForLp([parseEther(amountToStake), liquidityToken?.address, daysToStake*86400])

      const tx = await callWithGasPrice(bankContract, 'openLPVault', [
        desiredFortuneAmount,
        daysToStake*86400,
        liquidityToken?.address,
        vaultIndex,
        expectedMitama
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
    if (!!user.address  && !!tokenContract) {
      checkTokenBalance();
    }
  }, [user.address]);

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
              <FormControl maxW='250px' isInvalid={!!lengthError}>
                <Select onChange={handleChangeToken} value={daysToStake} bg='none'>
                  {chainConfig.lpVaults.map((vaultConfig) => (
                    <option key={vaultConfig.name} value={vaultConfig.name}>{vaultConfig.name}</option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
            <VStack align='stretch'>
              <Text>Balance</Text>
              <Text fontSize={{base: 'sm', sm: 'md'}} my='auto'>
                {isRetrievingToken ? <Spinner size='sm'/> : commify(round(tokenBalance, 3))}
              </Text>
            </VStack>
            <VStack align='stretch'>
              <Text>Amount to stake</Text>
              <Stack direction='row'>
                <FormControl maxW='200px' isInvalid={!!inputError}>
                  <NumberInput
                    defaultValue={parseFloat(derivedMinimumFrtn)}
                    min={parseFloat(derivedMinimumFrtn)}
                    name="quantity"
                    onChange={handleChangeTokenAmount}
                    value={amountToStake}
                    step={1000}
                    precision={3}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper color='#ffffffcc' />
                      <NumberDecrementStepper color='#ffffffcc'/>
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{inputError}</FormErrorMessage>
                </FormControl>
                <Button textColor='#e2e8f0' fontSize='sm' onClick={() => setAmountToStake(tokenBalance.toString())}>MAX</Button>
              </Stack>
              <Flex>
                FRTN: <>{derivedFrtnAmount}</>
              </Flex>
            </VStack>

            <VStack align='stretch'>
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

          {tokenBalance > 0 && (
            <>
              <StakePreview
                fortuneToStake={Number(derivedFrtnAmount)}
                daysToStake={daysToStake}
                vaultType={vaultType}
              />

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
                      <>Stake LP</>
                    ) : (
                      <>Connect</>
                    )}
                  </RdButton>
                </Box>
              </Flex>
            </>
          )}
        </Box>

      {tokenBalance <= 0 && (
        <Box textAlign='center' mt={4}>
          <Text>You currently have no LP in your wallet.</Text>
        </Box>
      )}
    </>
  )
}

export default CreateLpVault;
