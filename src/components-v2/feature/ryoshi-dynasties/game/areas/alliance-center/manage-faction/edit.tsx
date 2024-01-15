import React, {useContext, useState} from "react";
import {Flex, Icon, SimpleGrid} from "@chakra-ui/react"

//contracts
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";

import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {faShieldAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import EditInfo from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/manage-faction/edit-info";
import EditOfficers
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/manage-faction/edit-officers";
import {RdModalBody} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";


enum Tabs {
  INFO = 'info',
  OFFICERS = 'officers'
}

interface EditFactionProps {
  isOpen: boolean;
  onClose: () => void;
  faction: any;
  isRegistered: boolean;
}

const EditFaction = ({ isOpen, onClose, faction, isRegistered}: EditFactionProps) => {
  const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.INFO);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const handleClose = () => {
    setSelectedTab(Tabs.INFO);
    onClose();
  }

  const canEditFaction = () => {
    if(!rdContext.game) return false;
    const endDate = new Date(rdContext.game.game.endAt);
    const timeUntilEnd = endDate.getTime() - Date.now();
    const daysUntilEnd = timeUntilEnd / (1000 * 3600 * 24);
    return daysUntilEnd >= rdContext.config.factions.editableDays;
  }

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Edit Faction'
      titleIcon={<Icon as={FontAwesomeIcon} icon={faShieldAlt} />}
      isCentered={false}
    >
      {/*<AuthenticationRdButton>*/}
      {/*  <RdModalBody>*/}
      {/*    <RdModalBox>*/}
      {/*      <Cropper editsAllowed={canEditFaction()}/>*/}
      {/*    </RdModalBox>*/}
      {/*  </RdModalBody>*/}
      {/*</AuthenticationRdButton>*/}

      <Flex direction='row' justify='center' mt={2}>
        <SimpleGrid columns={2}>
          <RdTabButton isActive={selectedTab === Tabs.INFO} onClick={() => setSelectedTab(Tabs.INFO)}>
            Info
          </RdTabButton>
          <RdTabButton isActive={selectedTab === Tabs.OFFICERS} onClick={() => setSelectedTab(Tabs.OFFICERS)}>
            Officers
          </RdTabButton>
        </SimpleGrid>
      </Flex>

      <RdModalBody>
        {selectedTab === Tabs.INFO ? (
          <EditInfo
            faction={faction}
            canEdit={canEditFaction()}
            isRegistered={isRegistered}
            onComplete={handleClose}
          />
        ) : selectedTab === Tabs.OFFICERS && (
          <EditOfficers
            faction={faction}
          />
        )}
      </RdModalBody>
    </RdModal>
  )
}

export default EditFaction;
