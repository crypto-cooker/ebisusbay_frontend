import {ChangeEvent, useContext, useEffect, useState} from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Text
} from "@chakra-ui/react"
import {delegateTroops, getAllFactionsSeasonId} from "@src/core/api/RyoshiDynastiesAPICalls";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {useAppSelector} from "@src/Store/hooks";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import SearchFaction from "@src/components-v2/feature/ryoshi-dynasties/components/search-factions";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {useUser} from "@src/components-v2/useUser";

interface DelegateTroopsFormProps {
  isOpen: boolean;
  onClose: () => void;
  delegateMode: 'delegate';
}

const DelegateTroopsForm = ({ isOpen, onClose, delegateMode}: DelegateTroopsFormProps) => {

  const {requestSignature} = useEnforceSignature();
  const [dataForm, setDataForm] = useState({
    faction: "" ?? null,
  })
  const user = useUser();
  const [troopsAvailable, setTroopsAvailable] = useState(0);
  const [selectedFaction, setSelectedFaction] = useState<string>(dataForm.faction);

  const [isExecuting, setIsExecuting] = useState(false);
  const [troopsToDelegate, setTroopsToDelegate] = useState(0)
  const handleChange = (stringValue: string, valusAsNumber: number) => setTroopsToDelegate(valusAsNumber)
  const { config: rdConfig, user:rdUser, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [allFactions, setAllFactions] = useState<any[]>([]);

  //error alerts
  const [troopsError, setTroopsError] = useState('');
  const [factionError, setFactionError] = useState('');


  const changeFactionDropdown = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFaction(e.target.value)
  }
  const HandleSelectCollectionCallback = (factionName: string) => {
    setSelectedFaction(factionName)
  }
  const GetFactions = async () => {
    const factions = await getAllFactionsSeasonId(rdGameContext?.game.id, rdGameContext?.season.id);
    setAllFactions(factions.sort((a:any, b:any) => a.name.localeCompare(b.name)));
  }

  const handleDelegateTroops = async () => {
    if (!user.address) return;

    if(selectedFaction === "") {
      setFactionError(`You must select a faction`);
      return;
    }
    if(allFactions.filter(faction => faction.name === selectedFaction)[0].addresses.length === 0){
      setFactionError(`Faction must have addresses to participate`);
      return;
    }
    if(troopsToDelegate > troopsAvailable || troopsAvailable <= 0) {
      setTroopsError(`You can't delegate more troops than you have available`);
      return;
    }
    if(troopsToDelegate === 0) {
      setTroopsError(`You must delegate at least 1 troop`);
      return;
    }
    setTroopsError('');
    setFactionError('');

    try {
      setIsExecuting(true);
      const signature = await requestSignature();
      var factionId = allFactions.filter(faction => faction.name === selectedFaction)[0].id
      await delegateTroops(user.address.toLowerCase(), signature, troopsToDelegate, factionId);
      await rdContext.refreshUser();
      setTroopsToDelegate(0);
      toast.success("You delegated "+ troopsToDelegate+ " troops to on behalf of " + selectedFaction)

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
    finally {
      setIsExecuting(false);
    }
  }

  const handleRecallTroops = () => {
    // //
    // //set up an api call here to process the request at the end of the week
    // //
    // //check if player already has a delegation to this faction
    // const delegationExists = player[0].delegations.filter(delegation => delegation.faction === dataForm.faction).length > 0
    // if(delegationExists)
    // {
    //   //if so, update the existing delegation
    //   const delegationIndex = player[0].delegations.findIndex(delegation => delegation.faction === dataForm.faction)
    //   player[0].delegations[delegationIndex].troops -= parseInt(troopsToDelegate);
    // }
    // else
    // {
    //   //add a new delegation to the player.delegations array
    //   player[0].delegations.push({faction: dataForm.faction, troops: troopsToDelegate})
    // }
    // onClose();
  }

  useEffect(() => {
    if(!rdUser) return;

    if(rdUser.game.troops.user.available.total !== undefined){
      setTroopsAvailable(rdUser.game.troops.user.available.total);
    }
  }, [rdUser]);

  useEffect(() => {
    GetFactions();
  }, []);

  return (
    <RdModal
      onClose={onClose}
      isOpen={isOpen}
      title='Delegate Troops'
      size='lg'
    >
      <Box p={1}>
        <RdModalBox roundedBottom='xl' roundedTop={0}>
          <Text>Users who are not faction owners can delegate their troops to any participating faction. Delegate and let your favorite factions lead your troops into battle!</Text>
          <Box mt={2}>
            <Grid templateColumns={{base:'repeat(1, 1fr)', sm:'repeat(5, 1fr)'}} gap={4} marginBottom='4'>
              <GridItem w='100%' h='5' margin={'auto'}>
                <FormLabel> Faction:</FormLabel>
              </GridItem>
              <GridItem colSpan={{base:5, sm:4}} w='100%' >
                <SearchFaction handleSelectCollectionCallback={HandleSelectCollectionCallback} allFactions={allFactions} imgSize={"md"}/>
              </GridItem>
            </Grid>

            <FormControl
              mb={'24px'}
              isInvalid={!!factionError}
            >
              <Select
                me={2}
                value={selectedFaction}
                style={{ background: '#272523' }}
                name="faction"
                onChange={changeFactionDropdown}>
                <option selected hidden disabled value="">Please select a faction</option>
                {allFactions.map((faction, index) => (
                  <option
                    style={{ background: '#272523' }}
                    value={faction.name}
                    key={index}>
                    <Image
                      src={faction.image}
                      width='50px'
                      height='50px' />
                    {faction.name}
                  </option>))}
              </Select>

              <FormErrorMessage>{factionError}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!troopsError}>
              <FormLabel>Quantity: (Max {troopsAvailable})</FormLabel>
              <Flex justifyContent='center' w={'100%'}>
                <NumberInput
                  w='80%'
                  defaultValue={0}
                  min={0}
                  max={troopsAvailable}
                  name="quantity"
                  onChange={handleChange}
                  value={troopsToDelegate}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Spacer />
                <Button
                  variant={'outline'}
                  onClick={() => setTroopsToDelegate(troopsAvailable)}
                >
                  Max
                </Button>
              </Flex>


              <FormErrorMessage>{troopsError}</FormErrorMessage>
            </FormControl>
            <Flex mt='16px'>
              <Text as='i' fontSize={14} color='#aaa'>
                {delegateMode==='delegate' ?
                  'Once delegated, these troops will remain with the faction for the remainder of the game'
                  : 'Recalling troops will return them to you at the end of the game'} </Text>
            </Flex>
            <Flex mt='16px' justifyContent='center'>
              <Box
                ps='20px'>
              </Box>
            </Flex>

            <Center>
              <RdButton
                w={{base: '200px', sm: '200px'}}
                disabled={isExecuting}
                fontSize={{base: 'lg', sm: 'xl'}}
                stickyIcon={true}
                marginTop='16px'
                marginBottom={{base: '16px', sm: '16px'}}
                onClick={delegateMode==='delegate' ? handleDelegateTroops : handleRecallTroops}>
                {delegateMode==='delegate' ? 'Delegate' : 'Recall'}
              </RdButton>
            </Center>

          </Box>
        </RdModalBox>
      </Box>
    </RdModal>
  )
}

export default DelegateTroopsForm;