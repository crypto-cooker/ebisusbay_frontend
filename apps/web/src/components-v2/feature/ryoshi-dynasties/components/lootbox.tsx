import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { useLootBoxInfo } from '../game/hooks/use-lootbox';
import { LootboxItem } from './lootbox-item';
import RdButton from './rd-button';
import { useCallback } from 'react';
import { ApiService } from '@src/core/services/api-service';
import useEnforceSignature from '@src/Components/Account/Settings/hooks/useEnforceSigner';
import { useUser } from '@src/components-v2/useUser';

export const LootBox = ({ item }: { item: any }) => {
  const { lootboxId } = item;
  const { data: boxInfo, isLoading } = useLootBoxInfo(lootboxId);
  const lootboxItems = boxInfo?.lootboxItems;
  const { requestSignature } = useEnforceSignature();
  const user = useUser();

  const handleOpen = useCallback(async () => {
    const signature = await requestSignature();

    const res = ApiService.withoutKey()
      .ryoshiDynasties.openLootBox(lootboxId, user.address as string, signature)
      .then((res) => res.data)
      .catch((error) => console.log(error));
    console.log(res, "HHHHHHHHHHHHHHHHHHHHH");
  }, [lootboxId, user]);

  return (
    <AccordionItem bgColor="#564D4A" rounded="md" my={1} w="full">
      <AccordionButton w="full">
        <Flex justify="space-between" w="full">
          <VStack w="50%" display={{ base: 'none', sm: 'flex' }} justify="space-around">
            <Flex alignItems="center">{item.lootbox.name}</Flex>
            <Flex alignItems="center" fontSize={12}>
              {item.lootbox.description}
            </Flex>
          </VStack>
          <HStack justify="space-around" w={{ base: 'full', sm: 'unset' }}>
            <Box w={100}>
              <Image src={item.lootbox.image} objectFit="cover" fallbackSrc="/img/lootbox.png" />
            </Box>
            <AccordionIcon ms={4} my="auto" />
          </HStack>
        </Flex>
      </AccordionButton>
      <AccordionPanel>
        <Flex justify="space-around" gap={2}>
          {lootboxItems ? lootboxItems.map((item: any, index: any) => <LootboxItem item={item} key={index} />) : <></>}
        </Flex>
        <Flex justify="center">
          <RdButton onClick={handleOpen}>Open</RdButton>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};
