import React, {useCallback, useEffect, useState} from "react";
import {Box, Center, Flex, HStack, Spinner, Text, useMediaQuery, VStack} from "@chakra-ui/react"
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import HelpPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point/help";
import {appConfig} from "@src/config";
import MakeOfferDialog from '@src/components-v2/shared/dialogs/make-offer';
import RdLand from "@src/components-v2/feature/ryoshi-dynasties/components/rd-land";
import useAuthedFunction from "@market/hooks/useAuthedFunction";

const tabs = {
  info: 'info',
  deploy: 'deploy',
  attack: 'attack'
};

interface Plot {
  id: number;
  forSale: boolean;
  price: number;
  nft:any;
}

interface LandModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  // plotId: number;
  // forSale: boolean;
  // price: number;
  // nft:any;
  plot: Plot;
}

const LandModal = ({ isOpen, onClose, plot}: LandModalFormProps) => {
  const [runAuthedFunction] = useAuthedFunction();
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

  // const router = useRouter();
  
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
    runAuthedFunction(async() => {
      setNftOffer(nft.nft ?? nft);
      setOpenMakeOfferDialog(!openMakeOfferDialog);
    });
  };
  
  const GetNftImages = async () => {
    const izCollection = config.legacyCollections.find((collection: any) => collection.slug === 'izanamis-cradle-land-deeds');
    setNftImage(izCollection.metadata.avatar)
  }
  const GoToNFTPage = () => {
    window.open('https://app.ebisusbay.com/collection/izanamis-cradle-land-deeds/'+plot.id,'_blank');
  }

  useEffect(() => {
    GetNftImages();
  }, [])

  useEffect(() => {
    setTitle("Land Deed #" + plot.id.toString());
    setIsLoading(false);
  }, [plot]);

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
            <VStack w='full' align='center' h="400">
              <Box w="350px" h="350px">
                <RdLand nftId={plot.id.toString()} rounded={'xl'}/>
              </Box>
              {plot.forSale && (
                <Text as='i' textAlign='center'>
                  Price: {plot.price} $Fortune
                </Text>
              )}
              <HStack w='full' justify='center'>
                <RdTabButton
                  isActive={currentTab === tabs.info}
                  onClick={() => GoToNFTPage()}
                  fontSize={{base: '12', sm: '14'}}
                  padding={{base: '0 10px', sm: '0 20px'}}
                  margin={{base: '0 5px', sm: '0 10px'}}
                >
                  {plot.forSale ? 'Buy Now' : 'Details'}
                </RdTabButton>

                <RdTabButton
                  isActive={currentTab === tabs.info}
                  onClick={() => handleMakeOffer(plot.nft)}
                  fontSize={{base: '12', sm: '14'}}
                  padding={{base: '0 10px', sm: '0 20px'}}
                  margin={{base: '0 5px', sm: '0 10px'}}
                >
                  Make Offer
                </RdTabButton>
              </HStack>
            </VStack>

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
            <Spinner size='sm' ms={1} />
          )}
        </>
      )}
      {openMakeOfferDialog && (
        <MakeOfferDialog
          isOpen={openMakeOfferDialog}
          initialNft={nftOffer}
          onClose={() => setOpenMakeOfferDialog(false)}
          nftId={plot.id.toString()}
          nftAddress={plot.nft.nftAddress}
        />
      )}
    </RdModal>
  )
}

export default LandModal;