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

const gothamBook = localFont({ src: '../../../../../../../global/assets/fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../../../global/assets/fonts/Gotham-XLight.woff2' })

const FaqPage = () => {
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  return (
    <Stack spacing={3} className={gothamBook.className} fontSize={{ base: 'xs', md: 'sm' }}>

      <Box p={4}>
        <Text fontSize='lg' fontWeight='bold'>Fortune Rewards</Text>
        <Text>
          Fortune rewards accumulate from Fortune staking, marketplace listings, and from playing the game and can be withdrawn at any time.
          However, only withdrawing after 90-days will allow you to claim the full amount of rewards.
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
              <Text mt={4}>* Note that, the current season is subject to <strong>Karmic Debt</strong>. A percentage of the current rewards will be burned proportional to 90-day intervals since a user's last claim. The Karmic Debt starts at {rdConfig.bank.staking.fortune.startingDebt}%. That value will decrease to 0% as the current time gets closer to the end of the season and will reset after a successful claim.</Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Can I compound my current season rewards?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Yes, your rewards can be automatically compounded into an existing Fortune vault to maximize rewards, and will not reset the Karmic Debt. Only vaults ending later than 90 days are eligible.</Text>
              <Text mt={2}>Note that compounding can only be done once every 14 days</Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How often can I compound?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Compounding can only be done once every 14 days</Text>
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
              <Text>The Karmic Debt, represents the percentage of rewards that will be burned if a user decides to claim their rewards. This value starts at {rdConfig.bank.staking.fortune.startingDebt}% and will decrease proportionally in 90-day intervals since a user's last claim.</Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      <Box p={4}>
        <Text fontSize='lg' fontWeight='bold'>Presale Rewards</Text>
        <Text>
          Users who participated in the Fortune Token Presale were able to vest their tokens for extra bonuses. Vesting took place over a 3-season period and is now complete. Claiming presale rewards is done in the <strong>Presale</strong> tab
        </Text>
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