import { useState } from "react";
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
import { Spinner } from 'react-bootstrap';

import { getTheme } from "@src/Theme/theme";

import {
  DeployTap,
  InfoTap,
  AttackTap
} from "./"

const tabs = {
  info: 'info',
  deploy: 'deploy',
  attack: 'attack',
};

const FactionForm = ({ isOpen, onClose, title, factions}) => {

  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const [currentTab, setCurrentTab] = useState(tabs.info);

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
                      <InfoTap factions={factions}/>
                    )}
                    {currentTab === tabs.deploy && (
                      <DeployTap factions={factions} regionName={title}/>
                    )}
                    {currentTab === tabs.attack && (
                      <AttackTap factions={factions}/>
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

export default FactionForm;