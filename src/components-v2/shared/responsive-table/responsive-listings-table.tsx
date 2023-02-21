import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
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
import {AxiosResponse} from "axios";
import {timeSince} from "@src/utils";
import Button from "@src/Components/components/Button";
import {ListingState} from "@src/core/services/api-service/types";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {commify} from "ethers/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ResponsiveListingsTableProps {
  data: InfiniteData<AxiosResponse<IPaginatedList<any>>>;
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
          {data.pages.map((page: any, pageIndex: any) => (
            <React.Fragment key={pageIndex}>
              {page.map((listing: any) => (
                <Tr key={listing.listingId} _hover={{bg: listing.valid ? hoverBackground : 'red.600'}} bg={listing.valid ? 'auto' : 'red.500'}>
                  <Td w='50px'>
                    <Box
                      width={50}
                      height={50}
                      position='relative'
                      rounded='full'
                      overflow='hidden'
                    >
                      <AnyMedia
                        image={listing.nft.image}
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
                      <Image src="/img/logos/cdc_icon.svg" width={16} height={16} />
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
                            <Button
                              type="legacy"
                              onClick={() => onUpdate(listing)}
                              className="me-2"
                            >
                              Update
                            </Button>
                          )}
                          <Button
                            type="legacy-outlined"
                            onClick={() => onCancel(listing)}
                          >
                            Cancel
                          </Button>
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

const DataAccordion = ({data, onUpdate, onCancel}: ResponsiveListingsTableProps) => {

  const getTimeSince = (timestamp: number) => {
    return timeSince(new Date(timestamp * 1000));
  };

  return (
    <Accordion w='full' allowMultiple>
      {data.pages.map((page: any, pageIndex: any) => (
        <React.Fragment key={pageIndex}>
          {page.map((listing: any) => (
            <AccordionItem key={listing.listingId} bg={listing.valid ? 'auto' : 'red.500'}>
              <Flex w='100%' my={2}>
                <Box flex='1' textAlign='left' fontWeight='bold' my='auto'>
                  <HStack>
                    <Box
                      width={50}
                      height={50}
                      position='relative'
                      rounded='full'
                      overflow='hidden'
                    >
                      <AnyMedia
                        image={listing.nft.image}
                        video={listing.nft.animation_url}
                        title={listing.nft.name}
                      />
                    </Box>

                    <Link href={`/collection/${listing.nftAddress}/${listing.nftId}`}>
                      {listing.nft.name}
                    </Link>
                  </HStack>
                </Box>
                <Box>
                  <HStack spacing={1} h="full">
                    <Image src="/img/logos/cdc_icon.svg" width={16} height={16} />
                    <Box>{commify(listing.price)}</Box>
                  </HStack>
                </Box>
                <AccordionButton w='auto'>
                  <AccordionIcon />
                </AccordionButton>
              </Flex>
              <AccordionPanel pb={4}>
                <Flex justify="space-between" fontSize="sm" mb={2}>
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
                <Flex>
                  {listing.state === ListingState.ACTIVE && (
                    <>
                      {listing.isInWallet && (
                        <Button
                          type="legacy"
                          onClick={() => onUpdate(listing)}
                          className="me-2 w-100"
                        >
                          Update
                        </Button>
                      )}
                      <Button
                        type="legacy-outlined"
                        onClick={() => onCancel(listing)}
                        className="w-100"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </React.Fragment>
      ))}
    </Accordion>
  )
};


export default ResponsiveListingsTable;