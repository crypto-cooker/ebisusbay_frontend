import {Box} from "@chakra-ui/react";
import React, {useState} from "react";
import LandingScene from "@src/components-v2/feature/battle-bay/token-sale/landing";
import BankerScene from "@src/components-v2/feature/battle-bay/token-sale/banker";

enum Scene {
  LANDING,
  BANKER,
}

const TokenSale = () => {
  const [scene, setScene] = useState(Scene.LANDING);

  const handleEnterTokenSale = () => {
    setScene(Scene.BANKER);
  }

  const handleExitBanker = () => {
    setScene(Scene.LANDING);
  }

  return (
    <Box
      position='relative'
      h='calc(100vh - 74px)'
    >
      <Box display={scene === Scene.LANDING ? 'block' : 'none'}>
        <LandingScene onEnterTokenSale={handleEnterTokenSale} />
      </Box>
      <Box display={scene === Scene.BANKER ? 'block' : 'none'}>
        <BankerScene onExit={handleExitBanker} isVisible={scene === Scene.BANKER}/>
      </Box>
    </Box>
  )
}

export default TokenSale;