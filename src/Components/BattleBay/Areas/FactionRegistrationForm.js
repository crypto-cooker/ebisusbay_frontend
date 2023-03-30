import { useState, useRef, useEffect, Component} from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Flex,
  Spacer,
  Box,
} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import { getTheme } from "@src/Theme/theme";
import { createFaction, getFactionsOwned, getProfileId } from "@src/core/api/RyoshiDynastiesAPICalls";

import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

const FactionRegistrationForm = ({ isOpen, onClose, handleClose}) => {
 
  // const [isLoading, setIsLoading] = useState(false);
  const [isLoading, getSigner] = useCreateSigner();
  const user = useSelector((state) => state.user);

  const CreateFaction = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const res = await getProfileId(user.address.toLowerCase(), signatureInStorage);
        // console.log(res);
        console.log("Creating a faction");
        const factions = await getFactionsOwned(user.address.toLowerCase(), signatureInStorage);
        var factionName = res.data.data[0].profileId +"_" + (factions.data.data.length+20);
        
        const data = await createFaction(user.address.toLowerCase(),
          signatureInStorage, "WALLET", factionName, []);
        // console.log(data);
        console.log("You created a faction");
      handleClose();
      onClose();

      } catch (error) {
        console.log(error)
      }
    }
    
  }
 
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
          <ModalHeader className="text-center">Register a Clan</ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
              <Flex alignContent={'center'} justifyContent={'center'}>
                <Box p='3'>
                  <p>
                    In order to participate in battle and be considered for listing rewards an NFT 
                    collection MUST register as a faction each season
                    <br/> <br/>You must have 20 $Mitama in your wallet to create a faction 
                    <br/> <br/>Each season a faction must pay 1000 $Fortune to participate in battle
                  </p>
                </Box>
              </Flex>
              <Flex alignContent={'center'} justifyContent={'center'}>
                
                <Box p='3'>
              <Button style={{ display: 'flex', marginTop: '16px' }} 
                onClick={CreateFaction} variant='outline'size='lg'> 
                Create new Faction </Button>
                </Box>
              </Flex>
            </ModalBody>
            <ModalFooter className="border-0"/>
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

export default FactionRegistrationForm;