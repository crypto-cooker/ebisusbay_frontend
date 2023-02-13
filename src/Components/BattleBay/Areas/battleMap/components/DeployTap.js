import { Box, Flex, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
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

const DeployTap = ({ factions = [] }) => {

  const [currentTab, setCurrentTab] = useState(tabs.deploy);
  const [dataForm, setDataForm] = useState({
    faction: factions[0] ?? null,
    quantity: 0,
  })

  const onChangeInputs = (e) => {
    console.log(e.target.name, e.target.value)
    setDataForm({...dataForm, [e.target.name]: e.target.value})
  }

  return (
    <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around' padding='16px'>
      <div className="taps-buttons-group" >
        <button type="button" className={`smallBtn ${currentTab === tabs.deploy ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.deploy)}>Deploy</button>
        <button type="button" className={`smallBtn ${currentTab === tabs.recall ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.recall)}>Recall</button>
      </div>
      <Box m='8px 24px'>
        {currentTab === tabs.deploy && (<p>
          Troops available to Deploy: 20
        </p>)}
        {currentTab === tabs.recall && (<p>
          Troops deployed to Dragonland on behalf of connected wallet: 0
        </p>)}
      </Box>
      <FormControl mb={'24px'}>
        <FormLabel>Please select a faction:</FormLabel>
        <Select me={2} value={dataForm.faction} name="faction" onChange={onChangeInputs}>
          {factions.map((faction, index) => (<option value={faction} key={index}>{faction}</option>))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Quantity:</FormLabel>
        <Input type='number' name="quantity" value={dataForm.quantity} onChange={onChangeInputs}/>
      </FormControl>

      <Flex mt='16px'>
        <Button type="legacy"
          // onClick={processCreateListingRequest}
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