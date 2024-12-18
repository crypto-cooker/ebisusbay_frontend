import React, {useCallback, useEffect, useState} from "react";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Text
} from "@chakra-ui/react";
import {humanizeAdvanced, stripSpaces} from "@market/helpers/utils";
import {FilteredItem} from "@src/components-v2/shared/filter-container";
import {TableVirtuoso} from "react-virtuoso";

type AttributeFilterProps = {
  attributes: { [key: string]: { [key: string]: any } };
  currentFilters?: { [key: string]: string[] };
  onChange: (filters: { [key: string]: string[] }, filteredItems: FilteredItem[]) => void;
}
const AttributeFilter = ({attributes, currentFilters, onChange}: AttributeFilterProps) => {
  const [filters, setFilters] = useState(currentFilters);

  const handleFilter = useCallback(async (e: any, group: string, attribute: string) => {
    let metadataFilters = filters ?? {};
    if (e.target.checked) {
      metadataFilters[group] = metadataFilters[group] ? [...metadataFilters[group], attribute] : [attribute];
    } else {
      metadataFilters[group] = metadataFilters[group].filter(attr => attr !== attribute);
      if (metadataFilters[group].length === 0) {
        delete metadataFilters[group];
      }
    }

    const transformedArray = Object.entries(metadataFilters).flatMap(
      ([category, values]) =>
        values.map(value => ({
          key: `trait-${category}-${value}`,
          label: `${category}: ${value}`
        }))
    );

    setFilters(metadataFilters);
    onChange(metadataFilters, transformedArray);
  }, [onChange, filters, currentFilters]);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  return (
    <>
      {Object.entries(attributes)
      .sort((a, b) => a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1)
      .map((group: any, groupKey: any) => (
        <AccordionItem key={`${group[0]}-${groupKey}`} border='none'>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left' fontWeight='bold' fontSize='lg'>
              {humanizeAdvanced(group[0])}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <CheckboxGroup
              colorScheme='blue'
              value={filters?.[group[0]] ? filters[group[0]].map((value) => stripSpaces(`trait-${group[0]}-${value}`)) : []}
            >
              <TableVirtuoso
                style={{ height: Math.min(Object.entries(group[1]).length * 24, 200), width: '100%' }}
                data={Object.entries(group[1]).sort((a, b) => a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1)}
                components={{
                  Table: (props) => (
                    <table {...props} style={{ width: '100%'}} />
                  )
                }}
                itemContent={(index, item: [string, any]) => (
                  <Flex w='100%' pe={1} key={stripSpaces(`trait-${group[0]}-${item[0]}`)} justify='space-between'>
                    <Checkbox
                      value={stripSpaces(`trait-${group[0]}-${item[0]}`)}
                      onChange={(e) => handleFilter(e, group[0], item[0])}
                    >
                      {humanizeAdvanced(item[0])}
                    </Checkbox>
                    <Text color='gray.500'>({item[1].count})</Text>
                  </Flex>
                )}
              />
            </CheckboxGroup>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </>
  )
}

function extractInnerKeys(obj: Record<string, Record<string, any>>): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const [outerKey, innerObj] of Object.entries(obj)) {
    result[outerKey] = Object.keys(innerObj);
  }

  return result;
}

export default AttributeFilter;