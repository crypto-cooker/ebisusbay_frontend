import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box, ButtonGroup,
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
  useBreakpointValue, useColorModeValue, VStack
} from "@chakra-ui/react";
import React, {useCallback} from "react";
import {AxiosResponse} from "axios";
import {Offer} from "@src/core/models/offer";
import {findCollectionByAddress, shortAddress, timeSince} from "@src/utils";
import Button from "@src/Components/components/Button";
import {OfferState} from "@src/core/services/api-service/types";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {commify} from "ethers/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {hostedImage} from "@src/helpers/image";
import {Button as ChakraButton} from "@chakra-ui/react";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";

interface ResponsiveReceivedOffersTableProps {
  data: InfiniteData<IPaginatedList<Offer>>;
  onAccept: (offer: any) => void;
  onReject: (offer: any) => void;
  canReject: boolean;
  onSort: (field: string) => void;
  breakpointValue?: string
}

const ResponsiveReceivedOffersTable = ({data, onAccept, onReject, canReject, onSort, breakpointValue}: ResponsiveReceivedOffersTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'md']: false}, {fallback: 'md'})

  const handleAccept = useCallback((offer: any) => {
    const collectionData = findCollectionByAddress(offer.nftAddress, offer.nftId);
    onAccept({
      ...offer,
      collectionData
    })
  }, [onAccept]);

  const handleReject = useCallback((offer: any) => {
    const collectionData = findCollectionByAddress(offer.nftAddress, offer.nftId);
    onReject({
      ...offer,
      collectionData
    })
  }, [onReject]);

  return shouldUseAccordion ? (
    <DataAccordion data={data} onAccept={handleAccept} onReject={handleReject} canReject={canReject} onSort={onSort} />
  ) : (
    <DataTable data={data} onAccept={handleAccept} onReject={handleReject} canReject={canReject} onSort={onSort} />
  )
}


const DataTable = ({data, onAccept, onReject, canReject, onSort}: ResponsiveReceivedOffersTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const getOfferDate = (timestamp: number) => {
    return timeSince(new Date(timestamp * 1000));
  };

  const getCollectionName = (nftAddress: string, nftId: string) => {
    const collectionData = findCollectionByAddress(nftAddress, nftId);
    return collectionData ? collectionData?.name : '';
  };

  const getCollectionAvatar = (nftAddress: string, nftId: string) => {
    const collectionData = findCollectionByAddress(nftAddress, nftId);
    return collectionData ? collectionData?.metadata?.avatar : '';
  };

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
              {page.data.map((offer) => (
                <Tr key={`${offer.offerId}`} _hover={{bg: hoverBackground}}>
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
                  <Td>{getOfferDate(offer.listingTime)} ago</Td>
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
              ))}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const DataAccordion = ({data, onSort, onAccept, onReject, canReject}: ResponsiveReceivedOffersTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const getOfferDate = (timestamp: number) => {
    return timeSince(new Date(timestamp * 1000));
  };

  const getCollectionName = (nftAddress: string, nftId: string) => {
    const collectionData = findCollectionByAddress(nftAddress, nftId);
    return collectionData ? collectionData?.name : '';
  };

  const getCollectionAvatar = (nftAddress: string, nftId: string) => {
    const collectionData = findCollectionByAddress(nftAddress, nftId);
    return collectionData ? collectionData?.metadata?.avatar : '';
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
              Sale Time
            </ChakraButton>
          </ButtonGroup>
        </HStack>
      </Box>
      <Accordion w='full' allowMultiple>
        {data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((offer) => (
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
                          image={getCollectionAvatar(offer.nftAddress, offer.nftId)}
                          video=""
                          title={getCollectionName(offer.nftAddress, offer.nftId)}
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
                  <Flex justify='space-around' textAlign='center' fontSize='sm' bg={hoverBackground} rounded='md' py={2}>
                    {/*{offer.nft.rank && (*/}
                    {/*  <Stack direction="row" spacing={2}>*/}
                    {/*    <Text fontWeight="bold">Rank:</Text>*/}
                    {/*    <Text>{offer.nft.rank}</Text>*/}
                    {/*  </Stack>*/}
                    {/*)}*/}
                    <Stack direction="row" spacing={2}>
                      <Text fontWeight="bold">Offer Time:</Text>
                      <Text>{getOfferDate(offer.listingTime)} ago</Text>
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
            ))}
          </React.Fragment>
        ))}
      </Accordion>
    </>
  )
};

export default ResponsiveReceivedOffersTable;