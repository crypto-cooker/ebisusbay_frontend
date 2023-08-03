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
} from "@chakra-ui/react"

import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import {getLeaderBoard, getSeason} from "@src/core/api/RyoshiDynastiesAPICalls";
import moment from 'moment';
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
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

  const { config: rdConfig, user:rdUser, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [regionSelected, setRegionSelected] = useState(false);
  const [previousSeasonTime, setPreviousSeasonTime] = useState('');
  const [currentSeasonTime, setCurrentSeasonTime] = useState('');
  const [leaderBoard, setLeaderBoard] = useState<ReactElement[]>([]);
  const [showCurrentGame, setShowCurrentGame] = useState(true);
  const [noGameActive, setNoGameActive] = useState(false);

  const [attackerOptions, setLeaderboardDropDown] = useState<ReactElement[]>([]);
  const [dataForm, setDataForm] = useState({
    selectedFaction: "" ?? null,
  })

  const onChangeSelectedControlPoint = (e : any) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    if(e.target.value !== ''){
      LoadControlPointLeaderBoard(e.target.value);
      setRegionSelected(true);
    } else {
      console.log('no region selected')
      setRegionSelected(false);
    }
  }

  useEffect(() => {
    if(status === 'success' && allFactions !== undefined) {
      console.log('allFactions: ', allFactions)
      if(allFactions.game !== null) {
        //locking for week start
        setNoGameActive(false)
        // LoadControlPoints();
      }
      else {
        setNoGameActive(true)
      }

    }
  }, [status, allFactions]);

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

  const LoadControlPointLeaderBoard = async (e : controlpoint) => {
    if(!rdGameContext) return;

    const gameId = showCurrentGame ? rdGameContext.game.id : rdGameContext.history.previousGameId;

    const allFactionsOnPoint = await getLeaderBoard(getControlPointId(e), gameId);
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
    if(!rdGameContext) return;

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

  return (
    <>
      {noGameActive ? (
        <>
          <Box minH={'200px'} marginTop={10}>
            <Center>
              <Text
              margin='100'
              > No game currently active </Text>
            </Center>
          </Box>
        </>
      ) : (
        <>
          <Stack spacing={3} p={4} 
              marginTop={10}
              >
            <Center>
              <Tabs>
                <TabList>
                  <Tab onClick={() => setShowCurrentGame(true)}>
                    <VStack>
                      <Text className={gothamXLight.className}> Current Game </Text>
                      <Text> {currentSeasonTime} </Text>
                    </VStack>
                  </Tab>
                  <Tab onClick={() => setShowCurrentGame(false)}>
                    <VStack>
                      <Text className={gothamXLight.className}> Previous Game </Text>
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
                    placeholder='Select a Control Point'
                    marginTop={2}
                    value={dataForm.selectedFaction}
                    onChange={onChangeSelectedControlPoint}
                  >
                    {attackerOptions}
                  </Select>
                </Center>

                <Flex>
                  {!rdGameContext ? <Spinner size='sm'/> : <></>}
                </Flex>
              </Tabs>
              <Text>

              </Text>
            </Center>

            <Center>
              {showCurrentGame ? (
                <>
                  {regionSelected ? (
                    <>
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
                    </>
                  ) : (
                    <Box minH={'200px'}>
                      <Center>
                        <Text
                        margin='100'
                        > </Text>
                      </Center>
                    </Box>
                  )}
                </>
              ) : (
                <>
                {regionSelected ? (
                    <>
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
                    </>
                  ) : (
                    <Box minH={'200px'}>
                      <Center>
                        <Text
                        margin='100'
                        > </Text>
                      </Center>
                    </Box>
                  )}
                  </>
              )}
            </Center>
          </Stack>
        </>
      )}
    </>
  );
}

export default LeaderBoardPage;