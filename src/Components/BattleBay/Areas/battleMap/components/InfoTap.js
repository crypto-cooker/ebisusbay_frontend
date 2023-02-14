import { Flex } from "@chakra-ui/react";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

// interface faction {
//   rank: number,
//   faction: String,
//   troops: number
// }


const InfoTap = ({ factions = [] }) => {

  return (
    <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around'>
      <div style={{ margin: '8px 24px' }}>
        <p>
          The faction with the highest troop count on (Date & Time Here) will recieve a reward of (Reward Here)
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
            {factions.map((faction, index) => (<Tr key={index}>
              <Td textAlign='center'>{faction.rank}</Td>
              <Td textAlign='center'>{faction.faction}</Td>
              <Td textAlign='center'>{faction.troops}</Td>
            </Tr>))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}

export default InfoTap;