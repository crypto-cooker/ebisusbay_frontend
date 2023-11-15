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
  HStack,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {useAppSelector} from "@src/Store/hooks";
import {toast} from "react-toastify";
import {
  deployTroops,
  getFactionOwned,
  getTroopsOnControlPoint,
  recallTroops,
} from "@src/core/api/RyoshiDynastiesAPICalls";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {RdControlPoint, RdFaction, RdGameState} from "@src/core/services/api-service/types";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {parseErrorMessage} from "@src/helpers/validator";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import SearchFaction from "@src/components-v2/feature/ryoshi-dynasties/components/search-factions";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
// import Select from "react-select";
const tabs = {
  recall: 'recall',
  deploy: 'deploy',
};
interface DeployTabProps {
  controlPoint: RdControlPoint;
  refreshControlPoint: () => void;
  factionsSubscribedToSeason: any[];
}

const DeployTab = ({controlPoint, refreshControlPoint, factionsSubscribedToSeason}: DeployTabProps) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const {requestSignature} = useEnforceSignature();
  const [currentTab, setCurrentTab] = useState(tabs.deploy);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [troopsError, setTroopsError] = useState('');
  const [factionError, setFactionError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [dataForm, setDataForm] = useState({ faction: "" ?? null, quantity: 0, })
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedFaction, setSelectedFaction] = useState<string>(dataForm.faction);
  const handleQuantityChange = (stringValue: string, numValue: number) => setSelectedQuantity(numValue)
  const [playerFaction, setPlayerFaction] = useState<RdFaction>();
  const [hasFaction, setHasFaction] = useState(false);
  const [troopsAvailable, setTroopsAvailable] = useState(0);
  const [troopsDeployed, setTroopsDeployed] = useState(0);
  const [factionSubscribed, setFactionSubscribed] = useState(false);

  const handleConnect = async () => {
    if (!user.address) {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  }
  const onChangeInputsFaction = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFaction(e.target.value)
  }
  const GetTroopsOnPoint = async () => {
    if (!user.address) return;

    try {
      const signature = await requestSignature();
      const data = await getTroopsOnControlPoint(user.address.toLowerCase(), signature,
        controlPoint.id, rdContext?.game?.game.id);
      setTroopsDeployed(data)
    } catch (error) {
      console.log(error)
    }
  }
  const GetPlayerTroops = async () => {
    if (!user.address) return;

    try {
      const signature = await requestSignature();
      const data = await getFactionOwned(user.address.toLowerCase(), signature);
      // console.log("data.data.data", data.data.data)
      if(data.data.data?.isEnabled) {
        setHasFaction(true)
        setPlayerFaction(data.data.data)
      }
      else {
        setHasFaction(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const HandleSelectCollectionCallback = (factionName: string) => {
    setSelectedFaction(factionName);
  }
  const DeployOrRecallTroops = async () => {
    if (!user.address) return;

    if (rdContext.game?.state === RdGameState.RESET) {
      setFactionError("Game has ended. Please wait until the next game begins")
      return
    }

    if(selectedFaction === "") {
      setFactionError(`You must select a faction`);
      return;
    }
    if(factionsSubscribedToSeason.filter(faction => faction.name === selectedFaction)[0].addresses.length === 0){
      setFactionError(`Faction must have addresses to participate`);
      return;
    }

    setFactionError('');

    if(currentTab === tabs.deploy) {
      if(selectedQuantity > troopsAvailable || selectedQuantity <= 0) {
        setTroopsError(`You cant deploy more troops than you have available`);
        return;
      }
      if(selectedQuantity === 0) {
        setTroopsError(`You must deploy at least 1 troop`);
        return;
      }
      setTroopsError('');
      Deploy()
    }
    else if(currentTab === tabs.recall) {
      if(selectedQuantity > troopsDeployed || selectedQuantity < 0) {
        setTroopsError(`You can't recall more troops than you have deployed`);
        return;
      }
      if(selectedQuantity === 0) {
        setTroopsError(`You must recall at least 1 troop`);
        return;
      }
      setTroopsError('');
      Recall()
    }
  }
  const Deploy = async () => {
    try {
      setIsExecuting(true);
      const signature = await requestSignature();
      // console.log("deploying troops")
      var factionId = factionsSubscribedToSeason.filter(faction => faction.name === selectedFaction)[0].id
      // console.log("factionId", factionId)
      // console.log("selectedQuantity", selectedQuantity)
      // console.log("controlPoint.id", controlPoint.id)
      // console.log("user.address", user.address?.toLowerCase())
      // console.log("rdContext?.game?.game.id", rdContext?.game?.game.id)


      var data = await deployTroops(user.address?.toLowerCase(), signature,
          rdContext?.game?.game.id, selectedQuantity, controlPoint.id, factionId)

      await GetPlayerTroops();
      setSelectedQuantity(0);
      await rdContext.refreshUser();

      toast.success("You deployed "+ selectedQuantity+ " troops to on behalf of " + selectedFaction)

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const Recall = async () => {
    try {
      setIsExecuting(true);
      const signature = await requestSignature();
      // console.log("recalling troops")
      // console.log("rdContext", rdContext?.game?.game.id)
      var factionId = factionsSubscribedToSeason.filter(faction => faction.name === selectedFaction)[0].id
      // console.log("user.address", user.address?.toLowerCase())
      // console.log("factionId", factionId)
      // console.log("selectedQuantity", selectedQuantity)
      // console.log("controlPoint.id", controlPoint.id)

      var data = await recallTroops(user.address?.toLowerCase(), signature,
        rdContext?.game?.game.id, selectedQuantity, controlPoint.id, factionId)

      await GetPlayerTroops();
      setSelectedQuantity(0);
      await rdContext.refreshUser();
      refreshControlPoint();

      toast.success("You recalled "+ selectedQuantity + " troops from "+ controlPoint.name +" on behalf of "+ selectedFaction)
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
      // toast.error(error.response.data.error.metadata.message)
    } finally {
      setIsExecuting(false);
    }
  }

  const GetMaxTroops = () => {
    if(currentTab === tabs.deploy) {
      return troopsAvailable > 0 ? troopsAvailable : 0;
    }
    else if(currentTab === tabs.recall) {
      return troopsDeployed > 0 ? troopsDeployed : 0;
    }
    return 0;
  }
  const CheckIfFactionSubscribed = () => {
    //check if allfactions (which contains factions subscribed to the season) contains selected faction
    setFactionSubscribed(factionsSubscribedToSeason.filter(faction => faction.name === selectedFaction).length > 0);
  }

  useEffect(() => {
    GetTroopsOnPoint();
    CheckIfFactionSubscribed();
  }, [selectedFaction])
  useEffect(() => {
    GetPlayerTroops();
  }, [user.address])
  useEffect(() => {
  }, [factionsSubscribedToSeason]);
  useEffect(() => {
    if(!rdContext?.user) return;

    if(rdContext.user.season.troops.available.total !== undefined) {
      setTroopsAvailable(rdContext.user.season.troops.available.total);
    }
  }, [rdContext]);

  return (
    <Flex flexDirection='column' textAlign='center'justifyContent='space-around'>
      {!!user.address ? (
        <Flex direction='row' justify='space-between' justifyContent='center'>
          <Box mb={4} bg='#272523' p={2} rounded='md' w='90%' justifyContent='center' >
            <Center>
              <Flex direction='row' justify='center' mb={2}>
                <RdTabButton
                  isActive={currentTab === tabs.deploy}
                  onClick={() => setCurrentTab(tabs.deploy)}
                > Deploy
                </RdTabButton>
                <RdTabButton
                  isActive={currentTab === tabs.recall}
                  onClick={() => setCurrentTab(tabs.recall)}
                > Recall
                </RdTabButton>
              </Flex>
            </Center>

            <FormControl
              isInvalid={!!factionError}
              mb={'24px'}
              bg='none'>
              
              {hasFaction ? (<></>) : (<>
                <Grid templateColumns={{base:'repeat(1, 1fr)', sm:'repeat(5, 1fr)'}} gap={6} marginBottom='4'>
                  <GridItem w='100%' h='5' >
                    <FormLabel> Faction:</FormLabel>
                  </GridItem>
                  <GridItem colSpan={{base:5, sm:4}} w='100%' >
                    <SearchFaction handleSelectCollectionCallback={HandleSelectCollectionCallback} allFactions={factionsSubscribedToSeason} imgSize={"lrg"}/>
                  </GridItem>
                </Grid>
              </>)}

              <Select 
                me={2}
                bg='none'
                style={{ background: '#272523' }}
                value={selectedFaction}
                name="faction"
                onChange={onChangeInputsFaction}
              >
                <option selected hidden disabled value="">Please select a faction</option>
                {hasFaction ? (
                  <option 
                    style={{ background: '#272523' }} 
                    value={playerFaction!.name} 
                    key={0}>
                    <Image 
                      src={playerFaction!.image} 
                      width='20px' 
                      height='20px' />
                    {playerFaction!.name}
                  </option>
                ) : factionsSubscribedToSeason.map((faction, index) => (
                  <option 
                    style={{ background: '#272523' }} 
                    value={faction.name} 
                    key={index}>
                    <Image 
                      src={faction.image} 
                      width='50px' 
                      height='50px' />
                    {faction.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{factionError}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!troopsError}>
              <FormLabel>
                <HStack justifyContent='space-between'>
                  <Text>Troops To {currentTab === tabs.recall ? "Recall" : "Deploy"}:</Text>
                  {currentTab === tabs.deploy && (
                    <Box>
                      <HStack justifyContent='space-between'>
                        <Text fontSize={14} color='#aaa' align='right'> Troops Available: </Text>
                        <Text fontWeight='bold'>{troopsAvailable}</Text>
                      </HStack>
                    </Box>
                  )}
                  {currentTab === tabs.recall &&  (
                    <Box>
                      <HStack justifyContent='space-between'>
                        <Text fontSize={14} color='#aaa' align='right'> Troops Deployed: </Text>
                        <Text fontWeight='bold'>{troopsDeployed}</Text>
                      </HStack>
                    </Box>
                  )}
                </HStack>

              </FormLabel>
              <Flex justifyContent='center' w={'100%'}>
                <NumberInput 
                  defaultValue={1} 
                  min={1} 
                  max={GetMaxTroops()} 
                  name="quantity"
                  onChange={handleQuantityChange}
                  value={selectedQuantity}
                  w='85%'
                  >
                  <NumberInputField />
                  <NumberInputStepper >
                    <NumberIncrementStepper color='#ffffff'/>
                    <NumberDecrementStepper color='#ffffff'/>
                  </NumberInputStepper>
                </NumberInput>

                <Spacer />
                <Button 
                  variant={'outline'}
                  onClick={() => setSelectedQuantity(GetMaxTroops())}
                  color='white'
                >
                  Max
                </Button>
              </Flex>

              <FormErrorMessage>{troopsError}</FormErrorMessage>
            </FormControl>

            <Spacer h='8'/>

            <Center>
              {selectedFaction ? (
                factionSubscribed ? (
                    <RdButton
                      w='250px'
                      fontSize={{base: 'lg', sm: 'lg'}}
                      onClick={DeployOrRecallTroops}
                      disabled={isExecuting}
                    >
                      {currentTab === tabs.deploy ? "Deploy" :"Recall" }
                    </RdButton>
                ) : (
                  <Text as={'i'} textColor={'#aaa'}> {selectedFaction} is not subscribed to current season</Text>
                )
              ) : (
                <></>
              )}
            </Center>

          </Box>
        </Flex>
      ) : (
        <Box textAlign='center' pt={8} pb={4} px={2}>
          <Box ps='20px'>
            <RdButton
              w='250px'
              fontSize={{base: 'xl', sm: '2xl'}}
              stickyIcon={true}
              onClick={handleConnect}
            >
              Connect
            </RdButton>
          </Box>
        </Box>
      )}
    </Flex>
  )
}

export default DeployTab;