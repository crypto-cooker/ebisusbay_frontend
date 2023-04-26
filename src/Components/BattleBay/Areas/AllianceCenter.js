import { useState, useEffect, useRef, useLayoutEffect} from "react";
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
import {getFactionsOwned, getFactionsRegistered} from "@src/core/api/RyoshiDynastiesAPICalls";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

//contracts
import {Contract} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import AllianceCenterContract from "@src/Contracts/AllianceCenterContract.json";

import { useFormik } from 'formik';
import FactionPfp from './FactionIconUpload';

const AllianceCenter = ({onBack}) => {

  const config = appConfig();
  const user = useSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();

  const { isOpen: isOpenFaction, onOpen: onOpenFaction, onClose: onCloseFaction } = useDisclosure();
  const { isOpen: isOpenRegister, onOpen: onOpenRegister, onClose: onCloseRegister } = useDisclosure();
  const GetRegistrationColor = (registered) => {if(registered) {return 'green'} else {return 'red'}}
  const GetRegisterButtonText = (registered) => {if(registered) {return 'Registered'} else {return 'Register'}}

  const [registeredFactions, setRegisteredFactions] = useState([]);
  const [playerFactions, setPlayerFactions] = useState([]);

  const [selectedFaction, setSelectedFaction] = useState(0);
  const [factionsDisplay, setFactionDisplay] = useState([]);
  const [createFactionButton, setCreateFactionButton] = useState([]);
  
  //for refreshing the page after a faction is updated
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleClose = ()=>{
    setModalOpen(false)
    GetFactions();
  }
  const formikProps = useFormik({
    // onSubmit,
    // validationSchema: userInfoValidation,
    // initialValues: getInitialValues(),
    enableReinitialize: true,
  });
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
          console.log(config.contracts.allianceCenter)
          console.log(AllianceCenterContract)
          console.log(user.provider.getSigner())
          console.log(user.address.toLowerCase())
          //0x0000000000000000000000000000000000000001

          const registerFactionContract = new Contract(config.contracts.allianceCenter, AllianceCenterContract, user.provider.getSigner());
          const tx = await registerFactionContract.registerFaction(user.address.toLowerCase())
          const receipt = await tx.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

          console.log('Registered')
        } catch (error) {
          console.log(error)
        }
      } 
    }
  }
  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    validateForm,
    handleSubmit,
  } = formikProps;


  useEffect(() => {
    GetFactions();
  }, [modalOpen]);

  const handleTJUploadSuccess = (e) => {
    GetFactions();
  }

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
        // console.log(data.data.data);
        const data2 = await getFactionsRegistered(user.address.toLowerCase(), signatureInStorage);

        setRegisteredFactions(data2.data.data);
        setPlayerFactions(data.data.data);

      } catch (error) {
        console.log(error)
      }
    }
  }

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    console.log('Updating ');
    if(playerFactions.length > 0) {
      setFactionDisplay(playerFactions.map((faction, index) => (
        <Tr key={index}>
          <Td textAlign='center'>
            <form onSubmit={handleSubmit}>
            <FactionPfp values={values}
              errors={errors}
              touched={touched}
              handleChange={handleSubmit}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              handleBlur={handleBlur}
              faction={faction}
              onSuccess={handleTJUploadSuccess}
            /></form>
            {/* <Image src={faction.image} width={100} height={100}/> */}
          </Td>
          <Td textAlign='center'>{faction.name}</Td>
          <Td textAlign='center'>
            <Button colorScheme={GetRegistrationColor(isRegistered(faction.id))}
              onClick={() => {RegistrationAction(faction.id)}}>{GetRegisterButtonText(isRegistered(faction.id))}
            </Button>
          </Td>
          <Td textAlign='center'>{faction.type}</Td>
          <Td textAlign='center'>
            <Button colorScheme='blue' onClick={() => {selectFaction(faction)}}>Edit</Button>
          </Td>
        </Tr>
        )))
        //empty due to only being allowed one faction
        setCreateFactionButton()
    }
    else
    {
      setCreateFactionButton(
        <Button type="legacy"
          onClick={() => {onOpenRegister()}}
          className="flex-fill">
          + Create New Faction
        </Button>
      )
    }
  }, [playerFactions]);
  
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
              <Th textAlign='center'></Th>
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
        {createFactionButton}
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