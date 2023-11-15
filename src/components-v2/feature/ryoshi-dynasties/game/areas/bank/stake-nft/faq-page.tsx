import React, {useContext, useState} from "react";
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
import {useAppSelector} from "@src/Store/hooks";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {commify} from "ethers/lib/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {RyoshiConfigBankStakingNFTCollection} from "@src/components-v2/feature/ryoshi-dynasties/game/types";

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
          Each stakeable NFT is eligible for bonus APR on top of any current APR earned from Fortune staking. Higher ranked NFTs can yield a larger APR.
        </Text>
        <Stack direction='row' align='center' bg='#f8a211' p={2} rounded='sm' mt={4}>
          <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} color='#333' boxSize={8}/>
          <Text
            fontSize='14'
            color='#333'
            fontWeight='bold'
          >
            Warning: Once staked, NFTs can only be unstaked if you have not yet received staking rewards for the current game. If staking rewards have been received for the current game, then the staked NFTs are locked until the next game.
          </Text>
        </Stack>
        <Accordion fontSize='sm' mt={4}>
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How is the bonus APR calculated?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>The APR bonus depends on the collection type and rank of the NFT. These values can either be multiplied or added. See the below FAQ items for more information specific to each collection.</Text>
            </AccordionPanel>
          </AccordionItem>
          <EligibilityCriteriaItem name='Ryoshi VIP' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-vip')!} />
          <EligibilityCriteriaItem name='Ryoshi Halloween' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-halloween')!} />
          <EligibilityCriteriaItem name='Ryoshi Christmas' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-christmas')!} />
          <EligibilityCriteriaItem name='Fortune Teller' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'fortuneteller')!} />
          <EligibilityCriteriaItem name='Ryoshi Tales (Goblin Gala)' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales' && c.minId === 1 && c.maxId === 500)!} />
          <EligibilityCriteriaItem name='Ryoshi Tales (Celestial Celebration)' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales' && c.minId === 501 && c.maxId === 700)!} />
        </Accordion>
      </Box>
    </Stack>
  );
}

export default FaqPage;

const EligibilityCriteriaItem = ({ name, collectionStakingConfig }: { name: string, collectionStakingConfig: RyoshiConfigBankStakingNFTCollection }) => {

  return (
    <AccordionItem>
      <AccordionButton fontSize='sm' fontWeight='bold'>
        <Box as="span" flex='1' textAlign='left' fontSize='sm'>
          {name} Information
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        {collectionStakingConfig.multipliers.length > 0 && (
          <>
            <Text>{name} NFTs use the following rank-based <strong>multipliers</strong>:</Text>
            <UnorderedList>
              {collectionStakingConfig.multipliers.map((multiplier, i) => (
                <ListItem key={i}>{multiplier.percentile}th percentile: x{commify(multiplier.value)}%</ListItem>
              ))}
            </UnorderedList>
          </>
        )}
        {collectionStakingConfig.adders.length > 0 && (
          <>
            <Text>{name} NFTs use the following rank-based <strong>adders</strong>:</Text>
            <UnorderedList>
              {collectionStakingConfig.adders.map((adder, i) => (
                <ListItem key={i}>{adder.percentile}th percentile: +{commify(adder.value)}%</ListItem>
              ))}
            </UnorderedList>
          </>
        )}
        {collectionStakingConfig.ids.length > 0 && (
          <>
            <Text>Bonus for {name} NFTs are <strong>additive</strong> and based on the NFT ID:</Text>
            <UnorderedList>
              {collectionStakingConfig.ids.map((id, i) => (
                <ListItem key={i}>ID {id.id}: +{commify(id.bonus)}%</ListItem>
              ))}
            </UnorderedList>
          </>
        )}
      </AccordionPanel>
    </AccordionItem>
  )
}