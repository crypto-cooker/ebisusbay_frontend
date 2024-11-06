import { Box, Heading, Table, TableCaption, Tbody, Td, Text, Thead, Tr } from '@chakra-ui/react';

export default function RewardDocument() {
  return (
    <>
      <Box>
        <Text textAlign={'center'} fontSize={20}>You will receive bonus troops according to your NFT Rank</Text>
        <Table>
          <Thead>
            <Tr fontWeight={'bold'}>
              <Td>From</Td>
              <Td>To</Td>
              <Td>Troops</Td>
            </Tr>
          </Thead>
          <Tbody>
            {rewardsForNftRank.map((reward, index) => {
              return (
                <Tr>
                  <Td>{reward.from}</Td>
                  <Td>{reward.to}</Td>
                  <Td fontWeight={'bold'}>{reward.troops}</Td>
                </Tr>
              );
            })}
            <Tr>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Box>
        <Text textAlign={'center'} fontSize={20}>You will receive bonus troops for these specific traits.</Text>
        <Table variant="simple">
          <Thead>
            <Tr fontWeight={'blod'}>
              <Td>Trait Type</Td>
              <Td>Value</Td>
              <Td>Troops</Td>
            </Tr>
          </Thead>
          <Tbody>
            {troops.map((troop, index) => {
              return (
                <Tr key={index}>
                  <Td>{troop.traitType}</Td>
                  <Td>{troop.value}</Td>
                  <Td fontWeight={'bold'}>{troop.troops}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}

const troops = [
  { traitType: 'Miscellaneous', value: 'Red Snapper', troops: 1000 },
  { traitType: 'Clothing', value: 'Diving Suit', troops: 500 },
  { traitType: 'Tools', value: 'Fishcane', troops: 50 },
  { traitType: 'Tools', value: 'fishing Rod', troops: 50 },
  { traitType: 'Miscellaneous', value: 'barnacles', troops: 20 },
  { traitType: 'Miscellaneous', value: 'Snorkel', troops: 20 },
  { traitType: 'Mouth', value: 'Fish Hook', troops: 10 },
  { traitType: 'Miscellaneous', value: 'Seaweed', troops: 10 },
];

const rewardsForNftRank = [
  { from: 1, to: 500, troops: 100 },
  { from: 500, to: 1000, troops: 50 },
  { from: 1000, to: 2000, troops: 35 },
  { from: 2000, to: '_', troops: 20 },
];
