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

const InfoTap = ({ factions = [], controlPoint=[]}) => {
  const [area, setAreas] = useState([]);
  useEffect(() => {
    if(controlPoint.leaderBoard !== undefined)
    {
      setAreas(controlPoint.leaderBoard.filter((faction, index) => index < 5).map((faction, index ) => 
      (<Tr key={index}>
        <Td textAlign='center'>{index+1}</Td>
        <Td textAlign='center'>{faction.name}</Td>
        <Td textAlign='center'>{faction.totalTroops}</Td>
      </Tr>)))
    }
    }, [controlPoint])
  return (
    <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around'>
      <div style={{ margin: '8px 24px' }}>
        <p>
          The faction with the highest troop count on 
          (Date & Time Here) 
          will recieve a reward of RewardID: {controlPoint.rewardId}
        </p>
      </div>
      <TableContainer>
        <Table variant='simple'>
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