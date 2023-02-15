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
import DelegateForm from './DelegateForm';
const AllianceCenter = ({onBack, factions=[]}) => {

  const playerFactions = factions.filter(faction => faction.owned)
  const { isOpen: isOpenClan, onOpen: onOpenClan, onClose: onCloseClan } = useDisclosure();
  const { isOpen, onOpen: onOpenDelegate, onClose } = useDisclosure();


    
  const arrayColumn = (arr, n) => arr.map(x => x[n]);
  const factionNames = arrayColumn(factions, 'faction')
  const EditClan = (faction) => {
    console.log("Edit Clan", faction)
    setSelectedFaction(faction)
    onOpenClan();
  }
  
  return (
    <section className="gl-legacy container">
      <ClanForm isOpen={isOpenClan} onClose={onCloseClan} factions={factionNames}/>
      <DelegateForm isOpen={isOpen} onClose={onClose} factions={factionNames}/>
      
      <button class="btn" onClick={onBack}>Back to Village Map</button>
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
              <Th textAlign='center'>Clan Type</Th>
              <Th textAlign='center'>Troops</Th>
              <Th textAlign='center'>Addresses</Th>
              <Th textAlign='center'></Th>
            </Tr>
          </Thead>
          <Tbody>
            {playerFactions.map((faction, index) => (
            // <div style={{ margin: '8px 24px' }}>
            <Tr key={index}>
              <Td textAlign='center'>{faction.faction}</Td>
              <Td textAlign='center'>{faction.clanType}</Td>
              <Td textAlign='center'>{faction.troops}</Td>
              <Td textAlign='center'>{faction.addresses}</Td>
              <Td textAlign='center'>
                <Button colorScheme='blue' onClick={() => {EditClan(faction)}}>Edit
                  </Button></Td>
            </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex mt='30pt' mb='30pt'>
      <Button type="legacy"
          onClick={() => {onOpenClan();}}
          className="flex-fill">
          + Create Clan
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
      
      <Button style={{ display: 'flex', marginTop: '16px' }} colorScheme='gray' onClick={() => {onOpenDelegate();}}>Delegate Troops </Button>
    </section>
  )
};


export default AllianceCenter;