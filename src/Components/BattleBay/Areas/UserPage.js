import { useState, useEffect } from "react";
import {useSelector} from "react-redux";
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
import { getProfileTroops, getAllFactions, addTroops } from "@src/core/api/RyoshiDynastiesAPICalls";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

const UserPage = ({onBack}) => {
  // const clansContainingPlayer = factions.filter(faction => faction.addresses.includes(player[0].addresses));
  const [factions, setFactions] = useState([]);
  const [isLoading, getSigner] = useCreateSigner();
  
  const [troops, setTotalTroops] = useState(0);
  // const troopsTotal = player[0].troops;
  // const troopsDelegated = player[0].delegations.reduce((a, b) => a + b.troops, 0);
  // const troopsNotDelegated = troopsTotal - troopsDelegated;
  // const delegations = player[0].delegations;
  const user = useSelector((state) => state.user);

  const SetUp = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const factionResponse = await getAllFactions();
        setFactions(factionResponse);
        //itterate through factions
        // factions.forEach(faction => {
        //   console.log(faction.name)
        // });
 
        // setFactions(factions.data.data)
        const res = await getProfileTroops(user.address.toLowerCase(), signatureInStorage);
        setTotalTroops(res.data.data[0].troops)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const AddTroops = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const res = await addTroops(user.address.toLowerCase(), signatureInStorage, 8);
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
  }

  //for delegate form
  // const arrayColumn = (arr, n) => arr.map(x => x[n]);
  // const factionNames = arrayColumn(factions, 'name')
  const { isOpen, onOpen: onOpenDelegate, onClose } = useDisclosure();
  const [delegateMode, setDelegateMode] = useState("delegate");

  useEffect(() => {
    SetUp();
  }, []);

  return (
    <section className="gl-legacy container">
      <DelegateForm isOpen={isOpen} onClose={onClose} delegateMode={delegateMode} factions={factions} troops={troops}/>

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

      <Heading marginTop={6} marginBottom={6} textAlign={'center'}>{user.address}</Heading>
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
            
          <Heading  size='md' textAlign={'center'}>Your Troops: {troops}</Heading>
              {/* <p style={{textAlign:'center'}}>Available: {troopsNotDelegated}</p> */}
              {/* <p style={{textAlign:'center'}}>Delegated: {troopsDelegated}</p> */}
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
                  {/* {delegations.map((delegation, index) => (
                  <Tr key={index}>
                    <Td textAlign='center'>{delegation.faction}</Td>
                    <Td textAlign='center'>{delegation.troops}</Td>
                  </Tr>
                  ))} */}
                </Tbody>
              </Table>
            </Flex>

              <Flex alignContent={'center'} justifyContent={'center'} marginBottom={5}>
              <Button style={{ display: 'flex'}} margin={2} colorScheme='gray' variant='outline'
                onClick={AddTroops}>Add Troops </Button>
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
            {/* <p textAlign={'center'}>{player[0].factionsOwned} (Owner)</p> */}
            {/* <p textAlign={'center'}>{clansContainingPlayer.map((faction, index) => (faction.faction))} (Member)</p> */}
          </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </section>
  )
};


export default UserPage;