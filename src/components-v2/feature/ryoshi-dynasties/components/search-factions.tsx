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
import React, {ChangeEvent, RefObject, useCallback, useEffect, useState} from "react";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {useRouter} from "next/router";
import {ChevronDownIcon, SearchIcon} from "@chakra-ui/icons";
import useDebounce from "@src/core/hooks/useDebounce";
import {appConfig} from "@src/Config";
import ResultFaction from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/factionRow";
import Scrollbars from "react-custom-scrollbars-2";
import {getMultipleCollections} from "@src/core/api/next/collectioninfo";
import useSearch from "@market/hooks/use-search";
import {SearchHistoryItem} from "@market/state/jotai/atoms/search";

const searchRegex = /^\w+([\s-_]\w+)*$/;
  const minChars = 3;
  const defaultMaxVisible = 5;
  const maxVisible = 25;
  
  // @todo remove for autolistings
  const knownContracts = appConfig('collections');

  interface SearchProps {
    handleSelectCollectionCallback: (address:string) => void;
    allFactions: any[];
    imgSize: string;
  }
  
  const SearchFaction = ({handleSelectCollectionCallback, allFactions, imgSize} : SearchProps) => {
    const router = useRouter();
    const searchHistory = useSearch();
    const headingColor = useColorModeValue('black', 'gray.300');
    const searchIconColor = useColorModeValue('white', 'gray.300');
    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.100', 'gray.800');
    const inputBorderColor = useColorModeValue('gray.300', 'gray.600');
    const inputBorderColorFocused = useColorModeValue('gray.100', 'blue.500');
    const inputVariant = useColorModeValue('flushed', 'outline');
  
    const [maxResults, setMaxResults] = useState(defaultMaxVisible);
    const [searchVisits, setSearchVisits] = useState<SearchHistoryItem[]>([]);
    const [collectionAddresses, setCollectionAddresses] = useState<CollectionAddress[]>([]);
  
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
      let filteredFactions_: any[] = [];
      //check if their names match the value
      allFactions.filter((faction) => {
        if(faction.name.toLowerCase().includes(value.toLowerCase())){
          filteredFactions_.push(faction);
      }})
      //check if their addresses match the value as well
      allFactions.filter((faction) => {
        if(faction.addresses.length > 0){
          for(let i = 0; i < faction.addresses.length; i++){
            if(faction.addresses[i].toLowerCase().includes(value.toLowerCase())){
              if(!filteredFactions_.find((f) => f.address === faction.address))
                filteredFactions_.push(faction);
      }}}})
      //check if the names of the collections of the addresses match the value
      allFactions.filter((faction) => {
        if(faction.addresses.length > 0){
          for(let i = 0; i < faction.addresses.length; i++){
            const collection = collectionAddresses.find((f) => f.address === faction.addresses[i]);
            if(collection && collection.collectionName?.toLowerCase().includes(value.toLowerCase())){
              if(!filteredFactions_.find((f) => f.address === faction.address))
                filteredFactions_.push(faction);
      }}}})

      setFilteredFactions(filteredFactions_);
    }

    interface CollectionAddress {
      address: string;
      factionName: string;
      collectionName?: string;
    }

    const getCollectionAddresses = async () => {
      let newAddresses: CollectionAddress[] = [];

      allFactions.filter(async (faction) => {
        if(faction.type === "COLLECTION" && faction.addresses.length > 0){
          for(let i = 0; i < faction.addresses.length; i++){
          newAddresses.push({address: faction.addresses[i], factionName: faction.name});}
      }})

      //get all addresses in new addresses
      const collections = await getMultipleCollections(newAddresses.map((a) => a.address).toString());
      // console.log("collections", collections);

      if(!collections) return;

      //add collection names to new addresses
      for(let i = 0; i < newAddresses.length; i++){
        const collection = collections.find((c:any) => c.address.toLowerCase() === newAddresses[i].address.toLowerCase());
        if(collection){
          newAddresses[i].collectionName = collection.name;
        }
      }

      // console.log(newAddresses);
      setCollectionAddresses(newAddresses);
    }
    const GetCollectionNames = (addresses:any) => {
      if(!addresses) return;
      if(!collectionAddresses) return;

      let names: string[] = [];
      for(let i = 0; i < addresses.length; i++){
        const collection = collectionAddresses.find((c) => c.address.toLowerCase() === addresses[i].toLowerCase());
        if(collection){
          names.push(collection.collectionName!);
        }
      }
      return names;
    }

    useEffect(() => {
      if(!allFactions) return;
      
      getCollectionAddresses();
    }
    , [allFactions]);
  
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
      searchHistory.removeItem(collection.address);
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
      const visits = searchHistory.items;
  
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
              {/* {searchVisits.length > 0 && (
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
              )} */}
              <Box display={value?.length >= minChars ? 'inherit' : 'none'}>
                {status === 'pending' ? (
                  <Center>
                    <Spinner />
                  </Center>
                ) : status === "error" ? (
                  <Center>
                    <Text>Error: {(Error as any)?.message}</Text>
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
                              collectionNames={GetCollectionNames(item.addresses)}
                              imgSize={imgSize}
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
  
  export default SearchFaction;