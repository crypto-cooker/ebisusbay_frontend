import React, {useEffect, useState} from 'react';
import {
  Button,
  Center,
  Flex,
  Heading,
  Spinner,
  Stack,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import {getControlPoints, getLeaderBoard, getPreviousGame, getRegions} from "@src/core/api/RyoshiDynastiesAPICalls";
import moment from 'moment';

const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

const LeaderBoardPage = () => {
 
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const [regionButtons, setRegionButtons] = useState<any[]>([]);
  const [controlPoints, setControlPoints] = useState([]);
  const [controlPointPanels, setControlPointPanels] = useState([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [isRetrievingLeaderboard, setIsRetrievingLeaderboard] = useState(false);
  const [previousGameFound, setPreviousGameFound] = useState(true);
  const [seasonTime, setSeasonTime] = useState('');
  const [leaderBoard, setLeaderBoard] = useState<any[]>([]);

  useEffect(() => {
    LoadLeaderBoard();
  }, []);

  useEffect(() => {
    if(regions.length > 0 && isRetrievingLeaderboard)
    {
      setIsRetrievingLeaderboard(false);
      setRegionButtons(regions.map((region, i) => (
        <Button key={i}  onClick={() => {LoadControlPoints(regions, i);}}>{region.name} </Button>
      )))
      LoadControlPoints(regions, 0);
    }
  }, [regions]);

  const LoadLeaderBoard = async () => {
    try{
      setIsRetrievingLeaderboard(true);
      const regions1 = await getRegions();
      setRegions(regions1)
      if(regions1.length > 0)
      {
        setRegionButtons(regions1.map((region: any, i: any) => (
          <Button key={i}  onClick={() => {LoadControlPoints(regions1, i);}}>{region.name} </Button>
        )))
        LoadControlPoints(regions1, 0);
        setIsRetrievingLeaderboard(false);
        GetPreviousGameDates();
      }
    }
    catch(error){
      console.log(error)
    }
  }
  
  const GetPreviousGameDates = async () => {
    try{
      const previousGame = await getPreviousGame();
        console.log(previousGame);
        setSeasonTime(
          moment(previousGame.startAt).format("MMM D yyyy")+" - "+moment(previousGame.endAt).format("MMM D yyyy")
        )
    }
    catch(error){
      console.log(error)
    }
  }

  const LoadControlPoints = async (regions: any, x: any) => {
    // console.log(regions[x].controlPoints)
    const controlPointsIds = await getControlPoints(x);

    for (let i = 0; i < controlPointsIds.length; i++) {
      const allFactionsOnPoint = await getLeaderBoard(controlPointsIds[i])
      const topFiveFactions = allFactionsOnPoint.slice(0, 5);
      setLeaderBoard([...leaderBoard, topFiveFactions]);
    }

    setControlPoints(regions[x].controlPoints.map((controlPoint: any, i: any) => (
      <Tab key={i}>{controlPoint.name}</Tab>
    )))

    setControlPointPanels(regions[x].controlPoints.map((controlPoint: any, i: any) => (
      <TabPanel key={i}>
        {/* {controlPoint.id} */}
      <TableContainer>
      <Table variant='simple'>
      <Thead>
        <Tr>
          <Th className='text-center'>Rank</Th>
          <Th className='text-center'>Faction</Th>
          <Th className='text-center'>Troops</Th>
        </Tr>
      </Thead>
      <Tbody> 
          {leaderBoard[i].map((faction: any, j: any) => (
            <tr key={j}>
              <td style={{textAlign: 'center'}}>{j+1}</td>
              <td>{faction.name}</td>
              <td style={{textAlign: 'center'}}>{faction.totalTroops}</td>
            </tr>
          ))}
       </Tbody>
      </Table>
    </TableContainer>
    </TabPanel>
    )))
  }

  return (
    <Stack spacing={3} p={4}>
    <Center>
      <Heading as='h1' className={gothamXLight.className} fontSize='3xl' color='white' mt={5}>{seasonTime}</Heading>
    </Center>

    <Flex>
    {isRetrievingLeaderboard ? <Spinner size='sm'/> : regionButtons}
    </Flex>

    

    <Tabs>
      <TabList>
        {controlPoints}
      </TabList>
      <TabPanels>
        {controlPointPanels}
      </TabPanels>
      {previousGameFound ? null : <Text>Previous game not found</Text>}
    </Tabs>
    </Stack>
  );
}

export default LeaderBoardPage;