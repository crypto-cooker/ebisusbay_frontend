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
import React, {useEffect, useRef, useState, useContext} from "react";
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

  useEffect(() => {
    // get all resources
    if (!!user.address) {
      getResources();
    }
  }, [user.address, forceRefresh])

  return (
    <Box position='absolute' top={0} left={0} p={4}  pointerEvents='none' >
      <Flex direction='row' justify='space-between' >
        <Box mb={4} 
        bg={user.theme === 'dark' ? '#272523EE' : '#272523EE'}
        p={2} rounded='md' w={{base: '345px', sm: '400px'}}>
          <Accordion defaultIndex={[0]} allowToggle>
            <AccordionItem border='none'>
              <AccordionButton pointerEvents='auto'>
                {!isLoading ? (
                  <>
                    {!!user.address ? (
                      <HStack w='full' spacing={4}>
                        <HStack>
                          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/fortune.svg').convert()} alt="walletIcon" boxSize={6}/>
                          <Text
                            textColor={user.theme === 'dark' ? '#ffffff' : '#ffffff'}
                            >{fortune}</Text>
                        </HStack>
                        <HStack>
                          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/mitama.png').convert()} alt="walletIcon" boxSize={6}/>
                          <Text
                            textColor={user.theme === 'dark' ? '#ffffff' : '#ffffff'}
                            >{mitama}</Text>
                        </HStack>
                        <HStack>
                          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="walletIcon" boxSize={6}/>
                          <Text
                            textColor={user.theme === 'dark' ? '#ffffff' : '#ffffff'}
                            >{koban}</Text>
                        </HStack>
                      </HStack>
                    ) : (
                      <Text align='center'>Connect wallet for stats</Text>
                    )}
                    <Spacer />
                    <AccordionIcon 
                      color='#ffffff'/>
                  </>
                ) : (
                  <Progress size='xs' colorScheme='orange' isIndeterminate w='full'/>
                )}
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack direction='row'>
                  <RdButton
                    pointerEvents='auto'
                    fontSize='m'
                    hoverIcon={false}
                    onClick={onOpenBuildings}
                    w={{base: '175px', sm: '175px'}}
                    h={{base: '55px', sm: '40px'}}
                    lineHeight={'1.2'}
                  >
                    View Building
                  </RdButton>
                  <Spacer h='4'/>
                  <RdButton
                    pointerEvents='auto'
                    size='sm'
                    hoverIcon={false}
                    onClick={onOpenDailyCheckin}
                    // fontSize={'14'}
                    w={{base: '200px', sm: '200px'}}
                    h={{base: '55px', sm: '40px'}}
                    lineHeight={'1.2'}
                  >
                    {canClaim ? (
                      "Claim Rewards"
                    ) : (
                      "Claim in "+ timer
                     )}
                  </RdButton>
                  <Spacer h='4'/>
                  <RdButton
                    pointerEvents='auto'
                    size='sm'
                    hoverIcon={false}
                    onClick={onOpenBattleLog}
                    // fontSize={'14'}
                    w={{base: '100px', sm: '60px'}}
                    h={{base: '55px', sm: '40px'}}
                    lineHeight={'1.2'}
                  ><CalendarIcon/>
                  </RdButton>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Flex>
    </Box>
  )
}