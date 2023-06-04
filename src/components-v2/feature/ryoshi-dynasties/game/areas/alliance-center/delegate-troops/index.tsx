import {ChangeEvent, useEffect, useState} from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Flex,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react"
import {getAuthSignerInStorage} from '@src/helpers/storage';
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {delegateTroops} from "@src/core/api/RyoshiDynastiesAPICalls";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {useAppSelector} from "@src/Store/hooks";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {RdModalBody, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";

interface DelegateTroopsFormProps {
  isOpen: boolean;
  onClose: () => void;
  delegateMode: 'delegate';
  factions: any[];
  troops: number;
  setTotalTroops: (troops: number) => void;
}

const DelegateTroopsForm = ({ isOpen, onClose, delegateMode, factions=[], troops, setTotalTroops}: DelegateTroopsFormProps) => {
  
  const [dataForm, setDataForm] = useState({
    faction: factions[0]
  })
  const [factionId, setFactionId] = useState(0)
  //alerts
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  
  const [troopsToDelegate, setTroopsToDelegate] = useState(0)
  const handleChange = (valueAsString: string, valusAsNumber: number) => setTroopsToDelegate(valusAsNumber)

  //other
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const [_, getSigner] = useCreateSigner();

  const changeFactionDropdown = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.name, e.target.value)
    setDataForm({...dataForm, [e.target.name]: e.target.value})
    //get factions with the name of the selected faction
    const faction = factions.filter(faction => faction.name === e.target.value)
    setFactionId(faction[0].id)
    // console.log(faction[0].id)
  }
  
  const handleDelegateTroops = async () => {
    if (!user.address) return;

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const res = await delegateTroops(user.address.toLowerCase(), signatureInStorage, troopsToDelegate, factionId);
        setTotalTroops(troops - troopsToDelegate)
        // console.log(res)
        setShowAlert(false)
        onClose();
      } catch (error) {
        console.log(error)
        setAlertMessage("There was an issue delegating troops. Please try again later.")
        setShowAlert(true)
      }
    }
  }

  const handleRecallTroops = () => {
    // //
    // //set up an api call here to process the request at the end of the week
    // //
    // //check if player already has a delegation to this faction
    // const delegationExists = player[0].delegations.filter(delegation => delegation.faction === dataForm.faction).length > 0
    // if(delegationExists)
    // {
    //   //if so, update the existing delegation
    //   const delegationIndex = player[0].delegations.findIndex(delegation => delegation.faction === dataForm.faction)
    //   player[0].delegations[delegationIndex].troops -= parseInt(troopsToDelegate);
    // }
    // else
    // {
    //   //add a new delegation to the player.delegations array
    //   player[0].delegations.push({faction: dataForm.faction, troops: troopsToDelegate})
    // }
    // onClose();
  }

  useEffect(() => {
    if(factions.length > 0)
    {
      setDataForm({...dataForm, faction: factions[0].name})
      setFactionId(factions[0].id)
    }
  }, [factions])
  // console.log(factions)

  return (
    <RdModal
      onClose={onClose}
      isOpen={isOpen}
      title='Delegate Troops'
      size='lg'
    >
      <RdModalBody>
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
          <NumberInput
            defaultValue={0}
            min={0}
            max={troops}
            name="quantity"
            onChange={handleChange}
            value={troopsToDelegate}
          >
          <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Flex mt='16px'>
        <p>{delegateMode==='delegate' ? 'Once delegated, troops may be recalled but will not be unallocated until the end of the game.'
           : 'Recalling troops will return them to you at the end of the game.'} </p>
        </Flex>
        <Flex mt='16px' justifyContent='center'>
        <Box
          ps='20px'>
        </Box>
        </Flex>
        <Flex>
          {showAlert && (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle>{alertMessage}</AlertTitle>
            </Alert>
          )}
        </Flex>
      </RdModalBody>
      <RdModalFooter>
        <Center>
          <RdButton
            w='250px'
            fontSize={{base: 'lg', sm: 'xl'}}
            stickyIcon={true}
            onClick={delegateMode==='delegate' ? handleDelegateTroops : handleRecallTroops}>
            {delegateMode==='delegate' ? 'Delegate' : 'Recall'}
          </RdButton>
        </Center>
      </RdModalFooter>
    </RdModal>
  )
}

export default DelegateTroopsForm;