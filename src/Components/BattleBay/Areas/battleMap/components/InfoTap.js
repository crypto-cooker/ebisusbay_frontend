import { Flex } from "@chakra-ui/react";
import React, {useEffect, useState } from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import {getWeekEndDate} from "@src/core/api/RyoshiDynastiesAPICalls";

const InfoTap = ({ factions = [], controlPoint=[], refreshControlPoint}) => {
  const [area, setAreas] = useState([]);
  const [weekEndDate, setWeekEndDate] = useState('');

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
      setAreas(controlPoint.leaderBoard.filter((faction, index) => index < 5).map((faction, index ) => 
      (<Tr key={index}>
        <Td textAlign='center'>{index+1}</Td>
        <Td textAlign='center'>{faction.name}</Td>
        <Td textAlign='center'>{faction.totalTroops}</Td>
      </Tr>)))
    }
    }, [controlPoint])

    useEffect(() => {
      console.log("opened info tap")
      refreshControlPoint();
      }, [])

  return (
    <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around'>
      <div style={{ margin: '8px 24px' }}>
        <p>
          The faction with the highest troop count on {weekEndDate} will recieve a reward of RewardID: {controlPoint.rewardId}
        </p>
      </div>
      <TableContainer>
        <Table size='m'>
          <Thead>
            <Tr>
              <Th textAlign='center'>Rank</Th>
              <Th textAlign='center'>Faction</Th>
              <Th textAlign='center'>Troops</Th>
            </Tr>
          </Thead>
          <Tbody>
            {area}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}

export default InfoTap;