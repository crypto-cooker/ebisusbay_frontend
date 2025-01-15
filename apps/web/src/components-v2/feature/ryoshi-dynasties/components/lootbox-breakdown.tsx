import {
  Accordion,
  Box,
  Flex,
  Image,
  SimpleGrid,
  Spinner,
  Text
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useLootBoxBalance, useLootBoxLog } from '../game/hooks/use-lootbox';
import { openedLootboxAtom } from '../game/modals/loot-box';
import { LootBox } from './lootbox';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUser } from '@src/components-v2/useUser';
import useEnforceSignature from '@src/Components/Account/Settings/hooks/useEnforceSigner';
import { ApiService } from '@src/core/services/api-service';
import RdTabButton from './rd-tab-button';
import styled from 'styled-components';
import { toast } from 'react-toastify';

enum TypeTab {
  open = 'open',
  log = 'log'
}

const LootBoxBreakdown = () => {
  const { data: items, isLoading, refetch } = useLootBoxBalance();
  const itemsWithBalance = items?.filter((item: any) => item.balance > 0);
  const [openedLootbox, setOpenedLootbox] = useAtom(openedLootboxAtom);
  const [showOpenLog, setOpenLog] = useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<TypeTab>(TypeTab.open);

  const handleTabChange = (key: TypeTab) => (e: any) => {
    setSelectedTab(key);
  };

  return (
    <>
      <Flex direction='row' justify='center' mt={2}>
        <SimpleGrid columns={2}>
          <RdTabButton size='sm' isActive={selectedTab === TypeTab.open} onClick={handleTabChange(TypeTab.open)}>
            Open
          </RdTabButton>
          <RdTabButton size='sm' isActive={selectedTab === TypeTab.log} onClick={handleTabChange(TypeTab.log)}>
            Log
          </RdTabButton>
        </SimpleGrid>
      </Flex>
      {selectedTab == TypeTab.open ? (!!itemsWithBalance && itemsWithBalance.length > 0 ? (
        <Accordion w="full" mt={2} allowMultiple>
          {itemsWithBalance.map((item: any, index: number) => (
            <LootBox
              key={index}
              item={item}
              onChange={refetch}
              onOpened={(reward: any) => setOpenedLootbox(reward)}
            />
          ))}
        </Accordion>
      ) : (
        <Box textAlign='center' mt={4}>You currently have no lootboxes to open</Box>
      )) : <LootBoxLog isOpen={selectedTab == TypeTab.log} />}
    </>
  );
};


const LootBoxLog = ({ isOpen }: { isOpen: boolean }) => {
  const user = useUser();
  const { requestSignature } = useEnforceSignature();
  const [items, setItems] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLootBoxLogs = useCallback(async () => {
    setIsLoading(true)
    try{
    const signature = await requestSignature();
    const data = await ApiService.withoutKey().ryoshiDynasties.getLootBoxLogs(user.address as string, signature).then((res) => res.data).catch((error) => { console.log(error); return null })
    if (data) setItems(data);
    } catch(error) {
      toast.error("Error in fetching logs");
    } finally {
      setIsLoading(false)
    }
  },
    [user.address]
  )

  useEffect(() => {
    if (isOpen) {
      fetchLootBoxLogs()
    }
  }, [isOpen, user.address]);

  return (
    <>
      {items && items.length > 0 ? (
        items.map((item: any, index: number) => <LootBoxLogItem item={item} key={index} />)
      ) : !isLoading ? (
        <Text textAlign='center' mt={4}>No items available</Text> // Render a message if items is empty or undefined
      ) : (
        <Flex w="full" justify='center' mt={4}>
          <Spinner/>
        </Flex>
      )}
    </>
  )
}


enum LOOTBOX_STATUS {
  CLAIMED = 'CLAIMED',
  PENDING = 'PENDING',
  FAILED = 'FAILED'
}

const CreatedTime = styled.div`
  position: absolute;
  right : 5px;
  bottom: 5px;
  color: gray;
`

const LootBoxLogItem = (props: any) => {
  const { lootbox, lootboxItem, status, probability, createdAt } = props.item;
  const color = status == LOOTBOX_STATUS.CLAIMED ? "green" : status == LOOTBOX_STATUS.PENDING ? "yellow" : "red"
  const date = new Date(createdAt);
  return (
    <Flex bgColor="#292626" position='relative' rounded="md" my={1} w="full" p={2} gap={4} alignItems='center'>
      <Flex height={100} alignItems="center">
        <Image width={100} src={lootbox.image} />
      </Flex>
      <SimpleGrid row={2} gap={2} flexGrow={1}>
        <Flex justify='space-around'>
          <Box>{lootbox.name}</Box>
          <Box color={color}>{status}</Box>
        </Flex>
        <Flex gap={2}>
          <Box alignItems="center">
            {lootboxItem.loot.image ? <Image width={50} src={lootboxItem.loot.image} /> : <Image width={50} src="/img/xp_coin.png" />}
          </Box>
          <Flex alignItems="center" gap={3} flexWrap='wrap'>
            <Text>{lootboxItem.loot.name}</Text>
            <Text>{`Probability: ${probability}`}</Text>
          </Flex>
        </Flex>
      </SimpleGrid>
      <CreatedTime>{date.toLocaleDateString()}</CreatedTime>
    </Flex>)
}

export default LootBoxBreakdown;
