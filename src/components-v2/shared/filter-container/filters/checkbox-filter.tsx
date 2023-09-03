import React, {useCallback} from "react";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  CheckboxGroup
} from "@chakra-ui/react";

export interface CheckboxItem {
  label: string;
  key: string;
  isChecked: boolean;
}

interface CheckboxFilterProps {
  title: string;
  items: CheckboxItem[];
  onCheck: (item: CheckboxItem, checked: boolean) => void;
}

const CheckboxFilter = ({title, items, onCheck}: CheckboxFilterProps) => {
  const handleCheck = useCallback((event: any, item: CheckboxItem) => {
    const { id, checked } = event.target;
    onCheck(item, !!checked)
  }, [items, onCheck]);

  return (
    <AccordionItem border='none'>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left' fontWeight='bold' fontSize='lg'>
          {title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel px={4}>
        <CheckboxGroup colorScheme='blue' value={items.filter(i => i.isChecked).map(i => i.key)}>
          {items.map((item) => (
            <Box key={item.key}>
              <Checkbox value={item.key} onChange={(t) => handleCheck(t, item)}>
                {item.label}
              </Checkbox>
            </Box>
          ))}
        </CheckboxGroup>
      </AccordionPanel>
    </AccordionItem>
  )
}

export default CheckboxFilter;