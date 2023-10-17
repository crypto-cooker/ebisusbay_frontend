import {Flex, Image} from "@chakra-ui/react";
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
interface RdLandProps {
  nftId: string;
  // boxSize: number;
  // forceBoxSize?: boolean;
  rounded?: ResponsiveValue<CSS.Property.BorderRadius>
}

const RdLand = ({nftId, rounded}: RdLandProps) => {

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

  const mainFolderPath = '/img/ryoshi-dynasties/lands/izanamisCradle/'
  const rockFolderPath = '/img/ryoshi-dynasties/lands/izanamisCradle/ROCKS/'
  const [size, setSize] = useState<number>(1);
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
  const GenerateLandPNG = (nftId : string) => {
    let nft : NFTMetaData = landsMetadata.finalMetadata.find((nft) => nft.id == nftId) as NFTMetaData;
    let isCliffs = IsCliffs(nft.attributes);
    let folderPath = isCliffs ? rockFolderPath : mainFolderPath;

    setLandType(GetLandType(nft.attributes));
    setLandTypeRef(mainFolderPath +'LANDS/'+GetTraitType('landType', nft.attributes));

    setLandsBaseRef(mainFolderPath +'LAND BASE/' + (isCliffs ? 'Celestial-Cliffs.png' : 'Green-Land.png'));
    setLegendaryRef(mainFolderPath +'LEGENDARY/'+GetTraitType('legendary', nft.attributes, '', true));
    setLandsBackgroundRef(mainFolderPath +'BACKGROUND/'+ (isCliffs ? 'Grey-Background.png' : 'Green-Background.png'));

    setUnderlandLeftImageRef(folderPath +'UNDERLAND LEFT/'+GetTraitType('underlandLeft', nft.attributes, '(L)'))
    setUnderlandMiddleImageRef(folderPath +'UNDERLAND MIDDLE/'+GetTraitType('underlandMiddle', nft.attributes, '(M)'))
    setUnderlandRightImageRef(folderPath +'UNDERLAND RIGHT/'+GetTraitType('underlandRight', nft.attributes, '(R)'))

    setNorthImageRef(folderPath +GetDisplayType('northSpot', nft.attributes)+'/'+GetTraitType('northSpot', nft.attributes, '', true));
    setSouthImageRef(folderPath +GetDisplayType('southSpot', nft.attributes)+'/'+GetTraitType('southSpot', nft.attributes, '', true));
    setEastImageRef(folderPath +GetDisplayType('eastSpot', nft.attributes)+'/'+GetTraitType('eastSpot', nft.attributes, '', true));
    setWestImageRef(folderPath +GetDisplayType('westSpot', nft.attributes)+'/'+GetTraitType('westSpot', nft.attributes, '', true));

    if(IsHighlands(nft.attributes)){
      setPathsImageRef(folderPath +'PATHS/'+GetTraitTypeHighlands('road', nft.attributes));
      setWaterSourceRef(folderPath +'PATHS/'+GetTraitTypeHighlands('waterSource', nft.attributes));
    }
    else{
      setPathsImageRef(folderPath +'PATHS/'+GetTraitType('road', nft.attributes));
      setWaterSourceRef(folderPath +'PATHS/'+GetTraitType('waterSource', nft.attributes));
    }
  }

  useEffect(() => {
    if(nftId){
      GenerateLandPNG(nftId)
    }
  },[nftId])

  useEffect(() => {
    //get width of this component
    if(!ref.current) return;

    setSize(ref.current.getBoundingClientRect().width);

  },[ref.current]) 

  useEffect(() => {
    // console.log('(size/5)', (size/5)/3);
  },[size]) 

  useEffect(() => {
    function handleResize(){
      if(!ref.current) return;
      
      setSize(ref.current.getBoundingClientRect().width);
    }
    window.addEventListener('resize', handleResize)
  })

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
  // const GetMarginTop = (directional:string) : string  => {
  //   let margin =""
  //   switch(landType){
  //     case 'Highlands':
  //       switch(directional){
  //         case "North":
  //           margin = (size/12).toString();
  //         case "South":
  //           margin = ( size/1.9).toString();
  //         case "East":
  //           margin = (size/2.65).toString();
  //         case "West":
  //           margin = (size/3.75).toString();
  //       }
  //     case 'Beach':
  //       switch(directional){
  //         case "North":
  //           margin = (size/4.5).toString();
  //         case "South":
  //           margin = (size/2).toString();
  //         case "East":
  //           margin = (size/3).toString();
  //         case "West":
  //           margin = (size/2.75).toString();
  //       }
  //     default:
  //       switch(directional){
  //         case "North":
  //           margin = (size/4).toString();
  //         case "South":
  //           margin = (size/2).toString();
  //         case "East":
  //           margin = (size/2.75).toString();
  //         case "West":
  //           margin = (size/2.75).toString();
  //       }
  //   }
  //   margin +="px";
  //   console.log(margin)
  //   return margin;
  // }
  return (
    <>
    <Flex
      ref={ref}
      h={size}
      // minW={size}
      // borderRadius='20px'
      rounded={rounded}
    >
  
    <Image h={size} w={size}  position={'absolute'} src={landsBackgroundRef} rounded={rounded} zIndex={0}/>
    {/* <Text zIndex={3} position={'absolute'} >{size}</Text> */}

    <Image h={size} position={'absolute'} src={landsBaseRef} zIndex={0}/>
    <Image h={size} position={'absolute'} src={landTypeRef} zIndex={1}/>
    <Image h={size} position={'absolute'} src={legendaryRef} zIndex={2}/>

    <Image h={size} position={'absolute'}
      src={underlandLeftImageRef} zIndex={5}/>
    <Image h={size} position={'absolute'}
      src={underlandMiddleImageRef} zIndex={5}/>
    <Image h={size} position={'absolute'}
      src={underlandRightImageRef} zIndex={5}/>
    
    <Image 
      ml={GetMarginLeft("North")+"px"} 
      mt={GetMarginTop("North")+"px"}
      src={northImageRef} zIndex={4} position={'absolute'} maxW={(size/5)+"px"} maxH={(size/5)+"px"} />
    <Image
      ml={GetMarginLeft("South")+"px"} 
      mt={GetMarginTop("South")+"px"}
      src={southImageRef} zIndex={4} position={'absolute'} maxW={(size/5)+"px"} maxH={(size/5)+"px"} />
    <Image 
      ml={GetMarginLeft("East")+"px"} 
      mt={GetMarginTop("East")+"px"}
      src={eastImageRef} zIndex={4} position={'absolute'} maxW={(size/5)+"px"} maxH={(size/5)+"px"} />
    <Image 
      ml={GetMarginLeft("West")+"px"} 
      mt={GetMarginTop("West")+"px"}
      src={westImageRef} zIndex={4} position={'absolute'} maxW={(size/5)+"px"}  maxH={(size/5)+"px"} />

    <Image h={size} position={'absolute'} src={pathsImageRef} zIndex={3}/>
    <Image h={size} position={'absolute'} src={waterSourceRef} zIndex={3}/>
    </Flex> 
    </>
  )
}

export default memo(RdLand);