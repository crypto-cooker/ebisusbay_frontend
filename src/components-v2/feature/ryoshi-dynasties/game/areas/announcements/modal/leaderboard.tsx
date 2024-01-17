import React, {ChangeEvent, useContext, useEffect, useMemo, useState} from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Select,
  Spinner,
  Stack,
  Tab,
  Table,
  TableContainer,
  TabList,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  VStack
} from "@chakra-ui/react"
import localFont from 'next/font/local';
import moment from 'moment';
import {useQuery} from "@tanstack/react-query";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import ImageService from "@src/core/services/image";
import GameMapWrapper from '@src/components-v2/feature/ryoshi-dynasties/components/game-map-wrapper';
import {getLeadersForSeason, getSeasonDate} from "@src/core/api/RyoshiDynastiesAPICalls";
import {commify} from "ethers/lib/utils";
import {ApiService} from "@src/core/services/api-service";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";

const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

interface leaderBoardProps {
  onReturn: () => void;
}

enum LeaderType {
  TROOPS = 'troops',
  POINTS = 'points'
}

const LeaderBoardPage = ({onReturn}: leaderBoardProps) => {
  const {game: rdGameContext} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [previousSeasonTime, setPreviousSeasonTime] = useState('');
  const [currentSeasonTime, setCurrentSeasonTime] = useState('');

  const [showCurrentGame, setShowCurrentGame] = useState(true);
  const [noGameActive, setNoGameActive] = useState(false);
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false, lg: false, xl: false, '2xl': false })
  const [leaderType, setLeaderType] = useState<LeaderType>(LeaderType.POINTS);

  const getGameDates = async () => {
    if(!rdGameContext) return;

    try{
      const previousGame = await getSeasonDate(rdGameContext.history.previousGameId);
      if (previousGame) {
        setPreviousSeasonTime(
          moment(previousGame.startAt).format("MMM D")+" - "+moment(previousGame.endAt).format("MMM D")
        )
      }
      const currentGame = await getSeasonDate(rdGameContext.game.id);
      setCurrentSeasonTime(
        moment(currentGame.startAt).format("MMM D")+" - "+moment(currentGame.endAt).format("MMM D")
      )
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    if(!rdGameContext) return;

    getGameDates();
  }, [rdGameContext]);

  return (
    <>
      {noGameActive ? (
        <Box minH='250px' marginTop={10}>
          <Center>
            <Text margin='100'>No game currently active</Text>
          </Center>
        </Box>
      ) : (
        <Stack spacing={3} p={4} marginTop={10}>
          <Grid templateColumns="repeat(2, 1fr)" justifyContent={'space-between'} gap={2}>
            <GridItem colSpan={{base:2, sm:1}} justifySelf={{base:'center', sm:'left'}} my='auto'>
              <ButtonGroup isAttached>
                <Button
                  variant={leaderType === LeaderType.POINTS ? 'solid' : 'outline'}
                  colorScheme={leaderType === LeaderType.POINTS ? 'blue' : undefined}
                  color='white'
                  onClick={() => setLeaderType(LeaderType.POINTS)}
                >
                  Points
                </Button>
                <Button
                  variant={leaderType === LeaderType.TROOPS ? 'solid' : 'outline'}
                  colorScheme={leaderType === LeaderType.TROOPS ? 'blue' : undefined}
                  color='white'
                  onClick={() => setLeaderType(LeaderType.TROOPS)}
                >
                  Troops
                </Button>
              </ButtonGroup>
            </GridItem>

            <GridItem
              colSpan={{base:2, sm:1}}
              maxW={{base: '300px', sm: '500px'}}
              justifySelf={{base:'center', sm:'right'}}
            >
              <Tabs isLazy>
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

          {leaderType === LeaderType.TROOPS ? (
            <TroopsLeaderboard showCurrentGame={showCurrentGame} />
          ) : (
            <PointsLeaderboard showCurrentGame={showCurrentGame} />
          )}

          {!showCurrentGame && leaderType === LeaderType.TROOPS && (
            <Accordion allowToggle={true} w={{base: '100%', sm:'100%'}}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                      Map
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  h={isMobile ? '525px': '320px'}
                  w={{base:'350px', sm:'500px', md:'100%'}}
                >
                  <GameMapWrapper showActiveGame={showCurrentGame} height={isMobile ?'525px': '450px'} blockDeployments={true}/>

                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          )}
        </Stack>
      )}
    </>
  );
}

export default LeaderBoardPage;

const TroopsLeaderboard = ({showCurrentGame}: {showCurrentGame: boolean}) => {
  const {game: rdGameContext} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false, lg: false, xl: false, '2xl': false });

  const [selectedControlPoint, setSelectedControlPoint] = useState('');
  const [previousGameFetched, setPreviousGameFetched] = useState(false);

  const {data: previousGameLeaders, status: previousGameStatus} = useQuery({
    queryKey: ['RyoshiDynastiesPreviousGameTroopsLeaders'],
    queryFn: async () => {
      if(!rdGameContext) return [];

      const leaders = await getLeadersForSeason(rdGameContext.history.previousGameId);
      if (!leaders) return [];
      return leaders as any[];
    },
    enabled: !previousGameFetched
  });

  const onChangeSelectedControlPoint = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedControlPoint(e.target.value);
  }

  const controlPoints = useMemo(() => {
    if(!rdGameContext) return [];

    //pull all control points from game context and place in new array
    let controlPoints: any[] = [];
    rdGameContext.game.season.map.regions.map((region: any) =>
      region.controlPoints.map((controlPoint: any, i: any) => (
        controlPoints.push(controlPoint)
      ))
    )

    //sort control points alphabetically
    controlPoints = controlPoints.sort((a: any, b: any) => (a.name > b.name) ? 1 : -1)

    return controlPoints;
  }, [rdGameContext?.game]);

  const getTopFactionsOnPoint = (controlPointId: number, showCurrentGame: boolean) => {
    if(!rdGameContext) return;

    let allFactionsOnPoint: any[] = [];

    if (showCurrentGame) {
      rdGameContext.gameLeaders.map((controlPoint: any) => {
        if(controlPoint.id === controlPointId) {
          allFactionsOnPoint = controlPoint.factions;
        }
      });
    } else {
      previousGameLeaders?.map((controlPoint: any) =>{
        if(controlPoint.id === controlPointId){
          allFactionsOnPoint = controlPoint.factions;
        }
      })
    }

    return allFactionsOnPoint;
  }

  const factionsByControlPoint = useMemo(() => {
    if(!rdGameContext || !selectedControlPoint) return;

    const allFactionsOnPoint = getTopFactionsOnPoint(parseInt(selectedControlPoint), showCurrentGame);
    if(!allFactionsOnPoint) return;

    //if length less than 5, add empty rows
    if(allFactionsOnPoint.length < 5){
      for(let i = allFactionsOnPoint.length; i < 5; i++){
        allFactionsOnPoint.push({name: '', totalTroops: ''})
      }
    }

    return allFactionsOnPoint;
  }, [selectedControlPoint, showCurrentGame, rdGameContext?.game, previousGameFetched]);

  useEffect(() => {
    if (previousGameStatus === 'success') {
      setPreviousGameFetched(true);
    }
  }, [previousGameStatus]);

  return (
    <Box>
      <Flex justify={{base:'center', sm:'end'}}>
        <Select
          w='250px'
          me={2}
          placeholder='Select a Control Point'
          marginTop={2}
          value={selectedControlPoint}
          onChange={onChangeSelectedControlPoint}
        >
          {controlPoints.map((controlPoint: any) =>
            <option value={controlPoint.id} key={controlPoint.id}>
              {controlPoint.name}
            </option>
          )}
        </Select>
      </Flex>
      {selectedControlPoint ? (
        <Box mt={2}>
          <TableContainer w={{base: '95%', sm: '100%'}} h='250px'>
            <Table size='sm'>
              <Thead>
                <Tr>
                  <Th textAlign='left'>Rank</Th>
                  <Th textAlign='left'>Faction</Th>
                  <Th textAlign='left' isNumeric>Troops</Th>
                </Tr>
              </Thead>
              <Tbody>
                {factionsByControlPoint?.slice(0, 5).map((faction:any, index:any) => (
                  <Tr key={index}>
                    <Td w={16}>{index+1}</Td>
                    <Td
                      textAlign='left'
                      alignSelf='center'
                      alignContent='center'
                      alignItems='center'
                      display='flex'
                      h='43px'
                      w={isMobile ? '140px': '200px'}
                    >
                      <HStack>
                        <Avatar
                          width='40px'
                          height='40px'
                          padding={1}
                          src={ImageService.translate(faction.image).avatar()}
                          rounded='xs'
                        />
                        <Text isTruncated={isMobile} maxW={isMobile ? '140px': '200px'}>{faction.name}</Text>
                      </HStack>
                    </Td>
                    <Td textAlign='left' maxW='200px' isNumeric>{commify(faction.totalTroops)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box h='250px'>
          <Center>
            <Text margin='100'>
              Select a control point above to view the top factions
            </Text>
          </Center>
        </Box>
      )}
    </Box>
  );
}


const PointsLeaderboard = ({showCurrentGame}: {showCurrentGame: boolean}) => {
  const {game: rdGameContext} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const isMobile = useBreakpointValue({ base: true, md: false });
  const gameId = showCurrentGame ? rdGameContext?.game.id : rdGameContext?.history.previousGameId;
  const [page, setPage] = useState(0)
  const pageSize = 5;

  const {data: factionsByPoints} = useQuery({
    queryKey: ['RdPointLeaders', gameId],
    queryFn: async () => ApiService.withoutKey().ryoshiDynasties.getFactionsByPoints(gameId!),
    enabled: !!rdGameContext
  });

  const pagedFactions = factionsByPoints?.slice(page * pageSize, (page + 1) * pageSize) ?? [];

  return (
    <Box mt={2}>
      <TableContainer w={{base: '95%', sm: '100%'}} h='250px'>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th textAlign='left'>Rank</Th>
              <Th textAlign='left'>Faction</Th>
              <Th textAlign='left' isNumeric>Points</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pagedFactions.map((entry: any, index: any) => (
              <Tr key={entry.faction.name}>
                <Td w={16}>{(page * pageSize) + index + 1}</Td>
                <Td
                  textAlign='left'
                  alignSelf='center'
                  alignContent='center'
                  alignItems='center'
                  display='flex'
                  h='43px'
                  w={isMobile ? '140px': '200px'}
                >
                  <HStack>
                    <Avatar
                      width='40px'
                      height='40px'
                      padding={1}
                      src={ImageService.translate(entry.faction.image).avatar()}
                    />
                    <Text isTruncated={isMobile} maxW={isMobile ? '140px': '200px'}>{entry.faction.name}</Text>
                  </HStack>
                </Td>
                <Td textAlign='left' maxW='200px' isNumeric>{commify(entry.points)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Box textAlign='center' mt={2}>
        <ButtonGroup>
          <Button
            onClick={() => setPage(page - 1)}
            isDisabled={page === 0}
            size='sm'
            leftIcon={<ChevronLeftIcon />}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage(page + 1)}
            isDisabled={pagedFactions.length < pageSize}
            size='sm'
            rightIcon={<ChevronRightIcon />}
          >
            Next
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  )
}