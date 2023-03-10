import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
  Table,
  TableContainer,
  Tag,
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
import {round, siPrefixedNumber} from "@src/utils";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {commify} from "ethers/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {CdnImage} from "@src/Components/components/CdnImage";
import {hostedImage} from "@src/helpers/image";
import Blockies from "react-blockies";
import {ethers} from "ethers";
import {BlueCheckIcon} from "@src/components-v2/shared/icons/blue-check";
import styled from "styled-components";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import {AnyMedia} from "@src/Components/components/AnyMedia";

interface ResponsiveCollectionsTableProps {
  data: InfiniteData<AxiosResponse<IPaginatedList<any>>>;
  timeFrame: string | null;
  onSort: (field: string) => void;
  breakpointValue?: string
  primarySort?: SortKeys;
}

export type SortKeys = 'totalvolume' | 'totalsales' | 'totalfloorprice' | 'totalaveragesaleprice' | 'totalactive';

const ResponsiveCollectionsTable = ({data, timeFrame, onSort, breakpointValue, primarySort = 'totalvolume'}: ResponsiveCollectionsTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'lg']: false}, {fallback: 'lg'})

  return shouldUseAccordion ? (
    <DataAccordion data={data} timeFrame={timeFrame} primarySort={primarySort} />
  ) : (
    <DataTable data={data} timeFrame={timeFrame} onSort={onSort} />
  )
}


const DataTable = ({data, timeFrame, onSort}: Pick<ResponsiveCollectionsTableProps, 'data' | 'timeFrame' | 'onSort'>) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const textColor = useColorModeValue('#727272', '#a2a2a2');

  return (
    <TableContainer w='full'>
      <Table variant='simple' color={textColor}>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th cursor='pointer' colSpan={2}>Collection</Th>
            <Th isNumeric onClick={() => onSort('totalvolume')} cursor='pointer'>
              <HStack spacing={1} justify="right">
                <Text>Volume</Text>
                {!!timeFrame && (
                  <Tag size="sm">{timeFrame}</Tag>
                )}
              </HStack>
            </Th>
            <Th isNumeric onClick={() => onSort('totalsales')} cursor='pointer'>
              <HStack spacing={1} justify="right">
                <Text>Sales</Text>
                {!!timeFrame && (
                  <Tag size="sm">{timeFrame}</Tag>
                )}
              </HStack>
            </Th>
            <Th isNumeric onClick={() => onSort('totalfloorprice')} cursor='pointer'>Floor Price</Th>
            <Th isNumeric onClick={() => onSort('totalaveragesaleprice')}>
              <HStack spacing={1} justify="right">
                <Text>Avg Price</Text>
                {!!timeFrame && (
                  <Tag size="sm">{timeFrame}</Tag>
                )}
              </HStack>
            </Th>
            <Th isNumeric onClick={() => onSort('totalactive')}>Active</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.pages.map((page: any, pageIndex: number) => (
            <React.Fragment key={pageIndex}>
              {page.map((collection: any, index: number) => (
                <LinkBox as={Tr} key={`${timeFrame}${page}${index}`} _hover={{bg: hoverBackground}} textDecoration='none'>
                  <Td>{(pageIndex * 50) + (index + 1)}</Td>
                  <Td w='50px'>
                    {collection.metadata?.avatar ? (
                      <Box
                        width={50}
                        height={50}
                        position='relative'
                        rounded='full'
                        overflow='hidden'
                      >
                        <CdnImage
                          src={hostedImage(collection.metadata.avatar, true)}
                          alt={collection?.name}
                          width="50"
                          height="50"
                        />
                      </Box>
                    ) : (
                      <Blockies seed={collection.collection.toLowerCase()} size={10} scale={5} />
                    )}
                  </Td>
                  <Td fontWeight='bold'>
                    <LinkOverlay href={`/collection/${collection.slug}`} _hover={{color:'inherit'}}>
                      {collection?.name ?? 'Unknown'}
                    </LinkOverlay>
                    {collection.verification?.verified && (
                      <Box as='span' ms={2}>
                        <BlueCheckIcon />
                      </Box>
                    )}
                  </Td>
                  <Td isNumeric>
                    <RichDataTableCell
                      value={siPrefixedNumber(collectionVolume(collection, timeFrame))}
                      change={collection.volume1dIncrease}
                      isCroValue={true}
                      showChange={false}
                    />
                  </Td>
                  <Td isNumeric>
                    <RichDataTableCell
                      value={siPrefixedNumber(collectionSales(collection, timeFrame))}
                      change={collection.sales1dIncrease}
                      isCroValue={false}
                      showChange={false}
                    />
                  </Td>
                  <Td isNumeric>
                    <RichDataTableCell
                      value={collection.listable && collection.numberActive > 0 ? siPrefixedNumber(Math.round(collection.floorPrice ?? 0)) : 0}
                      change={0}
                      isCroValue={true}
                      showChange={false}
                    />
                  </Td>
                  <Td isNumeric>
                    <RichDataTableCell
                      value={collectionAveragePrices(collection, timeFrame)}
                      change={collection.avgSalePrice1dIncrease}
                      isCroValue={true}
                      showChange={false}
                    />
                  </Td>
                  <Td isNumeric>
                    <RichDataTableCell
                      value={siPrefixedNumber(collection.numberActive)}
                      change={0}
                      isCroValue={false}
                      showChange={false}
                    />
                  </Td>
                </LinkBox>
              ))}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const DataAccordion = ({data, timeFrame, primarySort}: Pick<ResponsiveCollectionsTableProps, 'data' | 'timeFrame' | 'primarySort'>) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const stats = (collection: any): {[key: string]: { field: string, value: any }} => ({
    totalvolume: {
      field: 'Volume',
      value: siPrefixedNumber(collectionVolume(collection, timeFrame))
    },
    totalsales: {
      field: 'Sales',
      value: siPrefixedNumber(collectionSales(collection, timeFrame))
    },
    totalfloorprice: {
      field: 'Floor',
      value: collection.listable && collection.numberActive > 0 ? siPrefixedNumber(Math.round(collection.floorPrice ?? 0)) : 'N/A'
    },
    totalaveragesaleprice: {
      field: 'Avg',
      value: collectionAveragePrices(collection, timeFrame)
    },
    totalactive: {
      field: 'Active',
      value: siPrefixedNumber(collection.numberActive)
    },
  });

  return (
    <Accordion w='full' allowMultiple>
      {data.pages.map((page: any, pageIndex: any) => (
        <React.Fragment key={pageIndex}>
          {page.map((collection: any, index: number) => (
            <AccordionItem key={collection.listingId}>
              <Flex w='100%' my={2}>
                <Box my="auto" fontWeight="bold" fontSize="sm" me={2}>{(pageIndex * 50) + (index + 1)}</Box>
                <Box flex='1' textAlign='left' fontWeight='bold' my='auto'>
                  <HStack>
                    <Box position='relative'>
                      {collection.metadata?.avatar ? (
                        <Box
                          width='40px'
                          height='40px'
                          position='relative'
                          rounded='full'
                          overflow='hidden'
                        >
                          <AnyMedia
                            image={hostedImage(collection.metadata.avatar, true)}
                            video=''
                            title={collection?.name}
                          />
                        </Box>
                      ) : (
                        <Blockies seed={collection.collection.toLowerCase()} size={10} scale={5} />
                      )}
                      <VerifiedIcon>
                        <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={7} />
                      </VerifiedIcon>
                    </Box>
                    <VStack align='start' spacing={0} flex='1' fontSize='sm'>
                      <Link href={`/collection/${collection.slug}`}>
                        {collection.name}
                      </Link>
                      {collection.listable && collection.numberActive > 0 && !!collection.floorPrice && (
                        <Text fontWeight='normal' fontSize='xs' className='text-muted'>
                          Floor: {`${siPrefixedNumber(Math.round(collection.floorPrice))} CRO`}
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                </Box>
                <Box>
                  <VStack align='end' spacing={0} fontSize='sm'>
                    <Text>{stats(collection)[primarySort as SortKeys].field}</Text>
                    <HStack spacing={1} h="full">
                      <Image src="/img/logos/cdc_icon.svg" width={16} height={16} alt="Cronos Logo" />
                      <Box fontWeight='bold'>{stats(collection)[primarySort as SortKeys].value}</Box>
                    </HStack>
                  </VStack>
                </Box>
                <AccordionButton w='auto' _hover={{bg: 'none'}}>
                  <AccordionIcon />
                </AccordionButton>
              </Flex>
              <AccordionPanel px={0}>
                <SimpleGrid columns={4} textAlign='center' fontSize='sm' bg={hoverBackground} rounded='md' py={2}>
                  {primarySort !== 'totalvolume' && (
                    <Stack spacing={0}>
                      <Text fontWeight='bold'>Volume</Text>
                      <Text>{siPrefixedNumber(collectionVolume(collection, timeFrame))}</Text>
                    </Stack>
                  )}
                  {primarySort !== 'totalsales' && (
                    <Stack spacing={0}>
                      <Text fontWeight='bold'>Sales</Text>
                      <Text>{siPrefixedNumber(collectionSales(collection, timeFrame))}</Text>
                    </Stack>
                  )}
                  {primarySort !== 'totalfloorprice' && (
                    <Stack spacing={0}>
                      <Text fontWeight='bold'>Floor</Text>
                      {collection.listable && collection.numberActive > 0 && !!collection.floorPrice ? (
                        <HStack spacing={1} w="full" justify="center">
                          <Image src="/img/logos/cdc_icon.svg" width={16} height={16} alt="Cronos Logo" />
                          <Box>{siPrefixedNumber(Math.round(collection.floorPrice))}</Box>
                        </HStack>
                      ) : (
                        <>-</>
                      )}
                    </Stack>
                  )}
                  {primarySort !== 'totalaveragesaleprice' && (
                    <Stack spacing={0}>
                      <Text fontWeight='bold'>Avg</Text>
                      <HStack spacing={1} w="full" justify="center">
                        <Image src="/img/logos/cdc_icon.svg" width={16} height={16} alt="Cronos Logo" />
                        <Box>{collectionAveragePrices(collection, timeFrame)}</Box>
                      </HStack>
                    </Stack>
                  )}
                  {primarySort !== 'totalactive' && (
                    <Stack spacing={0}>
                      <Text fontWeight='bold'>Active</Text>
                      <Text>{siPrefixedNumber(collection.numberActive)}</Text>
                    </Stack>
                  )}
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </React.Fragment>
      ))}
    </Accordion>
  )
};

const RichDataTableCell = ({value, change, isCroValue, showChange}: {value?: number | string, change?: number | string, isCroValue: boolean, showChange: boolean}) => {
  return (
    <Stat>
      <StatNumber>
        {value ? (
          <HStack align='center' justify='end'>
            <Text fontSize='md'>{value}</Text>
            {isCroValue && <Image src="/img/logos/cdc_icon.svg" width={16} height={16} alt="Cronos Logo" />}
          </HStack>
        ) : (
          <>-</>
        )}
      </StatNumber>
      {showChange && (
        <StatHelpText>
          {change && Number(change) !== 0 ? (
            <>
              <StatArrow type={Number(change) > 0 ? 'increase' : 'decrease'} />
              {commify(round(change, 2))}%
            </>
          ) : (
            <>-</>
          )}
        </StatHelpText>
      )}
    </Stat>
  )
}

const collectionVolume = (collection: any, timeFrame: string | null) => {
  if (timeFrame === null) return Math.round(collection.totalVolume);
  if (timeFrame === '1d') return Math.round(collection.volume1d);
  if (timeFrame === '7d') return Math.round(collection.volume7d);
  if (timeFrame === '30d') return Math.round(collection.volume30d);
};

const collectionSales = (collection: any, timeFrame: string | null) => {
  if (timeFrame === null) return Math.round(collection.numberOfSales);
  if (timeFrame === '1d') return Math.round(collection.sales1d);
  if (timeFrame === '7d') return Math.round(collection.sales7d);
  if (timeFrame === '30d') return Math.round(collection.sales30d);
};

const collectionAveragePrices = (collection: any, timeFrame: string | null) => {
  if (timeFrame === null) return ethers.utils.commify(Math.round(collection.averageSalePrice));
  if (timeFrame === '1d') return Math.round(Math.round(collection.averageSalePrice1d));
  if (timeFrame === '7d') return Math.round(Math.round(collection.averageSalePrice7d));
  if (timeFrame === '30d') return Math.round(Math.round(collection.averageSalePrice30d));
};

const VerifiedIcon = styled.span`
  font-size: 8px;
  color: #ffffff;
  background: $color;
  border-radius: 100%;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  position: absolute;
  bottom: -2px;
  right: -2px;
  z-index: 2;
`;

export default ResponsiveCollectionsTable;