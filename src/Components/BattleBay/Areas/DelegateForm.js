import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, 
  FormControl,
  FormLabel,
  Select,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} 
from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";
import Button from "@src/Components/components/Button";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import { useCreateSigner } from '@src/Components/Account/Settings/hooks/useCreateSigner'
import { delegateTroops } from "@src/core/api/RyoshiDynastiesAPICalls";

const DelegateForm = ({ isOpen, onClose, delegateMode, factions=[], troops}) => {

  
  const [dataForm, setDataForm] = useState({
    faction: factions[0]
  })
  const [factionId, setFactionId] = useState(0)

  // const troopsNotDelegated = player[0].troops - player[0].delegations.reduce((a, b) => a + b.troops, 0);
  // const troopsDelegatedToSlectedFaction = player[0].delegations.filter(delegation => delegation.faction === dataForm.faction).length > 0 
    // ? player[0].delegations.filter(delegation => delegation.faction === dataForm.faction)[0].troops : 0
  // const maxTroops = delegateMode==='delegate' ? troopsNotDelegated : troopsDelegatedToSlectedFaction

  
  const [troopsToDelegate, setTroopsToDelegate] = useState(0)
  const handleChange = (value) => setTroopsToDelegate(value)

  //other
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const changeFactionDropdown = (e) => {
    console.log(e.target.name, e.target.value)
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    //get factions with the name of the selected faction
    const faction = factions.filter(faction => faction.name === e.target.value)
    setFactionId(faction[0].id)
    // console.log(faction[0].id)
  }
  
  const DelegateTroops = async () => {
    //check if player already has a delegation to this faction
    // const delegationExists = player[0].delegations.filter(delegation => delegation.faction === dataForm.faction).length > 0
    // if(delegationExists)
    // {
    //   //if so, update the existing delegation
    //   const delegationIndex = player[0].delegations.findIndex(delegation => delegation.faction === dataForm.faction)
    //   player[0].delegations[delegationIndex].troops += parseInt(troopsDelegated);
    // }
    // else
    // {
    //   //add a new delegation to the player.delegations array
    //   player[0].delegations.push({faction: dataForm.faction, troops: troopsDelegated})
    // }
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const res = await delegateTroops(user.address.toLowerCase(), signatureInStorage, troopsToDelegate, factionId);
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
    onClose();
  }
  const RecallTroops = () => {
    //
    //set up an api call here to process the request at the end of the week
    //
    //check if player already has a delegation to this faction
    const delegationExists = player[0].delegations.filter(delegation => delegation.faction === dataForm.faction).length > 0
    if(delegationExists)
    {
      //if so, update the existing delegation
      const delegationIndex = player[0].delegations.findIndex(delegation => delegation.faction === dataForm.faction)
      player[0].delegations[delegationIndex].troops -= parseInt(troopsToDelegate);
    }
    else
    {
      //add a new delegation to the player.delegations array
      player[0].delegations.push({faction: dataForm.faction, troops: troopsToDelegate})
    }
    onClose();
  }
  // console.log(factions)

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
            <ModalHeader className="text-center"> {delegateMode==='delegate' ? 'Delegate' : 'Recall'} Troops</ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>

            <FormControl mb={'24px'}>
              <FormLabel>Please select a faction to {delegateMode==='delegate' ? 'delegate troops to' 
                : 'recall troops from'}</FormLabel>
              <Select me={2} value={dataForm.faction} name="faction" onChange={changeFactionDropdown}>
                {factions.map((faction, index) => 
                  (<option value={faction.name} key={index}>{faction.name}</option>))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Quantity: (Max {troops})</FormLabel>
              <NumberInput defaultValue={0} min={0} max={troops} name="quantity" 
                onChange={handleChange}
                value={troopsToDelegate} type ='number'>
              <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <Flex mt='16px'>
            <p>{delegateMode==='delegate' ? 'Once delegated, troops may be recalled but will not be unallocated until the end of the week'
               : 'Recalling troops will return them to you at the end of the week'} </p>
            </Flex>
            <Flex mt='16px'>
              <Button type="legacy"
                // onClick={processCreateListingRequest}
                onClick={delegateMode==='delegate' ? DelegateTroops : RecallTroops}
                // isLoading={executingCreateListing}
                // disabled={executingCreateListing}
                className="flex-fill">
                {delegateMode==='delegate' ? 'Delegate' : 'Recall'} 
              </Button>
            </Flex>


            </ModalBody>
            <ModalFooter className="border-0">

            </ModalFooter>
          </>
        ) : (
          <Spinner animation="border" role="status" size="sm" className="ms-1">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </ModalContent>
    </Modal>
  )
}

export default DelegateForm;