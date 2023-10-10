import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button as ChakraButton,
    ButtonGroup,
    Checkbox,
    Flex,
    HStack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    useBreakpointValue,
    useColorModeValue,
    VStack,
    LinkBox,
    LinkOverlay,
    Image as ChakraImage,
    CheckboxGroup,
    CheckboxProps,
  Avatar,
  CheckboxGroupProps,

  } from "@chakra-ui/react";

  import React, {useContext, useEffect} from "react";
  import {caseInsensitiveCompare, isBundle, timeSince} from "@src/utils";
  import {ListingState, RdFaction} from "@src/core/services/api-service/types";
  import {InfiniteData} from "@tanstack/query-core";
  import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
  import {AnyMedia, MultimediaImage} from "@src/components-v2/shared/media/any-media";
  import {commify} from "ethers/lib/utils";
  import Link from "next/link";
  // import {Faction} from "@src/core/models/faction";
  import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
  import ImageService from "@src/core/services/image";
  import {
    MultiSelectContextFaction,
    MultiSelectContextPropsFaction
  } from "@src/components-v2/feature/ryoshi-dynasties/game/modals/xp-leaderboard/xp-context";
  import {WarningIcon} from "@chakra-ui/icons";
  import {specialImageTransform} from "@src/hacks";
  import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";
  import {shortAddress, } from "@src/utils";
  import {CdnImage} from "@src/components-v2/shared/media/cdn-image";
  import Blockies from "react-blockies";
  
  interface ResponsiveFactionsTableProps {
    data: InfiniteData<IPaginatedList<XPProfile>>;
    onUpdate: (faction: any) => void;
    selectedFaction?: RdFaction;
    onSort: (sortBy: string) => void;
    onCancel: (faction: any) => void;
  }

  interface XPProfile {
      profile: {
        walletAddress: string;
        username: string;
        profileImage: string;
      },
      experience: number;
    }
  
  interface MultiSelectProps {
    // onCheck: (faction: RdFaction, checked?: boolean) => void;
    onToggleAll: (checked: boolean) => void;
  }
  
  const ResponsiveXPTable = ({data, onUpdate, selectedFaction, onSort, onCancel, }: ResponsiveFactionsTableProps) => {
    const shouldUseAccordion = useBreakpointValue({base: false}, {fallback: 'lg'})
    // const {isMobileEnabled} = useContext(MultiSelectContextFaction) as MultiSelectContextPropsFaction;
  
    // const handleCheck = (targetFaction: RdFaction, checked?: boolean) => {
    //   if (!shouldUseAccordion) return;
  
    //   const alreadyChecked = selected.some((faction) => caseInsensitiveCompare(faction.id, targetFaction.id));
    //   if ((checked !== undefined && !checked) || alreadyChecked) {
    //     // setSelected(selected.filter((faction: RdFaction) => !caseInsensitiveCompare(faction.id, targetFaction.id)));
    //   } else if (checked || !alreadyChecked) {
    //     // setSelected([...selected, targetFaction]);
    //   }
    // }
  
    const toggleAll = (checked: boolean) => {
      if (checked) {
        // setSelected(data.pages.map((page) => page.data).flat());
      } else {
        // setSelected([]);
      }
    }
    useEffect(() => {
      console.log(selectedFaction);
      // setSelected(data.pages.map((page) => page.data).flat());
    }, [selectedFaction]);
  
    return shouldUseAccordion ? (
      <DataAccordion data={data} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} onToggleAll={toggleAll }/>
    ) : (
      <DataTable data={data} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} onToggleAll={toggleAll } />
    )
  }
  
  
  const DataTable = ({data, onUpdate, onCancel, onSort, onToggleAll}: ResponsiveFactionsTableProps & MultiSelectProps) => {
    const hoverBackground = useColorModeValue('gray.100', '#424242');
    // const { selected } = useContext(MultiSelectContextFaction) as MultiSelectContextPropsFaction;
  
    const getTimeSince = (timestamp: number) => {
      return timeSince(new Date(timestamp * 1000));
    };
  
    return (
      <TableContainer w='full'>
        <Table variant='simple' >
          <Thead>
            <Tr>
              <Th textAlign='left'>Rank</Th>
              <Th textAlign='left'>Faction</Th>
              <Th textAlign='left' isNumeric>Address</Th>
              <Th textAlign='left' isNumeric>Exp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data.map((profile, index) => (
                  <>
                  {/* <LinkBox as={Tr} key={`${faction.addresses[0]}`} _hover={{bg: hoverBackground}} textDecoration='none'> */}
                  {/* <Box maxH='50px' p={0}  margin={0}>
                      <Td> {index + 1}</Td>
                      <Td p={0} w='50px'>
                        {faction.image ? (
                          <Flex h={'20px'} width="50px">

                          < CdnImage
                              src={ImageService.translate(faction.image).avatar()}
                              alt={faction.name}
                              width="50px"
                              height="25px"
                            /> 
                          </Flex>
                        ) : (
                          <Blockies seed={faction.addresses[0].toLowerCase()} size={10} scale={5} />
                        )}
                      </Td>
                      <Td  fontWeight='bold'>
                        {faction.type === 'COLLECTION' && (
                          <LinkOverlay href={`/collection/${faction.addresses[0]}`} _hover={{color:'inherit'}}>
                            {faction.name}
                          </LinkOverlay>
                        )}
                        {faction.type === 'WALLET' && (
                          <>
                            {faction.name}
                          </>
                          // <LinkOverlay href={`/account/${faction.addresses[0]}`} _hover={{color:'inherit'}}>
                          //   {shortAddress(faction.name)}
                          // </LinkOverlay>
                        )}
                      </Td>
                  </Box> 
                    {/* </LinkBox> */}
                     <Tr key={index} >
                        <Td w={16}>{index+1}</Td>
                        <Td  p={0} textAlign='left' alignSelf={'center'}
                          alignContent={'center'}
                          alignItems={'center'}
                          // display={'flex'}
                        >
                          <HStack>
                            <Avatar
                              width='40px'
                              height='40px'
                              padding={1}
                              src={ImageService.translate(profile.profile.profileImage).avatar()}
                              rounded='xs'
                              zIndex={0}
                            />
                            <Text >{profile.profile.username}</Text>
                          </HStack>
                        </Td>
                        <Td  textAlign='left' maxW={'200px'} isNumeric>{profile.profile.walletAddress}</Td>
                        <Td  textAlign='left' maxW={'200px'} isNumeric>{profile.experience}</Td>
                      </Tr>
                  </>
                ))}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    )
  };
  
  const DataAccordion = ({data, onSort, onUpdate, onCancel, onToggleAll}: ResponsiveFactionsTableProps & MultiSelectProps) => {
    const hoverBackground = useColorModeValue('gray.100', '#424242');
    // const { selected, isMobileEnabled: multiSelectMode } = useContext(MultiSelectContextFaction) as MultiSelectContextPropsFaction;
  
    const getTimeSince = (timestamp: number) => {
      return timeSince(new Date(timestamp * 1000));
    };
  
    return (
      <>
        <Box mb={2} textAlign='center'>
          <HStack>
            <Text fontSize='sm'>Sort:</Text>
            <ButtonGroup>
              <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => onSort('rank')}>
                Rank
              </ChakraButton>
              <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => onSort('price')}>
                Price
              </ChakraButton>
              <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => onSort('listingTime')}>
                Listing Time
              </ChakraButton>
            </ButtonGroup>
          </HStack>
        </Box>
        {/* <Accordion w='full' allowMultiple>
          {data.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.data.map((listing) => (
                <AccordionItem key={listing.listingId}>
                  <Flex w='100%' my={2}>
                    <Box flex='1' textAlign='left' fontWeight='bold' my='auto'>
                      <HStack>
                        {multiSelectMode && (
                          <Checkbox
                            isChecked={selected.some((selectedListing: Listing) => caseInsensitiveCompare(selectedListing.listingId, listing.listingId))}
                            onChange={(e) => onCheck(listing, e.target.checked)}
                          />
                        )}
                        <Box
                          width='40px'
                          position='relative'
                          rounded='md'
                          overflow='hidden'
                          onClick={() => onCheck(listing)}
                        >
                          {listing.valid ? (
                            <MultimediaImage
                              source={ImageService.translate(isBundle(listing.nftAddress) ? '/img/logos/bundle.webp' : listing.nft.image).avatar()}
                              fallbackSource={ImageService.bunnykit(ImageService.bunnykit(listing.nft.image).thumbnail()).avatar()}
                              title={listing.nft.name}
                            />
                          ) : (
                            <Box position='relative'>
                              <Box filter='brightness(0.5)'>
                                <AnyMedia
                                  image={ImageService.translate(isBundle(listing.nftAddress) ? '/img/logos/bundle.webp' : listing.nft.image).blurred()}
                                  video={listing.nft.animation_url}
                                  title={listing.nft.name}
                                />
                              </Box>
                              <Box position='absolute' top='50%' left='50%' transform='translate(-50%, -50%)'>
                                <WarningIcon boxSize={5} color='red.300' verticalAlign='center'/>
                              </Box>
                            </Box>
                          )}
                        </Box>
  
                        <Box flex='1' fontSize='sm'>
                          <Link href={`/collection/${listing.nftAddress}/${listing.nftId}`}>
                            {listing.nft.name}
                          </Link>
                        </Box>
                      </HStack>
                    </Box>
                    <Box ms={2}>
                      <HStack spacing={1} h="full" fontSize='sm'>
                        <DynamicCurrencyIcon address={listing.currency} boxSize={4} />
                        <Box>{commify(listing.price)}</Box>
                      </HStack>
                    </Box>
                    <AccordionButton w='auto'>
                      <AccordionIcon />
                    </AccordionButton>
                  </Flex>
                  <AccordionPanel pb={4} px={0}>
                    <Flex justify='space-around' textAlign='center' fontSize='sm' bg={hoverBackground} rounded='md' py={2}>
                      {listing.nft.rank && (
                        <VStack direction="row" spacing={0}>
                          <Text fontWeight="bold">Rank:</Text>
                          <Text>{listing.nft.rank}</Text>
                        </VStack>
                      )}
                      <VStack direction="row" spacing={0}>
                        <Text fontWeight="bold">Listing Time:</Text>
                        <Text>{getTimeSince(listing.listingTime)} ago</Text>
                      </VStack>
                      <VStack direction="row" spacing={0}>
                        <Text fontWeight="bold">Quantity:</Text>
                        <Text>{listing.amount}</Text>
                      </VStack>
                    </Flex>
                    {listing.state === ListingState.ACTIVE && (
                      <Flex mt={2}>
                        {listing.isInWallet && (
                          <PrimaryButton
                            onClick={() => onUpdate(listing)}
                            className="me-2 w-100"
                          >
                            Update
                          </PrimaryButton>
                        )}
                        <SecondaryButton
                          onClick={() => onCancel(listing)}
                          className="w-100"
                        >
                          Cancel
                        </SecondaryButton>
                      </Flex>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </React.Fragment>
          ))}
        </Accordion> */}
      </>
    )
  };
  
  
  export default ResponsiveXPTable;