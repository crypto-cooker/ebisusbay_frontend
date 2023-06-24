import {Center, Flex, Image} from "@chakra-ui/react";
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
  Text
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
}

const InfoTab = ({controlPoint, refreshControlPoint}: InfoTabProps) => {
  
  const [area, setAreas] = useState<ReactElement>();
  const {game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [weekEndDate, setWeekEndDate] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const ImageRef1 = useRef(null);
  const GetWeekEndDate = async () => {
    if(!rdGameContext) return;
    const timestamp = rdGameContext?.game?.endAt;
    setWeekEndDate(formatDate(timestamp));
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
  const parseFactionName = (name: string) => {
    if(name.length > stringProps?.stringLength!) {
      return name.substring(0, stringProps?.stringLength) + '...';
    }
    return name;
  }
  

  useEffect(() => {
    if(controlPoint.leaderBoard !== undefined)
    {
      GetWeekEndDate();
      //get first one and see if the troops is > 0
      // if() return;

      setAreas(<Tbody>
        {controlPoint.leaderBoard.filter((faction, index) => index < 5).map((faction, index ) => 
      (<Tr key={index}>
        <img
          width={40}
          height={40}
         src={faction.image}></img>
        <Td  textAlign='center'>
        <Text
          fontSize={{base: 14, sm: 14}}
          >{faction.totalTroops}</Text></Td>
        <Td  textAlign='center'>
          <Text
          fontSize={{base: 14, sm: 14}}
          >{parseFactionName(faction.name)}</Text></Td>
      </Tr>))}</Tbody>)
      setIsLoaded(true);
    }
    }, [controlPoint])

    useEffect(() => {
      setIsLoaded(false);
      // console.log("opened info tap")
      refreshControlPoint();
      }, [])

  return (
    <>
      <Flex marginLeft='4' marginRight='4'>
        {isLoaded && controlPoint?.leaderBoard[0]?.totalTroops !== 0 ? (
          <>
            <Flex flexDirection='column' textAlign='center' justifyContent='space-around'>
              <TableContainer>
                <Table size='m'>
                  <Thead>
                    <Tr>
                      <Th textAlign='center' textColor='#a0aec0'></Th>
                      <Th textAlign='center' textColor='#a0aec0'>Troops</Th>
                      <Th textAlign='center' textColor='#a0aec0'>Faction</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {controlPoint.leaderBoard.filter((faction, index) => index < 5).map((faction, index ) => (
                      <Tr key={index}>
                        <Image
                          width='40px'
                          height='40px'
                          src={ImageService.translate(faction.image).avatar()}
                          rounded='sm'
                        />
                        <Td textAlign='center'>
                          <Text fontSize={{base: 14, sm: 14}}>{faction.totalTroops}</Text>
                        </Td>
                        <Td textAlign='center'>
                          <Text fontSize={{base: 14, sm: 14}}>{parseFactionName(faction.name)}</Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                  </Table>
              </TableContainer>
              <Flex
               marginTop='8'
               marginBottom='8'
               >
                <p>
                  The faction with the highest troop count on {weekEndDate} will receive {controlPoint.points} points
                </p>
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
            {/* <TableContainer>
              <Table size='m'>
                <Thead>
                  <Tr>
                    <Th textAlign='center' textColor='#a0aec0'>Rank</Th>
                    <Th textAlign='center' textColor='#a0aec0'>Faction</Th>
                    <Th textAlign='center' textColor='#a0aec0'>Troops</Th>
                  </Tr>
                </Thead>
                <Tr>1</Tr>
                <Tr>2</Tr>
                <Tr>3</Tr>
                <Tr>4</Tr>
                <Tr>5</Tr>
                </Table>
            </TableContainer> */}
            <Flex marginTop='12' marginLeft='8' marginRight='8' marginBottom='8'>
              <p>The faction with the highest troop count on {weekEndDate} will recieve rewards!</p>
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