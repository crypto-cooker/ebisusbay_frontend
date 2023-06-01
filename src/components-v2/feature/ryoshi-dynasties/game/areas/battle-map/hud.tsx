import {Box, Flex, Spacer, Text, Button} from "@chakra-ui/react";
import {useAppSelector} from "@src/Store/hooks";
import React, {useState, useEffect, useRef} from "react";
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";
import {getGameEndTime} from "@src/core/api/RyoshiDynastiesAPICalls";

interface BattleMapHUDProps {
  onBack: () => void;
}

export const BattleMapHUD = ({onBack}: BattleMapHUDProps) => {
    
  const user = useAppSelector((state) => state.user);
  const Ref = useRef<NodeJS.Timer | null>(null);
  const Ref2 = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState('00:00:00');
  const [troopTimer, setTroopTimer] = useState('00:00');

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
    deadline.setSeconds(deadline.getSeconds() + 300);
    clearTroopTimer(deadline);
}

  useEffect(() => {
      getSeasonEndTime();
      getTroopCooldown();
  }, []); 

  return (
    <Box position='absolute' top={0} left={0} p={4} w='100%' pointerEvents='none' >
      <Flex direction='row' justify='space-between' >
        {/* <Box mb={4} bg='#272523EE' p={2} rounded='md' w={{base: '345px', sm: '200px'}}> */}
          <ReturnToVillageButton onBack={onBack} />
          <Spacer />
        <Box mb={4} bg='#272523EE' p={2} rounded='md' 
        w={{base: '200px', sm: '200px'}}
        h={{base: '60px', sm: '60px'}}
        >
          <div className="App">
            <Text>Season End: {timer}</Text>
            <Text>Deploy Cooldown: {troopTimer}</Text>
        </div>
        </Box>
      </Flex>
    </Box>
  )
}