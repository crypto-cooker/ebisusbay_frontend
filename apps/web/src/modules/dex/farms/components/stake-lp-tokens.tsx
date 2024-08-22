import {ModalDialog} from "@src/components-v2/foundation/modal";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  ModalBody,
  ModalFooter,
  NumberInput,
  NumberInputField,
  Stack,
  Wrap
} from "@chakra-ui/react";
import React, {useMemo, useState} from "react";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import {DerivedFarm, FarmState} from "@dex/farms/constants/types";
import {UserFarmState} from "@dex/farms/state/user";
import {BigNumber, Contract, ethers} from "ethers";
import {commify} from "ethers/lib/utils";
import FarmsAbi from "@src/global/contracts/Farms.json";
import {useUser} from "@src/components-v2/useUser";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {useAppChainConfig} from "@src/config/hooks";
import {useErrorLogger} from "@market/hooks/use-error-logger";
import {DoubleCurrencyLayeredLogo} from "@dex/components/logo";

interface StakeLpTokensDialogProps {
  isOpen: boolean;
  onClose: () => void;
  farm: DerivedFarm;
  userData: UserFarmState;
  onSuccess: () => void;
}

export default function StakeLpTokensDialog({isOpen, onClose, farm, userData, onSuccess}: StakeLpTokensDialogProps) {
  const user = useUser();
  const logError = useErrorLogger();
  const {config: appChainConfig} = useAppChainConfig();
  const [quantity, setQuantity] = useState<string>('');
  const [executing, setExecuting] = useState<boolean>(false);

  const handleQuantityChange = (valueString: string) => {
    setQuantity(valueString);
  }

  const handlePresetQuantityChange = (percent: number) => {
    setQuantity(ethers.utils.formatEther(BigNumber.from(userData.tokenBalance).mul(percent).div(100)));
  }

  const dollarValue = useMemo(() => {
    if (!farm.data.pair) {
      return 0;
    }

    return commify((Number(farm.data.pair.derivedUSD) * Number(quantity)).toFixed(2));
  }, [farm, quantity]);

  const handleConfirmStake = async () => {
    try {
      setExecuting(true);
      const contract = new Contract(appChainConfig.contracts.farms, FarmsAbi, user.provider.signer);
      const tx = await contract.deposit(farm.data.pid, ethers.utils.parseEther(quantity));
      await tx.wait();
      toast.success('Staked successfully');
      onSuccess();
    } catch (e) {
      logError({error: e});
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecuting(false);
    }
  }

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title='Stake LP Tokens'>
      <ModalBody>
        <Flex justify='space-between' fontSize='sm'>
          <Box>Available</Box>
          <Box>{ethers.utils.formatEther(userData.tokenBalance.toString())}</Box>
        </Flex>
        <FormControl mt={4}>
          <FormLabel>
            <Flex justify='space-between'>
              <Box>Amount</Box>
              <HStack>
                <Box>
                  {farm.data.pair ? (
                    <DoubleCurrencyLayeredLogo
                      address1={farm.data.pair.token0.id}
                      address2={farm.data.pair.token1.id}
                      chainId={farm.derived.chainId}
                      size1={24}
                      size2={24}
                      variant='horizontal'
                    />
                  ) : (
                    <Box position='relative' w='40px' h='40px'>
                      <Avatar
                        src='https://cdn-prod.ebisusbay.com/files/dex/images/tokens/frtn.webp'
                        rounded='full'
                        size='sm'
                      />
                    </Box>
                  )}
                </Box>
                <Box>{farm.data.pair.name} LP</Box>
              </HStack>
            </Flex>
          </FormLabel>
          <NumberInput
            value={quantity}
            min={0}
            max={Number(ethers.utils.formatEther(userData.tokenBalance.toString()))}
            step={1}
            onChange={(valueString) => handleQuantityChange(valueString)}
          >
            <NumberInputField />
          </NumberInput>
          <FormHelperText fontSize='sm'>~ ${dollarValue}</FormHelperText>
          <FormErrorMessage fontSize='sm'>Error</FormErrorMessage>
        </FormControl>
        <Wrap justify='center' mt={4}>
          <Button onClick={() => handlePresetQuantityChange(25)}>25%</Button>
          <Button onClick={() => handlePresetQuantityChange(50)}>50%</Button>
          <Button onClick={() => handlePresetQuantityChange(75)}>75%</Button>
          <Button onClick={() => handlePresetQuantityChange(100)}>MAX</Button>
        </Wrap>
      </ModalBody>
      <ModalFooter>
        <Stack direction='row' w='full'>
          <SecondaryButton flex={1} onClick={onClose}>Cancel</SecondaryButton>
          {farm.derived.state !== FarmState.FINISHED && (
            <PrimaryButton
              flex={1}
              onClick={handleConfirmStake}
              isLoading={executing}
              isDisabled={executing || !quantity || Number(quantity) === 0 || Number(quantity) > Number(userData.tokenBalance)}
            >
              Confirm
            </PrimaryButton>
          )}
        </Stack>
      </ModalFooter>
    </ModalDialog>
  )
}