import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  GridItem, HStack,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Switch,
  Text,
  VStack
} from "@chakra-ui/react";
import {ModalState} from "@dex/swap/types";
import React, {useState} from "react";
import {ModalDialog} from "@src/components-v2/foundation/modal";
import {getTheme} from "@src/global/theme/theme";
import {useUser} from "@src/components-v2/useUser";
import {
  useExpertMode,
  useUserExpertModeAcknowledgement,
  useUserSingleHopOnly,
  useUserSlippage
} from "@pancakeswap/utils/user";
import {useUserTransactionTTL} from "@eb-pancakeswap-web/hooks/useTransactionDeadline";
import {escapeRegExp} from "@pancakeswap/utils/escapeRegExp";
import {QuestionHelper} from "@dex/swap/components/tabs/swap/question-helper";
import {useSwapActionHandlers} from "@eb-pancakeswap-web/state/swap/useSwapActionHandlers";
import {useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";

export default function Settings({isOpen, onClose}: ModalState) {
  const [expertMode, setExpertMode ] = useExpertMode();
  const [singleHopOnly, setSingleHopOnly ] = useUserSingleHopOnly();

  // const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgement()

  const { onChangeRecipient } = useSwapActionHandlers()

  // if (showConfirmExpertModal) {
  //   return (
  //     <ExpertModal
  //       setShowConfirmExpertModal={setShowConfirmExpertModal}
  //       onDismiss={onDismiss}
  //       toggleExpertMode={() => setExpertMode((s) => !s)}
  //       setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
  //     />
  //   )
  // }

  const handleExpertModeToggle = () => {
    if (expertMode || !showExpertModeAcknowledgement) {
      onChangeRecipient(null)
      // setExpertMode((s) => !s)
    } else {
      // setShowConfirmExpertModal(true)
    }
    setExpertMode((s) => !s)
  }
  const {
    DialogHeader,
    DialogBody,
    DialogFooter ,
    DialogBasicHeader,
    DialogComponent
  } = useResponsiveDialog();

  return (
    <DialogComponent
      isOpen={isOpen}
      onClose={onClose}
      modalProps={{isCentered: false}}
    >
      <DialogBasicHeader title='Transaction Settings' />
      <DialogBody pb={4}>
        <VStack align='stretch' spacing={2}>
          <SlippageOptions />

          <FormControl mt={4}>
            <Flex justify='space-between' align='center'>
              <FormLabel>
                <HStack align='center'>
                  <Text>Expert Mode</Text>
                  <QuestionHelper
                    text='Bypasses confirmation modals and allows high slippage trades. Use at your own risk.'
                    placement="top"
                    ml="4px"
                  />
                </HStack>
              </FormLabel>
              <Switch isChecked={expertMode} onChange={handleExpertModeToggle} />
            </Flex>
          </FormControl>
          <FormControl mt={4}>
            <Flex justify='space-between' align='center'>
              <FormLabel>
                <HStack align='center'>
                  <Text>Allow Multihops</Text>
                  <QuestionHelper
                    text={
                      <Flex flexDirection="column">
                        <Text mr="5px">
                          Multihops enables token swaps through multiple hops between several pools to achieve the best deal.
                        </Text>
                        <Text mr="5px" mt="1em">
                          Turning this off will only allow direct swap, which may cause higher slippage or even fund loss.
                        </Text>
                      </Flex>
                    }
                    placement="top"
                    ml="4px"
                  />
                </HStack>
              </FormLabel>
              <Switch
                isChecked={singleHopOnly}
                onChange={() => {
                  setSingleHopOnly((s) => !s)
                }}
              />
            </Flex>
          </FormControl>
        </VStack>
      </DialogBody>
    </DialogComponent>
  )
}

const suggestedSlippageValues = [10, 50, 100];
enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
const THREE_DAYS_IN_SECONDS = 60 * 60 * 24 * 3

function SlippageOptions() {
  const user = useUser();
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippage();
  const [ttl, setTTL] = useUserTransactionTTL();
  const [slippageInput, setSlippageInput] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid =
    deadlineInput === '' || (ttl !== undefined && (Number(ttl) / 60).toString() === deadlineInput)

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  const handleSlippageChange = (value: number) => {
    setSlippageInput('');
    setUserSlippageTolerance(value);
  }

  const handleCustomSlippageChange = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleCustomDeadlineChange = (value: string) => {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 60 && valueAsInt < THREE_DAYS_IN_SECONDS) {
        setTTL(valueAsInt)
      } else {
        deadlineError = DeadlineError.InvalidInput
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <VStack align='stretch'>
      <HStack mb={3} align='center'>
        <Text fontWeight='bold'>Slippage Tolerance</Text>
        <QuestionHelper
          text='Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.'
          placement="top"
          ml="4px"
        />
      </HStack>
      <SimpleGrid columns={4} spacing={{base: 2, sm: 4}}>
        {suggestedSlippageValues.map((value) => (
          <Button
            key={value}
            isActive={value === userSlippageTolerance}
            onClick={() => handleSlippageChange(value)}
            rounded='3px'
            variant='tab'
            size={{base: 'sm', sm: 'md'}}
            color={value === userSlippageTolerance ? 'white' : getTheme(user.theme).colors.textColor3}
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
              inputMode='decimal'
              pattern='^[0-9]*[.,]?[0-9]{0,2}$'
              value={slippageInput}
              borderColor={!slippageInputIsValid ? (slippageError === SlippageError.InvalidInput ? 'red.600' : 'orange.600') : 'inherit'}
              onBlur={() => {
                handleCustomSlippageChange((userSlippageTolerance / 100).toFixed(2))
              }}
              onChange={(event) => {
                if (event.currentTarget.validity.valid) {
                  handleCustomSlippageChange(event.target.value.replace(/,/g, '.'))
                }
              }}
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

      <FormControl mt={4}>
        <Flex justify='space-between' align='center'>
          <FormLabel>
            <HStack align='center'>
              <Text>Tx deadline (mins)</Text>
              <QuestionHelper
                text='Your transaction will revert if it is left confirming for longer than this time.'
                placement="top"
                ml="4px"
              />
            </HStack>
          </FormLabel>
          <Input
            scale='sm'
            maxW='80px'
            type='number'
            pattern='^[0-9]+$'
            borderColor={!!deadlineError ? 'orange.600' : undefined}
            placeholder={(Number(ttl) / 60).toString()}
            value={deadlineInput}
            onChange={(event) => {
              if (event.currentTarget.validity.valid) {
                handleCustomDeadlineChange(event.target.value)
              }
            }}
          />
        </Flex>
      </FormControl>
    </VStack>
  )
}