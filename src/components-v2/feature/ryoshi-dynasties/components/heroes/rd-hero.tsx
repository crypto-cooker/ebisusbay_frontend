import {Flex, GridItem, HStack, Image, SimpleGrid,Text, VStack,Box, Grid, Progress, useBreakpointValue} from "@chakra-ui/react";
import React, {memo, useEffect, useRef, useState} from "react";
import heroesMetadata from "@src/components-v2/feature/ryoshi-dynasties/components/heroes/heroes-metadata.json";
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
  const GenerateHeroPNG = (nftId : string) => {
    let nft : NFTMetaData = heroesMetadata.Hero.find((nft) => nft.id == nftId) as NFTMetaData;
    // console.log(nft);

    setLocation(mainFolderPath +'Location/' + GetTraitType("Location", nft.attributes));
    setSkin(mainFolderPath +'Skin/'+GetTraitType('Skin', nft.attributes));
    setHair(mainFolderPath +'Hair/'+GetTraitType('Hair', nft.attributes));
    setEyes(mainFolderPath +'Eyes/'+GetTraitType('Eyes', nft.attributes));
    setMouth(mainFolderPath +'Mouth/'+GetTraitType('Mouth', nft.attributes));
    GetClothes(nft.attributes);
    setBorder(mainFolderPath +'border/'+GetBorder(nft.attributes));
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
        <Image h={size} w={size} src={location} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={skin} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={hair} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={eyes} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={mouth} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={markings} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={legs} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={feet} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={chest} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={belt} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={gloves} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={goggles} position={'absolute'} borderRadius={'md'} zIndex={0}/>
        <Image h={size} w={size} src={border} position={'absolute'} borderRadius={'md'} zIndex={0}/>
      </Flex> 
    </>
  )
}
export default RdHero;
