import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps, VaultType
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import {useAppChainConfig} from "@src/config/hooks";
import {useBankContract, useFrtnContract} from "@src/global/hooks/contracts";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useCallWithGasPrice} from "@eb-pancakeswap-web/hooks/useCallWithGasPrice";
import {useUser} from "@src/components-v2/useUser";
import useAuthedFunctionWithChainID from "@market/hooks/useAuthedFunctionWithChainID";
import {Address, parseEther} from "viem";
import {commify, formatEther} from "ethers/lib/utils";
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
  Text,
  VStack
} from "@chakra-ui/react";
import RdButton from "../../../../../components/rd-button";
import {ChainLogo} from "@dex/components/logo";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import StakePreview
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/create-vault-page/stake-preview";

interface CreateTokenVaultProps {
  vaultIndex: number;
  onSuccess: (amount: number, days: number) => void;
}

const CreateTokenVault = ({vaultIndex, onSuccess}: CreateTokenVaultProps) => {
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: bankChainId, vaultType } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
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

  const [fortuneToStake, setFortuneToStake] = useState(1250);
  const [daysToStake, setDaysToStake] = useState(rdConfig.bank.staking.fortune.termLength)
  const [userFortune, setUserFortune] = useState(0)

  const [newApr, setNewApr] = useState(0);
  const [newMitama, setNewMitama] = useState(0);
  const [newTroops, setNewTroops] = useState(0);

  const [lengthError, setLengthError] = useState('');
  const [inputError, setInputError] = useState('');


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

      setExecutingLabel('Staking');

      const tx = await callWithGasPrice(bankContract, 'openVault', [desiredFortuneAmount, daysToStake*86400, vaultIndex]);
      toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));
      onSuccess(fortuneToStake, daysToStake);
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
    const mitama = Math.floor((fortuneToStake * daysToStake) / 1080);
    let newTroops = Math.floor(mitama / mitamaTroopsRatio);
    if (newTroops < 1 && fortuneToStake > 0) newTroops = 1;
    setNewTroops(newTroops);
    setNewMitama(mitama);
  }, [daysToStake, fortuneToStake]);

  useEffect(() => {
    if (!!user.address) {
      checkForFortune();
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
            <HStack>
              <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>Balance: </Text>
              <FortuneIcon boxSize={6} />
              <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>
                {isRetrievingFortune ? <Spinner size='sm'/> : commify(round(userFortune))}
              </Text>
            </HStack>
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
                  defaultValue={rdConfig.bank.staking.fortune.minimum}
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

          <StakePreview
            fortuneToStake={fortuneToStake}
            daysToStake={daysToStake}
            vaultType={vaultType}
            apr={newApr}
            mitama={newMitama}
            troops={newTroops}
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
                  <>Stake $FRTN</>
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
  )
}

export default CreateTokenVault;
