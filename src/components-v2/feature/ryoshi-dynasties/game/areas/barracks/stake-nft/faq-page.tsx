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
        <Text>
          Each stakeable NFT is eligible for bonus troops. These bonus troops are used to increase your chances of winning battles. Higher ranked NFTs can yield a larger amount of troops. However, some collections are restricted to where NFTs must contain specific traits. For example, NFTs from the holiday collections must contain a weapon.
        </Text>
        <Stack direction='row' align='center' bg='#f8a211' p={2} rounded='sm' mt={4}>
          <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} color='#333' boxSize={8}/>
          <Text
            fontSize='14'
            color='#333'
            fontWeight='bold'
          >
            Warning: Once staked, NFTs can only be unstaked if you have neither deployed nor delegated any troops. If troops have been deployed or delegated, then the staked NFTs are locked until the next game.
          </Text>
        </Stack>
        <Accordion fontSize='sm' mt={4}>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How are bonus troops calculated?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>The amount of bonus troops depends on the collection type and rank of the NFT. See the below FAQ items for more information specific to each collection</Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Ryoshi VIP Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Ryoshi VIP NFTs must contain any of the following for the "Tools" trait:</Text>
              <UnorderedList>
                {rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-vip')!.traits[0].values.map((value) => (
                  <ListItem key={value}>{titleCase(value.toUpperCase())}</ListItem>
                ))}
              </UnorderedList>
              <Text mt={4}>Eligible NFTs will then be calculated:</Text>
              <UnorderedList>
                {rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-vip')!.multipliers.map((multiplier, i) => (
                  <ListItem key={i}>{multiplier.percentile}th percentile: {commify(multiplier.value)}</ListItem>
                ))}
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Ryoshi Halloween Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Ryoshi Halloween NFTs must contain any value for the "Tools" trait EXCEPT:</Text>
              <UnorderedList>
                {rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-halloween')!.traits[0].values.map((value) => (
                  <ListItem key={value}>{titleCase(value.toUpperCase())}</ListItem>
                ))}
              </UnorderedList>
              <Text mt={4}>Eligible NFTs will then be calculated:</Text>
              <UnorderedList>
                {rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-halloween')!.multipliers.map((multiplier, i) => (
                  <ListItem key={i}>{multiplier.percentile}th percentile: {commify(multiplier.value)}</ListItem>
                ))}
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Ryoshi Christmas Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Ryoshi Christmas NFTs must contain any of the following for the "Miscellaneous" trait:</Text>
              <UnorderedList>
                {rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-christmas')!.traits[0].values.map((value) => (
                  <ListItem key={value}>{titleCase(value.toUpperCase())}</ListItem>
                ))}
              </UnorderedList>
              <Text mt={4}>Eligible NFTs will then be calculated:</Text>
              <UnorderedList>
                {rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-christmas')!.multipliers.map((multiplier, i) => (
                  <ListItem key={i}>{multiplier.percentile}th percentile: {commify(multiplier.value)}</ListItem>
                ))}
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Fortune Guards Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>All Fortune Guards NFTs are eligible. Bonus is based on the NFT ID:</Text>
              <UnorderedList>
                {rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'fortune-guards')!.ids.map((id, i) => (
                  <ListItem key={i}>{id.id}: {commify(id.bonus)}</ListItem>
                ))}
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                Ryoshi Tales (Goblin Gala) Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Ryoshi Tales (Goblin Gala) NFTs must contain any value for the "Accessories" trait EXCEPT:</Text>
              <UnorderedList>
                {rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales')!.traits[0].values.map((value) => (
                  <ListItem key={value}>{titleCase(value.toUpperCase())}</ListItem>
                ))}
              </UnorderedList>
              <Text mt={4}>Eligible NFTs will then be calculated:</Text>
              <UnorderedList>
                {rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales')!.multipliers.map((multiplier, i) => (
                  <ListItem key={i}>{multiplier.percentile}th percentile: {commify(multiplier.value)}</ListItem>
                ))}
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Stack>
  );
}

export default FaqPage;