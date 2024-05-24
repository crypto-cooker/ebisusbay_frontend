import React from "react";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Radio,
  RadioGroup
} from '@chakra-ui/react';

export interface RadioItem {
  label: string;
  key: string;
  isSelected: boolean;
  icon?: string;
}

interface RadioFilterProps {
  title: string;
  items: RadioItem[];
  onSelect: (item: RadioItem) => void;
  defaultSelection?: string;
}

const RadioFilter = ({title, items, onSelect, defaultSelection}: RadioFilterProps) => {
  return (
    <AccordionItem border='none'>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left' fontWeight='bold' fontSize='lg'>
          {title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel px={4}>
        <RadioGroup
          colorScheme='blue'
          value={items.find(i => i.isSelected)?.key}
          onChange={(value) => onSelect(items.find(i => i.key === value)!)}
        >
          {items.map((item) => (
            <Box key={item.key}>
              <Radio value={item.key}>
                {!!item.icon ? (
                  <HStack my={1}>
                    <>{item.icon}</>
                    <Box ms={2}>{item.label}</Box>
                  </HStack>
                ) : (
                  <>{item.label}</>
                )}
              </Radio>
            </Box>
          ))}
        </RadioGroup>
      </AccordionPanel>
    </AccordionItem>
  )
}

export default RadioFilter;