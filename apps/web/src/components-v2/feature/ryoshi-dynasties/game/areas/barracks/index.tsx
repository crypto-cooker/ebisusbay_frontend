import { AspectRatio, Box, Icon, Image, useDisclosure, useMediaQuery, VStack } from '@chakra-ui/react';
import { RdButton } from '@src/components-v2/feature/ryoshi-dynasties/components';

import useAuthedFunction from '@market/hooks/useAuthedFunction';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ImageService from '@src/core/services/image';

import StakeNfts from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft';
import ClaimRewards from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/claim-rewards';
import useAuthedFunctionWithChainID from '@market/hooks/useAuthedFunctionWithChainID';
import { SUPPORTED_RD_CHAIN_CONFIGS } from '@src/config/chains';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faImage } from '@fortawesome/free-solid-svg-icons';
import BankerBubbleBox, {
  TypewriterText
} from '@src/components-v2/feature/ryoshi-dynasties/components/banker-bubble-box';
import { useWindowSize } from '@market/hooks/useWindowSize';

const greeterImages = {
  idle: '/img/ryoshi-dynasties/village/buildings/barracks/greeter-idle.png',
  talking: '/img/ryoshi-dynasties/village/buildings/barracks/greeter-idle.png',
};

const greetings = [
  'My Lord which generals should I dispatch?',
];

interface BarracksProps {
  onBack: () => void;
}

const Barracks = ({onBack}: BarracksProps) => {
  const [handleDefaultAuthedNavigation] = useAuthedFunction();
  const [handleChainAuthedNavigation] = useAuthedFunctionWithChainID(SUPPORTED_RD_CHAIN_CONFIGS.map(({chain}) => chain.id));
  const windowSize = useWindowSize();

  const [greeterImage, setGreeterImage] = useState(greeterImages.talking);
  const [abbreviateButtonText, setAbbreviateButtonText] = useState(false);
  const [shouldAbbreviateHorizontal] = useMediaQuery('(max-width: 800px)');

  const onClaimedRewards = () => {
    onCloseClaimRewards();
  }

  const { isOpen: isOpenStakeNFTs, onOpen: onOpenStakeNFTs, onClose: onCloseStakeNFTs} = useDisclosure();
  const { isOpen: isOpenClaimRewards, onOpen: onOpenClaimRewards, onClose: onCloseClaimRewards} = useDisclosure();

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1,
      transition: {
      }
     }
  }

  useEffect(() => {
    const shouldAbbreviateVertical = !!windowSize.height && windowSize.height < 800;
    setAbbreviateButtonText(shouldAbbreviateVertical && shouldAbbreviateHorizontal);
  }, [windowSize, shouldAbbreviateHorizontal]);

  return (
    <Box
      position='relative'
      h='calc(100vh - 74px)'
      overflow='hidden'
    >
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
      >
        <Box
          position='absolute'
          right={-1}
          bottom={20}
          zIndex={10}
          w={abbreviateButtonText ? '60px' : '269px'}
        >
          <VStack spacing={4} align='end' h='full'>
            <RdButton
              size={{ base: 'md', sm: 'lg' }}
              w='full'
              onClick={() => handleChainAuthedNavigation(onOpenStakeNFTs)}
            >
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faImage} />
              ) : (
                <>Stake NFTs</>
              )}
            </RdButton>
            <RdButton size={{ base: 'md', sm: 'lg' }} w='full' hoverIcon={!abbreviateButtonText} onClick={onBack}>
              {abbreviateButtonText ? (
                <Icon as={FontAwesomeIcon} icon={faArrowRightFromBracket} />
              ) : (
                <>Exit</>
              )}
            </RdButton>
          </VStack>
        </Box>

        <StakeNfts isOpen={isOpenStakeNFTs} onClose={onCloseStakeNFTs} />
        <ClaimRewards isOpen={isOpenClaimRewards} onClose={onClaimedRewards} />

        <AspectRatio ratio={1920 / 1080} overflow='visible'>
          <Image
            position={'absolute'}
            opacity={0.9}
            zIndex={0}
            src={ImageService.translate('/img/ryoshi-dynasties/village/background-barracks.webp').convert()}
            minH='calc(100vh - 74px)'
          />
        </AspectRatio>

        <Image
          src={ImageService.translate(greeterImage).convert()}
          w='800px'
          position='absolute'
          bottom={{ base: 12, md: 0 }}
          left={0}
        />

        <Box
          position='absolute'
          top={{base: 5, md: 10, lg: 16}}
          left={{base: 0, md: 10, lg: 16}}
          w={{base: 'full', md: '600px'}}
          pe={!!windowSize.height && windowSize.height < 800 ? {base: '60px', sm: '150px', md: '0px'} : {base: '5px', md: '0px'}}
          ps={{base: '5px', md: '0px'}}
          rounded='lg'
        >
          <BankerBubbleBox fontSize={{base: 'md', sm: 'lg', md: 'xl'}} color='white'>
            {(
              <TypewriterText
                text={[
                  greetings[Math.floor(Math.random() * greetings.length)],
                  '<br /><br />Press Stake NFTs to select your Ryoshi Tales and get them onto the battle lines.'
                ]}
                onComplete={() => setGreeterImage(greeterImages.idle)}
              />
            )}
          </BankerBubbleBox>
        </Box>
      </motion.div>
    </Box>
  )
};


export default Barracks;