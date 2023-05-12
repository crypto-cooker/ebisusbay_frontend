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
  Text,
  VStack

} from '@chakra-ui/react';
import FactionForm from './FactionForm';
import DelegateForm from './DelegateForm';
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
import {createSuccessfulTransactionToastContent} from "@src/utils";

import { useFormik } from 'formik';
import FactionPfp from './FactionIconUpload';
import localFont from 'next/font/local';
const gothamBook = localFont({ src: '../../../fonts/Gotham-Book.woff2' })
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {getProfile} from "@src/core/cms/endpoints/profile";
import { getProfileTroops, getAllFactions, addTroops } from "@src/core/api/RyoshiDynastiesAPICalls";

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
  const [factionRegistered, setFactionRegistered] = useState(false);
  
  //for refreshing the page after a faction is updated
  const [modalOpen, setModalOpen] = useState(false);

  const [factions, setFactions] = useState([]);
  const [troops, setTotalTroops] = useState(0);
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
        console.log(tr)
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
        console.log(res)
        SetUp();
      } catch (error) {
        console.log(error)
      }
    }
  }

  const { isOpen, onOpen: onOpenDelegate, onClose } = useDisclosure();
  const [delegateMode, setDelegateMode] = useState("delegate");

  useEffect(() => {
    SetUp();
  }, [troops]);

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
      GetFactions();
    } else {
      let signatureInStorage = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        try {
          // console.log(signatureInStorage)
          //0x0000000000000000000000000000000000000001
          const registerFactionContract = new Contract(config.contracts.allianceCenter, AllianceCenterContract, user.provider.getSigner());
          const tx = await registerFactionContract.registerFaction(user.address.toLowerCase())
          const receipt = await tx.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

          // console.log('Registered')
        } catch (error) {
          console.log(error)
          toast.error("ERROR: This account has already registered a faction this season.");
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
  }
  const GetFactions = async () => {
    // console.log('Getting Factions');
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
        setFactionRegistered(isRegistered(data.data.data[0].id));

      } catch (error) {
        console.log(error)
      }
    }
  }
  useEffect(() => {
    if(selectedFaction !== 0) {
      handleAddClick();
      onOpenFaction();
    }
  }, [selectedFaction]);


  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if(playerFactions.length > 0) {
      setFactionDisplay(playerFactions.map((faction, index) => (
        <>
          <VStack>
            <form onSubmit={handleSubmit}>
               <FactionPfp 
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleSubmit}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              handleBlur={handleBlur}
              faction={faction}
              onSuccess={handleTJUploadSuccess}
            />
            </form>
          <Text className={gothamBook.className} fontSize='24' textAlign='center'>{faction.name}</Text>
          

          <Flex alignContent={'center'} justifyContent={'center'}>
          <Box
            >
            <RdButton
              hideIcon={true}
              w='200px'
              fontSize={{base: 'lg', sm: 'xl'}}
              stickyIcon={true}
              onClick={() => {selectFaction(faction)}}
            >
            Edit Faction
            </RdButton>
            </Box>
        </Flex>

        <Button colorScheme={GetRegistrationColor(isRegistered(faction.id))}
              onClick={() => {RegistrationAction(faction.id)}}>{GetRegisterButtonText(isRegistered(faction.id))}
            </Button>

          </VStack>
        </>
        )))
        setCreateFactionButton()
    }
    else
    {
      setCreateFactionButton(
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Box
            ps='20px'>
            <RdButton
              w='250px'
              fontSize={{base: 'xl', sm: '2xl'}}
              stickyIcon={true}
              onClick={() => {onOpenRegister()}}
            >
          + Create New Faction
            </RdButton>
            </Box>
        </Flex>
      )
    }
  }, [playerFactions]);
  
  return (
    <section className="gl-legacy container">

      <FactionForm isOpen={isOpenFaction} onClose={onCloseFaction} faction={selectedFaction} handleClose={handleClose} isRegistered={factionRegistered}/>
      <FactionRegistrationForm isOpen={isOpenRegister} onClose={onCloseRegister} handleClose={handleClose}/>
      <DelegateForm isOpen={isOpen} onClose={onClose} delegateMode={delegateMode} factions={factions} troops={troops} setTotalTroops = {setTotalTroops}/>

      <Button margin={'36px'} className={gothamBook.className} position={'absolute'} onClick={onBack}>Back to Village Map</Button>
      <Box >
        <Center>
        <Image src='img/battle-bay/alliancecenter_day.png'/>
        </Center>
      </Box>
      <Heading className={gothamBook.className} textAlign='center'>Alliance Center</Heading>
      <p className={gothamBook.className} textAlign='center'>The Alliance Center allows for Faction management.</p>
      <Heading  size='md' >Your Troops: {troops}</Heading>
      <Box
        ps='20px'
        marginTop='6'
        marginBottom='8'
        >
        <RdButton 
        w='250px'
        fontSize={{base: 'lg', sm: 'xl'}}
        stickyIcon={true}
        onClick={AddTroops}>Add Troops
        </RdButton>
      </Box>
      <Box
        ps='20px'
        marginTop='6'
        marginBottom='8'
        >
        <RdButton 
        w='250px'
        fontSize={{base: 'lg', sm: 'xl'}}
        stickyIcon={true}

                onClick={() => {setDelegateMode('delegate'), onOpenDelegate();}}>Delegate Troops 
        </RdButton>
      </Box>

      <p className={gothamBook.className} style={{textAlign:'left'}}>Your Factions</p>
      <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around'>
      <div style={{ margin: '8px 24px' }}>
      {factionsDisplay}
      <Flex  mb='20pt'>
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