import {
  Accordion,
  AccordionItem,
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
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import {round, username} from "@src/utils";
import Link from "next/link";
import ImageService from "@src/core/services/image";
import {CdnImage} from "@src/components-v2/shared/media/cdn-image";
import Blockies from "react-blockies";
import {XPProfile} from "@src/core/services/api-service/types";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {commify} from "ethers/lib/utils";


interface ResponsiveRewardsCollectionsTableProps {
  data: InfiniteData<IPaginatedList<XPProfile>>;
  breakpointValue?: string
}

const ResponsiveXPLeaderboardTable = ({data, breakpointValue}: ResponsiveRewardsCollectionsTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'md']: false}, {fallback: 'lg'})
  return shouldUseAccordion ? <DataAccordion data={data} /> : <DataTable data={data} />;
}

const DataTable = ({data}: ResponsiveRewardsCollectionsTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const textColor = useColorModeValue('#727272', '#a2a2a2');
  
  return (
    <TableContainer 
      w='full' 
      maxW={'700px'} 
      minH={'500px'}
    >
      <Table variant='simple' color={textColor}>
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th cursor='pointer' colSpan={2}>Name</Th>
            <Th cursor='pointer'>XP Points</Th>
          </Tr>
        </Thead>
        <Tbody>
        {data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((entity, index) => (
            <LinkBox as={Tr} key={`${entity.walletAddress}`} _hover={{bg: hoverBackground}} textDecoration='none'>
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
                      alt={entity.username}
                      width="50"
                      height="50"
                    />
                  </Box>
                ) : (
                  <Blockies seed={entity.walletAddress.toLowerCase()} size={10} scale={5} />
                )}
              </Td>
              <Td fontWeight='bold'>
                <LinkOverlay href={`/account/${entity.walletAddress}`} _hover={{color:'inherit'}}>
                  <VStack alignItems={'left'}>
                    <>{username(entity.username)}</>
                    <Text fontSize={'14px'} isTruncated maxW={'300px'} textAlign={'left'}>
                      Lvl: {entity.level}
                    </Text>
                  </VStack>
                </LinkOverlay>
                {/* {entity.type === 'COLLECTION' && (
                  <LinkOverlay href={`/collection/${entity.walletAddress}`} _hover={{color:'inherit'}}>
                    {entity.name}
                  </LinkOverlay>
                )}
                {entity.type === 'WALLET' && (
                  <LinkOverlay href={`/account/${entity.walletAddress}`} _hover={{color:'inherit'}}>
                    {shortAddress(entity.username)}
                  </LinkOverlay>
                )} */}
              </Td>
              <Td>
                {commify(round(entity.experience, 2))}
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

const DataAccordion = ({data}: ResponsiveRewardsCollectionsTableProps) => {
  return (
    <>
      <Accordion w='full' allowMultiple>
      {data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((entity, index) => (
          <AccordionItem key={entity.walletAddress}>
            <Flex w='100%' my={2}>
              <Box my="auto" fontWeight="bold" fontSize="sm" me={2}>{index + 1}</Box>
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
                          alt={entity.username}
                        />
                      </Box>
                    ) : (
                      <Blockies seed={entity.walletAddress.toLowerCase()} size={10} scale={5} />
                    )}
                  </Box>
                  <VStack align='start' spacing={0} flex='1' fontSize='sm'>
                    <Link href={`/account/${entity.walletAddress}`}>
                      <>{username(entity.username)}</>
                    </Link>
                    <Text fontSize={'12px'} isTruncated maxW={'300px'} textAlign={'left'}>
                      Lvl: {entity.level}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
              <Box>
                <VStack align='end' spacing={0} fontSize='sm'>
                  <Stat size='sm' textAlign='end'>
                    <StatLabel>Points</StatLabel>
                    <StatNumber>
                      <Box fontWeight='bold'>{commify(round(entity.experience, 2))}</Box>
                    </StatNumber>
                  </Stat>
                </VStack>
              </Box>
            </Flex>
          </AccordionItem>
            ))}
          </React.Fragment>
        ))}
      </Accordion>
    </>
  )
};


export default ResponsiveXPLeaderboardTable;