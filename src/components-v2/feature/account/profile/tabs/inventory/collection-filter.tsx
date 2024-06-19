import React, {useEffect, useState} from "react";
import {ciEquals, debounce} from "@market/helpers/utils";
import Blockies from "react-blockies";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  HStack,
  Input,
  VStack
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";

interface CollectionFilterProps {
  collections: any;
  filteredAddresses: any;
  onFilter: (collections: any) => void;
  keyPrefix?: string | null;
  showBalance?: boolean;
}

export const CollectionFilter = ({collections, filteredAddresses, onFilter, keyPrefix = null, showBalance = true}: CollectionFilterProps) => {
  const [visibleCollections, setVisibleCollections] = useState(collections);

  const handleCheck = (event: any, collection: any) => {
    const { id, checked } = event.target;

    if (!collection) return;
    let tmpSelectedCollections = collections.filter((c: any) => filteredAddresses.includes(c.address));
    if (checked && !tmpSelectedCollections.map((c: any) => c.address).includes(collection.address)) {
      tmpSelectedCollections.push(collection);
    } else if (!checked) {
      tmpSelectedCollections = tmpSelectedCollections.filter((c: any) => !ciEquals(c.address, collection.address));
    }
    onFilter(tmpSelectedCollections);
  };

  const getKey = (collection: any) => {
    let key = collection.address;
    if (collection.id) {
      key += `-${collection.id}`
    }
    if (keyPrefix) {
      key = `${keyPrefix}-${key}`
    }
    return key;
  };

  const onTextFilterChange = debounce((event: any) => {
    const { value } = event.target;
    const list = value ? collections.filter((c: any) => c.name.toLowerCase().includes(value.toLowerCase())) : collections;
    setVisibleCollections(list);
  }, 300);

  useEffect(() => {
    setVisibleCollections(collections);
  }, [collections]);

  return (
    <AccordionItem border='none'>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left' fontWeight='bold' fontSize='lg'>
          Collections
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel maxH='350px' overflowY='scroll'>
        <Input type="text" placeholder="Filter" onChange={onTextFilterChange} mb={2} />
        <CheckboxGroup colorScheme='blue' value={filteredAddresses.map((address: any) => `collection-${address}`)}>
          <VStack align='start' w='full' spacing={2}>
            {visibleCollections.map((collection: any) => (
              <Flex key={getKey(collection)} w='full' justify='space-between'>
                <Checkbox
                  value={`collection-${collection.address}`}
                  onChange={(t) => handleCheck(t, collection)}
                >
                  <HStack>
                    <Box>
                      {collection.metadata?.avatar ? (
                        <img
                          src={ImageService.translate(collection.metadata.avatar).avatar()}
                          alt={collection?.name}
                          width="25"
                          height="25"
                          className="rounded-circle my-auto"
                        />
                      ) : (
                        <Blockies seed={collection.address.toLowerCase()} size={5} scale={5} />
                      )}
                    </Box>
                    <Box ms={2}>{collection.name}</Box>
                  </HStack>
                </Checkbox>
                {showBalance && (
                  <Box className="text-muted">({collection.balance})</Box>
                )}
              </Flex>
            ))}
          </VStack>
        </CheckboxGroup>
      </AccordionPanel>
    </AccordionItem>
  )
}