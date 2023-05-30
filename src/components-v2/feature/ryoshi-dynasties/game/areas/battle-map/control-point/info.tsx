import { Center, Flex } from "@chakra-ui/react";
import React, {ReactElement, useEffect, useState} from 'react';

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

  const GetWeekEndDate = async () => {
    const timestamp = await getWeekEndDate();
    setWeekEndDate(formatDate(timestamp));
  }
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric"}
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  const parseFactionName = (name: string) => {
    if(name.length > stringProps?.stringLength) {
      return name.substring(0, stringProps?.stringLength) + '...';
    }
    return name;
  }
  const stringProps = useBreakpointValue<StringProps>(
    {
      base: {
        stringLength: 20,
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
      setAreas(<Tbody>
        {controlPoint.leaderBoard.filter((faction, index) => index < 5).map((faction, index ) => 
      (<Tr key={index}>
        <Td textAlign='center'>{index+1}</Td>
        <Td textAlign='center'>{parseFactionName(faction.name)}</Td>
        <Td textAlign='center'>{faction.totalTroops}</Td>
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
       marginLeft='8'
       marginRight='8'
       >
    {isLoaded ? (
      <>
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
          {area}
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