import {ChangeEvent, useEffect, useState} from "react";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box, Button,
  Input,
  SimpleGrid,
  Stack
} from "@chakra-ui/react";

type RangeFilterProps = {
  field: string;
  label: string;
  onChange: (field: string, min: number | undefined, max: number | undefined) => void;
  currentMin?: number;
  currentMax?: number;
}
const RangeFilter = ({field, label, onChange, currentMin, currentMax}: RangeFilterProps) => {
  const [min, setMin] = useState<string>(currentMin?.toString() ?? '');
  const [max, setMax] = useState<string>(currentMax?.toString() ?? '');

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => setMin(event.target.value)
  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => setMax(event.target.value)
  const handleApply = () => {
    const minVal = min === '' || isNaN(Number(min)) ? undefined : Number(min);
    const maxVal = max === '' || isNaN(Number(max)) ? undefined : Number(max);
    onChange(field, minVal, maxVal);
  };

  useEffect(() => {
    setMin(currentMin?.toString() ?? '');
    setMax(currentMax?.toString() ?? '');
  }, [currentMin, currentMax]);

  return (
    <AccordionItem border='none'>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left' fontWeight='bold' fontSize='lg'>
          {label}
        </Box>
        <AccordionIcon/>
      </AccordionButton>
      <AccordionPanel px={4}>
        <Stack>
          <SimpleGrid columns={2} gap={2}>
            <Input placeholder={`Min ${label}`} type='number' onChange={handleMinChange} value={min} />
            <Input placeholder={`Max ${label}`} type='number' onChange={handleMaxChange} value={max} />
          </SimpleGrid>
          <Button onClick={handleApply}>
            Apply
          </Button>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  )
}

export default RangeFilter;