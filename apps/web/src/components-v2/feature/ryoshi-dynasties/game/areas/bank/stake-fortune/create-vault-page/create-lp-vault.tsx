import React, {ChangeEvent, useContext, useEffect, useMemo, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps,
  VaultType
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import {useAppChainConfig} from "@src/config/hooks";
import {useBankContract, useTokenContract} from "@src/global/hooks/contracts";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useReadContract} from "wagmi";
import {useCallWithGasPrice} from "@eb-pancakeswap-web/hooks/useCallWithGasPrice";
import {useUser} from "@src/components-v2/useUser";
import useAuthedFunctionWithChainID from "@market/hooks/useAuthedFunctionWithChainID";
import {Address, formatEther, parseEther} from "viem";
import {commify} from "ethers/lib/utils";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, findNextLowestNumber, pluralize, round} from "@market/helpers/utils";
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
import {CurrencyAmount, MaxUint256} from "@pancakeswap/swap-sdk-core";
import {Pair, pancakePairV2ABI} from '@pancakeswap/sdk'
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import { FortuneStakingAccount } from "@src/core/services/api-service/graph/types";

interface Vault {
  pool: string
}

interface CreateLpVaultProps {
  vaultIndex: number;
  vaults: FortuneStakingAccount[];
  onSuccess: (amount: number, days: number) => void;
}

const CreateLpVault = ({vaultIndex, vaults, onSuccess}: CreateLpVaultProps) => {
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
  const [tokenBalance, setTokenBalance] = useState('0')
  const [tokenBalanceWei, setTokenBalanceWei] = useState<bigint>(0n)

  const [newApr, setNewApr] = useState(0);
  const [newMitama, setNewMitama] = useState(0);
  const [newTroops, setNewTroops] = useState(0);

  const [lengthError, setLengthError] = useState('');
  const [inputError, setInputError] = useState('');

  const [pairConfig, setPairConfig] = useState(chainConfig.lpVaults[0]);
  const frtnCurrency = useToken(pairConfig.address1) as ERC20Token;
  const otherCurrency = useToken(pairConfig.address2) as ERC20Token;

  const { data: pairData } = useReadContract({
    address: pairConfig.pair,
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
  const lpContract = useTokenContract(liquidityToken?.address, bankChainId);
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
    const _pairConfig = chainConfig.lpVaults.find((v) => v.pair === e.target.value);
    if (!_pairConfig) return;

    setPairConfig(_pairConfig);
  }

  const handleChangeTokenAmount = (valueAsString: string, valueAsNumber: number) => {
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
      const tokenBalance = await lpContract?.read.balanceOf([user.address as Address]);
      const formattedAmount = formatEther(tokenBalance as bigint);
      setTokenBalance(formattedAmount);
      setTokenBalanceWei(tokenBalance ?? 0n);
    } finally {
      setIsRetrievingToken(false);
    }
  }

  const validateInput = async () => {
    setExecutingLabel('Validating');

    if (tokenBalanceWei < parseEther(amountToStake)) {
      toast.error("Not enough LP");
      return;
    }

    if(Number(derivedFrtnAmount) < rdConfig.bank.staking.fortune.minimum) {
      setInputError(`At least ${rdConfig.bank.staking.fortune.minimum} in FRTN required`);
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
      const desiredLpAmount = parseEther(amountToStake.toString());

      if (totalApproved < MaxUint256) {
        const txHash = await lpContract?.write.approve(
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

      const tx = await callWithGasPrice(bankContract, 'openLPVault', [
        desiredLpAmount,
        daysToStake*86400,
        liquidityToken?.address,
        vaults.filter(element => element?.pool?.toLowerCase() == liquidityToken?.address.toLowerCase()).length,
        newMitama
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
    const numTerms = Math.floor(daysToStake / rdConfig.bank.staking.fortune.termLength);
    const availableAprs = (vaultType === VaultType.LP ?
      rdConfig.bank.staking.fortune.lpApr :
      rdConfig.bank.staking.fortune.apr) as any;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    setNewApr(availableAprs[aprKey] ?? availableAprs[1]);

    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    const mitama = (Number(derivedFrtnAmount) * daysToStake) / 1080;
    const multipliedLpMitama = Math.floor(mitama * 2.5 * 0.98); // 2% slippage

    let newTroops = Math.floor(multipliedLpMitama / mitamaTroopsRatio);
    if (newTroops < 1 && Number(derivedFrtnAmount) > 0) newTroops = 1;
    setNewTroops(newTroops);
    setNewMitama(multipliedLpMitama);
  }, [daysToStake, derivedFrtnAmount]);

  useEffect(() => {
    if (!!user.address && !!lpContract) {
      checkTokenBalance();
    }
  }, [user.address, lpContract]);

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
                <Select onChange={handleChangeToken} value={pairConfig.pair} bg='none'>
                  {chainConfig.lpVaults.map((vaultConfig) => (
                    <option key={vaultConfig.pair} value={vaultConfig.pair}>{vaultConfig.name}</option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
            <VStack align='stretch'>
              <Text>Balance</Text>
              <Text fontSize={{base: 'sm', sm: 'md'}} my='auto'>
                {isRetrievingToken ? <Spinner size='sm'/> : commify(round(tokenBalance, 7))}
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

          {Number(tokenBalance) > 0 && (
            <>
              <Box mt={4}>
                <StakePreview
                  fortuneToStake={Number(derivedFrtnAmount)}
                  daysToStake={daysToStake}
                  vaultType={vaultType}
                  apr={newApr}
                  mitama={newMitama}
                  troops={newTroops}
                />
              </Box>
              <RdModalBox mt={2}>
                Fluctuations of the price may cause the awarded amount of Mitama to change. This is the minimum amount to be accepted. Once the vault is created the amount of Mitama will not change.
              </RdModalBox>
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

      {Number(tokenBalance) <= 0 && (
        <Box textAlign='center' mt={4}>
          <Text>You currently have no LP in your wallet.</Text>
        </Box>
      )}
    </>
  )
}

export default CreateLpVault;
