import React, {ChangeEvent, ReactElement, useContext, useEffect, useRef, useState} from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  ListItem,
  OrderedList,
  Spacer,
  Spinner,
  Stack,
  Text,
  useMediaQuery,
  VStack
} from "@chakra-ui/react"
import {useFormik} from 'formik';
import {disbandFaction, editFaction} from "@src/core/api/RyoshiDynastiesAPICalls";
import {shortAddress} from "@src/utils";

//contracts
import {toast} from "react-toastify";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useAppSelector} from "@src/Store/hooks";

import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import AvatarEditor from 'react-avatar-editor'
import Cropper from '@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/inline/Cropper';
import Search from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/search";
import {parseErrorMessage} from "@src/helpers/validator";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";

interface EditFactionProps {
  isOpen: boolean;
  onClose: () => void;
  faction: any;
  handleClose: () => void;
  isRegistered: boolean;
}

const EditFaction = ({ isOpen, onClose, faction, handleClose, isRegistered}: EditFactionProps) => {

  const {requestSignature} = useEnforceSignature();
  const addressInput = useRef<HTMLInputElement>(null);
  const [addresses, setAddresses] = useState<string[]>([])
  const handleAddChange = (event: ChangeEvent<HTMLInputElement>) =>  {
    // console.log(event.target.value)
    setAddressesToAdd(event.target.value)
  }
  const [addressToAdd, setAddressesToAdd] = useState('')
  const factionNameInput = useRef(null);
  const [factionType, setFactionType] = useState("")
  const [addressDisplay, setAddressDisplay] = useState<ReactElement[]>([])

  //alerts
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  //other
  const user = useUser();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 768px)") 
  //pfp editor
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const[editFactionIcon, setEditFactionIcon] = useState(false);
  const editorRef = useRef(null)

  const HandleSelectCollectionCallback = (collectionAddress: string) => {
    console.log(collectionAddress);
    setAddressesToAdd(collectionAddress);
  }

  const canEditFaction = () => {
    if(!rdContext.game) return false;
    const startDate = new Date(rdContext.game.game.startAt);
    const timeSinceStart = Date.now() - startDate.getTime();
    const daysSinceStart = timeSinceStart / (1000 * 3600 * 24);

    if(daysSinceStart <= rdContext.config.factions.editableDays) {
      return true;
    }
    return false;
  }

  const SaveChanges = async() => {
    if(!canEditFaction()) {
      setAlertMessage("You cannot edit your faction at this point in the game, changes can be made at the start of the next game")
      setShowAlert(true)
      return;
    }
    if(factionNameInput.current === undefined) {
      setAlertMessage("You must enter a faction name")
      setShowAlert(true)
      return;
    }
    if(formik.values.factionName === "") {
      setAlertMessage("You must enter a faction name")
      setShowAlert(true)
      return;
    }
    if(addresses.length > getMaxAddresses()) {
      setAlertMessage("You are over the maximum number of addresses for this faction type")
      setShowAlert(true)
      return;
    }
    setShowAlert(false)

    try {
      const signature = await requestSignature();
      await editFaction(user.address!.toLowerCase(), signature,
        faction.id, formik.values.factionName, addresses, factionType);
      // console.log(data);
      //add payment code here
      handleClose();
      onClose();
      toast.success("Changes Saved");
    } catch (error:any) {
      console.log(error)
      toast.error(parseErrorMessage(error));
    }
  }

  const DisbandFaction = async() => {
    try {
      const signature = await requestSignature();
      await disbandFaction(user.address!.toLowerCase(), signature, "DEACTIVATE");
      handleClose();
      onClose();
      setShowDeleteAlert(false)
      rdContext.refreshUser();
      toast.success("Faction disbanded");

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  }
  const ReenableFaction = async() => {
    try {
      const signature = await requestSignature();
      await disbandFaction(user.address!.toLowerCase(), signature, "ACTIVE");
      handleClose();
      onClose();
      rdContext.refreshUser();
      toast.success("Faction reenabled");
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
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
    setAddresses(addresses => [...addresses, addressToAdd]);
    if (addressInput.current) {
      addressInput.current.value = ''
    }
    setAddressesToAdd('')
  }
  function RemoveAddress(addressToRemove: string) {
    setShowAlert(false)
    //check faction for troops deployed
    // if(rdContext.user?.season.troops.deployed){
    //   if(rdContext.user?.season.troops.deployed > 0) {
    //     setAlertMessage("You cannot remove an address while troops are deployed")
    //     setShowAlert(true)
    //     return
    //   }
    // }
    if(addresses.includes(addressToRemove)) {
      setAddresses(addresses.filter(address => address !== addressToRemove)) 
    } else {
      setAlertMessage("The address you are trying to remove does not exist")
      setShowAlert(true)
      return
    }
    // if (addressInput.current) {
    //   addressInput.current.value = ''
    // }
    setAddressesToAdd('')
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
    if(!canEditFaction()) {
      setAlertMessage("You cannot edit your faction at this point in the game, changes can be made at the start of the next game")
      setShowAlert(true)
      return;
    }
    setShowDeleteAlert(true)
  }

  useEffect(() => {
    // console.log("faction change faction change"+faction.name)
    setAddresses(faction.addresses)
    setFactionType(faction.type)
  }, [faction]);


  useEffect(() => {
    if(addresses !== undefined) {
    setAddressDisplay(addresses.map((address, index) => {
      return (
        <ListItem key={index} marginTop={'2'} color='#aaa'>
          <Flex justifyContent={"space-between"} margin={'auto'} border={'1px'} rounded={'md'}>
            <Text 
            color={'#ffffffeb'}
            fontSize={{base: '12', sm: '14'}}
            marginTop={'auto'}
            marginBottom={'auto'}
            marginLeft={'2'}
            >{ isMobile ? shortAddress(address) : address}</Text>
          <Button 
          h='30px'
          w='30px'
          padding={0}
          onClick={() => RemoveAddress(address)}
          fontSize={{base: '12', sm: '14'}}
          >x
        </Button>
        </Flex>
        </ListItem>
      )
    }))
  }
  }, [addresses]);

  return (
    <>
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Edit Faction'
    >
      {true ? (
        <Box pb={1}>
          <Box mx={1} mb={1} roundedBottom='lrg'>
            {user.address ? (
              <Box textAlign='center' w='full'>
                <Flex>
                  <Spacer />
                  <VStack
                    spacing={2}
                    align='center'
                    justify='center'
                    w='full'
                    h='full'
                    p={2}
                    bg='#272523'
                    >
                    <Cropper editsAllowed={canEditFaction()}/>
                    {editFactionIcon && ( <>
                        <AvatarEditor
                        ref={editorRef}
                        image={rdContext.user?.faction.image!}
                        width={200}
                        height={200}
                        border={50}
                        color={[255, 255, 255, 0.6]} // RGBA
                        scale={1.2}
                        rotate={0}
                      /> </>) 
                    }

                    <Flex w='95%' direction='row' justify='space-between' mt={2} mb={2}>
                      <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>
                        Current Status: 
                      </Text>
                      <Text as='i' color='#aaa' fontSize={{base: '12', sm: '14'}}>
                        {isRegistered === true ? "Registered" : "Not Registered"}
                      </Text>
                    </Flex>

                    <Flex w='95%' direction='row' justify='space-between' mt={2} mb={2}>
                      <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}> 
                        Faction Type:
                      </Text>
                      <Text as='i' color='#aaa' fontSize={{base: '12', sm: '14'}}>
                        {factionType}
                      </Text>
                    </Flex>

                    {showDeleteAlert ? (
                    <Alert status='error'>
                      <VStack>
                        <HStack>
                          <AlertIcon />
                          <AlertTitle>Warning! If you disband a registered faction you will be unable to register another faction this season.</AlertTitle>
                        </HStack>
                        <HStack>
                        <Button type="submit" style={{ display: 'flex', marginTop: '4px' }}
                          onClick={DisbandFaction} variant='outline'colorScheme='red'
                          >Confirm Disband</Button>
                        <Button type="submit" style={{ display: 'flex', marginTop: '4px' }}
                            onClick={() => setShowDeleteAlert(false)} variant='outline' colorScheme='white'
                          >Cancel</Button>
                        </HStack>
                      </VStack>
                    </Alert>
                    ) : (
                      <>
                      {rdContext.user?.faction.isEnabled ? (
                      <Button type="submit"
                        onClick={showDeleteWarning}  
                        colorScheme='red'
                        fontSize={{base: '12', sm: '14'}}
                        variant={"outline"}
                        >x Disband Faction</Button>

                    ) : (
                        <Button type="submit"
                        onClick={ReenableFaction}  
                        colorScheme='green'
                        fontSize={{base: '12', sm: '14'}}
                        variant={"outline"}
                        >Reenable Faction</Button>
                    )}
                    </>
                      
                    )}
                    </VStack>
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


              <Flex direction='row' justify='space-between' mb={2}>
                <FormLabel style={{ display: 'flex', marginTop: '24px' }}>Addresses of 
                {factionType === "COLLECTION" ? (
                    " Collections"
                  ) : (
                    " Wallets"
                  )}
                </FormLabel>
              </Flex>

              <Stack direction={{base: 'column', sm: 'row'}} mt={'auto'} marginBottom={'auto'}>
                <Input
                  ref={addressInput}
                  value={addressToAdd}
                  onChange={handleAddChange}
                  placeholder='Add address here'
                  size='sm'
                  />
                <Button 
                  onClick={AddAddress}
                  fontSize={{base: '12', sm: '14'}}
                  >Add +
                </Button>
              </Stack>
             
              {factionType === "COLLECTION" ? (
                  <Search handleSelectCollectionCallback={HandleSelectCollectionCallback}/>
                ) : ( <></> )}
              
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
              {canEditFaction()&& (
                <Flex justifyContent={"center"} align={"center"}>
                  <Box p='3'>
                    <RdButton 
                      onClick={SaveChanges} 
                    >Save Changes</RdButton>
                  </Box>
                </Flex>
                )}
          </Box>
        </Box>
      ) : (
        <Spinner size='sm' ms={1} />
      )}
    </RdModal>
    </>
  )
}

export default EditFaction;