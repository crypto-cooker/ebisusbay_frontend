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
  AttackTap,
  HelpTap
} from "."
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";

const tabs = {
  info: 'info',
  deploy: 'deploy',
  attack: 'attack',
  help: 'help'
};

const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })

const ControlPointForm = ({ isOpen, onClose, controlPoint=[], refreshControlPoint, skirmishPrice, conquestPrice}) => {
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
      utilBtnTitle={currentTab === tabs.help ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={() => setCurrentTab(currentTab === tabs.help ? tabs.attack : tabs.help)}
    >
      {!isLoading ? (
        <>
          <div className="row mt-2 mt-sm-2">
            <div className="">
              <Center>
                <Flex direction='row' justify='center' mb={2}>
                <RdTabButton
                  isActive={currentTab === tabs.info}
                  onClick={() => setCurrentTab(tabs.info)}
                >
                  Info
                </RdTabButton>
                <RdTabButton
                  isActive={currentTab === tabs.deploy}
                  onClick={() => setCurrentTab(tabs.deploy)}
                >
                  Deploy
                </RdTabButton>
                <RdTabButton
                  isActive={currentTab === tabs.attack}
                  onClick={() => setCurrentTab(tabs.attack)}
                >
                  Attack
                </RdTabButton>
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
                  <AttackTap 
                    // onClose={handleClose} 
                    controlPoint={controlPoint} 
                    refreshControlPoint={refreshControlPoint} 
                    skirmishPrice={skirmishPrice}
                    conquestPrice={conquestPrice}
                  />
                )}
                {currentTab === tabs.help && (
                  <HelpTap/>
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