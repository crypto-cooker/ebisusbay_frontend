import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Image,
  Progress,
  SimpleGrid,
  Spacer,
  Stack,
  Text
} from "@chakra-ui/react";
import RdButton from "../../../components/rd-button";
import React, {useEffect, useRef, useState, useContext, Attributes} from "react";
import NextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import {ethers} from "ethers";
import {useAppSelector} from "@src/Store/hooks";
import {round, siPrefixedNumber} from "@src/utils";
import ImageService from "@src/core/services/image";
// import {getAuthSignerInStorage} from "@src/helpers/storage";
// import {getRewardsStreak} from "@src/core/api/RyoshiDynastiesAPICalls";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {appConfig} from "@src/Config";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import { CalendarIcon } from "@chakra-ui/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding, faClipboardList, faBlog} from "@fortawesome/free-solid-svg-icons";

const config = appConfig();

interface VillageHudProps {
  onOpenBuildings: () => void;
  onOpenDailyCheckin: () => void;
  onOpenBattleLog: () => void;
  forceRefresh: boolean;
}

export const VillageHud = ({onOpenBuildings, onOpenDailyCheckin, onOpenBattleLog, forceRefresh}: VillageHudProps) => {
  const user = useAppSelector((state) => state.user);
  const { config: rdConfig, user:rdUser, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const config = appConfig();

  const[isLoading, setIsLoading] = useState(false);
  const[koban, setKoban] = useState<number | string>(0);
  const[fortune, setFortune] = useState<number | string>(0);
  const[mitama, setMitama] = useState<number | string>(0);
  const [isLoading2, getSigner] = useCreateSigner();

  //timer
  const Ref = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState('00:00:00');
  const [canClaim, setCanClaim] = useState(true);

  //image ref
  const landTypeRef = useRef<any>(null);
  const underlandLeftImageRef = useRef<any>(null);
  const underlandMiddleImageRef = useRef<any>(null);
  const underlandRightImageRef = useRef<any>(null);
  const pathsImageRef = useRef<any>(null);
  const northImageRef = useRef<any>(null);
  const southImageRef = useRef<any>(null);
  const eastImageRef = useRef<any>(null);
  const westImageRef = useRef<any>(null);

    //timer functions
  const getTimeRemaining = (e:any) => {
    const total = Date.parse(e) - Date.now();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
        total, days, hours, minutes, seconds
    };
  }
  const startTimer = (e:any) => {
      let { total, hours, days, minutes, seconds } = getTimeRemaining(e);
      if (total >= 0) {
          setTimer(
              ((days) > 0 ? (days + ' days ') : (
              (hours > 9 ? hours : '0' + hours) + ':' +
              (minutes > 9 ? minutes : '0' + minutes) + ':' +
              (seconds > 9 ? seconds : '0' + seconds)))
          )
      }
  }
  const clearTimer = (e:any) => {
    startTimer(e);
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => { startTimer(e); }, 1000) 
    Ref.current = id;
  }

  const getRewardsStreakData = async () => {
    if (!user.address || !rdUser) return;
      const dt = Date.parse(rdUser.dailyRewards.nextClaim)
      // console.log(dt)

      if(!dt || dt <= Date.now()) {
        setCanClaim(true)
      }
      else{
        setCanClaim(false)
        clearTimer(rdUser.dailyRewards.nextClaim)
      }
  }
  useEffect(() => {
      getRewardsStreakData();
  }, [user.address, rdUser])
  
  const getResources = async () => {
    try {
      setIsLoading(true);
      let nfts = await NextApiService.getWallet(user!.address!, {
        collection: [config.contracts.resources],
      });
      const fortuneAndMitama = await ApiService.withoutKey().ryoshiDynasties.getErc20Account(user!.address!)

      if (nfts.data.length > 0) {
        setKoban(siPrefixedNumber(round(Number(nfts.data[0].balance))));
      }
      if (!!fortuneAndMitama) {
        setFortune(siPrefixedNumber(round(Number(ethers.utils.formatEther(fortuneAndMitama.fortuneBalance)))));
        setMitama(siPrefixedNumber(round(Number(fortuneAndMitama.mitamaBalance))));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const GenerateIcon = () => {
  //   let izanamiFolder = '/img/ryoshi-dynasties/lands/layers/'
  //   // let izanamiFolder = '/img/ryoshi-dynasties/lands/izanamisCradle/'
  //   console.log("GenerateIcon")
  //   //get random from array of eye colors
  //   let eyeColor = ['Cyan1', 'Green1', 'Pink1', 'Purple1', 'Red1', 'Yellow10'][Math.floor(Math.random() * 6)]
  //   landTypeRef.current.src = izanamiFolder +'Eye color/'+eyeColor+'.png'

  //   let eyeBall = ['Red50', 'White50'][Math.floor(Math.random() * 2)]
  //   underlandLeftImageRef.current.src = '/img/ryoshi-dynasties/lands/layers/Eyeball/'+eyeBall+'.png'

  //   let background = 'Black1'
  //   underlandMiddleImageRef.current.src = '/img/ryoshi-dynasties/lands/layers/Background/'+background+'.png'

  //   let iris = ['Large20', 'Medium20', 'Small60'][Math.floor(Math.random() * 3)]
  //   northImageRef.current.src = '/img/ryoshi-dynasties/lands/layers/Iris/'+iris+'.png'

  //   let topLid = ['High30', 'Low20', 'Middle50'][Math.floor(Math.random() * 3)]
  //   pathsImageRef.current.src = '/img/ryoshi-dynasties/lands/layers/Top lid/'+topLid+'.png'

  //   let bottomLid = ['High20', 'Low40', 'Middle40'][Math.floor(Math.random() * 3)]
  //   underlandRightImageRef.current.src = '/img/ryoshi-dynasties/lands/layers/Bottom lid/'+bottomLid+'.png'
  //   //get image from folder
  //   // src = '/img/ryoshi-dynasties/lands/layers/Eye color/'+eyeColor+'.png'
  // }
  let metaData = {
    "image": "",
    "name": "1",
    "attributes": [
        {
            "trait_type": "landType",
            "value": "Highlands",
            "display_type": "LandType"
        },
        {
            "trait_type": "underlandLeft",
            "value": "Fresh-Water",
            "display_type": "Resource"
        },
        {
            "trait_type": "northSpot",
            "value": "Tree (Oak)",
            "display_type": "Resource"
        },
        {
            "trait_type": "southSpot",
            "value": "Tree (Ash)",
            "display_type": "Resource"
        },
        {
            "trait_type": "eastSpot",
            "value": "Bandit Camp",
            "display_type": "PlacesOfInterest"
        }
    ]
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
    if(attributes[i].display_type == traitType){
      return attributes[i].display_type;
    }
  }
  return "Empty";
}


  const GenerateLandPNG = (nft : NFTMetaData) => {

    let izanamiFolder = '/img/ryoshi-dynasties/lands/izanamisCradle/'
    console.log("Generate Land")

    //get random from array of eye colors
    landTypeRef.current.src = izanamiFolder +'LANDS/'+GetTraitType('landType', nft.attributes)+'.png'
    // console.log(izanamiFolder +'UNDERLAND LEFT/'+GetTraitType('underlandMiddle', nft.attributes)+'.png')
    
    underlandLeftImageRef.current.src = izanamiFolder +'UNDERLAND LEFT/'+GetTraitType('underlandLeft', nft.attributes)+'(L).png'
    underlandMiddleImageRef.current.src = izanamiFolder +'UNDERLAND MIDDLE/'+GetTraitType('underlandMiddle', nft.attributes)+'(M).png'
    underlandRightImageRef.current.src = izanamiFolder +'UNDERLAND RIGHT/'+GetTraitType('underlandRight', nft.attributes)+'(R).png'

    northImageRef.current.src = izanamiFolder +GetDisplayType('northSpot', nft.attributes)+'/'+GetTraitType('northSpot', nft.attributes)+'.png'
    southImageRef.current.src = izanamiFolder +GetDisplayType('southSpot', nft.attributes)+'/'+GetTraitType('southSpot', nft.attributes)+'.png'
    eastImageRef.current.src = izanamiFolder +GetDisplayType('eastSpot', nft.attributes)+'/'+GetTraitType('eastSpot', nft.attributes)+'.png'
    westImageRef.current.src = izanamiFolder +GetDisplayType('westSpot', nft.attributes)+'/'+GetTraitType('westSpot', nft.attributes)+'.png'
  }

  useEffect(() => {
    // get all resources
    if (!!user.address) {
      getResources();
    }
  }, [user.address, forceRefresh])

  return (
    <Box position='absolute' top={0} left={0} p={4}  pointerEvents='none' w='100%'>
      <Flex justifyContent='space-between' w='100%'>
        <SimpleGrid spacing={2} 
        >
          <RdButton
                pointerEvents='auto'
                size='sm'
                hoverIcon={false}
                onClick={onOpenDailyCheckin}
                fontSize={{base: '12', sm: '14'}}
                w={{base: '150px', sm: '200px'}}
                h={{base: '40px', sm: '40px'}}
                lineHeight={'1.2'}
              >
                {canClaim ? (
                  "Claim Rewards!"
                ) : (
                  "Claim in "+ timer
                )}
          </RdButton>
            
          <CurrencyDisplay
            isLoading={isLoading}
            icon ='/img/ryoshi-dynasties/icons/fortune.svg'
            address={user.address}
            amount={fortune}
            />
          <CurrencyDisplay
            isLoading={isLoading}
            icon ='/img/ryoshi-dynasties/icons/mitama.png'
            address={user.address}
            amount={mitama}
            />
          <CurrencyDisplay
            isLoading={isLoading}
            icon ='/img/ryoshi-dynasties/icons/koban.png'
            address={user.address}
            amount={koban}
            />
        </SimpleGrid>

        <Box >
          <SimpleGrid columns={{base: 1, sm: 2}} gap={2}>

          <DarkButton
            onClick={onOpenBuildings}
            icon={faBuilding}/>

          <DarkButton
            onClick={onOpenBattleLog}
            icon={faClipboardList}/>

          <DarkButton
            onClick={() => GenerateLandPNG(metaData)}
            icon={faBlog}/>
          <Box
            marginRight={100}
            bg='black'
            w={'50px'}
            h={'50px'}
            maxH={'50px'}
            maxW={'50px'}
            >
            <Image  w='100' h='100' position={'absolute'}
              src='/img/ryoshi-dynasties/lands/izanamisCradle/BACKGROUND/Green Background.png' zIndex={0}/>
            <Image w='100' h='100' position={'absolute'}
              ref={landTypeRef} zIndex={1}/>
            <Image w='100' h='100' position={'absolute'}
              ref={underlandLeftImageRef} zIndex={3}/>
            <Image w='100' h='100' position={'absolute'} 
              ref={underlandMiddleImageRef} zIndex={0}/>
            <Image w='100' h='100' position={'absolute'}
              ref={underlandRightImageRef} zIndex={5}/>
            <Image w='100' h='100' position={'absolute'}
              ref={pathsImageRef} zIndex={5}/>
            
            <Image w='100' h='100' position={'absolute'}
              ref={northImageRef}zIndex={4} />
            <Image w='100' h='100' position={'absolute'}
              ref={southImageRef} zIndex={4}/>
            <Image w='100' h='100' position={'absolute'}
              ref={eastImageRef} zIndex={4}/>
            <Image w='100' h='100' position={'absolute'}
              ref={westImageRef} zIndex={4}/>

            
            </Box>
          </SimpleGrid>
          
          
        </Box>

      </Flex>
    </Box>
  )
  
}
interface ButtonProps {
  onClick: () => void;
  icon?: any;
}

const DarkButton = ({onClick, icon}: ButtonProps) => {
  return (
    <>
      <Box
            pointerEvents='auto'
            as='button'
            w={{base: '50px', sm: '50px'}}
            h={{base: '40px', sm: '40px'}}
            borderColor='#4c4859'
            color='#272523EE !important'
            borderRadius='4px'
            position='relative'
            borderWidth='4px 4px 4px 4px'
            data-group
            className='rd-button'
            _active={{
              borderColor: '#FFFFFF'
            }}
            bgColor='transparent !important'
            onClick={onClick}
          >
            <Flex
              direction='column'
              justify='center'
              px={0}
              bg='linear-gradient(to left, #272523EE, #151418 )'
              _groupHover={{
                bg: 'linear-gradient(to left, #272523EE, #272523EE )' ,
                ps: '0px',
              }}
              h='full'
              >
              <FontAwesomeIcon icon={icon} color='white'/>
            </Flex>
          </Box>
    </>
  )
}
interface CurrencyProps {
  isLoading: boolean;
  icon: string;
  address: string | null;
  amount: string | number;
}

const CurrencyDisplay = ({isLoading, icon, address, amount}: CurrencyProps) => {
  return (
    <>
      <Box
          bg={'#272523EE'}
          rounded='md' 
          w={{base: '150px', sm: '200px'}}
          h={{base: '24px', sm: '24px'}}
          borderColor='#4c4859'
          borderRadius='6px'
          position='relative'
          borderWidth='4px 4px 4px 4px'
          >
          {!isLoading ? (
            <>
              {!!address ? (
                  <Flex justifyContent='space-between'
                 h={{base: '14px', sm: '12px'}}>
                    <Image src={ImageService.translate(icon).convert()} alt="walletIcon" 
                    boxSize={6}
                    marginY={-1}
                    marginX={-1}/>
                    <Text
                    fontSize={{base: '12', sm: '14'}}
                      textColor={'#ffffff'}
                      >{amount}</Text>
                  </Flex>
              ) : (
                <Text align='center'>Connect wallet for stats</Text>
              )}
              <Spacer />
            </>
          ) : (
            <Progress size='xs' colorScheme='orange' isIndeterminate w='full'/>
          )}
          </Box>
    </>
  )
}