import { useState, useRef, useEffect, Component} from "react";
import { useSelector } from "react-redux";
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
import { createFaction } from "@src/core/api/RyoshiDynastiesAPICalls";

const ClanRegistrationForm = ({ isOpen, onClose, clans=[]}) => {
 
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const CreateClan = async () => {
    const factionResponse = await createFaction(user.walletAddress);
    if(factionResponse.status !== 200){
      console.log("Error creating faction");
      return;
    }
    console.log("You created a clan");
    clans.push({clanType: "collection", rank: 1, faction: "yourWalletAddress", troops: 0, owned:true, addresses: [], registered: false})
    onClose();
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
                onClick={CreateClan} variant='outline'size='lg'> 
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

export default ClanRegistrationForm;