import {Box, BoxProps, Grid, GridItem, GridProps, Image} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import React, {ReactElement, useEffect, useRef} from "react";
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
  const underlandLeftImageRef = useRef<any>(null);
  const underlandMiddleImageRef = useRef<any>(null);
  const underlandRightImageRef = useRef<any>(null);
  const pathsImageRef = useRef<any>(null);
  const northImageRef = useRef<any>(null);
  const southImageRef = useRef<any>(null);
  const eastImageRef = useRef<any>(null);
  const westImageRef = useRef<any>(null);
  const izanamiFolder = '/img/ryoshi-dynasties/lands/izanamisCradle/'
  const [size, setSize] = React.useState(184);


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

  const GenerateLandPNG = (nftId : string) => {
    console.log("Generating Land")
    let nft : NFTMetaData = landsMetadata.finalMetadata.find((nft) => nft.name == nftId) as NFTMetaData;
    // console.log(nft)

    landTypeRef.current.src = izanamiFolder +'LANDS/'+GetTraitType('landType', nft.attributes);
    
    underlandLeftImageRef.current.src = izanamiFolder +'UNDERLAND LEFT/'+GetTraitType('underlandLeft', nft.attributes, '(L)')
    underlandMiddleImageRef.current.src = izanamiFolder +'UNDERLAND MIDDLE/'+GetTraitType('underlandMiddle', nft.attributes, '(M)')
    underlandRightImageRef.current.src = izanamiFolder +'UNDERLAND RIGHT/'+GetTraitType('underlandRight', nft.attributes, '(R)')

    northImageRef.current.src = izanamiFolder +GetDisplayType('northSpot', nft.attributes)+'/'+GetTraitType('northSpot', nft.attributes);
    southImageRef.current.src = izanamiFolder +GetDisplayType('southSpot', nft.attributes)+'/'+GetTraitType('southSpot', nft.attributes);
    eastImageRef.current.src = izanamiFolder +GetDisplayType('eastSpot', nft.attributes)+'/'+GetTraitType('eastSpot', nft.attributes);
    westImageRef.current.src = izanamiFolder +GetDisplayType('westSpot', nft.attributes)+'/'+GetTraitType('westSpot', nft.attributes);

    pathsImageRef.current.src = izanamiFolder +'PATHS/'+GetTraitType('road', nft.attributes);
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
    <Image  h={size} position={'absolute'} borderRadius='20px'
      src='/img/ryoshi-dynasties/lands/izanamisCradle/BACKGROUND/Green Background.png' zIndex={0}/>
    <Image   h={size} position={'absolute'} 
      src='/img/ryoshi-dynasties/lands/izanamisCradle/LAND BASE/Green-Land.png' zIndex={0}/>

    <Image  h={size} position={'absolute'}
      ref={landTypeRef} zIndex={1}/>

    <Image h={size} position={'absolute'}
      ref={underlandLeftImageRef} zIndex={5}/>
    <Image h={size} position={'absolute'}
      ref={underlandMiddleImageRef} zIndex={5}/>
    <Image h={size} position={'absolute'}
      ref={underlandRightImageRef} zIndex={5}/>
    
    <Image maxW={size/5} maxH={size/5} position={'absolute'}
      ml={size/2.5} mt={size/5}
      ref={northImageRef}zIndex={4} />
    <Image maxW={size/5} maxH={size/5} position={'absolute'}
      ml={size/2.5} mt={size/2}
      ref={southImageRef} zIndex={4}/>
    <Image maxW={size/5} maxH={size/5} position={'absolute'}
      ml={size/1.5} mt={size/2.5}
      ref={eastImageRef} zIndex={4}/>
    <Image maxW={size/5} maxH={size/5} position={'absolute'}
      ml={size/8} mt={size/2.5}
      ref={westImageRef} zIndex={4}/>

    <Image h={size} position={'absolute'}
      ref={pathsImageRef} zIndex={5}/>
    </Box>
</Box>
  )
}

export default RdLand;