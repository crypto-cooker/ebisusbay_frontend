import React from "react";
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
  const handleCheck = (event: any, item: CheckboxItem) => {
    const { id, checked } = event.target;
    onCheck(item, !!checked)
  };

  return (
    <AccordionItem border='none'>
      <h2>
        <AccordionButton>
          <Box as="span" flex='1' textAlign='left' fontWeight='bold'>
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel p={4}>
        <CheckboxGroup colorScheme='blue' value={items.filter(i => i.isChecked).map(i => i.key)}>
          {items.map((item) => (
            <Box key={item.key}>
              <Checkbox
                value={item.key}
                onChange={(t) => handleCheck(t, item)}
              >
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