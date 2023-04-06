import React, {useEffect, useRef, useState} from 'react';
import './BattleBay.module.scss';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Tabs,
  TabList,
  Heading,
  Flex,
  Button,
  TabPanels,
  Tab,
  Box,
  Image,
  Center,
  Divider,
  TabPanel,
  
} from '@chakra-ui/react';
import { getLeaderBoard, getControlPoints, getRegions } from "@src/core/api/RyoshiDynastiesAPICalls";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

const AnnouncementBoard = ({onBack}) => {
  
  const regionsRef = useRef();
  const troopsTableRef = useRef();
  const [isLoading, getSigner] = useCreateSigner();
  const user = useSelector((state) => state.user);
  const [regionButtons, setRegionButtons] = useState([]);
  const [controlPoints, setControlPoints] = useState([]);
  const [controlPointPanels, setControlPointPanels] = useState([]);
  const [regions, setRegions] = useState([]);
  let leaderBoard = [];

  useEffect(() => {
    console.log("this is from leaderboard useEffect")
    LoadLeaderBoard();
  }, []);

  useEffect(() => {
    console.log("this is from regions useEffect")
    if(regions.length > 0)
      LoadControlPoints(regions, 0);
  }, [regions]);

  const LoadLeaderBoard = async () => {
    const regions1 = await getRegions();
    setRegions(regions1)
    setRegionButtons(regions.map((region, i) => (
      <Button key={i} onClick={() => {LoadControlPoints(regions, i);}}>{region.name}</Button>
      )))
  }
  const LoadControlPoints = async (regions, x) => {
    const controlPointsIds = await getControlPoints(x);
    for (let i = 0; i < controlPointsIds.length; i++) {
      // console.log(controlPointsIds[i])
      leaderBoard.push(await getLeaderBoard(controlPointsIds[i]));
    }
    // console.log(leaderBoard)
    setControlPoints(regions[x].controlPoints.map((controlPoint, i) => (
      <Tab key={i}>{controlPoint.name}</Tab>
    )))
    setControlPointPanels(regions[x].controlPoints.map((controlPoint, i) => (
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
          {leaderBoard[i].map((faction, j) => (
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
    <section className="gl-legacy container">
      <Button margin={'36px'} position={'absolute'} onClick={onBack}> Back to Village Map</Button>
      <Box >
        <Center>
         <Image src="/img/battle-bay/academy_day.png" alt="Alliance Center" />
        </Center>
      </Box>

    <Heading> Announcement Board</Heading>
    <Heading size='s'>Recent Game Changes, Patches, etc</Heading>
    <Flex marginBottom={12}>
      <Box>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna 
        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
      </Box>
    </Flex>

    <Divider />

    <Heading justifyContent={'center'}>Leaderboard</Heading>
    <Flex>
      {regionButtons}
    </Flex>

    <Tabs>
      <TabList>
        {controlPoints}
      </TabList>
      <TabPanels>
        {controlPointPanels}
      </TabPanels>
    </Tabs>
    </section>
  )
};


export default AnnouncementBoard;