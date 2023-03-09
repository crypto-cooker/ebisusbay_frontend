import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react"
import { getControlPoint } from "@src/core/api/RyoshiDynastiesAPICalls";
import { Spinner } from 'react-bootstrap';

import { getTheme } from "@src/Theme/theme";

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

const ControlPointForm = ({ isOpen, onClose, controlPoint=[], factions}) => {
  // console.log("factionForm controlPoint: " + controlPoint.name);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [info, setInfo] = useState([]);
  const [rewardID, setRewardID] = useState(0);
  const user = useSelector((state) => state.user);

  const [currentTab, setCurrentTab] = useState(tabs.info);

  useEffect(() => {
    setTitle(controlPoint.name);
    setIsLoading(false);
  }, [controlPoint]);

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
            <ModalHeader className="text-center">
              {title}
            </ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
              <div className="row mt-2 mt-sm-2">
                <div className="">
                  <div className="taps-buttons-group">
                    <button type="button" className={`smallBtn ${currentTab === tabs.info ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.info)}>Info</button>
                    <button type="button" className={`smallBtn ${currentTab === tabs.deploy ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.deploy)}>Deploy</button>
                    <button type="button" className={`smallBtn ${currentTab === tabs.attack ? 'selected' : ''}`} onClick={() => setCurrentTab(tabs.attack)}>Attack</button>
                  </div>

                  <div className="de_tab_content">
                    {currentTab === tabs.info && (
                      <InfoTap factions={factions} controlPoint={controlPoint}/>
                    )}
                    {currentTab === tabs.deploy && (
                      <DeployTap controlPoint={controlPoint}/>
                    )}
                    {currentTab === tabs.attack && (
                      <AttackTap controlPoint={controlPoint}/>
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