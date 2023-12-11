import {
  Avatar,
  Box,
  Flex,
  HStack,
  Image,
  Progress,
  SimpleGrid,
  Spacer,
  Text,
  Tooltip,
  useMediaQuery
} from "@chakra-ui/react";
import RdButton from "../../../components/rd-button";
import React, {useContext, useEffect, useState} from "react";
import NextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import {Contract, ethers} from "ethers";
import {round, siPrefixedNumber, username} from "@src/utils";
import ImageService from "@src/core/services/image";
import {appConfig} from "@src/Config";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding, faClipboardList} from "@fortawesome/free-solid-svg-icons";

import {ERC1155} from "@src/Contracts/Abis";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import Countdown, {zeroPad} from "react-countdown";
import {useUser} from "@src/components-v2/useUser";

interface VillageHudProps {
  onOpenBuildings: () => void;
  onOpenDailyCheckin: () => void;
  onOpenBattleLog: () => void;
  onOpenXPLeaderboard: () => void;
  forceRefresh: boolean;
}

export const VillageHud = ({onOpenBuildings, onOpenDailyCheckin, onOpenBattleLog, onOpenXPLeaderboard, forceRefresh}: VillageHudProps) => {
  const user = useUser();
  const { config: rdConfig, user: rdUserContext, game: rdGameContext, refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const config = appConfig();
  const {isSignedIn} = useEnforceSigner();

  const[isLoading, setIsLoading] = useState(false);
  const[koban, setKoban] = useState<number | string>(0);
  const[fortune, setFortune] = useState<number | string>(0);
  const[mitama, setMitama] = useState<number | string>(0);
  const[levelProgressString, setLevelProgressString] = useState<string>('0%');
  const [isLabelOpen, setIsLabelOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  const[playerLevel, setPlayerLevel] = useState<number>(0);
  const[currentLevelProgress, setCurrentLevelProgress] = useState<number>(0);

  //timer
  const [canClaim, setCanClaim] = useState(true);
  const [nextClaim, setNextClaim] = useState<number>();

  const getResources = async () => {
    try {
      setIsLoading(true);
      let nfts = await NextApiService.getWallet(user!.address!, {
        collection: [config.contracts.resources],
      });
      const fortuneAndMitama = await ApiService.withoutKey().ryoshiDynasties.getErc20Account(user!.address!)

      let kobanBalance = 0;
      if (nfts.data.length > 0) {
        kobanBalance = Number(nfts.data.find(nft => nft.nftId === '1')?.balance ?? 0);
      } else {
        const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
        const contract = new Contract(config.contracts.resources, ERC1155, readProvider);
        kobanBalance = await contract.balanceOf(user!.address!, 1);
        kobanBalance = Number(kobanBalance);
      }
      setKoban(siPrefixedNumber(round(kobanBalance)));

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
  
  const xpLevelTiers = [
    { min: 0, value: 0},
    { min: 100, value: 1},
    { min: 500, value: 2},
    { min: 1500, value: 3},
    { min: 3500, value: 4},
    { min: 7000, value: 5},
    { min: 14000, value: 6},
    { min: 30000, value: 7},
    { min: 50000, value: 8},
    { min: 80000, value: 9},
    { min: 140000, value: 10},
  ]
  const getXpLevel = (xp: number) => {
    let level = 0;
    xpLevelTiers.forEach((item) => {
      if (xp >= item.min) {
        level = item.value;
      }
    })
    return level;
  }

  const calculateCurrentValue = () => {
    if (!rdUserContext) return;

    const currentExp = rdUserContext.experience.points;
    const xpLevel = getXpLevel(currentExp);
    const currentLevelStart = xpLevelTiers[xpLevel].min;
    const currentLevelEnd = xpLevelTiers[xpLevel + 1].min;
    const currentLevelProgress = (currentExp - currentLevelStart) / (currentLevelEnd - currentLevelStart);

    setLevelProgressString(round(currentExp - currentLevelStart, 1) +"/" +(currentLevelEnd - currentLevelStart));
    setPlayerLevel(rdUserContext.experience.level);
    setCurrentLevelProgress(currentLevelProgress * 100);
  };

  useEffect(() => {
    calculateCurrentValue();
  }, [user.address, rdUserContext])

  useEffect(() => {
    // get all resources
    if (!!user.address) {
      getResources();
    }
  }, [user.address, forceRefresh])

  useEffect(() => {
    if (!user.address || !rdUserContext) {
      setCanClaim(false);
      return;
    }

    const claimData = rdUserContext.dailyRewards;
    if(!claimData.nextClaim) {
      setCanClaim(true);
    } else if(Date.parse(claimData.nextClaim) <= Date.now()) {
      setCanClaim(true);
    } else {
      setCanClaim(false);
      setNextClaim(new Date(claimData.nextClaim).getTime());
    }
}, [user.address, rdUserContext])

  const changeBackground = () => {
    if(!isMobile) return;

    setIsLabelOpen(!isLabelOpen);
  }

  return (
    <Box position='absolute' top={0} left={0} p={4} pointerEvents='none' w='100%'>
      <Flex justifyContent='space-between' w='100%'>
        <SimpleGrid
          spacing={2}
          paddingLeft={3}
          paddingRight={3}
          paddingTop={3}
          paddingBottom={1}
          rounded='md'
          bg='linear-gradient(to left, #272523EE, #151418 )'
        >
          <HStack spacing={1}>
            <Avatar 
              size='md'
              src={user.profile.profilePicture ? ImageService.translate(user.profile.profilePicture).avatar() : undefined}
            />
            <RdButton
              pointerEvents='auto'
              size='sm'
              hoverIcon={false}
              onClick={onOpenDailyCheckin}
              fontSize={{base: '12', sm: '14'}}
              w={{base: '150px', sm: '160px'}}
              h={{base: '40px', sm: '40px'}}
              lineHeight={'1.2'}
            >
              {user.address && isSignedIn && nextClaim ? (
                <Countdown
                  date={nextClaim ?? 0}
                  renderer={({ hours, minutes, seconds, completed }) => {
                    if (completed && canClaim) {
                      return <span>Claim Now!</span>;
                    } else {
                      return <span>Claim in {hours}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
                    }
                  }}
                />
                ) : (
                <>Claim Koban!</>
              )}
            </RdButton>
          </HStack>

          <Flex mt={2} justifyContent={'space-between'}  w={{base: '200px', sm: '210px'}}>
            <Text
              maxW={{base: '150px', sm: '150px'}}
              isTruncated
              fontSize={{base: '12', sm: '14'}} 
              as={'b'}
              color='white'
            >
              {username()}
            </Text>
            <Text 
              fontSize={{base: '12', sm: '14'}} 
              as={'b'}
              color='white'
            >
              Lvl: {playerLevel}
            </Text>

          </Flex>
          <Tooltip 
            isOpen={isLabelOpen} 
            label={levelProgressString} 
            placement='right' 
            bg='linear-gradient(to left, #272523EE, #151418 )' 
            textColor={'white'}>
            <Flex 
              pointerEvents='auto' 
              mt={-2} h={'12px'} as={'button'} 
              onClick={changeBackground} 
              onMouseEnter={() =>setIsLabelOpen(true)}
              onMouseLeave={() =>setIsLabelOpen(false)}
              >
              <Progress w={{base: '200px', sm: '210px'}}
                colorScheme='ryoshiDynasties' size='md' value={currentLevelProgress}
              />
            </Flex>
          </Tooltip>

          <CurrencyDisplay2
            isLoading={isLoading}
            icon1 ='/img/ryoshi-dynasties/icons/fortune.svg'
            icon2 ='/img/ryoshi-dynasties/icons/mitama.png'
            icon3 ='/img/ryoshi-dynasties/icons/koban.png'
            address={user.address ?? null}
            amount1={fortune}
            amount2={mitama}
            amount3={koban}
            />
          {/* <CurrencyDisplay
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
            /> */}
        </SimpleGrid>

        <Box >
          <SimpleGrid columns={{base: 1, sm: 2}} gap={2}>

            <DarkButton
              onClick={onOpenBuildings}
              icon={faBuilding}/>

            <DarkButton
              onClick={onOpenBattleLog}
              icon={faClipboardList}/>

            {/* <DarkButton
              onClick={onOpenXPLeaderboard}
              icon={faClipboardList}/> */}

            {/* <DarkButton
              onClick={() => UpdateMetaData(Math.floor(Math.random() * 2500))}
              icon={faBlog}/> */}

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
// interface CurrencyProps {
//   isLoading: boolean;
//   icon: string;
//   address: string | null;
//   amount: string | number;
// }
// const CurrencyDisplay = ({isLoading, icon, address, amount}: CurrencyProps) => {
//   return (
//     <>
//       <Box
//           bg={'#272523EE'}
//           rounded='md' 
//           w={{base: '150px', sm: '200px'}}
//           h={{base: '24px', sm: '24px'}}
//           borderColor='#4c4859'
//           borderRadius='6px'
//           position='relative'
//           borderWidth='4px 4px 4px 4px'
//           >
//           {!isLoading ? (
//             <>
//               {!!address ? (
//                   <Flex justifyContent='space-between'
//                  h={{base: '14px', sm: '12px'}}>
//                     <Image src={ImageService.translate(icon).convert()} alt="walletIcon" 
//                     boxSize={6}
//                     marginY={-1}
//                     marginX={-1}/>
//                     <Text
//                     fontSize={{base: '12', sm: '14'}}
//                       textColor={'#ffffff'}
//                       >{amount}</Text>
//                   </Flex>
//               ) : (
//                 <Text align='center'>Connect wallet for stats</Text>
//               )}
//               <Spacer />
//             </>
//           ) : (
//             <Progress size='xs' colorScheme='orange' isIndeterminate w='full'/>
//           )}
//           </Box>
//     </>
//   )
// }
interface CurrencyProps2 {
  isLoading: boolean;
  icon1: string;
  icon2: string;
  icon3: string;
  address: string | null;
  amount1: string | number;
  amount2: string | number;
  amount3: string | number;
}
const CurrencyDisplay2 = ({isLoading, icon1, icon2, icon3, address, amount1,amount2, amount3}: CurrencyProps2) => {
  return (
    <>
      <Box
          // bg={'#272523EE'}
          rounded='md' 
          w={{base: '200px', sm: '210px'}}
          h={{base: '24px', sm: '26px'}}
          // borderColor='#4c4859'
          // borderRadius='6px'
          // position='relative'
          // borderWidth='2px 2px 2px 2px'
          alignContent={'center'}
          >
          {!isLoading ? (
            <>
              {!!address ? (
                <HStack justifyContent={'space-between'} 
                align={'center'}
                >
                  <Flex align={'center'}
                  >
                    <Image src={ImageService.translate(icon1).convert()} alt="walletIcon" 
                        mr={1}
                        boxSize={4}
                    // marginY={-1}
                    // marginX={-1}
                    />
                    <Text
                        as={'b'}
                        fontSize={{base: '12', sm: '14'}}
                      textColor={'#ffffff'}
                      >{amount1}</Text>
                  </Flex>
                   <Flex 
                   align={'center'}
                  >
                      <Image src={ImageService.translate(icon2).convert()} alt="walletIcon" 
                        mr={1}
                        boxSize={4}
                      // marginY={-1}
                      // marginX={-1}
                      />
                      <Text
                        as={'b'}
                        fontSize={{base: '12', sm: '14'}}
                        textColor={'#ffffff'}
                        >{amount2}</Text>
                    </Flex>
                     <Flex 
                     align={'center'}
                     >
                        <Image src={ImageService.translate(icon3).convert()} alt="walletIcon" 
                        boxSize={4}
                      
                        // marginY={-1}
                        // marginX={-1}
                        />
                        <Text
                        as={'b'}
                        fontSize={{base: '12', sm: '14'}}
                          textColor={'#ffffff'}
                          >{amount3}</Text>
                      </Flex>
                      </HStack>
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