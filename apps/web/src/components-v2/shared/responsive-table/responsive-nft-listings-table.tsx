import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatNumber,
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
import {round, shortAddress, timeSince} from "@market/helpers/utils";
import Link from "next/link";
import ImageService from "@src/core/services/image";
import {CdnImage} from "@src/components-v2/shared/media/cdn-image";
import Blockies from "react-blockies";
import {commify} from "ethers/lib/utils";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import moment from "moment/moment";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {CurrencyLogoByAddress} from "@dex/components/logo";

interface ResponsiveNftListingsTableProps {
  data: InfiniteData<IPaginatedList<any>>;
  onSort: (field: string) => void;
  primarySort?: SortKeys;
  breakpointValue?: string;
  onAddToCart?: (offer: any) => void;
}

export type SortKeys = 'price' | 'amount';

const ResponsiveNftListingsTable = ({data, breakpointValue, onAddToCart, onSort, primarySort}: ResponsiveNftListingsTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'md']: false}, {fallback: 'lg'})
  const size = useBreakpointValue({base: 1, lg: 2, xl: 3}, {fallback: 'lg'})

  return size === 1 ? (
    <DataAccordion data={data} onAddToCart={onAddToCart} primarySort={primarySort} />
  ) : size === 2 ? (
    <DataTableSm data={data} onAddToCart={onAddToCart} onSort={onSort} />
  ) : (
    <DataTableLg data={data} onAddToCart={onAddToCart} onSort={onSort} />
  );
}

const DataTableLg = ({data, onAddToCart, onSort}: Pick<ResponsiveNftListingsTableProps, 'data' | 'onAddToCart' | 'onSort'>) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const textColor = useColorModeValue('#727272', '#a2a2a2');

  const getTimeSince = (timestamp: number) => {
    return timeSince(new Date(timestamp * 1000));
  };

  return (
    <TableContainer w='full'>
      <Table variant='simple' color={textColor}>
        <Thead>
          <Tr>
            <Th onClick={() => onSort('price')} cursor='pointer'>Price</Th>
            <Th onClick={() => onSort('amount')} cursor='pointer'>Qty</Th>
            <Th colSpan={2}>User</Th>
            {!!onAddToCart && <Th></Th>}
          </Tr>
        </Thead>
        <Tbody>
          {data.pages.map((page: any, pageIndex: number) => (
            <React.Fragment key={pageIndex}>
              {page.data.map((entity: any, index: number) => (
                <Tr key={entity.listingId} _hover={{bg: hoverBackground}}>
                  <Td>
                    <HStack>
                      <CurrencyLogoByAddress address={entity.currency} chainId={entity.chain} size='16px' />
                      <Box>{commify(round(entity.price, 2))}</Box>
                    </HStack>
                  </Td>
                  <Td>
                    {entity.amount}
                  </Td>
                  <Td w='50px'>
                    {entity.avatar ? (
                      <Box
                        width={50}
                        height={50}
                        position='relative'
                        rounded='full'
                        overflow='hidden'
                      >
                        <CdnImage
                          src={ImageService.translate(entity.avatar).avatar()}
                          alt={entity.seller}
                          width="50"
                          height="50"
                        />
                      </Box>
                    ) : (
                      <Blockies seed={entity.seller.toLowerCase()} size={10} scale={3} />
                    )}
                  </Td>
                  <Td fontWeight='bold' ps={0}>
                    <Link href={`/account/${entity.seller}`}>
                      {shortAddress(entity.seller)}
                    </Link>
                  </Td>
                  {!!onAddToCart && (
                    <Td textAlign='end'>
                      <PrimaryButton onClick={() => onAddToCart(entity)}>
                        Add to Cart
                      </PrimaryButton>
                    </Td>
                  )}
                </Tr>
              ))}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const DataTableSm = ({data, onAddToCart, onSort}: Pick<ResponsiveNftListingsTableProps, 'data' | 'onAddToCart' | 'onSort'>) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const textColor = useColorModeValue('#727272', '#a2a2a2');

  const getTimeSince = (timestamp: number) => {
    return timeSince(new Date(timestamp * 1000));
  };

  return (
    <TableContainer w='full'>
      <Table variant='simple' color={textColor}>
        <Thead>
          <Tr>
            <Th onClick={() => onSort('price')} cursor='pointer'>Price</Th>
            <Th>User</Th>
            {!!onAddToCart && <Th></Th>}
          </Tr>
        </Thead>
        <Tbody>
          {data.pages.map((page: any, pageIndex: number) => (
            <React.Fragment key={pageIndex}>
              {page.data.map((entity: any, index: number) => (
                <Tr key={entity.listingId} _hover={{bg: hoverBackground}}>
                  <Td>
                    <HStack>
                      <CurrencyLogoByAddress address={entity.currency} chainId={entity.chain} size='16px' />
                      <Box>{commify(round(entity.price, 2))}</Box>
                    </HStack>
                    <Box fontSize='sm'>
                      <Text as='span' fontWeight='bold'>Qty:</Text> {entity.amount}
                    </Box>
                  </Td>
                  <Td fontWeight='bold' ps={0}>
                    <Stack direction='row' alignItems='middle'>
                      {entity.avatar ? (
                        <Box
                          width={50}
                          height={50}
                          position='relative'
                          rounded='full'
                          overflow='hidden'
                        >
                          <CdnImage
                            src={ImageService.translate(entity.avatar).avatar()}
                            alt={entity.seller}
                            width="50"
                            height="50"
                          />
                        </Box>
                      ) : (
                        <Blockies seed={entity.seller.toLowerCase()} size={10} scale={2} />
                      )}
                      <Box verticalAlign='middle'>
                        <Link href={`/account/${entity.seller}`}>
                          {shortAddress(entity.seller)}
                        </Link>
                      </Box>
                    </Stack>
                  </Td>
                  {!!onAddToCart && (
                    <Td textAlign='end'>
                      <PrimaryButton onClick={() => onAddToCart(entity)} size='sm'>
                        Add to Cart
                      </PrimaryButton>
                    </Td>
                  )}
                </Tr>
              ))}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const DataAccordion = ({data, onAddToCart, primarySort}: Pick<ResponsiveNftListingsTableProps, 'data' | 'onAddToCart' | 'primarySort'>) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const getTimeSince = (timestamp: number) => {
    return timeSince(new Date(timestamp * 1000));
  };

  const getFormattedDate = (timestamp: number) => {
    return moment(timestamp * 1000).format("MMM D yyyy");
  };

  return (
    <>
      <Accordion w='full' allowMultiple>
        {data.pages.map((page: any, pageIndex: number) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((entity: any, index: number) => (
              <AccordionItem key={entity.listingId}>
                <Flex w='100%' my={2}>
                  <Stat>
                    <StatNumber>
                      <HStack>
                        <CurrencyLogoByAddress address={entity.currency} chainId={entity.chain} size='16px' />
                        <Box fontWeight='bold'>{entity.price}</Box>
                      </HStack></StatNumber>
                    <StatHelpText>Qty: {entity.amount}</StatHelpText>
                  </Stat>
                  {!!onAddToCart && (
                    <Box my='auto'>
                      <PrimaryButton onClick={() => onAddToCart(entity)} size='sm'>
                        Add to Cart
                      </PrimaryButton>
                    </Box>
                  )}
                  <AccordionButton w='auto'>
                    <AccordionIcon />
                  </AccordionButton>
                </Flex>
                <AccordionPanel px={0}>
                  <SimpleGrid columns={3} textAlign='center' fontSize='sm' bg={hoverBackground} rounded='md' py={2}>
                    <Stack spacing={0}>
                      <Text fontWeight='bold'>Seller</Text>
                      <Link href={`/account/${entity.seller}`}>
                        <Text>{shortAddress(entity.seller)}</Text>
                      </Link>
                    </Stack>
                    <Stack spacing={0}>
                      <Text fontWeight='bold'>Date</Text>
                      <Text>{getFormattedDate(entity.listingTime)}</Text>
                    </Stack>
                    <Stack spacing={0}>
                      <Text fontWeight='bold'>Expires</Text>
                      <Text>{getTimeSince(entity.expirationDate)}</Text>
                    </Stack>
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </React.Fragment>
        ))}
      </Accordion>
    </>
  )
};

export default ResponsiveNftListingsTable;