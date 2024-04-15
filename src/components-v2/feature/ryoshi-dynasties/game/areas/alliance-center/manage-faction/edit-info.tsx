import {useUser} from "@src/components-v2/useUser";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import React, {ChangeEvent, ReactElement, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {BigNumber, Contract, ethers} from "ethers";
import Fortune from "@src/global/contracts/Fortune.json";
import {disbandFaction, editFaction, getRegistrationCost} from "@src/core/api/RyoshiDynastiesAPICalls";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, shortAddress} from "@market/helpers/utils";
import AllianceCenterContract from "@src/global/contracts/AllianceCenterContract.json";
import {parseErrorMessage} from "@src/helpers/validator";
import {RdModalBody, RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box, Button, Divider,
  Flex, FormControl, FormLabel,
  GridItem,
  HStack, Input, ListItem, OrderedList,
  SimpleGrid,
  Stack,
  Text, useMediaQuery,
  VStack
} from "@chakra-ui/react";
import {CheckCircleIcon} from "@chakra-ui/icons";
import {commify} from "ethers/lib/utils";
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import Cropper from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/manage-faction/cropper";
import Search from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/search";
import {appConfig} from "@src/Config";
import {useFormik} from "formik";
import {ApiService} from "@src/core/services/api-service";

const config = appConfig();

interface EditInfoProps {
  faction: any;
  canEdit: boolean;
  isRegistered: boolean;
  onComplete: () => void;
}

const EditInfo = ({faction, canEdit, isRegistered, onComplete}: EditInfoProps) => {
  const user = useUser();
  const {requestSignature} = useEnforceSignature();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const addressInput = useRef<HTMLInputElement>(null);
  const factionNameInput = useRef(null);

  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const [addresses, setAddresses] = useState<string[]>([]);
  const [factionType, setFactionType] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [addressToAdd, setAddressesToAdd] = useState('')

  const maxAddresses = factionType === 'COLLECTION' ? 3 : 15;

  const addressDisplay = useMemo(() => {
    if(addresses !== undefined) {
      return addresses.map((address, index) => {
        return (
          <ListItem key={index} marginTop={'2'} color='#aaa'>
            <Flex justifyContent={"space-between"} margin={'auto'} border={'1px'} rounded={'md'}>
              <Text
                color={'#ffffffeb'}
                fontSize={{base: '12', sm: '14'}}
                marginTop={'auto'}
                marginBottom={'auto'}
                marginLeft={'2'}
              >
                {isMobile ? shortAddress(address) : address}
              </Text>
              <Button
                h='30px'
                w='30px'
                padding={0}
                onClick={() => handleRemoveAddress(address)}
                fontSize={{base: '12', sm: '14'}}
              >x
              </Button>
            </Flex>
          </ListItem>
        )
      })
    }
  }, [addresses, isMobile]);

  const handleSyncAddressToAdd = (event: ChangeEvent<HTMLInputElement>) =>  {
    setAddressesToAdd(event.target.value)
  }

  function handleAddAddress() {
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
    if(addresses.length >= maxAddresses) {
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

  const handleSelectCollection = (collectionAddress: string) => {
    // console.log(collectionAddress);
    setAddressesToAdd(collectionAddress);
  }

  function handleRemoveAddress(addressToRemove: string) {
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

  const handleDisbandFaction = async() => {
    try {
      const signature = await requestSignature();
      await disbandFaction(user.address!.toLowerCase(), signature, "DEACTIVATE");
      onComplete();
      setShowDeleteAlert(false)
      rdContext.refreshUser();
      toast.success("Faction disbanded");

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  }

  const handleReactivateFaction = async() => {
    try {
      const signature = await requestSignature();
      await disbandFaction(user.address!.toLowerCase(), signature, "ACTIVE");
      onComplete();
      rdContext.refreshUser();
      toast.success("Faction reenabled");
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  }

  function showDeleteWarning() {
    if(!canEdit) {
      setAlertMessage("You cannot edit your faction at this point in the game, changes can be made at the start of the next game")
      setShowAlert(true)
      return;
    }
    setShowDeleteAlert(true)
  }

  const handleSave = async() => {
    if(!canEdit) {
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
    if(addresses.length > maxAddresses) {
      setAlertMessage("You are over the maximum number of addresses for this faction type")
      setShowAlert(true)
      return;
    }
    setShowAlert(false)

    try {
      const signature = await requestSignature();
      await ApiService.withoutKey().ryoshiDynasties.updateFaction({
        id: faction.id,
        name: formik.values.factionName,
        addresses: addresses,
        type: factionType,
      }, user.address!.toLowerCase(), signature);
      toast.success("Changes Saved");
    } catch (error:any) {
      console.log(error)
      toast.error(parseErrorMessage(error));
    }
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
    setAddresses(faction.addresses)
    setFactionType(faction.type)
  }, [faction]);

  return (
    <>
      <SeasonRegistration />
      <RdModalBox mt={2}>
        <VStack spacing={2} p={2}>
          <Cropper editsAllowed={canEdit} />

          <Flex w='95%' direction='row' justify='space-between' mt={2} mb={2}>
            <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>
              Current Status:
            </Text>
            <Text as='i' color='#aaa' fontSize={{base: '12', sm: '14'}}>
              {isRegistered ? "Registered" : "Not Registered"}
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
                  <AlertIcon/>
                  <AlertTitle>Warning! If you disband a registered faction you will be unable to register
                    another faction this season.</AlertTitle>
                </HStack>
                <HStack>
                  <Button type="submit" style={{display: 'flex', marginTop: '4px'}}
                          onClick={handleDisbandFaction} variant='outline' colorScheme='red'
                  >Confirm Disband</Button>
                  <Button type="submit" style={{display: 'flex', marginTop: '4px'}}
                          onClick={() => setShowDeleteAlert(false)} variant='outline' colorScheme='white'
                  >Cancel</Button>
                </HStack>
              </VStack>
            </Alert>
          ) : (
            <>
              {rdContext.user?.faction.isEnabled ? (
                <Button
                  type="submit"
                  onClick={showDeleteWarning}
                  colorScheme='red'
                  fontSize={{base: '12', sm: '14'}}
                  variant={"outline"}
                >
                  x Disband Faction
                </Button>

              ) : (
                <Button
                  type="submit"
                  onClick={handleReactivateFaction}
                  colorScheme='green'
                  fontSize={{base: '12', sm: '14'}}
                  variant={"outline"}
                >
                  Reenable Faction
                </Button>
              )}
            </>

          )}
        </VStack>
      </RdModalBox>
      <RdModalBox mt={2} roundedBottom='xl'>

        <Box margin='auto' mb='4'>

          <form onSubmit={formik.handleSubmit} style={{marginTop: '24px'}}>
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

        <Divider/>


        <Flex direction='row' justify='space-between' mb={2}>
          <FormLabel style={{display: 'flex', marginTop: '24px'}}>Addresses of
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
            onChange={handleSyncAddressToAdd}
            placeholder='Add address here'
            size='sm'
          />
          <Button
            onClick={handleAddAddress}
            fontSize={{base: '12', sm: '14'}}
          >
            Add +
          </Button>
        </Stack>

        {factionType === "COLLECTION" ? (
          <Search handleSelectCollectionCallback={handleSelectCollection}/>
        ) : (<></>)}

        <OrderedList>
          {addressDisplay}
        </OrderedList>

        <ul id="addresseslist"></ul>
        <Flex justify={"center"} align={"center"} style={{marginTop: '16px'}}>
          <Box p='3'>
            {showAlert && (
              <Alert status='error'>
                <AlertIcon/>
                <AlertTitle>{alertMessage}</AlertTitle>
              </Alert>
            )}
          </Box>
        </Flex>
        {canEdit && (
          <Flex justifyContent={"center"} align={"center"}>
            <Box p='3'>
              <RdButton
                onClick={handleSave}
              >
                Save Changes
              </RdButton>
            </Box>
          </Flex>
        )}
      </RdModalBox>
    </>
  )
}

export default EditInfo;

const SeasonRegistration = () => {
  const user = useUser();
  const {requestSignature} = useEnforceSignature();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [factionCreatedAndEnabled, setFactionCreatedAndEnabled] = useState(false);
  const [isRegisteredCurrentSeason, setIsRegisteredCurrentSeason] = useState(false);
  const [isRegisteredNextSeason, setIsRegisteredNextSeason] = useState(false);
  const [isExecutingRegister, setIsExecutingRegister] = useState(false);

  const checkForApproval = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
    const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), config.contracts.allianceCenter);
    return totalApproved as BigNumber;
  }

  const handleRegister = async (seasonBlockId : number) => {
    if (!user.address) return;

    const currentSeasonBlockId = rdContext.game?.season.blockId;
    if (!currentSeasonBlockId) {
      toast.error('No active season');
      return;
    }
    const nextSeasonBlockId = currentSeasonBlockId + 1;

    if (isRegisteredCurrentSeason && seasonBlockId === currentSeasonBlockId ||
      isRegisteredNextSeason && seasonBlockId === nextSeasonBlockId) {
      toast.error('Already registered for this season');
    } else {
      try {
        setIsExecutingRegister(true);
        const signinSignature = await requestSignature();
        const { signature, ...registrationStruct } = await getRegistrationCost(
          user.address?.toLowerCase(),
          signinSignature,
          seasonBlockId,
          rdContext.game?.game.id,
          rdContext.user?.faction.id
        );

        const totalApproved = await checkForApproval();
        if(totalApproved.lt(registrationStruct.cost)) {
          toast.warning('Please approve the contract to spend your tokens');
          const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
          const tx1 = await fortuneContract.approve(config.contracts.allianceCenter, registrationStruct.cost);
          const receipt1 = await tx1.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt1.transactionHash));
        }

        const registerFactionContract = new Contract(config.contracts.allianceCenter, AllianceCenterContract, user.provider.getSigner());
        const tx = await registerFactionContract.registerFaction(registrationStruct, signature)
        const receipt = await tx.wait();
        rdContext.refreshUser();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      } catch (error: any) {
        console.log(error);
        toast.error(parseErrorMessage(error));
      } finally {
        setIsExecutingRegister(false);
      }
    }
  }

  useEffect(() => {
    if(!rdContext.user) return;

    setFactionCreatedAndEnabled(rdContext.user?.faction?.id !== undefined && rdContext.user?.faction.isEnabled);
    setIsRegisteredCurrentSeason(rdContext.user.season.registrations.current);
    setIsRegisteredNextSeason(rdContext.user.season.registrations.next);
  }, [rdContext.user]);

  if (!rdContext.user) return <></>;

  return (
    <RdModalBox>
      <Box textAlign='start'>
        <Flex justify='space-between'>
          <Box fontWeight='bold' fontSize='lg'>Season Registration</Box>
          {!!rdContext.user.season.faction && (
            <SimpleGrid columns={4} minW={'115px'}>
              <GridItem textAlign='end' colSpan={3}>Current:</GridItem>
              <GridItem ps={2} textAlign='end'>
                <Flex align='center' justify='end' h='full'>
                  <CheckCircleIcon color="green" bg="white" rounded="full" border="1px solid white"/>
                </Flex>
              </GridItem>
              <GridItem textAlign='end' colSpan={3}>Next:</GridItem>
              <GridItem ps={2} textAlign='end'>
                -
              </GridItem>
            </SimpleGrid>
          )}
        </Flex>
      </Box>
      <VStack spacing={0} alignItems='start' mt={2}>
        {!isRegisteredCurrentSeason ? (
          <Text color={'#aaa'}>Register for the current season. Current cost is {commify(rdContext.config.factions.registration.fortuneCost)} Fortune + {rdContext.config.factions.registration.mitamaCost} Mitama</Text>
        ) : (
          <Text color={'#aaa'}>Your faction is registered!</Text>
        )}
        <Stack direction={{base: 'column', sm: 'row'}} justify='end' w='full' mt={2}>
          {factionCreatedAndEnabled && !isRegisteredCurrentSeason && (
            <RdButton
              onClick={() => handleRegister(rdContext.game!.season.blockId)}
              size='sm'
            >
              Register
            </RdButton>
          )}
        </Stack>
      </VStack>
    </RdModalBox>
  )
}