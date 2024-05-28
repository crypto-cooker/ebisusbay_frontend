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
import {ethers} from "ethers";

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
  const [usdValue, setUsdValue] = useState<string>('');
  const [lpValue, setLpValue] = useState<string>('');
  const [roiInFrtn, setRoiInFrtn] = useState<string>('');
  const [roiInUsd, setRoiInUsd] = useState<string>('');
  const [selectedTimeInterval, setSelectedTimeInterval] = useState<TimeInterval>(TimeInterval.ONE_DAY);
  const [compoundInterval, setCompoundInterval] = useState<TimeInterval>(TimeInterval.ONE_DAY);
  const [isCompounding, setIsCompounding] = useState<boolean>(false);
  const [primaryField, setPrimaryField] = useState<EditableFields>(EditableFields.USD);

  // Conversion Functions
  const usdToFrtn = (usd: string, frtnPerDayInUSD: number): ethers.BigNumber => {
    const usdBigNumber = ethers.utils.parseUnits(usd, 18);
    const frtnValue = usdBigNumber.mul(ethers.BigNumber.from(farm.data.frtnPerDay)).div(ethers.utils.parseUnits(frtnPerDayInUSD.toString(), 18));
    return frtnValue;
  };

  const lpToFrtn = (lp: string): ethers.BigNumber => {
    return ethers.BigNumber.from(lp).mul(ethers.BigNumber.from(farm.data.frtnPerLPPerDay));
  };

  const frtnToUsd = (frtn: ethers.BigNumber): string => {
    const usdValue = frtn.mul(ethers.utils.parseUnits(farm.data.frtnPerDayInUSD.toString(), 18)).div(ethers.BigNumber.from(farm.data.frtnPerDay));
    return ethers.utils.formatUnits(usdValue, 18);
  };

  const calculateRoi = (value: string, isUsd: boolean, timeInterval: TimeInterval, isCompounding: boolean) => {
    let frtnValue: ethers.BigNumber;
    if (isUsd) {
      frtnValue = usdToFrtn(value, farm.data.frtnPerDayInUSD);
    } else {
      frtnValue = lpToFrtn(value);
    }

    let totalFrtn: ethers.BigNumber;
    if (isCompounding) {
      const dailyRate = frtnValue.div(ethers.BigNumber.from(timeInterval));
      totalFrtn = frtnValue.mul(ethers.BigNumber.from((1 + dailyRate.toNumber()) ** timeInterval - 1));
    } else {
      totalFrtn = frtnValue.mul(ethers.BigNumber.from(timeInterval));
    }

    const totalUsd = frtnToUsd(totalFrtn);
    setRoiInFrtn(totalFrtn.toString());
    setRoiInUsd(totalUsd);
  };

  // Handle USD input change
  const handleUsdChange = (value: string) => {
    setUsdValue(value);
    if (value) {
      calculateRoi(value, true, selectedTimeInterval, isCompounding);
    } else {
      setRoiInFrtn('');
      setRoiInUsd('');
    }
  };

  // Handle LP input change
  const handleLpChange = (value: string) => {
    setLpValue(value);
    if (value) {
      calculateRoi(value, false, selectedTimeInterval, isCompounding);
    } else {
      setRoiInFrtn('');
      setRoiInUsd('');
    }
  };

  // Handle time interval change
  const handleTimeIntervalChange = (newInterval: TimeInterval) => {
    setSelectedTimeInterval(newInterval);
    if (primaryField === EditableFields.USD) {
      calculateRoi(usdValue, true, newInterval, isCompounding);
    } else if (primaryField === EditableFields.LP) {
      calculateRoi(lpValue, false, newInterval, isCompounding);
    } else {
      // Handle ROI as primary field
    }
  };

  // Handle compound interval change
  const handleCompoundIntervalChange = (newInterval: TimeInterval) => {
    setCompoundInterval(newInterval);
    if (primaryField === EditableFields.USD) {
      calculateRoi(usdValue, true, selectedTimeInterval, isCompounding);
    } else if (primaryField === EditableFields.LP) {
      calculateRoi(lpValue, false, selectedTimeInterval, isCompounding);
    } else {
      // Handle ROI as primary field
    }
  };

  // Handle compounding change
  const handleCompoundingChange = () => {
    const newCompounding = !isCompounding;
    setIsCompounding(newCompounding);
    if (primaryField === EditableFields.USD) {
      calculateRoi(usdValue, true, selectedTimeInterval, newCompounding);
    } else if (primaryField === EditableFields.LP) {
      calculateRoi(lpValue, false, selectedTimeInterval, newCompounding);
    } else {
      // Handle ROI as primary field
    }
  };

  // Handle primary field change
  const handlePrimaryFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newField = event.target.value as EditableFields;
    setPrimaryField(newField);
  };

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
              {primaryField === EditableFields.USD ? (
                <NumberInput
                  value={usdValue}
                  min={0}
                  max={1000000000}
                  step={1}
                  onChange={handleUsdChange}
                  w='full'
                >
                  <NumberInputField />
                </NumberInput>
              ) : (
                <NumberInput
                  value={lpValue}
                  min={0}
                  max={1000000000}
                  step={1}
                  onChange={handleLpChange}
                  w='full'
                >
                  <NumberInputField />
                </NumberInput>
              )}
            </InputGroup>
            <FormHelperText fontSize='sm'>~ 0.00</FormHelperText>
            <FormErrorMessage fontSize='sm'>Error</FormErrorMessage>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>
              <Box>Staked For</Box>
            </FormLabel>
            <ButtonGroup isAttached variant='outline' w='full'>
              <SwitchButton title='1D' isActive={selectedTimeInterval === TimeInterval.ONE_DAY} onClick={() => handleTimeIntervalChange(TimeInterval.ONE_DAY)} />
              <SwitchButton title='7D' isActive={selectedTimeInterval === TimeInterval.SEVEN_DAYS} onClick={() => handleTimeIntervalChange(TimeInterval.SEVEN_DAYS)} />
              <SwitchButton title='30D' isActive={selectedTimeInterval === TimeInterval.THIRTY_DAYS} onClick={() => handleTimeIntervalChange(TimeInterval.THIRTY_DAYS)} />
              <SwitchButton title='1Y' isActive={selectedTimeInterval === TimeInterval.ONE_YEAR} onClick={() => handleTimeIntervalChange(TimeInterval.ONE_YEAR)} />
              <SwitchButton title='5Y' isActive={selectedTimeInterval === TimeInterval.FIVE_YEARS} onClick={() => handleTimeIntervalChange(TimeInterval.FIVE_YEARS)} />
            </ButtonGroup>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>
              <Box>Compounding Every</Box>
            </FormLabel>
            <HStack spacing={4}>
              <Checkbox defaultChecked size='lg'/>
              <ButtonGroup isAttached variant='outline' w='full'>
                <SwitchButton title='1D' isActive={compoundInterval === TimeInterval.ONE_DAY} onClick={() => handleCompoundIntervalChange(TimeInterval.ONE_DAY)} />
                <SwitchButton title='7D' isActive={compoundInterval === TimeInterval.SEVEN_DAYS} onClick={() => handleCompoundIntervalChange(TimeInterval.SEVEN_DAYS)} />
                <SwitchButton title='14D' isActive={compoundInterval === TimeInterval.FOURTEEN_DAYS} onClick={() => handleCompoundIntervalChange(TimeInterval.FOURTEEN_DAYS)} />
                <SwitchButton title='30D' isActive={compoundInterval === TimeInterval.THIRTY_DAYS} onClick={() => handleCompoundIntervalChange(TimeInterval.THIRTY_DAYS)} />
              </ButtonGroup>
            </HStack>
          </FormControl>

          <Card mt={4}>
            <Box fontSize='sm' fontWeight='bold' mb={2}>ROI AT CURRENT RATES</Box>
            <Box fontSize='xl' fontWeight='bold'>${commify(roiInFrtn ?? 0)}</Box>
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