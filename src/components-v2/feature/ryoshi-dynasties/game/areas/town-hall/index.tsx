import {AspectRatio, Box, Button, Flex, Image, Text, useDisclosure, VStack,} from '@chakra-ui/react';
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import StakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft";

import localFont from 'next/font/local';
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import React from 'react';
import {ArrowBackIcon} from "@chakra-ui/icons";
import {motion} from "framer-motion";
import ImageService from "@src/core/services/image";
import Meeple from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/meeple";

const gothamBook = localFont({
  src: '../../../../../../fonts/Gotham-Book.woff2',
  fallback: ['Roboto', 'system-ui', 'arial'],
})

interface BarracksProps {
  onBack: () => void;
}

const TownHall = ({onBack}: BarracksProps) => {
  const { isOpen: isOpenStakeNFTs, onOpen: onOpenStakeNFTs, onClose: onCloseStakeNFTs} = useDisclosure();
  const { isOpen: isOpenMeeple, onOpen: onOpenMeeple, onClose: onCloseMeeple} = useDisclosure();

  const [handleAuthedNavigation] = useAuthedFunction();


  const motionDivVariant = {
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
        variants={motionDivVariant}
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
          // bg={'#000000'}
          overflow='hidden'
        >
          <Flex
            flexDirection='column'
            textAlign='center'
            justifyContent='space-around'
            padding={4}
            minW={{base: '100%', xl: '450px' }}
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
                <ArrowBackIcon boxSize={8} />
              </Button>
            </Box>
            <Box textAlign='end' ms={2}>
              <Text textColor='#ffffffeb' fontSize={{ base: '28px', md: '32px' }} fontWeight='bold'>Town Hall</Text>
              <Text textColor='#ffffffeb' fontSize='sm' fontStyle='italic'>
                The heart of the Community and its activities
              </Text>
            </Box>
          </Flex>

          <Flex align={'center'} minH={'calc(100vh - 175px)'} justifyContent={'center'}>
            <Meeple isOpen={isOpenMeeple} onClose={onCloseMeeple} />
            <StakeNfts isOpen={isOpenStakeNFTs} onClose={onCloseStakeNFTs} />
            <VStack spacing={4} align='stretch'>
              <RdButton onClick={() => handleAuthedNavigation(onOpenStakeNFTs)}>Stake NFTs</RdButton>
              {/*<RdButton fontSize='18' onClick={() => handleAuthedNavigation(onOpenMeeple)}>Ryoshi Management</RdButton>*/}
            </VStack>
          </Flex>
        </Flex>
      </Box>

      <AspectRatio ratio={1920/1080} overflow='visible' >
        <Image
          position={'absolute'}
          opacity={0.2}
          zIndex={0}
          src={ImageService.translate('/img/ryoshi-dynasties/village/background-town-hall.webp').convert()}
          minH='calc(100vh - 74px)'
        />
      </AspectRatio>
    </motion.div>
  </Box>
  )
};


export default TownHall;