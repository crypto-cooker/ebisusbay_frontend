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

const DelegateForm = ({ isOpen, onClose, factions=[], player =[] }) => {
  const troopsNotDelegated = player[0].troops - player[0].delegations.reduce((a, b) => a + b.troops, 0);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const [troopsDelegated, setTroopsDelegated] = useState(0)
  const handleChange = (value) => setTroopsDelegated(value)

  const [dataForm, setDataForm] = useState({
    faction: factions[0]
  })

  const onChangeInputs = (e) => {
    console.log(e.target.name, e.target.value)
    setDataForm({...dataForm, [e.target.name]: e.target.value})
  }
  const DelegateTroops = () => {
    console.log("You have delegated ", troopsDelegated, " troops to ", dataForm.faction)

    //check if player already has a delegation to this faction
    const delegationExists = player[0].delegations.filter(delegation => delegation.faction === dataForm.faction).length > 0
    if(delegationExists)
    {
      //if so, update the existing delegation
      const delegationIndex = player[0].delegations.findIndex(delegation => delegation.faction === dataForm.faction)
      player[0].delegations[delegationIndex].troops += parseInt(troopsDelegated);
    }
    else
    {
      //add a new delegation to the player.delegations array
      player[0].delegations.push({faction: dataForm.faction, troops: troopsDelegated})
    }
    console.log(player)
    onClose();
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
            <ModalHeader className="text-center"> Delegate Troops</ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>

            <FormControl mb={'24px'}>
              <FormLabel>Please select a faction to delegate troops to:</FormLabel>
              <Select me={2} value={dataForm.faction} name="faction" onChange={onChangeInputs}>
                {factions.map((faction, index) => (<option value={faction} key={index}>{faction}</option>))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Quantity:</FormLabel>
              <NumberInput defaultValue={1} min={1} max={troopsNotDelegated} name="quantity" 
                onChange={handleChange}
                value={troopsDelegated} type ='number'>
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
                onClick={DelegateTroops}
                // isLoading={executingCreateListing}
                // disabled={executingCreateListing}
                className="flex-fill">
                Delegate
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