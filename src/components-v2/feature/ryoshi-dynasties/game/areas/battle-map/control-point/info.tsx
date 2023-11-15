import {Center, Flex, HStack, Image} from "@chakra-ui/react";
import React, {ReactElement, useEffect, useState, useRef, useContext} from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,
  useBreakpointValue,
  TableContainer,
  Text,
  Avatar
} from '@chakra-ui/react';
import {RdControlPoint} from "@src/core/services/api-service/types";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import ImageService from "@src/core/services/image";
interface InfoTabProps {
  controlPoint: RdControlPoint;
  refreshControlPoint: () => void;
  useCurrentGameId: boolean;
}
import {getLeaderBoard, getSeasonDate} from "@src/core/api/RyoshiDynastiesAPICalls";

const InfoTab = ({controlPoint, refreshControlPoint, useCurrentGameId}: InfoTabProps) => {
  
  const [leaderboard, setLeaderboard] = useState<ReactElement[]>([]);
  const {game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false, lg: false, xl: false, '2xl': false })
  const [weekEndDate, setWeekEndDate] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const GetWeekEndDate = async () => {
    if(!rdGameContext) return;

    if(useCurrentGameId){
      setWeekEndDate(formatDate(rdGameContext?.game?.endAt));
  } else {
    const previousGame = await getSeasonDate(rdGameContext.history.previousGameId);
    setWeekEndDate(formatDate(previousGame.endAt));
    }
  }
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric"}
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  const stringProps = useBreakpointValue<StringProps>(
    {
      base: {
        stringLength: 15,
      },
      sm: {
        stringLength: 30,
      },
      md: {
        stringLength: 50,
      },
      lg: {
        stringLength: 50,
      },
      xl: {
        stringLength: 50,
      },
      '2xl': {
        stringLength: 50,
      }
    }
  );

  useEffect(() => {
    if(controlPoint.leaderBoard !== undefined)
    {
      GetWeekEndDate();
      setLeaderboard(
        controlPoint.leaderBoard.filter((faction, index) => index < 5).map((faction, index ) =>  (
      <Tr key={index} >
        <Td  textAlign='center' w={16}>{index+1}</Td>
        
        <Td textAlign='left' 
          alignSelf={'center'}
          alignContent={'center'}
          alignItems={'center'}
          isTruncated
        >
          <HStack>
        <Avatar
          width='40px'
          height='40px'
          padding={'0.5px'}
          src={ImageService.translate(faction.image).avatar()}
          rounded='xs'
        />
          <Text
          isTruncated={isMobile}
          maxW={'100px'}
          >
            {faction.name} 
          </Text>
        </HStack>

         </Td>
        <Td  textAlign='left' 
          maxW={'200px'}
          >{faction.totalTroops}</Td>
      </Tr>
      )))
      setIsLoaded(true);
    }
    }, [controlPoint])

    useEffect(() => {
      setIsLoaded(false);
      refreshControlPoint();
      }, [])

  return (
    <>
      <Flex marginLeft='4' marginRight='4'>
        {isLoaded && controlPoint?.leaderBoard[0]?.totalTroops !== 0 ? (
          <>
            <Flex flexDirection='column' textAlign='center' justifyContent='space-around'>
              
              <TableContainer w={{base: '100%', sm:'100%'}} h={'250px'}>
                <Table size='m'>
                  <Thead>
                    <Tr>
                      <Th textAlign='left' color='gray.400'>Rank</Th>
                      <Th textAlign='left' color='gray.400'>Faction</Th>
                      <Th textAlign='left' color='gray.400'>Troops</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {leaderboard}
                  </Tbody>
                </Table>
              </TableContainer>

              <Flex
               marginTop='8'
               marginBottom='8'
               >
                {useCurrentGameId ? (
                <Text as='i' textColor={'#aaa'}>
                  The faction with the highest troop count on {weekEndDate} will receive <b>{controlPoint.points}</b> points
                </Text>) : (
                <Text as='i' textColor={'#aaa'}>
                  Final standings at {weekEndDate}. <b>{controlPoint.points}</b> points were awarded to <b>{controlPoint?.leaderBoard[0]?.name}</b>
                </Text>
                )}
              </Flex>
            </Flex>
          </>
        ) : (
          <Flex flexDirection='column' textAlign='center' justifyContent='space-around'>
            <Box minH={'200px'}>
              <Center>
                <Text
                  margin='100'
                  > No Troops currently deployed </Text>
              </Center>
            </Box>
            <Flex marginTop='12' marginLeft='8' marginRight='8' marginBottom='8'>
              <Text as='i' textColor={'#aaa'}>
                The faction with the highest troop count on {weekEndDate} will receive {controlPoint.points} points
              </Text>
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default InfoTab;

interface StringProps {
  stringLength: number;
}