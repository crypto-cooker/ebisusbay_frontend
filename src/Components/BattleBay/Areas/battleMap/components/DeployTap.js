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

const tabs = {
  recall: 'recall',
  deploy: 'deploy',
};

const actions = {
  listing: 'listing',
  bundle: 'bundle',
  transfer: 'transfer'
};

const DeployTap = ({controlPoint=[]}) => {
  // const playerFactions = factions.filter(faction => faction.owned)
  // const arrayColumn = (arr, n) => arr.map(x => x[n]);
  // const playerFactionNames = arrayColumn(playerFactions, 'faction')
  const troopsDeployed = 0;
  const troopsAvailable = 0;
  const [currentTab, setCurrentTab] = useState(tabs.deploy);
  const [factionOption, setFactionOption] = useState([]);
  const [dataForm, setDataForm] = useState({
    faction: "" ?? null,
    quantity: 0,
  })
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedFaction, setSelectedFaction] = useState(dataForm.faction);
  const handleChange = (value) => setSelectedQuantity(value)

  const getMax = () => { 
    if(currentTab === tabs.deploy)
      {return troopsDeployed} 
    else if(currentTab === tabs.recall) 
      {return troopsAvailable}
  }
  const onChangeInputsFaction = (e) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    setSelectedFaction(e.target.value)
    troopsDeployed = controlPoint.leaderBoard.filter(faction => faction.name === e.target.value)[0].totalTroops;

    //NEED TO ADD A NEW API CALL HERE TO DETERMINE HOW MANY TROOPS THE FACTION HAS AVAILABLE
    troopsAvailable = controlPoint.leaderBoard.filter(faction => faction.name === e.target.value)[0].totalTroops;
  }
  const deployOrRecallTroops = () => {
    if(currentTab === tabs.deploy)
    {
      console.log("You deployed", selectedQuantity, "troops to", controlPoint, "on behalf of", dataForm.faction)
    }
    else if(currentTab === tabs.recall)
    {
      console.log("You recalled", selectedQuantity, "troops from", controlPoint, "on behalf of", dataForm.faction)
    }
  }

  useEffect(() => {
    if(controlPoint.leaderBoard !== undefined)
    {
      setFactionOption(controlPoint.leaderBoard.map((faction, index) => (
      <option value={faction.name} key={index}>{faction.name}</option>)))
    }
    
    }, [controlPoint])

  return (
    <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around' padding='16px'>
      
      <div className="taps-buttons-group" >
        <button type="button" className={`smallBtn ${currentTab === tabs.deploy ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.deploy)}>Deploy</button>
        <button type="button" className={`smallBtn ${currentTab === tabs.recall ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.recall)}>Recall</button>
      </div>

      <FormControl mb={'24px'}>
        <FormLabel>Please select a faction:</FormLabel>
        <Select me={2} value={dataForm.faction} name="faction" onChange={onChangeInputsFaction}>
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
        <NumberInput defaultValue={1} min={1} max={getMax()} name="quantity" 
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