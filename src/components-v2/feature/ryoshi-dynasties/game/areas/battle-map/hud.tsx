import {Box, Flex, Spacer, Text, Progress, HStack, Tag, Image, SimpleGrid, Center,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  useMediaQuery 
} from "@chakra-ui/react";
import {useAppSelector} from "@src/Store/hooks";
import React, {useState, useEffect, useRef, useContext} from "react";
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";
import ImageService from "@src/core/services/image";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";

//for showing koban
import {ApiService} from "@src/core/services/api-service";
import {ethers} from "ethers";
import {siPrefixedNumber} from "@src/utils";
import NextApiService from "@src/core/services/api-service/next";
import {appConfig} from "@src/Config";

const config = appConfig();

interface BattleMapHUDProps {
  onBack: () => void;
}

export const BattleMapHUD = ({onBack}: BattleMapHUDProps) => {
    
  const user = useAppSelector((state) => state.user);
  const Ref = useRef<NodeJS.Timer | null>(null);
  const Ref2 = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState('00:00:00');
  const [troopTimer, setTroopTimer] = useState('');
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const {game: rdGameContext, user:rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const[koban, setKoban] = useState<number | string>(0);
  const[isLoading, setIsLoading] = useState(false);
  const [isNotMobile] = useMediaQuery("(max-width: 768px)") 

  const[availableTroops, setAvailableTroops] = useState(0);
  const[totalTroops, setTotalTroops] = useState(0);

  const getResources = async () => {
    try {
      setIsLoading(true);
      let nfts = await NextApiService.getWallet(user!.address!, {
        collection: config.contracts.resources,
      });
      // const fortuneAndMitama = await ApiService.withoutKey().ryoshiDynasties.getErc20Account(user!.address!);
      const kobanToken = nfts.data.find((token) => token.nftId === '1');
      if (kobanToken) {
        setKoban(siPrefixedNumber(kobanToken.balance));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
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
  const startTroopTimer = (e:any) => {
    let { total, hours, days, minutes, seconds } = getTimeRemaining(e);
      if (total >= 0) {
        setTroopTimer(
            (minutes > 9 ? minutes : '0' + minutes) + ':' +
            (seconds > 9 ? seconds : '0' + seconds)
        )
    }else {
      setTroopTimer('');
    }
  }
  const clearTimer = (e:any) => {
    startTimer(e);
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => { startTimer(e); }, 1000) 
    Ref.current = id;
  }
  const clearTroopTimer = (e:any) => {
    startTroopTimer(e);
    if (Ref2.current) clearInterval(Ref2.current);
    const id = setInterval(() => { startTroopTimer(e); }, 1000) 
    Ref2.current = id;
  }
 
  const getSeasonEndTime = async () => {
      if(!rdGameContext) return;
      const timestamp = rdGameContext?.game?.endAt;
      clearTimer(timestamp);
  } 
  const getTroopCooldown = () => {
    if(!rdUser) return;

    const redeploymentDelay = rdUser?.armies.redeploymentDelay;
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + redeploymentDelay);
    clearTroopTimer(deadline);
}

  useEffect(() => {
      getSeasonEndTime();
  }, []); 

  useEffect(() => {
    if(!rdContext) return;

    if(rdContext.user?.season?.troops?.undeployed !== undefined){
      setAvailableTroops(rdContext.user?.season?.troops?.undeployed);
    }
    if(rdContext.user?.season?.troops?.deployed !== undefined && 
       rdContext.user?.season?.troops?.undeployed !== undefined){
      setTotalTroops(rdContext.user?.season?.troops?.deployed + rdContext.user?.season?.troops?.undeployed);
    }
    getTroopCooldown();


}, [rdContext]); 

  useEffect(() => {
    // get all resources
    if (!!user.address) {
      getResources();
    }
  }, [user.address])
  const [accordionIndex, setAccordionIndex] = useState(-1);
  useEffect(() => {
    if(isNotMobile){
      setAccordionIndex(0);
    }else{
      setAccordionIndex(-1);
    }
}, [isNotMobile]); 
  return (
    <Box position='absolute' top={0} left={0}  w='100%' pointerEvents='none' >
      <Flex direction='row' justify='space-between' >
      <ReturnToVillageButton onBack={onBack} />
      <Spacer />
{/* 
      <Box mb={4} bg='#272523EE' p={2} rounded='md' 
          w={{base: '200px', sm: '280px'}}
          // w={{base: '200px', sm: '280px'}}
          h={{base: '135px', sm: '135px'}}
          // h={{base: '135px', sm: '135px'}}
          >
           */}

      <Box mb={4} mt={6} mr={2}
 justifyContent='right'
        bg={user.theme === 'dark' ? '#272523EE' : '#272523EE'}
        rounded='md' w={{base: '200px', sm: '200px'}}>


      {/* <Accordion defaultIndex={[0]} allowToggle paddingRight={0} justifyContent='right' */}
      <Accordion defaultIndex={[0]} allowToggle paddingRight={0} justifyContent='right'
      >
            <AccordionItem border='none'>
              <AccordionButton pointerEvents='auto'>
                {!isLoading ? (
                  <>
                    {!!user.address ? (
                      <>
                      <Flex justify="right" align="right">
                      <HStack justifyContent='right' marginTop='0'>
                        <Text fontSize='xs' color="#aaa" zIndex='9'>Game End:</Text>
                        <Text fontWeight='bold' zIndex='9'> {timer}</Text>
                        <AccordionIcon 
                          color='#ffffff'/>
                      </HStack>
                      </Flex>
                      </>
                    ) : (
                      <Text align='center'>Connect wallet for stats</Text>
                    )}
                    {/* <Spacer /> */}
                    
                  </>
                ) : (
                  <Progress size='xs' colorScheme='orange' isIndeterminate w='full'/>
                )}
              </AccordionButton>
            
              <AccordionPanel pb={4} alignItems={'right'}>

              <Center>
                <Tag  variant='outline'>
                  <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()}
                          alt="troopsIcon" boxSize={4}/>
                  <Box ms={1}>
                  {!isLoading ? (<>
                    {koban}
                  </>
                    ) : (
                      <Progress size='xs' colorScheme='orange' isIndeterminate w='full'/>
                    )}
                  </Box>
                </Tag>
              </Center>
              <Flex justify="right" align="right">
              <SimpleGrid columns={2} my={4} px={1}>
                <Box color="#aaa">Available:</Box>
                <Flex textAlign='end' fontWeight='bold' alignContent='space-between'>
                  <HStack textAlign='end'>
                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()}alt="troopsIcon" boxSize={4}/>
                    <Text>{availableTroops}</Text>
                  </HStack>
                  </Flex>
                <Box color="#aaa">Total:</Box>
                <Box textAlign='end' fontWeight='bold'>
                  <HStack textAlign='end'>
                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()}alt="troopsIcon" boxSize={4}/>
                    <Text>{totalTroops}</Text>
                  </HStack>
                  </Box>
              </SimpleGrid>
              </Flex>

              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          
        {troopTimer !== '' && (
            <Box mt={-3} bg='#cc2828' p={2} roundedBottom='md' 
              
               w={{base: '182px', sm: '182px'}}
               h={{base: '35px', sm: '35px'}}
               >
                <HStack justifyContent='space-between'>
              <Text fontSize='xs' >Troop Cooldown:</Text>
              <Text verticalAlign='bottom' fontWeight='bold'>{troopTimer}</Text>
                </HStack>
              </Box>
            )}
        </Box>
      </Flex>
    </Box>
  )
}