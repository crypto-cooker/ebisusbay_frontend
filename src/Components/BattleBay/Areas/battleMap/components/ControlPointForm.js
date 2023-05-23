import React, { useState, useEffect, useCallback } from "react";
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
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";

import {
  DeployTap,
  InfoTap,
  AttackTap
} from "."
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";

const tabs = {
  info: 'info',
  deploy: 'deploy',
  attack: 'attack',
};

const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })

const ControlPointForm = ({ isOpen, onClose, controlPoint=[], refreshControlPoint}) => {
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
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      isCentered={false}
    >
      {!isLoading ? (
        <>
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
        </>
        ) : (
          <Spinner animation="border" role="status" size="sm" className="ms-1">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
    </RdModal>
  )
}

export default ControlPointForm;