import {AspectRatio, Box, Button, Flex, Image, Link, Text, VStack} from '@chakra-ui/react';
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {motion} from "framer-motion";
import ImageService from "@src/core/services/image";

import localFont from 'next/font/local';
import NextLink from "next/link";

const gothamBook = localFont({ src: '../../../../../../global/assets/fonts/Gotham-Book.woff2' })
  
  interface FishMarketProps {
    onBack: () => void;
  }
  
  const FishMarketModal = ({onBack}: FishMarketProps) => {
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
          <Text textColor='#ffffffeb' fontSize={{ base: '28px', md: '32px' }} fontWeight='bold'>Marketplace</Text>
          <Text textColor='#ffffffeb' fontSize='sm' fontStyle='italic'>Obtain Ebisus NFTs</Text>
        </Box>
      </Flex>
    

      <Flex align={'center'} minH={'calc(100vh - 175px)'} justifyContent={'center'}>
        <VStack spacing={4} align='stretch'>
        <Box>
            <Link as={NextLink} href='https://app.ebisusbay.com/swap' target='_blank'>
              <RdButton w='full'>Visit DEX</RdButton>
            </Link>
          </Box>
          <Box>
            <Link as={NextLink} href='https://app.ebisusbay.com/collections' target='_blank'>
              <RdButton w='full'>Visit Marketplace</RdButton>
            </Link>
          </Box>
          <Box>
            <Link as={NextLink} href='https://app.ebisusbay.com/staking' target='_blank'>
              <RdButton w='full'>VIP Staking</RdButton>
            </Link>
          </Box>
        </VStack>
      </Flex>
    </Flex>
  </Box>


  <AspectRatio ratio={1920/1080} overflow='visible' >
    <Image
      position={'absolute'}
      opacity={0.2}
      zIndex={0}
      src={ImageService.translate('/img/ryoshi-dynasties/village/background-marketplace.webp').convert()}
      minH='calc(100vh - 74px)'
    />
  </AspectRatio>

  </motion.div>
</Box>
    )
  };
  
  
  export default FishMarketModal;