import {Flex, GridItem, HStack, Image, SimpleGrid,Text, VStack,Box, Grid, Progress, useBreakpointValue, Button} from "@chakra-ui/react";
import React, {memo, useEffect, useRef, useState} from "react";
import RdHero from "@src/components-v2/feature/ryoshi-dynasties/components/heroes/rd-hero";
import {ResponsiveValue} from "@chakra-ui/styled-system";
import * as CSS from "csstype";
import heroesMetadata from "@src/components-v2/feature/ryoshi-dynasties/components/heroes/heroes-metadata.json";

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
interface NFTMetaData{
  image : string;
  name : string;
  attributes : Attribute[];
  stats : NumberAttribute[];
}
interface NumberAttribute{
  trait_type : string;
  value : number;
  display_type : string;
}
interface Attribute{
  trait_type : string;
  value : string;
  display_type : string;
}
export interface RdHeroProps {
  nftId: string;
  rounded?: ResponsiveValue<CSS.Property.BorderRadius>
}

const RdHeroFrame = ({nftId} : MapOutlineProps) => {

  const mainFolderPath = '/img/ryoshi-dynasties/heroes/'
  const isMobile = useBreakpointValue({ base: true, lg: false })

  const [leftSrc, setLeftSrc] = useState<any>(null);
  const [rightSrc, setRightSrc] = useState<any>(null);
  const [nft, setNft] = useState<NFTMetaData>();
  const [heroClass, setHeroClass] = useState<string>('');
  const [rarity, setRarity] = useState<string>('');
  const [maxArmySize, setMaxArmySize] = useState<string>('');
  const [profession, setProfession] = useState<string>('');
  const [cha, setCha] = useState<number>(0);
  const [heroName, setHeroName] = useState<string>('');
  const [honorGuard, setHonorGuard] = useState<string>('');
  const [armySize, setArmySize] = useState<number>(0);

  const [size, setSize] = useState<number>(1);
  const ref = useRef<HTMLDivElement>(null);

  const rowHeight = useBreakpointValue<ResponsiveValue<CSS.Property.Height>>({
      base: '65px 50px 1fr 50px 80px 80px', 
      sm: '65px 75px 1fr 75px 80px 80px', 
      md: '75px 55px 1fr 55px 90px', 
      lg: '100px 375px 100px',
      xl: '100px 350px 100px',
      '2xl': '100px 450px 100px'
  });
  const columnWidth = useBreakpointValue<ResponsiveValue<CSS.Property.Width>>({
    base: '1fr', 
    lg: '65px 305px 65px',
    xl: '75px 350px 75px',
    '2xl': '75px 1fr 75px'
  });
  const maxContainerWidth = useBreakpointValue<ResponsiveValue<CSS.Property.Width>>({
    base: '100%', 
    lg: '455px',
    xl: '525px',
    '2xl': '100%'
  });
  const containerSize = useBreakpointValue<ResponsiveValue<CSS.Property.Height>>({
    base: '275px',
    sm: '400px',
    md: '300px',
    lg: '305px',
    xl: '350px',
    '2xl': '450px'
  });

  const GetMaxArmySize = (heroClass:string) => {
    switch(heroClass){
      case 'Rogue':
        return 60;
      case 'Warrior':
        return 75;
      case 'Priest':
        return 45;
      case 'Druid':
        return 60;
      case 'Paladin':
        return 50;
      case 'Tinkerer':
        return 70;
      case 'Mage':
        return 50;
      default:
        return 0;
    }
  }
  const GetRarityFactor = (rarity:string) => {
    switch(rarity){
      case 'Common':
        return 1;
      case 'Uncommon':
        return 1.1;
      case 'Rare':
        return 1.2;
      case 'Epic':
        return 1.3;
      case 'Legendary':
        return 1.5;
      case 'Mythic':
        return 2;
      default:
        return 1;
    }
  }
  const GetStats = (attributes:NumberAttribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if (attributes[i].trait_type == 'CHA'){
        setCha(attributes[i].value);
      }
    }
  }

  const GetBaseHonorGuard = (heroClass:string) => {
    switch(heroClass){
      case 'Rogue':
        return 10;
      case 'Warrior':
        return 15;
      case 'Priest':
        return 7;
      case 'Druid':
        return 10;
      case 'Paladin':
        return 7;
      case 'Tinkerer':
        return 20;
      case 'Mage':
        return 10;
      default:
        return 0;
    }
  }

  useEffect(() => {
    setLeftSrc(mainFolderPath + (isMobile ? `/CLASS_ICONS_ROTATED.png` : `/LEFT_EQUIPMENT_SLOT.png`));
    setRightSrc(mainFolderPath + (isMobile ? `/CLASS_ICONS_ROTATED.png` : `/RIGHT_EQUIPMENT_SLOT.png`));

  }, [isMobile])

  const GetHeroNFT = (nftId : string) => {
    setNft(heroesMetadata.Hero.find((nft) => nft.id == nftId) as NFTMetaData);
    
  }


  useEffect(() => {
    if(nftId){
      GetHeroNFT(nftId)
    }
  },[nftId])

  useEffect(() => {
    if(!nft) return;

    setHeroClass(nft.attributes.find((attribute) => attribute.trait_type == 'Class')?.value as string);
    setRarity(nft.attributes.find((attribute) => attribute.trait_type == 'Rarity')?.value as string);
    GetStats(nft.stats);
    setProfession(nft.attributes.find((attribute) => attribute.trait_type == 'Profession')?.value as string);
    setHeroName(nft.name);

  },[nft])

  useEffect(() => {
    let baseHonorGuard = GetMaxArmySize(heroClass);
    let rarityFactor = GetRarityFactor(rarity);
    setMaxArmySize((baseHonorGuard + (10*1)+ ((1 +(0.01* cha)) * rarityFactor)).toFixed());

  }, [heroClass, cha])

  useEffect(() => {
    //get width of this component
    if(!ref.current) return;

    setSize(ref.current.getBoundingClientRect().width);

  },[ref.current]) 

  useEffect(() => {
    function handleResize(){
      if(!ref.current) return;
      
      setSize(ref.current.getBoundingClientRect().width);
    }
    window.addEventListener('resize', handleResize)
  })

  useEffect(() => {
    let baseHonorGuard = GetBaseHonorGuard(heroClass);
    let rarityFactor = GetRarityFactor(rarity);
    setHonorGuard((baseHonorGuard + (10*1)+ ((1 +(0.01* cha)) * rarityFactor)).toFixed());
  }, [heroClass, cha])

  return (
    <>
    <Grid
      templateAreas={{base:`
                      "top"
                      "left"
                      "main"
                      "right"
                      "bottom"
                      "bottom2"
                    `, lg:`
                      "top top top"
                      "left main right"
                      "bottom bottom bottom2"
                  `}}
      gridTemplateRows={rowHeight}
      gridTemplateColumns={columnWidth}
      gap={2}
      bg={"gray.900"}
      maxH={'100%'}
      maxW={maxContainerWidth}
    >
      <GridItem area={'top'}>
        <TopContainer heroClass={heroClass} profession={profession} name={heroName} armySize={armySize} maxArmySize={Number(maxArmySize)}/>
      </GridItem>

      <GridItem area={'left'}>
        <Image
          h={'100%'}
          w={'100%'}
          src={leftSrc}
          // src={ImageService.translate(`/img/ryoshi-dynasties/heroes/RIGHT_EQUIPMENT_SLOT.png`).convert()}
        />
      </GridItem>

      <GridItem alignItems={'center'} area={'main'} position='relative' display='flex' 
      alignContent={'center'}
       alignSelf = {'center'} justifyContent={'center'}
       >
        <Box
          h={containerSize}
          w={containerSize}
          borderRadius={'md'} 
          outline={'2px solid gray'}
        >
          <RdHero nftId={nftId} showStats={false}/>
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
        { nft && <StatsContainer attributes={nft.stats} /> }
      </GridItem >

      <GridItem area={'bottom2'}>
        <Stats2Container honorGuard={Number(honorGuard)}/>
      </GridItem >

    </Grid>
    </>
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
interface TopContainerProps{
  heroClass: string;
  children?: React.ReactNode;
  profession: string;
  name: string;
  armySize: number;
  maxArmySize: number;
}

const TopContainer = ({heroClass, profession, name, armySize, maxArmySize}: TopContainerProps) => {
  const maxHp = 100;
  const hp = 100;
  const maxXp = 100;
  const xp = 0;
  const lvl = 1;

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
            minW={'100px'}
            >
          <Text as={'b'} overflowX="visible" fontSize={{ base: 12, sm:16, md: 18 }}> {name} </Text>
          <Text fontSize={{ base: 12, sm:16, md: 18 }}> {heroClass} </Text>
          <Text fontSize={{ base: 10, sm:12, md: 12 }}>{profession} Lvl: {lvl}</Text>
        </VStack>
        
        <VStack 
        w='60%'
        spacing={{ base: 1, lg: 3 }}
        justifyContent={'center'}
        p={2}
        >
        <ProgressBar stat={"HP: " + hp + "/" + maxHp} value={hp/maxHp*100+": " + hp + "/" + maxHp} colorScheme={'blue'} borderColor={'navy'}/>
        <ProgressBar stat={'Ryoshi: ' + armySize + "/" + maxArmySize } value={0/maxArmySize*100} colorScheme={'orange'} borderColor={'orange'}/>
        <ProgressBar stat={'XP: '+ hp + "/" + maxHp} value={xp/maxXp*100} colorScheme={'purple'} borderColor={'purple'}/>
        </VStack>
      </Flex>
  )
}

const ProgressBar = ({stat, value, colorScheme, borderColor}: any) => {
  return (
    <>
    <Box w={'100%'} 
    alignItems= {'left'}
    justifyContent= {'left'}
    
    >
      <Flex justifyContent={'space-between'} w={'100%'}>
        <Progress rounded={'md'} h={{base: 3, sm: 4, md:5}} w={'100%'} colorScheme={colorScheme} size='md' value={value} border={'2px solid'}  borderColor={borderColor}/>
      </Flex>
      <Flex justifyContent={'space-between'} w={'100%'}>
      <Text 
      pl={2} mt={{ base: -3, sm:-4, md: -5 }}  pos={'absolute'} as='b' fontSize={{ base: 10, sm:12, md: 12 }} textTransform={'uppercase'}> 
      {stat}</Text>
      </Flex>
    </Box>
    </>
  )
}

interface statsAttribute{
  attributes:NumberAttribute[]
}

const StatsContainer = ({attributes}: statsAttribute) => {

  const [str, setStr] = useState<number>(0);
  const [dex, setDex] = useState<number>(0);
  const [int, setInt] = useState<number>(0);
  const [wis, setWis] = useState<number>(0);
  const [agi, setAgi] = useState<number>(0);
  const [luk, setLuk] = useState<number>(0);
  const [cha, setCha] = useState<number>(0);

  const GetStats = (attributes:NumberAttribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == 'STR'){
        setStr(attributes[i].value);
      } else if (attributes[i].trait_type == 'DEX'){
        setDex(attributes[i].value);
      } else if (attributes[i].trait_type == 'INT'){
        setInt(attributes[i].value);
      } else if (attributes[i].trait_type == 'WIS'){
        setWis(attributes[i].value);
      } else if (attributes[i].trait_type == 'AGI'){
        setAgi(attributes[i].value);
      } else if (attributes[i].trait_type == 'LUCK'){
        setLuk(attributes[i].value);
      } else if (attributes[i].trait_type == 'CHA'){
        setCha(attributes[i].value);
      }
    }
  }
  useEffect(() => {
    GetStats(attributes);
  }, [attributes])

  return(
    <Flex >
      <HStack justifyContent={'space-between'} w={'100%'} >
        <SimpleGrid 
          columns={3}
          borderRadius={'md'}
          p={2}
          border={'2px solid gray'}
          width={'100%'}
          maxW={{ base: '480px', sm: '480px', md: '350px', lg: '290px', xl: '360px', '2xl':"480px" }}
          >
            <GridItem h={'20px'} textAlign={'left'} alignContent={'center'}>
              <HStack>
                <Text as={'b'} fontSize={{ base: 12, sm: 14, md:14, lg:12, xl:16 }} textAlign={'left'} > PLAYER STATS </Text>
              </HStack>
            </GridItem>

            <Item stat={'Dextertity'} value={dex}/>
            <Item stat={'Luck'} value={luk}/>
            <Item stat={'Strength'} value={str}/>
            <Item stat={'Intellect'} value={int}/>
            <Item stat={'Charisma'} value={cha}/>
            <Item stat={'Agility'} value={agi}/>
            <Item stat={'Wisdom'} value={wis}/>

          </SimpleGrid>
          
        </HStack>
      </Flex>
  )
}

interface stats2Attribute{
  honorGuard?:number
}

const Stats2Container = ({honorGuard}: stats2Attribute) => {
  const resilience = 0;
  const clones = 0;

  return(
    <Flex 
      alignItems={'right'}
      justifyContent={'right'}
      >
          <VStack
            w={'100%'}
            minW={'150px'}
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
              Honor Guard: {honorGuard}
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