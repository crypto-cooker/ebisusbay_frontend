import React, {useContext, useState} from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box, Icon,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {useAppSelector} from "@src/Store/hooks";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {titleCase} from "@src/utils";
import {commify} from "ethers/lib/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

const FaqPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user);
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  return (
    <Stack spacing={3} className={gothamBook.className} fontSize={{ base: 'xs', md: 'sm' }}>

      <Box p={4}>
      <Text>Ryoshi are your fearless troops! Your ability to amass Ryoshi warriors is tied to your account level and the NFT power-ups you've unlocked along the way. Time to level up and equip those power-ups to assemble the mightiest Ryoshi army the Cronos Chain has ever seen! </Text>
        <Accordion fontSize='sm' mt={4}>

          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                What is the limit of <b>Ryoshi</b> and what happens if I go over it?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>The current limit per player is 3000 Ryoshi. Should an account go over the limit they will have until the following week to withdraw them from the platform or to spend them in battles and resource gathering.</Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How can I aquire additional <b>Ryoshi</b>?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text mb={4}> <b>Ryoshi</b> can be acquired via sales or transfers and may be deposited back into the platform at anytime, so long as upkeep has been paid.</Text>
              <Text mb={4}><b>Ryoshi</b> can also be acquired by swapping in cards rewarded from Battles to create more on-chain <b>Ryoshi</b> to sell or deposit to the platform</Text> 
              <Text mb={4}> Rewards for trading in a set of 3 for each card (The tier acts as a multiplier):</Text>
              <UnorderedList>
                  <ListItem>Ebisus's Bay: 20</ListItem>
                  <ListItem>Verdant Forest: 15</ListItem>
                  <ListItem>Felisgarde: 15</ListItem>
                  <ListItem>Buccaneer Beach: 10</ListItem>
                  <ListItem>Omoikane’s Athenaeum: 15</ListItem>
                  <ListItem>Mitagi Retreat: 10</ListItem>
                  <ListItem>Venom’s Descent: 10</ListItem>
                  <ListItem>Infiniate Nexus: 20</ListItem>
                  <ListItem>Mitamic Fissure: 15</ListItem>
                  <ListItem>Seashrine: 20</ListItem>
                  <ListItem>Classy Keep: 10</ListItem>
                  <ListItem>Ice Shrine: 15</ListItem>
                  <ListItem>Clutch of Fukurokuju: 10</ListItem>
                  <ListItem>Orcunheim: 10</ListItem>
                  <ListItem>Volcanic Reach: 10</ListItem>
                  <ListItem>The Conflagration: 15</ListItem>
                  <ListItem>Iron Bastion: 20</ListItem>
                  <ListItem>Dragon Roost: 15</ListItem>
                  <ListItem>Ancestor’s Final Rest: 15</ListItem>
                  <ListItem>N’yar Spire: 10</ListItem>
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How do I withdraw my <b>Ryoshi</b>?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text mb={4}>At anytime a player may wish to withdraw their <b>Ryoshi</b> from the platform to the blockchain. <b>Ryoshi</b> are an 1155 token on the Ryoshi Resources contract with some extra special properties.</Text>
              <UnorderedList>
                  <ListItem key={0}>Keeping <b>Ryoshi</b> on chain requires weekly upkeep</ListItem>
                  <ListItem key={1}>There is a 10% transfer tax</ListItem>
                  <ListItem key={2}>There is a 10% royalty fee on sales</ListItem>
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Upkeep and Decay Information:
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text  mb={4}>Once per week upkeep needs to be paid by the holder for any on-chain <b>Ryoshi</b>. For every week upkeep goes unpaid there will be a 10% decay of all on chain <b>Ryoshi</b>. Upkeep prices increase at a faster rate as more <b>Ryoshi</b> are accumulated. Upkeep is paid in Koban weekly</Text>
              <UnorderedList>
                  <ListItem>1-200 Ryoshi → free</ListItem>
                  <ListItem>201-999 → x</ListItem>
                  <ListItem>1000-4999 → 2x</ListItem>
                  <ListItem>5000+ → 3x</ListItem>
              </UnorderedList>
              <Text mt={4}>Note: Formula will be adjust to include food and other resources aquired from holding Izanami Lands</Text>
              <Text mt={4}>Furthermore, 10% of <b>Ryoshi</b> deployed in battles or resource farming will not come back to the owner. This includes when recalling troops to move them to a new location.</Text>
            </AccordionPanel>
          </AccordionItem>
          
          
        </Accordion>
      </Box>
    </Stack>
  );
}

export default FaqPage;