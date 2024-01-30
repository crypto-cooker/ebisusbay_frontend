import React, {ChangeEvent, ReactElement, useContext, useEffect, useRef, useState} from "react";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Center,
    Checkbox,
    Divider,
    Flex,
    FormLabel,
    HStack,
    Icon,
    Input,
    ListItem,
    OrderedList,
    SimpleGrid,
    Spacer,
    Stack,
    Text,
    useDisclosure,
    useMediaQuery,
    VStack,
} from "@chakra-ui/react"
import {createFaction} from "@src/core/api/RyoshiDynastiesAPICalls";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {toast} from "react-toastify";
import {RdModalAlert, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {
    RyoshiDynastiesContext,
    RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle, faShieldAlt} from "@fortawesome/free-solid-svg-icons";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {parseErrorMessage} from "@src/helpers/validator";
import Search from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/search";
import {shortAddress} from "@src/utils";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";

interface FactionRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  handleClose: () => void;
}

const tabs = {
  page1: 'page1',
  page2: 'page2',
  page3: 'page3'
};

const CreateFactionForm = ({ isOpen, onClose, handleClose}: FactionRegistrationFormProps) => {
 
  // const [isLoading, setIsLoading] = useState(false);
  const [factionType, setFactionType] = useState("COLLECTION")
  const user = useUser();
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { isOpen: isConfirmationOpen, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure();
  const [currentTab, setCurrentTab] = useState(tabs.page1);
  const addressInput = useRef<HTMLInputElement>(null);
  const [addressToAdd, setAddressesToAdd] = useState('')
  const {requestSignature} = useEnforceSignature();

  //alerts
  // const [showAlert2, setShowAlert2] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const [addresses, setAddresses] = useState<string[]>([])
  const [addressDisplay, setAddressDisplay] = useState<ReactElement[]>([])

  const HandleSelectCollectionCallback = (collectionAddress: string) => {
    console.log(collectionAddress);
    setAddressesToAdd(collectionAddress);
  }
  
  const adjectives = [
      "Radiant",
      "Mystic",
      "Valiant",
      "Shadowed",
      "Eternal",
      "Enigmatic",
      "Whispering",
      "Arcane",
      "Celestial",
      "Luminous",
      "Aetherial",
      "Sylvan",
      "Noble",
      "Dread",
      "Crimson",
      "Forgotten",
      "Twilight",
      "Ethereal",
      "Sorcerer's",
      "Wandering",
      "Silver",
      "Ancient",
      "Vibrant",
      "Whirling",
      "Frostborn",
      "Moonlit",
      "Thundering",
      "Starforged",
      "Clockwork",
      "Mechanical",
      "Ingenious",
      "Steam-powered",
      "Gilded",
      "Alchemical",
      "Tesla",
      "Resilient",
      "Enchanted",
      "Swift",
      "Pristine",
      "Lunar",
      "Harmonic",
      "Emerald",
      "Sapphire",
      "Fiery",
      "Golden",
      "Dusk",
      "Sage",
      "Enigmatic",
      "Celestial",
      "Whispering",
      "Enchanted",
      "Pulsating",
      "Ethereal",
      "Mystical",
      "Epic",
      "Fabled",
      "Supreme",
      "Divine",
      "Shadowy",
      "Ethereal",
      "Twilight",
      "Whirling",
      "Legendary",
      "Everlasting",
      "Arcane",
      "Majestic",
      "Celestial",
      "Sacred",
      "Mystic",
      "Timeless",
      "Resplendent",
      "Spectral",
      "Evolving",
      "Mythical",
      "Luminous",
      "Eternal",
      "Cerulean",
      "Ornate",
      "Venerable",
      "Immaculate",
      "Astral",
      "Serene",
      "Verdant",
      "Mossy",
      "Blossoming",
      "Whispering",
      "Enchanted",
      "Ethereal",
      "Emerald",
      "Sapphire",
      "Golden",
      "Lunar",
      "Harmonic",
      "Sylvan",
      "Mystical",
      "Serenity",
      "Enlightened",
      "Mythical",
      "Celestial",
      "Primal",
      "Nurturing",
      "Exquisite",
      "Timeless",
      "Vivid",
      "Fragrant",
      "Enigmatic",
      "Vibrant",
      "Stellar",
      "Stormy",
      "Aurora",
      "Lush",
      "Noble",
      "Rustic",
      "Silent",
      "Majestic",
      "Seraphic",
      "Ingenious",
      "Cerulean",
      "Exalted",
      "Sapphire",
      "Luminary",
      "Burning",
      "Harmonic",
      "Silver",
      "Effervescent",
      "Frosty",
      "Moonlit",
      "Thunderous",
      "Resilient",
      "Wandering",
      "Resplendent",
      "Dusk",
      "Astral",
      "Sage",
      "Illustrious",
      "Enchanting",
      "Resonant",
      "Crimson",
      "Celestial",
      "Mystified",
      "Arcane",
      "Nebulous",
      "Ebon",
      "Epic",
      "Ravishing",
      "Ethereal",
      "Supreme",
      "Vibrating",
      "Gossamer",
      "Resplendent",
      "Pristine",
      "Sorcerous",
      "Emerald",
      "Sapphire",
      "Stellar",
      "Flickering",
      "Ornate",
      "Divine",
      "Verdant",
      "Blossoming",
      "Mythical",
      "Astral",
      "Whispering",
      "Enchanted",
      "Sylvan",
      "Ethereal",
      "Cerulean",
      "Lunar",
      "Sage",
      "Majestic",
      "Resilient",
      "Epic",
      "Crimson",
      "Golden",
      "Silver",
      "Twilight",
      "Enigmatic",
      "Ingenious",
      "Steam-powered",
      "Mechanical",
      "Luminous",
      "Arcane",
      "Celestial",
      "Shadowed",
      "Mystical",
      "Eternal",
      "Radiant",
      "Noble",
      "Whirling",
      "Frostborn",
      "Moonlit",
      "Thundering",
      "Starforged",
      "Resplendent",
      "Sorcerer's",
      "Wandering",
      "Dread",
      "Sylvan",
      "Aetherial",
      "Ebon",
      "Vibrant",
      "Dusk",
      "Immaculate",
      "Ornate",
      "Venerable",
      "Enchanted",
      "Enlightened",
      "Evolving",
      "Mythical",
      "Spectral",
      "Cerulean",
      "Primal",
      "Burning",
      "Effervescent",
      "Harmonic",
      "Fragrant",
      "Stellar",
      "Exquisite",
      "Aurora",
      "Majestic",
      "Rustic",
      "Serene",
      "Ravishing",
      "Gossamer",
      "Nebulous",
      "Epic",
      "Whispering",
      "Sorcerous",
      "Lush",
      "Nurturing",
      "Illustrious",
      "Noble",
      "Silent",
      "Ethereal",
      "Nebulous",
      "Ebon",
      "Enchanted",
      "Divine",
      "Resonant",
      "Ornate",
      "Flickering",
      "Sorcerous",
      "Resplendent",
      "Pristine",
      "Gossamer",
      "Vibrating",
      "Astral",
      "Blossoming",
      "Lunar",
      "Emerald",
      "Sapphire",
      "Effervescent",
      "Crimson",
      "Celestial",
      "Mystified",
      "Arcane",
      "Epic",
      "Ravishing",
      "Ethereal",
      "Supreme",
      "Vibrating",
      "Gossamer",
      "Resplendent",
      "Pristine",
      "Sorcerous",
      "Emerald",
      "Sapphire",
      "Stellar",
      "Flickering",
      "Ornate",
      "Divine",
      "Verdant",
      "Blossoming",
      "Mythical",
      "Astral",
      "Whispering",
      "Enchanted",
      "Sylvan",
      "Ethereal",
      "Cerulean",
      "Lunar",
      "Sage",
      "Majestic",
      "Resilient",
      "Epic",
      "Crimson",
      "Golden",
      "Silver",
      "Twilight",
      "Enigmatic",
      "Ingenious",
      "Steam-powered",
      "Mechanical",
      "Luminous",
      "Arcane",
      "Celestial",
      "Shadowed",
      "Mystical",
      "Eternal",
      "Radiant",
      "Noble",
      "Whirling",
      "Frostborn",
      "Moonlit",
      "Thundering",
      "Starforged",
      "Resplendent",
      "Sorcerer's",
      "Wandering",
      "Dread",
      "Sylvan",
      "Aetherial",
      "Ebon",
      "Vibrant",
      "Dusk",
      "Immaculate",
      "Ornate",
      "Venerable",
      "Enchanted",
      "Enlightened",
      "Evolving",
      "Mythical",
      "Spectral",
      "Cerulean",
      "Primal",
      "Burning",
      "Effervescent",
      "Harmonic",
      "Fragrant",
      "Stellar",
      "Exquisite",
      "Aurora",
      "Majestic",
      "Rustic",
      "Serene",
      "Ravishing",
      "Gossamer",
      "Nebulous",
      "Epic"
    ]
  const nouns = [
      "Order",
      "Brotherhood",
      "Serpent",
      "Empire",
      "Knights",
      "Syndicate",
      "Phoenix",
      "Avalon",
      "Valkyries",
      "Titans",
      "Lorekeepers",
      "Moon",
      "Storm",
      "Grove",
      "Tide",
      "Sands",
      "Starlight",
      "Cogworks",
      "Gizmos",
      "Tesla",
      "Vapor",
      "Clockwork",
      "Mechanica",
      "Infinity",
      "Prime",
      "Chronicles",
      "Oracle",
      "Harmony",
      "Labyrinth",
      "Shadows",
      "Apex",
      "Vortex",
      "Sanctuary",
      "Haven",
      "Enigma",
      "Cogs",
      "Radiance",
      "Citadel",
      "Elysium",
      "Nexus",
      "Phantom",
      "Legion",
      "Sentinels",
      "Eclipse",
      "Whisper",
      "Cascade",
      "Helm",
      "Regalia",
      "Chalice",
      "Cogs",
      "Radiance",
      "Citadel",
      "Elysium",
      "Nexus",
      "Phantom",
      "Legion",
      "Sentinels",
      "Eclipse",
      "Whisper",
      "Cascade",
      "Helm",
      "Regalia",
      "Chalice",
      "Enigma",
      "Dynamo",
      "Chronicle",
      "Arcanum",
      "Armada",
      "Vapor",
      "Astro",
      "Gizmos",
      "Cogs",
      "Radiance",
      "Citadel",
      "Elysium",
      "Nexus",
      "Phantom",
      "Legion",
      "Sentinels",
      "Eclipse",
      "Whisper",
      "Cascade",
      "Helm",
      "Regalia",
      "Chalice",
      "Sanctum",
      "Harmony",
      "Synthesis",
      "Dreamers",
      "Stardust",
      "Chronicles",
      "Enigma",
      "Lore",
      "Armada",
      "Vortex",
      "Oracle",
      "Abyss",
      "Voyagers",
      "Innovators",
      "Cogworks",
      "Radiance",
      "Infinity",
      "Prime",
      "Citadel",
      "Elysium",
      "Nexus",
      "Phantom",
      "Legion",
      "Sentinels",
      "Eclipse",
      "Whisper",
      "Cascade",
      "Helm",
      "Regalia",
      "Chalice",
      "Enigma",
      "Dynamo",
      "Chronicle",
      "Astro",
      "Arcanum",
      "Armada",
      "Vapor",
      "Astro",
      "Gizmos",
      "Cogs",
      "Radiance",
      "Citadel",
      "Elysium",
      "Nexus",
      "Phantom",
      "Legion",
      "Sentinels",
      "Eclipse",
      "Whisper",
      "Cascade",
      "Helm",
      "Regalia",
      "Chalice",
      "Sanctum",
      "Harmony",
      "Synthesis",
      "Dreamers",
      "Stardust",
      "Chronicles",
      "Enigma",
      "Lore",
      "Armada",
      "Vortex",
      "Oracle",
      "Abyss",
      "Voyagers",
      "Innovators"
    ]
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

  const handleAddChange = (event: ChangeEvent<HTMLInputElement>) =>  {
    setAddressesToAdd(event.target.value)
  }
  
  const handleCreateFaction = async () => {
    if (!user.address) return;
    setShowAlert(false);
    onCloseConfirmation();

    try {
      const signature = await requestSignature();
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomAdjective2 = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      var factionName = randomAdjective+" "+randomAdjective2+" "+randomNoun;

      await createFaction(user.address.toLowerCase(),
        signature,
        factionType,
        factionName.toString(),
        addresses,
        "data:image/jpeg;base64,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"
      );
      toast.success("Faction has been created!");
      rdContext.refreshUser();
      handleClose();
      onClose();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const handleConfirmation = () => {
      if (!user.address) return;

      if(addresses.length > getMaxAddresses()) {
        setAlertMessage("You are over the maximum number of addresses for this faction type")
        setShowAlert(true)
        return;
      }

      if(!understood) {
          setAlertMessage("Acknowledgement required");
          setShowAlert(true);
          return;
      }
      setShowAlert(false);

      onOpenConfirmation();
  }

  const [isMobile] = useMediaQuery("(max-width: 768px)") 
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
          title='Create a Faction'
          titleIcon={<Icon as={FontAwesomeIcon} icon={faShieldAlt} />}
        >
            <Flex alignContent={'center'} justifyContent={'center'} >
            {currentTab === tabs.page1 && (
              <Box p='3'>
              <SimpleGrid columns={2} my={4} px={1} marginBottom={0}>
                  <Box>Season Subscription Fee:</Box>
                  <Box textAlign='end' fontWeight='bold'>{rdContext.config.factions.registration.fortuneCost} $Fortune</Box>
              </SimpleGrid>
      
              <Spacer my={8} />
              <Text>
                  NFT collections MUST register as a faction each season in order to participate in battle and be considered for listing rewards. Must be holding at least 1500 $Mitama in your wallet.
              </Text>
      
      
              <Spacer my={8} />
      
              <Flex direction='row' justify='space-between' mt={2} mb={2} maxW='100%'>
                <Box w='40%' margin='auto'>
                  <Text > 
                    Select Faction Type:
                  </Text>
                        {/* <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} color='#333' boxSize={8}/>
                        <Text
                          fontSize='14'
                          color='#333'
                          as='b'
                        > Warning: If you create a faction, you will be unable to delegate troops to other factions for the remainder of the season
                        </Text> */}
                  <Stack direction='row' align='center'  p={1} rounded='sm'>
                        <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} color='#f8a211' boxSize={6}/>
                  <Text  fontSize='12'
                          color='#aaa'
                          as='b'> 
                    Cannot be changed once set
                  </Text>
                    </Stack>
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
      
                  <Text w='100%' as='i' color='#aaa' fontSize={{base: '12', sm: '14'}}>
                    {factionType === "COLLECTION" ? ("Rewards will be distributed to all wallets who hold an NFT from the collection. Maximum 3 collection addresses") 
                    : ("Rewards will be distributed to individual wallets added. Maximum of 15 individual wallet addresses")}
                  </Text>

                  </VStack>
                </Box>
              </Flex>
      
              <Spacer my={8} />

              <Divider />


              <Flex direction='row' justify='space-between' mb={2}>
                <FormLabel style={{ display: 'flex', marginTop: '24px' }}
                fontSize={{base: '12', sm: '14'}}>Addresses of 
                {factionType === "COLLECTION" ? (
                    " Collections"
                  ) : (
                    " Wallets"
                  )}
                </FormLabel>
                <Text
                marginTop={'24px'}
                as={'i'}
                color={'#aaa'}
                fontSize={{base: '12', sm: '14'}}
                >
                  can be added/ updated later
                </Text>
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
      
                <Box mt={4}>
                  <VStack>
                    <Stack direction='row' align='center' bg='#f8a211' p={2} rounded='sm'>
                        <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} color='#333' boxSize={8}/>
                        <Text
                          fontSize='14'
                          color='#333'
                          as='b'
                        > Warning: If you create a faction, you will be unable to delegate troops to other factions for the remainder of the season
                        </Text>
                    </Stack>
                    <Checkbox
                      onChange={(t) => setUnderstood(t.target.checked)}
                      >I Understand
                    </Checkbox>
                    {showAlert && (
                      <Alert status='error'>
                          <AlertIcon />
                          <AlertTitle>{alertMessage}</AlertTitle>
                      </Alert>)}
      
                      <Center>
                <RdButton
                  // onClick={() => setPage1(false)}
                  onClick={handleConfirmation}
                  size='lg'
                  stickyIcon={true}
                  isLoading={isExecuting}
                  isDisabled={isExecuting}
                >
                    Continue
                </RdButton>
            </Center>
                  </VStack>
                </Box>
              </Box>
            )}
            </Flex>
            <RdModalFooter>
            </RdModalFooter>
        </RdModal>

        {/* Confirmation Pop Up */}
        <RdModal
          isOpen={isConfirmationOpen}
          onClose={onCloseConfirmation}
          title='Confirm'
        >
          <RdModalAlert>
            <Text>Warning: If you create a faction, you will be unable to delegate troops to other factions for the remainder of the season</Text>
          </RdModalAlert>
          <RdModalFooter>
            <Stack justify='center' direction='row' spacing={6}>
              <RdButton
                onClick={onCloseConfirmation}
                size='lg'
                isLoading={isExecuting}
                isDisabled={isExecuting}
              >
                Cancel
              </RdButton>
              <RdButton
                onClick={handleCreateFaction}
                size='lg'
                isLoading={isExecuting}
                isDisabled={isExecuting}
              >
                Create
              </RdButton>
            </Stack>
          </RdModalFooter>
        </RdModal>
    </>
  );
}

export default CreateFactionForm;


interface Page1Props {
  rdContext: RyoshiDynastiesContextProps;
  setFactionType : (type: string) => void;
  factionType : string;
}

const Page1 = ({rdContext, setFactionType, factionType} : Page1Props) => {
  return(
    <>
      
        
      </>
  );
}