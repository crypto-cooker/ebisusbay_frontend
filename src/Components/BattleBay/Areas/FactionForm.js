import { useState, useRef, useEffect, useCallback  } from "react";
import { useSelector } from "react-redux";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
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
  Spacer,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  Stack,

} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import useGetSettings from '../../Account/Settings/hooks/useGetSettings';

const FactionForm = ({ isOpen, onClose, factions=[], factionToModify}) => {
  // console.log("factionToModify: "+factionToModify.faction)
  //addresses
  const addressInput = useRef(null);
  const [addresses, setAddresses] = useState([])
  const handleAddChange = (event) => setValue(event.target.value)
  const [addressToAdd, setValue] = useState('')

  //faction name
  const factionNameInput = useRef(null);
  const arrayColumn = (arr, n) => arr.map(x => x[n]);
  const factionToModifyIndex = factions.findIndex(faction => faction === factionToModify)
  const factionNames = arrayColumn(factions, 'faction').filter(faction => faction !== factions[factionToModifyIndex].faction)
  const [factionName, setFactionName] = useState(factions[factionToModifyIndex].faction)

  
  const handleFactionNameChange = (event) => setFactionName(event.target.value)
  const [factionType, setFactionType] = useState(factions[factionToModifyIndex].factionType)

  //alerts
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  //other
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const SaveChanges = () => {

    if(factionNameInput.current === undefined) {
      setAlertMessage("You must enter a faction name")
      setShowAlert(true)
      return;
    }
    if(factionNames.includes(factionName)) {
      setAlertMessage("Your Faction Name is already taken")
      setShowAlert(true)
      return;
    }
    // if(addresses.current.length > getMaxAddresses()) {
    //   setAlertMessage("You are over the maximum number of addresses for this faction type")
    //   setShowAlert(true)
    //   return;
    // }
    
    //add payment code here
    console.log("You created a faction with the name "+factionNameInput);
    factionType === 'collectionFaction' ? console.log("You created a collection faction") : console.log("You created a user faction")
    onClose();
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
  function collectionFaction() {
    setFactionType('collection')
  }
  function userFaction() {
    setFactionType('userFaction')
  }
  function getMaxAddresses() {
    return factionType === 'collection' ? 3 : 15
  }

  const formik = useFormik({
    initialValues: {
      factionName: factions[factionToModifyIndex].faction,
      addresses: factions[factionToModifyIndex].addresses,
    },
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2))
      factions[factionToModifyIndex].faction = values.factionName
    },
  })

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
          <ModalHeader className="text-center">Edit Faction</ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Faction name:</FormLabel>
                <Input
                  id='factionName'
                  name='factionName'
                  // ref={factionNameInput}
                  value={formik.values.factionName}
                  onChange={formik.handleChange}
                  placeholder=''
                  size='sm'/>
              </FormControl>
              <Tabs variant='unstyled' style={{ marginTop: '24px'}}>
                <TabList>
                  <Tab onClick={collectionFaction} _selected={{ color: 'white', bg: 'blue.500' }}>Collection Faction</Tab>
                  <Tab onClick={userFaction} _selected={{ color: 'white', bg: 'blue.500' }}>User Faction</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <p>Maximum of 3 collection addresses</p>
                  </TabPanel>
                  <TabPanel>
                    <p>Maximum of 15 wallet addresses</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
                    
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
              <Flex justifyContent={"center"} align={"center"}>
                
                <Box p='3'>
                <Button type="submit" style={{ display: 'flex', marginTop: '16px' }} 
                      onClick={SaveChanges} variant='outline'size='lg'
                      >SaveChanges</Button>
                </Box>
              </Flex>
              </form>
            </ModalBody>
            <ModalFooter className="border-0"/>            
          </>
        ) : (
          <Spinner animation="border" role="status" size="sm" className="ms-1">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </ModalContent>
    </Modal>
    
  )
}

export default FactionForm;