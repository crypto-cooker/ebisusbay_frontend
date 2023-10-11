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
  VStack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import {shortAddress, timeSince} from "@src/utils";
import Link from "next/link";
import ImageService from "@src/core/services/image";
import {CdnImage} from "@src/components-v2/shared/media/cdn-image";
import Blockies from "react-blockies";
import { XPProfile } from "@src/core/services/api-service/types";
import {InfiniteData} from "@tanstack/query-core";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";


interface ResponsiveRewardsCollectionsTableProps {
  data: InfiniteData<IPaginatedList<XPProfile>>;
  onSort: (field: string) => void;
  breakpointValue?: string
  tabCallback: (key: string) => void;
}

const tabs = {
  week: 'week',
  month: 'month',
  all: 'all'
};

const ResponsiveXPLeaderboardTable = ({data, onSort, tabCallback, breakpointValue}: ResponsiveRewardsCollectionsTableProps) => {
  const shouldUseAccordion = useBreakpointValue({base: true, [breakpointValue ?? 'md']: false}, {fallback: 'lg'})
  const [openMenu, setOpenMenu] = React.useState(tabs.week);

  const handleBtnClick = (key: string) => (e: any) => {
    setOpenMenu(key);
    //filter data by key
    tabCallback(key);
  };

  return (
    <>
      <ul className="de_nav mb-2">
        <li id="Mainbtn0" className={`tab ${openMenu === tabs.week ? 'active' : ''}`}>
          <span onClick={handleBtnClick(tabs.week)}> Week</span>
        </li>
        <li id="Mainbtn0"className={`tab ${openMenu === tabs.month ? 'active' : ''}`}>
          <span onClick={handleBtnClick(tabs.month)}> Month</span>
        </li>
        <li id="Mainbtn1" className={`tab ${openMenu === tabs.all ? 'active' : ''}`}>
          <span onClick={handleBtnClick(tabs.all)}>All Time</span>
        </li>
      </ul>
      {shouldUseAccordion ? (
        <DataAccordion data={data} onSort={onSort} tabCallback={tabCallback}/>
      ) : (
        <DataTable data={data} onSort={onSort} tabCallback={tabCallback}/>
      )
      }
    </>
  )
}

const DataTable = ({data, onSort, tabCallback}: ResponsiveRewardsCollectionsTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const textColor = useColorModeValue('#727272', '#a2a2a2');
  
  return (
    <TableContainer w='full'>
      <Table variant='simple' color={textColor}>
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th cursor='pointer' colSpan={2}>Name</Th>
            <Th onClick={() => onSort('price')} cursor='pointer'>XP Points</Th>
          </Tr>
        </Thead>
        <Tbody>
        {data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((entity, index) => (
            <LinkBox as={Tr} key={`${entity.walletAddress}`} _hover={{bg: hoverBackground}} textDecoration='none'>
              <Td>{index + 1}</Td>
              <Td w='50px'>
                {entity.profileImage ? (
                  <Box
                    width={50}
                    height={50}
                    position='relative'
                    rounded='full'
                    overflow='hidden'
                  >
                    <CdnImage
                      src={ImageService.translate(entity.profileImage).avatar()}
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
                <VStack 
                  alignItems={'left'}
                  >
                  { entity.username === entity.walletAddress ? (
                    <Text isTruncated maxW={'300px'} textAlign={'left'}>
                    {shortAddress(entity.username)}
                    </Text>
                    ) : (
                      <Text isTruncated maxW={'300px'} textAlign={'left'}>
                        {entity.username}
                      </Text>
                  ) }
                  <Text fontSize={'14px'} isTruncated maxW={'300px'} textAlign={'left'}>
                    Lvl: {entity.level}
                  </Text>
                </VStack>
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
                {entity.experience}
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

const DataAccordion = ({data, onSort, tabCallback}: ResponsiveRewardsCollectionsTableProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

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
                    {entity.profileImage ? (
                      <Box
                        width='40px'
                        height='40px'
                        position='relative'
                        rounded='full'
                        overflow='hidden'
                      >
                        <ChakraImage
                          src={ImageService.translate(entity.profileImage).avatar()}
                          alt={entity.username}
                        />
                      </Box>
                    ) : (
                      <Blockies seed={entity.walletAddress.toLowerCase()} size={10} scale={5} />
                    )}
                  </Box>
                  <VStack align='start' spacing={0} flex='1' fontSize='sm'>
                  { entity.username === entity.walletAddress ? (
                    <Text isTruncated maxW={'300px'} textAlign={'left'}>
                    {shortAddress(entity.username)}
                    </Text>
                    ) : (
                      <Text isTruncated maxW={'300px'} textAlign={'left'}>
                        {entity.username}
                      </Text>
                  ) }
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
                      <Box fontWeight='bold'>{entity.experience}</Box>
                    </StatNumber>
                  </Stat>
                </VStack>
              </Box>
              {/*<AccordionButton w='auto'>*/}
              {/*  <AccordionIcon />*/}
              {/*</AccordionButton>*/}
            </Flex>
            <AccordionPanel px={0}>
              anything else?
            </AccordionPanel>
          </AccordionItem>
            ))}
          </React.Fragment>
        ))}
      </Accordion>
    </>
  )
};


export default ResponsiveXPLeaderboardTable;