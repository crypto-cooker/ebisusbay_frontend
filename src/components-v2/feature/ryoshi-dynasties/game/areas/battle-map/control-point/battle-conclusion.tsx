import React, {useEffect, useMemo, useState} from 'react';
import {
  Avatar,
  Box,
  Center,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {getBattleRewards} from "@src/core/api/RyoshiDynastiesAPICalls";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import ClaimRewards from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/claim-rewards';
import localFont from 'next/font/local';
import ImageService from "@src/core/services/image";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";
import {RdControlPointLeaderBoard} from "@src/core/services/api-service/types";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

interface AttackerFaction {
  name: string;
  factionId: number;
  armyId: string;
  troops: number;
  image: string;
  role: string;
  hasMultiple: boolean;
}

interface BattleConclusionProps {
  attackerTroops: number;
  battleAttack: any;
  onAttackAgain: () => void;
  onRetrieveKobanBalance: () => void;

  attacker: AttackerFaction;
  defender: RdControlPointLeaderBoard;
}

const BattleConclusion = ({attacker, attackerTroops, defender, battleAttack, onAttackAgain, onRetrieveKobanBalance}: BattleConclusionProps) => {
  const user = useUser();

  const [battleRewards, setBattleRewards] = useState({
    quantity: []
  });
  const [battleRewardsClaimed, setBattleRewardsClaimed] = useState(false);
  const {requestSignature} = useEnforceSignature();

  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const { isOpen: isOpenClaimRewards, onOpen: onOpenClaimRewards, onClose: onCloseClaimRewards} = useDisclosure();

  const battleDetails = useMemo(() => {
    const ret = {
      title: '',
      subtitle: '',
      result: '',
      attackerTroopsLost: 0,
      defenderTroopsLost: 0,
      outcomeLog: []
    }
    let attackersAlive = Number(attackerTroops);
    const attackerDice = battleAttack[0].diceScores1;
    const defenderDice = battleAttack[0].diceScores2;

    for (let i = 0; i < attackerDice.length; i++) {
      if(attackerDice[i] <= defenderDice[i]) {
        attackersAlive--;
        ret.attackerTroopsLost++;
      } else {
        ret.defenderTroopsLost++;
      }

      ret.outcomeLog.push({attacker: attackerDice[i], defender: defenderDice[i]} as never);
    }

    if(ret.attackerTroopsLost < ret.defenderTroopsLost) {
      ret.title = 'Victory!';
      ret.subtitle = 'You defeated more defenders than you lost';
      ret.result = 'win';
    } else if (ret.attackerTroopsLost > ret.defenderTroopsLost) {
      ret.title = 'Defeat!';
      ret.subtitle = 'You lost more troops than you defeated';
      ret.result = 'loss';
    } else {
      ret.title = 'Draw';
      ret.subtitle = 'Neither side gained an advantage';
      ret.result = 'tie';
    }

    return ret;
  }, [battleAttack, attackerTroops]);

  const checkForBattleRewards = async () => {
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
  }

  const handleShowDetailedResults = () =>{
    setShowDetailedResults(!showDetailedResults);
  }

  useEffect(() => {
    if (battleAttack.length !== 0) {
      onRetrieveKobanBalance();
      if(battleDetails.defenderTroopsLost > 0) {
        checkForBattleRewards();
      }
      return;
    }
  }, [battleAttack]);

  return (
    <>
      <Box>
        <VStack spacing='2'>
          <Text fontSize='3xl' className={gothamBook.className} fontWeight='bold'>
            {battleDetails.title}
          </Text>
          <Text fontSize='sm' className={gothamBook.className} as='i' textAlign='center'>
            {battleDetails.subtitle}
          </Text>
        </VStack>

        <RdModalBox>
          <SimpleGrid templateColumns='1fr 25px 1fr' alignItems='center' minH='160px'>
            <GridItem>
              <Avatar
                boxSize={{base: '50px', sm: '100px'}}
                objectFit='cover'
                src={ImageService.translate(attacker.image).fixedWidth(100, 100)}
                filter={battleDetails.result === 'win' ? 'brightness(1)' : 'brightness(0.4)'}
                boxShadow={battleDetails.result === 'win' ? '0 20px 50px rgba(255, 255, 255, 0.8)' : 'none'}
              />
            </GridItem>
            <GridItem rowSpan={3} fontSize='xl'>
              vs
            </GridItem>
            <GridItem textAlign='end'>
              <Avatar
                boxSize={{base: '50px', sm: '100px'}}
                objectFit='cover'
                src={ImageService.translate(defender.image).fixedWidth(100, 100)}
                filter={battleDetails.result === 'loss' ? 'brightness(1)' : 'brightness(0.4)'}
                boxShadow={battleDetails.result === 'loss' ? '0 20px 50px rgba(255, 255, 255, 0.8)' : 'none'}
              />
            </GridItem>
            <GridItem>
              <Text textAlign='left' fontSize={{base: 'md', sm: '2xl'}}>{attacker.name}</Text>
            </GridItem>
            <GridItem textAlign='end'>
              <Text textAlign='right' fontSize={{base: 'md', sm: '2xl'}}>{defender.name}</Text>
            </GridItem>
            <GridItem>
              <Text textAlign='left' fontSize={{base: 'xs', sm: 'md'}}>Lost: {battleDetails.attackerTroopsLost} / {attackerTroops}</Text>
            </GridItem>
            <GridItem>
              <Text textAlign='right' fontSize={{base: 'xs', sm: 'md'}}>Lost: {battleDetails.defenderTroopsLost} / {defender.totalTroops}</Text>
            </GridItem>
          </SimpleGrid>
        </RdModalBox>
      </Box>

      <Center>
        <HStack justify='space-between'>
          <RdButton
            onClick={onAttackAgain}
            fontSize={{base: 'sm', sm: 'md'}}
            hoverIcon={false}
            marginTop='2'
            marginBottom='2'>
            Attack Again
          </RdButton>
          <RdButton
            onClick={handleShowDetailedResults}
            fontSize={{base: 'sm', sm: 'md'}}
            hoverIcon={false}
            marginTop='2'
            marginBottom='2'>
            Detailed Results
          </RdButton>
          {!!battleRewards && battleRewards.quantity.length > 0 && !battleRewardsClaimed && (
            <RdButton onClick={() => onOpenClaimRewards()} fontSize={{base: 'sm', sm: 'md'}}>
              Claim Rewards
            </RdButton>
          )}
        </HStack>
      </Center>

      {showDetailedResults && (
        <Box overflowY='scroll' h='300px' mt={4}>
          <RdModalBox>
            <Heading id="">Results:</Heading>
            <SimpleGrid columns={4} templateColumns='90px 1fr 90px 1fr'>
              {battleDetails.outcomeLog.map((log: any, index) => (
                <React.Fragment key={index}>
                  <Box>Attacker:</Box>
                  <Box>{log.attacker}</Box>
                  <Box>Defender</Box>
                  <Box>{log.defender}</Box>
                </React.Fragment>
              ))}
            </SimpleGrid>
          </RdModalBox>
        </Box>
      )}

      {isOpenClaimRewards && (
        <ClaimRewards isOpen={isOpenClaimRewards} onClose={claimedRewards} battleRewards={battleRewards}/>
      )}
    </>
  )
}

export default BattleConclusion;