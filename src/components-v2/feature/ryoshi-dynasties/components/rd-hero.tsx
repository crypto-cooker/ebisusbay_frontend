import {Flex, GridItem, HStack, Image, SimpleGrid,Text, VStack,Box, Grid, Progress, useBreakpointValue} from "@chakra-ui/react";
import React, {memo, useEffect, useRef, useState} from "react";
import landsMetadata from "@src/components-v2/feature/ryoshi-dynasties/game/areas/lands/lands-metadata.json";
import {ResponsiveValue} from "@chakra-ui/styled-system";
import * as CSS from "csstype";

interface NFTMetaData{
  image : string;
  name : string;
  attributes : Attribute[];
}
interface Attribute{
  trait_type : string;
  value : string;
  display_type : string;
}
interface RdHeroProps {
  nftId: string;
}

interface MapOutlineProps {
  gridHeight?: string;
  gridWidth?: string;
}

const RdHeroFrame = ({ ...props}: MapOutlineProps) => {
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
        <RdHero nftId={"1"}/>
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

const RdHero = ({nftId}: RdHeroProps) => {
  const [landTypeRef, setLandTypeRef] = useState<any>(null);
  const [landsBaseRef, setLandsBaseRef] = useState<any>(null);
  const [landsBackgroundRef, setLandsBackgroundRef] = useState<any>(null);
  const [underlandLeftImageRef, setUnderlandLeftImageRef] = useState<any>(null);
  const [underlandMiddleImageRef, setUnderlandMiddleImageRef] = useState<any>(null);
  const [underlandRightImageRef, setUnderlandRightImageRef] = useState<any>(null);
  const [pathsImageRef, setPathsImageRef] = useState<any>(null);
  const [northImageRef, setNorthImageRef] = useState<any>(null);
  const [southImageRef, setSouthImageRef] = useState<any>(null);
  const [eastImageRef, setEastImageRef] = useState<any>(null);
  const [westImageRef, setWestImageRef] = useState<any>(null);
  const [waterSourceRef, setWaterSourceRef] = useState<any>(null);
  const [legendaryRef, setLegendaryRef] = useState<any>(null);
  const ref = useRef<HTMLDivElement>(null);
  const mainFolderPath = '/img/ryoshi-dynasties/heroes/'
  const containerSize = useBreakpointValue<ResponsiveValue<CSS.Property.Height>>({
    base: '325px',
    sm: '450px',
    md: '500px',
    lg: '600px'
  });
  const size = useBreakpointValue<ResponsiveValue<CSS.Property.Height>>({
    base: '325',
    sm: '450',
    md: '500',
    lg: '600'
  });
  const [landType, setLandType] = useState('')
  const GetTraitType = (traitType:string, attributes:Attribute[], underlandSpot?:string, animVersion?:boolean) => {
    if(!underlandSpot) underlandSpot = '';
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == traitType){
        let finalValue = attributes[i].value;
        if(attributes[i].value == 'Fairy-Fountain'){
          finalValue = 'Fairy-Fountain.gif';
        }
        else{
          if(attributes[i].value == 'Bramblethorn-Titan' || attributes[i].value == 'Moongate'){
            finalValue = attributes[i].value + 'Anim.png';
          }
          else{
          finalValue = attributes[i].value + underlandSpot + '.png';
        }
        }
      return finalValue;
    }
    }
    return "empty"+ underlandSpot +".png"
  }
  const GetDisplayType = (traitType:string, attributes:Attribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == traitType){
        return attributes[i].display_type
      }
    }
    return "Empty";
  }
  const IsHighlands = (attributes:Attribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == 'landType'){
        return attributes[i].value === "Highlands";
      }
    }
    return false;
  }
  const IsCliffs = (attributes:Attribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == 'landType'){
        return attributes[i].value === "Celestial-Cliffs";
      }
    }
    return false;
  }
  const GetTraitTypeHighlands = (traitType:string, attributes:Attribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == traitType){
        return attributes[i].value + '-Highlands.png';
      }
    }
    return "empty.png";
  }
  const GetLandType = (attributes:Attribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == 'landType'){
        return attributes[i].value;
      }
    }
    console.log("broken")
    return "broken";
  }
  const GenerateHeroPNG = (nftId : string) => {
    let nft : NFTMetaData = landsMetadata.finalMetadata.find((nft) => nft.id == nftId) as NFTMetaData;
    let isCliffs = IsCliffs(nft.attributes);
    let folderPath = mainFolderPath;

    // setLandType(GetLandType(nft.attributes));
    // setLandTypeRef(mainFolderPath +'LANDS/'+GetTraitType('landType', nft.attributes));

    setLandsBaseRef(mainFolderPath +'NFT_WITH_BORDER.png');
    // setLegendaryRef(mainFolderPath +'LEGENDARY/'+GetTraitType('legendary', nft.attributes, '', true));
    // setLandsBackgroundRef(mainFolderPath +'BACKGROUND/'+ (isCliffs ? 'Grey-Background.png' : 'Green-Background.png'));

    // setUnderlandLeftImageRef(folderPath +'UNDERLAND LEFT/'+GetTraitType('underlandLeft', nft.attributes, '(L)'))
    // setUnderlandMiddleImageRef(folderPath +'UNDERLAND MIDDLE/'+GetTraitType('underlandMiddle', nft.attributes, '(M)'))
    // setUnderlandRightImageRef(folderPath +'UNDERLAND RIGHT/'+GetTraitType('underlandRight', nft.attributes, '(R)'))

    // setNorthImageRef(folderPath +GetDisplayType('northSpot', nft.attributes)+'/'+GetTraitType('northSpot', nft.attributes, '', true));
    // setSouthImageRef(folderPath +GetDisplayType('southSpot', nft.attributes)+'/'+GetTraitType('southSpot', nft.attributes, '', true));
    // setEastImageRef(folderPath +GetDisplayType('eastSpot', nft.attributes)+'/'+GetTraitType('eastSpot', nft.attributes, '', true));
    // setWestImageRef(folderPath +GetDisplayType('westSpot', nft.attributes)+'/'+GetTraitType('westSpot', nft.attributes, '', true));

    // if(IsHighlands(nft.attributes)){
    //   setPathsImageRef(folderPath +'PATHS/'+GetTraitTypeHighlands('road', nft.attributes));
    //   setWaterSourceRef(folderPath +'PATHS/'+GetTraitTypeHighlands('waterSource', nft.attributes));
    // }
    // else{
    //   setPathsImageRef(folderPath +'PATHS/'+GetTraitType('road', nft.attributes));
    //   setWaterSourceRef(folderPath +'PATHS/'+GetTraitType('waterSource', nft.attributes));
    // }
  }
  const GetMarginLeft = (directional:string) => {
    //get size value out of size
    let sizeValue = Number(size);
    switch(landType){
      case 'Highlands':
        switch(directional){
          case "North":
            return sizeValue/3;
          case "South":
            return sizeValue/2.5;
          case "East":
            return sizeValue/1.4;
          case "West":
            return sizeValue/12;
        }
      case 'Beach':
        switch(directional){
          case "North":
            return sizeValue/2.75;
          case "South":
            return sizeValue/3;
          case "East":
            return sizeValue/1.7;
          case "West":
            return sizeValue/8;
        }
      default:
        switch(directional){
          case "North":
            return sizeValue/2.5;
          case "South":
            return sizeValue/2.5;
          case "East":
            return sizeValue/1.5;
          case "West":
            return sizeValue/8;
        }
    }
  }
  const GetMarginTop = (directional:string) => {
    let sizeValue = Number(size);
    switch(landType){
      case 'Highlands':
        switch(directional){
          case "North":
            return sizeValue/12;
          case "South":
            return sizeValue/1.9;
          case "East":
            return sizeValue/2.65;
          case "West":
            return sizeValue/3.75;
        }
      case 'Beach':
        switch(directional){
          case "North":
            return sizeValue/4.5;
          case "South":
            return sizeValue/2;
          case "East":
            return sizeValue/3;
          case "West":
            return sizeValue/2.75;
        }
      default:
        switch(directional){
          case "North":
            return sizeValue/4;
          case "South":
            return sizeValue/2;
          case "East":
            return sizeValue/2.75;
          case "West":
            return sizeValue/2.75;
        }
    }
  }

  useEffect(() => {
    if(nftId){
      GenerateHeroPNG(nftId)
    }
  },[nftId])

  return (
    <>
    <Flex
      ref={ref}
      h={containerSize}
      w={containerSize}
      borderRadius={'md'} 
      outline={'2px solid gray'}
    >
    <Image h={size} w={size}  position={'absolute'}  borderRadius={'md'} zIndex={0} src={landsBaseRef}/>
  
    {/* <Image h={size} w={size}  position={'absolute'} src={landsBackgroundRef} borderRadius={'md'} zIndex={0}/> */}

    {/* <Text zIndex={3} position={'absolute'} >{size}</Text> */}

    {/* <Image h={size} position={'absolute'} src={landsBaseRef} zIndex={0}/>
    <Image h={size} position={'absolute'} src={landTypeRef} zIndex={1}/>
    <Image h={size} position={'absolute'} src={legendaryRef} zIndex={2}/>

    <Image h={size} position={'absolute'}
      src={underlandLeftImageRef} zIndex={5}/>
    <Image h={size} position={'absolute'}
      src={underlandMiddleImageRef} zIndex={5}/>
    <Image h={size} position={'absolute'}
      src={underlandRightImageRef} zIndex={5}/>
    
    <Image 
      ml={GetMarginLeft("North")} 
      mt={GetMarginTop("North")}
      src={northImageRef}zIndex={4} position={'absolute'} maxW={size/5} maxH={size/5} />
    <Image
      ml={GetMarginLeft("South")} 
      mt={GetMarginTop("South")}
      src={southImageRef} zIndex={4} position={'absolute'} maxW={size/5} maxH={size/5} />
    <Image 
      ml={GetMarginLeft("East")} 
      mt={GetMarginTop("East")}
      src={eastImageRef} zIndex={4} position={'absolute'} maxW={size/5} maxH={size/5} />
    <Image 
      ml={GetMarginLeft("West")} 
      mt={GetMarginTop("West")}
      src={westImageRef} zIndex={4} position={'absolute'} maxW={size/5}  maxH={size/5} />

    <Image h={size} position={'absolute'} src={pathsImageRef} zIndex={3}/>
    <Image h={size} position={'absolute'} src={waterSourceRef} zIndex={3}/> */}

    </Flex> 
    </>
  )
}

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