import React, {useCallback, useEffect, useState} from "react";
import {Box, Center, Flex, HStack, Image, SimpleGrid, Spacer, Text, VStack, useMediaQuery} from "@chakra-ui/react"
import {Spinner} from 'react-bootstrap';
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {useAppSelector} from "@src/Store/hooks";
import HelpPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/help";
import {appConfig} from "@src/Config";

import {useDispatch} from 'react-redux';
import MetaMaskOnboarding from '@metamask/onboarding';
import {chainConnect, connectAccount} from '@src/GlobalState/User';
import MakeOfferDialog from '@src/components-v2/shared/dialogs/make-offer';
import RdLand from "@src/components-v2/feature/ryoshi-dynasties/components/rd-land";

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
  const [isMobile] = useMediaQuery("(max-width: 750px)");

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
    console.log("isMobile", isMobile)
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
          <SimpleGrid 
          columns={isMobile ? 1 : 2} 
          padding='10'
          justifyItems={'center'}
          >

            <RdLand nftId={plotId.toString()} boxSize={199} />
              <Flex justifyContent={'center'}>
                <VStack>
                <Text
                mt={2}
                as='i'
                textAlign='center'
              > Token Id: {plotId.toString()} </Text>
              {forSale && (
                <Text
                as='i'
                textAlign='center'
              > Price: {price} $Fortune </Text>
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
          nftId={plotId.toString()}
          nftAddress={"0x1189C0A75e7965974cE7c5253eB18eC93F2DE4Ad"}
        />
      )}
    </RdModal>
  )
}

export default LandModal;