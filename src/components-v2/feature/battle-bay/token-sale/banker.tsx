import {AspectRatio, Box, Image} from "@chakra-ui/react";
import FortunePurchaseDialog from "@src/components-v2/feature/battle-bay/token-sale/dialog";
import React, {useState} from "react";
import BankerBubbleBox, {TypewriterText} from "@src/components-v2/feature/battle-bay/components/banker-bubble-box";

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
          rounded='lg'
        >
          <BankerBubbleBox minH='250px' fontSize={'xl'}>
            {isVisible && (
              <TypewriterText
                text='Welcome, traveler. It seems that since Ebisu has created all these Fortune tokens, that our world has gone through quite an evolution.'
                onComplete={() => setBankerImage(bankerImages.idle)}
              />
            )}
          </BankerBubbleBox>
        </Box>
      </Box>
      <FortunePurchaseDialog isOpen={false} onClose={onExit} />
    </>
  );

}

export default BankerScene;