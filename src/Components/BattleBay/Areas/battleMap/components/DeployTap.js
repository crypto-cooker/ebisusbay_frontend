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
  Text
 } from "@chakra-ui/react";

import { useState, useEffect } from "react";
import Button from "@src/Components/components/Button";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {getProfileTroops, getFactionsOwned, deployTroops, recallTroops, getFactionTroops} from "@src/core/api/RyoshiDynastiesAPICalls";
import { toast } from "react-toastify";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

const tabs = {
  recall: 'recall',
  deploy: 'deploy',
};

const DeployTap = ({controlPoint=[], refreshControlPoint}) => {

  const user = useSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();
  const [currentTab, setCurrentTab] = useState(tabs.deploy);

  const [factionOption, setFactionOption] = useState([]);
  const [dataForm, setDataForm] = useState({
    faction: "" ?? null,
    quantity: 0,
  })
  const [troopsSource, setTroopsSource] = useState(1);

  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedFaction, setSelectedFaction] = useState(dataForm.faction);
  const handleChange = (value) => setSelectedQuantity(value)
  const [allFactions, setAllFactions] = useState([]);

  const [troopsAvailable, setTroopsAvailable] = useState(0);
  const [factionTroopsAvailable, setFactionTroopsAvailable] = useState(0);
  const [playerFaction, setPlayerFaction] = useState("");
  const [showFactionTroops, ShowFactionTroops] = useState(false);
  const [canDeploy, setCanDeploy] = useState(false);

  const onChangeInputsFaction = (e) => {
    setSelectedFaction(e.target.value)
    console.log(e.target.value)
    if(e.target.value === playerFaction.name)
    {
      // console.log("same faction")
      setFactionTroopsAvailable(playerFaction.troops)
      ShowFactionTroops(true)
    }
    else
    {
      // console.log("not a faction")
      setFactionTroopsAvailable(0)
      ShowFactionTroops(false)
    }

    if(e.target.value !== "")
    {
      setCanDeploy(true)
    }
    else
    {
      setCanDeploy(false)
    }
  }
  const GetPlayerOwnedFactions = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await getFactionsOwned(user.address.toLowerCase(), signatureInStorage);
        const playerFaction = data.data.data[0];
        setPlayerFaction(playerFaction)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const deployOrRecallTroops = async () => {

    if(troopsSource==2)
    {
      console.log("deploying troops from delegated troops")
      if(selectedQuantity>factionTroopsAvailable)
      {
        toast.error("You don't have enough troops to deploy")
        return;
      }
    }
    else if(troopsSource==1)
    {
      console.log("deploying troops from player troops")
      if(selectedQuantity> troopsAvailable+ factionTroopsAvailable)
      {
        toast.error("You don't have enough troops to deploy")
        return;
      }
    }
    // return;

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
          toast.success("You deployed "+ selectedQuantity+ " troops to on behalf of " + selectedFaction)
          // console.log("You deployed", selectedQuantity, "troops to", controlPoint, "on behalf of", selectedFaction)
        }
        else if(currentTab === tabs.recall)
        {
          // console.log("You recalled", selectedQuantity, "troops from", controlPoint, "on behalf of", dataForm.faction)

        }
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.error.metadata.message)
      }
    }
  }
  const GetPlayerTroops = async () => {
      let signatureInStorage = getAuthSignerInStorage()?.signature;
        if (!signatureInStorage) {
          const { signature } = await getSigner();
          signatureInStorage = signature;
        }
        if (signatureInStorage) {
          try {
            const troops = await getProfileTroops(user.address.toLowerCase(), signatureInStorage);
            setTroopsAvailable(troops)
            // console.log("troops", troops)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const ShowAvailableFactions = async () => {
      setFactionOption(allFactions.map((faction, index) => (
        <option value={faction.name} key={index}>{faction.name}</option>
      )))
  }

  useEffect(() => {
    if(controlPoint.leaderBoard !== undefined) {
      setAllFactions(controlPoint.leaderBoard);
    }
  }, [controlPoint])

  useEffect(() => {
    ShowAvailableFactions();
  }, [allFactions])

  useEffect(() => {
    // GetFactionTroops();
    GetPlayerTroops();
  }, [selectedFaction])

  useEffect(() => {
    GetPlayerOwnedFactions();
  }, [])

  return (
    <Flex flexDirection='column' textAlign='center'justifyContent='space-around'>
      
      <div className="taps-buttons-group" >
        {/* <button type="button" className={`smallBtn ${currentTab === tabs.deploy ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.deploy)}>Deploy</button> */}
        {/* <button type="button" className={`smallBtn ${currentTab === tabs.recall ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.recall)}>Recall</button> */}
      </div>

      <Flex direction='row' justify='space-between' justifyContent='center'>
        <Box mb={4} bg='#272523' p={2} rounded='md' w='90%' justifyContent='center' >

      <FormControl 
        mb={'24px'}
        bg='none'>
        <FormLabel>Faction:</FormLabel>
        <Select me={2} 
          bg='none'
          placeholder='Please select a faction'
          value={selectedFaction} 
          name="faction" 
          onChange={onChangeInputsFaction}>
          {factionOption}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Troops To Deploy:</FormLabel>
        <NumberInput defaultValue={1} min={1} max={troopsAvailable+factionTroopsAvailable} name="quantity" 
          onChange={handleChange}
          value={selectedQuantity} type ='number'>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
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
            Troops available in wallet: {troopsAvailable+factionTroopsAvailable}
            <br /> {showFactionTroops ? (<>
            <Text>Troops delegated to faction: {factionTroopsAvailable}</Text>
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
            ) : (<p></p>)}
          </Text>)}

          {currentTab === tabs.recall && (<p> Troops deployed to {controlPoint.name} on behalf of {dataForm.faction}: {troopsDeployed}</p>)}

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
          disabled={!canDeploy}
          >
          {selectedFaction=== "" ? "Please select a faction" : "Deploy" }
        </RdButton>
      </Center>
    </Box>
  </Flex>

    </Flex>
  )
}

export default DeployTap;