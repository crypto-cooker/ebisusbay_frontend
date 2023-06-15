import { Center, Flex } from "@chakra-ui/react";
import React, {ReactElement, useEffect, useState, useRef} from 'react';

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
import {getWeekEndDate} from "@src/core/api/RyoshiDynastiesAPICalls";
import {RdControlPoint} from "@src/core/services/api-service/types";

interface InfoTabProps {
  controlPoint: RdControlPoint;
  refreshControlPoint: () => void;
}

const InfoTab = ({controlPoint, refreshControlPoint}: InfoTabProps) => {
  
  const [area, setAreas] = useState<ReactElement>();
  const [weekEndDate, setWeekEndDate] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const ImageRef1 = useRef(null);
  const GetWeekEndDate = async () => {
    const timestamp = await getWeekEndDate();
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
    <Flex 
       marginLeft='4'
       marginRight='4'
       >
    {isLoaded ? (
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
          {area}
          </Table>
      </TableContainer>
      <Flex 
       marginTop='8'
       marginBottom='8'
       >
        <p>
          The faction with the highest troop count on {weekEndDate} will recieve {controlPoint.points} points
        </p>
      </Flex>
    </Flex>
    </> 
       ) : (
        <Flex flexDirection='column' textAlign='center' justifyContent='space-around'>
        <TableContainer>
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
        </TableContainer>
        <Flex 
         marginTop='12'
         marginLeft='8'
         marginRight='8'
         marginBottom='8'
         >
          <p>
          The faction with the highest troop count on {weekEndDate} will recieve a reward of RewardID: {controlPoint.rewardId}
       </p>
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