import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Stack,
  Text,
} from "@chakra-ui/react"
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

const FaqPage = () => {

  return (
    <Stack spacing={3} className={gothamBook.className} fontSize={{ base: 'xs', md: 'sm' }}>
      <Box p={4}>
        <Text mt={2}>
          At the end of each game, the faction with the most cumulative points at the Ebisu's Bay control point will win the privilege to have their collections staked for FRTN rewards! Each collection is designated a FRTN rewards pool of a fixed size proportional to their competition rank. This pool is distributed to stakers daily. Stake more to earn more!
        </Text>
        <Accordion fontSize='sm' mt={4}>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Eligibility Requirements
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>As this is a feature that affects collections, the winning faction must be a <strong>COLLECTION</strong> faction. Additionally, faction collections must be of the CRC-721 type. Any CRC-1155 based collections will not be included in the rewards distribution</Text>
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
              <Text>The rewards will be distributed daily for the length of 1 game.</Text>
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
              <Text>Staked NFTs will earn a percentage of the total daily rewards. This is based on the amount of currently staked NFTs across all faction collections.</Text>
              <Text mt={2}>For example, if there are currently 99 "Collection A" NFTs staked, 100 "Collection B" NFTs staked, and "User A" then stakes 1 "Collection A" NFT, that user's staked amount represents 0.5% of the rewards pool and will receive 0.5% of the total FRTN daily.</Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Stack>
  );
}

export default FaqPage;