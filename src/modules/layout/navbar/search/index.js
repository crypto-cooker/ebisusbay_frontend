import {
  Box, Center,
  Flex,
  Input, InputGroup, InputLeftElement,
  Spinner,
  Text, useColorMode, useDisclosure, useOutsideClick,
  VStack
} from "@chakra-ui/react";
import React, {useCallback, useState} from "react";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {useQuery} from "@tanstack/react-query";
import {search} from "@src/core/api/next/search";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {ImageKitService} from "@src/helpers/image";
import {commify} from "ethers/lib/utils";
import {caseInsensitiveCompare, pluralize, round} from "@src/utils";
import {useRouter} from "next/router";
import {SearchIcon} from "@chakra-ui/icons";
import useDebounce from "@src/core/hooks/useDebounce";
import {appConfig} from "@src/Config";
import ResultCollection from "@src/modules/layout/navbar/search/row";

const searchRegex = /^\w+([\s-_]\w+)*$/;
const minChars = 3;
const maxVisible = 5;

// @todo remove for autolistings
const knownContracts = appConfig('collections');

const Search = () => {
  const router = useRouter();
  const headingColor = useColorModeValue('black', 'gray.300');
  const searchIconColor = useColorModeValue('white', 'gray.300');
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.100', 'gray.800');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');
  const inputBorderColorFocused = useColorModeValue('gray.100', 'blue.500');
  const inputVariant = useColorModeValue('flushed', 'outline');
  const { colorMode, setColorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = React.useState('');
  const ref = React.useRef();
  useOutsideClick({
    ref: ref,
    handler: onClose,
  });
  const debouncedSearch = useDebounce(value, 500);

  const { data, status, error, refetch } = useQuery(
    ['Search', debouncedSearch],
    () => search(debouncedSearch),
    {
      enabled: !!debouncedSearch && debouncedSearch.length >= minChars,
      refetchOnWindowFocus: false,
      select: (d) => {
        // console.log(d);
        return d.data.collections
          .filter((collection) =>{
            let validTokenCount = true;
            // if (collection.tokens) {
            //   validTokenCount = collection.tokens.filter((t) => Object.keys(t).length > 1).length > 0;
            // }
            return knownContracts.find((c) => caseInsensitiveCompare(c.address, collection.address)) && validTokenCount;
          })
      }
    }
  );

  const handleChange = (event) => {
    const { value } = event.target;
    // if (!searchRegex.test(value)) return;

    setValue(value);
    if (value.length >= minChars && !isOpen) {
      onOpen();
    }
    if (value.length < minChars && isOpen) {
      onClose();
    }
  };

  const handleFocus = () => {
    if (value && !isOpen) onOpen();
  };

  const handleCollectionClick = useCallback((collection) => {
    onClose();
    setValue('');
    router.push(`/collection/${collection.address}`);
  }, [onClose, router, setValue]);

  // console.log('DATA', data);

  return (
    <Box position="relative" maxW="500px" ref={ref}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color={searchIconColor} />}
        />
        <Input
          placeholder="Search collections"
          w="100%"
          onChange={handleChange}
          onFocus={handleFocus}
          value={value}
          borderColor={inputBorderColor}
          focusBorderColor={inputBorderColorFocused}
          color="white"
          _placeholder={{ color: 'gray.300' }}
          variant={inputVariant}
        />
      </InputGroup>
      <Box
        position="absolute"
        bg={bgColor}
        w="100%"
        mt={1}
        rounded="md"
        px={2}
        py={4}
        display={isOpen ? 'block' : 'none'}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="dark-lg"
      >
        <Box fontSize="12px">
          {status === "loading" ? (
            <Center>
              <Spinner />
            </Center>
          ) : status === "error" ? (
            <Center>
              <Text>Error: {error.message}</Text>
            </Center>
          ) : (
            <>
              {data?.length > 0 ? (
                <>
                  <Text textTransform="uppercase" color={headingColor}>Collections</Text>
                  <VStack>
                    {data.slice(0, 5).map((item) => (
                      <ResultCollection
                        collection={item}
                        floorPrice={item.stats.total.floorPrice}
                        onClick={handleCollectionClick}
                      />
                    ))}
                  </VStack>
                  {/*<Box mt={1}>*/}
                  {/*  <Text className="text-muted">Press Enter to search all items</Text>*/}
                  {/*</Box>*/}
                </>
              ) : (
                <Center>
                  <Text>No results found</Text>
                </Center>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
};

export default Search;