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
import { eslint } from "next.config";

const tabs = {
  recall: 'recall',
  deploy: 'deploy',
};

const DeployTap = ({controlPoint=[]}) => {

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

  const onChangeInputsFaction = (e) => {
    console.log(e.target.value)
    setSelectedFaction(e.target.value)
    // troopsDeployed = controlPoint.leaderBoard.filter(faction => faction.name === e.target.value)[0].totalTroops;

    //NEED TO ADD A NEW API CALL HERE TO DETERMINE HOW MANY TROOPS THE FACTION HAS AVAILABLE
    // troopsAvailable = controlPoint.leaderBoard.filter(faction => faction.name === e.target.value)[0].totalTroops;
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
          var data = await deployTroops(user.address.toLowerCase(), signatureInStorage, selectedQuantity, controlPoint.id, factionId)
          GetPlayerTroops();
          setSelectedQuantity(0);
          // console.log("You deployed", selectedQuantity, "troops to", controlPoint, "on behalf of", selectedFaction)
        }
        else if(currentTab === tabs.recall)
        {
          // console.log("You recalled", selectedQuantity, "troops from", controlPoint, "on behalf of", dataForm.faction)

        }
        // console.log('playerFactions', playerFactions);
      } catch (error) {
        console.log(error)
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
      <option value={faction.name} key={index}>{faction.name}</option>)))
      // onChangeInputsFaction();
      if(playerFactions.length > 0)
        setSelectedFaction(playerFactions[0].name)
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

  return (
    <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around' padding='16px'>
      
      <div className="taps-buttons-group" >
        <button type="button" className={`smallBtn ${currentTab === tabs.deploy ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.deploy)}>Deploy</button>
        <button type="button" className={`smallBtn ${currentTab === tabs.recall ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.recall)}>Recall</button>
      </div>

      <FormControl mb={'24px'}>
        <FormLabel>Please select a faction:</FormLabel>
        <Select me={2} value={selectedFaction} name="faction" onChange={onChangeInputsFaction}>
          {factionOption}
        </Select>
      </FormControl>

      <Box m='8px 24px'>
        {currentTab === tabs.deploy && (<p>
          Troops available to Deploy: {troopsAvailable}
        </p>)}
        {currentTab === tabs.recall && (<p>
          Troops deployed to {controlPoint.name} on behalf of {dataForm.faction}: {troopsDeployed}
        </p>)}
      </Box>

      <FormControl>
        <FormLabel>Quantity:</FormLabel>
        <NumberInput defaultValue={0} min={0} max={troopsAvailable} name="quantity" 
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
          // onClick={processCreateListingRequest}
          onClick={deployOrRecallTroops}
          // isLoading={executingCreateListing}
          // disabled={executingCreateListing}
          className="flex-fill">
          Apply
        </Button>
      </Flex>

    </Flex>
  )
}

export default DeployTap;