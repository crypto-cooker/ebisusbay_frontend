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
  useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import {Offer} from "@src/core/models/offer";
import {getLengthOfTime, shortAddress, shortString, timeSince} from "@src/utils";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {AbbreviatedDeal} from "@src/core/services/api-service/mapi/types";
import Link from "next/link";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {OrderState} from "@src/core/services/api-service/types";

interface ResponsiveOffersTableProps {
  data: InfiniteData<IPaginatedList<AbbreviatedDeal>>;
  state: OrderState;
  onUpdate: (offer: Offer) => void;
  onCancel: (offer: Offer) => void;
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
            <Th onClick={() => onSort('maker')}>From</Th>
            <Th onClick={() => onSort('taker')} cursor='pointer'>To</Th>
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
                    {shortString(deal.maker)}
                  </Td>
                  <Td>
                    {shortAddress(deal.taker)}
                  </Td>
                  <Td>
                    5
                  </Td>
                  <Td>
                    {getLengthOfTime(Math.floor(Date.now() / 1000) - deal.start_at)} ago
                  </Td>
                  <Td>
                    {state === OrderState.COMPLETED ? (
                      <>{deal.completed_at ? getLengthOfTime(Math.floor((new Date(deal.completed_at).getTime() - new Date().getTime()) / 1000)) : 'N/A'}</>
                    ) : [OrderState.CANCELLED, OrderState.REJECTED].includes(state) ? (
                      <>{deal.cancelled_at ? getLengthOfTime(Math.floor((new Date(deal.cancelled_at).getTime() - new Date().getTime()) / 1000)) : 'N/A'}</>
                    ) : (
                      <>{getLengthOfTime(deal.end_at - Math.floor(Date.now() / 1000))}</>
                    )}
                  </Td>
                  <Td>
                    <Flex>
                      <Link href={`/deal/${deal.id}`}>
                        <PrimaryButton>
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
        {data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((deal) => (
              <AccordionItem key={deal.id}>
                <Flex w='100%' my={2}>
                  <Box flex='1' textAlign='left' my='auto'>
                    <HStack>
                      <Box
                        width='40px'
                        position='relative'
                        rounded='md'
                        overflow='hidden'
                      >
                        img
                      </Box>

                      <Box flex='1' fontSize='sm'>
                        name
                      </Box>
                    </HStack>
                  </Box>
                  <Box ms={2}>
                    price
                  </Box>
                  <AccordionButton w='auto'>
                    <AccordionIcon />
                  </AccordionButton>
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