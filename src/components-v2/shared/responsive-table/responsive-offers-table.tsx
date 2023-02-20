import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
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
  useBreakpointValue, useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import {AxiosResponse} from "axios";
import {Offer} from "@src/core/models/offer";
import {timeSince} from "@src/utils";
import Button from "@src/Components/components/Button";
import {OfferState} from "@src/core/services/api-service/types";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {commify} from "ethers/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ResponsiveOffersTableProps {
  data: InfiniteData<AxiosResponse<IPaginatedList<Offer>>>;
  onUpdate: (offer: Offer) => void;
  onCancel: (offer: Offer) => void;
}

const ResponsiveOffersTable = ({data, onUpdate, onCancel}: ResponsiveOffersTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, md: false}, {fallback: 'md'})

  return shouldUseAccordion ? (
    <DataAccordion data={data} onUpdate={onUpdate} onCancel={onCancel} />
  ) : (
    <DataTable data={data} onUpdate={onUpdate} onCancel={onCancel} />
  )
}


const DataTable = ({data, onUpdate, onCancel}: ResponsiveOffersTableProps) => {
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
            <Th>Price</Th>
            <Th>Offer Time</Th>
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
                      style={{ borderRadius: '20px' }}
                      position='relative'
                    >
                      <AnyMedia
                        image={offer.nft.image ?? offer.collection.metadata.avatar}
                        video={offer.nft.animation_url}
                        title={offer.nft.name ?? offer.collection.name}
                        className="img-fluid img-rounded-8"
                      />
                    </Box>
                  </Td>
                  <Td fontWeight='bold'>
                    {offer.nftId ? (
                      <Link href={`/collection/${offer.collection.slug}/${offer.nftId}`}>
                        {offer.nft.name}
                      </Link>
                    ) : (
                      <Link href={`/collection/${offer.collection.slug}`}>
                        {offer.collection.name}
                      </Link>
                    )}
                  </Td>
                  <Td>
                    <HStack spacing={1}>
                      <Image src="/img/logos/cdc_icon.svg" width={16} height={16} />
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

const DataAccordion = ({data, onUpdate, onCancel}: ResponsiveOffersTableProps) => {

  const getOfferDate = (timestamp: number) => {
    return timeSince(new Date(timestamp * 1000));
  };

  return (
    <Accordion w='full' allowMultiple>
      {data.pages.map((page: any, pageIndex: any) => (
        <React.Fragment key={pageIndex}>
          {page.data.map((offer: Offer) => (
            <AccordionItem key={offer.offerId}>
              <Flex w='100%' my={2}>
                <Box flex='1' textAlign='left' fontWeight='bold' my='auto'>
                  <HStack>
                    <Box
                      width={50}
                      height={50}
                      style={{ borderRadius: '20px' }}
                      position='relative'
                    >
                      <AnyMedia
                        image={offer.nft.image ?? offer.collection.metadata.avatar}
                        video={offer.nft.animation_url}
                        title={offer.nft.name ?? offer.collection.name}
                        className="img-fluid img-rounded"
                      />
                    </Box>
                    <Text>{offer.nft.name ?? offer.collection.name}</Text>
                  </HStack>
                </Box>
                <Box>
                  <HStack spacing={1} h="full">
                    <Image src="/img/logos/cdc_icon.svg" width={16} height={16} />
                    <Box>{commify(offer.price)}</Box>
                  </HStack>
                </Box>
                <AccordionButton w='auto'>
                  <AccordionIcon />
                </AccordionButton>
              </Flex>
              <AccordionPanel pb={4}>
                <Flex justify="space-between" fontSize="sm">
                  <Stack direction="row" spacing={2}>
                    <Text fontWeight="bold">Offer Time:</Text>
                    <Text>{getOfferDate(offer.listingTime)} ago</Text>
                  </Stack>
                </Flex>
                <Flex>
                  {offer.state === OfferState.ACTIVE && (
                    <>
                      <Button
                        type="legacy"
                        onClick={onUpdate}
                        className="w-100"
                      >
                        Update
                      </Button>
                      <Button
                        type="legacy-outlined"
                        onClick={onCancel}
                        className="ms-2 w-100"
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

export default ResponsiveOffersTable;