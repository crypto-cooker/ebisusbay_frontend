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
 } from "@chakra-ui/react";

import { useState, useEffect } from "react";
import Button from "@src/Components/components/Button";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {getProfileTroops, getFactionsOwned, deployTroops, recallTroops, getFactionTroops} from "@src/core/api/RyoshiDynastiesAPICalls";
import { toast } from "react-toastify";

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

  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedFaction, setSelectedFaction] = useState(dataForm.faction);
  const handleChange = (value) => setSelectedQuantity(value)
  const [playerFactions, setPlayerFactions] = useState([]);

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
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        if(currentTab === tabs.deploy)
        {
          var factionId = playerFactions.filter(faction => faction.name === selectedFaction)[0].id
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
        // console.log('playerFactions', playerFactions);
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
      setFactionOption(playerFactions.map((faction, index) => (
        // console.log(faction),
      <option value={faction.name} key={index}>{faction.name}</option>)))
      // onChangeInputsFaction();
      // if(playerFactions.length > 0)
      //   setSelectedFaction(playerFactions[0].name)
  }

  useEffect(() => {
    if(controlPoint.leaderBoard !== undefined)
    {
      setPlayerFactions(controlPoint.leaderBoard);
    }
  }, [controlPoint])

  useEffect(() => {
    ShowAvailableFactions();
  }, [playerFactions])

  useEffect(() => {
    // GetFactionTroops();
    GetPlayerTroops();
  }, [selectedFaction])

  useEffect(() => {
    GetPlayerOwnedFactions();
  }, [])

  return (
    <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around' padding='16px'>
      
      <div className="taps-buttons-group" >
        {/* <button type="button" className={`smallBtn ${currentTab === tabs.deploy ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.deploy)}>Deploy</button> */}
        {/* <button type="button" className={`smallBtn ${currentTab === tabs.recall ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.recall)}>Recall</button> */}
      </div>

      <FormControl 
        mb={'24px'}
        bg='none'>
        <Select me={2} 
          bg='none'
          placeholder='Please select a faction'
          value={selectedFaction} 
          name="faction" 
          onChange={onChangeInputsFaction}>
          {factionOption}
        </Select>
      </FormControl>

      <Box m='8px 24px'>
        {currentTab === tabs.deploy && (<p>
          Troops available in wallet: {troopsAvailable}
          <br /> {
            showFactionTroops ? (<p>Troops available in faction: {factionTroopsAvailable}</p>) : (<p></p>)
          }
        </p>)}
        {currentTab === tabs.recall && (<p>
          Troops deployed to {controlPoint.name} on behalf of {dataForm.faction}: {troopsDeployed}
        </p>)}
      </Box>

      <FormControl>
        <FormLabel>Quantity:</FormLabel>
        <NumberInput defaultValue={1} min={1} max={troopsAvailable} name="quantity" 
          onChange={handleChange}
          value={selectedQuantity} type ='number'>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <Flex mt='16px'>
        <Button type="legacy"
          onClick={deployOrRecallTroops}
          disabled={!canDeploy}
          className="flex-fill"> {
            selectedFaction=== "" ? "Please select a faction" : "Deploy"
          }
        </Button>
      </Flex>

    </Flex>
  )
}

export default DeployTap;