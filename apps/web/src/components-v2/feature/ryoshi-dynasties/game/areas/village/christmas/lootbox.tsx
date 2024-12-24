import { useLootBoxBalance } from '@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-lootbox';
import { Accordion } from '@chakra-ui/react';
import { LootBox } from '@src/components-v2/feature/ryoshi-dynasties/components/lootbox';

const LootBoxBreakdown = () => {
  const { data: items, isLoading, refetch } = useLootBoxBalance();
  return (
    <>
      {!!items && (
        <Accordion w="full" mt={2} allowMultiple>
          {items.map((item:any, index:number) => (
            <LootBox key={index} item={item} onChange={refetch}/>
          ))}
        </Accordion>
      )}
    </>
  );
};

export default LootBoxBreakdown;