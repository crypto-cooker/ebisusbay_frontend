import {AspectRatio, Box, Flex, Heading, Image, Link, VStack} from "@chakra-ui/react";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import React from "react";
import {Fade} from "react-awesome-reveal";
import NextLink from "next/link";
import NextImage from "next/image";
import {useWindowSize} from "@market/hooks/useWindowSize";

interface LandingSceneProps {
  onEnterTokenSale: () => void;
}

const LandingScene = ({onEnterTokenSale}: LandingSceneProps) => {
  const windowSize = useWindowSize();

  return (
    <>
      <AspectRatio ratio={1920/1080} overflow='visible'>
        {/*<NextImage*/}
        {/*  alt='Ryoshi Dynasties'*/}
        {/*  src='/img/ryoshi/fortune-token-sale-bg.jpg'*/}
        {/*  fill={true}*/}
        {/*  priority*/}
        {/*  style={{*/}
        {/*    minHeight: 'calc(100vh - 74px)',*/}
        {/*    filter: 'brightness(0.7) blur(5px)'*/}
        {/*  }}*/}
        {/*/>*/}
        <video
          autoPlay
          loop
          muted
          poster={'https://cdn-prod.ebisusbay.com/img/ryoshi/fortune-token-sale-bg.jpg'}
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
        <Flex direction='column' align='center'>
          <Fade cascade>
            <Heading>
              <Image src='/img/ryoshi/rd-logo.png' w='800px' />
            </Heading>
            <VStack mt={!!windowSize.height && windowSize.height < 700 ? 4 : 8}>
              <RdButton w='250px' fontSize={{base: 'xl', sm: '2xl'}} onClick={onEnterTokenSale}>Token Sale</RdButton>
              <Link href='https://lotusgalaxy.docsend.com/view/cn6irmx92xy2ek2f' isExternal>
                <RdButton w='250px' fontSize={{base: 'xl', sm: '2xl'}}>Whitepaper</RdButton>
              </Link>
              <Link href='https://lotusgalaxy.docsend.com/view/6jrt35hiwkewxdum' isExternal>
                <RdButton w='250px' fontSize={{base: 'xl', sm: '2xl'}}>Litepaper</RdButton>
              </Link>
              {/*<NextLink href='/marketplace'>*/}
              {/*  <RdButton w='250px' fontSize={{base: 'xl', sm: '2xl'}}>Marketplace</RdButton>*/}
              {/*</NextLink>*/}
            </VStack>
          </Fade>
        </Flex>
      </Box>
    </>
  )
}

export default LandingScene;