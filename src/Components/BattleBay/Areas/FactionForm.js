import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Input,
  Button,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Flex,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  Stack,
  Divider,
  ListItem,
  OrderedList, Spacer, HStack, Text, Image, SimpleGrid,

} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";
import { useFormik } from 'formik';
import { editFaction, deleteFaction, subscribeFaction} from "@src/core/api/RyoshiDynastiesAPICalls";

import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

//contracts
import {Contract} from "ethers";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import AllianceCenterContract from "@src/Contracts/AllianceCenterContract.json";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {commify} from "ethers/lib/utils";

const FactionForm = ({ isOpen, onClose, faction, handleClose, isRegistered}) => {

  const addressInput = useRef(null);
  const [addresses, setAddresses] = useState([])
  const handleAddChange = (event) => setValue(event.target.value)
  const [addressToAdd, setValue] = useState('')
  const factionNameInput = useRef(null);
  const [factionType, setFactionType] = useState("")
  const [factionIndex, setFactionIndex] = useState(0)
  const [addressDisplay, setAddressDisplay] = useState([])

  //alerts
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  //other
  const [isLoading, getSigner] = useCreateSigner();
  const user = useSelector((state) => state.user);

  //registration
  const GetRegistrationColor = (registered) => {if(registered) {return 'green'} else {return 'red'}}
  const GetRegisterButtonText = (registered) => {if(registered) {return 'Registered'} else {return 'Register'}}

  const RegistrationAction = async (factionId) => {
    if(isRegistered) {
      console.log('Already Registered')
    } else {
      let signatureInStorage = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        try {
          //0x0000000000000000000000000000000000000001
          const registerFactionContract = new Contract(config.contracts.allianceCenter, AllianceCenterContract, user.provider.getSigner());
          const tx = await registerFactionContract.registerFaction(user.address.toLowerCase())
          const receipt = await tx.wait();
          isRegistered = true;
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

          // console.log('Registered')
        } catch (error) {
          console.log(error)
          toast.error("ERROR: This account has already registered a faction this season.");
        }
      } 
    }
  }
  const registerButton = () => {
    <Button colorScheme={GetRegistrationColor(isRegistered)}
    onClick={() => {RegistrationAction(faction.id)}}>{GetRegisterButtonText(isRegistered)}
  </Button>
  }

  const SaveChanges = async() => {
    if(factionNameInput.current === undefined) {
      setAlertMessage("You must enter a faction name")
      setShowAlert(true)
      return;
    }
    // console.log(factionType)
    if(addresses.length > getMaxAddresses()) {
      setAlertMessage("You are over the maximum number of addresses for this faction type")
      setShowAlert(true)
      return;
    }

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await editFaction(user.address.toLowerCase(), signatureInStorage,
          faction.id, formik.values.factionName, addresses, factionType);
        // console.log(data);
        //add payment code here
        handleClose();
        onClose();

      } catch (error) {
        console.log(error)
      }
    }
  }
  const DeleteFaction = async() => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await deleteFaction(user.address.toLowerCase(), signatureInStorage, faction.id);
        // console.log(data);
        //add payment code here
        handleClose();
        onClose();
      } catch (error) {
        console.log(error)
      }
    }
 }

  function AddAddress() {
    setShowAlert(false)

    if(addressToAdd === '') {
      setAlertMessage("You must enter an address")
      setShowAlert(true)
      return;
    }

    if(addresses.includes(addressToAdd)) {
      setAlertMessage("You already have this address in your faction")
      setShowAlert(true)
      return;
    }
    if(addresses.length >= getMaxAddresses()) {
      setAlertMessage("You are over the maximum number of addresses for this faction type")
      setShowAlert(true)
      return;
    }
    setAddresses(addresses => [...addresses, addressToAdd])
    addressInput.current.value = ''
    setValue('')
  }
  function RemoveAddress() {
    setShowAlert(false)
    if(addresses.includes(addressToAdd)) {
      setAddresses(addresses.filter(address => address !== addressToAdd)) 
    } else {
      setAlertMessage("The address you are trying to remove does not exist")
      setShowAlert(true)
      return
    }
    addressInput.current.value = ''
    setValue('')
  }
  function getMaxAddresses() {
    return factionType === 'COLLECTION' ? 3 : 15
  }
  const formik = useFormik({
    initialValues: {
      factionName: faction.name,
      // factionType: faction.type,
      addresses: faction.addresses
    },
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2))
    },
    enableReinitialize: true,
  })
  useEffect(() => {
    // console.log("faction change faction change"+faction.name)
    setAddresses(faction.addresses)
    setFactionType(faction.type)
  }, [faction]);

  useEffect(() => {
    factionType === 'COLLECTION' ? setFactionIndex(0) : setFactionIndex(1)
  }, [factionType]);

  useEffect(() => {
    if(addresses !== undefined) {
    setAddressDisplay(addresses.map((address, index) => {
      return (
          <ListItem>{address}</ListItem>
      )
    }))
  }
  }, [addresses]);


  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Edit Faction'
    >
      {!isLoading ? (
        <Box pb={6}>
          <Box mx={1} mb={4} bg='#272523' p={2} roundedBottom='md'>
            {user.address ? (
              <Box textAlign='center' w='full'>
                <Flex>
                  <Spacer />
                  <HStack>
                    <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>
                      Current Status: {isRegistered === true ? "Registered" : "Not Registered"}
                    </Text>
                  </HStack>
                  <Spacer />
                </Flex>
              </Box>
            ) : (
              <Box fontSize='sm' textAlign='center' w='full'>Connect wallet to purchase</Box>
            )}
          </Box>
          <Box mx={8}>
            {/*<Flex>*/}
            {/*  {isRegistered === false ? registerButton : null}*/}
            {/*</Flex>*/}
            {/*<Divider />*/}
            <form onSubmit={formik.handleSubmit} style={{ marginTop: '24px'}}>
              <FormControl isRequired>
                <FormLabel>Faction name:</FormLabel>
                <Input
                  id='factionName'
                  name='factionName'
                  value={formik.values.factionName}
                  onChange={formik.handleChange}
                  placeholder={formik.values.factionName}
                />
              </FormControl>
              <Tabs variant='unstyled' style={{ marginTop: '24px'}} defaultIndex = {factionIndex}>
                <TabList>
                  <Tab onClick={() => setFactionType("COLLECTION")} _selected={{ color: 'white', bg: 'blue.500' }}>Collection Faction</Tab>
                  <Tab onClick={() => setFactionType("WALLET")} _selected={{ color: 'white', bg: 'blue.500' }}>Wallet Faction</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <p>Maximum of 3 collection addresses</p>
                  </TabPanel>
                  <TabPanel>
                    <p>Maximum of 15 wallet addresses</p>
                  </TabPanel>
                  <OrderedList>
                    {addressDisplay}
                  </OrderedList>
                </TabPanels>
              </Tabs>
              <Divider />

              <FormLabel style={{ display: 'flex', marginTop: '24px' }}>Addresses of Wallets or Contracts:</FormLabel>

              <Input
                ref={addressInput}
                value={addressToAdd}
                onChange={handleAddChange}
                placeholder=''
                size='sm'
              />

              <Stack direction='row' spacing={4} style={{ display: 'flex', marginTop: '16px' }}>
                <Button colorScheme='blue'variant='outline' onClick={AddAddress} className="flex-fill"> Add address </Button>
                <Button colorScheme='red' variant='outline'onClick={RemoveAddress} className="flex-fill"> Remove address </Button>
              </Stack>


              <ul id="addresseslist"></ul>
              <Flex justify={"center"} align={"center"} style={{ marginTop: '16px' }}>
                <Box p='3'>
                  {showAlert && (
                    <Alert status='error'>
                      <AlertIcon />
                      <AlertTitle>{alertMessage}</AlertTitle>
                    </Alert>
                  )}
                </Box>
              </Flex>
              <Divider />

              <Flex justifyContent={"center"} align={"center"}>

                <Box p='3'>
                  <Button type="submit" style={{ display: 'flex', marginTop: '12px' }}
                          onClick={SaveChanges} variant='outline' size='lg'
                  >Save Changes</Button>
                </Box>
              </Flex>
              {/* <Flex justifyContent={"right"} align={"right"}>
                <Button type="submit" style={{ display: 'flex', marginTop: '4px' }}
                        onClick={DeleteFaction} variant='outline'size='xs' colorScheme='red'
                >Delete Faction</Button>
              </Flex> */}
            </form>
          </Box>
        </Box>
      ) : (
        <Spinner animation="border" role="status" size="sm" className="ms-1">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </RdModal>
    
  )
}

export default FactionForm;