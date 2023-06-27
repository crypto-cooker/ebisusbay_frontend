import {
    Box,
    Button,
    Center,
    CloseButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Spinner,
    Text,
    useDisclosure,
    useOutsideClick,
    VStack
  } from "@chakra-ui/react";
  import React, {ChangeEvent, KeyboardEventHandler, RefObject, useCallback, useEffect, useState} from "react";
  import {useColorModeValue} from "@chakra-ui/color-mode";
  import {useQuery} from "@tanstack/react-query";
  import {search} from "@src/core/api/next/search";
  import {caseInsensitiveCompare} from "@src/utils";
  import {useRouter} from "next/router";
  import {ChevronDownIcon, SearchIcon} from "@chakra-ui/icons";
  import useDebounce from "@src/core/hooks/useDebounce";
  import {appConfig} from "@src/Config";
  import ResultFaction from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/factionRow";
  import Scrollbars from "react-custom-scrollbars-2";
  import {addToSearchVisitsInStorage, getSearchVisitsInStorage, removeSearchVisitFromStorage} from "@src/helpers/storage";
  
  const searchRegex = /^\w+([\s-_]\w+)*$/;
  const minChars = 3;
  const defaultMaxVisible = 5;
  const maxVisible = 25;
  
  // @todo remove for autolistings
  const knownContracts = appConfig('collections');

  interface SearchProps {
    handleSelectCollectionCallback: (address:string) => void;
    allFactions: any[];
  }
  
  const Search = ({handleSelectCollectionCallback, allFactions} : SearchProps) => {
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
    const ref: RefObject<HTMLDivElement> = React.useRef(null);
    useOutsideClick({
      ref: ref,
      handler: onClose,
    });
    const debouncedSearch = useDebounce(value, 500);
    const [cursor, setCursor] = useState(-1);
    const [data, setData] = useState<any[]>([]);
    const [filteredFactions, setFilteredFactions] = useState<any[]>([]);
    
    const searchForFactions = () => {
      const filteredFactions_ = allFactions.filter((faction) => {
        return faction.name.toLowerCase().includes(value.toLowerCase());
      })
      //check if their addresses match the value as well
      const filteredFactions2 = allFactions.filter((faction) => {
        if(faction.addresses.length > 0){
          for(let i = 0; i < faction.addresses.length; i++){
            if(faction.addresses[i].toLowerCase().includes(value.toLowerCase())){
              return faction;
      }}}})
      setFilteredFactions(filteredFactions_.concat(filteredFactions2));
    }
  
    // const { data, status, error, refetch } = useQuery(
    //   ['Search', debouncedSearch],
    //   () => search(debouncedSearch),
    //   {
    //     enabled: !!debouncedSearch && debouncedSearch.length >= minChars,
    //     refetchOnWindowFocus: false,
    //     select: (d) => {
    //       return d.data.collections
    //         .filter((collection: any) =>{
    //           const knownContract = knownContracts.find((c: any) => caseInsensitiveCompare(c.address, collection.address));
    //           if (!knownContract) return false;
    //           return !knownContract.mergedWith;
    //         })
    //         .sort((a: any, b: any) => b.verification?.verified - a.verification?.verified)
    //     }
    //   }
    // );
    const hasDisplayableContent = searchVisits.length > 0 || (data && data.length > 0);
  
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
  
    const handleCollectionClick = useCallback((faction: any) => {
        // collectionAddress = collection.address;
        handleSelectCollectionCallback(faction.name);
        // addToSearchVisitsInStorage(faction);
        onClose();
        setValue('');
    //   router.push(`/collection/${collection.address}`);
    }, [onClose, router, setValue]);
    
    useEffect(() => {
      if(!allFactions) return;

      searchForFactions();
    } , [value]);
  
    const handleRemoveVisit = (collection: any) => {
      removeSearchVisitFromStorage(collection.address);
      const remainingVisits = getRelevantVisits();
      setSearchVisits(remainingVisits);
      if (remainingVisits?.length < 1 && (!data || data.length < 1)) onClose();
    };
  
    const handleKeyDown = (e: any) => {
      if (e.code === 'ArrowUp' && cursor > -1) {
        setCursor(cursor - 1);
      } else if (e.code === 'ArrowDown' && cursor < (searchVisits.length + (data?.length ?? 0) - 1)) {
        setCursor(cursor + 1);
      } else if (e.code === 'Enter' && cursor > -1) {
        if (cursor < searchVisits.length) {
          handleCollectionClick(searchVisits[cursor]);
        } else {
          handleCollectionClick(data[cursor - searchVisits.length]);
        }
      }
    }
  
    const getRelevantVisits = () => {
      const visits = getSearchVisitsInStorage();
  
      if (value && value.length >= minChars) {
        return visits.filter((item: any) => {
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
      <Box position="relative" maxW="100%" ref={ref} marginTop={2}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color={searchIconColor} />}
          />
          <Input
            placeholder="Search"
            w="100%"
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            value={value}
            borderColor={'#aaa'}
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
          position="relative"
          bg={'#272523'}
          w="100%"
          mt={1}
          rounded="md"
          display={isOpen ? 'block' : 'none'}
          borderWidth="1px"
          borderColor={'#aaa'}
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
                    {searchVisits.slice(0, 5).map((item: any, key: number) => (
                      <ResultFaction
                        key={item.address}
                        collection={item}
                        onClick={handleCollectionClick}
                        useCloseButton={true}
                        onRemove={handleRemoveVisit}
                        isFocused={cursor === key}
                        faction={item}
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
                    <Text>Error: {(error as any)?.message}</Text>
                  </Center>
                ) : (
                  <>
                    {filteredFactions?.length > 0 ? (
                      <Box>
                        <Text textTransform="uppercase" ms={1} color={headingColor}>Factions</Text>
                        <VStack>
                          {filteredFactions.slice(0, maxResults).map((item: any, key: number) => (
                            <ResultFaction
                              key={item.address}
                              collection={item}
                              onClick={handleCollectionClick}
                              isFocused={cursor === key + searchVisits.length}
                              faction={item}
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