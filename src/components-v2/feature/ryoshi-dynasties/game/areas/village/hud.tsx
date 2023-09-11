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
  Text,
  Avatar
} from "@chakra-ui/react";
import RdButton from "../../../components/rd-button";
import React, {useEffect, useRef, useState, useContext, Attributes} from "react";
import NextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import {Contract, ethers} from "ethers";
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

import RdLand from "@src/components-v2/feature/ryoshi-dynasties/components/rd-land";
import { random, range } from "lodash";
import {ERC1155} from "@src/Contracts/Abis";

interface VillageHudProps {
  onOpenBuildings: () => void;
  onOpenDailyCheckin: () => void;
  onOpenBattleLog: () => void;
  forceRefresh: boolean;
}

export const VillageHud = ({onOpenBuildings, onOpenDailyCheckin, onOpenBattleLog, forceRefresh}: VillageHudProps) => {
  const user = useAppSelector((state) => state.user);
  const { config: rdConfig, user:rdUser, game: rdGameContext, refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const config = appConfig();

  const[isLoading, setIsLoading] = useState(false);
  const[koban, setKoban] = useState<number | string>(0);
  const[fortune, setFortune] = useState<number | string>(0);
  const[mitama, setMitama] = useState<number | string>(0);

  const[playerLevel, setPlayerLevel] = useState<number>(0);
  const[currentLevelProgress, setCurrentLevelProgress] = useState<number>(0);

  //timer
  const Ref = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState('00:00:00');
  const [canClaim, setCanClaim] = useState(true);

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
    if (Ref.current) clearInterval(Ref.current as any);
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
  const getResources = async () => {
    try {
      setIsLoading(true);
      let nfts = await NextApiService.getWallet(user!.address!, {
        collection: [config.contracts.resources],
      });
      const fortuneAndMitama = await ApiService.withoutKey().ryoshiDynasties.getErc20Account(user!.address!)

      let kobanBalance = 0;
      if (nfts.data.length > 0) {
        kobanBalance = Number(nfts.data[0].balance);
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
  
  const reputationDict = [
    { max: 100, value: 0},
    { max: 500, value: 1},
    { max: 1500, value: 2},
    { max: 3500, value: 3},
    { max: 7000, value: 4},
    { max: 14000, value: 5},
    { max: 30000, value: 6},
    { max: 50000, value: 7},
    { max: 80000, value: 8},
    { max: 140000, value: 9},
    { max: 9999999, value: 10},
  ]
  const GetReputationLevel = (reputation: number) => {
    let level = 0;
    reputationDict.forEach((item) => {
      if (reputation >= item.max) {
        level = item.value;
      }
    })
    return level;
  }

  const calculateCurrentValue = () => {
    if (!rdUser) return;

    const currentExp = rdUser.experience.points;
    const currentLevelStart = reputationDict[GetReputationLevel(rdUser.experience.points)].max;
    const currentLevelEnd = reputationDict[GetReputationLevel(rdUser.experience.points) + 1].max;
    const currentLevelProgress = (currentExp - currentLevelStart) / (currentLevelEnd - currentLevelStart);

    setPlayerLevel(rdUser.experience.level);
    setCurrentLevelProgress(currentLevelProgress * 100);
  };

  useEffect(() => {
    calculateCurrentValue();
  }, [rdUser])

  useEffect(() => {
    getRewardsStreakData();
    console.log('rdUser', rdUser);
    refreshUser(); 
  }, [user.address, rdUser])

  useEffect(() => {
    // get all resources
    if (!!user.address) {
      getResources();
    }
  }, [user.address, forceRefresh])

  return (
    <Box position='absolute' top={0} left={0} p={4} pointerEvents='none' w='100%'>
      <Flex justifyContent='space-between' w='100%'>
        <SimpleGrid spacing={2}
        paddingLeft={3}
        paddingRight={3}
        paddingTop={3}
        paddingBottom={1}
        rounded='md'
        bg='linear-gradient(to left, #272523EE, #151418 )' 
        >
          <HStack spacing={1} >
            <Avatar 
              size='md'
              src={ImageService.translate(user.profile.profilePicture).avatar()}
            />
            <RdButton
              pointerEvents='auto'
              size='sm'
              hoverIcon={false}
              onClick={onOpenDailyCheckin}
              fontSize={{base: '12', sm: '14'}}
              w={{base: '150px', sm: '150px'}}
              h={{base: '40px', sm: '40px'}}
              lineHeight={'1.2'}
            >
              {canClaim ? (
                "Claim Rewards!"
              ) : (
                "Claim in "+ timer
              )}
            </RdButton>
          </HStack>

          <Flex mt={-2} justifyContent={'space-between'}  w={{base: '200px', sm: '200px'}}>
            <Text 
            maxW={{base: '150px', sm: '150px'}}
            isTruncated
              fontSize={{base: '12', sm: '14'}} 
              as={'b'}
              color='white'>{user.profile.username}
            </Text>
            <Text 
              fontSize={{base: '12', sm: '14'}} 
              as={'b'}
              color='white'>Lvl: {playerLevel}
            </Text>
          </Flex>
          <Progress mt={-2} w={{base: '200px', sm: '200px'}}
            colorScheme='ryoshiDynasties' size='md' value={currentLevelProgress} 
          />
          <CurrencyDisplay2
            isLoading={isLoading}
            icon1 ='/img/ryoshi-dynasties/icons/fortune.svg'
            icon2 ='/img/ryoshi-dynasties/icons/mitama.png'
            icon3 ='/img/ryoshi-dynasties/icons/koban.png'
            address={user.address}
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
              onClick={() => UpdateMetaData(Math.floor(Math.random() * 2500))}
              icon={faBlog}/> */}

            </SimpleGrid>
          </Box>
          {/* <RdLand nftId={selectedNFT} boxSize={368}/> */}
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
          w={{base: '200px', sm: '200px'}}
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