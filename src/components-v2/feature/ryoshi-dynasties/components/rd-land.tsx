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
}

const RdLand = ({nftId, boxSize}: RdLandProps) => {

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
  const mainFolderPath = '/img/ryoshi-dynasties/lands/izanamisCradle/'
  const rockFolderPath = '/img/ryoshi-dynasties/lands/izanamisCradle/ROCKS/'
  const [size, setSize] = useState(184);
  const [isHighlands, setIsHighlands] = useState(false);

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

  const GenerateLandPNG = (nftId : string) => {
    console.log("Generating Land")
    let nft : NFTMetaData = landsMetadata.finalMetadata.find((nft) => nft.name == nftId) as NFTMetaData;
    let isCliffs = IsCliffs(nft.attributes);
    let folderPath = isCliffs ? rockFolderPath : mainFolderPath;
    // console.log(nft)

    landTypeRef.current.src = folderPath +'LANDS/'+GetTraitType('landType', nft.attributes);
    landsBaseRef.current.src = folderPath +'LAND BASE/' + (isCliffs ? 'Celestial-Cliffs.png' : 'Green-Land.png');
    landsBackgroundRef.current.src = folderPath +'BACKGROUND/'+ (isCliffs ? 'Grey-Background.png' : 'Green-Background.png');

    underlandLeftImageRef.current.src = folderPath +'UNDERLAND LEFT/'+GetTraitType('underlandLeft', nft.attributes, '(L)')
    underlandMiddleImageRef.current.src = folderPath +'UNDERLAND MIDDLE/'+GetTraitType('underlandMiddle', nft.attributes, '(M)')
    underlandRightImageRef.current.src = folderPath +'UNDERLAND RIGHT/'+GetTraitType('underlandRight', nft.attributes, '(R)')

    northImageRef.current.src = folderPath +GetDisplayType('northSpot', nft.attributes)+'/'+GetTraitType('northSpot', nft.attributes);
    southImageRef.current.src = folderPath +GetDisplayType('southSpot', nft.attributes)+'/'+GetTraitType('southSpot', nft.attributes);
    eastImageRef.current.src = folderPath +GetDisplayType('eastSpot', nft.attributes)+'/'+GetTraitType('eastSpot', nft.attributes);
    westImageRef.current.src = folderPath +GetDisplayType('westSpot', nft.attributes)+'/'+GetTraitType('westSpot', nft.attributes);

    if(IsHighlands(nft.attributes)){
      pathsImageRef.current.src = folderPath +'PATHS/'+GetTraitTypeHighlands('road', nft.attributes);
      setIsHighlands(true);
    }
    else{
      pathsImageRef.current.src = folderPath +'PATHS/'+GetTraitType('road', nft.attributes);
      setIsHighlands(false);
    }
  }

  useEffect(() => {
    console.log("nftId", nftId)
    if(nftId){
      GenerateLandPNG(nftId)
    }
  },[nftId])

  useEffect(() => {
    if(boxSize){
      setSize(boxSize)
    }
  },[boxSize])

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
    <Image  h={size} position={'absolute'} ref={landTypeRef} zIndex={1}/>

    <Image h={size} position={'absolute'}
      ref={underlandLeftImageRef} zIndex={5}/>
    <Image h={size} position={'absolute'}
      ref={underlandMiddleImageRef} zIndex={5}/>
    <Image h={size} position={'absolute'}
      ref={underlandRightImageRef} zIndex={5}/>
    
    <Image 
      ml={isHighlands ? size/3 : size/2.5} 
      mt={isHighlands ? size/12 : size/4}
      ref={northImageRef}zIndex={4} position={'absolute'} maxW={size/5} maxH={size/5} />
    <Image
      ml={isHighlands ? size/2.5 : size/2.5} 
      mt={isHighlands ? size/1.9 : size/2}
      ref={southImageRef} zIndex={4} position={'absolute'} maxW={size/5} maxH={size/5} />
    <Image 
      ml={isHighlands ? size/1.4 :size/1.5} 
      mt={isHighlands ? size/2.65 :size/2.75}
      ref={eastImageRef} zIndex={4} position={'absolute'} maxW={size/5} maxH={size/5} />
    <Image 
      ml={isHighlands ? size/12 : size/8} 
      mt={isHighlands ? size/3.75 :size/2.75}
      ref={westImageRef} zIndex={4} position={'absolute'} maxW={size/5}  maxH={size/5} />

    <Image h={size} position={'absolute'}
      ref={pathsImageRef} zIndex={3}/>
    </Box>
</Box>
  )
}

export default RdLand;