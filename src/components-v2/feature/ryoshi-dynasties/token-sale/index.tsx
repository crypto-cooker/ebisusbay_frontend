import {Box, Flex, Image, useMediaQuery} from "@chakra-ui/react";
import React, {useState} from "react";
import LandingScene from "@src/components-v2/feature/ryoshi-dynasties/token-sale/landing";
import BankerScene from "@src/components-v2/feature/ryoshi-dynasties/token-sale/banker";
import localFont from 'next/font/local';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBullhorn} from "@fortawesome/free-solid-svg-icons";
import Countdown from "react-countdown";
import Link from "next/link";
import ImageService from "@src/core/services/image";
import {appConfig} from "@src/Config";

const config = appConfig();

const gothamBook = localFont({ src: '../../../../global/assets/fonts/Gotham-Book.woff2' })

enum Scene {
  LANDING,
  BANKER,
}

const TokenSale = () => {
  const [scene, setScene] = useState(Scene.LANDING);
  const [showMinamoto] = useMediaQuery('(min-width: 675px)')
  const [squeezeBanner] = useMediaQuery('(max-width: 1200px)')

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
        {Date.now() < config.tokenSale.publicEnd && (
          <Box
            textAlign='center'
            position='relative'
            bg='#FD8D03'
            p='9px'
            zIndex={1}
            color='#0A0600'
          >
            {showMinamoto && (
              <Image
                position='absolute'
                top={0}
                left={0}
                src={ImageService.translate('/img/ryoshi/fortune-banner-minamoto.png').convert()}
              />
            )}
            <Box ps={squeezeBanner && showMinamoto ? '150px' : 'auto'}>
              <FontAwesomeIcon icon={faBullhorn} /> FORTUNE Token presale ends in <Countdown date={1683586800000} />.{' '}
              <Link href={'ryoshi-dynasties/token-sale'} style={{fontWeight: 'bold', color:'white', textDecoration:'underline'}}>Enter sale now</Link>
            </Box>
          </Box>
        )}
        <LandingScene onEnterTokenSale={handleEnterTokenSale} />
      </Box>
      <Box display={scene === Scene.BANKER ? 'block' : 'none'}>
        <BankerScene onExit={handleExitBanker} isVisible={scene === Scene.BANKER}/>
      </Box>
    </Box>
  )
}

export default TokenSale;