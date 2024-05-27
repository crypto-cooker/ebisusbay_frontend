import {ModalDialog} from "@src/components-v2/foundation/modal";
import {
  Box,
  Button,
  ButtonGroup,
  ButtonProps,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  InputGroup,
  ModalBody,
  NumberInput,
  NumberInputField
} from "@chakra-ui/react";
import {DerivedFarm} from "@dex/farms/constants/types";
import React, {useEffect, useState} from "react";
import {useUser} from "@src/components-v2/useUser";
import {UserFarmState} from "@dex/farms/state/user";
import {getTheme} from "@src/global/theme/theme";
import {Card} from "@src/components-v2/foundation/card";
import {commify} from "ethers/lib/utils";

enum EditableFields {
  USD = 'USD',
  LP = 'LP',
  ROI = 'ROI'
}

enum TimeInterval {
  ONE_DAY = 1,
  SEVEN_DAYS = 7,
  FOURTEEN_DAYS = 14,
  THIRTY_DAYS = 30,
  ONE_YEAR = 365,
  FIVE_YEARS = 1825
}

export interface RoiCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  farm: DerivedFarm;
  userData?: UserFarmState;
}

export default function RoiCalculator({isOpen, onClose, farm, userData}: RoiCalculatorProps) {
  const user = useUser();
  const [selectedStakeLength, setSelectedStakeLength] = useState<TimeInterval>(TimeInterval.ONE_DAY);
  const [selectedCompound, setSelectedCompound] = useState<TimeInterval>(TimeInterval.ONE_DAY);

  const [primaryField, setPrimaryField] = useState<EditableFields>(EditableFields.USD);
  const [usdValue, setUsdValue] = useState<string>('');
  const [lpValue, setLpValue] = useState<string>('');
  const [roi, setRoi] = useState<string>('');
  const [roiInUsd, setRoiInUsd] = useState<string>('');

  const handleValueChange = (valueString: string) => {
    if (primaryField === EditableFields.USD) {
      setUsdValue(valueString);
    } else if (primaryField === EditableFields.LP) {
      setLpValue(valueString);
    }
  }

  useEffect(() => {
    if (primaryField === EditableFields.USD) {
      setRoi('123')
    } else if (primaryField === EditableFields.LP) {
      setRoi('456');
    } else if (primaryField === EditableFields.ROI) {
      setUsdValue('101');
      setLpValue('202');
    }
  }, [primaryField, selectedStakeLength, selectedCompound, usdValue, lpValue, roi])

  useEffect(() => {
    setRoiInUsd('1000')
  }, [roi]);

  return (
    <>
      <ModalDialog isOpen={isOpen} onClose={onClose} title='ROI Calculator'>
        <ModalBody>
          <FormControl mt={4}>
            <FormLabel>
              <Flex justify='space-between' alignItems='center'>
                <Box>{farm.data.pair.name} Staked</Box>
                <ButtonGroup size='xs' isAttached variant='outline'>
                  <Button
                    isActive={primaryField === EditableFields.USD}
                    onClick={() => setPrimaryField(EditableFields.USD)}
                    _active={{
                      bg: getTheme(user.theme).colors.textColor4,
                      color: 'light'
                    }}
                  >
                    USD
                  </Button>
                  <Button
                    isActive={primaryField === EditableFields.LP}
                    onClick={() => setPrimaryField(EditableFields.LP)}
                    _active={{
                      bg: getTheme(user.theme).colors.textColor4,
                      color: 'light'
                    }}
                  >
                    {farm.data.pair.name} LP
                  </Button>
                </ButtonGroup>
              </Flex>
            </FormLabel>
            <InputGroup>
              <NumberInput
                placeholder="Amount"
                value={primaryField === EditableFields.USD ? usdValue : lpValue}
                min={0}
                max={1000000000}
                step={1}
                onChange={(valueString) => handleValueChange(valueString)}
                w='full'
              >
                <NumberInputField />
              </NumberInput>
            </InputGroup>
            <FormHelperText fontSize='sm'>~ 0.00</FormHelperText>
            <FormErrorMessage fontSize='sm'>Error</FormErrorMessage>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>
              <Box>Staked For</Box>
            </FormLabel>
            <ButtonGroup isAttached variant='outline' w='full'>
              <SwitchButton title='1D' isActive={selectedStakeLength === TimeInterval.ONE_DAY} onClick={() => setSelectedStakeLength(TimeInterval.ONE_DAY)} />
              <SwitchButton title='7D' isActive={selectedStakeLength === TimeInterval.SEVEN_DAYS} onClick={() => setSelectedStakeLength(TimeInterval.SEVEN_DAYS)} />
              <SwitchButton title='30D' isActive={selectedStakeLength === TimeInterval.THIRTY_DAYS} onClick={() => setSelectedStakeLength(TimeInterval.THIRTY_DAYS)} />
              <SwitchButton title='1Y' isActive={selectedStakeLength === TimeInterval.ONE_YEAR} onClick={() => setSelectedStakeLength(TimeInterval.ONE_YEAR)} />
              <SwitchButton title='5Y' isActive={selectedStakeLength === TimeInterval.FIVE_YEARS} onClick={() => setSelectedStakeLength(TimeInterval.FIVE_YEARS)} />
            </ButtonGroup>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>
              <Box>Compounding Every</Box>
            </FormLabel>
            <HStack spacing={4}>
              <Checkbox defaultChecked size='lg'/>
              <ButtonGroup isAttached variant='outline' w='full'>
                <SwitchButton title='1D' isActive={selectedCompound === TimeInterval.ONE_DAY} onClick={() => setSelectedCompound(TimeInterval.ONE_DAY)} />
                <SwitchButton title='7D' isActive={selectedCompound === TimeInterval.SEVEN_DAYS} onClick={() => setSelectedCompound(TimeInterval.SEVEN_DAYS)} />
                <SwitchButton title='14D' isActive={selectedCompound === TimeInterval.FOURTEEN_DAYS} onClick={() => setSelectedCompound(TimeInterval.FOURTEEN_DAYS)} />
                <SwitchButton title='30D' isActive={selectedCompound === TimeInterval.THIRTY_DAYS} onClick={() => setSelectedCompound(TimeInterval.THIRTY_DAYS)} />
              </ButtonGroup>
            </HStack>
          </FormControl>

          <Card mt={4}>
            <Box fontSize='sm' fontWeight='bold' mb={2}>ROI AT CURRENT RATES</Box>
            <Box fontSize='xl' fontWeight='bold'>${commify(roi ?? 0)}</Box>
            <Box fontSize='sm' className='muted'>{commify(roiInUsd)} FRTN</Box>
          </Card>
        </ModalBody>
      </ModalDialog>
    </>
  )
}

interface SwitchButtonProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}
function SwitchButton({title, isActive, onClick, ...props}: SwitchButtonProps & ButtonProps) {
  const user = useUser();
  return (
    <Button
      aria-label={title}
      isActive={isActive}
      _active={{
        bg: getTheme(user.theme).colors.textColor4,
        color: 'white'
      }}
      onClick={onClick}
      flex={1}
      {...props}
    >
      {title}
    </Button>
  )
}