import { Center, Flex } from "@chakra-ui/react";
import React, {useEffect, useState } from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,

  TableContainer,
} from '@chakra-ui/react';
import {getWeekEndDate} from "@src/core/api/RyoshiDynastiesAPICalls";

const InfoTap = ({onClose, controlPoint=[], refreshControlPoint}) => {
  
  const [area, setAreas] = useState([]);
  const [weekEndDate, setWeekEndDate] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const GetWeekEndDate = async () => {
    const timestamp = await getWeekEndDate();
    setWeekEndDate(formatDate(timestamp));
  }
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  useEffect(() => {
    if(controlPoint.leaderBoard !== undefined)
    {
      GetWeekEndDate();
      setAreas(<Tbody>
        {controlPoint.leaderBoard.filter((faction, index) => index < 5).map((faction, index ) => 
      (<Tr key={index}>
        <Td textAlign='center'>{index+1}</Td>
        <Td textAlign='center'>{faction.name}</Td>
        <Td textAlign='center'>{faction.totalTroops}</Td>
      </Tr>))}</Tbody>)
      setIsLoaded(true);
    }
    }, [controlPoint])

    useEffect(() => {
      setIsLoaded(false);
      console.log("opened info tap")
      refreshControlPoint();
      }, [])

  return (
    <>
    
    {isLoaded ? (
      <>
      <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around'>
      <TableContainer>
        <Table size='m'>
          <Thead>
            <Tr>
              <Th textAlign='center'>Rank</Th>
              <Th textAlign='center'>Faction</Th>
              <Th textAlign='center'>Troops</Th>
            </Tr>
          </Thead>
          {area}
          </Table>
      </TableContainer>
      <Flex 
       marginTop='12'
       marginLeft='4'
       marginRight='4'
       >
        <p>
          The faction with the highest troop count on {weekEndDate} will recieve a reward of RewardID: {controlPoint.rewardId}
        </p>
      </Flex>
    </Flex>
    </> 
       ) : (
        <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around'>
        <TableContainer>
          <Table size='m'>
            <Thead>
              <Tr>
                <Th textAlign='center'>Rank</Th>
                <Th textAlign='center'>Faction</Th>
                <Th textAlign='center'>Troops</Th>
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
         marginLeft='4'
         marginRight='4'
         >
          <p>
          The faction with the highest troop count on {weekEndDate} will recieve a reward of RewardID: {controlPoint.rewardId}
       </p>
        </Flex>
      </Flex>
      )}
    </>
  )
}

export default InfoTap;