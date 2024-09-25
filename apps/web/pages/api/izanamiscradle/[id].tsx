import {NextRequest} from "next/server";
import {ImageResponse} from "next/og";
import {urlify} from "@edge/utils";
import {appConfig} from "@src/config";
import landsMetadata from "@src/components-v2/feature/ryoshi-dynasties/game/areas/lands/lands-metadata.json";


export const config = {
  runtime: 'edge',
}

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

const mainFolderPath = '/img/ryoshi-dynasties/lands/izanamisCradle/'
const rockFolderPath = '/img/ryoshi-dynasties/lands/izanamisCradle/ROCKS/'

export default async function handler(req: NextRequest) {
  if (req.method === 'HEAD') {
    return new Response(null, {headers: {
        'Content-Type': 'image/png',
    }});
  }

  const nftId = req.nextUrl.pathname.split('/')[3];

  let nft : NFTMetaData = landsMetadata.finalMetadata.find((nft) => nft.id == nftId) as NFTMetaData;
  let isCliffs = IsCliffs(nft.attributes);
  let folderPath = isCliffs ? rockFolderPath : mainFolderPath;
  const landType = GetLandType(nft.attributes);

  const size = 1000;
  const imgLandsBackground = urlify(appConfig('urls.app'), mainFolderPath +'BACKGROUND/'+ (isCliffs ? 'Grey-Background.png' : 'Green-Background.png'));
  const imgLandsBase = urlify(appConfig('urls.app'), mainFolderPath +'LAND BASE/' + (isCliffs ? 'Celestial-Cliffs.png' : 'Green-Land.png'));
  const imgLandType = urlify(appConfig('urls.app'), mainFolderPath +'LANDS/'+GetTraitType('landType', nft.attributes));
  const imgLegendary = urlify(appConfig('urls.app'), mainFolderPath +'LEGENDARY/'+GetTraitType('legendary', nft.attributes));
  
  const imgUnderlandLeft = urlify(appConfig('urls.app'), folderPath +'UNDERLAND LEFT/'+GetTraitType('underlandLeft', nft.attributes, '(L)'));
  const imgUnderlandMiddle = urlify(appConfig('urls.app'), folderPath +'UNDERLAND MIDDLE/'+GetTraitType('underlandMiddle', nft.attributes, '(M)'));
  const imgUnderlandRight = urlify(appConfig('urls.app'), folderPath +'UNDERLAND RIGHT/'+GetTraitType('underlandRight', nft.attributes, '(R)'));
  
  const imgNorth = urlify(appConfig('urls.app'), folderPath +GetDisplayType('northSpot', nft.attributes)+'/'+GetTraitType('northSpot', nft.attributes));
  const imgSouth = urlify(appConfig('urls.app'), folderPath +GetDisplayType('southSpot', nft.attributes)+'/'+GetTraitType('southSpot', nft.attributes));
  const imgEast = urlify(appConfig('urls.app'), folderPath +GetDisplayType('eastSpot', nft.attributes)+'/'+GetTraitType('eastSpot', nft.attributes));
  const imgWest = urlify(appConfig('urls.app'), folderPath +GetDisplayType('westSpot', nft.attributes)+'/'+GetTraitType('westSpot', nft.attributes));

  let imgPaths = urlify(appConfig('urls.app'), folderPath +'PATHS/'+GetTraitType('road', nft.attributes));
  let imgWaterSource = urlify(appConfig('urls.app'), folderPath +'PATHS/'+GetTraitType('waterSource', nft.attributes));
  if(IsHighlands(nft.attributes)){
    imgPaths = urlify(appConfig('urls.app'), folderPath +'PATHS/'+GetTraitTypeHighlands('road', nft.attributes));
    imgWaterSource = urlify(appConfig('urls.app'), folderPath +'PATHS/'+GetTraitTypeHighlands('waterSource', nft.attributes));
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          outline: '4px #4c4859 solid',
          background:'gray'
        }}
      >
        <div
          style={{
            display: 'flex',
            background: 'black',
            width: size,
            height: size,
            zIndex: '20',
            borderRadius: '20px',
          }}
        >
          <img src={imgLandsBackground}
            alt='imgLandsBackground'
            height={size}
            width={size}
            style={{
              position: 'absolute',
              // borderRadius: '20px',
              zIndex: '0'
            }}/>
          <img src={imgLandsBase} alt='imgLandsBase' height={size} width={size} style={{zIndex: '1', position:'absolute'}} />
          <img src={imgLandType} alt='imgLandType' height={size} width={size} style={{zIndex: '2', position:'absolute'}} />
          <img src={imgLegendary} alt='imgLegendary' height={size} width={size} style={{zIndex: '3', position:'absolute' }} />

     
          <img src={imgPaths} alt='imgPaths' height={size} width={size} style={{position: 'absolute', zIndex: '2'}} />
          <img src={imgWaterSource} alt='imgWaterSource' height={size} width={size} style={{position: 'absolute', zIndex: '2'}} />
          
          <img src={imgNorth} alt='imgNorth' height={size/5} width={size/5} style={{
              position: 'absolute',
              zIndex: '3',
              marginLeft: GetMarginLeft(landType, size, 'North'),
              marginTop: GetMarginTop(landType, size, 'North')
            }}
          />
          <img src={imgSouth} alt='imgSouth' height={size/5} width={size/5} style={{
              position: 'absolute',
              zIndex: '3',
              marginLeft: GetMarginLeft(landType, size, 'South'),
              marginTop: GetMarginTop(landType, size, 'South')
            }}
          />
          <img src={imgEast} alt='imgEast' height={size/5} width={size/5} style={{
              position: 'absolute',
              zIndex: '3',
              marginLeft: GetMarginLeft(landType, size, 'East'),
              marginTop: GetMarginTop(landType, size, 'East')
            }}
          />
          <img src={imgWest} alt='imgWest' height={size/5} width={size/5} style={{
              position: 'absolute',
              zIndex: '3',
              marginLeft: GetMarginLeft(landType, size, 'West'),
              marginTop: GetMarginTop(landType, size, 'West')
            }}
          />

          <img src={imgUnderlandLeft} alt='imgUnderlandLeft' height={size} width={size} style={{zIndex: '5', position:'absolute'}} />
          <img src={imgUnderlandMiddle} alt='imgUnderlandMiddle' height={size} width={size} style={{zIndex: '5', position:'absolute'}} />
          <img src={imgUnderlandRight} alt='imgUnderlandRight' height={size} width={size} style={{zIndex: '5', position:'absolute'}} />

        </div>

      </div>
    ),
    {
      width: size,
      height: size,
      headers: {
        'cache-control': 'public, max-age=3600, stale-while-revalidate=4200, no-transform'
      }
    }
  )
}

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

const GetMarginLeft = (landType: string, size: number, directional: string) => {
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

const GetMarginTop = (landType: string, size: number,directional:string) => {
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
          return size/4.5;
        case "South":
          return size/2;
        case "East":
          return size/2.75;
        case "West":
          return size/2.75;
      }
  }
}