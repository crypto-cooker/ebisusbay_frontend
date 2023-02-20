import { useState } from "react";
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
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  StackDivider,
  Spacer,

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

  const [delegateMode, setDelegateMode] = useState("delegate");


  return (
    <section className="gl-legacy container">
      <DelegateForm isOpen={isOpen} onClose={onClose} delegateMode={delegateMode} factions={factionNames} player={player}/>

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

      <Heading marginTop={6} marginBottom={6} textAlign={'center'}>User: '{'Connected Wallet Address Here'}'</Heading>
      <Tabs marginTop={18}>
        <TabList>
          {/* <Tab>Troops</Tab> */}
          <Tab>Troops</Tab>
          <Tab>Clans</Tab>
        </TabList>

        <TabPanels>

          <TabPanel>
          <VStack
          spacing={0}
          align='stretch'
          >
            
          <Heading  size='md' textAlign={'center'}>Your Troops: {troopsTotal}</Heading>
              <p style={{textAlign:'center'}}>Available: {troopsNotDelegated}</p>
              <p style={{textAlign:'center'}}>Delegated: {troopsDelegated}</p>
            <Spacer />
            <Flex alignContent={'center'} justifyContent={'center'} textAlign='center'  >
              <Table variant='simple' size='sm' maxWidth={400} marginTop={"5"} marginBottom={"18"} border={'1px solid white'} borderRadius={'10'}>
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
            </Flex>

              <Flex alignContent={'center'} justifyContent={'center'} marginBottom={5}>
              <Button style={{ display: 'flex'}} margin={2} colorScheme='gray' variant='outline'
                onClick={() => {setDelegateMode('delegate'), onOpenDelegate();}}>Delegate Troops </Button>
              <Button style={{ display: 'flex'}} margin={2} colorScheme='red' variant='outline'
                onClick={() => {setDelegateMode('recall'), onOpenDelegate();}}>Recall Troops </Button>
            </Flex>
          </VStack>
          </TabPanel>
          <TabPanel>
            <Heading  size='md' textAlign={'center'}>Your Clans:</Heading>
            <Flex alignContent={'center'} justifyContent={'center'}>
            <p textAlign={'center'}>{player[0].factionsOwned} (Owner)</p>
            {/* <p textAlign={'center'}>{clansContainingPlayer.map((faction, index) => (faction.faction))} (Member)</p> */}
          </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </section>
  )
};


export default UserPage;