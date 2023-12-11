import {useEffect, useRef, useState} from 'react';
import {Avatar, Box, Center, Flex, Heading, HStack, Spacer, Text, useDisclosure, VStack} from "@chakra-ui/react";
import {getBattleRewards} from "@src/core/api/RyoshiDynastiesAPICalls";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import ClaimRewards from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/claim-rewards';
import {useAppSelector} from "@src/Store/hooks";

//contracts
import {appConfig} from "@src/Config";

import localFont from 'next/font/local';
import ImageService from "@src/core/services/image";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

interface BattleConclusionProps {
  attackerTroops: number;
  defenderTroops: number;
  battleAttack: any;
  displayConclusionCallback: () => void;
  CheckForKoban: () => void;
  attackerImage: string;
  defenderImage: string;
  attackersFaction: string;
  defendersFaction: string;
}

const BattleConclusion = ({attackerTroops, defenderTroops, battleAttack, displayConclusionCallback, CheckForKoban, attackerImage, defenderImage, attackersFaction, defendersFaction}: BattleConclusionProps) => {
  const user = useUser();
  const [attackerFilter, setAttackerFilter] = useState('brightness(1)');
  const [defenderFilter, setDefenderFilter] = useState('brightness(1)');
  const [attackerStyle, setAttackerStyle] = useState({});
  const [defenderStyle, setDefenderStyle] = useState({});

  const [battleRewards, setBattleRewards] = useState([]);
  const [battleRewardsClaimed, setBattleRewardsClaimed] = useState(false);
  const {requestSignature} = useEnforceSignature();

  const battleOutcome = useRef<any>();
  const battleContext = useRef<any>();
  const attackerOutcome = useRef<any>();
  const defenderOutcome = useRef<any>();
  const battleLogText = useRef<any>();
  const battleLog = useRef<any>();

  const { isOpen: isOpenClaimRewards, onOpen: onOpenClaimRewards, onClose: onCloseClaimRewards} = useDisclosure();

  useEffect(() => {
    console.log("useEffect battleAttack", battleAttack)
    if (battleAttack.length !== 0) {
      ShowAttackConclusion();
      return;
    } 
  }, [battleAttack]);  
  
  function ShowAttackConclusion(){
    console.log("ShowAttackConclusion")
    var attackersAlive = Number(attackerTroops);
    var attackersSlain = 0;
    var defendersSlain = 0;
    var outcomeLog = ""
    const attackerDice = battleAttack[0].diceScores1;
    const defenderDice = battleAttack[0].diceScores2;

    for(var i = 0; i < attackerDice.length; i++)
    {
      if(attackerDice[i] <= defenderDice[i])
      {
        attackersAlive--;
        attackersSlain++;
        // console.log("attacker dies")
      }
      else
      {
        defendersSlain++;
      }

      outcomeLog += "Attacker: " + attackerDice[i] + " Defender: " + defenderDice[i]+"<br>";
    }

    battleLogText.current.innerHTML = outcomeLog;

    if(attackersSlain < defendersSlain) {
      battleOutcome.current.textContent = "Victory!";
      battleContext.current.textContent = "You slew more defenders than you lost";
      setAttackerFilter('brightness(1)');
      setDefenderFilter('brightness(0.4)');
      setAttackerStyle({position: "relative", background: "whitesmoke", display: "flex", justifyContent: "center",
                        padding: "5px",borderRadius:"50%", boxSize: "border-box", boxShadow: "0 20px 50px rgba(255, 255, 255, 0.8)"});
      setDefenderStyle({borderRadius:"50%",boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)"});
    }
    else if(attackersSlain > defendersSlain) {
      battleOutcome.current.textContent = "Defeat!";
      battleContext.current.textContent = "The defenders slew more of your troops than you slew of theirs";
      setAttackerFilter('brightness(0.4)');
      setDefenderFilter('brightness(1');
      setDefenderStyle({position: "relative", background: "whitesmoke", display: "flex", justifyContent: "center",
                        padding: "5px", borderRadius:"50%", boxSize: "border-box", boxShadow: "0 20px 50px rgba(255, 255, 255, 0.8)"});
      setAttackerStyle({borderRadius:"50%",boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)"});
    }
    else if(attackersSlain == defendersSlain) {
      battleOutcome.current.textContent = "Draw";
      battleContext.current.textContent = "Neither side was able to gain an advantage over the other";
      setAttackerFilter('brightness(1)');
      setDefenderFilter('brightness(1)');
      setAttackerStyle({borderRadius:"50%"});
      setDefenderStyle({borderRadius:"50%"});
    }

    attackerOutcome.current.textContent = "lost "+attackersSlain+"/"+ Number(attackerTroops)+" troops";
    defenderOutcome.current.textContent = "lost "+defendersSlain+"/"+defenderTroops+" troops";
    
    //dice removed
    // setupDice(attackerDice, defenderDice);


    // attackSetUp.current.style.display = "none"
    // attackConclusion.current.style.display = "block"
    // SetDisplayConclusion(true);
    CheckForKoban();

    if(defendersSlain>0) CheckForBattleRewards();
  }
  const CheckForBattleRewards = async () => {
    try {
      const signature = await requestSignature();
      const data = await getBattleRewards(user.address?.toLowerCase(), signature);
      setBattleRewards(data);
    } catch (error) {
      console.log(error)
    }
  }

  const claimedRewards = () => {
    setBattleRewardsClaimed(true);
    onCloseClaimRewards();
    console.log("claimedRewards")
  }
  function showDetailedResults(){
    battleLog.current.style.display = battleLog.current.style.display === "block" ? "none" : "block";
  }

return (
  <>
        <div>
          <VStack spacing='2'>
            <Text 
              fontSize={{base: '28px', sm: '28px'}}
              className={gothamBook.className}
              ref={battleOutcome}
              as='b'
              >Victory!</Text>
            <Text 
              fontSize={{base: '14px', sm: '14px'}}
              className={gothamBook.className}
              ref={battleContext} 
              as='i'
              >The defenders slew more of your troops than you slew of theirs</Text>
          </VStack>

      <Flex direction='row' justify='space-between' justifyContent='center'>
        <Box mb={4} bg='#272523' p={2} rounded='md' w='90%' justifyContent='center' >
          <HStack justify='space-between'>
            <Box w='45'>
              <VStack>
              {attackerImage !== '' ?
               <div style={attackerStyle}>
                <Avatar
                  boxSize={{base: '50px', sm: '100px'}}
                  objectFit="cover"
                  src={ImageService.translate(attackerImage).fixedWidth(100, 100)}
                  filter={attackerFilter}
                  /> 
                  </div>: <></>
              }
              <Text textAlign='left' 
              fontSize={{base: '16px', sm: '24px'}}
              >{attackersFaction}</Text>
              </VStack>
            </Box>
            <Box  w='10'>
              <Text textAlign='left' 
              fontSize={{base: '12px', sm: '16px'}}
              >VS</Text>
            </Box>

            <Box  w='45'>
              <VStack>
              {defenderImage !== '' ?
              <div style={defenderStyle}>
                <Avatar
                  boxSize={{base: '50px', sm: '100px'}}
                  objectFit="cover"
                  src={ImageService.translate(defenderImage).fixedWidth(100, 100)}
                  filter={defenderFilter}
                  /> </div>: <></>
              }
              <Text textAlign='right' 
              fontSize={{base: '16px', sm: '24px'}}
              >{defendersFaction}</Text>
              </VStack>
            </Box>
          </HStack>
          </Box>
        </Flex>

          <Flex direction='row' justify='space-between' justifyContent='center'>
            <Box mb={4} bg='#272523' p={2} rounded='md' w='90%' justifyContent='center' >
            <Center>
              <HStack w='90%' justify='space-between'>
                <Text style={{textAlign:'left'}}>Attackers {attackersFaction}</Text>
                <Text style={{textAlign:'left'}}>Defenders {defendersFaction}</Text>
              </HStack>
            </Center>
            <Center>
              <HStack w='90%' justify='space-between'>
                <Text ref={attackerOutcome}>This is the attacker outcome</Text>
                <Text ref={defenderOutcome}> This is the defender outcome</Text>
              </HStack>
            </Center>

            </Box>
          </Flex>
          </div>

          <Center>
            <HStack w='90%' justify='space-between'>
              <RdButton
                onClick={() => displayConclusionCallback()}
                w='200px'
                fontSize={{base: 'sm', sm: 'md'}}
                hoverIcon={false}
                marginTop='2'
                marginBottom='2'>
                Attack Again
              </RdButton>
              <RdButton 
                onClick={showDetailedResults}
                w='250px'
                fontSize={{base: 'sm', sm: 'md'}}
                hoverIcon={false}
                marginTop='2'
                marginBottom='2'>
                Detailed Results
              </RdButton>
              {!battleRewards || battleRewards.length ===0 ||battleRewardsClaimed ? (<></>) : (
              <RdButton 
                onClick={() => onOpenClaimRewards()}
                fontSize={{base: 'sm', sm: 'md'}}
                >Claim Rewards</RdButton>
            )}
            </HStack>
          </Center>
          
      <ClaimRewards isOpen={isOpenClaimRewards} onClose={claimedRewards} battleRewards={battleRewards}/>

        <Spacer m='4' />

        <div ref={battleLog} style={{display: 'none', overflowY:'scroll', height:'300px'}}>
          <Flex direction='row' justify='space-between' justifyContent='center'>
            <Box mb={4} bg='#272523' p={2} rounded='md' w='90%' justifyContent='center' >
              <form  >
                <Heading id="">Results:</Heading>
                <p ref={battleLogText}></p>
              </form>
            </Box>
          </Flex>
        </div>

      </>
)
}

export default BattleConclusion;