import { useState, useRef, useEffect } from "react";
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

} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";
import { useFormik } from 'formik';
import { editFaction, deleteFaction, subscribeFaction} from "@src/core/api/RyoshiDynastiesAPICalls";

import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

const FactionForm = ({ isOpen, onClose, faction, handleClose}) => {

  const addressInput = useRef(null);
  const [addresses, setAddresses] = useState([])
  const handleAddChange = (event) => setValue(event.target.value)
  const [addressToAdd, setValue] = useState('')
  const factionNameInput = useRef(null);
  const [factionType, setFactionType] = useState(0)
  const [addressDisplay, setAddressDisplay] = useState([])

  //alerts
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [registrationStatus, setRegistrationStatus] = useState("Unregistered")

  //other
  const [isLoading, getSigner] = useCreateSigner();
  const user = useSelector((state) => state.user);

  const SaveChanges = async() => {
    if(factionNameInput.current === undefined) {
      setAlertMessage("You must enter a faction name")
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
          faction.id, formik.values.factionName, addresses, formik.values.factionType);
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
        console.log(data);
        //add payment code here
        handleClose();
        onClose();
      } catch (error) {
        console.log(error)
      }
    }
 }
  const RegisterFaction = async() => {
    // registrationStatus = 
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        console.log("faction id: "+faction.id)
        const data = await subscribeFaction(user.address.toLowerCase(), signatureInStorage, faction.id);
        //add payment code here

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
  function collectionFaction() {
    formik.values.factionType = 'COLLECTION'
  }
  function userFaction() {
    formik.values.factionType = 'WALLET'
  }
  function getMaxAddresses() {
    return factionType === 'COLLECTION' ? 3 : 15
  }
  const formik = useFormik({
    initialValues: {
      factionName: faction.name,
      factionType: faction.type,
      addresses: faction.addresses
    },
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2))
    },
    enableReinitialize: true,
  })
  useEffect(() => {
    // console.log("faction change faction change"+faction.name)
    if(faction.type === 'COLLECTION') {
      setFactionType(0)
    } else {
      setFactionType(1)
    }
    setAddresses(faction.addresses)
  }, [faction]);

  useEffect(() => {
    // display all addresses
    // console.log("addresses: "+faction.addresses)
    console.log("addresses: " + addresses)
    if(addresses !== undefined) {
    setAddressDisplay(addresses.map((address, index) => {
      return (
          <ListItem>{address}</ListItem>
      )
    }))
  }
  }, [addresses]);


  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
          <ModalHeader className="text-center">Edit Faction</ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
            <Flex>
            <FormLabel>Current Status: {registrationStatus}</FormLabel>
                {/* <Button type="submit" style={{ display: 'flex' }} 
                      onClick={RegisterFaction} variant='outline' size='lg'>Register Faction</Button> */}
              </Flex>
            <Divider />
            <form onSubmit={formik.handleSubmit} style={{ marginTop: '24px'}}>
              <FormControl isRequired>
                <FormLabel>Faction name:</FormLabel>
                <Input
                  id='factionName'
                  name='factionName'
                  value={formik.values.factionName}
                  onChange={formik.handleChange}
                  placeholder={formik.values.factionName}
                  size='sm'/>
              </FormControl>
              <Tabs variant='unstyled' style={{ marginTop: '24px'}} defaultIndex = {factionType}>
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
                      >SaveChanges</Button>
                </Box>
              </Flex>
              <Flex justifyContent={"right"} align={"right"}>
                <Button type="submit" style={{ display: 'flex', marginTop: '4px' }} 
                      onClick={DeleteFaction} variant='outline'size='xs' colorScheme='red' 
                      >Delete Faction</Button>
              </Flex>
              </form>
            </ModalBody>
            {/* <ModalFooter className="border-0"/>             */}
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