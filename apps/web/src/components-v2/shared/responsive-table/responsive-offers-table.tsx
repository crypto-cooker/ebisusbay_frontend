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
import React from "react";
import {AxiosResponse} from "axios";
import {Offer} from "@src/core/models/offer";
import {timeSince} from "@market/helpers/utils";
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
import ImageService from "@src/core/services/image";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";

interface ResponsiveOffersTableProps {
  data: InfiniteData<IPaginatedList<Offer>>;
  onUpdate: (offer: Offer) => void;
  onCancel: (offer: Offer) => void;
  onSort: (field: string) => void;
  breakpointValue?: string
}

const ResponsiveOffersTable = ({data, onUpdate, onCancel, onSort, breakpointValue}: ResponsiveOffersTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'md']: false}, {fallback: 'md', ssr: false})

  return shouldUseAccordion ? (
    <DataAccordion data={data} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} />
  ) : (
    <DataTable data={data} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} />
  )
}


const DataTable = ({data, onUpdate, onCancel, onSort}: ResponsiveOffersTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const getOfferDate = (timestamp: number) => {
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
            <Th onClick={() => onSort('listingTime')} cursor='pointer'>Offer Time</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.pages.map((page: any, pageIndex: any) => (
            <React.Fragment key={pageIndex}>
              {page.data.map((offer: Offer) => (
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
                        image={ImageService.translate(offer.nft.image ?? offer.collection.metadata.avatar).avatar()}
                        video={offer.nft.animation_url}
                        title={offer.nft.name ?? offer.collection.name}
                        className=""
                      />
                    </Box>
                  </Td>
                  <Td>
                    {!!offer.nft?.name ? (
                      <VStack align='start'>
                        <Box fontSize='xs' className='color'>
                          <Link href={`/collection/${offer.nftAddress}`} target='_blank'>
                            {offer.collection.name}
                          </Link>
                        </Box>
                        <Box fontWeight='bold'>
                          <Link href={`/collection/${offer.nftAddress}/${offer.nftId}`} target='_blank'>
                            {offer.nft.name}
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
                    {offer.nft.rank}
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
                            onClick={() => onUpdate(offer)}
                          >
                            Update
                          </Button>
                          <Button
                            type="legacy-outlined"
                            onClick={() => onCancel(offer)}
                            className="ms-2"
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

const DataAccordion = ({data, onSort, onUpdate, onCancel}: ResponsiveOffersTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const getOfferDate = (timestamp: number) => {
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
              Sale Time
            </ChakraButton>
          </ButtonGroup>
        </HStack>
      </Box>
      <Accordion w='full' allowMultiple>
        {data.pages.map((page: any, pageIndex: any) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((offer: Offer) => (
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
                          image={ImageService.translate(offer.nft.image ?? offer.collection.metadata.avatar).avatar()}
                          video={offer.nft.animation_url}
                          title={offer.nft.name ?? offer.collection.name}
                        />
                      </Box>

                      <Box flex='1' fontSize='sm'>
                        {!!offer.nft?.name ? (
                          <VStack align='start'>
                            <Box fontSize='xs' className='color'>{offer.collection.name}</Box>
                            <Box fontWeight='bold'>
                              <Link href={`/collection/${offer.nftAddress}/${offer.nftId}`} target='_blank'>
                                {offer.nft.name}
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
                    {offer.nft.rank && (
                      <Stack direction="row" spacing={2}>
                        <Text fontWeight="bold">Rank:</Text>
                        <Text>{offer.nft.rank}</Text>
                      </Stack>
                    )}
                    <Stack direction="row" spacing={2}>
                      <Text fontWeight="bold">Offer Time:</Text>
                      <Text>{getOfferDate(offer.listingTime)} ago</Text>
                    </Stack>
                  </Flex>
                  {offer.state === OfferState.ACTIVE && (
                    <Flex mt={2}>
                      <Button
                        type="legacy"
                        onClick={() => onUpdate(offer)}
                        className="w-100"
                      >
                        Update
                      </Button>
                      <Button
                        type="legacy-outlined"
                        onClick={() => onCancel(offer)}
                        className="ms-2 w-100"
                      >
                        Cancel
                      </Button>
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

export default ResponsiveOffersTable;