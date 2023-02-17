import { useState, useRef, useEffect } from "react";
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
import { add } from "lodash";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";

const ClanForm = ({ isOpen, onClose, clans=[], clanToModify}) => {
  // console.log("clanToModify: "+clanToModify.faction)
  //addresses
  const addressInput = useRef(null);
  const [addresses, setAddresses] = useState([])
  const handleAddChange = (event) => setValue(event.target.value)
  const [addressToAdd, setValue] = useState('')

  //clan name
  const clanNameInput = useRef(null);
  const arrayColumn = (arr, n) => arr.map(x => x[n]);
  const clanToModifyIndex = clans.findIndex(clan => clan === clanToModify)
  const clanNames = arrayColumn(clans, 'faction').filter(clan => clan !== clans[clanToModifyIndex].faction)
  const [clanName, setClanName] = useState(clans[clanToModifyIndex].faction)

  
  const handleClanNameChange = (event) => setClanName(event.target.value)
  const [clanType, setClanType] = useState(clans[clanToModifyIndex].clanType)

  //alerts
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  //other
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const SaveChanges = () => {

    if(clanNameInput.current === undefined) {
      setAlertMessage("You must enter a clan name")
      setShowAlert(true)
      return;
    }
    if(clanNames.includes(clanName)) {
      setAlertMessage("Your Clan Name is already taken")
      setShowAlert(true)
      return;
    }
    console.log(addresses)
    if(addresses.current.length > getMaxAddresses()) {
      setAlertMessage("You are over the maximum number of addresses for this clan type")
      setShowAlert(true)
      return;
    }
    
    //add payment code here
    console.log("You created a clan with the name "+clanNameInput);
    clanType === 'collectionClan' ? console.log("You created a collection clan") : console.log("You created a user clan")
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
      setAlertMessage("You already have this address in your clan")
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
  function collectionClan() {
    setClanType('collection')
  }
  function userClan() {
    setClanType('userClan')
  }
  function getMaxAddresses() {
    return clanType === 'collection' ? 3 : 15
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
          <ModalHeader className="text-center">Edit Clan</ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Clan name:</FormLabel>
                <Input
                  ref={clanNameInput}
                  value={clanName}
                  onChange={handleClanNameChange}
                  placeholder=''
                  size='sm'/>
              </FormControl>

              <Tabs variant='unstyled' style={{ marginTop: '24px'}}>
                <TabList>
                  <Tab onClick={collectionClan} _selected={{ color: 'white', bg: 'blue.500' }}>Collection Clan</Tab>
                  <Tab onClick={userClan} _selected={{ color: 'white', bg: 'blue.500' }}>User Clan</Tab>
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
              <Button style={{ display: 'flex', marginTop: '16px' }} 
                onClick={SaveChanges} variant='outline'size='lg'>SaveChanges</Button>
                </Box>
              </Flex>
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

export default ClanForm;