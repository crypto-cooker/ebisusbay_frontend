import React, {useContext} from "react";
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
  UnorderedList,
} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

const FaqPage = () => {
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  return (
    <Stack spacing={3} className={gothamBook.className} fontSize={{ base: 'xs', md: 'sm' }}>

      <Box p={4}>
        <Text fontSize='lg' fontWeight='bold'>Fortune Rewards</Text>
        <Text>
          Fortune rewards accumulate from Fortune staking, marketplace listings, and from playing the game and can be withdrawn at any time.
          However, only withdrawing at the end of a season will allow you to claim the full amount of rewards.
        </Text>
        <Accordion fontSize='sm' mt={4}>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How do I claim rewards from the current season?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>The Fortune tab will contain all seasons with pending rewards, including the current season. Click <strong>Claim</strong> to receive your current season rewards.</Text>
              <Text mt={4}>* Note that, the current season is subject to a burn malus, known here as the <strong>Karmic Debt</strong>. A percentage of the current rewards will be burned proportional to the time left in the season. The Karmic Debt starts at {rdConfig.bank.staking.fortune.startingDebt}% at the start of a season. That value will decrease to 0% as the current time gets closer to the end of the season.</Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Can I claim rewards from past seasons?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Any seasons with unclaimed rewards will be displayed under the <strong>Fortune</strong> tab. Click the <strong>Claim</strong> button to receive the seaon rewards.</Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                What is the Karmic Debt?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>The Karmic Debt, also known as a burn malus, represents the percentage of rewards that will be burned if a user decides to withdraw before the end of season. At the start of the season, this value starts at {rdConfig.bank.staking.fortune.startingDebt}% and decreases linearly until the end of the season when it becomes 0%</Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      <Box p={4}>
        <Text fontSize='lg' fontWeight='bold'>Presale Rewards</Text>
        <Text>Users who participated in the Fortune Token Presale can now begin vesting their tokens. Those also holding Fortune Teller NFTs can exchange them for bonus Fortune tokens and Fortune Guards. This is done in the <strong>Presale</strong> tab</Text>
        <Accordion fontSize='sm' mt={4}>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How do I receive the presale rewards?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Click the <strong>Presale</strong> tab. By connecting your wallet that participated in the presale, a vault will be created which will be used to faciliate the vesting process:</Text>
              <OrderedList mt={2}>
                <ListItem>Click the <strong>Create Vault</strong> button to open a vault</ListItem>
                <ListItem>Once the vault is opened, the page will show your vault balance</ListItem>
              </OrderedList>
              <Text mt={4}>These rewards are vested linearly for 3 seasons (9 months). Every block, more Fortune will become available to claim and you can claim the available amount at any time.</Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How to I trade in my Fortune Tellers?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Fortune Tellers can be exchanged to receive bonus Fortune. They will also be exchanged for Fortune Guards, which are a key component to minting Heroes.</Text>
              <Text mt={4}>If you have Fortune Tellers, they will show up under <strong>Fortune Teller Bonus</strong>. Review your bonus and click <strong>Exchange</strong> to receive it.</Text>
              <Text mt={4}>Exchanged Fortune Tellers will be returned at the end of the claim period of 90 days.</Text>
              <Text mt={4} fontStyle='italic'>*Note that the Cedric "Ceddy" Biscuitworth teller is only eligible for the Fortune rewards.</Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Which Fortune Teller NFTs are eligible for rewards?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>The following Fortune Tellers are eligible for both $Fortune <strong>and</strong> Fortune Guards:</Text>
              <UnorderedList mt={2}>
                <ListItem>Mr. Bertram Scuddlesworth Esq</ListItem>
                <ListItem>Mr. Cornelius Rufus Puffington</ListItem>
                <ListItem>Mr. Reginald Archibald Worthington</ListItem>
                <ListItem>Mr. Sebastian Mortimer Tiddleton</ListItem>
              </UnorderedList>
              <Text mt={4}>The following Fortune Tellers are eligible for $Fortune <strong>only</strong>:</Text>
              <UnorderedList mt={2}>
                <ListItem>Mr. Cedric "Ceddy" Biscuitworth</ListItem>
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Stack>
  );
}

export default FaqPage;