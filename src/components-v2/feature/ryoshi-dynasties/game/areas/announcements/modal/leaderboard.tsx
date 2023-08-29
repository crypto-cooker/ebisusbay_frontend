import React, {useEffect, useContext, useState, ReactElement} from 'react';
import {
  Center,
  Flex,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Select,
  Td,
  Text,
  Tabs,
  TabList,
  Tab,
  VStack,
  Box,
  Grid,
  GridItem,
  Avatar,
  useBreakpointValue,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from "@chakra-ui/react"

import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import {getLeaderBoard, getSeasonDate} from "@src/core/api/RyoshiDynastiesAPICalls";
import moment from 'moment';
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })
import ImageService from "@src/core/services/image";
import { isMobile } from 'web3modal';

interface leaderBoardProps {
  onReturn: () => void;
}

const LeaderBoardPage = ({onReturn}: leaderBoardProps) => {

  interface controlpoint{
    coordinates: string;
    id: number;
    name: string;
    uuid: string;
  }

  const user = useAppSelector((state) => state.user);
  const {data: allFactions, status, error} = useQuery({
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getGameContext(),
    enabled: !!user.address,
  });

  const {game: rdGameContext} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [regionSelected, setRegionSelected] = useState(false);
  const [previousSeasonTime, setPreviousSeasonTime] = useState('');
  const [currentSeasonTime, setCurrentSeasonTime] = useState('');
  const [value, setValue] = React.useState('')
  const [selectedControlPoint, setSelectedControlPoint] = useState<controlpoint>();

  const [leaderBoard, setLeaderBoard] = useState<ReactElement[]>([]);
  const [showCurrentGame, setShowCurrentGame] = useState(true);
  const [noGameActive, setNoGameActive] = useState(false);
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false, lg: false, xl: false, '2xl': false })

  const [attackerOptions, setLeaderboardDropDown] = useState<ReactElement[]>([]);
  const [dataForm, setDataForm] = useState({selectedFaction: "" ?? null,})

  const onChangeSelectedControlPoint = (e : any) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    if(e.target.value !== ''){
      setSelectedControlPoint(e.target.value)
      setValue(e.target.value.name)
      setRegionSelected(true);
    } else {
      setRegionSelected(false);
    }
  }

  const GetGameDates = async () => {
    if(!rdGameContext) return;

    try{
      const previousGame = await getSeasonDate(rdGameContext.history.previousGameId);
      setPreviousSeasonTime(
        moment(previousGame.startAt).format("MMM D")+" - "+moment(previousGame.endAt).format("MMM D")
      )
      const currentGame = await getSeasonDate(rdGameContext.game.id);
      setCurrentSeasonTime(
        moment(currentGame.startAt).format("MMM D")+" - "+moment(currentGame.endAt).format("MMM D")
      )
    }
    catch(error){
      console.log(error)
    }
  }

  const getControlPointId = (e : any) => {
    if(!rdGameContext) return;

    let x = 0;
    rdGameContext.game.parent.map.regions.map((region: any) =>
      region.controlPoints.map((controlPoint: any, i: any) => {
        if(controlPoint.name === e){
          x = controlPoint.id;
        }
      }
    ))
    return x;
  }
  function limit (string = '') {  
    return string.substring(0, 10) + (string.length > 10 ? '...' : '');
  }

  const LoadControlPointLeaderBoard = async () => {
    if(!rdGameContext || !selectedControlPoint) return;

    const gameId = showCurrentGame ? rdGameContext.game.id : rdGameContext.history.previousGameId;
    const allFactionsOnPoint = await getLeaderBoard(getControlPointId(selectedControlPoint), gameId);

    //if length less than 5, add empty rows
    if(allFactionsOnPoint.length < 5){
      for(let i = allFactionsOnPoint.length; i < 5; i++){
        allFactionsOnPoint.push({name: '', totalTroops: ''})
      }
    }

    setLeaderBoard(
      allFactionsOnPoint.slice(0, 5).map((faction:any, index:any) => (
      <Tr key={index}>
        <Td textAlign='center' w={16}>{index+1}</Td>
        
        <Td textAlign='left' alignSelf={'center'}
          alignContent={'center'}
          alignItems={'center'}
          display={'flex'}
          h={43.5}
        >
         <HStack>
        <Avatar
          width='40px'
          height='40px'
          padding={1}
          src={ImageService.translate(faction.image).avatar()}
          rounded='xs'
        />
        <Text
        isTruncated={isMobile}
        maxW={'200px'}
        >
        {faction.name} 
        </Text>
        </HStack>
        </Td>
        <Td textAlign='left' 
          maxW={'200px'}
          >{faction.totalTroops}</Td>
      </Tr>
    )))
  }

  useEffect(() => {
    LoadControlPointLeaderBoard();
  }, [selectedControlPoint, showCurrentGame]);

  useEffect(() => {
    if(!rdGameContext) return;

    GetGameDates();

    setLeaderboardDropDown(rdGameContext.game.parent.map.regions.map((region: any) =>
      region.controlPoints.map((controlPoint: any, i: any) => (
        <>
          <option
            value={controlPoint.name}
            key={controlPoint.id}>
            {controlPoint.name}
          </option>
        </>
      ))
    ))
  }, [rdGameContext]);

  useEffect(() => {
    if(status === 'success' && allFactions !== undefined) {
      allFactions.game !== null ? setNoGameActive(false) : setNoGameActive(true);
    }
  }, [status, allFactions]);

  return (
    <>
      {noGameActive ? (
        <>
          <Box minH={'250px'} marginTop={10}>
            <Center>
              <Text
              margin='100'
              > No game currently active </Text>
            </Center>
          </Box>
        </>
      ) : (
        <>
          <Stack 
            spacing={3}
            p={4} 
            marginTop={10}
            >
            <Grid
              templateColumns="repeat(2, 1fr)"
              justifyContent={'space-between'}
              >
                <GridItem colSpan={{base:2, sm:1}}
                  justifySelf={{base:'center', sm:'left'}}
                  >
                  <Select
                    name='attackersFaction'
                    backgroundColor=''
                    w={'250px'}
                    me={2}
                    placeholder='Select a Control Point'
                    marginTop={2}
                    value={value}
                    onChange={onChangeSelectedControlPoint}
                    >
                      {attackerOptions}
                    </Select>
                </GridItem>

                <GridItem colSpan={{base:2, sm:1}} maxW={{base: '300px', sm: '500px'}}
                  justifySelf={{base:'center', sm:'right'}}
                >
                <Tabs > 
                  <TabList>
                    <Tab onClick={() => setShowCurrentGame(true)}>
                      <VStack>
                        <Text as={'b'} className={gothamXLight.className}> Current Game </Text>
                        <Text fontSize={12}> {currentSeasonTime} </Text>
                      </VStack>
                    </Tab>
                    <Tab onClick={() => setShowCurrentGame(false)}>
                      <VStack>
                        <Text as={'b'} className={gothamXLight.className}> Previous Game </Text>
                        <Text fontSize={12}> {previousSeasonTime} </Text>
                      </VStack>
                    </Tab>
                  </TabList>
                </Tabs>

                <Flex>
                  {!rdGameContext ? <Spinner size='sm'/> : <></>}
                </Flex>

                </GridItem>
            </Grid>

            <Center>
                {regionSelected ? (
                    <>
                      <TableContainer w={{base: '95%', sm:'100%'}} h={'250px'}>
                        <Table size='m'>
                          <Thead>
                            <Tr>
                              <Th textAlign='left'>Rank</Th>
                              <Th textAlign='left'>Faction</Th>
                              <Th textAlign='left'>Troops</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {leaderBoard}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </>
                  ) : (
                    <Box h={'250px'}>
                      <Center>
                        <Text
                        margin='100'
                        > </Text>
                      </Center>
                    </Box>
                  )}
            </Center>
                <Accordion allowToggle={true}  w={{base: '95%', sm:'100%'}}>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                          Map
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                      commodo consequat.

                      
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
          </Stack>
        </>
      )}
    </>
  );
}

export default LeaderBoardPage;