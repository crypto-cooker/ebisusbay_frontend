import {DerivedFarm, FarmState} from "@dex/farms/constants/types";
import {ModalDialog} from "@src/components-v2/foundation/modal";
import {
  Alert,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  ModalBody,
  ModalFooter,
  NumberInput,
  NumberInputField,
  Spinner,
  Stack,
  Tag,
  VStack
} from "@chakra-ui/react";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import React, {useEffect, useMemo, useState} from "react";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {ApiService} from "@src/core/services/api-service";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";
import {useAppChainConfig} from "@src/config/hooks";
import {useQuery} from "@tanstack/react-query";
import {getLengthOfTime, pluralize, round} from "@market/helpers/utils";
import {commify} from "ethers/lib/utils";
import {CheckIcon} from "@chakra-ui/icons";
import {useUserFarmBoost, useUserMitama} from "@dex/farms/hooks/user-farms";
import ImageService from "@src/core/services/image";

interface StakeLpTokensDialogProps {
  isOpen: boolean;
  onClose: () => void;
  farm: DerivedFarm;
  onSuccess: () => void;
}

const MIN_TROOPS = 10;
const SECONDS_PER_TROOP = 60;

const BoostFarmDialog = ({isOpen, onClose, farm, onSuccess}: StakeLpTokensDialogProps) => {
  const user = useUser();
  const { config: appChainConfig } = useAppChainConfig();
  const { boost: existingBoost, claimable: isBoostClaimable, timeRemaining } = useUserFarmBoost(farm.data.pid);
  const userMitama = useUserMitama();

  const {signature, isSignedIn, requestSignature} = useEnforceSignature();
  const [quantity, setQuantity] = useState<string>('');
  const [executing, setExecuting] = useState<boolean>(false);

  const { data: rdUserContext } = useQuery({
    queryKey: ['RyoshiDynastiesUserContext', user.address, signature],
    queryFn: async () => {
      if (!!signature && !!user.address) {
        return await ApiService.withoutKey().ryoshiDynasties.getUserContext(user.address!, signature)
      }
      throw 'Please sign message in wallet to continue'
    },
    refetchOnWindowFocus: false,
    enabled: isOpen && !!user.address && isSignedIn,
  });

  const availableTroops = rdUserContext?.game.troops.user.available.total;
  const xpLevel = rdUserContext?.experience.level ?? 1;
  const mitamaBoost = useMemo(() => boostPctByMitama(userMitama), [userMitama]);
  const maxBoostTime = useMemo(() => maxBoostTimeByXpLevel(xpLevel), [xpLevel]);
  const maxTroops = round(maxBoostTime / 60);

  const handleQuantityChange = (valueString: string) => {
    setQuantity(valueString);
  }

  const handlePresetQuantityChange = (percent: number) => {
    let newQuantity = Math.floor((availableTroops ?? 0) * (percent / 100));
    if (newQuantity > maxTroops) newQuantity = maxTroops;

    setQuantity(newQuantity.toString());
  }

  const handleConfirmBoost = async () => {
    try {
      setExecuting(true);

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
      await ApiService.withoutKey().ryoshiDynasties.sendTroopsToFarm(
        farm.data.pid,
        appChainConfig.chain.id,
        quantity,
        user.address!,
        signature
      );
      toast.success('Boost started!');
      onSuccess();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecuting(false);
    }
  }

  const handleClaimBoost = async () => {
    try {
      setExecuting(true);
      const signature = await requestSignature();
      await ApiService.withoutKey().ryoshiDynasties.claimFarmBoost(
        existingBoost!.id,
        user.address!,
        signature
      );
      toast.success('Boost claimed!');
      onSuccess();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecuting(false);
    }
  }

  // If user switches wallet while in dialog, immediately request new signature for context request
  useEffect(() => {
    async function func() {
      await requestSignature();
    }
    if (isOpen && !!user.address) {
      func();
    }
  }, [user.address, isOpen]);

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title='Farm Quest'>
      <ModalBody>
        <Box fontSize='sm' textAlign='center'>Send troops from Ryoshi Dynasties to your farm and temporarily boost your APR! Claim your boosted APR at the end of the quest.</Box>
        {existingBoost ? (
          <>
            <Box fontSize='sm' textAlign='center' mt={4}>
              {isBoostClaimable ? (
                <Alert status='success' variant='solid'>
                  <CheckIcon />
                  <Box ms={1}>Your boost is complete! {existingBoost.claimAmount} FRTN rewards earned and will be sent to the Bank after claiming below.</Box>
                </Alert>
              ) : (
                <Alert status='info'>
                  <Spinner boxSize={4} />
                  <Box ms={1}>A boost is currently in progress ({existingBoost.troops} troops). Can be claimed in {timeRemaining}</Box>
                </Alert>
              )}
            </Box>
          </>
        ) : (
          <>
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
              <FormHelperText fontSize='sm'>Min: {MIN_TROOPS}, Max: {maxTroops}. Quest time increases 1 minute per troop sent</FormHelperText>
              <FormErrorMessage fontSize='sm'>Error</FormErrorMessage>
            </FormControl>
            <VStack align='stretch' mt={4}>
              <Flex justify='space-between' fontSize='sm'>
                <Box>Mitama Boost</Box>
                <VStack align='end' spacing={0}>
                  <Box>{mitamaBoost}%</Box>
                  <HStack>
                    <Box fontSize='xs' className='text-muted'>{userMitama}</Box>
                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/mitama.png').convert()} alt="troopsIcon" boxSize={3} />
                  </HStack>
                </VStack>
              </Flex>
              <Flex justify='space-between' fontSize='sm'>
                <Box>Boosted APR</Box>
                <Box>{parseFloat(farm.derived.apr.slice(0, -1)) + mitamaBoost}%</Box>
              </Flex>
              <Flex justify='space-between' fontSize='sm'>
                <Box>Duration</Box>
                <Box>{getLengthOfTime(parseInt(quantity) * SECONDS_PER_TROOP)}</Box>
              </Flex>
            </VStack>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {(farm.derived.state === FarmState.ACTIVE || (existingBoost && isBoostClaimable)) ? (
          <>
            {existingBoost && isBoostClaimable ? (
              <Stack direction='row' w='full'>
                <PrimaryButton
                  flex={1}
                  onClick={handleClaimBoost}
                  isLoading={executing}
                  isDisabled={executing}
                >
                  Claim Rewards
                </PrimaryButton>
              </Stack>
            ) : !existingBoost && (
              <Stack direction='row' w='full'>
                <SecondaryButton flex={1} onClick={onClose}>Cancel</SecondaryButton>
                <PrimaryButton
                  flex={1}
                  onClick={handleConfirmBoost}
                  isLoading={executing}
                  isDisabled={executing || !quantity || Number(quantity) === 0 || Number(quantity) > maxTroops || !availableTroops}
                >
                  Confirm
                </PrimaryButton>
              </Stack>
            )}
          </>
        ) : (
          <Box textAlign='center'>
            Farm has ended and cannot receive new boosts
          </Box>
        )}
      </ModalFooter>
    </ModalDialog>
  )
}

export default BoostFarmDialog;

function maxBoostTimeByXpLevel(level: number) {
  let maxTime = 0;
  switch (level) {
    case 0:
      maxTime = 600;
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

function boostPctByMitama(mitama: number) {
  let boostValue = 0;

  if (mitama >= 2500) {
    boostValue = 1;
  } else if (mitama >= 10000) {
    boostValue = 5;
  } else if (mitama >= 25000) {
    boostValue = 10;
  } else if (mitama >= 50000) {
    boostValue = 25;
  } else if (mitama >= 100000) {
    boostValue = 50;
  } else if (mitama >= 250000) {
    boostValue = 100;
  } else if (mitama >= 500000) {
    boostValue = 200;
  } else if (mitama >= 1000000) {
    boostValue = 250;
  } else if (mitama >= 2000000) {
    boostValue = 300;
  } else {
    boostValue = 0;
  }

  return boostValue;
}