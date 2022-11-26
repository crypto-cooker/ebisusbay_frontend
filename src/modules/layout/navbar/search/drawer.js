import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import React, {useCallback, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useSelector} from "react-redux";
import {useQuery} from "@tanstack/react-query";
import {search} from "@src/core/api/next/search";
import {caseInsensitiveCompare} from "@src/utils";
import useDebounce from "@src/core/hooks/useDebounce";
import {CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {appConfig} from "@src/Config";
import {useRouter} from "next/router";
import {useColorModeValue} from "@chakra-ui/color-mode";
import ResultCollection from "@src/modules/layout/navbar/search/row";
import {addToSearchVisitsInStorage, getSearchVisitsInStorage, removeSearchVisitFromStorage} from "@src/helpers/storage";

const minChars = 3;

// @todo remove for autolistings
const knownContracts = appConfig('collections');

const MobileSearchDrawer = () => {
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [value, setValue] = React.useState('');
  const searchIconColor = useColorModeValue('black', 'gray.300');
  const headingColor = useColorModeValue('black', 'gray.300');
  const [searchVisits, setSearchVisits] = useState([]);
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
    setValue(value);
  };

  const handleClear = () => {
    setValue('');
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
  }, [value]);

  return (
    <>
      <div className="de-menu-notification" onClick={onOpen}>
        <span>
          <FontAwesomeIcon icon={faSearch} color={user.theme === 'dark' ? '#000' : '#000'} />
        </span>
      </div>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            Search Ebisu's Bay
            <InputGroup mt={2}>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color={searchIconColor} />}
              />
              <Input
                placeholder="Search collections"
                w="100%"
                onChange={handleChange}
                value={value}
              />
              {value.length && (
                <InputRightElement
                  children={
                    <IconButton
                      variant="unstyled"
                      icon={<CloseIcon w={3} h={3} />}
                      aria-label="Close search"
                      onClick={handleClear}
                    />
                  }
                />
              )}
            </InputGroup>
          </DrawerHeader>

          <DrawerBody>
            {searchVisits.length > 0 && (
              <Box mb={2} fontSize="12px">
                <Text textTransform="uppercase" ms={1} color={headingColor}>Recent</Text>
                <VStack>
                  {searchVisits.slice(0, 5).map((item) => (
                    <ResultCollection
                      collection={item}
                      onClick={handleCollectionClick}
                      useCloseButton={true}
                      onRemove={handleRemoveVisit}
                    />
                  ))}
                </VStack>
              </Box>
            )}
            {value.length >= minChars && (
              <Box fontSize="12px">
                {status === "loading" ? (
                  <Center>
                    <Spinner />
                  </Center>
                ) : status === "error" ? (
                  <Center>
                    <Text>Error: {error.message}</Text>
                  </Center>
                ) : value.length >= minChars && (
                  <>
                    {data?.length > 0 ? (
                      <>
                        <Text textTransform="uppercase" color={headingColor}>Collections</Text>
                        <VStack>
                          {data.slice(0, 50).map((collection) => (
                            <ResultCollection
                              collection={collection}
                              floorPrice={collection.stats.total.floorPrice}
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
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
};

export default MobileSearchDrawer;