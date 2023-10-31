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
                Ryoshi VIP Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text>Ryoshi VIP NFTs use the following rank-based <strong>multipliers</strong>:</Text>
              <UnorderedList>
                {rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-vip')!.multipliers.map((multiplier, i) => (
                  <ListItem key={i}>{multiplier.percentile}th percentile: x{commify(multiplier.value)}%</ListItem>
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
              <Text>Ryoshi Halloween NFTs use the following rank-based <strong>adders</strong>:</Text>
              <UnorderedList>
                {rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-halloween')!.adders.map((multiplier, i) => (
                  <ListItem key={i}>{multiplier.percentile}th percentile: +{commify(multiplier.value)}%</ListItem>
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
              <Text>Ryoshi Christmas NFTs use the following rank-based <strong>adders</strong>:</Text>
              <UnorderedList>
                {rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales-christmas')!.adders.map((multiplier, i) => (
                  <ListItem key={i}>{multiplier.percentile}th percentile: +{commify(multiplier.value)}%</ListItem>
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
              <Text>Bonus for Fortune Guards NFTs are <strong>additive</strong> and based on the NFT ID:</Text>
              <UnorderedList>
                {rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'fortune-guards')!.ids.map((id, i) => (
                  <ListItem key={i}>ID {id.id}: +{commify(id.bonus)}%</ListItem>
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
              <Text>Ryoshi Tales (Goblin Gala) NFTs use the following rank-based <strong>adders</strong>:</Text>
              <UnorderedList>
                {rdConfig.bank.staking.nft.collections.find((c) => c.slug === 'ryoshi-tales')!.adders.map((multiplier, i) => (
                  <ListItem key={i}>{multiplier.percentile}th percentile: +{commify(multiplier.value)}%</ListItem>
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