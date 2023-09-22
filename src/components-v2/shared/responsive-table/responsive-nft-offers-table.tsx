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
  LinkBox,
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
  useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import {Offer} from "@src/core/models/offer";
import {shortAddress, timeSince} from "@src/utils";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {commify} from "ethers/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Blockies from "react-blockies";
import {useAppSelector} from "@src/Store/hooks";
import {useQuery} from "@tanstack/react-query";
import {getProfile} from "@src/core/cms/endpoints/profile";
import ImageService from "@src/core/services/image";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";

interface ResponsiveNftOffersTableProps {
  data: InfiniteData<IPaginatedList<Offer>>;
  onUpdate?: (offer: Offer) => void;
  onCancel?: (offer: Offer) => void;
  onSort: (field: string) => void;
  breakpointValue?: string
}

const ResponsiveNftOffersTable = ({data, onUpdate, onCancel, onSort, breakpointValue}: ResponsiveNftOffersTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'sm']: false}, {fallback: 'sm'})

  return shouldUseAccordion ? (
    <DataAccordion data={data} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} />
  ) : (
    <DataTable data={data} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} />
  )
}


const DataTable = ({data, onUpdate, onCancel, onSort}: ResponsiveNftOffersTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const user = useAppSelector((state) => state.user);

  const getOfferDate = (timestamp: number) => {
    return timeSince(new Date(timestamp * 1000));
  };

  return (
    <TableContainer w='full'>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>User</Th>
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
                  <Td pe={2}>
                    <ProfileCell address={offer.purchaser} />
                  </Td>
                  {/*<Td fontWeight='bold' ps={2}>*/}
                  {/*  <Link href={`/account/${offer.purchaser}`}>*/}
                  {/*    {shortAddress(offer.purchaser)}*/}
                  {/*  </Link>*/}
                  {/*</Td>*/}
                  <Td>
                    <HStack spacing={1}>
                      <CronosIconBlue boxSize={4} />
                      <Box>{commify(offer.price)}</Box>
                    </HStack>
                  </Td>
                  <Td>{getOfferDate(offer.listingTime)} ago</Td>
                </Tr>
              ))}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const DataAccordion = ({data, onSort, onUpdate, onCancel}: ResponsiveNftOffersTableProps) => {
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
            <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => onSort('price')}>
              Price
            </ChakraButton>
            <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => onSort('listingTime')}>
              Offer Time
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
                  <Box flex='1' textAlign='left' fontWeight='bold' my='auto'>

                    <ProfileCell address={offer.purchaser} />
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
                </AccordionPanel>
              </AccordionItem>
            ))}
          </React.Fragment>
        ))}
      </Accordion>
    </>
  )
};

export default ResponsiveNftOffersTable;

const ProfileCell = ({ address = '' }) => {

  const { isLoading, data } = useQuery({
    queryKey: ['user', address],
    queryFn: () => getProfile(address)
  })

  return (
    <LinkBox as={HStack}>
      <Box
        width={50}
        height={50}
        position='relative'
      >
          <Box className="author_list_pp" ms={0} mt={0}>
            {!isLoading && data?.data?.profilePicture ? (
              <img src={ImageService.translate(data?.data?.profilePicture).avatar()} alt={data?.data?.username ? data?.data?.username : shortAddress(address)} />
            ) : (
              <Blockies seed={address} size={10} scale={5} />
            )}
          </Box>
      </Box>
      <Box fontWeight='bold'>
        <Link href={`/account/${address}`}>
          {!!data?.data?.username ? (
            data.data.username.length > 25 ? shortAddress(data.data.username) : data.data.username
          ) : shortAddress(address)}
        </Link>
      </Box>
    </LinkBox>
  )
}