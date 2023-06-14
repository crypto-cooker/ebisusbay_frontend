import React, {useEffect, useState, ReactElement} from 'react';
import {
  Center,
  Flex,
  Heading,
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
  TabPanels, 
  Tab, 
  TabPanel, 
  VStack,
  Box,
} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import {getLeaderBoard, getSeason, getRegions} from "@src/core/api/RyoshiDynastiesAPICalls";
import moment from 'moment';
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import { log } from 'console';

const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

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
 
  const [regionSelected, setRegionSelected] = useState(false);
  const [controlPoints, setControlPoints] = useState<controlpoint[]>([]);
  const [isRetrievingLeaderboard, setIsRetrievingLeaderboard] = useState(false);
  const [previousSeasonTime, setPreviousSeasonTime] = useState('');
  const [currentSeasonTime, setCurrentSeasonTime] = useState('');
  const [leaderBoard, setLeaderBoard] = useState<ReactElement[]>([]);
  const [showCurrentGame, setShowCurrentGame] = useState(true);
  const [noGameActive, setNoGameActive] = useState(false);

  const [attackerOptions, setAttackerOptions] = useState<ReactElement[]>([]);
  const [dataForm, setDataForm] = useState({
    attackersFaction: "" ?? null,
  })

  const onChangeInputsAttacker = (e : any) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    if(e.target.value !== ''){
      LoadControlPointLeaderBoard(e.target.value);
      setRegionSelected(true);
    } else {
      setRegionSelected(false);
    }
  }


  const LoadControlPoints = async () => {
    try{
      setIsRetrievingLeaderboard(true);
      const controlPoints = await getRegions();
      setControlPoints(controlPoints)
      setIsRetrievingLeaderboard(false);
      setNoGameActive(false);
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    if(status === 'success' && allFactions !== undefined) {
      console.log('getting regions')
      if(allFactions.game !== null) {
        LoadControlPoints();
      }
      else {
        setNoGameActive(true)
      }
      
    }
  }, [status, allFactions]);

  const ShowCurrentGame = (e : any) => {
    console.log(e)
  }
  
  const GetGameDates = async () => {
    try{
      // const previousGame = await getSeason(-1);
      // console.log(previousGame)
      // setPreviousSeasonTime(
      //   moment(previousGame.startAt).format("MMM D")+" - "+moment(previousGame.endAt).format("MMM D")
      // )
      const currentGame = await getSeason(0);
      // console.log(currentGame)
      setCurrentSeasonTime(
          moment(currentGame.startAt).format("MMM D")+" - "+moment(currentGame.endAt).format("MMM D")
        )
    }
    catch(error){
      console.log(error)
    }
  }
  


  const LoadControlPointLeaderBoard = async (e : controlpoint) => {
    //get controlpoint id from regions by matching name
    const x = controlPoints.find((point:any) => point.name === e);
    console.log(x);
    const allFactionsOnPoint = await getLeaderBoard(x?.id);
    // console.log(allFactionsOnPoint.slice(0, 5))
    setLeaderBoard(
        allFactionsOnPoint.slice(0, 5).map((faction:any, index:any) => (
        <Tr key={index}>
          <Td textAlign='center'>{index+1}</Td>
          <Td textAlign='center'>{faction.name}</Td>
          <Td textAlign='center'>{faction.totalTroops}</Td>
        </Tr>
        )))
  }

  useEffect(() => {
    if(!isRetrievingLeaderboard)
    {
      GetGameDates();
      if(controlPoints !== undefined) {
        setAttackerOptions(controlPoints.map((point:any, index:any) => (
          <option 
            value={point.name}
            key={index}>
            {point.name}</option>)
      ))}
    }
  }, [controlPoints]);

  return (
    <>
    {noGameActive ? (<>
    <Box minH={'200px'}>
      <Center>
        <Text> No game data available </Text>
      </Center>
    </Box>
        </>) : (<>
    <Stack spacing={3} p={4}>
      <Center>
      <Tabs>

        <TabList
          >
            <Tab onClick={() => setShowCurrentGame(true)}>
            <VStack>
              <Text
        className={gothamXLight.className} 
        > Current Game </Text>
              <Text> {currentSeasonTime} </Text>
            </VStack>
          </Tab>
          <Tab onClick={() => setShowCurrentGame(false)}>
            <VStack>
              <Text
        className={gothamXLight.className} 
        > Previous Game </Text>
              <Text> {previousSeasonTime} </Text>
            </VStack>
          </Tab>
        </TabList>

        <Center>
        <Select 
          name='attackersFaction'
          backgroundColor='#292626'
          w='90%' 
          me={2} 
          placeholder='Select Region'
          marginTop={2}
          value={dataForm.attackersFaction} 
          onChange={onChangeInputsAttacker}>
          {attackerOptions}
        </Select>
        </Center>

        <Flex>
        {isRetrievingLeaderboard ? <Spinner size='sm'/> : <></>}
        </Flex>
      </Tabs>
        <Text>
        
        </Text>
      </Center>

      <Center>

      {showCurrentGame ? (<>
      {regionSelected ? (<>
      <TableContainer w='90%'>
        <Table size='m'>
          <Thead>
            <Tr>
              <Th textAlign='center'>Rank</Th>
              <Th textAlign='center'>Faction</Th>
              <Th textAlign='center'>Troops</Th>
            </Tr>
          </Thead>
          <Tbody>
          {leaderBoard}
          </Tbody>
        </Table>
      </TableContainer>
      </>) : (<Text> Select a region</Text>)}
      </> ) : (<Text> No previous game data</Text>)}

      </Center>
    </Stack>
    </>)}
    </>
  );
}

export default LeaderBoardPage;