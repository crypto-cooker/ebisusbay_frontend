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
  Stack,
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
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { Offer } from '@src/core/models/offer';
import { timeSince } from '@market/helpers/utils';
import Button from '@src/Components/components/Button';
import { OfferState } from '@src/core/services/api-service/types';
import { InfiniteData } from '@tanstack/query-core';
import { IPaginatedList } from '@src/core/services/api-service/paginated-list';
import { AnyMedia } from '@src/components-v2/shared/media/any-media';
import { commify } from 'ethers/lib/utils';
import Link from 'next/link';
import CronosIconBlue from '@src/components-v2/shared/icons/cronos-blue';

interface ResponsiveReceivedOffersTableProps {
  data: InfiniteData<IPaginatedList<Offer>>;
  onAccept: (offer: any) => void;
  onReject: (offer: any) => void;
  canReject: boolean;
  onSort: (field: string) => void;
  breakpointValue?: string
}

const ResponsiveReceivedOffersTable = ({data, onAccept, onReject, canReject, onSort, breakpointValue}: ResponsiveReceivedOffersTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'md']: false}, {fallback: 'md', ssr: false})

  const handleAccept = useCallback((offer: any) => {
    onAccept(offer)
  }, [onAccept]);

  const handleReject = useCallback((offer: any) => {
    onReject(offer)
  }, [onReject]);

  return shouldUseAccordion ? (
    <DataAccordion data={data} onAccept={handleAccept} onReject={handleReject} canReject={canReject} onSort={onSort} />
  ) : (
    <DataTable data={data} onAccept={handleAccept} onReject={handleReject} canReject={canReject} onSort={onSort} />
  )
}


const DataTable = ({data, onAccept, onReject, canReject, onSort}: ResponsiveReceivedOffersTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  return (
    <TableContainer w='full'>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th colSpan={2}>Item</Th>
            <Th onClick={() => onSort('rank')} cursor='pointer'>Rank</Th>
            <Th onClick={() => onSort('price')} cursor='pointer'>Price</Th>
            <Th onClick={() => onSort('listingTime')} cursor='pointer'>Offer Time</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.data.map((offer) => {
                const offerDate = timeSince(new Date(offer.listingTime * 1000));
                return (
                  <Tr key={`${offer.offerId}`} _hover={{ bg: hoverBackground }}>
                    <Td w='50px'>
                      <Box
                        width={50}
                        height={50}
                        position='relative'
                        rounded='md'
                        overflow='hidden'
                      >
                        <AnyMedia
                          image={offer.metadata.image ?? offer.collection.metadata.avatar}
                          video=""
                          title={offer.metadata.name ?? offer.collection.name}
                          className=""
                        />
                      </Box>
                    </Td>
                    <Td>
                      {!!offer.metadata.name ? (
                        <VStack align='start'>
                          <Box fontSize='xs' className='color'>
                            <Link href={`/collection/${offer.nftAddress}`} target='_blank'>
                              {offer.collection.name}
                            </Link>
                          </Box>
                          <Box fontWeight='bold'>
                            <Link href={`/collection/${offer.nftAddress}/${offer.nftId}`} target='_blank'>
                              {offer.metadata.name}
                            </Link>
                          </Box>
                        </VStack>
                      ) : (
                        <Box fontWeight='bold'>
                          <Link href={`/collection/${offer.nftAddress}`} target='_blank'>
                            {offer.collection.name}
                          </Link>
                        </Box>
                      )}
                    </Td>
                    <Td>
                      -
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <CronosIconBlue boxSize={4} />
                        <Box>{commify(offer.price)}</Box>
                      </HStack>
                    </Td>
                    <Td>{offerDate} ago</Td>
                    <Td>
                      <Flex>
                        {offer.state === OfferState.ACTIVE && (
                          <>
                            <Button
                              type="legacy"
                              onClick={() => onAccept(offer)}
                            >
                              Accept
                            </Button>
                            {canReject && (
                              <Button
                                type="legacy-outlined"
                                onClick={() => onReject(offer)}
                                className="ms-2"
                              >
                                Reject
                              </Button>
                            )}
                          </>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                )
              })}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const DataAccordion = ({data, onSort, onAccept, onReject, canReject}: ResponsiveReceivedOffersTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

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
              Sale Time
            </ChakraButton>
          </ButtonGroup>
        </HStack>
      </Box>
      <Accordion w='full' allowMultiple>
        {data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((offer) => {
              const offerDate = timeSince(new Date(offer.listingTime * 1000));
              return (
                <AccordionItem key={offer.offerId}>
                  <Flex w='100%' my={2}>
                    <Box flex='1' textAlign='left' my='auto'>
                      <HStack>
                        <Box
                          width='40px'
                          position='relative'
                          rounded='md'
                          overflow='hidden'
                        >
                          <AnyMedia
                            image={offer.metadata.image ?? offer.collection.metadata.avatar}
                            video=""
                            title={offer.metadata.name ?? offer.collection.name}
                            className=""
                          />
                        </Box>

                        <Box flex='1' fontSize='sm'>
                          {!!offer.metadata.name ? (
                            <VStack align='start'>
                              <Box fontSize='xs' className='color'>{offer.collection.name}</Box>
                              <Box fontWeight='bold'>
                                <Link href={`/collection/${offer.nftAddress}/${offer.nftId}`} target='_blank'>
                                  {offer.metadata.name}
                                </Link>
                              </Box>
                            </VStack>
                          ) : (
                            <Box fontWeight='bold'>
                              <Link href={`/collection/${offer.nftAddress}`} target='_blank'>
                                {offer.collection.name}
                              </Link>
                            </Box>
                          )}
                        </Box>
                      </HStack>
                    </Box>
                    <Box ms={2}>
                      <HStack spacing={1} h="full" fontSize='sm'>
                        <CronosIconBlue boxSize={4} />
                        <Box>{commify(offer.price)}</Box>
                      </HStack>
                    </Box>
                    <AccordionButton w='auto'>
                      <AccordionIcon />
                    </AccordionButton>
                  </Flex>
                  <AccordionPanel pb={4} px={0}>
                    <Flex justify='space-around' textAlign='center' fontSize='sm' bg={hoverBackground} rounded='md'
                          py={2}>
                      {/*{offer.nft.rank && (*/}
                      {/*  <Stack direction="row" spacing={2}>*/}
                      {/*    <Text fontWeight="bold">Rank:</Text>*/}
                      {/*    <Text>{offer.nft.rank}</Text>*/}
                      {/*  </Stack>*/}
                      {/*)}*/}
                      <Stack direction="row" spacing={2}>
                        <Text fontWeight="bold">Offer Time:</Text>
                        <Text>{offerDate} ago</Text>
                      </Stack>
                    </Flex>
                    {offer.state === OfferState.ACTIVE && (
                      <Flex mt={2}>
                        <Button
                          type="legacy"
                          onClick={() => onAccept(offer)}
                          className="w-100"
                        >
                          Accept
                        </Button>
                        {canReject && (
                          <Button
                            type="legacy-outlined"
                            onClick={() => onReject(offer)}
                            className="ms-2 w-100"
                          >
                            Reject
                          </Button>
                        )}
                      </Flex>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              )
            })}
          </React.Fragment>
        ))}
      </Accordion>
    </>
  )
};

export default ResponsiveReceivedOffersTable;