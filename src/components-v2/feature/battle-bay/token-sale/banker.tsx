import {AspectRatio, Box, Icon, Image, useBreakpointValue, VStack} from "@chakra-ui/react";
import FortunePurchaseDialog from "@src/components-v2/feature/battle-bay/token-sale/dialog";
import React, {useCallback, useState} from "react";
import BankerBubbleBox, {TypewriterText} from "@src/components-v2/feature/battle-bay/components/banker-bubble-box";
import RdButton from "@src/components-v2/feature/battle-bay/components/rd-button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faCircleInfo} from "@fortawesome/free-solid-svg-icons";
import {useWindowSize} from "@src/hooks/useWindowSize";

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

  const windowSize = useWindowSize();

  const handlePurchaseDialogOpen = (page?: string) => {
    if (page === 'faq') {
      setPurchaseDialogPage('faq');
    } else {
      setPurchaseDialogPage('main');
    }
    setPurchaseDialogOpen(true);
  }

  const handleExit = useCallback(() => {
    setBankerImage(bankerImages.talking);
    onExit();
  }, []);

  return (
    <>
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
                  'The $Fortune token presale will be held here on May 1st, 2023. Visit the FAQ to learn more.'
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
            <RdButton w={abbreviateButtonText ? '60px' : '150px'} onClick={() => handlePurchaseDialogOpen('faq')}>
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faCircleInfo} />
              ) : (
                <>FAQ</>
              )}
            </RdButton>
            <RdButton w={abbreviateButtonText ? '60px' : '150px'} onClick={handleExit}>
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
    </>
  );

}

export default BankerScene;