import {AspectRatio, Box, Icon, Image, useBreakpointValue, VStack} from "@chakra-ui/react";
import FortunePurchaseDialog from "@src/components-v2/feature/ryoshi-dynasties/token-sale/dialog";
import React, {useCallback, useState} from "react";
import BankerBubbleBox, {
  TypewriterText
} from "@src/components-v2/feature/ryoshi-dynasties/components/banker-bubble-box";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faCircleInfo, faDollarSign} from "@fortawesome/free-solid-svg-icons";
import {useWindowSize} from "@market/hooks/useWindowSize";
import {TokenSaleContext, TokenSaleContextProps} from "@src/components-v2/feature/ryoshi-dynasties/token-sale/context";
import {Contract, ethers} from "ethers";
// import FortunePresale from "@src/global/contracts/FortunePresale.json";
import LiquidityBoost from "@src/global/contracts/LiquidityBoost.json";
import {appConfig} from "@src/Config";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {useUser} from "@src/components-v2/useUser";
import ImageService from "@src/core/services/image";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

const bankerImages = {
  idle: '/img/battle-bay/gifBanker/eyeblink.gif',
  talking: '/img/battle-bay/gifBanker/mouth.gif',
};

interface BankerSceneProps {
  onExit: () => void;
  isVisible:boolean;
}

const BankerScene = ({onExit, isVisible}: BankerSceneProps) => {
  const [bankerImage, setBankerImage] = useState(bankerImages.talking);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [purchaseDialogPage, setPurchaseDialogPage] = useState('default');
  const abbreviateButtonText = useBreakpointValue<boolean>(
    {base: true, sm: false},
    {fallback: 'sm'},
  );
  const user = useUser();
  const windowSize = useWindowSize();

  const handlePurchaseDialogOpen = (page?: string) => {
    if (page === 'faq') {
      setPurchaseDialogPage('faq');
    } else {
      setPurchaseDialogPage('default');
    }
    setPurchaseDialogOpen(true);
  }

  const handleExit = useCallback(() => {
    setBankerImage(bankerImages.talking);
    onExit();
  }, []);

  const { data: tokenSaleContractValues } = useQuery<TokenSaleContextProps>({
    queryKey: ['TokenSale', user.address],
    queryFn: async () => {
      console.log('loading data');
      const fortuneContract = new Contract(config.contracts.purchaseFortune, LiquidityBoost, readProvider);
      const paused = await fortuneContract.paused();
      const exchangeRate = 6;//await fortuneContract.TOKEN_PRICE_USDC();
      const maxAllocation = await fortuneContract.MAX_CONTRIBUTIONS();
      const userMinPurchaseAmount = await fortuneContract.MIN_CONTRIBUTION();
      const userCroContributed = !!user.address ? await fortuneContract.contributions(user.address) : 0;
      const totalCroContributed = await fortuneContract.totalContributions();

      // const apiService = new ApiService();
      // const totalFortunePurchased = await apiService.ryoshiDynasties.globalTotalPurchased();
      // const userFortunePurchased = !!user.address ? await apiService.ryoshiDynasties.userTotalPurchased(user.address) : 0;
      console.log('userCroContributed', ethers.utils.formatEther(userCroContributed));
      return {
        paused,
        userCroContributed: userCroContributed,
        totalCroContributed: totalCroContributed,
        exchangeRate: Number(exchangeRate),
        maxAllocation: maxAllocation//Number(maxAllocation)
      } as TokenSaleContextProps;
    },
    enabled: isVisible,
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
    initialData: () => ({
      paused: false,
      userCroContributed: 0,
      totalCroContributed: 0,
      exchangeRate: 6,
      maxAllocation: 4000000
    })
  });

  return (
    <TokenSaleContext.Provider value={tokenSaleContractValues}>
      <Box>
        <AspectRatio ratio={1920/1080} overflow='visible'>
          <Image
            src={ImageService.translate('/img/battle-bay/bankinterior/bank_interior_background_desktop_animated.png').convert()}
            minH='calc(100vh - 74px)'
          />
        </AspectRatio>
        <Image
          src={bankerImage}
          w='800px'
          position='absolute'
          bottom={0}
          left={0}
        />
        <Box
          position='absolute'
          top={{base: 5, md: 10, lg: 16}}
          left={{base: 0, md: 10, lg: 16}}
          w={{base: 'full', md: '600px'}}
          pe={!!windowSize.height && windowSize.height < 600 ? {base: '60px', sm: '150px', md: '0px'} : {base: '5px', md: '0px'}}
          ps={{base: '5px', md: '0px'}}
          rounded='lg'
        >
          <BankerBubbleBox fontSize={{base: 'md', sm: 'lg', md: 'xl'}}>
            {isVisible && (
              <TypewriterText
                text={[
                  'Welcome, traveler. It has been a long time since we have met.<br /><br />',
                  Date.now() > config.tokenSale.publicEnd ?
                    'The $FRTN token sale is now closed! Thank you to everyone who participated and let Fortune Favor the Bay!' :
                  Date.now() > config.tokenSale.publicStart ?
                    `The $FRTN token sale is now open! Press the ${!!windowSize.height && windowSize.height < 600 ? '"$"' : '"Buy $FRTN"'} button to participate. Sale ends Aug 7th at 11pm UTC` :
                  Date.now() > config.tokenSale.vipStart ?
                    '' :
                    ''
                ]}
                onComplete={() => setBankerImage(bankerImages.idle)}
              />
            )}
          </BankerBubbleBox>
        </Box>
        <Box
          position='absolute'
          right={-1}
          bottom={20}
          w={abbreviateButtonText ? '60px' : '250px'}
        >
          <VStack spacing={4} align='end'>
            {Date.now() > config.tokenSale.vipStart && Date.now() < config.tokenSale.publicEnd && (
              <RdButton w='full' hoverIcon={!abbreviateButtonText} onClick={() => handlePurchaseDialogOpen('default')}>
                {abbreviateButtonText ? (
                  <Icon as={FontAwesomeIcon} icon={faDollarSign} />
                ) : (
                  <>Buy $Fortune</>
                )}
              </RdButton>
            )}
            <RdButton w='full' hoverIcon={!abbreviateButtonText} onClick={() => handlePurchaseDialogOpen('faq')}>
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faCircleInfo} />
              ) : (
                <>FAQ</>
              )}
            </RdButton>
            <RdButton w='full' hoverIcon={!abbreviateButtonText} onClick={handleExit}>
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faArrowRightFromBracket} />
              ) : (
                <>Exit</>
              )}
            </RdButton>
          </VStack>
        </Box>
      </Box>
      <FortunePurchaseDialog
        isOpen={purchaseDialogOpen}
        onClose={() => setPurchaseDialogOpen(false)}
        initialPage={purchaseDialogPage}
      />
    </TokenSaleContext.Provider>
  );

}

export default BankerScene;