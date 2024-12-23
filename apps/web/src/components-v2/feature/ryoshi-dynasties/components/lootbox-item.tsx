import { Box, Flex, HStack, Image, SimpleGrid, Spacer, Stack, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

export const LootboxItem = ({ item }: { item: any }) => {
  const { loot, probability, quantity } = item;

  const quantityText = useMemo(() => {
    if (quantity === null)  return '∞';
    return quantity
  }, [quantity]);

  return (
    <VStack p={2} bg='#33302F' rounded='md' justify='space-between' align='stretch'>
      <Box>
        <Stack direction={{base: 'column', sm: 'row'}} justify='space-between' align='top'>
          <Box w={20}>
            {loot.image ? <Image src={loot.image} rounded='md' /> : <Image src="/img/xp_coin.png" rounded='md' />}
          </Box>
          <Text textAlign={{base: 'start', sm: 'end'}} fontSize='sm' w='full'>{loot.name}</Text>
        </Stack>
      </Box>
      <SimpleGrid columns={2} mt={4} fontSize='xs' color='#E2E8F0'>
        <Box >available</Box>
        <Box textAlign='end'>{quantityText}</Box>
        <Box>probability</Box>
        <Box textAlign='end'>{probability * 100}%</Box>
      </SimpleGrid>
    </VStack>
  );
};

export const LootboxItemMini = ({ item }: { item: any }) => {
  const { loot } = item;
  return (
    <HStack padding={2} h='full'>
      <Box w={10} h={10} justifyItems={'center'} alignItems={"center"}>
        {loot.image ? <Image src={loot.image} /> : <Image src="/img/xp_coin.png" />}
      </Box>
      <Box>
        <Text textAlign='center'>{loot.name}</Text>
      </Box>
    </HStack>
  );
};

interface ItemProps {
  id: number;
  name: string;
  description: string;
  image: string;
  type: string;
  chain: number;
  chainType: string;
  tokenAddress: string;
  tokenId: number;
  tokenAmount: number;
  tokenDecimals: number;
  quantity: number;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}
