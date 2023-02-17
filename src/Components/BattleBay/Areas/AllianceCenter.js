import { useState} from "react";
import {
  Heading,
  useDisclosure,
  Image,
  Box,
  Center,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,

} from '@chakra-ui/react';
import ClanForm from './ClanForm';
import SetTheClanName from './ClanForm';
import ClanRegistrationForm from './ClanRegistrationForm';
import { logEvent } from "firebase/analytics";

const AllianceCenter = ({onBack, factions: clans=[]}) => {
  const { isOpen: isOpenClan, onOpen: onOpenClan, onClose: onCloseClan } = useDisclosure();
  const { isOpen: isOpenRegister, onOpen: onOpenRegister, onClose: onCloseRegister } = useDisclosure();

  const playerClans = clans.filter(clan => clan.owned);
  // console.log(playerClans)
  const [selectedClan, setSelectedClan] = useState(playerClans[0]);
  const GetRegistrationColor = (registered) => {if(registered) {return 'green'} else {return 'red'}}
  
  return (
    <section className="gl-legacy container">
      <ClanForm isOpen={isOpenClan} onClose={onCloseClan} clans={clans} clanToModify={selectedClan}/>
      <ClanRegistrationForm isOpen={isOpenRegister} onClose={onCloseRegister} clans={clans}/>
      
      <button onClick={onBack}>Back to Village Map</button>
      <Box >
        <Center>
         <Image src="/img/battle-bay/allianceCenter.png" alt="Alliance Center" />
        </Center>
      </Box>
      <Heading className="title text-center">Alliance Center</Heading>
      <p className="text-center">The Alliance Center allows for Clan management.</p>

      <p style={{textAlign:'left'}}>Your Clans</p>
      <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around'>
      <div style={{ margin: '8px 24px' }}>
      
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th textAlign='center'>Clan Name</Th>
              <Th textAlign='center'>Registered this Season</Th>
              <Th textAlign='center'>Clan Type</Th>
              <Th textAlign='center'>Troops</Th>
              <Th textAlign='center'>Addresses</Th>
              <Th textAlign='center'></Th>
            </Tr>
          </Thead>
          <Tbody>
            {playerClans.map((clan, index) => (
            // <div style={{ margin: '8px 24px' }}>
            <Tr key={index}>
              <Td textAlign='center'>{clan.faction}</Td>
              <Td textAlign='center'>
                <Button colorScheme={GetRegistrationColor(clan.registered)} 
                // onClick={}
                ></Button>
              </Td>
              <Td textAlign='center'>{clan.clanType}</Td>
              <Td textAlign='center'>{clan.troops}</Td>
              <Td textAlign='center'>{clan.addresses}</Td>
              <Td textAlign='center'>
                <Button colorScheme='blue' onClick={() => {setSelectedClan(playerClans[index]), onOpenClan()}}>Edit</Button>
              </Td>
            </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex mt='30pt' mb='30pt'>
      <Button type="legacy"
          onClick={() => {onOpenRegister()}}
          className="flex-fill">
          + Register New Clan
        </Button>
      </Flex>
      </div>
      </Flex>
      <Flex>
      <Box>
      {/* <button type="button" class="btn" id="editFaction" 
        onClick={() => {onOpenClan();}}>Edit Clan</button> */}
      </Box>
      </Flex>
      
    </section>
  )
};


export default AllianceCenter;