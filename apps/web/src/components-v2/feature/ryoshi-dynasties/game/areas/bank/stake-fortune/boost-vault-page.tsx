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
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps,
  VaultType
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { useSwitchNetwork } from '@eb-pancakeswap-web/hooks/useSwitchNetwork';
import { ApiService } from '@src/core/services/api-service';
import useEnforceSignature from '@src/Components/Account/Settings/hooks/useEnforceSigner';
import { commify } from 'ethers/lib/utils';
import { QuestionHelper } from '@dex/swap/components/tabs/swap/question-helper';
import ImageService from '@src/core/services/image';
import { RdModalBox } from '@src/components-v2/feature/ryoshi-dynasties/components/rd-modal';
import {
  useUserVaultBoost
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/vault-summary';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/constants';

const steps = {
  form: 'form',
  started: 'started',
  claimed: 'claimed'
};

interface BoostVaultPageProps {
  vault: FortuneStakingAccount;
  onReturn: () => void;
}

const MAX_TROOPS = 20160;
const SECONDS_PER_TROOP = 30;
const REWARD_MITAMA_DENOMINATOR = 1000;

const BoostVaultPage = ({ vault, onReturn }: BoostVaultPageProps) => {
  const { refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [currentStep, setCurrentStep] = useState(steps.form);
  const { boost: activeBoost } = useUserVaultBoost(+vault.vaultId);

  const handleStart = () => {
    setCurrentStep(steps.started);
    refreshUser();
  }

  const handleClaimed = () => {
    setCurrentStep(steps.claimed);
  }

  return (
    <Box mx={1} pb={6} px={2}>
      <Text textAlign='center' fontSize={14} py={2}>Boost your vault for additional bonuses. By sending Ryoshi troops, you can receive rewards in Koban and XP!</Text>
      <AuthenticationRdButton requireSignin={false}>
        <Box>
          {currentStep === steps.form && (
            <>
              {activeBoost ? (
                <ActiveVaultBoostForm vaultId={vault.vaultId} onComplete={handleClaimed} />
              ) : (
                <CreateVaultBoostForm vault={vault} onComplete={handleStart} />
              )}
            </>
          )}
          {currentStep === steps.claimed ? (
            <VaultBoostComplete
              message='Boost claimed!'
              onReturn={onReturn}
            />
          ) : currentStep === steps.started && (
            <VaultBoostComplete
              message='Boost started!'
              onReturn={onReturn}
            />
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
const CreateVaultBoostForm = ({vault, onComplete}: VaultBoostFormProps) => {
  const { chainId: bankChainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const user = useUser();
  const { chainId: activeChainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();
  const queryClient = useQueryClient();

  const [kobanQuantity, setKobanQuantity] = useState<string>('');
  const [derivedTroopsQuantity, setDerivedTroopsQuantity] = useState<number>(0);
  const {requestSignature} = useEnforceSignature();

  const { user: rdUserContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const vaultBalance = Number(ethers.utils.formatEther(vault.balance));
  const vaultLengthDays = Number(vault.length / (86400));
  const vaultMitama = Math.floor((vaultBalance * vaultLengthDays) / 1080);
  const vaultType = vault.frtnDeposit ? VaultType.LP : VaultType.TOKEN;

  const hourlyKobanRate = kobanHourlyRateByMitama(vaultType, vaultMitama);
  const minTroops = minimumTroopsByMitama(vaultType, vaultMitama);
  const availableTroops = rdUserContext?.game.troops.user.available.total;

  const maxKoban = useMemo(() => {
    let troops = availableTroops ?? 0;
    if (troops > MAX_TROOPS) troops = MAX_TROOPS;

    const boostHours = (Number(troops) * SECONDS_PER_TROOP) / 3600;
    let totalKobanReward = kobanRewardForDuration(vaultType, vaultMitama, boostHours);

    // Adjust down if rounding leads to needing more troops than available
    while (totalKobanReward > 0 && minimumTroopsByDesiredKoban(vaultType, vaultMitama, totalKobanReward) > troops) {
      totalKobanReward--;
    }

    return totalKobanReward;
  }, [availableTroops, MAX_TROOPS, vaultType, vaultMitama]);

  const handleQuantityChange = (valueString: string, valueNumber: number) => {
    setKobanQuantity(valueString);
    setDerivedTroopsQuantity(minimumTroopsByDesiredKoban(
      vaultType,
      vaultMitama,
      isNaN(valueNumber) ? 0 : valueNumber
    ));
  }

  const handleMaxInput = () => {
    handleQuantityChange(maxKoban.toString(), maxKoban);
  }

  const startBoost = async () => {
    if (activeChainId !== bankChainId) {
      await switchNetworkAsync(bankChainId);
      return;
    }

    if (!availableTroops || availableTroops < minTroops) {
      throw new Error('Not enough troops required');
    }

    if (derivedTroopsQuantity < minTroops) {
      throw new Error(`Must add at least ${minTroops} ${pluralize(minTroops, 'troop')}`);
    }

    const maxTroops = Math.min(availableTroops ?? 0, MAX_TROOPS);
    if (derivedTroopsQuantity > maxTroops) {
      toast.error(`Cannot add more than ${maxTroops} ${pluralize(maxTroops, 'troop')}`);
      return;
    }

    const signature = await requestSignature();
    await ApiService.withoutKey().ryoshiDynasties.boostVault(
      vault.vaultId,
      bankChainId,
      derivedTroopsQuantity,
      user.address!,
      signature
    );
  }

  const { mutate: handleStartBoost, isPending: isExecuting } = useMutation({
    mutationFn: startBoost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankUserVaultBoosts(user.address) });

      onComplete();
    },
    onError: (error) => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  });

  return (
    <RdModalBox>
      <FormControl mt={4}>
        <FormLabel me={0}>
          <Flex justify='space-between'>
            <Box>Koban boost amount</Box>
            <Tag colorScheme='blue' variant='solid'>Ryoshi: {availableTroops !== undefined ? commify(availableTroops) : 'N/A'}</Tag>
          </Flex>
        </FormLabel>
        <HStack align='stretch'>
          <NumberInput
            value={kobanQuantity}
            min={0}
            max={maxKoban}
            step={1}
            onChange={handleQuantityChange}
            w='full'
          >
            <NumberInputField />
          </NumberInput>
          <Button onClick={handleMaxInput}>MAX</Button>
        </HStack>
        <FormHelperText fontSize='xs'>Max: {maxKoban} Koban. {minTroops * 2} Ryoshi per Koban, starting at {minTroops}</FormHelperText>
        <FormErrorMessage fontSize='sm'>Error</FormErrorMessage>
      </FormControl>
      <VStack align='stretch' mt={4}>
        <Flex justify='space-between' fontSize='sm'>
          <HStack>
            <Box>Mitama Boost</Box>
            <QuestionHelper
              text={
                <Box fontSize='sm'>
                  <Box>Boost will earn {kobanMultipliers[vaultType]} Koban per 1000 Mitama per hour</Box>
                </Box>
              }
              placement='top'
            />
          </HStack>
          <VStack align='end' spacing={0}>
            <Box>{round(hourlyKobanRate, 3)} Koban / hr</Box>
            <HStack>
              <Box fontSize='xs' className='text-muted'>{commify(vaultMitama)}</Box>
              <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/mitama.png').convert()} alt="troopsIcon" boxSize={3} />
            </HStack>
          </VStack>
        </Flex>
        <Flex justify='space-between' fontSize='sm'>
          <HStack>
            <Box>Ryoshi to send</Box>
          </HStack>
          <VStack align='end' spacing={0}>
            <Box>{commify(derivedTroopsQuantity)}</Box>
          </VStack>
        </Flex>
        <Flex justify='space-between' fontSize='sm'>
          <Box>Duration</Box>
          <Box>{derivedTroopsQuantity ? getLengthOfTime(derivedTroopsQuantity * SECONDS_PER_TROOP) : '-'}</Box>
        </Flex>
      </VStack>
      <Box ps='20px' textAlign='center' mt={4}>
        <RdButton
          fontSize={{base: 'xl', sm: '2xl'}}
          stickyIcon={true}
          isLoading={isExecuting}
          isDisabled={isExecuting}
          onClick={() => handleStartBoost()}
        >
          Boost
        </RdButton>
      </Box>
    </RdModalBox>
  )
}

interface ActiveVaultBoostFormProps {
  vaultId: number;
  onComplete: (message: string) => void;
}

const ActiveVaultBoostForm = ({ vaultId, onComplete }: ActiveVaultBoostFormProps) => {
  const user = useUser();
  const {requestSignature} = useEnforceSignature();
  const { boost: activeBoost, claimable, timeRemaining } = useUserVaultBoost(+vaultId);
  const queryClient = useQueryClient();

  const claimBoost = async () => {
    const signature = await requestSignature();
    await ApiService.withoutKey().ryoshiDynasties.claimVaultBoost(
      activeBoost!.id,
      user.address!,
      signature
    );
  }

  const { mutate: handleClaimBoost, isPending: isExecuting } = useMutation({
    mutationFn: claimBoost,
    onSuccess: () => {
      queryClient.setQueryData(
        queryKeys.bankUserVaultBoosts(user.address),
        (oldData: any) => oldData.filter((boost: any) => +boost.vaultId !== +vaultId)
      );

      onComplete('Boost claimed!');
    },
    onError: (error) => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  });

  return (
    <Box py={4}>
      <RdModalBox textAlign='center'>
        {claimable ? (
          <Box>Your boost is complete! {activeBoost.koban} Koban rewards earned and will be sent to the Bank after claiming below.</Box>
        ) : (
          <Box>A boost is currently in progress ({activeBoost.troops} troops). Can be claimed in {timeRemaining}</Box>
        )}
      </RdModalBox>
      {claimable && (
        <Box textAlign='center' mt={8} mx={2}>
          <RdButton
            size={{base: 'md', md: 'lg'}}
            stickyIcon={true}
            isLoading={isExecuting}
            isDisabled={isExecuting}
            onClick={() => handleClaimBoost()}
          >
            Claim Rewards
          </RdButton>
        </Box>
      )}
    </Box>
  )
}

const VaultBoostComplete = ({message, onReturn}: {message: string, onReturn: () => void}) => {
  return (
    <Box py={4}>
      <RdModalBox textAlign='center' fontSize='lg'>
        {message}
      </RdModalBox>
      <Box textAlign='center' mt={8} mx={2}>
        <RdButton size={{base: 'md', md: 'lg'}} onClick={onReturn}>
          Back To Vaults
        </RdButton>
      </Box>
    </Box>
  )
}

export default BoostVaultPage;

const kobanMultipliers = {
  [VaultType.TOKEN]: 0.002,
  [VaultType.LP]: 0.005
};

function kobanHourlyRateByMitama(vaultType: VaultType, mitama: number) {
  const multiplier = kobanMultipliers[vaultType];
  return (mitama / REWARD_MITAMA_DENOMINATOR) * multiplier;
}

function minimumTroopsByMitama(vaultType: VaultType, mitama: number) {
  const rate = kobanHourlyRateByMitama(vaultType, mitama);
  const hoursForOneKoban = 0.5 / rate; // 0.5 because we round up koban
  const secondsNeeded = hoursForOneKoban * 3600;
  return Math.ceil(secondsNeeded / SECONDS_PER_TROOP);
}

function kobanRewardForDuration(vaultType: VaultType, mitama: number, hours: number) {
  const rate = kobanHourlyRateByMitama(vaultType, mitama);
  return Math.round(rate * hours);
}

function minimumTroopsByDesiredKoban(vaultType: VaultType, mitama: number, desiredKoban: number) {
  const rate = kobanHourlyRateByMitama(vaultType, mitama);
  const hoursNeeded = (desiredKoban - 0.5) / rate; // similar logic as for 1 koban, but scaled
  const secondsNeeded = hoursNeeded * 3600;
  const troops = Math.ceil(secondsNeeded / SECONDS_PER_TROOP);
  return troops > 0 ? troops : 0;
}