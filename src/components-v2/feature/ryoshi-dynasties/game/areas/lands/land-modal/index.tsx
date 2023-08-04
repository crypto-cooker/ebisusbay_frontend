import React, {useCallback, useContext, useEffect, useState} from "react";
import {Box, Center, Flex, Text, VStack,Image, SimpleGrid, HStack, Spacer} from "@chakra-ui/react"
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

import {  useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import MetaMaskOnboarding from '@metamask/onboarding';
import { chainConnect, connectAccount } from '@src/GlobalState/User';
import {CollectionFilters} from "@src/Components/Models/collection-filters.model";
import { init, fetchListings } from '@src/GlobalState/collectionSlice';
import MakeOfferDialog from '@src/Components/Offer/Dialogs/MakeOfferDialog';

const tabs = {
  info: 'info',
  deploy: 'deploy',
  attack: 'attack'
};

interface LandModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  plotId: number;
  forSale: boolean;
  price: number;
  nft:any;
}

const LandModal = ({ isOpen, onClose, plotId, forSale, price, nft}: LandModalFormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');

  const [currentTab, setCurrentTab] = useState(tabs.info);
  const [page, setPage] = useState<string>();
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

  const dispatch = useDispatch();
  // const router = useRouter();
  const user = useAppSelector(state => state.user);
  // const user = useSelector((state) => state.user);
  // const items = useSelector((state) => state.collection.listings);
  // const listings = useSelector((state) => state.collection.listings.filter((item) => item.market.id));

  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);
  const [nftOffer, setNftOffer] = useState(null);

  // useEffect(() => {
  //   const filterOption = CollectionFilters.default();
  //   // filterOption.address = "0x1189C0A75e7965974cE7c5253eB18eC93F2DE4Ad";
  //   dispatch(init("0x1189C0A75e7965974cE7c5253eB18eC93F2DE4Ad"));
  //   dispatch(fetchListings(true));
  //   // eslint-disable-next-line
  // }, [dispatch]);

  const handleMakeOffer = (nft:any) => {
    console.log('===handleMakeOffer', nft);
    if (user.address) {
      setNftOffer(nft);
      setOpenMakeOfferDialog(!openMakeOfferDialog);
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  };
  
  const GetNftImages = async () => {
    const izCollection = config.collections.find((collection: any) => collection.slug === 'izanamis-cradle-land-deeds');
    // console.log('===izLandDeeds', izCollection);
    setNftImage(izCollection.metadata.avatar)
  }
  const GoToNFTPage = () => {
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
                textAlign='center'
              > Token Id: {plotId.toString()} </Text>
              {forSale && (
                <Text
                as='i'
                textAlign='center'
              > Price: {price} CRO </Text>
              )}
              <Spacer h={8} />
              <HStack>
              {forSale && (
                <RdTabButton
                isActive={currentTab === tabs.info}
                onClick={() => GoToNFTPage()}
                fontSize={{base: '12', sm: '14'}}
                padding={{base: '0 10px', sm: '0 20px'}}
                margin={{base: '0 5px', sm: '0 10px'}}
              >
                Buy Now
              </RdTabButton>)

                }

                  <RdTabButton
                        isActive={currentTab === tabs.info}
                        onClick={() => handleMakeOffer(nft)}
                        fontSize={{base: '12', sm: '14'}}
                        padding={{base: '0 10px', sm: '0 20px'}}
                        margin={{base: '0 5px', sm: '0 10px'}}
                      >
                        Make Offer
                      </RdTabButton>
                </HStack>
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
      {openMakeOfferDialog && (
        <MakeOfferDialog
          isOpen={openMakeOfferDialog}
          initialNft={nftOffer}
          onClose={() => setOpenMakeOfferDialog(false)}
          nftId={plotId}
          nftAddress={"0x1189C0A75e7965974cE7c5253eB18eC93F2DE4Ad"}
        />
      )}
    </RdModal>
  )
}

export default LandModal;