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
import {AxiosResponse} from "axios";
import {shortAddress, timeSince} from "@market/helpers/utils";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {commify} from "ethers/lib/utils";
import Link from "next/link";
import ImageService from "@src/core/services/image";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";

interface ResponsiveTableProps {
  data: InfiniteData<AxiosResponse<IPaginatedList<any>>>;
  onSort: (field: string) => void;
  breakpointValue?: string
}

const ResponsiveSalesTable = ({data, onSort, breakpointValue}: ResponsiveTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'lg']: false}, {fallback: 'lg'})

  return shouldUseAccordion ? (
    <DataAccordion data={data} onSort={onSort} />
  ) : (
    <DataTable data={data} onSort={onSort} />
  )
}


const DataTable = ({data, onSort}: ResponsiveTableProps) => {
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
            <Th>To</Th>
            <Th onClick={() => onSort('saleTime')} cursor='pointer'>Sale Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.pages.map((page: any, pageIndex: any) => (
            <React.Fragment key={pageIndex}>
              {page.map((listing: any) => (
                <Tr key={listing.listingId} _hover={{hoverBackground}}>
                  <Td w='50px'>
                    <Box
                      width={50}
                      height={50}
                      position='relative'
                      rounded='md'
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
                      <DynamicCurrencyIcon address={listing.currency} boxSize={4} />
                      <Box>{commify(listing.price)}</Box>
                    </HStack>
                  </Td>
                  <Td>
                    <Link href={`/account/${listing.purchaser}`}>{shortAddress(listing.purchaser)}</Link>
                  </Td>
                  <Td>{getTimeSince(listing.saleTime)} ago</Td>
                </Tr>
              ))}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const DataAccordion = ({data, onSort}: ResponsiveTableProps) => {
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
            <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => onSort('saleTime')}>
              Sale Time
            </ChakraButton>
          </ButtonGroup>
        </HStack>
      </Box>
      <Accordion w='full' allowMultiple>
        {data.pages.map((page: any, pageIndex: any) => (
          <React.Fragment key={pageIndex}>
            {page.map((listing: any) => (
              <AccordionItem key={listing.listingId}>
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
                          image={ImageService.translate(listing.nft.image).avatar()}
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
                    <VStack align='end' spacing={0} fontSize='sm'>
                      <Text>{getTimeSince(listing.saleTime)}</Text>
                      <HStack spacing={1} h="full">
                        <DynamicCurrencyIcon address={listing.currency} boxSize={4} />
                        <Box>{commify(listing.price)}</Box>
                      </HStack>
                    </VStack>
                  </Box>
                  <AccordionButton w='auto'>
                    <AccordionIcon />
                  </AccordionButton>
                </Flex>
                <AccordionPanel px={0}>
                  <Flex justify='space-around' textAlign='center' fontSize='sm' bg={hoverBackground} rounded='md' py={2}>
                    {!!listing.nft.rank && (
                      <VStack direction="row" spacing={0}>
                        <Text fontWeight="bold">Rank:</Text>
                        <Text>{listing.nft.rank}</Text>
                      </VStack>
                    )}
                    <VStack direction="row" spacing={0}>
                      <Text fontWeight="bold">To:</Text>
                      <Link href={`/account/${listing.purchaser}`}>{shortAddress(listing.purchaser)}</Link>
                    </VStack>
                    <VStack direction="row" spacing={0}>
                      <Text fontWeight="bold">Sale Time:</Text>
                      <Text>{getTimeSince(listing.saleTime)} ago</Text>
                    </VStack>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </React.Fragment>
        ))}
      </Accordion>
    </>
  )
};


export default ResponsiveSalesTable;