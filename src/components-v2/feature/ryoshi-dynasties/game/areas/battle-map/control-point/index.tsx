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

import {AttackTap} from "@src/Components/BattleBay/Areas/battleMap/components";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {useAppSelector} from "@src/Store/hooks";
import DeployTab from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/deploy";
import InfoTab from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/info";
import HelpTab from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/help";

const tabs = {
  info: 'info',
  deploy: 'deploy',
  attack: 'attack',
  help: 'help'
};

interface ControlPointFormProps {
  isOpen: boolean;
  onClose: () => void;
  controlPoint: any;
  refreshControlPoint: () => void;
  skirmishPrice: number;
  conquestPrice: number;
}

const ControlPointModal = ({ isOpen, onClose, controlPoint, refreshControlPoint, skirmishPrice, conquestPrice}: ControlPointFormProps) => {
  // console.log("factionForm controlPoint: " + controlPoint.name);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [info, setInfo] = useState([]);
  const [rewardID, setRewardID] = useState(0);
  const user = useAppSelector((state) => state.user);

  const [currentTab, setCurrentTab] = useState(tabs.info);

  const handleClose = useCallback(() => {
    setCurrentTab(tabs.info);
    onClose();
  }, []);

  useEffect(() => {
    setTitle(controlPoint.name);
    setIsLoading(false);
  }, [controlPoint]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
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
                  fontSize={{base: '12', sm: '14'}}
                  padding={{base: '0 10px', sm: '0 20px'}}
                  margin={{base: '0 5px', sm: '0 10px'}}
                >
                  Leaderboard
                </RdTabButton>
                <RdTabButton
                  isActive={currentTab === tabs.deploy}
                  onClick={() => setCurrentTab(tabs.deploy)}
                  fontSize={{base: '12', sm: '14'}}
                  padding={{base: '0 10px', sm: '0 20px'}}
                  margin={{base: '0 5px', sm: '0 10px'}}
                >
                  Dispatch Troops
                </RdTabButton>
                <RdTabButton
                  isActive={currentTab === tabs.attack}
                  onClick={() => setCurrentTab(tabs.attack)}
                  fontSize={{base: '12', sm: '14'}}
                  padding={{base: '0 10px', sm: '0 20px'}}
                  margin={{base: '0 5px', sm: '0 10px'}}
                >
                  Attack
                </RdTabButton>
                </Flex>
              </Center>

              <div className="de_tab_content">
                {currentTab === tabs.info && (
                  <InfoTab controlPoint={controlPoint} refreshControlPoint={refreshControlPoint}/>
                )}
                {currentTab === tabs.deploy && (
                  <DeployTab controlPoint={controlPoint} refreshControlPoint={refreshControlPoint}/>
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
                  <HelpTab />
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

export default ControlPointModal;