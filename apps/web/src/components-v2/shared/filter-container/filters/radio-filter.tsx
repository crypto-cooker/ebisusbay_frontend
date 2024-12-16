import React, { ReactNode } from 'react';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Image,
  Radio,
  RadioGroup, VStack
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

export interface RadioItem {
  label: string;
  key: string;
  isSelected: boolean;
  icon?: string | ReactNode;
}

export interface CategorizedItems {
  categories: Array<{key: string, label: string, items: RadioItem[]}>;
}

interface RadioFilterProps {
  title: string;
  items: CategorizedItems | RadioItem[];
  onSelect: (item: RadioItem) => void;
  defaultSelection?: string;
}

const RadioFilter = ({title, items, onSelect, defaultSelection}: RadioFilterProps) => {
  const allItems = Array.isArray(items)
    ? items
    : items.categories.flatMap(category => category.items);

  const iconForItem = (icon?: string | ReactNode) => {
    if (!icon) return <QuestionOutlineIcon boxSize={6} />;
    if (typeof icon === 'string') {
      return <Image src={icon} alt={''} width={6} height={6} rounded='full' />
    }

    return icon;
  }

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
          value={allItems.find(i => i.isSelected)?.key}
          onChange={(value) => onSelect(allItems.find(i => i.key === value)!)}
        >
          {Array.isArray(items) ? (
            <>
              {items.map((item) => (
                <Box key={item.key}>
                  <Radio value={item.key}>
                    <HStack my={1}>
                      <>{iconForItem(item.icon)}</>
                      <Box ms={2}>{item.label}</Box>
                    </HStack>
                  </Radio>
                </Box>
              ))}
            </>
          ) : (
            <VStack align='stretch' spacing={4}>
              {items.categories.map((category) => (
                <Box key={category.key}>
                  <h5>{category.label}</h5>
                  {category.items.map((item) => (
                    <Box key={item.key}>
                      <Radio value={item.key}>
                        <HStack my={1}>
                          <>{iconForItem(item.icon)}</>
                          <Box ms={2}>{item.label}</Box>
                        </HStack>
                      </Radio>
                    </Box>
                  ))}
                </Box>
              ))}
            </VStack>
          )}
        </RadioGroup>
      </AccordionPanel>
    </AccordionItem>
  )
}

export default RadioFilter;