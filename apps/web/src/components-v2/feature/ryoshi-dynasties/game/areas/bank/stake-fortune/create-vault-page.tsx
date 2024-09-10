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
  Stack,
  Tag,
  Text,
  VStack,
  Wrap
} from "@chakra-ui/react";
import {createSuccessfulTransactionToastContent, findNextLowestNumber, pluralize, round} from "@market/helpers/utils";
import {commify, formatEther} from "ethers/lib/utils";
import RdButton from "../../../../components/rd-button";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {toast} from "react-toastify";
import {ethers} from "ethers";
import Bank from "@src/global/contracts/Bank.json";
import ImageService from "@src/core/services/image";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {parseErrorMessage} from "@src/helpers/validator";
import {ApiService} from "@src/core/services/api-service";
import {useQuery} from "@tanstack/react-query";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {useUser} from "@src/components-v2/useUser";
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import {Address, parseEther} from "viem";
import {useBankContract, useFrtnContract} from "@src/global/hooks/contracts";
import {useAppChainConfig} from "@src/config/hooks";
import {ChainLogo} from "@dex/components/logo";
import {useAccount, useWriteContract} from "wagmi";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import useAuthedFunctionWithChainID from "@market/hooks/useAuthedFunctionWithChainID";
import {useCallWithGasPrice} from "@eb-pancakeswap-web/hooks/useCallWithGasPrice";

const steps = {
  choice: 'choice',
  createVaultForm: 'createVaultForm',
  importVaultForm: 'importVaultForm',
  createVaultComplete: 'createVaultComplete',
  importVaultComplete: 'importVaultComplete'
};

interface CreateVaultPageProps {
  vaultIndex: number;
  onReturn: () => void;
}

const CreateVaultPage = ({vaultIndex, onReturn}: CreateVaultPageProps) => {
  const { config: rdConfig, refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: bankChainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);
  const frtnContract = useFrtnContract(bankChainId);
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chainId: activeChainId} = useActiveChainId();
  const { writeContractAsync } = useWriteContract();
  const bankContract = useBankContract(bankChainId);
  const { callWithGasPrice } = useCallWithGasPrice();

  const user = useUser();
  const [runAuthedFunction] = useAuthedFunctionWithChainID(bankChainId);

  const [currentStep, setCurrentStep] = useState(steps.choice);
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
  const [newMitama, setNewMitama] = useState(0);


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

      // const txHash = await writeContractAsync({
      //   address: chainConfig.contracts.bank,
      //   abi: Bank,
      //   functionName: 'openVault',
      //   args: [desiredFortuneAmount, daysToStake*86400, vaultIndex],
      // });
      const tx = await callWithGasPrice(bankContract, 'openVault', [desiredFortuneAmount, 60, vaultIndex]);

      toast.success(createSuccessfulTransactionToastContent(tx?.hash, bankChainId));
      setCurrentStep(steps.createVaultComplete);
      refreshUser();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
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
    <Box mx={1} pb={6}>
      {currentStep === steps.choice ? (
        <Box>
          <Text px={2} textAlign='center' fontSize={14} py={2}>Earn staking benefits by opening a staking vault. Earn APR, Mitama, and Troops for battle. Stake more to earn more.</Text>
          <Text px={2} textAlign='center' fontSize={14} py={2}>Click <strong>Create Vault</strong> for new vaults. If you have a Vault NFT, click <strong>Import Vault</strong></Text>
          <Box textAlign='center' mt={8} mx={2}>
            <Stack direction={{base: 'column', sm: 'row'}} justify='space-around'>
              <RdButton
                size={{base: 'md', md: 'lg'}}
                w={{base: 'full', sm: 'auto'}}
                onClick={() => setCurrentStep(steps.importVaultForm)}
              >
                Import Vault
              </RdButton>
              <RdButton
                size={{base: 'md', md: 'lg'}}
                w={{base: 'full', sm: 'auto'}}
                onClick={() => setCurrentStep(steps.createVaultForm)}
              >
                Create Vault
              </RdButton>
            </Stack>
          </Box>
        </Box>
      ) : currentStep === steps.createVaultForm ? (
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

              <Box bgColor='#292626' rounded='md' p={4} mt={4} textAlign='center'>
                <SimpleGrid columns={{base:2, sm: 3}} gap={4}>
                  <VStack spacing={0}>
                    <FortuneIcon boxSize={6} />
                    <Text>APR</Text>
                    <Text fontSize={24} fontWeight='bold'>{newApr * 100}%</Text>
                    <Text fontSize={12} color='#aaa'>{commify(daysToStake)} day commitment</Text>
                  </VStack>
                  <VStack spacing={0}>
                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()} alt="troopsIcon" boxSize={6}/>
                    <Text>Troops</Text>
                    <Text fontSize={24} fontWeight='bold'>{commify(round(newTroops))}</Text>
                    <Text fontSize={12} color='#aaa'>{commify(fortuneToStake)} $FRTN stake</Text>
                  </VStack>
                  <VStack spacing={0}>
                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/mitama.png').convert()} alt="troopsIcon" boxSize={6}/>
                    <Text>Mitama</Text>
                    <Text fontSize={24} fontWeight='bold'>{commify(newMitama)}</Text>
                    <Text fontSize={12} color='#aaa'>{commify(fortuneToStake)} $FRTN stake</Text>
                  </VStack>

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
      ) : currentStep === steps.importVaultForm ? (
        <ImportVaultForm onComplete={() => setCurrentStep(steps.importVaultComplete)} />
      ) : currentStep === steps.importVaultComplete ? (
        <ImportVaultComplete onReturn={onReturn} />
      ) : currentStep === steps.createVaultComplete && (
        <StakeComplete amount={fortuneToStake} duration={daysToStake} onReturn={onReturn} />
      )}
    </Box>
  )
}

interface ImportVaultFormProps {
  onComplete: () => void;
}

const ImportVaultForm = ({onComplete}: ImportVaultFormProps) => {
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: bankChainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);
  
  const { chainId: activeChainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { writeContractAsync } = useWriteContract();
  const [isExecuting, setIsExecuting] = useState(false);
  const user = useUser();
  const [selectedVaultId, setSelectedVaultId] = useState<string>();
  const availableAprs = rdConfig.bank.staking.fortune.apr as any;


  const { data: vaultNfts, isLoading, isError, error } = useQuery({
    queryKey: ['UserVaultNfts', user.address],
    queryFn: async () => {
      const nfts = await ApiService.withoutKey().getWallet(user.address!, {
        wallet: user.address!,
        collection: [chainConfig.contracts.vaultNft]
      });

      return nfts.data.map((nft) => {
        const amount = nft.attributes.find(a => a.trait_type === 'Amount');
        const formattedAmount = amount ? Number(ethers.utils.formatEther(amount.value)) : 0;

        const length = nft.attributes.find(a => a.trait_type === 'Deposit Length');
        const lengthDays = length ? Number(length.value) / 86400 : 0;
        const start = nft.attributes.find(a => a.trait_type === 'Start Time');
        const daysRemaining = round(lengthDays - ((Date.now() / 1000) - Number(start?.value)) / 86400, 1);
        // const endTime = Number(start?.value) + Number(length?.value);

        const numTerms = Math.floor(lengthDays / rdConfig.bank.staking.fortune.termLength);
        const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
        const baseApr = (availableAprs[aprKey] ?? availableAprs[1]) * 100;
        // const endDate = moment(endTime * 1000).format("MMM D yyyy");

        const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
        const mitama = Math.floor((formattedAmount * lengthDays) / 1080);

        let troops = Math.floor(mitama / mitamaTroopsRatio);
        if (troops < 1 && formattedAmount > 0) troops = 1;

        return {
          ...nft,
          amount: formattedAmount,
          length: lengthDays,
          daysRemaining,
          baseApr,
          troops,
          mitama,
          start: Number(start?.value)
        }
      });
    },
    enabled: !!user.address
  });

  const handleConvert = async () => {
    if (!selectedVaultId) {
      toast.error('Please select a vault');
      return;
    }

    try {
      if (activeChainId !== bankChainId) {
        await switchNetworkAsync(bankChainId);
        return;
      }

      const check = await ApiService.withoutKey().ryoshiDynasties.checkBlacklistStatus(user.address!);
      if (check.data.blacklisted === true) {
        return;
      };
      setIsExecuting(true);

      const txHash = await writeContractAsync({
        address: chainConfig.contracts.bank,
        abi: Bank,
        functionName: 'installBox',
        args: [selectedVaultId],
      });

      toast.success(createSuccessfulTransactionToastContent(txHash, bankChainId));
      onComplete();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const handleSelectVault = async (id: string) => {
    setSelectedVaultId(selectedVaultId === id ? undefined : id);
  }

  return (
    <Box px={2}>
      <Text textAlign='center' fontSize={14} py={2}>Once converted, your NFT will be available in your bank. Select a vault below and then click <strong>Convert</strong>.</Text>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : isError ? (
        <Box textAlign='center'>
          Error: {(error as any).message}
        </Box>
      ) : !!vaultNfts && vaultNfts.length > 0 ? (
        <>
          <Box>
            <VStack>
              {vaultNfts.map((nft) => (
                <RdModalBox
                  w='full'
                  cursor='pointer'
                  border={`2px solid ${selectedVaultId === nft.nftId ? '#F48F0C' : 'transparent'}`}
                  _hover={{
                    border: '2px solid #F48F0C'
                  }}
                  onClick={() => handleSelectVault(nft.nftId)}
                >
                  <Flex direction='column' w='full' align='start'>
                    <Flex w='full' align='center'>
                      <Box flex='1' textAlign='left' my='auto' minW='127px'>
                        <Text fontSize='xs' color="#aaa">{nft.name}</Text>
                        <Box fontWeight='bold'>{nft.length} days ({nft.daysRemaining} days remaining)</Box>
                      </Box>
                      <Box>
                        <VStack align='end' spacing={2} fontSize='sm'>
                          <HStack fontWeight='bold'>
                            <FortuneIcon boxSize={6} />
                            <Box>{commify(round(nft.amount))}</Box>
                          </HStack>
                          <Wrap spacing={2} justify='flex-end'>
                            <Tag variant='outline'>
                              {round(nft.baseApr, 2)}%
                            </Tag>
                            <Tag variant='outline'>
                              <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()}
                                     alt="troopsIcon" boxSize={4}/>
                              <Box ms={1}>
                                {commify(nft.troops)}
                              </Box>
                            </Tag>
                            <Tag variant='outline'>
                              <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/mitama.png').convert()}
                                     alt="troopsIcon" boxSize={4}/>
                              <Box ms={1}>
                                {commify(nft.mitama)}
                              </Box>
                            </Tag>
                          </Wrap>
                        </VStack>
                      </Box>
                    </Flex>
                  </Flex>
                </RdModalBox>
              ))}
            </VStack>
          </Box>
          <Box ps='20px' textAlign='center' mt={4}>
            <RdButton
              fontSize={{base: 'xl', sm: '2xl'}}
              stickyIcon={true}
              isLoading={isExecuting}
              isDisabled={isExecuting || !selectedVaultId}
              onClick={handleConvert}
            >
              Convert
            </RdButton>
          </Box>
        </>
      ) : (
        <Box textAlign='center' mt={4}>
          No vault NFTs found
        </Box>
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
        {amount} $FRTN has now been staked for {duration} days!
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

const ImportVaultComplete = ({onReturn}: {onReturn: () => void}) => {
  return (
    <Box p={4}>
      <Box textAlign='center'>
        Vault imported successfully! The vault is now visible in the Bank. Any bonus APR will be automatically applied.
      </Box>
      <Box textAlign='center' mt={8} mx={2}>
        <RdButton size={{base: 'md', md: 'lg'}} onClick={onReturn} w={{base: 'full', sm: 'auto'}}>
          Back To Vaults
        </RdButton>
      </Box>
    </Box>
  )
}

export default CreateVaultPage;