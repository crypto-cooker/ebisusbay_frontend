import { Box, Image, Text } from '@chakra-ui/react';

export const LootboxItem = ({ item }: { item: any }) => {
  const { loot } = item;
  return (
    <Box padding={2} w={{base:70, sm:100}} h='full'>
      <Box>
        {loot.image ? <Image src={loot.image} /> : <Image src="/img/xp_coin.png" />}
      </Box>
      <Box>
        <Text textAlign='center'>{loot.name}</Text>
      </Box>
    </Box>
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
