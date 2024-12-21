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
import {titleCase} from "@market/helpers/utils";
import {commify} from "ethers/lib/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {
  RyoshiConfigBarracksStakingNFTCollection,
  RyoshiConfigTraitInclusionType
} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import { RdModalBox } from '@src/components-v2/feature/ryoshi-dynasties/components/rd-modal';

const gothamBook = localFont({ src: '../../../../../../../global/assets/fonts/Gotham-Book.woff2' })
const gothamXLight = localFont({ src: '../../../../../../../global/assets/fonts/Gotham-XLight.woff2' })

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
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                What is a Materialization Infusion Terminal?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text></Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How do I stake Mystic Sea Dragons?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Mystic Sea Dragons can be staked like any other NFT, but will only yield benefits if a Materialization Infusion Terminal (MIT) is also staked. Once a MIT is staked, dragon staking benefits will be based on specific NFT attributes.</Text>
            </AccordionPanel>
          </AccordionItem>
          <EligibilityCriteriaItem name='Ryoshi VIP' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-vip')!} />
          <EligibilityCriteriaItem name='Ryoshi Halloween' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-halloween')!} />
          <EligibilityCriteriaItem name='Ryoshi Christmas' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-christmas')!} />
          <EligibilityCriteriaItem name='Ryoshi Tales (Goblin Gala)' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales' && c.minId === 1 && c.maxId === 500)!} />
          <EligibilityCriteriaItem name='Ryoshi Tales (Celestial Celebration)' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales' && c.minId === 501 && c.maxId === 700)!} />
          <EligibilityCriteriaItem name='Pixel Ryoshi' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'pixel-ryoshi')!} />
          <EligibilityCriteriaItem name='Mystic Sea Dragons' collectionStakingConfig={rdConfig.barracks.staking.nft.collections.find((c) => c.slug === 'mystic-sea-dragons')!} />
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
        <RdModalBox>
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
        </RdModalBox>
        {collectionStakingConfig.bonus.length > 0 && (
          <Box mt={2}>
            {collectionStakingConfig!.bonus.sort((a, b) => a.value - b.value).map((bonus) => (
              <RdModalBox mt={2}>
                <Text>NFTs adhering to the following specific trait specifications will gain an additional <strong>{bonus.value}</strong> troops:</Text>
                <Box mt={2}>
                  {bonus.traits.map((trait) => (
                    <>
                      <UnorderedList>
                        {trait.values.map((value) => (
                          <ListItem key={`${trait.type}${value}`}>{titleCase(trait.type)} - {titleCase(value.toUpperCase())}</ListItem>
                        ))}
                      </UnorderedList>
                    </>
                  ))}
                </Box>
              </RdModalBox>
            ))}
          </Box>
        )}
      </AccordionPanel>
    </AccordionItem>
  )
}