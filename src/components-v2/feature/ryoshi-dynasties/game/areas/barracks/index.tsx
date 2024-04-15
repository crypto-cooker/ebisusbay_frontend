import {AspectRatio, Box, Button, Flex, Image, Text, useDisclosure, VStack,} from '@chakra-ui/react';
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";

import localFont from 'next/font/local';
import useAuthedFunction from "@market/hooks/useAuthedFunction";
import React, {useState} from 'react';
import {ArrowBackIcon} from "@chakra-ui/icons";
import {motion} from "framer-motion";
import ImageService from "@src/core/services/image";

import StakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft";
import ClaimRewards from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/claim-rewards';

const gothamBook = localFont({
  src: '../../../../../../global/assets/fonts/Gotham-Book.woff2',
  fallback: ['Roboto', 'system-ui', 'arial'],
})

interface BarracksProps {
  onBack: () => void;
}

const Barracks = ({onBack}: BarracksProps) => {
  const [handleAuthedNavigation] = useAuthedFunction();

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
          top={0}
          left={0}
          zIndex={1}
          w='100%'
          h='100%'
          overflow='hidden'
        >
          <Flex
            flexDirection='column'
            textAlign='center'
            justifyContent='space-around'
            padding={4}
            minW={{base: '100%', xl: '450px'}}
            className={gothamBook.className}
          >
            <Flex justify='space-between'>
              <Box
                left={6}
                top={6}
                rounded='full'
                zIndex={1}
                _groupHover={{
                  cursor: 'pointer'
                }}
                data-group
              >
                <Button
                  bg='#C17109'
                  rounded='full'
                  border='8px solid #F48F0C'
                  w={14}
                  h={14}
                  color='white'
                  onClick={onBack}
                  _groupHover={{
                    bg: '#de8b08',
                    borderColor: '#f9a50b',
                  }}
                >
                  <ArrowBackIcon boxSize={8}/>
                </Button>
              </Box>
              <Box textAlign='end' ms={2}>
                <Text textColor='#ffffffeb' fontSize={{base: '28px', md: '32px'}} fontWeight='bold'>Barracks</Text>
                <Text textColor='#ffffffeb' fontSize='sm' fontStyle='italic'>
                  Claim rewards from your battles
                </Text>
              </Box>
            </Flex>

            <Flex align={'center'} minH={'calc(100vh - 175px)'} justifyContent={'center'}>
              <VStack spacing={4} align='stretch'>
                <RdButton onClick={() => handleAuthedNavigation(onOpenStakeNFTs)}>Stake NFTs</RdButton>
                <RdButton fontSize='md' onClick={() => handleAuthedNavigation(onOpenClaimRewards)}>Claim Battle Rewards</RdButton>
              </VStack>
            </Flex>
          </Flex>
        </Box>

        <StakeNfts isOpen={isOpenStakeNFTs} onClose={onCloseStakeNFTs} />
        <ClaimRewards isOpen={isOpenClaimRewards} onClose={onClaimedRewards} />

        <AspectRatio ratio={1920 / 1080} overflow='visible'>
          <Image
            position={'absolute'}
            opacity={0.2}
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