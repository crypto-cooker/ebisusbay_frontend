import {Box, BoxProps, Grid, GridItem, GridProps, Image} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import landsMetadata from "@src/components-v2/feature/ryoshi-dynasties/game/areas/lands/lands-metadata.json";

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
interface RdLandProps {
  nftId: string;
  boxSize: number;
  specificNFT?: boolean;
}

const RdLand = ({nftId, boxSize, specificNFT}: RdLandProps) => {

  const landTypeRef = useRef<any>(null);
  const landsBaseRef = useRef<any>(null);
  const landsBackgroundRef = useRef<any>(null);
  const underlandLeftImageRef = useRef<any>(null);
  const underlandMiddleImageRef = useRef<any>(null);
  const underlandRightImageRef = useRef<any>(null);
  const pathsImageRef = useRef<any>(null);
  const northImageRef = useRef<any>(null);
  const southImageRef = useRef<any>(null);
  const eastImageRef = useRef<any>(null);
  const westImageRef = useRef<any>(null);
  const waterSourceRef = useRef<any>(null);
  const legendaryRef = useRef<any>(null);

  const mainFolderPath = '/img/ryoshi-dynasties/lands/izanamisCradle/'
  const rockFolderPath = '/img/ryoshi-dynasties/lands/izanamisCradle/ROCKS/'
  const [size, setSize] = useState(184);
  // const [isHighlands, setIsHighlands] = useState(false);
  const [landType, setLandType] = useState('')

  const GetTraitType = (traitType:string, attributes:Attribute[], underlandSpot?:string) => {
    if(!underlandSpot) underlandSpot = '';
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == traitType){

        return attributes[i].value === "Fairy-Fountain" ? attributes[i].value + '.gif' : attributes[i].value + underlandSpot + '.png';
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

  const GenerateLandPNG = (nftId : string) => {
    // console.log("Generating Land")
    let nft : NFTMetaData = landsMetadata.finalMetadata.find((nft) => nft.name == nftId) as NFTMetaData;
    let isCliffs = IsCliffs(nft.attributes);
    let folderPath = isCliffs ? rockFolderPath : mainFolderPath;
    // console.log(nft)

    setLandType(GetLandType(nft.attributes));
    landTypeRef.current.src = mainFolderPath +'LANDS/'+GetTraitType('landType', nft.attributes);
    landsBaseRef.current.src = mainFolderPath +'LAND BASE/' + (isCliffs ? 'Celestial-Cliffs.png' : 'Green-Land.png');
    legendaryRef.current.src = mainFolderPath +'LEGENDARY/'+GetTraitType('legendary', nft.attributes);
    landsBackgroundRef.current.src = mainFolderPath +'BACKGROUND/'+ (isCliffs ? 'Grey-Background.png' : 'Green-Background.png');

    underlandLeftImageRef.current.src = folderPath +'UNDERLAND LEFT/'+GetTraitType('underlandLeft', nft.attributes, '(L)')
    underlandMiddleImageRef.current.src = folderPath +'UNDERLAND MIDDLE/'+GetTraitType('underlandMiddle', nft.attributes, '(M)')
    underlandRightImageRef.current.src = folderPath +'UNDERLAND RIGHT/'+GetTraitType('underlandRight', nft.attributes, '(R)')

    northImageRef.current.src = folderPath +GetDisplayType('northSpot', nft.attributes)+'/'+GetTraitType('northSpot', nft.attributes);
    southImageRef.current.src = folderPath +GetDisplayType('southSpot', nft.attributes)+'/'+GetTraitType('southSpot', nft.attributes);
    eastImageRef.current.src = folderPath +GetDisplayType('eastSpot', nft.attributes)+'/'+GetTraitType('eastSpot', nft.attributes);
    westImageRef.current.src = folderPath +GetDisplayType('westSpot', nft.attributes)+'/'+GetTraitType('westSpot', nft.attributes);
    

    if(IsHighlands(nft.attributes)){
      pathsImageRef.current.src = folderPath +'PATHS/'+GetTraitTypeHighlands('road', nft.attributes);
      waterSourceRef.current.src = folderPath +'PATHS/'+GetTraitTypeHighlands('waterSource', nft.attributes);
      // setIsHighlands(true);
    }
    else{
      pathsImageRef.current.src = folderPath +'PATHS/'+GetTraitType('road', nft.attributes);
      waterSourceRef.current.src = folderPath +'PATHS/'+GetTraitType('waterSource', nft.attributes);
      // setIsHighlands(false);
    }
  }

  useEffect(() => {
    console.log("nftId", nftId)
    if(nftId){
      GenerateLandPNG(nftId)
    }
  },[nftId])

  useEffect(() => {
    // console.log("landType", landType)
  },[landType])
  
  useEffect(() => {
    if(boxSize){
      setSize(boxSize)
    }
  },[boxSize])

  const GetMarginLeft = (directional:string) => {
    switch(landType){
      case 'Highlands':
        switch(directional){
          case "North":
            return size/3;
          case "South":
            return size/2.5;
          case "East":
            return size/1.4;
          case "West":
            return size/12;
        }
      case 'Beach':
        switch(directional){
          case "North":
            return size/2.75;
          case "South":
            return size/3;
          case "East":
            return size/1.7;
          case "West":
            return size/8;
        }
      default:
        switch(directional){
          case "North":
            return size/2.5;
          case "South":
            return size/2.5;
          case "East":
            return size/1.5;
          case "West":
            return size/8;
        }
    }
  }
  
  const GetMarginTop = (directional:string) => {
    switch(landType){
      case 'Highlands':
        switch(directional){
          case "North":
            return size/12;
          case "South":
            return size/1.9;
          case "East":
            return size/2.65;
          case "West":
            return size/3.75;
        }
      case 'Beach':
        switch(directional){
          case "North":
            return size/4.5;
          case "South":
            return size/2;
          case "East":
            return size/3;
          case "West":
            return size/2.75;
        }
      default:
        switch(directional){
          case "North":
            return size/4;
          case "South":
            return size/2;
          case "East":
            return size/2.75;
          case "West":
            return size/2.75;
        }
    }
  }
  return (

    <Box
    outline='4px #4c4859 solid'
    w={size}
    h={size}
    borderRadius='20px'
    >

    <Box
    bg='black'
    w={size}
    h={size}
    zIndex={20}
    borderRadius='20px'
    >
    <Image h={size} position={'absolute'} ref={landsBackgroundRef} borderRadius='20px' zIndex={0}/>
    <Image h={size} position={'absolute'} ref={landsBaseRef} zIndex={0}/>
    <Image h={size} position={'absolute'} ref={landTypeRef} zIndex={1}/>
    <Image h={size} position={'absolute'} ref={legendaryRef} zIndex={2}/>

    <Image h={size} position={'absolute'}
      ref={underlandLeftImageRef} zIndex={5}/>
    <Image h={size} position={'absolute'}
      ref={underlandMiddleImageRef} zIndex={5}/>
    <Image h={size} position={'absolute'}
      ref={underlandRightImageRef} zIndex={5}/>
    
    <Image 
      ml={GetMarginLeft("North")} 
      mt={GetMarginTop("North")}
      ref={northImageRef}zIndex={4} position={'absolute'} maxW={size/5} maxH={size/5} />
    <Image
      ml={GetMarginLeft("South")} 
      mt={GetMarginTop("South")}
      ref={southImageRef} zIndex={4} position={'absolute'} maxW={size/5} maxH={size/5} />
    <Image 
      ml={GetMarginLeft("East")} 
      mt={GetMarginTop("East")}
      ref={eastImageRef} zIndex={4} position={'absolute'} maxW={size/5} maxH={size/5} />
    <Image 
      ml={GetMarginLeft("West")} 
      mt={GetMarginTop("West")}
      ref={westImageRef} zIndex={4} position={'absolute'} maxW={size/5}  maxH={size/5} />

    <Image h={size} position={'absolute'} ref={pathsImageRef} zIndex={3}/>
    <Image h={size} position={'absolute'} ref={waterSourceRef} zIndex={3}/>
    </Box>
</Box>
  )
}

export default RdLand;