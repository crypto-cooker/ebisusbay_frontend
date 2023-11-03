import {Flex, GridItem, HStack, Image, Text} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import heroesMetadata from "@src/components-v2/feature/ryoshi-dynasties/components/heroes/heroes-metadata.json";
import {ResponsiveValue} from "@chakra-ui/styled-system";
import * as CSS from "csstype";
import ImageService from "@src/core/services/image";

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

const RdHero = ({nftId, rounded}: RdHeroProps) => {

  const [location, setLocation] = useState<any>(null);
  const [skin, setSkin] = useState<any>(null);
  const [hair, setHair] = useState<any>(null);
  const [eyes, setEyes] = useState<any>(null);
  const [mouth, setMouth] = useState<any>(null);
  const [border, setBorder] = useState<any>(null);

  const [legs, setLegs] = useState<any>(null);
  const [feet, setFeet] = useState<any>(null);
  const [chest, setChest] = useState<any>(null);
  const [belt, setBelt] = useState<any>(null);
  const [gloves, setGloves] = useState<any>(null);
  const [markings, setMarkings] = useState<any>(null);
  const [goggles, setGoggles] = useState<any>(null);

  const [size, setSize] = useState<number>(1);
  const ref = useRef<HTMLDivElement>(null);
  const mainFolderPath = '/img/ryoshi-dynasties/heroes/'

  const [str, setStr] = useState<number>(0);
  const [dex, setDex] = useState<number>(0);
  const [int, setInt] = useState<number>(0);
  const [wis, setWis] = useState<number>(0);
  const [agi, setAgi] = useState<number>(0);
  const [luk, setLuk] = useState<number>(0);
  const [cha, setCha] = useState<number>(0);
  
  const GetTraitType = (traitType:string, attributes:Attribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == traitType){
        return attributes[i].value + '.png';
      }
    }
    console.log("broken")
    return "broken";
  }
  const GetClothes = (attributes:Attribute[]) => {
    let heroClass = ""
    let clothesColor = ""
    let heroRarity = ""
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == 'Rarity'){
        heroRarity = attributes[i].value;
      } else if (attributes[i].trait_type == 'Class'){
        heroClass = attributes[i].value;
      } else if (attributes[i].trait_type == 'Clothes'){
        clothesColor = attributes[i].value;
      }
    }
    clothesColor = heroRarity != "" ? "Alt" : clothesColor;
    setLegs(mainFolderPath + "/HeroClass/" +heroClass+'/Legs/'+clothesColor+'.png');
    setFeet(mainFolderPath + "/HeroClass/" +heroClass+'/Feet/'+clothesColor+'.png');
    setChest(mainFolderPath + "/HeroClass/" +heroClass+'/Chest/'+clothesColor+'.png');
    setBelt(mainFolderPath + "/HeroClass/" +heroClass+'/Belt/'+clothesColor+'.png');
    setGloves(mainFolderPath + "/HeroClass/" +heroClass+'/Gloves/'+clothesColor+'.png');

    setMarkings(mainFolderPath + (IsDruid(attributes) ? '/HeroClass/Druid/Markings/' : '/HeroClass/Empty/')+clothesColor+'.png');
    setGoggles(mainFolderPath + (IsTinkerer(attributes) ? '/HeroClass/Tinkerer/Goggles' : '/HeroClass/Empty/')+clothesColor+'.png');
  }
  const IsDruid = (attributes:Attribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == 'Class'){
        return attributes[i].value === "Druid";
      }
    }
    return false;
  }
  const IsTinkerer = (attributes:Attribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == 'Class'){
        return attributes[i].value === "Tinkerer";
      }
    }
    return false;
  }
  const GetBorder = (attributes:Attribute[]) => {
    let shinyString = ""
    let rarityString =""
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == 'Rarity'){
        rarityString = attributes[i].value;
      } else if (attributes[i].trait_type == 'Shiny'){
        shinyString = "Shiny";
      }
    }
    return rarityString + shinyString + '.png';
  }
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
      } else if (attributes[i].trait_type == 'LUK'){
        setLuk(attributes[i].value);
      } else if (attributes[i].trait_type == 'CHA'){
        setCha(attributes[i].value);
      }
    }
  }

  const GenerateHeroPNG = (nftId : string) => {
    let nft : NFTMetaData = heroesMetadata.Hero.find((nft) => nft.id == nftId) as NFTMetaData;
    // console.log(nft);

    setLocation(mainFolderPath +'Location/' + GetTraitType("Location", nft.attributes));
    setSkin(mainFolderPath +'Skin/'+GetTraitType('Skin', nft.attributes));
    setHair(mainFolderPath +'Hair/'+GetTraitType('Hair', nft.attributes));
    setEyes(mainFolderPath +'Eyes/'+GetTraitType('Eyes', nft.attributes));
    setMouth(mainFolderPath +'Mouth/'+GetTraitType('Mouth', nft.attributes));
    setBorder(mainFolderPath +'Border/'+GetBorder(nft.attributes));
    GetClothes(nft.attributes);
    GetStats(nft.stats);
  }

  useEffect(() => {
    if(nftId){
      GenerateHeroPNG(nftId)
    }
  },[nftId])

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

  return (
    <>
      <Flex
        ref={ref}
        h={size}
        borderRadius={'md'} 
        outline={rounded}
      >
        {!!location && <Image h={size} w={size} src={ImageService.translate(location).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!skin && <Image h={size} w={size} src={ImageService.translate(skin).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!hair && <Image h={size} w={size} src={ImageService.translate(hair).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!eyes && <Image h={size} w={size} src={ImageService.translate(eyes).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!mouth && <Image h={size} w={size} src={ImageService.translate(mouth).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!markings && <Image h={size} w={size} src={ImageService.translate(markings).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!legs && <Image h={size} w={size} src={ImageService.translate(legs).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!feet && <Image h={size} w={size} src={ImageService.translate(feet).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!chest && <Image h={size} w={size} src={ImageService.translate(chest).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!belt && <Image h={size} w={size} src={ImageService.translate(belt).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!gloves && <Image h={size} w={size} src={ImageService.translate(gloves).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!goggles && <Image h={size} w={size} src={ImageService.translate(goggles).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}
        {!!border && <Image h={size} w={size} src={ImageService.translate(border).convert()} position={'absolute'} borderRadius={'md'} zIndex={0}/>}

        {/* <SimpleGrid
          h={size*0.25}
          w={size}
          position={'absolute'}
          bg={'#111219'}
          borderTopColor={'#30333f'}
          borderTopWidth={{ base: 4, sm:4, md: 4 }}
          columns={4}
          bottom={0}
          paddingLeft={2}
          paddingRight={2}
          paddingTop={1}
          spacingX={{ base:1, sm:1, md: 2 }}
          mt={-2}

          >
          <Text as={'b'} fontSize={{ base: 8, sm: 8, md: 10 }}> STATS:</Text>
          <HeroStatItem stat={"STR"} value={str}/>
          <HeroStatItem stat={"DEX"} value={dex}/>
          <HeroStatItem stat={"INT"} value={int}/>
          <HeroStatItem stat={"WIS"} value={wis}/>
          <HeroStatItem stat={"AGI"} value={agi}/>
          <HeroStatItem stat={"LUK"} value={luk}/>
          <HeroStatItem stat={"CHA"} value={cha}/>
        </SimpleGrid> */}
      </Flex> 
    </>
  )
}
export default RdHero;

interface HeroStatItemProps {
  stat : string;
  value : number;
}
const HeroStatItem = ({stat, value}: HeroStatItemProps) => {
  return (
    <GridItem>
      <HStack justifyContent={'space-between'}>
      <Text fontSize={{ base: 8, sm:12, md: 12 }}>{stat}</Text>
      <Text fontSize={{ base: 8, sm:12, md: 12 }}>{value}</Text>
      </HStack>
    </GridItem>
  )
}