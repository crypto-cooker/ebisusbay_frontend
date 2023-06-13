import { 
  Box, 
  Flex, 
  FormControl, 
  FormLabel, 
  Input, 
  Select,
  NumberInput, 
  NumberInputField,
  NumberInputStepper, 
  NumberIncrementStepper, 
  NumberDecrementStepper, 
  Radio, RadioGroup,
  VStack,
  HStack,
  Center,
  Spacer,
  Text,
  Button,
  FormErrorMessage
 } from "@chakra-ui/react";

import {useState, useEffect, useContext, ChangeEvent, ReactElement, use} from "react";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useAppSelector} from "@src/Store/hooks";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import { toast } from "react-toastify";
import {
  getTroopsOnControlPoint,
  getProfileTroops,
  getFactionOwned,
  deployTroops, 
  recallTroops, 
  getFactionUndeployedArmies
} from "@src/core/api/RyoshiDynastiesAPICalls";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {RdControlPoint, RdControlPointLeaderBoard, RdFaction} from "@src/core/services/api-service/types";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
const tabs = {
  recall: 'recall',
  deploy: 'deploy',
};
interface DeployTabProps {
  controlPoint: RdControlPoint;
  refreshControlPoint: () => void;
}

const DeployTab = ({controlPoint, refreshControlPoint}: DeployTabProps) => {

  const user = useAppSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();
  const [currentTab, setCurrentTab] = useState(tabs.deploy);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [troopsError, setTroopsError] = useState('');
  const [factionError, setFactionError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const [factionOption, setFactionOption] = useState<ReactElement[] | ReactElement>();
  const [dataForm, setDataForm] = useState({
    faction: "" ?? null,
    quantity: 0,
  })

  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedFaction, setSelectedFaction] = useState<string>(dataForm.faction);
  const handleQuantityChange = (stringValue: string, numValue: number) => setSelectedQuantity(numValue)
  const [allFactions, setAllFactions] = useState<RdControlPointLeaderBoard[]>([]);

  const [troopsAvailable, setTroopsAvailable] = useState(0);
  const [playerFaction, setPlayerFaction] = useState<RdFaction>();
  const [hasFaction, setHasFaction] = useState(false);
  const[troopsDeployed, setTroopsDeployed] = useState(0);

  const onChangeInputsFaction = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFaction(e.target.value)
  }

  const GetTroopsOnPoint = async () => {
    if (!user.address) return;
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await getTroopsOnControlPoint(user.address.toLowerCase(), signatureInStorage, 
          controlPoint.id, rdContext?.game?.game.id);
        setTroopsDeployed(data)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const GetPlayerTroops = async () => {
    if (!user.address) return;

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await getFactionOwned(user.address.toLowerCase(), signatureInStorage);

        if(data.data.data)
        {
          setHasFaction(true)
          setPlayerFaction(data.data.data)
          const factionTroopsData = await getFactionUndeployedArmies(user.address.toLowerCase(), signatureInStorage);
          setTroopsAvailable(factionTroopsData)
        }
        else
        {
          setHasFaction(false)
          const troops = await getProfileTroops(user.address.toLowerCase(), signatureInStorage);
          setTroopsAvailable(troops)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  const DeployOrRecallTroops = async () => {
    if (!user.address) return;

    if(selectedFaction === "") {
      setFactionError(`You must select a faction`);
      return;
    }
    setFactionError('');

    if(currentTab === tabs.deploy) {
      if(selectedQuantity > troopsAvailable) {
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
      if(selectedQuantity > troopsDeployed) {
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
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        setIsExecuting(true);
        

        var factionId = allFactions.filter(faction => faction.name === selectedFaction)[0].id
        console.log("factionId", factionId)
        console.log("selectedQuantity", selectedQuantity)
        console.log("controlPoint.id", controlPoint.id)

        var data = await deployTroops(user.address?.toLowerCase(), signatureInStorage,
          selectedQuantity, controlPoint.id, factionId)

        await GetPlayerTroops();
        setSelectedQuantity(0);
        await rdContext.refreshUser();

        toast.success("You deployed "+ selectedQuantity+ " troops to on behalf of " + selectedFaction)

      } catch (error: any) {
        console.log(error)
        toast.error(error.response.data.error.metadata.message)
      }
      finally {
        setIsExecuting(false);
      }
    }
  }
  const Recall = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
          setIsExecuting(true);

          // console.log("rdContext", rdContext?.game?.game.id)
          var factionId = allFactions.filter(faction => faction.name === selectedFaction)[0].id
          console.log("user.address", user.address?.toLowerCase())
          console.log("signatureInStorage", signatureInStorage)
          console.log("factionId", factionId)
          console.log("selectedQuantity", selectedQuantity)
          console.log("controlPoint.id", controlPoint.id)

          var data = await recallTroops(user.address?.toLowerCase(), signatureInStorage, 
            rdContext?.game?.game.id, selectedQuantity, controlPoint.id, factionId)

          await GetPlayerTroops();
          setSelectedQuantity(0);
          await rdContext.refreshUser();
          refreshControlPoint();

          toast.success("You recalled "+ selectedQuantity + " troops from "+ controlPoint.name +" on behalf of "+ selectedFaction)
      } catch (error: any) {
        console.log(error)
        // toast.error(error.response.data.error.metadata.message)
      }
      finally {
        setIsExecuting(false);
      }
    }
  }
  const GetMaxTroops = () => {
    if(currentTab === tabs.deploy) {
      return troopsAvailable
    }
    else if(currentTab === tabs.recall) {
      return troopsDeployed
    }
    return 0;
  }

  const ShowAvailableFactions = async () => {
    if(hasFaction) {
      setFactionOption(
        <option style={{ background: '#272523' }}
        value={playerFaction!.name} key={0}>{playerFaction!.name}</option>
      )
    }
    else {
      setFactionOption(allFactions.map((faction, index) => (
        <option style={{ background: '#272523' }}
        value={faction.name} key={index}>{faction.name}</option>
      )))
    }
  }

  useEffect(() => {
    if(controlPoint.leaderBoard !== undefined) {
      setAllFactions(controlPoint.leaderBoard);
    }
  }, [controlPoint])

  useEffect(() => {
    ShowAvailableFactions();
  }, [allFactions, playerFaction])

  useEffect(() => {
    GetTroopsOnPoint();
  }, [selectedFaction])

  useEffect(() => {
    GetPlayerTroops();
  }, [])

  useEffect(() => {
    setSelectedQuantity(0);
  }, [currentTab])

  return (
    <Flex flexDirection='column' textAlign='center'justifyContent='space-around'>

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
        <FormLabel>Faction:</FormLabel>
        <Select me={2} 
          bg='none'
          // placeholder='Please select a faction'
          style={{ background: '#272523' }}
          value={selectedFaction} 
          name="faction" 
          onChange={onChangeInputsFaction}>
            <option selected hidden disabled value="">Please select a faction</option>
          {factionOption}
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
        <NumberInput defaultValue={1} min={1} max={GetMaxTroops()} name="quantity" 
          onChange={handleQuantityChange}
          value={selectedQuantity}
        >
          <NumberInputField />
          <NumberInputStepper >
            <NumberIncrementStepper color='#ffffff'/>
            <NumberDecrementStepper color='#ffffff'/>
          </NumberInputStepper>
        </NumberInput>
      <FormErrorMessage>{troopsError}</FormErrorMessage>
      </FormControl>
      
      <Spacer h='8'/>

      <Center>
        <RdButton
          w='250px'
          fontSize={{base: 'lg', sm: 'lg'}}
          onClick={DeployOrRecallTroops}
          disabled={isExecuting}
        >
          {currentTab === tabs.deploy ? "Deploy" :"Recall" }
        </RdButton>
      </Center>

      </Box>
    </Flex>
    </Flex>
  )
}

export default DeployTab;