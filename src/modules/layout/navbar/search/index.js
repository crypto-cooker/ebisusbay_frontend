import {
  Box, Center,
  Flex,
  Input, InputGroup, InputLeftElement,
  Spinner,
  Text, useDisclosure, useOutsideClick,
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

const searchRegex = /^\w+([\s-_]\w+)*$/;
const minChars = 3;

// @todo remove for autolistings
const knownContracts = appConfig('collections');

const Search = () => {
  const router = useRouter();
  const headingColor = useColorModeValue('black', 'gray.300');
  const searchIconColor = useColorModeValue('white', 'gray.300');
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.100', 'gray.800');

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
                      item.multiToken && item.tokens ? (
                        <ResultCollection
                          collection={item}
                          floorPrice={item.stats.total.floorPrice}
                          onClick={handleCollectionClick}
                        />
                      ) : (
                        <ResultCollection
                          collection={item}
                          floorPrice={item.stats.total.floorPrice}
                          onClick={handleCollectionClick}
                        />
                      )
                    ))}
                  </VStack>
                  <Box mt={1}>
                    <Text className="text-muted">Press Enter to search all items</Text>
                  </Box>
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

const ResultCollection = ({collection, floorPrice, onClick}) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const handleClick = useCallback(() => {
    onClick(collection);
  }, [onClick, collection]);

  return (
    <Box
      key={`${collection.address}`}
      _hover={{background: hoverBackground}}
      p={2}
      rounded="lg"
      w="100%"
      fontSize="12px"
      cursor="pointer"
      onClick={handleClick}
    >
      <Flex>
        <Box
          width={50}
          height={50}
          style={{borderRadius: '20px'}}
        >
          {collection.metadata && (
            <AnyMedia
              image={ImageKitService.buildAvatarUrl(collection.metadata.avatar)}
              title={collection.name}
              usePlaceholder={false}
              className="img-rounded-8"
            />
          )}
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Text fontWeight="bold" noOfLines={1}>{collection.name}</Text>
            {collection.totalSupply && (
              <Text noOfLines={1} className="text-muted">{commify(collection.totalSupply)} {pluralize(collection.totalSupply, 'item')}</Text>
            )}
          </VStack>
        </Box>
        {floorPrice && (
          <Box ms={2} my="auto" className="text-muted">
            {commify(round(floorPrice))} CRO
          </Box>
        )}
      </Flex>
    </Box>
  )
}