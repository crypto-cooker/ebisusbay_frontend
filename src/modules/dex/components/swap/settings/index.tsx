import {
  Box, Button,
  Flex, FormControl, FormErrorMessage, FormLabel, GridItem, Input, InputGroup, InputLeftElement, InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay, NumberDecrementStepper, NumberIncrementStepper,
  NumberInput, NumberInputField, NumberInputStepper,
  SimpleGrid,
  Switch,
  VStack, Wrap
} from "@chakra-ui/react";
import {ModalState} from "@dex/swap/types";
import React, {ChangeEvent, useState} from "react";
import {ModalDialog} from "@src/components-v2/foundation/modal";
import {useUserAllowMultihop, useUserExpertMode, useUserSlippageTolerance} from "@dex/state/user/hooks";
import {Button as ChakraButton} from "@chakra-ui/button/dist/button";
import {getTheme} from "@src/global/theme/theme";
import {useUser} from "@src/components-v2/useUser";
import {CheckIcon, PhoneIcon, WarningIcon} from "@chakra-ui/icons";
import {round} from "@market/helpers/utils";
import {Percent} from "@uniswap/sdk-core";

export default function Settings({isOpen, onClose}: ModalState) {
  const [userExpertMode, setUserExpertMode ] = useUserExpertMode();
  const [userMultihop, setUserMultihop ] = useUserAllowMultihop();

  const handleSlippageChange = (value: number) => {

  }

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title='Transaction Settings'
      modalProps={{isCentered: false}}
    >
      <ModalBody pb={4}>
        <VStack align='stretch' spacing={2}>
          <SlippageOptions />
          <FormControl mt={4}>
            <Flex justify='space-between'>
              <FormLabel>Tx deadline (mins)</FormLabel>
              <NumberInput
                step={1}
                size='sm'
                maxW='80px'
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
          </FormControl>
          <FormControl>
            <Flex justify='space-between'>
              <FormLabel>Expert Mode</FormLabel>
              <Switch isChecked={userExpertMode} onChange={() => setUserExpertMode(!userExpertMode)} />
            </Flex>
          </FormControl>
          <FormControl>
            <Flex justify='space-between'>
              <FormLabel>Allow Multihops</FormLabel>
              <Switch isChecked={userMultihop} onChange={() => setUserMultihop(!userMultihop)} />
            </Flex>
          </FormControl>
        </VStack>
      </ModalBody>
    </ModalDialog>
  )
}

const suggestedSlippageValues = [10, 50, 100];
enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

function SlippageOptions() {
  const user = useUser();
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance();
  const [slippageInput, setSlippageInput] = useState('');

  const handleSlippageChange = (value: number) => {
    setSlippageInput('');
    setUserSlippageTolerance(new Percent(value));
  }

  const handleCustomSlippageChange = (value: string) => {
    setSlippageInput(value);

    try {
      const valueAsIntFromRoundedFloat = parseInt((parseFloat(value) * 100).toString());
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setUserSlippageTolerance(new Percent(valueAsIntFromRoundedFloat));
      } else {

      }
    } catch {}
  }

  // const slippageInputIsValid =
  //   slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2);
  //
  let slippageError: SlippageError | undefined;
  // if (slippageInput !== '' && !slippageInputIsValid) {
  //   slippageError = SlippageError.InvalidInput;
  // } else if (slippageInputIsValid && userSlippageTolerance < 50) {
  //   slippageError = SlippageError.RiskyLow;
  // } else if (slippageInputIsValid && userSlippageTolerance > 500) {
  //   slippageError = SlippageError.RiskyHigh;
  // } else {
  //   slippageError = undefined;
  // }

  const isErrorOnInput = !!slippageInput && !!slippageError;

  return (
    <VStack align='stretch'>
      <Box fontWeight='bold'>Slippage Tolerance</Box>
      <SimpleGrid columns={4} spacing={{base: 2, sm: 4}}>
        {suggestedSlippageValues.map((value) => (
          <Button
            key={value}
            isActive={new Percent(value) === userSlippageTolerance}
            onClick={() => handleSlippageChange(value)}
            rounded='3px'
            variant='tab'
            size={{base: 'sm', sm: 'md'}}
            color={new Percent(value) === userSlippageTolerance ? 'white' : getTheme(user.theme).colors.textColor3}
          >
            {value / 100}%
          </Button>
        ))}
        <Box w='100px' flexGrow={1}>
          <InputGroup>
            <Input
              placeholder={(0 / 100).toFixed(2).toString()}
              size={{base: 'sm', sm: 'md'}}
              type='number'
              pattern='^[0-9]*[.,]?[0-9]{0,2}$'
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleCustomSlippageChange(e.target.value)}
              value={slippageInput}
              borderColor={isErrorOnInput ? (slippageError === SlippageError.InvalidInput ? 'red.600' : 'orange.600') : 'inherit'}
              onBlur={(e: ChangeEvent<HTMLInputElement>) => handleCustomSlippageChange((0 / 100).toFixed(2))}
            />
            <InputRightElement>
              %
            </InputRightElement>
          </InputGroup>
        </Box>
        {!!slippageError && (
          <GridItem colSpan={4}>
            <Box
              fontSize='sm'
              fontWeight='bold'
              color={slippageError === SlippageError.InvalidInput ? 'red.600' : 'orange.600'}
            >
              {slippageError === SlippageError.InvalidInput
                ? 'Enter a valid slippage percentage'
                : slippageError === SlippageError.RiskyLow
                  ? 'Your transaction may fail'
                  : 'Your transaction may be frontrun'}
            </Box>
          </GridItem>
        )}
      </SimpleGrid>
    </VStack>
  )
}