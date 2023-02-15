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

import { useState } from "react";
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

const DeployTap = ({ factions = [], regionName}) => {

  const playerFactions = factions.filter(faction => faction.owned)
  const arrayColumn = (arr, n) => arr.map(x => x[n]);
  const playerFactionNames = arrayColumn(playerFactions, 'faction')
  const troopsAvailable = 0;
  const [currentTab, setCurrentTab] = useState(tabs.deploy);
  const [dataForm, setDataForm] = useState({
    faction: playerFactions[0] ?? null,
    quantity: 0,
  })

  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedFaction, setSelectedFaction] = useState(dataForm.faction);

  const onChangeInputsFaction = (e) => {
    console.log(e.target.name, e.target.value)
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    setSelectedFaction(e.target.value)
    troopsAvailable = factions.filter(faction => faction.faction === e.target.value)[0].troops
  }
  // const onChangeInputsQuantity = (e) => {
  //   console.log(e.target.name, e.target.value)
  //   setDataForm({...dataForm, [e.target.name]: e.target.value})
  //   setSelectedQuantity(e.target.value)
  // }
  const handleChange = (value) => setSelectedQuantity(value)

  const deployOrRecallTroops = () => {
    if(currentTab === tabs.deploy)
    {
      console.log("You deployed", selectedQuantity, "troops to", regionName, "on behalf of", dataForm.faction)
    }
    else if(currentTab === tabs.recall)
    {
      console.log("You recalled", selectedQuantity, "troops from", regionName, "on behalf of", dataForm.faction)
    }
  }

  return (
    <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around' padding='16px'>
      <div className="taps-buttons-group" >
        <button type="button" className={`smallBtn ${currentTab === tabs.deploy ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.deploy)}>Deploy</button>
        <button type="button" className={`smallBtn ${currentTab === tabs.recall ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.recall)}>Recall</button>
      </div>
      <Box m='8px 24px'>
        {currentTab === tabs.deploy && (<p>
          Troops available to Deploy: {troopsAvailable.length}
        </p>)}
        {currentTab === tabs.recall && (<p>Troops deployed to {regionName} 
          {/* Troops deployed to {regionName} on behalf of {selectedFaction} */}
        </p>)}
      </Box>
      <FormControl mb={'24px'}>
        <FormLabel>Please select a faction:</FormLabel>
        <Select me={2} value={dataForm.faction} name="faction" onChange={onChangeInputsFaction}>
          {playerFactionNames.map((faction, index) => (<option value={faction} key={index}>{faction}</option>))}
        </Select>
      </FormControl>

      {/* <FormControl>
        <FormLabel>Quantity:</FormLabel>
        <Input type='number' name="quantity" value={dataForm.quantity} onChange={onChangeInputsQuantity}/>
      </FormControl> */}

      <FormControl>
            <FormLabel>Quantity:</FormLabel>
            <NumberInput defaultValue={1} min={1} max={100} name="quantity" 
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