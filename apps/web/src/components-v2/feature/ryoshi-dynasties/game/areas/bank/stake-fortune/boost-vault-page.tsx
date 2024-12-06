import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  NumberInput,
  NumberInputField,
  Stack,
  Tag,
  Text,
  VStack
} from '@chakra-ui/react';
import React, { useContext, useMemo, useState } from 'react';
import RdButton from '@src/components-v2/feature/ryoshi-dynasties/components/rd-button';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { getLengthOfTime, pluralize, round } from '@market/helpers/utils';
import { FortuneStakingAccount } from '@src/core/services/api-service/graph/types';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context';
import { parseErrorMessage } from '@src/helpers/validator';
import AuthenticationRdButton from '@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button';
import { useUser } from '@src/components-v2/useUser';
import { useWriteContract } from 'wagmi';
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps,
  VaultType
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context';
import { useAppChainConfig } from '@src/config/hooks';
import { useBankContract } from '@src/global/hooks/contracts';
import { useCallWithGasPrice } from '@eb-pancakeswap-web/hooks/useCallWithGasPrice';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { useSwitchNetwork } from '@eb-pancakeswap-web/hooks/useSwitchNetwork';
import { ApiService } from '@src/core/services/api-service';
import useEnforceSignature from '@src/Components/Account/Settings/hooks/useEnforceSigner';
import { commify } from 'ethers/lib/utils';
import { QuestionHelper } from '@dex/swap/components/tabs/swap/question-helper';
import ImageService from '@src/core/services/image';

const steps = {
  form: 'form',
  started: 'started',
  complete: 'complete'
};

interface BoostVaultPageProps {
  vault: FortuneStakingAccount;
  onReturn: () => void;
}

const MIN_TROOPS = 10;
const SECONDS_PER_TROOP = 30;
const REWARD_MITAMA_DENOMINATOR = 1000;

const BoostVaultPage = ({ vault, onReturn }: BoostVaultPageProps) => {
  const { refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: bankChainId, userVaultBoosts } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const [currentStep, setCurrentStep] = useState(steps.form);

  const [existingBoost, setExistingBoost] = useState<{claimAmount: any, troops: any, timeRemaining: any}>();
  const [isBoostClaimable, setIsBoostClaimable] = useState(false);

  const handleStart = () => {
    setCurrentStep(steps.complete);
    refreshUser();
  }

  return (
    <Box mx={1} pb={6} px={2}>
      <Text textAlign='center' fontSize={14} py={2}>Boost your vault for additional bonuses. By sending Ryoshi troops, you can receive rewards in Koban and XP!</Text>
      <AuthenticationRdButton requireSignin={false}>
        <Box p={4}>
          {existingBoost ? (
            <>
              {currentStep === steps.form && (
                <ActiveVaultBoostForm
                  existingBoost={existingBoost}
                  onComplete={(message) => {
                    setCurrentStep(steps.complete)
                  }}
                />
              )}
              {currentStep === steps.complete && (
                <VaultBoostComplete
                  message='Boost claimed!'
                  onReturn={onReturn}
                />
              )}
            </>
          ) : (
            <>
              {currentStep === steps.form && (
                <VaultBoostForm vault={vault} onComplete={handleStart} />
              )}
              {currentStep === steps.complete && (
                <VaultBoostComplete
                  message='Boost started!'
                  onReturn={onReturn}
                />
              )}
            </>
          )}
        </Box>
      </AuthenticationRdButton>
    </Box>
  )
}

interface VaultBoostFormProps {
  vault: FortuneStakingAccount;
  onComplete: () => void;
}
const VaultBoostForm = ({vault, onComplete}: VaultBoostFormProps) => {
  const { chainId: bankChainId, userVaultBoosts } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);
  const [isExecuting, setIsExecuting] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const user = useUser();
  const bankContract = useBankContract(bankChainId);
  const { callWithGasPrice } = useCallWithGasPrice()
  const { chainId: activeChainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();

  const [quantity, setQuantity] = useState<string>('');
  const {signature, isSignedIn, requestSignature} = useEnforceSignature();

  const { user: rdUserContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;


  const vaultBalance = Number(ethers.utils.formatEther(vault.balance));
  const vaultLengthDays = Number(vault.length / (86400));
  const vaultMitama = Math.floor((vaultBalance * vaultLengthDays) / 1080);
  const vaultType = vault.frtnDeposit ? VaultType.LP : VaultType.TOKEN;
  const hourlyKobanRate = kobanRateByMitama(vaultType, vaultMitama);
  const boostHours = (quantity * SECONDS_PER_TROOP) / 3600;
  const totalKobanReward = kobanRewardForDuration(vaultType, vaultMitama, boostHours);

  const availableTroops = rdUserContext?.game.troops.user.available.total;
  const xpLevel = rdUserContext?.experience.level ?? 1;
  const maxBoostTime = useMemo(() => maxBoostTimeByXpLevel(xpLevel), [xpLevel]);
  const maxTroops = round(maxBoostTime / SECONDS_PER_TROOP);

  const handleQuantityChange = (valueString: string) => {
    setQuantity(valueString);
  }

  const handlePresetQuantityChange = (percent: number) => {
    let newQuantity = Math.floor((availableTroops ?? 0) * (percent / 100));
    if (newQuantity > maxTroops) newQuantity = maxTroops;

    setQuantity(newQuantity.toString());
  }

  const handleStartBoost = async () => {
    try {
      if (activeChainId !== bankChainId) {
        await switchNetworkAsync(bankChainId);
        return;
      }

      setIsExecuting(true);

      const quantityInt = +quantity;
      if (quantityInt < MIN_TROOPS) {
        toast.error(`Must add more than ${MIN_TROOPS} ${pluralize(MIN_TROOPS, 'troop')}`);
        return;
      }

      if (quantityInt > maxTroops) {
        toast.error(`Cannot add more than ${maxTroops} ${pluralize(maxTroops, 'troop')}`);
        return;
      }

      const signature = await requestSignature();
      await ApiService.withoutKey().ryoshiDynasties.boostVault(
        vault.index,
        bankChainId,
        quantity,
        user.address!,
        signature
      );

      onComplete();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <Box>
      <FormControl mt={4}>
        <FormLabel me={0}>
          <Flex justify='space-between'>
            <Box>Troops to send</Box>
            <Tag colorScheme='blue' variant='solid'>Available: {availableTroops !== undefined ? commify(availableTroops) : 'N/A'}</Tag>
          </Flex>
        </FormLabel>
        <HStack align='stretch'>
          <NumberInput
            value={quantity}
            min={0}
            max={maxTroops}
            step={1}
            onChange={(valueString) => handleQuantityChange(valueString)}
            w='full'
          >
            <NumberInputField />
          </NumberInput>
          <Button onClick={() => handlePresetQuantityChange(100)}>MAX</Button>
        </HStack>
        <FormHelperText fontSize='sm'>Min: {MIN_TROOPS}, Max: {maxTroops}. boost time increases {getLengthOfTime(SECONDS_PER_TROOP)} per troop sent</FormHelperText>
        <FormErrorMessage fontSize='sm'>Error</FormErrorMessage>
      </FormControl>
      <VStack align='stretch' mt={4}>
        <Flex justify='space-between' fontSize='sm'>
          <HStack>
            <Box>Mitama Boost</Box>
            <QuestionHelper
              text={
                <Box fontSize='sm'>
                  <Box>Boost will earn ${kobanRates[vaultType]} Koban per 1000 Mitama per hour</Box>
                </Box>
              }
              placement='top'
            />
          </HStack>
          <VStack align='end' spacing={0}>
            <Box>{hourlyKobanRate} Koban / hr</Box>
            <HStack>
              <Box fontSize='xs' className='text-muted'>{vaultMitama}</Box>
              <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/mitama.png').convert()} alt="troopsIcon" boxSize={3} />
            </HStack>
          </VStack>
        </Flex>
        <Flex justify='space-between' fontSize='sm'>
          <HStack>
            <Box>Boosted Koban</Box>
          </HStack>
          <VStack align='end' spacing={0}>
            <Box>{totalKobanReward} Koban</Box>
          </VStack>
        </Flex>
        <Flex justify='space-between' fontSize='sm'>
          <Box>Duration</Box>
          <Box>{quantity ? getLengthOfTime(parseInt(quantity) * SECONDS_PER_TROOP) : '-'}</Box>
        </Flex>
      </VStack>
      <Box ps='20px' textAlign='center' mt={4}>
        <RdButton
          fontSize={{base: 'xl', sm: '2xl'}}
          stickyIcon={true}
          isLoading={isExecuting}
          isDisabled={isExecuting}
          onClick={handleStartBoost}
        >
          Boost
        </RdButton>
      </Box>
    </Box>
  )
}

interface ActiveVaultBoostFormProps {
  existingBoost: any;
  onComplete: (message: string) => void;
}

const ActiveVaultBoostForm = ({ existingBoost, onComplete }: ActiveVaultBoostFormProps) => {
  const user = useUser();
  const [executing, setExecuting] = useState(false);
  const {signature, isSignedIn, requestSignature} = useEnforceSignature();

  const handleClaimBoost = async () => {
    try {
      setExecuting(true);
      const signature = await requestSignature();
      await ApiService.withoutKey().ryoshiDynasties.claimFarmBoost(
        existingBoost!.id,
        user.address!,
        signature
      );
      onComplete('Boost claimed!');
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecuting(false);
    }
  }

  return (
    <Box py={4}>
      <Box textAlign='center'>

        {isBoostClaimable ? (
          <Box>Your boost is complete! {existingBoost.claimAmount} FRTN rewards earned and will be sent to the Bank after claiming below.</Box>
        ) : (
          <Box>A boost is currently in progress ({existingBoost.troops} troops). Can be claimed in {existingBoost.timeRemaining}</Box>
        )}
      </Box>
      <Box textAlign='center' mt={8} mx={2}>
        <Stack direction={{base: 'column', sm: 'row'}} justify='space-between'>
          <RdButton size={{base: 'md', md: 'lg'}} onClick={onReturn} w={{base: 'full', sm: 'auto'}}>
            Back To Vaults
          </RdButton>
        </Stack>
      </Box>
    </Box>
  )
}

const VaultBoostComplete = ({message, onReturn}: {message: string, onReturn: () => void}) => {
  return (
    <Box py={4}>
      <Box textAlign='center'>
        {message}
      </Box>
      <Box textAlign='center' mt={8} mx={2}>
        <Stack direction={{base: 'column', sm: 'row'}} justify='space-between'>
          <RdButton size={{base: 'md', md: 'lg'}} onClick={onReturn} w={{base: 'full', sm: 'auto'}}>
            Back To Vaults
          </RdButton>
        </Stack>
      </Box>
    </Box>
  )
}

export default BoostVaultPage;

function maxBoostTimeByXpLevel(level: number) {
  let maxTime = 0;
  switch (level) {
    case 0:
      maxTime = 3600;
      break;
    case 1:
      maxTime = 3600;
      break;
    case 2:
      maxTime = 10800;
      break;
    case 3:
      maxTime = 21600;
      break;
    case 4:
      maxTime = 28800;
      break;
    case 5:
      maxTime = 43200;
      break;
    case 6:
      maxTime = 64800;
      break;
    case 7:
      maxTime = 86400;
      break;
    case 8:
      maxTime = 129600;
      break;
    case 9:
      maxTime = 172800;
      break;
    case 10:
      maxTime = 345600;
      break;
    default:
      maxTime = 345600;
      break;
  }

  return maxTime;
}

const kobanRates = {
  [VaultType.TOKEN]: 0.002,
  [VaultType.LP]: 0.005
};

function kobanRateByMitama(vaultType: VaultType, mitama: number) {
  const rate = kobanRates[vaultType];
  return (mitama / REWARD_MITAMA_DENOMINATOR) * rate;
}

function kobanRewardForDuration(vaultType: VaultType, mitama: number, hours: number) {
  const rate = kobanRateByMitama(vaultType, mitama);
  return Math.round(rate * hours);
}