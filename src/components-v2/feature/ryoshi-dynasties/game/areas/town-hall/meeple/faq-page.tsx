import React, {useContext, useState} from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box, HStack, Icon, Image,
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
import ImageService from "@src/core/services/image";

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
                How do I receive Ryoshi?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>
                There are many ways one can receive Ryoshi. The most common methods are to stake NFTs in the Barracks, stake VIPs in the Bank, and trade in battle cards in the Town Hall. From these methods, users will receive weekly Ryoshi replenishments that can be used for factions and other future utility.
              </Text>
              <Text mt={2}>
                As of now, existing Ryoshi populations aren't reset every week. Instead, they are topped until the restock cutoff of {commify(rdConfig.townHall.ryoshi.restockCutoff)} Ryoshi is reached.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                What is the difference between Off Duty and On Duty Ryoshi?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>
                On Duty Ryoshi represent the Ryoshi available to the user and faction. On Duty essentially means that Ryoshi can be used to interact with Ryoshi Dynasties.
              </Text>
              <Text mt={2}>
                Ryoshi can also be taken Off Duty, which means they get tokenized into an NFT (i.e. put on-chain). This allows Ryoshi to be transferred, sold on the marketplace, or used in other future activities outside of Ryoshi Dynasties. The drawback is that they can no longer interact with Ryoshi Dynasties until they are put back on duty.
              </Text>
              <Text mt={2}>
                Once off duty, Ryoshi will require upkeep to be paid before they can be put back on duty or transferred. See <strong>Upkeep Information</strong> section for more info on upkeep.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How many Ryoshi can be kept on duty?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>There is no limit to how may Ryoshi can be kept on duty. However, if a user has more than the restock cutoff of <strong>{commify(rdConfig.townHall.ryoshi.restockCutoff)}</strong> Ryoshi, they will not receive additional Ryoshi for the next game. Should a user go over the limit they will have to either withdraw them from the platform or to spend them in battles and resource gathering before the next game in order to resume receiving weekly top ups.</Text>
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
                <ListItem>Ancestor’s Final Rest: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 100)![1]}</ListItem>
                <ListItem>Classy Keep: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 103)![1]}</ListItem>
                <ListItem>Clutch of Fukurokuju: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 106)![1]}</ListItem>
                <ListItem>Dragon Roost: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 109)![1]}</ListItem>
                <ListItem>Ebisu's Bay: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 112)![1]}</ListItem>
                <ListItem>Infinite Nexus: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 115)![1]}</ListItem>
                <ListItem>Felisgarde: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 118)![1]}</ListItem>
                <ListItem>Mitagi Retreat: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 121)![1]}</ListItem>
                <ListItem>Ice Shrine: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 124)![1]}</ListItem>
                <ListItem>N’yar Spire: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 127)![1]}</ListItem>
                <ListItem>Mitamic Fissure: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 130)![1]}</ListItem>
                <ListItem>Buccaneer Beach: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 133)![1]}</ListItem>
                <ListItem>Omoikane’s Athenaeum: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 136)![1]}</ListItem>
                <ListItem>Orcunheim: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 139)![1]}</ListItem>
                <ListItem>Seashrine: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 142)![1]}</ListItem>
                <ListItem>The Conflagration: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 145)![1]}</ListItem>
                <ListItem>Iron Bastion: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 148)![1]}</ListItem>
                <ListItem>Verdant Forest: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 151)![1]}</ListItem>
                <ListItem>Venom’s Descent: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 154)![1]}</ListItem>
                <ListItem>Volcanic Reach: {Object.entries(rdConfig.townHall.ryoshi.tradeIn.base).find(([key, value]) => parseInt(key) === 157)![1]}</ListItem>
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
                Upkeep Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>
                All off duty Ryoshi will be required to be paid upkeep before they can be used. This includes bringing them back on duty and transferring them via diret transfer or marketplace sales. Upkeep is necessary to keep your Ryoshi healthy, fed, and loyal to your cause.
              </Text>
              <Text mt={4}>
                Upkeep will need to be paid with Koban once every 7 days and is paid on the entire off duty Ryoshi amount. For every week upkeep goes unpaid there will be a mutiny of {rdConfig.townHall.ryoshi.upkeepDecay * 100}% of all the user's off duty <b>Ryoshi</b>. Upkeep prices increase at a faster rate as more <b>Ryoshi</b> are accumulated, so be mindful of how may. Upkeep is paid in Koban weekly</Text>
              <UnorderedList>
                {rdConfig.townHall.ryoshi.upkeepCosts.sort((a, b) => a.threshold - b.threshold).map((cost, index, array) => {
                  const nextCost = array[index + 1];
                  const multiplier = cost.multiplier ? `x${cost.multiplier}` : 'no cost'
                  return (
                    <React.Fragment key={index}>
                      {!!nextCost ? (
                        <ListItem>{cost.threshold} - {nextCost.threshold - 1} → {multiplier}</ListItem>
                      ) : (
                        <ListItem>{cost.threshold}+ → {multiplier}</ListItem>
                      )}
                    </React.Fragment>
                  );
                })}
              </UnorderedList>
              <Text mt={4}>Note: Formula in the future will be adjusted to include food and other resources acquired from holding Izanami Lands</Text>
              <Text mt={4}>Furthermore, 10% of <b>Ryoshi</b> deployed in battles or resource farming will not come back to the owner. This includes when recalling troops to move them to a new location.</Text>
            </AccordionPanel>
          </AccordionItem>
          
          
        </Accordion>
      </Box>
    </Stack>
  );
}

export default FaqPage;