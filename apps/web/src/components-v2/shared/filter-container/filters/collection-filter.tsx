import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ciEquals } from '@market/helpers/utils';
import Blockies from 'react-blockies';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Checkbox,
  CheckboxGroup,
  CloseButton,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react';
import ImageService from '@src/core/services/image';
import useDebounce from '@src/core/hooks/useDebounce';
import { TableVirtuoso } from 'react-virtuoso';
import { useCollections } from '@src/components-v2/feature/marketplace/use-collections';

export interface Collection {
  metadata?: Metadata;
  avatar: string;
  name: string;
  address: string;
  count?: number | string;
}

interface Metadata {
  avatar: string;
}

interface CollectionFilterProps {
  collections: Collection[];
  filteredAddresses: string[];
  onFilter: (collections: Collection[]) => void;
  keyPrefix?: string | null;
  showBalance?: boolean;
}

export const CollectionFilter = ({
  collections,
  filteredAddresses,
  onFilter,
  keyPrefix = null,
  showBalance = true,
}: CollectionFilterProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data, error, fetchNextPage, hasNextPage, status } = useCollections(debouncedSearch);

  const apiCollections = useMemo(() => data?.pages.map(({data}:any) => data).flat(),[data])

  const handleCheck = (event: any, collection: any) => {
    const { id, checked } = event.target;
    if(data == undefined) return;
    const collections = data?.pages.map(({data}:any) => data).flat();

    if (!collection) return;
    let tmpSelectedCollections = collections.filter((c: any) => filteredAddresses.includes(c.address));
    if (checked && !tmpSelectedCollections.map((c: any) => c.address).includes(collection.address)) {
      tmpSelectedCollections.push(collection);
    } else if (!checked) {
      tmpSelectedCollections = tmpSelectedCollections.filter((c: any) => !ciEquals(c.address, collection.address));
    }
    onFilter(tmpSelectedCollections);
  };

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return (
    <AccordionItem border="none">
      <AccordionButton>
        <Box as="span" flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
          Collections
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <InputGroup flex="1" mb={2}>
          <Input
            placeholder="Search by name"
            onChange={handleSearch}
            value={searchTerm}
            color="white"
            _placeholder={{ color: 'gray.300' }}
          />
          {searchTerm.length && <InputRightElement children={<CloseButton onClick={handleClearSearch} />} />}
        </InputGroup>
        <CheckboxGroup colorScheme="blue" value={filteredAddresses.map((address: any) => `collection-${address}`)}>
          <TableVirtuoso
            endReached={() => {
              fetchNextPage();
            }}
            style={{ height: Math.min((apiCollections?.length || 0) * 33, 200), width: '100%' }}
            data={apiCollections}
            itemContent={(_, collection: Collection) =>
              status === 'pending' ? (
                <Center>
                  <Spinner />
                </Center>
              ) : (
                <Flex key={collection.address} w="full" justify="space-between" my={1} pe={1}>
                  <Checkbox value={`collection-${collection.address}`} onChange={(t) => handleCheck(t, collection)}>
                    <HStack>
                      <Box>
                        {collection.metadata?.avatar ? (
                          <img
                            src={ImageService.translate(collection.metadata.avatar).avatar()}
                            alt={collection.name}
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
                  {showBalance && <Box className="text-muted">({collection.count})</Box>}
                </Flex>
              )
            }
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
  );
};
