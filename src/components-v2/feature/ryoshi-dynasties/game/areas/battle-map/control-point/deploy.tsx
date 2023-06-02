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
  Button
 } from "@chakra-ui/react";

import {useState, useEffect, useContext, ChangeEvent, ReactElement} from "react";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {
  getTroopsOnControlPoint,
  getProfileTroops,
  getFactionsOwned,
  deployTroops, 
  recallTroops, 
  getFactionUndeployedArmies
} from "@src/core/api/RyoshiDynastiesAPICalls";
import { toast } from "react-toastify";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {useAppSelector} from "@src/Store/hooks";
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

  const [factionOption, setFactionOption] = useState<ReactElement[] | ReactElement>();
  const [deployMode, setDeployMode] = useState(true);
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
        const data = await getTroopsOnControlPoint(user.address.toLowerCase(), signatureInStorage, controlPoint.id, 27);
        console.log(data)
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
        const data = await getFactionsOwned(user.address.toLowerCase(), signatureInStorage);

        if(data.data.data.length > 0)
        {
          setHasFaction(true)
          setPlayerFaction(data.data.data[0])
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
  const deployOrRecallTroops = async () => {
    if (!user.address) return;

    if(currentTab === tabs.deploy)
    {
      if(selectedQuantity > troopsAvailable)
      {
        toast.error("You don't have enough troops to deploy")
        return;
      }

      if(selectedQuantity === 0)
      {
        toast.error("You must deploy at least 1 troop")
        return;
      }
    }
    else if(currentTab === tabs.recall)
    {
      if(selectedQuantity > troopsDeployed)
      {
        toast.error("You don't have enough troops to recall")
        return;
      }

      if(selectedQuantity === 0)
      {
        toast.error("You must recall at least 1 troop")
        return;
      }
    }

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        if(currentTab === tabs.deploy)
        {
          var factionId = allFactions.filter(faction => faction.name === selectedFaction)[0].id
          var data = await deployTroops(user.address.toLowerCase(), signatureInStorage,
            selectedQuantity, controlPoint.id, factionId)

          await GetPlayerTroops();
          setSelectedQuantity(0);
          rdContext.refreshUser();

          toast.success("You deployed "+ selectedQuantity+ " troops to on behalf of " + selectedFaction)
          // console.log("You deployed", selectedQuantity, "troops to", controlPoint, "on behalf of", selectedFaction)
        }
        else if(currentTab === tabs.recall)
        {
          var factionId = allFactions.filter(faction => faction.name === selectedFaction)[0].id
          var data = await recallTroops(user.address.toLowerCase(), signatureInStorage,
            selectedQuantity, controlPoint.id, factionId)

          await GetPlayerTroops();
          setSelectedQuantity(0);
          rdContext.refreshUser();
          refreshControlPoint();

          toast.success("You recalled "+ selectedQuantity + "troops from"+ controlPoint.name +"on behalf of"+ selectedFaction)
        }
      } catch (error: any) {
        console.log(error)
        toast.error(error.response.data.error.metadata.message)
      }
    }
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
    GetPlayerTroops();
    GetTroopsOnPoint();
  }, [selectedFaction])

  return (
    <Flex flexDirection='column' textAlign='center'justifyContent='space-around'>

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

      <Flex direction='row' justify='space-between' justifyContent='center'>
        <Box mb={4} bg='#272523' p={2} rounded='md' w='90%' justifyContent='center' >

      <FormControl 
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
      </FormControl>

      <FormControl>
        <FormLabel>Troops To {currentTab === tabs.recall ? "Recall" : "Deploy"}:</FormLabel>
        <NumberInput defaultValue={1} min={1} max={troopsAvailable} name="quantity" 
          onChange={handleQuantityChange}
          value={selectedQuantity}
        >
          <NumberInputField />
          <NumberInputStepper >
            <NumberIncrementStepper color='#ffffff'/>
            <NumberDecrementStepper color='#ffffff'/>
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
          </Box>
      </Flex>

      <Flex direction='row' justify='space-between' justifyContent='center'>
        <Box mb={4} bg='#272523' p={2} rounded='md' w='90%' justifyContent='center' >
      
          <VStack alignItems='left'>
            <HStack>
            {currentTab === tabs.deploy && (
            <Text textAlign='left' >
              { hasFaction ? (<>
                <Text>Troops available to faction: {troopsAvailable}</Text>
                {/* <RadioGroup defaultValue='1' onChange={setTroopsSource} value={troopsSource}>
                <VStack spacing={1} direction='row' >
                  <Radio colorScheme='orange' size='md' value='1'>
                    Deploy Personal Troops
                  </Radio>
                  <Radio colorScheme='orange' size='md' value='2'>
                    Deploy Faction Troops
                  </Radio>
                </VStack>
              </RadioGroup> */}
                </>
                  ) : (
                <Text>Troops available in wallet: {troopsAvailable}</Text>
                )}
                </Text>)}
              

          {currentTab === tabs.recall &&  (
          <Text> Troops deployed to {controlPoint.name} on behalf of {selectedFaction}: {troopsDeployed}</Text>
            )}

            </HStack>
          </VStack>

        </Box>
      </Flex>


  <Flex direction='row' justify='space-between' justifyContent='center'>
    <Box mb={4} bg='#272523' p={2} rounded='md' w='90%' justifyContent='center' >
      <Center>
        <RdButton
          w='250px'
          fontSize={{base: 'm', sm: 'm'}}
          onClick={deployOrRecallTroops}
          disabled={!selectedFaction }
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