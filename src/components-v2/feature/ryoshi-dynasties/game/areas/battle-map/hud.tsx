import {Box, Flex, Spacer, Text, Progress, HStack, Tag, Image} from "@chakra-ui/react";
import {useAppSelector} from "@src/Store/hooks";
import React, {useState, useEffect, useRef, useContext} from "react";
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";
import {getGameEndTime} from "@src/core/api/RyoshiDynastiesAPICalls";
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


interface BattleMapHUDProps {
  onBack: () => void;
}

export const BattleMapHUD = ({onBack}: BattleMapHUDProps) => {
    
  const user = useAppSelector((state) => state.user);
  const Ref = useRef<NodeJS.Timer | null>(null);
  const Ref2 = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState('00:00:00');
  const [troopTimer, setTroopTimer] = useState('00:00');
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const[koban, setKoban] = useState<number | string>(0);
  const[isLoading, setIsLoading] = useState(false);

  const getResources = async () => {
    try {
      setIsLoading(true);
      let nfts = await NextApiService.getWallet(user!.address!, {
        collection: ['0xda72ee0b52a5a6d5c989f0e817c9e2af72e572b5'],
      });
      const fortuneAndMitama = await ApiService.withoutKey().ryoshiDynasties.getErc20Account(user!.address!)
      if (nfts.data.length > 0) {
        setKoban(siPrefixedNumber(nfts.data[0].balance));
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
      const currentGame = await getGameEndTime();
      clearTimer(currentGame);
  } 
  const getTroopCooldown = async () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 10);
    clearTroopTimer(deadline);
}

  useEffect(() => {
      getSeasonEndTime();
      getTroopCooldown();
      console.log('rdContext', rdContext)
  }, []); 

  useEffect(() => {
    // get all resources
    if (!!user.address) {
      getResources();
    }
  }, [user.address])

  return (
    <Box position='absolute' top={0} left={0} p={4} w='100%' pointerEvents='none' >
      <Flex direction='row' justify='space-between' >
        {/* <Box mb={4} bg='#272523EE' p={2} rounded='md' w={{base: '345px', sm: '200px'}}> */}
        <ReturnToVillageButton onBack={onBack} />
          <Spacer />
          <Box mb={4} bg='#272523EE' p={2} rounded='md' 
          w={{base: '200px', sm: '200px'}}
          h={{base: '105px', sm: '105px'}}
          >
          {/* <RdButton h='30px' w='210px' position='absolute' right='10px' top='10px' ></RdButton> */}
          <Box
           h='30px' w='210px' position='absolute' right='13px' top='0px'
            as='button'
            borderColor='#292626'
            color='#FFF !important'
            fontSize='2xl'
            borderRadius='2px'
            position='relative'
            borderWidth='6px 0px 6px 0px'
            data-group
            px={1}
            _active={{
              borderColor: '#FFFFFF'
            }}
            bgColor='transparent !important'
          >
            <Box
        px={0}
        py={1}
        bg='linear-gradient(to left, #564D4A, #564D4A)'
        _groupHover={{ bg: 'linear-gradient(to left, #564D4A, #564D4A)' }}
        // ps={props.stickyIcon ? '40px' : '0px'}
        // pe={props.stickyIcon ? '6px' : '0px'}
        h='full'
        // className={gothamMedium.className}
      >
        <Box px={3}>
          {/* {props.children} */}
        </Box>
      </Box>
          </Box>

          <div className="App">
              <HStack justifyContent='center' marginTop='-7'>
                <Text fontSize='xs' color="#aaa" zIndex='9'>Season End:</Text>
                <Text fontWeight='bold' zIndex='9'> {timer}</Text>
              </HStack>
            <Spacer h='2' />
            <HStack justifyContent='right'>
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
            </HStack>
            <Spacer h='2' />

            <HStack justifyContent='right'>
            {troopTimer !== '' && (
              <Text fontSize='xs' color="#aaa">Cooldown:</Text>
            )}
            <Text textAlign='bottom' fontWeight='bold'>{troopTimer}</Text>
            <Tag  variant='outline'>
              <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()}
                      alt="troopsIcon" boxSize={4}/>
              <Box ms={1}>
                {rdContext.user?.faction?.troops}
              </Box>
            </Tag>
            </HStack>

        </div>
        </Box>
      </Flex>
    </Box>
  )
}