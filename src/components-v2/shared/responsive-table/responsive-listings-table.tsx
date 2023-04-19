import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button as ChakraButton,
  ButtonGroup,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import React from "react";
import {isBundle, timeSince} from "@src/utils";
import {ListingState} from "@src/core/services/api-service/types";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {commify} from "ethers/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {OwnerListing} from "@src/core/models/listing";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import ImageService from "@src/core/services/image";

interface ResponsiveListingsTableProps {
  data: InfiniteData<IPaginatedList<OwnerListing>>;
  onUpdate: (listing: any) => void;
  onCancel: (listing: any) => void;
  onSort: (field: string) => void;
  breakpointValue?: string
}

const ResponsiveListingsTable = ({data, onUpdate, onCancel, onSort, breakpointValue}: ResponsiveListingsTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'lg']: false}, {fallback: 'lg'})

  return shouldUseAccordion ? (
    <DataAccordion data={data} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} />
  ) : (
    <DataTable data={data} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} />
  )
}


const DataTable = ({data, onUpdate, onCancel, onSort}: ResponsiveListingsTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const getTimeSince = (timestamp: number) => {
    return timeSince(new Date(timestamp * 1000));
  };

  return (
    <TableContainer w='full'>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th colSpan={2}>Item</Th>
            <Th onClick={() => onSort('rank')} cursor='pointer'>Rank</Th>
            <Th onClick={() => onSort('price')} cursor='pointer'>Price</Th>
            <Th onClick={() => onSort('listingTime')} cursor='pointer'>Listing Time</Th>
            <Th>Valid</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.data.map((listing) => (
                <Tr key={listing.listingId} _hover={{bg: listing.valid ? hoverBackground : 'red.600'}} bg={listing.valid ? 'auto' : 'red.500'}>
                  <Td w='50px'>
                    <Box
                      width={50}
                      height={50}
                      position='relative'
                      rounded='md'
                      overflow='hidden'
                    >
                      <AnyMedia
                        image={ImageService.instance.provider.avatar(isBundle(listing.nftAddress) ? '/img/logos/bundle.webp' : listing.nft.image)}
                        video={listing.nft.animation_url}
                        title={listing.nft.name}
                        className=""
                      />
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
                      <Image src="/img/logos/cdc_icon.svg" width={16} height={16} alt='Cronos Logo' />
                      <Box>{commify(listing.price)}</Box>
                    </HStack>
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

const DataAccordion = ({data, onSort, onUpdate, onCancel}: ResponsiveListingsTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

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
              <AccordionItem key={listing.listingId} bg={listing.valid ? 'auto' : 'red.500'}>
                <Flex w='100%' my={2}>
                  <Box flex='1' textAlign='left' fontWeight='bold' my='auto'>
                    <HStack>
                      <Box
                        width='40px'
                        position='relative'
                        rounded='md'
                        overflow='hidden'
                      >
                        <AnyMedia
                          image={ImageService.instance.provider.avatar(isBundle(listing.nftAddress) ? '/img/logos/bundle.webp' : listing.nft.image)}
                          video={listing.nft.animation_url}
                          title={listing.nft.name}
                        />
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
                      <Image src="/img/logos/cdc_icon.svg" width={16} height={16} alt="Cronos Logo" />
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