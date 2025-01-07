import {Box, Image, SimpleGrid, Text, VStack} from "@chakra-ui/react";
import {round} from "@market/helpers/utils";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {commify} from "ethers/lib/utils";
import ImageService from "@src/core/services/image";
import React from "react";
import {VaultType} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";

interface StakeFormProps {
  fortuneToStake: number;
  daysToStake: number;
  vaultType: VaultType;
  apr: number;
  mitama: number;
  troops: number;
  title?: string;
  aprDiff?: number;
  mitamaDiff?: number;
  troopsDiff?: number;
}

const StakePreview = ({fortuneToStake, daysToStake, vaultType, apr, mitama, troops, title, aprDiff, mitamaDiff, troopsDiff}: StakeFormProps) => {
  const optionalPlus = (value: number) => value >= 0 ? `+${commify(round(value))}` : commify(round(value));
  const diffColor = (value: number) => value >= 0 ? 'green' : 'red';

  return (
    <Box bgColor='#292626' rounded='md' p={4}>
      {!!title && (
        <Box fontWeight='bold' fontSize='sm' mb={3}>
          {title}
        </Box>
      )}
      <SimpleGrid columns={{base:2, sm: 3}} gap={4}>
        <VStack spacing={0}>
          <FortuneIcon boxSize={6} />
          <Text>APR</Text>
          <Text fontSize={24} fontWeight='bold'>{apr * 100}%</Text>
          {aprDiff !== undefined && (
            <Text
              fontSize={12}
              fontWeight='bold'
              color={diffColor(aprDiff)}
            >
              {optionalPlus(aprDiff)}%
            </Text>
          )}
          <Text fontSize={12} color='#aaa' textAlign='center'>{commify(daysToStake)} day commitment</Text>
        </VStack>
        <VStack spacing={0}>
          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()} alt="troopsIcon" boxSize={6}/>
          <Text>Troops</Text>
          <Text fontSize={24} fontWeight='bold'>{commify(round(troops))}</Text>
          {troopsDiff !== undefined && (
            <Text
              fontSize={12}
              fontWeight='bold'
              color={diffColor(troopsDiff)}
            >
              {optionalPlus(troopsDiff)}
            </Text>
          )}
          <Text fontSize={12} color='#aaa' textAlign='center'>{commify(round(fortuneToStake, 3))} FRTN stake</Text>
        </VStack>
        <VStack spacing={0}>
          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/mitama.png').convert()} alt="troopsIcon" boxSize={6}/>
          <Text>Mitama</Text>
          <Text fontSize={24} fontWeight='bold'>{commify(mitama)}</Text>
          {mitamaDiff !== undefined && (
            <Text
              fontSize={12}
              fontWeight='bold'
              color={diffColor(mitamaDiff)}
            >
              {optionalPlus(mitamaDiff)}
            </Text>
          )}
          <Text fontSize={12} color='#aaa' textAlign='center'>{commify(round(fortuneToStake, 3))} FRTN stake</Text>
        </VStack>
      </SimpleGrid>
    </Box>
  )
}

export default StakePreview;