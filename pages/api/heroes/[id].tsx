import {NextRequest} from "next/server";
import {ImageResponse} from "next/og";
import {urlify} from "@src/utils";
import {appConfig} from "@src/Config";
import heroesMetadata from "@src/components-v2/feature/ryoshi-dynasties/components/heroes/heroes-metadata.json";

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

const mainFolderPath = '/img/ryoshi-dynasties/heroes/'

export default async function handler(req: NextRequest) {
  if (req.method === 'HEAD') {
    return new Response(null, {headers: {
        'Content-Type': 'image/png',
    }});
  }

  const nftId = req.nextUrl.pathname.split('/')[3];

  let nft : NFTMetaData = heroesMetadata.Hero.find((nft) => nft.id == nftId) as NFTMetaData;

  const size = 1000;
  const location = urlify(appConfig('urls.app'), mainFolderPath +'Location/'+GetTraitType('Location', nft.attributes));
  const skin = urlify(appConfig('urls.app'), mainFolderPath +'Skin/'+GetTraitType('Skin', nft.attributes));
  const hair = urlify(appConfig('urls.app'), mainFolderPath +'Hair/'+GetTraitType('Hair', nft.attributes)); 
  const eyes = urlify(appConfig('urls.app'), mainFolderPath +'Eyes/'+GetTraitType('Eyes', nft.attributes));
  const mouth = urlify(appConfig('urls.app'), mainFolderPath +'Mouth/'+GetTraitType('Mouth', nft.attributes));
  const border = urlify(appConfig('urls.app'), mainFolderPath +'Border/'+GetBorder(nft.attributes));
  const legs = urlify(appConfig('urls.app'), mainFolderPath+ "/HeroClass/" + GetHeroClass(nft.attributes)  + '/Legs/'+GetClothes(nft.attributes));
  const feet = urlify(appConfig('urls.app'), mainFolderPath + "/HeroClass/"+ GetHeroClass(nft.attributes)  + '/Feet/'+GetClothes(nft.attributes));
  const chest = urlify(appConfig('urls.app'), mainFolderPath + "/HeroClass/"+ GetHeroClass(nft.attributes)  + '/Chest/'+GetClothes(nft.attributes));
  const belt = urlify(appConfig('urls.app'), mainFolderPath + "/HeroClass/"+ GetHeroClass(nft.attributes)  + '/Belt/'+GetClothes(nft.attributes));
  const gloves = urlify(appConfig('urls.app'), mainFolderPath + "/HeroClass/"+ GetHeroClass(nft.attributes)  + '/Gloves/'+GetClothes(nft.attributes));
  const goggles = urlify(appConfig('urls.app'), mainFolderPath + "/HeroClass/"+ (IsDruid(nft.attributes) ? '/HeroClass/Druid/Markings/' : '/HeroClass/Empty/') +GetClothes(nft.attributes));
  const markings = urlify(appConfig('urls.app'), mainFolderPath + "/HeroClass/"+ (IsTinkerer(nft.attributes) ? '/HeroClass/Tinkerer/Goggles.png' : '/HeroClass/Empty/'+GetClothes(nft.attributes)));

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
          <img src={location}  height={size} width={size} style={{ position: 'absolute' }}/>
          <img src={skin}  height={size} width={size} style={{ position: 'absolute' }}/>
          <img src={hair}  height={size} width={size} style={{ position: 'absolute' }}/>
          <img src={eyes}  height={size} width={size} style={{ position: 'absolute' }}/>
          <img src={mouth}  height={size} width={size} style={{ position: 'absolute' }}/>

          <img src={markings}  height={size} width={size} style={{ position: 'absolute' }}/>
          <img src={legs}  height={size} width={size} style={{ position: 'absolute' }}/>
          <img src={feet}  height={size} width={size} style={{ position: 'absolute' }}/>
          <img src={chest}  height={size} width={size} style={{ position: 'absolute' }}/>
          <img src={belt}  height={size} width={size} style={{ position: 'absolute' }}/>
          <img src={gloves}  height={size} width={size} style={{ position: 'absolute' }}/>
          <img src={goggles}  height={size} width={size} style={{ position: 'absolute' }}/>
          <img src={border}  height={size} width={size} style={{ position: 'absolute' }}/>
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
const GetHeroClass = (attributes:Attribute[]) => {
  let heroClass = ""
  for(let i = 0; i < attributes.length; i++){
    if (attributes[i].trait_type == 'Class'){
      heroClass = attributes[i].value;
    }
  }
  return heroClass;
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
  return clothesColor+'.png';
}
const GetTraitType = (traitType:string, attributes:Attribute[]) => {
  for(let i = 0; i < attributes.length; i++){
    if(attributes[i].trait_type == traitType){
      return attributes[i].value + '.png';
    }
  }
  console.log("broken")
  return "broken";
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
