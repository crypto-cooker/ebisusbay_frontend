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
import FactionRegistrationForm from './FactionRegistrationForm';
import {subscribeFaction, getSeasonGameId, getProfileId, getFactionsOwned, getFactionsRegistered} from "@src/core/api/RyoshiDynastiesAPICalls";

import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

const AllianceCenter = ({onBack}) => {

  const user = useSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();
  const {address, theme, profile} = useSelector((state) => state.user);

  const { isOpen: isOpenFaction, onOpen: onOpenFaction, onClose: onCloseFaction } = useDisclosure();
  const { isOpen: isOpenRegister, onOpen: onOpenRegister, onClose: onCloseRegister } = useDisclosure();
  const GetRegistrationColor = (registered) => {if(registered) {return 'green'} else {return 'red'}}
  const GetRegisterButtonText = (registered) => {if(registered) {return 'Registered'} else {return 'Register'}}

  const [gameId, setGameId] = useState(0);
  // const playerFactions = [];
  const [registeredFactions, setRegisteredFactions] = useState([]);
  const [playerFactions, setPlayerFactions] = useState([]);

  const [selectedFaction, setSelectedFaction] = useState(0);
  const [factionsDisplay, setFactionDisplay] = useState([]);
  
  //for refreshing the page after a faction is updated
  const [modalOpen, setModalOpen] = useState(false);
  const handleAddClick = () => {
    setModalOpen(true);
  };
  const handleClose = ()=>{
    setModalOpen(false)
    setGameId(getSeasonGameId());
    GetFactions();
  }
  //return wheter the faction exists in the registered factions array
  const isRegistered = (factionId) => {
    for (let i = 0; i < registeredFactions.length; i++) {
      if (registeredFactions[i].id === factionId) {
        return true;
      }
    }
    return false;
  }

  const RegistrationAction = async (factionId) => {
    if(isRegistered(factionId)) {
      console.log('Already Registered')
    } else {
      let signatureInStorage = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        try {
          // console.log("factionId: " + Number(factionId));
          var data = await subscribeFaction(user.address.toLowerCase(), signatureInStorage, Number(factionId));
          if(data.status === 200) {
            // console.log('Registered')
            GetFactions();
          }
        } catch (error) {
          console.log(error)
        }
      }

        
      }
    }

  useEffect(() => {
    setGameId(getSeasonGameId());
    GetFactions();
  }, [selectedFaction, modalOpen]);

  function selectFaction(faction) {
    setSelectedFaction(faction);
    handleAddClick();
    onOpenFaction();
  }
  const GetFactions = async () => {
    console.log('Getting Factions');
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await getFactionsOwned(user.address.toLowerCase(), signatureInStorage);
        const data2 = await getFactionsRegistered(user.address.toLowerCase(), signatureInStorage);

        setRegisteredFactions(data2.data.data);
        setPlayerFactions(data.data.data);

      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    if(registeredFactions.length > 0) {
      setFactionDisplay(playerFactions.map((faction, index) => (
        <Tr key={index}>
          <Td textAlign='center'>{faction.name}</Td>
          <Td textAlign='center'>
            <Button colorScheme={GetRegistrationColor(isRegistered(faction.id))}
              onClick={() => {RegistrationAction(faction.id)}}>{GetRegisterButtonText(isRegistered(faction.id))}
            </Button>
          </Td>
          <Td textAlign='center'>{faction.type}</Td>
          {/* <Td textAlign='center'>{faction.troops}</Td> */}
          {/* <Td textAlign='center'>{faction.addresses}</Td> */}
          <Td textAlign='center'>
            <Button colorScheme='blue' onClick={() => {selectFaction(faction)}}>Edit</Button>
          </Td>
        </Tr>
        )))
    }
  }, [registeredFactions]);
  
  return (
    <section className="gl-legacy container">

      <FactionForm isOpen={isOpenFaction} onClose={onCloseFaction} faction={selectedFaction} handleClose={handleClose}/>
      <FactionRegistrationForm isOpen={isOpenRegister} onClose={onCloseRegister} handleClose={handleClose}/>

      <Button margin={'36px'} position={'absolute'} onClick={onBack}>Back to Village Map</Button>
      <Box >
        <Center>
        <Image src='img/battle-bay/alliancecenter_day.png'/>
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
              {/* <Th textAlign='center'>Troops</Th> */}
              {/* <Th textAlign='center'>Addresses</Th> */}
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