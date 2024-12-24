import {
  Accordion,
  Box
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useLootBoxBalance } from '../game/hooks/use-lootbox';
import { openedLootboxAtom } from '../game/modals/loot-box';
import { LootBox } from './lootbox';


const LootBoxBreakdown = () => {
  const { data: items, isLoading, refetch } = useLootBoxBalance();
  const itemsWithBalance = items?.filter((item: any) => item.balance > 0);
  const [openedLootbox, setOpenedLootbox] = useAtom(openedLootboxAtom);

  return (
    <>
      {!!itemsWithBalance && itemsWithBalance.length > 0 ? (
        <Accordion w="full" mt={2} allowMultiple>
          {itemsWithBalance.map((item:any, index:number) => (
            <LootBox 
              key={index} 
              item={item} 
              onChange={refetch}
              onOpened={(reward: any) => setOpenedLootbox(reward)}
            />
          ))}
        </Accordion>
      ) : (
        <Box textAlign='center'>You currently have no lootboxes to open</Box>
      )}
    </>
  );
};

export default LootBoxBreakdown;
