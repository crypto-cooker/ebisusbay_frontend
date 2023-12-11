import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Flex,
  HStack,
  Image,
  Progress,
  Spacer,
  Tag,
  Text,
  useMediaQuery
} from "@chakra-ui/react";
import React, {useContext, useEffect, useState} from "react";
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";
import ImageService from "@src/core/services/image";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import Countdown, {zeroPad} from "react-countdown";

//for showing koban
import {round, siPrefixedNumber} from "@src/utils";
import NextApiService from "@src/core/services/api-service/next";
import {appConfig} from "@src/Config";
import {Contract, ethers} from "ethers";
import {ERC1155} from "@src/Contracts/Abis";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();

interface BattleMapHUDProps {
  onBack: () => void;
}

export const BattleMapHUD = ({onBack}: BattleMapHUDProps) => {
  const user = useUser();
  const {game: rdGameContext, user:rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const[koban, setKoban] = useState<number | string>(0);
  const[isLoading, setIsLoading] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const [troopTimer, setTroopTimer] = useState('');
  const [gameStopTime, setGameStopTime] = useState('');


  const [isMobile] = useMediaQuery("(max-width: 750px)");
  const [accordionIndex, setAccordionIndex] = useState<number>(0);

  const[availableUserTroops, setAvailableUserTroops] = useState(0);
  const[availableFactionTroops, setAvailableFactionTroops] = useState(0);
  const[totalUserTroops, setTotalUserTroops] = useState(0);
  const[totalFactionTroops, setTotalFactionTroops] = useState(0);

  const GetKoban = async () => {
    try {
      setIsLoading(true);
      let nfts = await NextApiService.getWallet(user!.address!, {
        collection: config.contracts.resources,
      });
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

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const CheckTroopCooldown = () => {
    if(!rdUser) return;

    const redeploymentDelay = rdUser?.armies.redeploymentDelay;
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + redeploymentDelay);
    setTroopTimer(deadline.toISOString());
    setShowTimer(redeploymentDelay > 0)
  }

  useEffect(() => {
    if(!rdUser) return;

    setAvailableUserTroops(rdUser.game.troops.user.available.total);
    setTotalUserTroops(rdUser.game.troops.user.overall.total);
    setAvailableFactionTroops(rdUser.game.troops.faction?.available.total ?? 0);
    setTotalFactionTroops(rdUser.game.troops.faction?.overall.total ?? 0);
    CheckTroopCooldown();
  }, [rdUser]); 

  useEffect(() => {
    if(!user) return;

    GetKoban();
  }, [user.wallet.isConnected])

  useEffect(() => {
    setAccordionIndex(isMobile ? -1 : 0);
  }, [isMobile]); 

  useEffect(() => {
    if(!rdGameContext) return;
    setGameStopTime(rdGameContext.game.stopAt);
  }, [rdGameContext]);

  return (
    <Box position='absolute' top={0} left={0}  w='100%' pointerEvents='none' >
      <Flex direction='row' justify='space-between' >
      <ReturnToVillageButton onBack={onBack} />
      <Spacer />

      <Box mb={4} mt={6} mr={2}
        justifyContent='right'
        bg={user.theme === 'dark' ? '#272523EE' : '#272523EE'}
        rounded='md' 
        w={{base: '200px', sm: '200px'}}
        >
      <Accordion 
        // defaultIndex={[isMobile ? -1 : 0]} 
        index={accordionIndex}
        allowToggle
        paddingRight={0} 
        justifyContent='right'
        >
        <AccordionItem border='none'>
          <AccordionButton 
            pointerEvents='auto'
            onClick={() => setAccordionIndex(accordionIndex === 0 ? -1 : 0)}
            >
            {!isLoading ? (
              <>
                {!!user.address ? (
                  <>
                    <Flex justify="right" align="right">
                      <HStack justifyContent='right' marginTop='0'>
                        <Text fontSize='xs' color="#aaa" zIndex='9'>Game End:</Text>
                        <Text fontWeight='bold' zIndex='9' color='white'>
                          <Countdown
                            date={gameStopTime ?? 0}
                            renderer={({days, hours, minutes, seconds, completed }) => {
                              return (days > 0 ?
                                <span>{days} days</span>
                                :
                                <span>{hours}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>)
                              }
                            }
                          />
                        </Text>
                        <AccordionIcon color='#ffffff'/>
                      </HStack>
                  </Flex>
                  </>
                ) : (
                  <Text align='center'>Connect wallet for stats</Text>
                )}
              </>
            ) : (
              <Progress size='xs' colorScheme='orange' isIndeterminate w='full'/>
            )}
          </AccordionButton>
        
          <AccordionPanel pb={4} alignItems={'right'} pointerEvents='auto'>
            <AuthenticationRdButton
              connectText=''
              signinText=''
              size={'sm'}
            >
              <Center>
                <Tag  variant='outline'>
                  <Image
                    src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()}
                    alt="troopsIcon"
                    boxSize={4}
                  />
                  <Box ms={1}>
                    {!isLoading ? (
                      <>{koban}</>
                    ) : (
                      <Progress size='xs' colorScheme='orange' isIndeterminate w='full'/>
                    )}
                  </Box>
                </Tag>
              </Center>
              <Box mt={4} fontSize='sm'>
                <HStack justify='space-between'>
                  <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()} alt="troopsIcon" boxSize={4}/>
                  <Text fontWeight='bold' color='white'>Ryoshi On Duty</Text>
                </HStack>
                <HStack justify='space-between'>
                  <Box color="#aaa">User:</Box>
                  <Box fontWeight='bold' color='white'>{availableUserTroops} / {totalUserTroops}</Box>
                </HStack>
                <HStack justify='space-between'>
                  <Box color="#aaa">Faction:</Box>
                  <Box fontWeight='bold' color='white'>{availableFactionTroops} / {totalFactionTroops}</Box>
                </HStack>
              </Box>
            </AuthenticationRdButton>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {!isLoading ? (
        <>
        {showTimer &&  (
          <Box 
            mt={-3} bg='#cc2828' 
            p={2} roundedBottom='md' 
            w={{base: '200px', sm: '200px'}}
            h={{base: '35px', sm: '35px'}}
            >
            <HStack justifyContent='space-between'>
              <Text fontSize='xs' >Troop Cooldown:</Text>
              <Text verticalAlign='bottom' fontWeight='bold'>
                <Countdown
                  date={troopTimer ?? 0}
                  onComplete={()=> setShowTimer(false)}
                  renderer={({hours, minutes, seconds }) => {
                    return (<span>{hours}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>)
                    }
                  }
                />
              </Text>
            </HStack>
          </Box>
        )} </> ) : ( <></> )}
        </Box>
      </Flex>
    </Box>
  )
}