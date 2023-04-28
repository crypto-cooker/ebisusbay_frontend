import {AspectRatio, Box, Heading, Image, VStack} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import React from "react";
import RdButton from "@src/components-v2/feature/battle-bay/components/rd-button";

const TokenSale = () => {
  return (
    <Box
      position='relative'
      bg='red.800'
      h='calc(100vh - 74px)'
    >
      <AspectRatio ratio={1920/1080} overflow='visible'>
        <video
          id="background-video"
          autoPlay loop muted
          style={{
            minHeight: 'calc(100vh - 74px)',
            filter: 'brightness(0.7) blur(5px)',
          }}
        >
          <source src='/img/ryoshi/fortune-token-sale-bg.mp4' type="video/mp4" />
        </video>
      </AspectRatio>
      <Box
        w='full'
        position='absolute'
        top='50%'
        left='50%'
        transform='translate(-50%, -50%)'
        textAlign='center'
      >
        <VStack>
          <Image src='/img/ryoshi/fortune-token.png' />
          <Heading fontSize={80}>
            RYOSHI DYNASTIES
          </Heading>
          <RdButton w='250px' size='lg'>Token Sale</RdButton>
          <RdButton w='250px' size='lg'>Marketplace</RdButton>
          <RdButton w='250px' size='lg'>Collections</RdButton>
        </VStack>
      </Box>
    </Box>
  )
}

export default TokenSale;