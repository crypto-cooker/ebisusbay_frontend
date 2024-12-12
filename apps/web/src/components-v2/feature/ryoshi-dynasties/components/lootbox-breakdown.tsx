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

interface LootBoxBreakdownProps {
  items: any[] | undefined;
}

const LootBoxBreakdown = ({ items }: LootBoxBreakdownProps) => {
  return (
    <>
      {items ? (
        <Accordion w="full" mt={2} allowMultiple>
          {items.map((item, index) => (
            <LootBox key={index} item={item}/>
          ))}
        </Accordion>
      ) : (
        <></>
      )}
    </>
  );
};

export default LootBoxBreakdown;
