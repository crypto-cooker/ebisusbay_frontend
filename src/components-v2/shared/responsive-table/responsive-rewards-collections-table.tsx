import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Image as ChakraImage,
  LinkBox,
  LinkOverlay,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import React from "react";
import {shortAddress} from "@src/utils";
import Link from "next/link";
import ImageService from "@src/core/services/image";
import {CdnImage} from "@src/components-v2/shared/media/cdn-image";
import Blockies from "react-blockies";
import {commify} from "ethers/lib/utils";

interface ResponsiveRewardsCollectionsTableProps {
  data: Array<{ name: string, address: string; points: number; type: string, avatar?: string, rank: number }>;
  onSort: (field: string) => void;
  breakpointValue?: string
}

const ResponsiveRewardsCollectionsTable = ({data, onSort, breakpointValue}: ResponsiveRewardsCollectionsTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'md']: false}, {fallback: 'lg'})

  return shouldUseAccordion ? (
    <DataAccordion data={data} onSort={onSort} />
  ) : (
    <DataTable data={data} onSort={onSort} />
  )
}

const DataTable = ({data, onSort}: ResponsiveRewardsCollectionsTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const textColor = useColorModeValue('#727272', '#a2a2a2');

  return (
    <TableContainer w='full'>
      <Table variant='simple' color={textColor}>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th cursor='pointer' colSpan={2}>Name</Th>
            <Th onClick={() => onSort('price')} cursor='pointer'>Points</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((entity) => (
            <LinkBox as={Tr} key={`${entity.address}`} _hover={{bg: hoverBackground}} textDecoration='none'>
              <Td>{entity.rank}</Td>
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
                      alt={entity.name}
                      width="50"
                      height="50"
                    />
                  </Box>
                ) : (
                  <Blockies seed={entity.address.toLowerCase()} size={10} scale={5} />
                )}
              </Td>
              <Td fontWeight='bold'>
                {entity.type === 'COLLECTION' && (
                  <LinkOverlay href={`/collection/${entity.address}`} _hover={{color:'inherit'}}>
                    {entity.name}
                  </LinkOverlay>
                )}
                {entity.type === 'WALLET' && (
                  <LinkOverlay href={`/account/${entity.address}`} _hover={{color:'inherit'}}>
                    {shortAddress(entity.name)}
                  </LinkOverlay>
                )}
              </Td>
              <Td>
                {commify(entity.points)}
              </Td>
            </LinkBox>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const DataAccordion = ({data, onSort}: ResponsiveRewardsCollectionsTableProps) => {
  return (
    <>
      <Accordion w='full' allowMultiple>
        {data.map((entity) => (
          <AccordionItem key={entity.address}>
            <Flex w='100%' my={2}>
              <Box my="auto" fontWeight="bold" fontSize="sm" me={2}>{entity.rank}</Box>
              <Box flex='1' textAlign='left' fontWeight='bold' my='auto'>
                <HStack>
                  <Box position='relative'>
                    {entity.avatar ? (
                      <Box
                        width='40px'
                        height='40px'
                        position='relative'
                        rounded='full'
                        overflow='hidden'
                      >
                        <ChakraImage
                          src={ImageService.translate(entity.avatar).avatar()}
                          alt={entity.name}
                        />
                      </Box>
                    ) : (
                      <Blockies seed={entity.address.toLowerCase()} size={10} scale={5} />
                    )}
                  </Box>
                  <VStack align='start' spacing={0} flex='1' fontSize='sm'>
                    {entity.type === 'COLLECTION' && (
                      <Link href={`/collection/${entity.address}`}>
                        {entity.name}
                      </Link>
                    )}
                    {entity.type === 'WALLET' && (
                      <Link href={`/account/${entity.address}`}>
                        {shortAddress(entity.name)}
                      </Link>
                    )}
                  </VStack>
                </HStack>
              </Box>
              <Box>
                <VStack align='end' spacing={0} fontSize='sm'>
                  <Stat size='sm' textAlign='end'>
                    <StatLabel>Points</StatLabel>
                    <StatNumber>
                      <Box fontWeight='bold'>{entity.points}</Box>
                    </StatNumber>
                  </Stat>
                </VStack>
              </Box>
              {/*<AccordionButton w='auto'>*/}
              {/*  <AccordionIcon />*/}
              {/*</AccordionButton>*/}
            </Flex>
            <AccordionPanel px={0}>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
};


export default ResponsiveRewardsCollectionsTable;