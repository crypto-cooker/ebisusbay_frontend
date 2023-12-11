import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  ListItem,
  OrderedList,
  Stack,
  Text,
} from "@chakra-ui/react"
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

const FaqPage = () => {

  return (
    <Stack spacing={3} className={gothamBook.className} fontSize={{ base: 'xs', md: 'sm' }}>

      <Box p={4}>
        <Text>
          NFTs from collection winners of the September Volume Competition are now eligible for daily FRTN rewards. The collection winners are (in order): Cowz, Aiko Legends, Mad Meerkat.
        </Text>
        <Text mt={2}>
          Each collection is designated a FRTN rewards pool of a fixed size proportional to their competition rank. This pool is distributed to stakers daily. Stake more to earn more!
        </Text>
        <Accordion fontSize='sm' mt={4}>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                What is the reward schedule for each collection?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Based on the competition ranking, the collection winners are allocated the following per day:</Text>
              <OrderedList>
                <ListItem>Cowz - 1,200 FRTN</ListItem>
                <ListItem>Aiko Legends - 850 FRTN</ListItem>
                <ListItem>Mad Meerkat - 850 FRTN</ListItem>
              </OrderedList>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How long do the rewards last?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>The rewards will be distributed daily for a 30 day period.</Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How much is my share?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Staked NFTs will earn a percentage of the total daily allocated rewards. This is based on the amount of currently staked NFTs for each respective collection.</Text>
              <Text mt={2}>For example, if there are currently 999 Cowz NFTs staked and "User A" then stakes 1 Cowz NFT, that user's staked amount represents 0.1% of the rewards pool and will receive 0.1% of 1,200 FRTN daily.</Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Stack>
  );
}

export default FaqPage;