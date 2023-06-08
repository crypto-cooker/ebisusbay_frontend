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
  OrderedList, 
  Spacer, 
  HStack, 
  Text,
  VStack, 
  Center,
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
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
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
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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
        toast.success("Changes Saved");
      } catch (error) {
        console.log(error)
        toast.error(error);
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
        toast.success("Faction disbanded");
    } catch (error) {
        console.log(error)
        if(error.response !== undefined) {
          toast.error(error.response.data.error.metadata.message)
        }
        else {
          toast.error(error);
        }
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
  function showDeleteWarning() {
    setShowDeleteAlert(true)
  }
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
        <Box pb={1}>
          <Box mx={1} mb={1}  p={2} roundedBottom='lrg'>
            {user.address ? (
              <Box textAlign='center' w='full'>
                <Flex>
                  <Spacer />
                  <HStack justifyContent='space-between' w='full'>
                    <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>
                      Current Status: {isRegistered === true ? "Registered" : "Not Registered"}
                    </Text>
                    {showDeleteAlert ? (
                  <Alert status='error'>
                    <VStack>
                      <HStack>
                        <AlertIcon />
                        <AlertTitle>Warning! If you disband a registered faction you will be unable to register another faction this season.</AlertTitle>
                      </HStack>
                      <HStack>
                      <Button type="submit" style={{ display: 'flex', marginTop: '4px' }}
                        onClick={DeleteFaction} variant='outline'colorScheme='red'
                        >Confirm Disband</Button>
                      <Button type="submit" style={{ display: 'flex', marginTop: '4px' }}
                          onClick={() => setShowDeleteAlert(false)} variant='outline' colorScheme='white'
                        >Cancel</Button>
                      </HStack>
                    </VStack>
                  </Alert>
                ) : (
                  <Button type="submit"
                    onClick={showDeleteWarning}  
                    colorScheme='red'
                    fontSize={{base: '12', sm: '14'}}
                    variant={"outline"}
                    >x Disband Faction</Button>
                )}
                  </HStack>
                  <Spacer />
                </Flex>
              </Box>
            ) : (
              <Box fontSize='sm' textAlign='center' w='full'>Connect wallet to purchase</Box>
            )}
            
          </Box>
          
          <Box mx={1} bg='#272523' p={2} roundedBottom='xl'>
            <Box margin='auto' mb='4'>

            <form onSubmit={formik.handleSubmit} style={{ marginTop: '24px'}}>
              <FormControl isRequired>
                <Flex direction='row' justify='space-between' mb={2}>
                <FormLabel w='40%'>Faction name:</FormLabel>
                <Input
                  id='factionName'
                  name='factionName'
                  value={formik.values.factionName}
                  onChange={formik.handleChange}
                  placeholder={formik.values.factionName}
                />
                </Flex>
              </FormControl>
            </form>
            </Box>

            <Divider />

            <Flex direction='row' justify='space-between' mt={2} mb={2}>
              <Box w='40%' margin='auto'>
                <Text > 
                  Faction Type:
                </Text>
              </Box>
              <Box w='60%'>
                <VStack>
                <HStack alignContent='right'>
                <RdTabButton 
                  onClick={() => setFactionType("COLLECTION")}
                  isActive={factionType === "COLLECTION"}
                  fontSize={{base: '12', sm: '14'}}
                >Collection</RdTabButton>
                <RdTabButton 
                  onClick={() => setFactionType("WALLET")}
                  isActive={factionType === "WALLET"}
                  fontSize={{base: '12', sm: '14'}}
                >Wallet</RdTabButton>
                </HStack>

                <Text as='i' color='#aaa' fontSize={{base: '12', sm: '14'}}>
                  {factionType === "COLLECTION" ? ("Add up to 3 collection addresses") 
                  : ("Add up to 15  individual wallet addresses")}
                </Text>
                </VStack>
              </Box>
            </Flex>
          
              

              <Divider />

              <Flex direction='row' justify='space-between' mb={2}>
                <FormLabel style={{ display: 'flex', marginTop: '24px' }}>Addresses of 
                {factionType === "COLLECTION" ? (
                    " Collections"
                  ) : (
                    " Wallets"
                  )}
                </FormLabel>
                <Stack direction={{base: 'column', sm: 'row'}} mt={4}>
                  <Button 
                    onClick={AddAddress}
                    fontSize={{base: '12', sm: '14'}}
                    > + Add Address
                  </Button>
                  <Button 
                    onClick={RemoveAddress}
                    fontSize={{base: '12', sm: '14'}}
                    > - Remove Address
                  </Button>
                </Stack>
              </Flex>
              <Input
                ref={addressInput}
                value={addressToAdd}
                onChange={handleAddChange}
                placeholder=''
                size='sm'
              />
              <OrderedList>
                {addressDisplay}
              </OrderedList>

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

              <Flex justifyContent={"center"} align={"center"}>
                <Box p='3'>
                  <RdButton 
                    onClick={SaveChanges} 
                   >Save Changes</RdButton>
                </Box>
              </Flex>
              <Flex justifyContent={"right"} align={"right"}>
                

                
              </Flex>
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