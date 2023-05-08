import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Box,
  Flex,
  Spacer,
  Center

} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import localFont from "next/font/local";
import {CloseIcon} from "@chakra-ui/icons";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

import {
  DeployTap,
  InfoTap,
  AttackTap
} from "."

const tabs = {
  info: 'info',
  deploy: 'deploy',
  attack: 'attack',
};

const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })

const ControlPointForm = ({ isOpen, onClose, controlPoint=[], factions, refreshControlPoint}) => {
  // console.log("factionForm controlPoint: " + controlPoint.name);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [info, setInfo] = useState([]);
  const [rewardID, setRewardID] = useState(0);
  const user = useSelector((state) => state.user);

  const [currentTab, setCurrentTab] = useState(tabs.info);

  const handleClose = useCallback(() => {
    onClose();
    console.log("handleClose");
  }, []);

  useEffect(() => {
    setTitle(controlPoint.name);
    setIsLoading(false);
  }, [controlPoint]);

  return (
    <Modal 
      onClose={onClose}
      isOpen={isOpen}
      size='2xl'
      scrollBehavior='inside'
      isCentered
      padding='2'
      >
      <ModalOverlay />
      <ModalContent
        borderWidth='1px'
        borderStyle='solid'
        borderLeftColor='#45433C'
        borderRightColor='#684918'
        borderTopColor='#625C4D'
        borderBottomColor='#181514'
        rounded='3xl'
        bg='linear-gradient(#1C1917, #272624, #000000)'
        className={gothamBook.className}
        >
        {!isLoading ? (
          <>
            {/* <ModalHeader className="text-center">
              {title}
            </ModalHeader> */}
            <ModalBody>
            <Box
      position='absolute'
      left={2}
      top={2}
      rounded='full'
      zIndex={1}
      _groupHover={{
        cursor: 'pointer'
      }}
      data-group
    >
      <Button
        bg='#C17109'
        rounded='full'
        border='8px solid #F48F0C'
        w={14}
        h={14}
        fontSize='28px'
        onClick={onClose}
          _groupHover={{
          bg: '#de8b08',
          borderColor: '#f9a50b',
        }}
      >
        <CloseIcon />
      </Button>
    </Box>
            <Box
        bg='#564D4A'
        h='full'
        m={6}
        roundedBottom='3xl'
        className='rd-bank-modal-mask1'
      >
        <Box
          color='#FFF'
          textAlign='center'
          verticalAlign='middle'
          className='rd-bank-modal-mask2'
          p={1}
        >
          <Flex
            bg='#272523'
            h='55px'
            px={12}
            fontSize={{base: 'lg', sm: '2xl', md: '3xl'}}
            my='auto'
            justify='center'
            direction='column'
          >
            <>{title}</>
          </Flex>
        </Box>
              <div className="row mt-2 mt-sm-2">
                <div className="">

                <Center>
                <Flex justifyContent='space-between' w='90%' >
                  <RdButton
                    w='150px'
                    fontSize={{base: 'xl', sm: '2xl'}}
                    stickyIcon={false}
                    hideIcon={true}
                    onClick={() => setCurrentTab(tabs.info)}
                    marginTop='2'
                    marginBottom='2'
                    >Info 
                  </RdButton>
                  <RdButton
                    w='150px'
                    fontSize={{base: 'xl', sm: '2xl'}}
                    stickyIcon={false}
                    hideIcon={true}
                    onClick={() => setCurrentTab(tabs.deploy)}
                    marginTop='2'
                    marginBottom='2'
                    >Deploy 
                  </RdButton>
                  <RdButton
                    w='150px'
                    fontSize={{base: 'xl', sm: '2xl'}}
                    stickyIcon={false}
                    hideIcon={true}
                    onClick={() => setCurrentTab(tabs.attack)}
                    marginTop='2'
                    marginBottom='2'
                    >Attack 
                  </RdButton>
                  </Flex>
                </Center>

    
                  <div className="de_tab_content">
                    {currentTab === tabs.info && (
                      <InfoTap onClose={handleClose} controlPoint={controlPoint} refreshControlPoint={refreshControlPoint}/>
                    )}
                    {currentTab === tabs.deploy && (
                      <DeployTap onClose={handleClose} controlPoint={controlPoint} refreshControlPoint={refreshControlPoint}/>
                    )}
                    {currentTab === tabs.attack && (
                      <AttackTap onClose={handleClose} controlPoint={controlPoint} refreshControlPoint={refreshControlPoint}/>
                    )}
                  </div>
                </div>
              </div>
              </Box>
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

export default ControlPointForm;