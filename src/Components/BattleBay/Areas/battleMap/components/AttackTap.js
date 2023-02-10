import { Box, Flex, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import Button from "@src/Components/components/Button";

const AttackTap = ({ factions = [] }) => {

  return (
    <Flex flexDirection='column' textAlign='center' border={'1px solid white'} borderRadius={'10px'} justifyContent='space-around' padding='16px'>
      <Box m='8px 24px 34px'>
        <p>
          If you are a faction owner, you will be able to attack other troops in the region with troops you have deployed
        </p>
      </Box>
      <Flex gap='16px'>
        <Box>
          <p>Attackers</p>
          <FormControl mb={'24px'}>
            <FormLabel>Attacker Faction:</FormLabel>
            <Select me={2} value={factions[0] ?? null}>
              {factions.map((faction) => (<option value={faction}>{faction}</option>))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Quantity:</FormLabel>
            <Input type='number' />
          </FormControl>
        </Box>

        <Box>
          <p>Defenders</p>
          <FormControl mb={'24px'}>
            <FormLabel>Select A Faction to attack:</FormLabel>
            <Select me={2} value={factions[0] ?? null}>
              {factions.map((faction) => (<option value={faction}>{faction}</option>))}
            </Select>
          </FormControl>
        </Box>
      </Flex>


      <div style={{ display: 'flex', marginTop: '16px' }}>
        <Button type="legacy"
          // onClick={processCreateListingRequest}
          // isLoading={executingCreateListing}
          // disabled={executingCreateListing}
          className="flex-fill">
          Apply
        </Button>
      </div>


    </Flex>
  )
}

export default AttackTap;