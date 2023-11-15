import React, {useContext} from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Icon,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {titleCase} from "@src/utils";
import {commify} from "ethers/lib/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {
  RyoshiConfigBarracksStakingNFTCollection,
  RyoshiConfigTraitInclusionType
} from "@src/components-v2/feature/ryoshi-dynasties/game/types";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../../../fonts/Gotham-XLight.woff2' })

const FaqPage = () => {
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
          <EligibilityCriteriaItem name='Ryoshi VIP' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-vip')!} />
          <EligibilityCriteriaItem name='Ryoshi Halloween' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-halloween')!} />
          <EligibilityCriteriaItem name='Ryoshi Christmas' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-christmas')!} />
          <EligibilityCriteriaItem name='Ryoshi Tales (Goblin Gala)' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales' && c.minId === 1 && c.maxId === 500)!} />
          <EligibilityCriteriaItem name='Ryoshi Tales (Celestial Celebration)' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales' && c.minId === 501 && c.maxId === 700)!} />
        </Accordion>
      </Box>
    </Stack>
  );
}

export default FaqPage;

const EligibilityCriteriaItem = ({ name, collectionStakingConfig }: { name: string, collectionStakingConfig: RyoshiConfigBarracksStakingNFTCollection }) => {
  return (
    <AccordionItem>
      <AccordionButton fontSize='sm' fontWeight='bold'>
        <Box as="span" flex='1' textAlign='left' fontSize='sm'>
          {name} Information
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <Text>{name} NFTs must adhere to specific trait specifications:</Text>
          {collectionStakingConfig!.traits.map((trait) => (
            <Box mt={2}>
              <Text>For the "{titleCase(trait.type)}" trait, NFTs must {trait.inclusion === RyoshiConfigTraitInclusionType.EXCLUDE && <>NOT</>} contain any of the following:</Text>
              <UnorderedList>
                {trait.values.map((value) => (
                  <ListItem key={`${trait.type}${value}`}>{titleCase(value.toUpperCase())}</ListItem>
                ))}
              </UnorderedList>
            </Box>
          ))}
        <Text mt={4}>Eligible NFTs will then be calculated:</Text>
        <UnorderedList>
          {collectionStakingConfig.multipliers.map((multiplier, i) => (
            <ListItem key={i}>{multiplier.percentile}th percentile: {commify(multiplier.value)}</ListItem>
          ))}
        </UnorderedList>
      </AccordionPanel>
    </AccordionItem>
  )
}