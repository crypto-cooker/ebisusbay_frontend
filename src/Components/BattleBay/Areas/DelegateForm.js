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
  Input,
  Flex,
} 
from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";
import Button from "@src/Components/components/Button";

const DelegateForm = ({ isOpen, onClose, factions=[] }) => {

  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const [dataForm, setDataForm] = useState({
    faction: factions[0] ?? null,
    quantity: 0,
  })
  const onChangeInputs = (e) => {
    console.log(e.target.name, e.target.value)
    setDataForm({...dataForm, [e.target.name]: e.target.value})
  }
  const DelegateTroops = () => {
    console.log("You have delegated ", dataForm.quantity, " troops to ", dataForm.faction)
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
              <Input type='number' name="quantity" value={dataForm.quantity} onChange={onChangeInputs}/>
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