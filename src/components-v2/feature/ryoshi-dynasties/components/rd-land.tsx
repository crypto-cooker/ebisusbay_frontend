import {Box, BoxProps, Grid, GridItem, GridProps, Image} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import React, {ReactElement, useEffect, useRef} from "react";

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
  nFTMetaData: NFTMetaData;
}

const RdLand = ({nFTMetaData}: RdLandProps) => {

  const landTypeRef = useRef<any>(null);
  const underlandLeftImageRef = useRef<any>(null);
  const underlandMiddleImageRef = useRef<any>(null);
  const underlandRightImageRef = useRef<any>(null);
  const pathsImageRef = useRef<any>(null);
  const northImageRef = useRef<any>(null);
  const southImageRef = useRef<any>(null);
  const eastImageRef = useRef<any>(null);
  const westImageRef = useRef<any>(null);

  const GetTraitType = (traitType:string, attributes:Attribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == traitType){
        return attributes[i].value
      }
    }
    return "empty"
  }
  const GetDisplayType = (traitType:string, attributes:Attribute[]) => {
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].trait_type == traitType){
        return attributes[i].display_type
      }
    }
    return "Empty";
  }

  const GenerateLandPNG = (nft : NFTMetaData) => {

    let izanamiFolder = '/img/ryoshi-dynasties/lands/izanamisCradle/'
    console.log("Generate Land")

    landTypeRef.current.src = izanamiFolder +'LANDS/'+GetTraitType('landType', nft.attributes)+'.png'
    
    underlandLeftImageRef.current.src = izanamiFolder +'UNDERLAND LEFT/'+GetTraitType('underlandLeft', nft.attributes)+'(L).png'
    underlandMiddleImageRef.current.src = izanamiFolder +'UNDERLAND MIDDLE/'+GetTraitType('underlandMiddle', nft.attributes)+'(M).png'
    underlandRightImageRef.current.src = izanamiFolder +'UNDERLAND RIGHT/'+GetTraitType('underlandRight', nft.attributes)+'(R).png'

    northImageRef.current.src = izanamiFolder +GetDisplayType('northSpot', nft.attributes)+'/'+GetTraitType('northSpot', nft.attributes)+'.png'
    southImageRef.current.src = izanamiFolder +GetDisplayType('southSpot', nft.attributes)+'/'+GetTraitType('southSpot', nft.attributes)+'.png'
    eastImageRef.current.src = izanamiFolder +GetDisplayType('eastSpot', nft.attributes)+'/'+GetTraitType('eastSpot', nft.attributes)+'.png'
    westImageRef.current.src = izanamiFolder +GetDisplayType('westSpot', nft.attributes)+'/'+GetTraitType('westSpot', nft.attributes)+'.png'

    pathsImageRef.current.src = izanamiFolder +'PATHS/'+GetTraitType('road', nft.attributes)+'.png'
  }

  useEffect(() => {
    if(nFTMetaData){
      GenerateLandPNG(nFTMetaData)
    }
  },[nFTMetaData])

  return (
    <Box
    outline='4px #4c4859 solid'
    w={'368px'}
    h={'368px'}
    borderRadius='20px'
    >

    <Box
    bg='black'
    h={'200px'}
    w={'368px'}
    zIndex={20}
    borderRadius='20px'
    >
    <Image  h={'368px'} position={'absolute'} borderRadius='20px'
      src='/img/ryoshi-dynasties/lands/izanamisCradle/BACKGROUND/Green Background.png' zIndex={0}/>
    <Image   h={'368px'} position={'absolute'} 
      src='/img/ryoshi-dynasties/lands/izanamisCradle/LAND BASE/Green-Land.png' zIndex={0}/>

    <Image  h={'368px'} position={'absolute'}
      ref={landTypeRef} zIndex={1}/>

    <Image h={'368px'} position={'absolute'}
      ref={underlandLeftImageRef} zIndex={3}/>
    <Image h={'368px'} position={'absolute'}
      ref={underlandMiddleImageRef} zIndex={0}/>
    <Image h={'368px'} position={'absolute'}
      ref={underlandRightImageRef} zIndex={5}/>
    
    <Image maxW='50px' maxH='50px' position={'absolute'}
      ml='150px' mt='100px'
      ref={northImageRef}zIndex={4} />
    <Image maxW='50px' maxH='50px'position={'absolute'}
      ml='150px' mt='200px'
      ref={southImageRef} zIndex={4}/>
    <Image maxW='50px' maxH='50px' position={'absolute'}
      ml='250px' mt='150px'
      ref={eastImageRef} zIndex={4}/>
    <Image maxW='50px' maxH='50px'position={'absolute'}
      ml='50px' mt='150px'
      ref={westImageRef} zIndex={4}/>

    <Image h={'368px'} position={'absolute'}
      ref={pathsImageRef} zIndex={5}/>
    </Box>
</Box>
  )
}

export default RdLand;