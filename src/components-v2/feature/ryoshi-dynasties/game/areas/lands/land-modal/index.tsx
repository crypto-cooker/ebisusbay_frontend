import React, {useCallback, useContext, useEffect, useState} from "react";
import {Box, Center, Flex, Text, VStack,Image, SimpleGrid} from "@chakra-ui/react"
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
import {appConfig} from "@src/Config";
import {ApiService} from "@src/core/services/api-service";
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
  // const { game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  // const [info, setInfo] = useState([]);
  // const [rewardID, setRewardID] = useState(0);
  // const user = useAppSelector((state) => state.user);

  const [currentTab, setCurrentTab] = useState(tabs.info);
  // const [battleEnabled, setBattleEnabled] = useState(false);
  const [page, setPage] = useState<string>();
  // const [nftData, setNftData] = useState<any>();
  const [nftImage, setNftImage] = useState<string>();

  const config = appConfig();
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

  
  const GetNftImages = async () => {
    const izCollection = config.collections.find((collection: any) => collection.slug === 'izanamis-cradle-land-deeds');
    console.log('===izLandDeeds', izCollection);
    setNftImage(izCollection.metadata.avatar)
  }
  const GoToNFTPage = () => {
    //redirect to page
    window.open('https://app.ebisusbay.com/collection/izanamis-cradle-land-deeds/'+plotId,'_blank');
  }

  useEffect(() => {

    GetNftImages();
  }, [])

  useEffect(() => {
    setTitle("Land Deed #" + plotId.toString());
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
          <SimpleGrid columns={2} padding='10'>
            <Image
              src={nftImage}
              alt='NFT Image'
              width='200'
              height='200'
              rounded={'md'}
              />
              <Flex justifyContent={'center'}>
                <VStack>
                <Text
                as='i'
                marginBottom='2'
                textAlign='center'
              > Token Id: {plotId.toString()} </Text>

                  <RdTabButton
                        isActive={currentTab === tabs.info}
                        onClick={() => GoToNFTPage()}
                        fontSize={{base: '12', sm: '14'}}
                        padding={{base: '0 10px', sm: '0 20px'}}
                        margin={{base: '0 5px', sm: '0 10px'}}
                      >
                        Make Offer
                      </RdTabButton>
                </VStack>
              </Flex>
           
          </SimpleGrid>

          {!isLoading ? (
            <>
              <div className="row mt-2 mt-sm-2">
                <div className="">
                  <Center>
                    <Flex direction='row' justify='center' mb={2}>
                     
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