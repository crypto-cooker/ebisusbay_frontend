import { Box, HStack, Image, Text } from '@chakra-ui/react';

export const LootboxItem = ({ item }: { item: any }) => {
  const { loot } = item;
  return (
    <Box padding={2} h='full'>
      <Box w={16} h={16} justifyItems={'center'} alignItems={"center"}>
        {loot.image ? <Image src={loot.image} /> : <Image src="/img/xp_coin.png" />}
      </Box>
      <Box>
        <Text textAlign='center' w={16}>{loot.name}</Text>
      </Box>
    </Box>
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
