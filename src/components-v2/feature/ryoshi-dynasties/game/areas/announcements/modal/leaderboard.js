import React, {useEffect, useState} from 'react';
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
  VStack
} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import {getLeaderBoard, getSeason, getRegions} from "@src/core/api/RyoshiDynastiesAPICalls";
import moment from 'moment';

const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

const LeaderBoardPage = () => {
 
  const user = useAppSelector((state) => state.user);
  const [regionSelected, setRegionSelected] = useState(false);


  const [controlPoints, setControlPoints] = useState([]);
  const [isRetrievingLeaderboard, setIsRetrievingLeaderboard] = useState(false);
  const [previousSeasonTime, setPreviousSeasonTime] = useState('');
  const [currentSeasonTime, setCurrentSeasonTime] = useState('');
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [showCurrentGame, setShowCurrentGame] = useState(true);

  const [attackerOptions, setAttackerOptions] = useState([]);
  const [dataForm, setDataForm] = useState({
    attackersFaction: "" ?? null,
  })
  const onChangeInputsAttacker = (e) => {
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
      const regions1 = await getRegions();
      setControlPoints(regions1[0].controlPoints)
      setIsRetrievingLeaderboard(false);
    }
    catch(error){
      console.log(error)
    }
  }

  const ShowCurrentGame = (e) => {
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

  const LoadControlPointLeaderBoard = async (e) => {
    //get controlpoint id from regions by matching name
    const x = controlPoints.find((point) => point.name === e);
    const allFactionsOnPoint = await getLeaderBoard(x.id)
    // console.log(allFactionsOnPoint.slice(0, 5))
    setLeaderBoard(
    <Tbody> {
        allFactionsOnPoint.slice(0, 5).map((faction, index ) => (
        <Tr key={index}>
          <Td textAlign='center'>{index+1}</Td>
          <Td textAlign='center'>{faction.name}</Td>
          <Td textAlign='center'>{faction.totalTroops}</Td>
        </Tr>
        ))}
    </Tbody>)
  }

  useEffect(() => {
    LoadControlPoints();
  }, []);

  useEffect(() => {
    if(!isRetrievingLeaderboard)
    {
      GetGameDates();
      if(controlPoints !== undefined) {
        setAttackerOptions(controlPoints.map((point, index) => (
          <option 
            value={point.name}
            key={index}>
            {point.name}</option>)
      ))}
    }
  }, [controlPoints]);

  return (
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
          {leaderBoard}
        </Table>
      </TableContainer>
      </>) : (<Text> Select a region</Text>)}
      </> ) : (<Text> No previous game data</Text>)}

      </Center>
    </Stack>
  );
}

export default LeaderBoardPage;