import {Box} from "@chakra-ui/react";
import React, {useState} from "react";
import LandingScene from "@src/components-v2/feature/ryoshi-dynasties/token-sale/landing";
import BankerScene from "@src/components-v2/feature/ryoshi-dynasties/token-sale/banker";
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../fonts/Gotham-Book.woff2' })

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
      className={gothamBook.className}
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