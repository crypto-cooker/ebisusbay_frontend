import React, {useCallback, useContext, useEffect, useState} from "react";
import {Box, Center, Flex, Text, VStack,} from "@chakra-ui/react"
import {Spinner} from 'react-bootstrap';
import {ArrowBackIcon} from "@chakra-ui/icons";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {useAppSelector} from "@src/Store/hooks";
import {RdGameState} from "@src/core/services/api-service/types";

import DeployTab from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/deploy";
import InfoTab from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/info";
import AttackTab from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/attack";
import HelpPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/help";

import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";

const tabs = {
  info: 'info',
  deploy: 'deploy',
  attack: 'attack'
};

interface LandModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  plotId: number;
}

const LandModal = ({ isOpen, onClose, plotId}: LandModalFormProps) => {
  const { game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  // const [info, setInfo] = useState([]);
  // const [rewardID, setRewardID] = useState(0);
  const user = useAppSelector((state) => state.user);

  const [currentTab, setCurrentTab] = useState(tabs.info);
  const [battleEnabled, setBattleEnabled] = useState(false);
  const [page, setPage] = useState<string>();

  const handleClose = useCallback(() => {
    setCurrentTab(tabs.info);
    onClose();
  }, []);

  const handleBack = () => {
    if (!!page) {
      setPage(undefined);
    } else {
      setPage('faq');
    }
  };

  useEffect(() => {
    setTitle(plotId.toString());
    setIsLoading(false);
  }, [plotId]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <HelpPage />
      ) : (
        <>
          <VStack>
            <Text
              as='i'
              marginBottom='2'
            > You are loading the land at {plotId.toString()} </Text>
            <Text
              as='i'
              marginBottom='2'
            > Owner: ' ' </Text>
          </VStack>

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
                        Action
                      </RdTabButton>
                    </Flex>
                  </Center>

                  <Box mt={4}>
                    {currentTab === tabs.info && (<></>
                      // <InfoTab controlPoint={controlPoint} refreshControlPoint={refreshControlPoint}/>
                    )}
                    {currentTab === tabs.deploy }
                    {currentTab === tabs.attack }
                  </Box>
                </div>
              </div>
            </>
          ) : (
            <Spinner animation="border" role="status" size="sm" className="ms-1">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
        </>
      )}
    </RdModal>
  )
}

export default LandModal;