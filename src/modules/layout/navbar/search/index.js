import {
  Box, Button,
  Center, CloseButton,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
  useColorMode,
  useDisclosure,
  useOutsideClick,
  VStack
} from "@chakra-ui/react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {useQuery} from "@tanstack/react-query";
import {search} from "@src/core/api/next/search";
import {caseInsensitiveCompare} from "@src/utils";
import {useRouter} from "next/router";
import {ChevronDownIcon, CloseIcon, SearchIcon} from "@chakra-ui/icons";
import useDebounce from "@src/core/hooks/useDebounce";
import {appConfig} from "@src/Config";
import ResultCollection from "@src/modules/layout/navbar/search/row";
import Scrollbars from "react-custom-scrollbars-2";
import {addToSearchVisitsInStorage, getSearchVisitsInStorage, removeSearchVisitFromStorage} from "@src/helpers/storage";

const searchRegex = /^\w+([\s-_]\w+)*$/;
const minChars = 3;
const defaultMaxVisible = 5;
const maxVisible = 25;

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

  const [maxResults, setMaxResults] = useState(defaultMaxVisible);
  const [searchVisits, setSearchVisits] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState('');
  const ref = useRef();
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
        return d.data.collections
          .filter((collection) =>{
            const knownContract = knownContracts.find((c) => caseInsensitiveCompare(c.address, collection.address));
            if (!knownContract) return false;
            return !knownContract.mergedWith;
          })
          .sort((a, b) => b.verification?.verified - a.verification?.verified)
      }
    }
  );
  const hasDisplayableContent = searchVisits.length > 0 || (data && data.length > 0);

  const handleChange = (event) => {
    const { value } = event.target;
    setValue(value);
  };

  const handleFocus = () => {
    const currentVisits = getRelevantVisits();
    setSearchVisits(currentVisits);

    if (hasDisplayableContent && !isOpen) onOpen();
  };

  const handleClear = () => {
    setValue('');
    setMaxResults(defaultMaxVisible);
    onClose();
  };

  const handleCollectionClick = useCallback((collection) => {
    addToSearchVisitsInStorage(collection);
    onClose();
    setValue('');
    router.push(`/collection/${collection.address}`);
  }, [onClose, router, setValue]);

  const handleRemoveVisit = (collection) => {
    removeSearchVisitFromStorage(collection.address);
    const remainingVisits = getRelevantVisits();
    setSearchVisits(remainingVisits);
    if (remainingVisits?.length < 1 && (!data || data.length < 1)) onClose();
  };

  const getRelevantVisits = () => {
    const visits = getSearchVisitsInStorage();

    if (value && value.length >= minChars) {
      return visits.filter((item) => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      });
    }

    return visits;
  };

  useEffect(() => {
    setSearchVisits(getRelevantVisits());

    if (value.length >= minChars && !isOpen) {
      onOpen();
    }
    if (value.length < minChars && isOpen && !hasDisplayableContent) {
      onClose();
    }
    if (value.length < 1) {
      setMaxResults(defaultMaxVisible);
    }
  }, [value]);

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
        {value.length && (
          <InputRightElement
            children={<CloseButton onClick={handleClear} />}
          />
        )}
      </InputGroup>
      <Box
        position="absolute"
        bg={bgColor}
        w="100%"
        mt={1}
        rounded="md"
        display={isOpen ? 'block' : 'none'}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="dark-lg"
      >
        <Scrollbars
          autoHeight
          autoHeightMax="calc(100vh - 74px)"
          universal
        >
          <Box fontSize="12px" p={2}>
            {searchVisits.length > 0 && (
              <Box mb={2}>
                <Text textTransform="uppercase" ms={1} color={headingColor}>Recent</Text>
                <VStack>
                  {searchVisits.slice(0, 5).map((item) => (
                    <ResultCollection
                      key={item.address}
                      collection={item}
                      onClick={handleCollectionClick}
                      useCloseButton={true}
                      onRemove={handleRemoveVisit}
                    />
                  ))}
                </VStack>
              </Box>
            )}
            <Box display={value?.length >= minChars ? 'inherit' : 'none'}>
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
                    <Box>
                      <Text textTransform="uppercase" ms={1} color={headingColor}>Collections</Text>
                      <VStack>
                        {data.slice(0, maxResults).map((item) => (
                          <ResultCollection
                            key={item.address}
                            collection={item}
                            floorPrice={item.stats.total.floorPrice}
                            onClick={handleCollectionClick}
                          />
                        ))}
                      </VStack>
                      {maxResults < maxVisible && maxResults < data.length && (
                        <Box mt={2} ms={1}>
                          <Button variant="link" onClick={() => setMaxResults(maxVisible)} rightIcon={<ChevronDownIcon />}>
                            View More
                          </Button>
                        </Box>
                      )}
                      {/*<Box mt={1}>*/}
                      {/*  <Text className="text-muted">Press Enter to search all items</Text>*/}
                      {/*</Box>*/}
                    </Box>
                  ) : (
                    <Center>
                      <Text>No results found</Text>
                    </Center>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Scrollbars>
      </Box>
    </Box>
  )
};

export default Search;