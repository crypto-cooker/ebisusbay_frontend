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
  VStack
} from "@chakra-ui/react";
import React, {useContext} from "react";
import {ciEquals, isBundle, timeSince} from "@market/helpers/utils";
import {ListingState} from "@src/core/services/api-service/types";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {AnyMedia, MultimediaImage} from "@src/components-v2/shared/media/any-media";
import {commify} from "ethers/lib/utils";
import Link from "next/link";
import {Listing, OwnerListing} from "@src/core/models/listing";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import ImageService from "@src/core/services/image";
import {
  MultiSelectContext,
  MultiSelectContextProps
} from "@src/components-v2/feature/account/profile/tabs/listings/context";
import {WarningIcon} from "@chakra-ui/icons";
import {specialImageTransform} from "@market/helpers/hacks";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";

interface ResponsiveListingsTableProps {
  data: InfiniteData<IPaginatedList<OwnerListing>>;
  onUpdate: (listing: any) => void;
  onCancel: (listing: any) => void;
  onSort: (field: string) => void;
  breakpointValue?: string
}

interface MultiSelectProps {
  onCheck: (listing: Listing, checked?: boolean) => void;
  onToggleAll: (checked: boolean) => void;
}

const ResponsiveListingsTable = ({data, onUpdate, onCancel, onSort, breakpointValue}: ResponsiveListingsTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'lg']: false}, {fallback: 'lg', ssr: false})
  const { selected, setSelected, isMobileEnabled } = useContext(MultiSelectContext) as MultiSelectContextProps;

  const handleCheck = (targetListing: Listing, checked?: boolean) => {
    if (!shouldUseAccordion && isMobileEnabled) return;

    const alreadyChecked = selected.some((listing) => ciEquals(listing.listingId, targetListing.listingId));
    if ((checked !== undefined && !checked) || alreadyChecked) {
      setSelected(selected.filter((listing: Listing) => !ciEquals(listing.listingId, targetListing.listingId)));
    } else if (checked || !alreadyChecked) {
      setSelected([...selected, targetListing]);
    }
  }

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelected(data.pages.map((page) => page.data).flat());
    } else {
      setSelected([]);
    }
  }

  return shouldUseAccordion ? (
    <DataAccordion data={data} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} onCheck={handleCheck} onToggleAll={toggleAll }/>
  ) : (
    <DataTable data={data} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} onCheck={handleCheck} onToggleAll={toggleAll } />
  )
}


const DataTable = ({data, onUpdate, onCancel, onSort, onCheck, onToggleAll}: ResponsiveListingsTableProps & MultiSelectProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const { selected  } = useContext(MultiSelectContext) as MultiSelectContextProps;

  const getTimeSince = (timestamp: number) => {
    return timeSince(new Date(timestamp * 1000));
  };

  return (
    <TableContainer w='full'>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>
              {data.pages.map((page) => page.data).flat().length > 0 && (
                <Checkbox
                  isChecked={selected.length === data.pages.map((page) => page.data).flat().length}
                  size='lg'
                  onChange={(e) => onToggleAll(e.target.checked)}
                />
              )}
            </Th>
            <Th colSpan={2}>Item</Th>
            <Th onClick={() => onSort('rank')} cursor='pointer'>Rank</Th>
            <Th onClick={() => onSort('price')} cursor='pointer'>Price</Th>
            <Th onClick={() => onSort('quantity')} cursor='pointer'>Quantity</Th>
            <Th onClick={() => onSort('listingTime')} cursor='pointer'>Listing Time</Th>
            <Th>Valid</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.data.map((listing) => (
                <Tr key={listing.listingId} _hover={{bg: hoverBackground}}>
                  <Td w='20px'>
                    <Checkbox
                      isChecked={selected.some((selectedListing: Listing) => ciEquals(selectedListing.listingId, listing.listingId))}
                      size='lg'
                      onChange={(e) => onCheck(listing, e.target.checked)}
                    />
                  </Td>
                  <Td w='50px'>
                    <Box
                      width={50}
                      height={50}
                      position='relative'
                      rounded='md'
                      overflow='hidden'
                    >
                      {listing.valid ? (
                        <>
                          {isBundle(listing.nftAddress) ? (
                            <AnyMedia
                              image={ImageService.translate('/img/logos/bundle.webp').avatar()}
                              title={listing.nft.name}
                              usePlaceholder={false}
                              className="img-rounded-8"
                            />
                          ) : (
                            <MultimediaImage
                              source={ImageService.translate(specialImageTransform(listing.nftAddress, listing.nft.image)).avatar()}
                              fallbackSource={ImageService.bunnykit(ImageService.bunnykit(listing.nft.image).thumbnail()).avatar()}
                              title={listing.nft.name}
                              className="img-rounded-8"
                            />
                          )}
                        </>
                      ) : (
                        <Tooltip label="This listing is invalid" aria-label='Invalid listing'>
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
                        </Tooltip>
                      )}
                    </Box>
                  </Td>
                  <Td fontWeight='bold'>
                    <Link href={`/collection/${listing.nft.nftAddress}/${listing.nft.nftId}`}>
                      {listing.nft.name}
                    </Link>
                  </Td>
                  <Td>
                    {listing.nft.rank}
                  </Td>
                  <Td>
                    <HStack spacing={1}>
                      <DynamicCurrencyIcon address={listing.currency} boxSize={4} />
                      <Box>{commify(listing.price)}</Box>
                    </HStack>
                  </Td>
                  <Td>
                    {commify(listing.amount)}
                  </Td>
                  <Td>{getTimeSince(listing.listingTime)} ago</Td>
                  <Td>{listing.valid ? 'Valid' : 'Invalid'}</Td>
                  <Td>
                    <Flex>
                      {listing.state === ListingState.ACTIVE && (
                        <>
                          {listing.isInWallet && (
                            <PrimaryButton
                              onClick={() => onUpdate(listing)}
                              className="me-2"
                            >
                              Update
                            </PrimaryButton>
                          )}
                          <SecondaryButton
                            onClick={() => onCancel(listing)}
                          >
                            Cancel
                          </SecondaryButton>
                        </>
                      )}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const DataAccordion = ({data, onSort, onUpdate, onCancel, onCheck, onToggleAll}: ResponsiveListingsTableProps & MultiSelectProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const { selected, isMobileEnabled: multiSelectMode } = useContext(MultiSelectContext) as MultiSelectContextProps;

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
      <Accordion w='full' allowMultiple>
        {data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((listing) => (
              <AccordionItem key={listing.listingId}>
                <Flex w='100%' my={2}>
                  <Box flex='1' textAlign='left' fontWeight='bold' my='auto'>
                    <HStack>
                      {multiSelectMode && (
                        <Checkbox
                          isChecked={selected.some((selectedListing: Listing) => ciEquals(selectedListing.listingId, listing.listingId))}
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
      </Accordion>
    </>
  )
};


export default ResponsiveListingsTable;