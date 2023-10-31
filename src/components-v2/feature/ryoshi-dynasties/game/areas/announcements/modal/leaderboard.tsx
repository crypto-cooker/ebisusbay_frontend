import React, {ReactElement, useContext, useEffect, useState} from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
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
import {useAppSelector} from "@src/Store/hooks";
import moment from 'moment';
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import ImageService from "@src/core/services/image";
import GameMapWrapper from '@src/components-v2/feature/ryoshi-dynasties/components/game-map-wrapper';
import {getLeadersForSeason, getSeasonDate} from "@src/core/api/RyoshiDynastiesAPICalls";
import {commify} from "ethers/lib/utils";

const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

interface leaderBoardProps {
  onReturn: () => void;
}

const LeaderBoardPage = ({onReturn}: leaderBoardProps) => {

  const user = useAppSelector((state) => state.user);
  const {data: allFactions, status, error} = useQuery({
    queryKey: ['RyoshiDynastiesGameContext'],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getGameContext(),
    enabled: !!user.address,
  });

  const {game: rdGameContext} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [regionSelected, setRegionSelected] = useState(false);
  const [previousSeasonTime, setPreviousSeasonTime] = useState('');
  const [currentSeasonTime, setCurrentSeasonTime] = useState('');
  const [value, setValue] = React.useState('')
  const [selectedControlPointName, setSelectedControlPointName] = useState<string>();
  const [previousGameLeaders, setPreviousGameLeaders] = useState<any[]>([]);

  const [leaderBoard, setLeaderBoard] = useState<ReactElement[]>([]);
  const [showCurrentGame, setShowCurrentGame] = useState(true);
  const [noGameActive, setNoGameActive] = useState(false);
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false, lg: false, xl: false, '2xl': false })

  const [controlPointDropDown, setControlPointDropDown] = useState<ReactElement[]>([]);
  const [dataForm, setDataForm] = useState({selectedFaction: "" ?? null,})

  const onChangeSelectedControlPoint = (e : any) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    if(e.target.value !== ''){
      setSelectedControlPointName(e.target.value)
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
  const GetTopFactionsOnPoint = (pointName: string, showCurrentGame: boolean) => {
    if(!rdGameContext) return;

    let allFactionsOnPoint: any[] = [];

    if(showCurrentGame){
      rdGameContext.gameLeaders.map((controlPoint: any) =>{
        if(controlPoint.name === pointName){
          allFactionsOnPoint = controlPoint.factions;
    }})} else {
      previousGameLeaders.map((controlPoint: any) =>{
        if(controlPoint.name === pointName){
          allFactionsOnPoint = controlPoint.factions;
    }})}
    return allFactionsOnPoint;
  }
  const LoadControlPointLeaderBoard = async () => {
    if(!rdGameContext || !selectedControlPointName) return;

    const allFactionsOnPoint = GetTopFactionsOnPoint(selectedControlPointName, showCurrentGame);
    if(!allFactionsOnPoint) return;

    //if length less than 5, add empty rows
    if(allFactionsOnPoint.length < 5){
      for(let i = allFactionsOnPoint.length; i < 5; i++){
        allFactionsOnPoint.push({name: '', totalTroops: ''})
      }
    }

    setLeaderBoard(
      allFactionsOnPoint.slice(0, 5).map((faction:any, index:any) => (
      <Tr key={index}>
        <Td w={16}>{index+1}</Td>
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
            <Text isTruncated={isMobile} maxW={isMobile ?'150px': '200px'}>{faction.name}</Text>
          </HStack>
        </Td>
        <Td textAlign='left' maxW={'200px'} isNumeric>{commify(faction.totalTroops)}</Td>
      </Tr>
    )))
  }
  const LoadControlPointDropDown = () => {
    if(!rdGameContext) return;

    //pull all control points from game context and place in new array
    let controlPoints: any[] = [];
    rdGameContext.game.season.map.regions.map((region: any) =>
      region.controlPoints.map((controlPoint: any, i: any) => (
        controlPoints.push(controlPoint)
      ))
    )
    //sort control points alphabetically
    controlPoints = controlPoints.sort((a: any, b: any) => (a.name > b.name) ? 1 : -1)

    //set control points to dropdown
    setControlPointDropDown(controlPoints.map((controlPoint: any) =>
        <>
          <option
            value={controlPoint.name}
            key={controlPoint.id}>
            {controlPoint.name}
          </option>
        </>
      ))
  }
  const GetLeadersForSeasonApiCall = async () => {
    if(!rdGameContext) return;

    const previousGameLeadersData = await getLeadersForSeason(rdGameContext.history.previousGameId);
    setPreviousGameLeaders(previousGameLeadersData);
  }

  useEffect(() => {
    LoadControlPointLeaderBoard();
  }, [selectedControlPointName, showCurrentGame]);
  useEffect(() => {
    if(!rdGameContext) return;

    GetGameDates();
    LoadControlPointDropDown();
  }, [rdGameContext]);
  useEffect(() => {
    GetLeadersForSeasonApiCall();
  } ,[]);
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
                      {controlPointDropDown}
                    </Select>
                </GridItem>

                <GridItem colSpan={{base:2, sm:1}} maxW={{base: '300px', sm: '500px'}}
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

            <Center>
                {regionSelected ? (
                    <>
                      <TableContainer w={{base: '95%', sm:'100%'}} h={'250px'}>
                        <Table size='m'>
                          <Thead>
                            <Tr>
                              <Th textAlign='left'>Rank</Th>
                              <Th textAlign='left'>Faction</Th>
                              <Th textAlign='left' isNumeric>Troops</Th>
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
            </Center >

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
                      h={isMobile ?'525px': '320px'}
                      w={{base:'350px', sm:'500px', md:'100%'}}
                      >
                      <GameMapWrapper showActiveGame={showCurrentGame} height={isMobile ?'525px': '450px'} blockDeployments={true}/>

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