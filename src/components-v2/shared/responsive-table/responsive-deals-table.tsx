import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Button as ChakraButton,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tag,
  TagLeftIcon,
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
import {Offer} from "@src/core/models/offer";
import {getLengthOfTime, shortAddress, timeSince} from "@market/helpers/utils";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {AbbreviatedDeal} from "@src/core/services/api-service/mapi/types";
import Link from "next/link";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {OrderState} from "@src/core/services/api-service/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarPlus, faClock, faEye} from "@fortawesome/free-solid-svg-icons";

interface ResponsiveOffersTableProps {
  data: InfiniteData<IPaginatedList<AbbreviatedDeal>>;
  state: OrderState;
  onUpdate?: (offer: Offer) => void;
  onCancel?: (offer: Offer) => void;
  onSort: (field: string) => void;
  breakpointValue?: string;
}

const ResponsiveDealsTable = ({data, state, onUpdate, onCancel, onSort, breakpointValue}: ResponsiveOffersTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'md']: false}, {fallback: 'md'})

  return shouldUseAccordion ? (
    <DataAccordion data={data} state={state} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} />
  ) : (
    <DataTable data={data} state={state} onUpdate={onUpdate} onCancel={onCancel} onSort={onSort} />
  )
}


const DataTable = ({data, state, onUpdate, onCancel, onSort}: ResponsiveOffersTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  return (
    <TableContainer w='full'>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>From</Th>
            <Th>To</Th>
            <Th>Items</Th>
            <Th onClick={() => onSort('listingtime')} cursor='pointer'>Created</Th>
            {state === OrderState.COMPLETED ? (
              <Th onClick={() => onSort('saletime')} cursor='pointer'>Completed</Th>
            ) : [OrderState.CANCELLED, OrderState.REJECTED].includes(state) ? (
              <Th>Ended</Th>
            ) : (
              <Th onClick={() => onSort('expirationdate')} cursor='pointer'>
                {state === OrderState.EXPIRED ? <>Expired</> : <>Expires</>}
              </Th>
            )}
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.data.map((deal) => (
                <Tr key={deal.id} _hover={{bg: hoverBackground}}>
                  <Td w='50px'>
                    <Link href={`/account/${deal.maker}`}>{shortAddress(deal.maker)}</Link>
                  </Td>
                  <Td>
                    <Link href={`/account/${deal.taker}`}>{shortAddress(deal.taker)}</Link>
                  </Td>
                  <Td>
                    {deal.maker_types.reduce((acc, item) => acc + item, 0)} : {deal.taker_types.reduce((acc, item) => acc + item, 0)}
                  </Td>
                  <Td>
                    {getLengthOfTime(Math.floor(Date.now() / 1000) - deal.start_at)} ago
                  </Td>
                  <Td>
                    {state === OrderState.COMPLETED ? (
                      <>{deal.completed_at ? `${getLengthOfTime(Math.floor((new Date().getTime() - new Date(deal.completed_at).getTime()) / 1000))} ago` : 'N/A'}</>
                    ) : [OrderState.CANCELLED, OrderState.REJECTED].includes(state) ? (
                      <>{deal.cancelled_at ? `${getLengthOfTime(Math.floor((new Date().getTime() - new Date(deal.cancelled_at).getTime()) / 1000))} ago` : 'N/A'}</>
                    ) : (
                      <>{getLengthOfTime(deal.end_at - Math.floor(Date.now() / 1000))}</>
                    )}
                  </Td>
                  <Td>
                    <Flex justify='end'>
                      <Link href={`/deal/${deal.id}`}>
                        <PrimaryButton leftIcon={<Icon as={FontAwesomeIcon} icon={faEye}/>}>
                          View
                        </PrimaryButton>
                      </Link>
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

const DataAccordion = ({data, state, onSort, onUpdate, onCancel}: ResponsiveOffersTableProps) => {
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
            <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => onSort('listingtime')}>
              Create Time
            </ChakraButton>
            <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => onSort('saletime')}>
              Sale Time
            </ChakraButton>
            <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => onSort('expirationdate')}>
              Expiration
            </ChakraButton>
          </ButtonGroup>
        </HStack>
      </Box>
      <Accordion w='full' allowMultiple>
        {data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((deal) => (
              <AccordionItem key={deal.id}>
                <Flex w='100%' my={2}>
                  <Box flex='1' textAlign='left' my='auto'>
                    <VStack align='start' fontSize='sm'>
                      <Box flex='1'>
                        <strong>{shortAddress(deal.maker)}</strong> -{'>'} <strong>{shortAddress(deal.taker)}</strong>
                      </Box>
                      <Box flex='1'>
                        {state === OrderState.COMPLETED ? (
                          <>Completed {deal.completed_at ? `${getLengthOfTime(Math.floor((new Date().getTime() - new Date(deal.completed_at).getTime()) / 1000))} ago` : 'N/A'}</>
                        ) : [OrderState.CANCELLED, OrderState.REJECTED].includes(state) ? (
                          <>Cancelled {deal.cancelled_at ? `${getLengthOfTime(Math.floor((new Date().getTime() - new Date(deal.cancelled_at).getTime()) / 1000))} ago` : 'N/A'}</>
                        ) : (
                          <HStack>
                            <Tag>
                              <TagLeftIcon as={FontAwesomeIcon} icon={faCalendarPlus} />
                              {getLengthOfTime(Math.floor(Date.now() / 1000) - deal.start_at)} ago
                            </Tag>
                            <Tag>
                              <TagLeftIcon as={FontAwesomeIcon} icon={faClock} />
                              in {getLengthOfTime(deal.end_at - Math.floor(Date.now() / 1000))}
                            </Tag>
                          </HStack>
                        )}
                      </Box>
                    </VStack>
                  </Box>
                  <VStack ms={2} align='end' spacing={0} fontSize='sm'>
                    <Stat size='sm' textAlign='end'>
                      <StatLabel>
                        Items
                      </StatLabel>
                      <StatNumber>
                        {deal.maker_types.reduce((acc, item) => acc + item, 0)} : {deal.taker_types.reduce((acc, item) => acc + item, 0)}
                      </StatNumber>
                    </Stat>
                  </VStack>
                  <Box
                    width='40px'
                    height='40px'
                    position='relative'
                    overflow='hidden'
                    ms={4}
                    my='auto'
                  >
                    <Link href={`/deal/${deal.id}`}>
                      <IconButton
                        icon={<Icon as={FontAwesomeIcon} icon={faEye}/>}
                        aria-label='View Deal'
                        variant='primary'
                        size='sm'
                      />
                    </Link>
                  </Box>
                </Flex>
                <AccordionPanel pb={4} px={0}>
                  <Flex justify='space-around' textAlign='center' fontSize='sm' bg={hoverBackground} rounded='md' py={2}>
                    <>rank</>
                    <>time</>
                  </Flex>
                  state
                </AccordionPanel>
              </AccordionItem>
            ))}
          </React.Fragment>
        ))}
      </Accordion>
    </>
  )
};

export default ResponsiveDealsTable;