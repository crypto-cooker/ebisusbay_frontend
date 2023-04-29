import {AspectRatio, Box, Image} from "@chakra-ui/react";
import FortunePurchaseDialog from "@src/components-v2/feature/battle-bay/token-sale/dialog";
import React from "react";

interface BankerSceneProps {
  onExit: () => void;
  isVisible:boolean;
}

const BankerScene = ({onExit, isVisible}: BankerSceneProps) => {

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
          src='/img/battle-bay/gifBanker/eyeblink.gif'
          w='800px'
          position='absolute'
          bottom={0}
          left={0}
        />
      </Box>
      <FortunePurchaseDialog isOpen={isVisible} onClose={onExit} />
    </>
  );

}

export default BankerScene;