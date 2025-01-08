import { AspectRatio, Box, Icon, Image, useDisclosure, VStack } from '@chakra-ui/react';
import { RdButton } from '@src/components-v2/feature/ryoshi-dynasties/components';

import localFont from 'next/font/local';
import useAuthedFunction from '@market/hooks/useAuthedFunction';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageService from '@src/core/services/image';

import StakeNfts from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft';
import ClaimRewards from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/claim-rewards';
import useAuthedFunctionWithChainID from '@market/hooks/useAuthedFunctionWithChainID';
import { SUPPORTED_RD_CHAIN_CONFIGS } from '@src/config/chains';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const gothamBook = localFont({
  src: '../../../../../../global/assets/fonts/Gotham-Book.woff2',
  fallback: ['Roboto', 'system-ui', 'arial'],
})

interface BarracksProps {
  onBack: () => void;
}

const Barracks = ({onBack}: BarracksProps) => {
  const [handleDefaultAuthedNavigation] = useAuthedFunction();
  const [handleChainAuthedNavigation] = useAuthedFunctionWithChainID(SUPPORTED_RD_CHAIN_CONFIGS.map(({chain}) => chain.id));
  const [abbreviateButtonText, setAbbreviateButtonText] = useState(false);

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
          h='auto'
          w={{ base: '200px', sm: '269px' }}
        >
          <VStack spacing={4} align='end' h='full'>
            <RdButton
              size={{ base: 'sm', sm: 'lg' }}
              w='full'
              onClick={() => handleChainAuthedNavigation(onOpenStakeNFTs)}
            >
              Stake NFTs
            </RdButton>
            <RdButton
              size={{ base: 'sm', sm: 'lg' }}
              w='full'
              onClick={() => handleDefaultAuthedNavigation(onOpenClaimRewards)}
            >
              Battle Rewards
            </RdButton>
            <RdButton size={{ base: 'sm', sm: 'lg' }} w='full' hoverIcon={!abbreviateButtonText} onClick={onBack}>
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

      </motion.div>
    </Box>
  )
};


export default Barracks;