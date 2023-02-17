import { useState, useRef, useEffect } from "react";
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
import { add } from "lodash";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";

const ClanRegistrationForm = ({ isOpen, onClose, clans=[]}) => {
 
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const CreateClan = () => {
    //add payment code here
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
                <p>In order to participate in battle and be considered for listing rewards an NFT 
                  collection MUST register as a faction each season</p>
                <p>There is a one time creation fee of 20 $Mitama to create a faction</p>
                <p>Each season a faction must pay 1000 $Fortune to participate in battle</p>
                  </Box>
              </Flex>
              <Flex alignContent={'center'} justifyContent={'center'}>
                
                <Box p='3'>
              <Button style={{ display: 'flex', marginTop: '16px' }} 
                onClick={CreateClan} variant='outline'size='lg'> 
                Create Clan <br/> Cost: 20 Mitama </Button>
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