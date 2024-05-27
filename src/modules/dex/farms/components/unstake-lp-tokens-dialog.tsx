import {ModalDialog} from "@src/components-v2/foundation/modal";
import {
  Avatar,
  Box, Button,
  Flex,
  FormControl, FormErrorMessage,
  FormHelperText,
  FormLabel, HStack,
  ModalBody, ModalFooter,
  NumberInput,
  NumberInputField, Stack, Wrap
} from "@chakra-ui/react";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import React, {useMemo, useState} from "react";
import {BigNumber, Contract, ethers} from "ethers";
import {commify} from "ethers/lib/utils";
import FarmsAbi from "@src/global/contracts/Farms.json";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {useUser} from "@src/components-v2/useUser";
import {DerivedFarm} from "@dex/farms/constants/types";
import {UserFarmState} from "@dex/farms/state/user";
import {appConfig} from "@src/Config";

const config = appConfig();

interface UnstakeLpTokensDialogProps {
  isOpen: boolean;
  onClose: () => void;
  farm: DerivedFarm;
  userData: UserFarmState;
  onSuccess: () => void;
}

export default function UnstakeLpTokensDialog({isOpen, onClose, farm, userData, onSuccess}: UnstakeLpTokensDialogProps) {
  const user = useUser();
  const [quantity, setQuantity] = useState<string>('');
  const [executing, setExecuting] = useState<boolean>(false);

  const handleQuantityChange = (valueString: string) => {
    setQuantity(valueString);
  }

  const handlePresetQuantityChange = (percent: number) => {
    setQuantity(ethers.utils.formatEther(BigNumber.from(userData.stakedBalance).mul(percent).div(100)));
  }

  const dollarValue = useMemo(() => {
    if (!farm.data.pair) {
      return 0;
    }

    return commify((Number(farm.data.pair.derivedUSD) * Number(quantity)).toFixed(2));
  }, [farm, quantity]);

  const handleConfirmUnstake = async () => {
    try {
      setExecuting(true);
      const contract = new Contract(config.contracts.farms, FarmsAbi, user.provider.signer);
      const tx = await contract.withdraw(farm.data.pid, ethers.utils.parseEther(quantity));
      await tx.wait();
      toast.success('Unstaked successfully');
      onSuccess()
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecuting(false);
    }
  }

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title='Unstake LP Tokens'>
      <ModalBody>
        <Flex justify='space-between' fontSize='sm'>
          <Box>Staked</Box>
          <Box>{ethers.utils.formatEther(userData.stakedBalance.toString())}</Box>
        </Flex>
        <FormControl mt={4}>
          <FormLabel>
            <Flex justify='space-between'>
              <Box>Amount</Box>
              <HStack>
                <Box>
                  {farm.data.pair ? (
                    <Box position='relative' w='40px' h='24px'>
                      <Avatar
                        src={`https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${farm.data.pair.token0.symbol.toLowerCase()}.webp`}
                        rounded='full'
                        size='xs'
                      />
                      <Avatar
                        src={`https://cdn-prod.ebisusbay.com/files/dex/images/tokens/${farm.data.pair.token1.symbol.toLowerCase()}.webp`}
                        rounded='full'
                        size='xs'
                        position='absolute'
                        top={0}
                        right={0}
                      />
                    </Box>
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
            placeholder="Amount"
            value={quantity}
            min={0}
            max={Number(ethers.utils.formatEther(userData.stakedBalance.toString()))}
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
          <PrimaryButton
            flex={1}
            onClick={handleConfirmUnstake}
            isLoading={executing}
            isDisabled={executing || !quantity || Number(quantity) === 0 || Number(quantity) > Number(userData.stakedBalance)}
          >
            Confirm
          </PrimaryButton>
        </Stack>
      </ModalFooter>
    </ModalDialog>
  )
}