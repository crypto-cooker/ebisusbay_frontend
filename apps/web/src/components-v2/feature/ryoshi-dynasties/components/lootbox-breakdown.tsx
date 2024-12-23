import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import { indexOf } from 'lodash';
import { LootBox } from './lootbox';
import { useLootBoxBalance } from '../game/hooks/use-lootbox';


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
