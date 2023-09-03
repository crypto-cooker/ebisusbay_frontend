import React, {useCallback, useEffect, useState} from "react";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox, CheckboxGroup,
  Flex,
  Text
} from "@chakra-ui/react";
import {stripSpaces} from "@src/utils";
import {FilteredItem} from "@src/components-v2/shared/filter-container";

type AttributeFilterProps = {
  attributes: { [key: string]: { [key: string]: any } };
  currentFilters?: { [key: string]: string[] };
  onChange: (filters: { [key: string]: string[] }, filteredItems: FilteredItem[]) => void;
}
const AttributeFilter = ({attributes, currentFilters, onChange}: AttributeFilterProps) => {
  console.log('ATTRIBVUTES', attributes, currentFilters);
  // const groupedAttributes = attributes ? Object.entries(groupByKey(attributes, (i) => i.trait_type!)) : [];
  const [filters, setFilters] = useState<any>(currentFilters);

  const handleFilter = useCallback(async (e: any, group: string, attribute: string) => {
    console.log('handleFilter1', filters, currentFilters, group, attribute, e.target.checked);

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

    console.log('handleFilter2', metadataFilters, transformedArray);
    setFilters(metadataFilters);
    onChange(metadataFilters, transformedArray);
  }, [onChange, filters, currentFilters]);

  // useEffect(() => {
  //   console.log('handleFilter-setting-new', currentFilters);
  //   setFilters(currentFilters);
  // }, [currentFilters]);

  return (
    <>
      {Object.entries(attributes)
      .sort((a, b) => a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1)
      .map((group: any, groupKey: any) => (
        <AccordionItem key={`${group[0]}-${groupKey}`} border='none'>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left' fontWeight='bold' fontSize='lg'>
              {group[0]}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <CheckboxGroup colorScheme='blue' value={filters?.[group[0]] ? filters[group[0]].map((value) => stripSpaces(`trait-${group[0]}-${value}`)) : []}>
              {Object.entries(group[1])
                .sort((a, b) => a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1)
                .map((item: any, itemKey: any) => (
                  <Flex w='full' pe={1} key={stripSpaces(`trait-${group[0]}-${item[0]}`)} justify='space-between'>
                    <Checkbox
                      value={stripSpaces(`trait-${group[0]}-${item[0]}`)}
                      onChange={(e) => handleFilter(e, group[0], item[0])}
                    >
                      {item[0]}
                    </Checkbox>
                    <Text color='gray.500'>({item[1].count})</Text>
                  </Flex>
              ))}
            </CheckboxGroup>
            {/*<TableVirtuoso*/}
            {/*  style={{ height: 200 }}*/}
            {/*  totalCount={group[1].length}*/}
            {/*  itemContent={(index) => {*/}
            {/*    const item = group[1].sort((a: any, b: any) => a.value > b.value ? 1 : -1)[index]*/}
            {/*    let checked = false;*/}
            {/*    if (!!filters.metadata) {*/}
            {/*      checked = filters.metadata.some(*/}
            {/*        (o) => o.trait_type === group[0] && o.value?.includes(item.value)*/}
            {/*      )*/}
            {/*    }*/}
            {/*    return (*/}
            {/*      <Flex w='full' pe={1} key={`${group[0]}-${item.value}`} justify='space-between'>*/}
            {/*        <Checkbox*/}
            {/*          onChange={(e) => handleFilter(item, e)}*/}
            {/*          isChecked={checked}*/}
            {/*        >*/}
            {/*          {item.value}*/}
            {/*        </Checkbox>*/}
            {/*        <Text color='gray.500'>({item.count})</Text>*/}
            {/*      </Flex>*/}
            {/*    )*/}
            {/*  }}*/}
            {/*/>*/}
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