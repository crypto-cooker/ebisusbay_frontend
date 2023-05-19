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
  Text
} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import {getLeaderBoard, getPreviousGame, getRegions} from "@src/core/api/RyoshiDynastiesAPICalls";
import moment from 'moment';

const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

const LeaderBoardPage = () => {
 
  const user = useAppSelector((state) => state.user);
  const [regionSelected, setRegionSelected] = useState(false);

  // type Region = {
  //   controlPoints?: [];
  // };
  const [regions, setRegions] = useState([]);
  const [isRetrievingLeaderboard, setIsRetrievingLeaderboard] = useState(false);
  const [seasonTime, setSeasonTime] = useState('');
  const [leaderBoard, setLeaderBoard] = useState([]);

  const [attackerOptions, setAttackerOptions] = useState([]);

  const LoadControlPoints = async () => {
    try{
      setIsRetrievingLeaderboard(true);
      const regions1 = await getRegions();
      setRegions(regions1[0])
      setIsRetrievingLeaderboard(false);
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    if(!isRetrievingLeaderboard)
    {
      GetPreviousGameDates();
      if(regions.controlPoints !== undefined) {
        setAttackerOptions(regions.controlPoints.map((point, index) => (
          <option 
            value={point.name}
            key={index}>
            {point.name}</option>)
      ))}
    }
  }, [regions]);

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
  
  const GetPreviousGameDates = async () => {
    try{
      const previousGame = await getPreviousGame();
        setSeasonTime(
          moment(previousGame.startAt).format("MMM D yyyy")+" - "+moment(previousGame.endAt).format("MMM D yyyy")
        )
    }
    catch(error){
      console.log(error)
    }
  }

  const LoadControlPointLeaderBoard = async (e) => {
    //get controlpoint id from regions by matching name
    const x = regions.controlPoints.findIndex((point) => point.name === e);
    console.log(x)
    const allFactionsOnPoint = await getLeaderBoard(x)
    console.log(allFactionsOnPoint.slice(0, 5))
    // setLeaderBoard(allFactionsOnPoint.slice(0, 5));
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

  return (
    <Stack spacing={3} p={4}>
      <Center>
        <Text as='h1' 
        className={gothamXLight.className} 
        color='white'
        mt={5}
        fontSize={{base: '24px', sm: '28px'}}
        >{seasonTime}</Text>
      </Center>

      <Flex>
      {isRetrievingLeaderboard ? <Spinner size='sm'/> : <></>}
      </Flex>

      <Center>
      <Select 
        name='attackersFaction'
        backgroundColor='#292626'
        w='90%' 
        me={2} 
        placeholder='Select Region'
        value={dataForm.attackersFaction} 
        onChange={onChangeInputsAttacker}>
        {attackerOptions}
      </Select>
      </Center>

      <Center>
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
      </Center>
    </Stack>
  );
}

export default LeaderBoardPage;