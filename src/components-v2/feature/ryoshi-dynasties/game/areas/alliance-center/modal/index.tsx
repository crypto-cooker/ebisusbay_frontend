import {ReactElement, useEffect, useLayoutEffect, useState} from "react";
import {Box, Button, Center, Flex, Spacer, Text, useDisclosure, VStack} from '@chakra-ui/react';
import FactionForm from '../../../../../../../Components/BattleBay/Areas/FactionForm';
import DelegateForm from '../../../../../../../Components/BattleBay/Areas/DelegateForm';
import FactionRegistrationForm from '../../../../../../../Components/BattleBay/Areas/FactionRegistrationForm';
import {
  addTroops,
  getAllFactions,
  getFactionsOwned,
  getFactionsRegistered,
  getFactionUndeployedArmies,
  getProfileArmies
} from "@src/core/api/RyoshiDynastiesAPICalls";
import {getAuthSignerInStorage} from '@src/helpers/storage';
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

//contracts
import {Contract} from "ethers";
import {appConfig, isLocalEnv} from "@src/Config";
import {toast} from "react-toastify";
import AllianceCenterContract from "@src/Contracts/AllianceCenterContract.json";
import {createSuccessfulTransactionToastContent} from "@src/utils";

import {useFormik} from 'formik';
import FactionPfp from '../../../../../../../Components/BattleBay/Areas/FactionIconUpload';
import localFont from 'next/font/local';
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

import {io} from "socket.io-client";
import {useAppSelector} from "@src/Store/hooks";
import {RdArmy, RdFaction} from "@src/core/services/api-service/types";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

interface AllianceCenterModalProps {
  closeAllianceCenter: () => void;
}

const AllianceCenterModal = ({closeAllianceCenter}: AllianceCenterModalProps) => {

  const config = appConfig();
  const user = useAppSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();
  const [hasFaction, setHasFaction] = useState(false);

  const { isOpen: isOpenFaction, onOpen: onOpenFaction, onClose: onCloseFaction } = useDisclosure();
  const { isOpen: isOpenRegister, onOpen: onOpenRegister, onClose: onCloseRegister } = useDisclosure();
  // const GetRegistrationColor = (registered) => {if(registered) {return 'green'} else {return 'red'}}
  // const GetRegisterButtonText = (registered) => {if(registered) {return 'Registered'} else {return 'Register'}}

  const [registeredFactions, setRegisteredFactions] = useState<RdFaction[]>([]);
  const [playerFaction, setPlayerFaction] = useState<RdFaction[]>([]);
  const [factions, setFactions] = useState([]);

  const [selectedFaction, setSelectedFaction] = useState<RdFaction>();
  const [factionsDisplay, setFactionDisplay] = useState<ReactElement[]>([]);
  const [createFactionButton, setCreateFactionButton] = useState<ReactElement>();
  const [factionRegistered, setFactionRegistered] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
  //for refreshing the page after a faction is updated
  const [modalOpen, setModalOpen] = useState(false);

  const [walletTroops, setWalletTroops] = useState(0);
  const [factionTroops, setFactionTroops] = useState(0);

  const RefreshTroopsAndFactions = async () => {
    if (!user.address) return;

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        
        //needed for faction delegation
        const factionResponse = await getAllFactions();
        setFactions(factionResponse);

        if(hasFaction) {
          const factionTroopsData = await getFactionUndeployedArmies(user.address.toLowerCase(), signatureInStorage);
          setFactionTroops(factionTroopsData);
        }
        else
        {
          // console.log('player has no faction')
          const data = await getProfileArmies(user.address.toLowerCase(), signatureInStorage);
          var totalTroops = 0;
          data.data.data.forEach((element: RdArmy) => {
            totalTroops += element.troops ?? 0;
          })
          setWalletTroops(totalTroops)
        }

      } catch (error) {
        console.log(error)
      }
    }
  }

  const AddTroops = async () => {
    if (!user.address) return;

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const res = await addTroops(user.address.toLowerCase(), signatureInStorage, 8);
        // console.log(res)
        RefreshTroopsAndFactions();
      } catch (error) {
        console.log(error)
      }
    }
  }

  const { isOpen, onOpen: onOpenDelegate, onClose } = useDisclosure();
  const [delegateMode, setDelegateMode] = useState("delegate");

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleClose = ()=>{
    setModalOpen(false)
    GetFactions();
  }
  const formikProps = useFormik({
    onSubmit: () => console.log('submit'),
    // validationSchema: userInfoValidation,
    initialValues: {},
    enableReinitialize: true,
  });

  //return wheter the faction exists in the registered factions array
  const isRegistered = (factionId: number) => {
    for (let i = 0; i < registeredFactions.length; i++) {
      if (registeredFactions[i].id === factionId) {
        return true;
      }
    }
    return false;
  }

  const RegistrationAction = async (factionId: number) => {
    if (!user.address) return;

    if(isRegistered(factionId)) {
      console.log('Already Registered')
      GetFactions();
    } else {
      setIsExecuting(true);
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

  const handleTJUploadSuccess = (e: any) => {
    GetFactions();
  }
  const GetFactions = async () => {
    if (!user.address) return;

    // console.log('Getting Factions');
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {

        //needed for faction delegation
        const factionResponse = await getAllFactions();
        setFactions(factionResponse);

        // console.log('user address: ' + user.address.toLowerCase())
        // console.log('signature: ' + signatureInStorage)
        const playerFactionData = await getFactionsOwned(user.address.toLowerCase(), signatureInStorage);
        
        //if the player has a faction, get the faction data
        if(playerFactionData.data.data.length > 0)
        {
          const factionRegisteredData = await getFactionsRegistered(user.address.toLowerCase(), signatureInStorage);
          const factionTroopsData = await getFactionUndeployedArmies(user.address.toLowerCase(), signatureInStorage);

          setRegisteredFactions(factionRegisteredData.data.data);
          setFactionTroops(factionTroopsData);
          setPlayerFaction(playerFactionData.data.data);
          setHasFaction(true);
          setFactionRegistered(isRegistered(playerFactionData.data.data[0].id));
        }
        else
        {
          setHasFaction(false);
          const data = await getProfileArmies(user.address.toLowerCase(), signatureInStorage);
          // console.log(data)
          var totalTroops = 0;
          data.data.data.forEach((element: RdArmy) => {
            totalTroops += element.troops ?? 0;
          })
          setWalletTroops(totalTroops)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    // if(!!selectedFaction) {
    //   handleAddClick();
    //   onOpenFaction();
    // }
  }, [selectedFaction]);


  useLayoutEffect(() => {

    if(hasFaction) {
      setFactionDisplay(playerFaction.map((faction, index) => (
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
          <Text textColor='#ffffffeb' className={gothamBook.className} fontSize='24' textAlign='center'>{faction.name}</Text>
          

          <Flex alignContent={'center'} justifyContent={'center'}>
          <Box
            >
            <RdButton
              hideIcon={true}
              w='200px'
              fontSize={{base: 'lg', sm: 'xl'}}
              stickyIcon={true}
              onClick={() => {setSelectedFaction(faction)}}
            >
            Edit Faction
            </RdButton>
            </Box>
        </Flex>

        {isRegistered(faction.id) ? <>
        <Text textColor='#ffffffeb' fontSize={{base: 'sm', sm: 'md'}}> Faction is registered </Text>
        </>: 
          <RdButton 
            w='250px'
            fontSize={{base: 'lg', sm: 'xl'}}
            stickyIcon={true}
            onClick={() => {RegistrationAction(faction.id)}}
            isLoading={isExecuting}
            disabled={isExecuting}
            >
            Register Faction
          </RdButton>
        }

          </VStack>
        </>
        )))
        setCreateFactionButton(undefined)
    }
    else
    {
      setCreateFactionButton(
        <RdButton
          w='250px'
          fontSize={{base: 'xl', sm: '2xl'}}
          stickyIcon={true}
          onClick={() => {onOpenRegister()}}
          >
          + Create New Faction
        </RdButton>
      )
    }
  }, [playerFaction, isExecuting]);

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  useEffect(() => {
    if (!user.address) return;

    // console.log('connecting to socket...');
    const socket = io('wss://testcms.ebisusbay.biz/socket/ryoshi-dynasties/subscriptions?walletAddress='+user.address.toLowerCase());

    function onConnect() {
      setIsSocketConnected(true);
      console.log('connected')
    }

    function onDisconnect() {
      setIsSocketConnected(false);
      console.log('disconnected')
    }

    function onFactionSubscriptionEvent(data: any) {
      console.log('FACTION_SUBSCRIPTION', data)
      // JSON.parse(data).forEach((faction) => {
      //   if (faction.id === selectedFaction.id) {
      //     console.log('FACTION_SUBSCRIPTION', faction)
      // }})
      setIsExecuting(false);
      GetFactions();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('FACTION_SUBSCRIPTION', onFactionSubscriptionEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('FACTION_SUBSCRIPTION', onFactionSubscriptionEvent);
    };
  }, [!!user.address]);

  useEffect(() => {
    if (!hasFaction) return;
    RefreshTroopsAndFactions();
  }, [hasFaction]);
  
  return (
    <Flex 
        backgroundColor='#292626' 
        flexDirection='column' 
        textAlign='center' 
        borderRadius={'10px'} 
        justifyContent='space-around'
        padding='10px'
        paddingBottom='20px'
        paddingTop='5px'
        maxWidth='100%'
        // border='2px solid #FFD700'
        >
    <VStack>
      {/* <ModalOverlay /> */}
      <FactionForm isOpen={isOpenFaction} onClose={onCloseFaction} faction={0} handleClose={handleClose} isRegistered={factionRegistered}/>
      <FactionRegistrationForm isOpen={isOpenRegister} onClose={onCloseRegister} handleClose={handleClose}/>
      <DelegateForm isOpen={isOpen} onClose={onClose} delegateMode={delegateMode} factions={factions} troops={walletTroops} setTotalTroops = {setWalletTroops}/>

      <Box
        position='absolute'
        left={6}
        top={6}
        rounded='full'
        zIndex={1}
        _groupHover={{
          cursor: 'pointer'
        }}
        data-group
      >
        <Button
          bg='#C17109'
          rounded='full'
          border='8px solid #F48F0C'
          w={2}
          h={12}
          fontSize='22px'
          onClick={closeAllianceCenter}
          _groupHover={{
            bg: '#de8b08',
            borderColor: '#f9a50b',
          }}
        >
          x
        </Button>
      </Box>

      <Text textColor='#ffffffeb' fontSize={{ base: '28px', md: '32px' }} className={gothamBook.className} textAlign='center'>Alliance Center</Text>
      <Text textColor='#ffffffeb' className={gothamBook.className} textAlign='center'>Manage your Faction, Delegate your troops</Text>
      
      <Spacer h='4'/>
      
      <Flex 
        backgroundColor='#292626' 
        flexDirection='column' 
        textAlign='center' 
        borderRadius={'10px'} 
        justifyContent='space-around'
        border='2px solid #FFD700'
        >
        <div style={{ margin: '8px 24px' }}>
        {factionsDisplay}
        <Center>
          <Flex  m='20pt'>
            {createFactionButton}
          </Flex>
        </Center>
        </div>
      </Flex>
      <Spacer h='4'/>
      
      <Text textColor='#ffffffeb'>
        {hasFaction ? <>
          Faction Troops: {factionTroops}
          </> : <>
          Your Troops: {walletTroops}
          </>}
      </Text>
      
      {isLocalEnv() ? <>
        <Box
          ps='20px'
          marginTop='6'
          marginBottom='8'
          >
          <RdButton 
            w='250px'
            fontSize={{base: 'lg', sm: 'xl'}}
            onClick={AddTroops}>Add Troops
          </RdButton>
        </Box>
      </> : <></>}

      {hasFaction ? <></> : <>
        <Box
          ps='20px'
          marginTop='6'
          marginBottom='8'
          >
          <RdButton 
            w='250px'
            fontSize={{base: 'lg', sm: 'xl'}}
            onClick={() => {setDelegateMode('delegate'), onOpenDelegate();}}>Delegate Troops 
          </RdButton>
          {/* <Spacer h='4'/>
          <RdButton 
            w='250px'
            fontSize={{base: 'lg', sm: 'xl'}}
            onClick={() => {}}> View Delegations
          </RdButton> */}
        </Box>
        </>
        }
    </VStack>
    </Flex>
  )
};


export default AllianceCenterModal;