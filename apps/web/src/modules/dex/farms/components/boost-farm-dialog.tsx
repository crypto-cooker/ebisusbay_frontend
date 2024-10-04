import {DerivedFarm, FarmState} from "@dex/farms/constants/types";
import {boostsAtom, UserFarmState} from "@dex/farms/state/user";
import {ModalDialog} from "@src/components-v2/foundation/modal";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage, FormHelperText,
  FormLabel,
  HStack,
  ModalBody,
  ModalFooter,
  NumberInput,
  NumberInputField, Spinner,
  Stack, Tag, VStack,
  Wrap
} from "@chakra-ui/react";
import {BigNumber, ethers} from "ethers";
import {DoubleCurrencyLayeredLogo} from "@dex/components/logo";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import React, {useMemo, useState} from "react";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {ApiService} from "@src/core/services/api-service";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";
import {useAppChainConfig} from "@src/config/hooks";
import {useQuery} from "@tanstack/react-query";
import {getLengthOfTime, pluralize} from "@market/helpers/utils";
import {commify} from "ethers/lib/utils";
import {useAtom} from "jotai";
import {CheckIcon, SpinnerIcon} from "@chakra-ui/icons";
import {userUserFarmBoost} from "@dex/farms/hooks/user-farms";

interface StakeLpTokensDialogProps {
  isOpen: boolean;
  onClose: () => void;
  farm: DerivedFarm;
  onSuccess: () => void;
}

const MAX_TROOPS = 360;
const MIN_TROOPS = 60;
const SECONDS_PER_TROOP = 60;

const BoostFarmDialog = ({isOpen, onClose, farm, onSuccess}: StakeLpTokensDialogProps) => {
  const user = useUser();
  const { config: appChainConfig } = useAppChainConfig();
  const { boost: existingBoost, claimable: isBoostClaimable, timeRemaining } = userUserFarmBoost(farm.data.pid);

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
    enabled: !!user.address && isSignedIn,
  });
  const availableTroops = rdUserContext?.game.troops.user.available.total;
  const xpLevel = rdUserContext?.experience.level ?? 1;
  const xpLevelBoost = boostPercentageByExpLevel(xpLevel);

  const handleQuantityChange = (valueString: string) => {
    setQuantity(valueString);
  }

  const handlePresetQuantityChange = (percent: number) => {
    let newQuantity = Math.floor((availableTroops ?? 0) * (percent / 100));
    if (newQuantity > MAX_TROOPS) newQuantity = MAX_TROOPS;

    setQuantity(newQuantity.toString());
  }

  const handleConfirmBoost = async () => {
    try {
      setExecuting(true);

      const quantityInt = +quantity;
      if (quantityInt < MIN_TROOPS) {
        toast.error(`Must add more than ${pluralize(MIN_TROOPS, 'troop')}`);
        return;
      }

      if (quantityInt > MAX_TROOPS) {
        toast.error(`Cannot add more than ${pluralize(MAX_TROOPS, 'troop')}`);
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
                  <Tag colorScheme='blue' variant='solid'>Available: {availableTroops ? commify(availableTroops) : 'N/A'}</Tag>
                </Flex>
              </FormLabel>
              <HStack align='stretch'>
                <NumberInput
                  value={quantity}
                  min={0}
                  max={MAX_TROOPS}
                  step={1}
                  onChange={(valueString) => handleQuantityChange(valueString)}
                  w='full'
                >
                  <NumberInputField />
                </NumberInput>
                <Button onClick={() => handlePresetQuantityChange(100)}>MAX</Button>
              </HStack>
              <FormHelperText fontSize='sm'>Min: {MIN_TROOPS}, Max: {MAX_TROOPS}. Quest time increases 1 minute per troop sent</FormHelperText>
              <FormErrorMessage fontSize='sm'>Error</FormErrorMessage>
            </FormControl>
            <VStack align='stretch' mt={4}>
              <Flex justify='space-between' fontSize='sm'>
                <Box>APR Boost</Box>
                <Box>{xpLevelBoost}% (level {xpLevel})</Box>
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
              isDisabled={executing || !quantity || Number(quantity) === 0 || Number(quantity) > MAX_TROOPS}
            >
              Confirm
            </PrimaryButton>
          </Stack>
        )}
      </ModalFooter>
    </ModalDialog>
  )
}

export default BoostFarmDialog;


function boostPercentageByExpLevel(level: number) {
  let boostValue = 0;
  switch (level) {
    case 1:
      boostValue = 5;
      break;
    case 2:
      boostValue = 7.88;
      break;
    case 3:
      boostValue = 12.41;
      break;
    case 4:
      boostValue = 19.56;
      break;
    case 5:
      boostValue = 30.82;
      break;
    case 6:
      boostValue = 48.56;
      break;
    case 7:
      boostValue = 76.52;
      break;
    case 8:
      boostValue = 120.58;
      break;
    case 9:
      boostValue = 190;
      break;
    case 10:
      boostValue = 300;
      break;
    default:
      boostValue = 1;
      break;
  }

  return boostValue;
}