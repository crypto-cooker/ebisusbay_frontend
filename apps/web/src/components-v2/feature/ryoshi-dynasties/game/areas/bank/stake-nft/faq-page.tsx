import React, {useContext} from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box, HStack,
  Icon,
  ListItem,
  Stack,
  Text,
  UnorderedList, VStack,
} from "@chakra-ui/react"
import localFont from 'next/font/local';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {commify} from "ethers/lib/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {
  RyoshiConfigBankStakingNFTCollection,
  RyoshiConfigTraitInclusionType
} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import {titleCase} from "@market/helpers/utils";
import {useChainId} from "wagmi";
import {useChainById} from "@src/config/hooks";
import {ChainLogo} from "@dex/components/logo";

const gothamBook = localFont({ src: '../../../../../../../global/assets/fonts/Gotham-Book.woff2' })

const FaqPage = () => {
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
          <AccordionItem>
            <AccordionButton fontSize='sm' fontWeight='bold'>
              <Box as="span" flex='1' textAlign='left' fontSize='sm'>
                How are bonus troops calculated?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Some collections such as Ryoshi VIP earn additional troops on top of the base APR bonus. The amount depends on the rank of the NFT. Additional bonus troops may be given on top of this value but may have eligibility requirements. See collections below for more information.</Text>
            </AccordionPanel>
          </AccordionItem>
          <EligibilityCriteriaItem name='Ryoshi VIP' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-vip')!} />
          <EligibilityCriteriaItem name='Ryoshi Halloween' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-halloween')!} />
          <EligibilityCriteriaItem name='Ryoshi Christmas' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-christmas')!} />
          <EligibilityCriteriaItem name='Fortune Teller' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'fortuneteller')!} />
          <EligibilityCriteriaItem name='Ryoshi Tales (Goblin Gala)' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales' && c.minId === 1 && c.maxId === 500)!} />
          <EligibilityCriteriaItem name='Ryoshi Tales (Celestial Celebration)' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales' && c.minId === 501 && c.maxId === 700)!} />
          <EligibilityCriteriaItem name='Pixel Ryoshi' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'pixel-ryoshi')!} />
          <EligibilityCriteriaItem name='Moggy Money Brokers' collectionStakingConfig={rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'moggy-money-brokers')!} />
        </Accordion>
      </Box>
    </Stack>
  );
}

export default FaqPage;

const EligibilityCriteriaItem = ({ name, collectionStakingConfig }: { name: string, collectionStakingConfig: RyoshiConfigBankStakingNFTCollection }) => {
  const chain = useChainById(collectionStakingConfig.chainId);

  return (
    <AccordionItem>
      <AccordionButton fontSize='sm' fontWeight='bold'>
        <Box as="span" flex='1' textAlign='left' fontSize='sm'>
          Information: {name}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <VStack align='stretch'>
          <HStack>
            <ChainLogo chainId={chain.id} />
            <Box>This collection is on <strong>{chain.name}</strong></Box>
          </HStack>
          {collectionStakingConfig.apr.multipliers.length > 0 && (
            <>
              <Text>{name} NFTs use the following rank-based <strong>multipliers</strong>:</Text>
              <UnorderedList>
                {collectionStakingConfig.apr.multipliers.map((multiplier, i) => (
                  <ListItem key={i}>{multiplier.percentile}th percentile: x{commify(multiplier.value)}%</ListItem>
                ))}
              </UnorderedList>
            </>
          )}
          {collectionStakingConfig.apr.adders.length > 0 && (
            <>
              <Text>{name} NFTs use the following rank-based <strong>adders</strong>:</Text>
              <UnorderedList>
                {collectionStakingConfig.apr.adders.map((adder, i) => (
                  <ListItem key={i}>{adder.percentile}th percentile: +{commify(adder.value)}%</ListItem>
                ))}
              </UnorderedList>
            </>
          )}
          {collectionStakingConfig.apr.ids.length > 0 && (
            <>
              <Text>Bonus for {name} NFTs are <strong>additive</strong> and based on the NFT ID:</Text>
              <UnorderedList>
                {collectionStakingConfig.apr.ids.map((id, i) => (
                  <ListItem key={i}>ID {id.id}: +{commify(id.bonus)}%</ListItem>
                ))}
              </UnorderedList>
            </>
          )}
          {!!collectionStakingConfig.troops && collectionStakingConfig.troops.values.length > 0 && (
            <Box mt={2}>
              <Text>Troops for {name} NFTs use the following rank-based <strong>values</strong>:</Text>
              <UnorderedList>
                {collectionStakingConfig.troops.values.map((multiplier, i) => (
                  <ListItem key={i}>{multiplier.percentile}th percentile: x{commify(multiplier.value)}</ListItem>
                ))}
              </UnorderedList>

              {collectionStakingConfig.troops.bonus.traits.length > 0 && (
                <Box mt={2}>
                  <Text>NFTs adhering to the following specific trait specifications will gain an additional <strong>{collectionStakingConfig.troops.bonus.value}</strong> troops:</Text>
                  {collectionStakingConfig!.troops.bonus.traits.map((trait) => (
                    <Box mt={2}>
                      <Text>For the "{titleCase(trait.type)}" trait, NFTs must {trait.inclusion === RyoshiConfigTraitInclusionType.EXCLUDE && <>NOT</>} contain any of the following:</Text>
                      <UnorderedList>
                        {trait.values.map((value) => (
                          <ListItem key={`${trait.type}${value}`}>{titleCase(value.toUpperCase())}</ListItem>
                        ))}
                      </UnorderedList>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  )
}