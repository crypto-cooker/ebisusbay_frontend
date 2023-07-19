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
import {round, shortAddress, timeSince} from "@src/utils";
import Image from "next/image";
import Link from "next/link";
import ImageService from "@src/core/services/image";
import {CdnImage} from "@src/components-v2/shared/media/cdn-image";
import Blockies from "react-blockies";
import {commify} from "ethers/lib/utils";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import moment from "moment/moment";

interface ResponsiveNftListingsTableProps {
  data: Array<{listingId: string, seller: string, amount: number, price: number, listingTime: number, expirationDate: number, avatar?: string}>;
  breakpointValue?: string;
  onAddToCart: (offer: any) => void;
}

const ResponsiveNftListingsTable = ({data, breakpointValue, onAddToCart}: ResponsiveNftListingsTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'md']: false}, {fallback: 'lg'})
  const size = useBreakpointValue({base: 1, lg: 2, xl: 3}, {fallback: 'lg'})

  return size === 1 ? (
    <DataAccordion data={data} onAddToCart={onAddToCart} />
  ) : size === 2 ? (
    <DataTableSm data={data} onAddToCart={onAddToCart} />
  ) : (
    <DataTableLg data={data} onAddToCart={onAddToCart} />
  );
}

const DataTableLg = ({data, onAddToCart}: ResponsiveNftListingsTableProps) => {
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
            <Th>Price</Th>
            <Th>Qty</Th>
            <Th colSpan={2}>User</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((entity, index) => (
            <Tr key={entity.listingId} _hover={{bg: hoverBackground}}>
              <Td>
                <HStack>
                  <Image src="/img/logos/cdc_icon.svg" width={16} height={16} alt="Cronos Logo" />
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
              <Td textAlign='end'>
                <PrimaryButton onClick={onAddToCart}>
                  Add to Cart
                </PrimaryButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const DataTableSm = ({data, onAddToCart}: ResponsiveNftListingsTableProps) => {
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
            <Th>Price</Th>
            <Th>User</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((entity, index) => (
            <Tr key={entity.listingId} _hover={{bg: hoverBackground}}>
              <Td>
                <HStack>
                  <Image src="/img/logos/cdc_icon.svg" width={16} height={16} alt="Cronos Logo" />
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
              <Td textAlign='end'>
                <PrimaryButton onClick={() => onAddToCart(entity)} size='sm'>
                  Add to Cart
                </PrimaryButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const DataAccordion = ({data, onAddToCart}: ResponsiveNftListingsTableProps) => {
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
        {data.map((entity, index) => (
          <AccordionItem key={entity.listingId}>
            <Flex w='100%' my={2}>
              <Stat>
                <StatNumber>
                  <HStack >
                    <Image src="/img/logos/cdc_icon.svg" width={16} height={16} alt="Cronos Logo" />
                    <Box fontWeight='bold'>{entity.price}</Box>
                  </HStack></StatNumber>
                <StatHelpText>Qty: {entity.amount}</StatHelpText>
              </Stat>
              <Box my='auto'>
                <PrimaryButton onClick={() => onAddToCart(entity)} size='sm'>
                  Add to Cart
                </PrimaryButton>
              </Box>
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
      </Accordion>
    </>
  )
};

export default ResponsiveNftListingsTable;