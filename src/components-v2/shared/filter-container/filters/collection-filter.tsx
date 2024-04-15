import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import {caseInsensitiveCompare} from "@market/helpers/utils";
import Blockies from "react-blockies";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  CheckboxGroup,
  CloseButton,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import useDebounce from "@src/core/hooks/useDebounce";
import {TableVirtuoso} from "react-virtuoso";

interface Collection {
  avatar: string,
  name: string,
  address: string,
  count?: number | string
}

interface CollectionFilterProps {
  collections: Collection[];
  filteredAddresses: string[];
  onFilter: (collections: Collection[]) => void;
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
      tmpSelectedCollections = tmpSelectedCollections.filter((c: any) => !caseInsensitiveCompare(c.address, collection.address));
    }
    onFilter(tmpSelectedCollections);
  };

  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  useEffect(() => {
    setVisibleCollections(collections);
  }, [collections]);

  useEffect(() => {
    const list = debouncedSearch ? collections.filter((c: any) => c.name.toLowerCase().includes(debouncedSearch.toLowerCase())) : collections;
    setVisibleCollections(list);
  }, [debouncedSearch]);

  return (
    <AccordionItem border='none'>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left' fontWeight='bold' fontSize='lg'>
          Collections
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <InputGroup flex='1' mb={2}>
          <Input
            placeholder="Search by name"
            onChange={handleSearch}
            value={searchTerm}
            color="white"
            _placeholder={{ color: 'gray.300' }}
          />
          {searchTerm.length && (
            <InputRightElement
              children={<CloseButton onClick={handleClearSearch} />}
            />
          )}
        </InputGroup>
        <CheckboxGroup colorScheme='blue' value={filteredAddresses.map((address: any) => `collection-${address}`)}>
          <TableVirtuoso
            style={{ height: Math.min(visibleCollections.length * 33, 200), width: '100%' }}
            data={visibleCollections.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)}
            itemContent={(_, collection: Collection) => (
              <Flex pe={1} key={collection.address} w='full' justify='space-between' my={1}>
                <Checkbox
                  value={`collection-${collection.address}`}
                  onChange={(t) => handleCheck(t, collection)}
                >
                  <HStack>
                    <Box>
                      {collection.avatar ? (
                        <img
                          src={ImageService.translate(collection.avatar).avatar()}
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
                  <Box className="text-muted">({collection.count})</Box>
                )}
              </Flex>
            )}
          />
          {/*<VStack align='start' w='full' spacing={2}>*/}
          {/*  {visibleCollections.map((collection) => (*/}
          {/*    <Flex key={collection.address} w='full' justify='space-between'>*/}
          {/*      <Checkbox*/}
          {/*        value={`collection-${collection.address}`}*/}
          {/*        onChange={(t) => handleCheck(t, collection)}*/}
          {/*      >*/}
          {/*        <HStack>*/}
          {/*          <Box>*/}
          {/*            {collection.avatar ? (*/}
          {/*              <img*/}
          {/*                src={ImageService.translate(collection.avatar).avatar()}*/}
          {/*                alt={collection?.name}*/}
          {/*                width="25"*/}
          {/*                height="25"*/}
          {/*                className="rounded-circle my-auto"*/}
          {/*              />*/}
          {/*            ) : (*/}
          {/*              <Blockies seed={collection.address.toLowerCase()} size={5} scale={5} />*/}
          {/*            )}*/}
          {/*          </Box>*/}
          {/*          <Box ms={2}>{collection.name}</Box>*/}
          {/*        </HStack>*/}
          {/*      </Checkbox>*/}
          {/*      {showBalance && (*/}
          {/*        <Box className="text-muted">({collection.count})</Box>*/}
          {/*      )}*/}
          {/*    </Flex>*/}
          {/*  ))}*/}
          {/*</VStack>*/}
        </CheckboxGroup>
      </AccordionPanel>
    </AccordionItem>
  )
}