import {AspectRatio, Box, Flex, Heading, Image, Link, VStack} from "@chakra-ui/react";
import RdButton from "@src/components-v2/feature/battle-bay/components/rd-button";
import React from "react";
import {Fade} from "react-awesome-reveal";
import NextLink from "next/link";
import NextImage from "next/image";

interface LandingSceneProps {
  onEnterTokenSale: () => void;
}

const LandingScene = ({onEnterTokenSale}: LandingSceneProps) => {
  return (
    <>
      <AspectRatio ratio={1920/1080} overflow='visible'>
        <NextImage
          alt='Ryoshi Dynasties'
          src='/img/ryoshi/fortune-token-sale-bg.jpg'
          fill={true}
          priority
          style={{
            minHeight: 'calc(100vh - 74px)',
            filter: 'brightness(0.7) blur(5px)'
          }}
        />
        {/*<video*/}
        {/*  autoPlay loop muted*/}
        {/*  style={{*/}
        {/*    minHeight: 'calc(100vh - 74px)',*/}
        {/*    filter: 'brightness(0.7) blur(5px)',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <source src='/img/ryoshi/fortune-token-sale-bg.mp4' type="video/mp4" />*/}
        {/*</video>*/}
      </AspectRatio>
      <Box
        w='full'
        position='absolute'
        top='50%'
        left='50%'
        transform='translate(-50%, -50%)'
        textAlign='center'
      >
        <Flex direction='column' align='center'>
          <Fade cascade>
            <Heading>
              <Image src='/img/ryoshi/rd-logo.png' w='800px' />
            </Heading>
            <VStack mt={8}>
              <RdButton w='250px' fontSize={{base: 'xl', sm: '2xl'}} onClick={onEnterTokenSale}>Token Sale</RdButton>
              <Link href='https://ebisusbay.notion.site/ebisusbay/Ryoshi-Dynasties-8cb0bb21ad194af092cf1e1f8a8846c6' isExternal>
                <RdButton w='250px' fontSize={{base: 'xl', sm: '2xl'}}>Whitepaper</RdButton>
              </Link>
              <NextLink href='/marketplace'>
                <RdButton w='250px' fontSize={{base: 'xl', sm: '2xl'}}>Marketplace</RdButton>
              </NextLink>
            </VStack>
          </Fade>
        </Flex>
      </Box>
    </>
  )
}

export default LandingScene;