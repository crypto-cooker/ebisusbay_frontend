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
  Box
} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import localFont from "next/font/local";
import {CloseIcon} from "@chakra-ui/icons";

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
            <ModalHeader className="text-center">
              {title}
            </ModalHeader>
            <ModalBody>
              <div className="row mt-2 mt-sm-2">
                <div className="">
                  <div className="taps-buttons-group">
                    <button type="button" className={`smallBtn ${currentTab === tabs.info ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.info)}>Info</button>
                    <button type="button" className={`smallBtn ${currentTab === tabs.deploy ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.deploy)}>Deploy</button>
                    <button type="button" className={`smallBtn ${currentTab === tabs.attack ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.attack)}>Attack</button>
                  </div>

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