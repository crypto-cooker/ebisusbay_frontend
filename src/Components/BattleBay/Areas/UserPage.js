import {
  Heading,
  useDisclosure,
  Flex,
  Box,
  Button,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,

} from '@chakra-ui/react';
import DelegateForm from './DelegateForm';

const player = [
  { addresses: "0x000002", troops: 52, factionsOwned: ["Mad Merkat"],  delegations: [{ faction: "Mad Merkat", troops: 34 }, {faction: "CroSkulls", troops: 10 }] },
]

const UserPage = ({onBack, factions=[]}) => {
  const clansContainingPlayer = factions.filter(faction => faction.addresses.includes(player[0].addresses));
  const troopsTotal = player[0].troops;
  const troopsDelegated = player[0].delegations.reduce((a, b) => a + b.troops, 0);
  const troopsNotDelegated = troopsTotal - troopsDelegated;
  const delegations = player[0].delegations;

  //for delegate form
  const arrayColumn = (arr, n) => arr.map(x => x[n]);
  const factionNames = arrayColumn(factions, 'faction')
  const { isOpen, onOpen: onOpenDelegate, onClose } = useDisclosure();


  return (
    <section className="gl-legacy container">
      <DelegateForm isOpen={isOpen} onClose={onClose} factions={factionNames} player={player}/>

      <Flex>
          <Button style={{ display: 'flex', marginTop: '16px', marginBottom: '16px'}} 
            onClick={onBack} variant='outline'size='lg'> 
            Back to Village Map</Button>
      </Flex>

      <Flex alignContent={'center'} justifyContent={'center'}>
        <Image
          borderRadius='full'
          align={'center'}
          objectFit='cover'
          boxSize='150px'
          src='img/battle-bay/profile-avatar.png'
        />
      </Flex>

      <Heading marginTop={6} textAlign={'center'}>User: '{'Connected Wallet Address Here'}'</Heading>

      

      <Flex margin={'8'}>
        <Heading  size='md' style={{textAlign:'left'}}>Your Troops:</Heading>
        
        
        <Box marginLeft={8}>
          <p style={{textAlign:'left'}}>Total Troops: {troopsTotal}</p>
          <p style={{textAlign:'left'}}>Troops Delegated: {troopsDelegated}</p>
          <p style={{textAlign:'left'}}>Troops Available: {troopsNotDelegated}</p>
        </Box>
        <Box marginLeft={8}>
        

          {/* <p style={{textAlign:'left'}}>Delegations:</p> */}
          <Table variant='simple' size='sm'>
            <Thead>
              <Tr>
                <Th textAlign='center'>Clan Name</Th>
                <Th textAlign='center'>Troops Delegated</Th>
              </Tr>
            </Thead>
            <Tbody>
              {delegations.map((delegation, index) => (
              <Tr key={index}>
                <Td textAlign='center'>{delegation.faction}</Td>
                <Td textAlign='center'>{delegation.troops}</Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

      </Flex>
      <Button style={{ display: 'flex', marginTop: '16px' }} colorScheme='gray' 
          onClick={() => {onOpenDelegate();}}>Delegate Troops </Button>

      <Flex margin={'8'}>
        <Heading  size='md' style={{textAlign:'left'}}>Your Clans:</Heading>
        <Box marginLeft={8}>
          <p style={{textAlign:'left'}}>{player[0].factionsOwned} (Owner)</p>
          <p style={{textAlign:'left'}}>{clansContainingPlayer.map((faction, index) => (faction.faction))} (Member)</p>

        </Box>


      </Flex>
   

    </section>
  )
};


export default UserPage;