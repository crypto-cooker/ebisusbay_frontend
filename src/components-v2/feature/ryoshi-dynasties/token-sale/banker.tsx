import {AspectRatio, Box, Icon, Image, useBreakpointValue, VStack} from "@chakra-ui/react";
import FortunePurchaseDialog from "@src/components-v2/feature/ryoshi-dynasties/token-sale/dialog";
import React, {useCallback, useEffect, useState} from "react";
import BankerBubbleBox, {TypewriterText} from "@src/components-v2/feature/ryoshi-dynasties/components/banker-bubble-box";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faCircleInfo, faDollarSign} from "@fortawesome/free-solid-svg-icons";
import {useWindowSize} from "@src/hooks/useWindowSize";
import {TokenSaleContext, TokenSaleContextProps} from "@src/components-v2/feature/ryoshi-dynasties/token-sale/context";
import {Contract, ethers} from "ethers";
import FortunePresale from "@src/Contracts/FortunePresale.json";
import {appConfig} from "@src/Config";
import {useQuery} from "@tanstack/react-query";
import {useAppSelector} from "@src/Store/hooks";

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
  const user = useAppSelector((state) => state.user);
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

  const { data: tokenSaleContractValues } = useQuery<TokenSaleContextProps>(
    ['TokenSale', user.address],
    async () => {
      const fortuneContract = new Contract(config.contracts.purchaseFortune, FortunePresale, readProvider);
      const paused = await fortuneContract.paused();
      const userFortunePurchased = !!user.address ? await fortuneContract.purchases(user.address) : 0;
      const totalFortunePurchased = await fortuneContract.totalPurchased();
      const exchangeRate = await fortuneContract.TOKEN_PRICE_USDC();
      const maxAllocation = await fortuneContract.MAX_PURCHASE();
      return {
        paused,
        userFortunePurchased: Number(userFortunePurchased),
        totalFortunePurchased: Number(totalFortunePurchased),
        exchangeRate: Number(exchangeRate),
        maxAllocation: Number(maxAllocation)
      } as TokenSaleContextProps;
    },
    {
      staleTime: 1,
      initialData: () => ({
        paused: false,
        userFortunePurchased: 0,
        totalFortunePurchased: 0,
        exchangeRate: 30000,
        maxAllocation: 10000000
      })
    }
  )

  return (
    <TokenSaleContext.Provider value={tokenSaleContractValues}>
      <Box>
        <AspectRatio ratio={1920/1080} overflow='visible'>
          <Image
            src='/img/battle-bay/bankinterior/bank_interior_background_desktop_animated.png'
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
                  'Welcome, traveler. It seems that since Ebisu has created all these Fortune tokens, our world has gone through quite an evolution.<br /><br />',
                  'The $Fortune token presale will be held here on May 1st at 8pm UTC. VIPs will have exclusive access to the sale for one hour before the public sale.'
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
        >
          <VStack spacing={4} align='end'>
            <RdButton w={abbreviateButtonText ? '60px' : '200px'} hideIcon={abbreviateButtonText} onClick={() => handlePurchaseDialogOpen('default')}>
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faDollarSign} />
              ) : (
                <>Buy $Fortune</>
              )}
            </RdButton>
            <RdButton w={abbreviateButtonText ? '60px' : '200px'} hideIcon={abbreviateButtonText} onClick={() => handlePurchaseDialogOpen('faq')}>
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faCircleInfo} />
              ) : (
                <>FAQ</>
              )}
            </RdButton>
            <RdButton w={abbreviateButtonText ? '60px' : '200px'} hideIcon={abbreviateButtonText} onClick={handleExit}>
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