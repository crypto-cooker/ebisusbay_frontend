import { useState, useEffect } from "react";
import {useSelector} from "react-redux";
import {
  Heading,
  useDisclosure,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Spacer,
} from '@chakra-ui/react';
import DelegateForm from './DelegateForm';
import { getProfileTroops, getAllFactions, addTroops } from "@src/core/api/RyoshiDynastiesAPICalls";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {getProfile} from "@src/core/cms/endpoints/profile";
// import {hostedImage, ImageKitService} from "@src/helpers/image";

const UserPage = ({onBack}) => {

  const [factions, setFactions] = useState([]);
  const [isLoading, getSigner] = useCreateSigner();
  const [troops, setTotalTroops] = useState(0);
  const user = useSelector((state) => state.user);
  const {address, theme, profile} = useSelector((state) => state.user);

  const SetUp = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        let profile = await getProfile(user.address.toLowerCase());

        const factionResponse = await getAllFactions();
        setFactions(factionResponse);
        const tr = await getProfileTroops(user.address.toLowerCase(), signatureInStorage);
        setTotalTroops(tr)
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
        SetUp();
      } catch (error) {
        console.log(error)
      }
    }
  }

  // const profilePicture = profile.profilePicture ?
    // ImageKitService.from(profile.profilePicture).setWidth(200).setHeight(200).buildUrl() :
    // hostedImage('/img/profile-avatar.webp');

  const { isOpen, onOpen: onOpenDelegate, onClose } = useDisclosure();
  const [delegateMode, setDelegateMode] = useState("delegate");

  useEffect(() => {
    SetUp();
  }, [troops]);

  return (
    <section className="gl-legacy container">
      <DelegateForm isOpen={isOpen} onClose={onClose} delegateMode={delegateMode} factions={factions} troops={troops} setTotalTroops = {setTotalTroops}/>

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
          src={user.profilePicture}
        />
      </Flex>

      <Tabs>
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