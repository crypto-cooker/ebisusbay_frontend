import { useState, useEffect} from "react";
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
import FactionForm from './FactionForm';
import SetTheFactionName from './FactionForm';
import FactionRegistrationForm from './FactionRegistrationForm';
import { getFactions, subscribeFaction, getGameId } from "@src/core/api/RyoshiDynastiesAPICalls";
import { logEvent } from "firebase/analytics";

const AllianceCenter = ({onBack, factions: factions=[]}) => {

  const { isOpen: isOpenFaction, onOpen: onOpenFaction, onClose: onCloseFaction } = useDisclosure();
  const { isOpen: isOpenRegister, onOpen: onOpenRegister, onClose: onCloseRegister } = useDisclosure();
  const factionsData = [];
  const playerFactions = factions.filter(faction => faction.owned);
  const [selectedFaction, setSelectedFaction] = useState(playerFactions[0]);
  const GetRegistrationColor = (registered) => {if(registered) {return 'green'} else {return 'red'}}
  const GetRegisterButtonText = (registered) => {if(registered) {return 'Registered'} else {return 'Register'}}
  const [factionsDisplay, setFactionDisplay] = useState([]);
  const [gameId, setGameId] = useState(0);
  
  function RegistrationAction(registered) {
      console.log(gameId)
      if(registered) {
      console.log('Registered')
    } else {
      subscribeFaction(faction.factionId, gameId);
        console.log(data);
        if(data.status === 200) {
          console.log('Registered')
        }
      }
    }
  useEffect(() => {
    setGameId(getGameId());
    getFactions();
  }, []);
  
  const getFactions = async () => {
    // getFactions(0).then((data) => {
    //   factionsData = data.factions; 
    //   setFactionDisplay(factionsData.map((faction, i) => 
    //     (
    //       <Tr key={i}>
    //         <Td textAlign='center'>{faction.faction}</Td>
    //         <Td textAlign='center'>
    //           <Button colorScheme={GetRegistrationColor(faction.registered)} 
    //           // onClick={}
    //           ></Button>
    //         </Td>
    //         <Td textAlign='center'>{faction.factionType}</Td>
    //         <Td textAlign='center'>{faction.troops}</Td>
    //         <Td textAlign='center'>{faction.addresses}</Td>
    //         <Td textAlign='center'>
    //           <Button colorScheme='blue' onClick={() => {setSelectedFaction(playerFactions[index]), onOpenFaction()}}>Edit</Button>
    //         </Td>
    //       </Tr>
    //     )))
    // });
    setFactionDisplay(playerFactions.map((faction, index) => (
      // <div style={{ margin: '8px 24px' }}>
      <Tr key={index}>
        <Td textAlign='center'>{faction.faction}</Td>
        <Td textAlign='center'>
          <Button colorScheme={GetRegistrationColor(faction.registered)}
            onClick={() => {RegistrationAction(faction.registered)}}>{GetRegisterButtonText(faction.registered)}
          </Button>
        </Td>
        <Td textAlign='center'>{faction.clanType}</Td>
        <Td textAlign='center'>{faction.troops}</Td>
        <Td textAlign='center'>{faction.addresses}</Td>
        <Td textAlign='center'>
          <Button colorScheme='blue' onClick={() => {setSelectedClan(playerClans[index]), onOpenClan()}}>Edit</Button>
        </Td>
      </Tr>
      )))
  }
  return (
    <section className="gl-legacy container">
      <FactionForm isOpen={isOpenFaction} onClose={onCloseFaction} factions={factions} factionToModify={selectedFaction}/>
      <FactionRegistrationForm isOpen={isOpenRegister} onClose={onCloseRegister} factions={factions}/>
      
      <button onClick={onBack}>Back to Village Map</button>
      <Box >
        <Center>
         <Image src="/img/battle-bay/allianceCenter.png" alt="Alliance Center" />
        </Center>
      </Box>
      <Heading className="title text-center">Alliance Center</Heading>
      <p className="text-center">The Alliance Center allows for Faction management.</p>

      <p style={{textAlign:'left'}}>Your Factions</p>
      <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around'>
      <div style={{ margin: '8px 24px' }}>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th textAlign='center'>Faction Name</Th>
              <Th textAlign='center'>Registered this Season</Th>
              <Th textAlign='center'>Faction Type</Th>
              <Th textAlign='center'>Troops</Th>
              <Th textAlign='center'>Addresses</Th>
              <Th textAlign='center'></Th>
            </Tr>
          </Thead>
          <Tbody>
          {factionsDisplay}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex mt='30pt' mb='30pt'>
      <Button type="legacy"
          onClick={() => {onOpenRegister()}}
          className="flex-fill">
          + Create New Faction
        </Button>
      </Flex>
      </div>
      </Flex>
      <Flex>
      <Box>
      {/* <button type="button" class="btn" id="editFaction" 
        onClick={() => {onOpenFaction();}}>Edit Faction</button> */}
      </Box>
      </Flex>
      
    </section>
  )
};


export default AllianceCenter;