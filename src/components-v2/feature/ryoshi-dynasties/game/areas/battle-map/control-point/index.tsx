import React, {useCallback, useContext, useEffect, useState} from "react";
import {Box, Center, Flex, Text,} from "@chakra-ui/react"
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

interface ControlPointFormProps {
  isOpen: boolean;
  onClose: () => void;
  controlPoint: any;
  refreshControlPoint: () => void;
  skirmishPrice: number;
  conquestPrice: number;
  regionName: string;
  allFactions: any[]
}

const ControlPointModal = ({ isOpen, onClose, controlPoint, refreshControlPoint, skirmishPrice, conquestPrice, regionName, allFactions}: ControlPointFormProps) => {
  const { game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  // const [info, setInfo] = useState([]);
  // const [rewardID, setRewardID] = useState(0);
  const user = useAppSelector((state) => state.user);
  const [regionBonus, setRegionBonus] = useState(0);

  const [currentTab, setCurrentTab] = useState(tabs.info);
  const [battleEnabled, setBattleEnabled] = useState(false);
  const [page, setPage] = useState<string>();

  const handleClose = useCallback(() => {
    setCurrentTab(tabs.info);
    onClose();
  }, []);

  const getRegionScore = () => {
    // console.log("regionName: " + regionName);
    if(regionName === 'Kagutsuma'){
      setRegionBonus(3);
    }
    else if(regionName === 'Seashrine Isles'){
      setRegionBonus(5);
    }
    else if(regionName === 'The Palisades'){
      setRegionBonus(4);
    }
    else if(regionName === "Izanami's Cradle"){
      setRegionBonus(3);
    }
    else if(regionName === 'Jurojin Highlands'){
      setRegionBonus(7);
    }
    else if(regionName === "Kuraokami's Expanse"){
      setRegionBonus(5);
    }
    else if(regionName === 'Dunes of Bishamon'){
      setRegionBonus(2);
    }
  }

  const handleBack = () => {
    if (!!page) {
      setPage(undefined);
    } else {
      setPage('faq');
    }
  };

  useEffect(() => {
    setTitle(controlPoint.name + ' : ' + controlPoint.points+' points');
    getRegionScore();
    setIsLoading(false);
    setBattleEnabled(rdGameContext?.state === RdGameState.IN_PROGRESS);
  }, [controlPoint]);

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
          <Center>
            <Text
              as='i'
              marginBottom='2'
            > Region: {regionName}, Total Control Bonus: {regionBonus} </Text>
          </Center>

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
                        Leaders
                      </RdTabButton>
                      <RdTabButton
                        isActive={currentTab === tabs.deploy}
                        onClick={() => setCurrentTab(tabs.deploy)}
                        fontSize={{base: '12', sm: '14'}}
                        padding={{base: '0 10px', sm: '0 20px'}}
                        margin={{base: '0 5px', sm: '0 10px'}}
                      >
                        Dispatch
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

                  <Box mt={4}>
                    {currentTab === tabs.info && (
                      <InfoTab controlPoint={controlPoint} refreshControlPoint={refreshControlPoint}/>
                    )}
                    {currentTab === tabs.deploy && (
                      battleEnabled ? (
                        <DeployTab
                          controlPoint={controlPoint}
                          refreshControlPoint={refreshControlPoint}
                          allFactions={allFactions}
                        />) : (
                        <Box minH={'200px'}>
                          <Center>
                            <Text
                              margin='100'
                            > No game currently active </Text>
                          </Center>
                        </Box>
                      )
                    )}
                    {currentTab === tabs.attack && (
                      battleEnabled ? (
                        <AttackTab
                          // onClose={handleClose}
                          controlPoint={controlPoint}
                          refreshControlPoint={refreshControlPoint}
                          skirmishPrice={skirmishPrice}
                          conquestPrice={conquestPrice}
                          allFactions={allFactions}
                        />) : (
                        <Box minH={'200px'}>
                          <Center>
                            <Text
                              margin='100'
                            > No game currently active </Text>
                          </Center>
                        </Box>
                      )
                    )}
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

export default ControlPointModal;