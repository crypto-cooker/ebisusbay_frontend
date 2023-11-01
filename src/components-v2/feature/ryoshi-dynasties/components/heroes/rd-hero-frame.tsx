import {Flex, GridItem, HStack, Image, SimpleGrid,Text, VStack,Box, Grid, Progress, useBreakpointValue} from "@chakra-ui/react";
import React, {memo, useEffect, useRef, useState} from "react";
import RdHero from "@src/components-v2/feature/ryoshi-dynasties/components/heroes/rd-hero";
import {ResponsiveValue} from "@chakra-ui/styled-system";
import * as CSS from "csstype";

interface Attribute{
  trait_type : string;
  value : string;
  display_type : string;
}
export interface RdHeroProps {
  nftId: string;
}

interface MapOutlineProps {
  nftId: string;
  gridHeight?: string;
  gridWidth?: string;
}


const RdHeroFrame = ({nftId} : MapOutlineProps) => {
  const containerSize = useBreakpointValue<ResponsiveValue<CSS.Property.Height>>({
    base: '325px',
    sm: '450px',
    md: '500px',
    lg: '600px'
  });

  const mainFolderPath = '/img/ryoshi-dynasties/heroes/'
  const isMobile = useBreakpointValue({ base: true, md: false })

  const [leftSrc, setLeftSrc] = useState<any>(null);
  const [rightSrc, setRightSrc] = useState<any>(null);

  useEffect(() => {
    setLeftSrc(mainFolderPath + (isMobile ? `/CLASS_ICONS_ROTATED.png` : `/LEFT_EQUIPMENT_SLOT.png`));
    setRightSrc(mainFolderPath + (isMobile ? `/CLASS_ICONS_ROTATED.png` : `/RIGHT_EQUIPMENT_SLOT.png`));

  }, [isMobile])

  return (
    <Grid
      templateAreas={{base:`
                      "top"
                      "left"
                      "main"
                      "right"
                      "bottom"
                      "bottom2"
                    `, md:`
                      "top top top"
                      "left main right"
                      "bottom bottom bottom2"
                  `}}
      gridTemplateRows={{
        base: '65px 50px 1fr 50px 80px 80px', 
        sm: '75px 75px 1fr 75px 90px', 
        md: '100px 1fr 100px'}}
      gridTemplateColumns={{base: '1fr', md: '75px 1fr 75px'}}
      gap={2}
      bg={"gray.900"}
      maxH={'100%'}
      maxW={'100%'}
    >
      <GridItem area={'top'}>
        <LevelContainer/>
      </GridItem>

      <GridItem area={'left'}>
        <Image
          h={'100%'}
          w={'100%'}
          src={leftSrc}
          // src={ImageService.translate(`/img/ryoshi-dynasties/heroes/RIGHT_EQUIPMENT_SLOT.png`).convert()}
        />
      </GridItem>

      <GridItem alignItems={'center'} area={'main'} position='relative' display='flex' >
        <Box
          h={containerSize}
          w={containerSize}
          borderRadius={'md'} 
          outline={'2px solid gray'}
        >
          <RdHero nftId={nftId}/>
        </Box>
      </GridItem>
      
      <GridItem area={'right'}>
        <Image
          h={'100%'}
          w={'100%'}
          src={rightSrc}
        />
      </GridItem>

      <GridItem area={'bottom'}>
        <StatsContainer />
      </GridItem >

      <GridItem area={'bottom2'}>
        <Stats2Container />
      </GridItem >

    </Grid>
  )
}

export default memo(RdHeroFrame);

interface ItemProps {
  stat: string;
  value: number;
}
const Item = ({stat, value}: ItemProps) => {
  return (
    <GridItem h={'20px'}>
      <HStack>
      <Text fontSize={{ base: 10, sm:12 }} textTransform={'uppercase'}> {stat}:</Text>
      <Text fontSize={{ base: 10, sm:12 }} as={'b'}> {value} </Text>
      </HStack>
    </GridItem>
  )
}

const LevelContainer = ({children}: any) => {
  const maxHp = 100;
  const hp = 70;
  const ryoshi = 55;
  const maxRyoshi = 100;
  const maxXp = 100;
  const xp = 30;

  const lvl = 2;
  const mainTrait = "Priest";
  const secondaryTrait = "Blacksmith";
  const icon = "tinker";
  const background = "cliffs";

  return(
      <Flex justifyContent={'space-between'} w={'100%'} height={'100%'}>

        <Image
          src={`/img/ryoshi-dynasties/heroes/CLASS_ICON_PALADIN.png`}
          p={2}
        />
        
        <VStack
            w={'20%'}
            spacing={-1}
            justifyContent={'center'}
            alignItems={'left'}
            >
          <Text as={'b'} fontSize={{ base: 12, sm:18, md: 24 }}>LEVEL: {lvl} </Text>
          <Text fontSize={{ base: 12, sm:16, md: 18 }}>{mainTrait} </Text>
          <Text fontSize={{ base: 10, sm:12, md: 12 }}>{secondaryTrait} </Text>
        </VStack>
        
        <VStack 
        w='60%'
        spacing={{ base: 1, md: 3 }}
        justifyContent={'center'}
        p={2}
        >
        <ProgressBar stat={"HP: " + hp + "/" + maxHp} value={hp/maxHp*100+": " + hp + "/" + maxHp} colorScheme={'blue'} borderColor={'navy'}/>
        <ProgressBar stat={'Ryoshi: ' + hp + "/" + maxHp } value={ryoshi/maxRyoshi*100} colorScheme={'orange'} borderColor={'orange'}/>
        <ProgressBar stat={'XP: '+ hp + "/" + maxHp} value={xp/maxXp*100} colorScheme={'purple'} borderColor={'purple'}/>
        </VStack>
      </Flex>
  )
}

const ProgressBar = ({stat, value, colorScheme, borderColor}: any) => {
  return (
    <>
    <Box w={'100%'} >
      <Flex justifyContent={'space-between'} w={'100%'}>
        <Progress rounded={'md'} h={{base: 3, sm: 4, md:5}} w={'100%'} colorScheme={colorScheme} size='md' value={value} border={'2px solid'}  borderColor={borderColor}/>
      </Flex>
      <Text pl={2} mt={{ base: -3, sm:-4, md: -5 }}  pos={'absolute'} as='b' fontSize={{ base: 10, sm:12, md: 12 }} textTransform={'uppercase'}> {stat}</Text>
    </Box>
    </>
  )
}

const StatsContainer = ({children}: any) => {
  const dextertity = 33;
  const strength = 45;
  const agility = 75;
  const luck = 6;
  const intellect = 22;
  const wisdom = 45;
  const charisma = 56;
  const honorGuard = 45;

  return(
    <Flex >
      <HStack justifyContent={'space-between'} w={'100%'} >
        <SimpleGrid 
          columns={3}
          borderRadius={'md'}
          p={2}
          border={'2px solid gray'}
          width={'100%'}
          maxW={'450px'}
          >
            <GridItem h={'18px'} 
            >
              <Text as={'b'} fontSize={{ base: 14, sm:16 }} > PLAYER STATS </Text>
            </GridItem>

            <Item stat={'Dextertity'} value={dextertity}/>
            <Item stat={'Luck'} value={luck}/>
            <Item stat={'Strength'} value={strength}/>
            <Item stat={'Intellect'} value={intellect}/>
            <Item stat={'Charisma'} value={charisma}/>
            <Item stat={'Agility'} value={agility}/>
            <Item stat={'Wisdom'} value={wisdom}/>
            <Item stat={'Honor Guard'} value={honorGuard}/>

          </SimpleGrid>
          
        </HStack>
      </Flex>
  )
}
const Stats2Container = ({children}: any) => {
  const resilience = 33;
  const clones = 200;

  return(
    <Flex 
      alignItems={'right'}
      justifyContent={'right'}
      >
          <VStack
            w={'100%'}
            minW={'200px'}
            >
            <Box
              borderRadius={'md'}
              backgroundColor={'gray.800'}
              w={'100%'}
              p={2}
              border={'2px solid gray'}
              height={'35px'}
              pt={0}
              pb={0}
              >
              <Text as={'b'} fontSize={{ base: 12, sm:12 }}>
                RES: {resilience}
              </Text>
            </Box>
            <Box
              borderRadius={'md'}
              backgroundColor={'gray.800'}
              w={'100%'}
              p={2}
              border={'2px solid gray'}
              height={'35px'}
              pt={0}
              pb={0}
              >
              <Text as={'b'} fontSize={{ base: 12, sm:12 }}>
                CLONES: {clones}
              </Text>
            </Box>
          </VStack>
      </Flex>
  )
}