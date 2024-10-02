import {Box, Image, SimpleGrid, Text, VStack} from "@chakra-ui/react";
import {findNextLowestNumber, round} from "@market/helpers/utils";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {commify} from "ethers/lib/utils";
import ImageService from "@src/core/services/image";
import React, {useContext, useEffect, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {VaultType} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";

interface StakeFormProps {
  fortuneToStake: number;
  daysToStake: number;
  vaultType: VaultType;
}

const StakePreview = ({fortuneToStake, daysToStake, vaultType}: StakeFormProps) => {
  const { config: rdConfig, refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [newApr, setNewApr] = useState(0);
  const [newTroops, setNewTroops] = useState(0);
  const [newMitama, setNewMitama] = useState(0);

  useEffect(() => {
    const numTerms = Math.floor(daysToStake / rdConfig.bank.staking.fortune.termLength);
    const availableAprs = (vaultType === VaultType.LP ?
      rdConfig.bank.staking.fortune.lpApr :
      rdConfig.bank.staking.fortune.apr) as any;
    const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
    setNewApr(availableAprs[aprKey] ?? availableAprs[1]);

    const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
    const mitama = Math.floor((fortuneToStake * daysToStake) / 1080);
    let newTroops = Math.floor(mitama / mitamaTroopsRatio);
    if (newTroops < 1 && fortuneToStake > 0) newTroops = 1;
    setNewTroops(newTroops);
    setNewMitama(mitama);
  }, [daysToStake, fortuneToStake]);

  return (
    <Box bgColor='#292626' rounded='md' p={4} mt={4} textAlign='center'>
      <SimpleGrid columns={{base:2, sm: 3}} gap={4}>
        <VStack spacing={0}>
          <FortuneIcon boxSize={6} />
          <Text>APR</Text>
          <Text fontSize={24} fontWeight='bold'>{newApr * 100}%</Text>
          <Text fontSize={12} color='#aaa'>{commify(daysToStake)} day commitment</Text>
        </VStack>
        <VStack spacing={0}>
          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()} alt="troopsIcon" boxSize={6}/>
          <Text>Troops</Text>
          <Text fontSize={24} fontWeight='bold'>{commify(round(newTroops))}</Text>
          <Text fontSize={12} color='#aaa'>{commify(round(fortuneToStake, 3))} $FRTN stake</Text>
        </VStack>
        <VStack spacing={0}>
          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/mitama.png').convert()} alt="troopsIcon" boxSize={6}/>
          <Text>Mitama</Text>
          <Text fontSize={24} fontWeight='bold'>{commify(newMitama)}</Text>
          <Text fontSize={12} color='#aaa'>{commify(round(fortuneToStake, 3))} $FRTN stake</Text>
        </VStack>

      </SimpleGrid>
    </Box>
  )
}

export default StakePreview;