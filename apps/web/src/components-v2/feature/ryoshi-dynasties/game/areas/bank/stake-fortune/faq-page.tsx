import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box, ListItem,
  Stack,
  Text, UnorderedList
} from '@chakra-ui/react';
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../../../../global/assets/fonts/Gotham-Book.woff2' })

const FaqPage = () => {

  return (
    <Stack spacing={3}className={gothamBook.className} fontSize={{ base: 'xs', md: 'sm' }}>
      <Text p={4}>
        Stake $Fortune to receive Troops and earn $Fortune rewards. Troops are essential to play Ryoshi Dynasties, by battling other Factions and taking victory over control points to earn additional rewards. The more you stake, the more Troops you will receive and a higher APR% will be earned. Stake in multiple vaults to match your gameplay strategies.
      </Text>
      <Accordion fontSize='sm' defaultIndex={[0]}>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
              How do I stake?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>To stake $Fortune, simply create a vault by clicking the <strong>"+ New Vault"</strong> button. From there, choose how much to stake and for how long.</Text>
            <Text mt={2}>Note that once staked, the Fortune amount cannot be returned until either the staking duration has ended, or the emergency withdraw is used.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
              How is APR and Troop count calculated?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>APR is based on the length of time in the staking vault. The longer the staking term, the higher the APR</Text>
            <Text mt={2}>Troops are based on how much staked and for how long. Minimum requirement is 120 Fortune staked for 1 season to earn 1 Troop</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
              Can a vault be modified?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>Yes, a vault can have either its Fortune amount or staking duration changed. To update the amount to stake, click the <strong>"+ Add Fortune"</strong> button. To update the staking duration, click the <strong>"+ Increase duration"</strong> button. From here, you can modify the values and also see a preview of the vault's new APR, Troop count and end date.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
              Can the APR be increased?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>Other than increasing the staking duration, APR can be increased by staking <strong>Ryoshi NFTs</strong>. Stake these NFTs by clicking the <strong>"Stake NFTs"</strong> button in the main Bank area. Higher ranked NFTs will add a higher APR.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
              How do I withdraw staked Fortune?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>Staked Fortune is locked until the end of the staking duration. However, it is possible to withdraw early with the Emergency Withdraw function. This will withdraw all the Fortune in the vault, but will burn 50% of the Fortune value. Take caution of this if using this feature.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
              What is the "Tokenize Vault" button?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>The Tokenize Vault button converts your current active vault into an NFT. This means that it can then be freely transferred or sold on the marketplace.</Text>
            <Text mt={2}>Note that all Bank benefits applied to the vault will be paused until the vault is imported back into the Bank. This includes APR, Mitama, and Troops.</Text>
            <Text mt={2}>5% of the vault's balance will be burned upon completion of the tokenization.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
              How do I import a vault from my Inventory?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>To import a  vault from your Inventory, click the <strong>"+ New Vault"</strong> button. This will present an option to either create a new vault or import a vault. Click the <strong>"Import Vault"</strong> button and follow the instructions to complete the process.</Text>
            <Text mt={2}>Once imported, the vault will be immediately activated and start earning Bank benefits such as APR, Mitama, and Troops.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
              What is Vault Boosting?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>Vault Boosting allows users to earn Koban on their vaults by depositing Ryoshi troops. The amount of Koban earned depends on the type of vault (Token or LP) and the amount of Mitama derived from it.</Text>
            <Text mt={2}>The vaults rewards based on below:</Text>
            <UnorderedList>
              <ListItem><strong>Token Vaults:</strong> 0.002 Koban per 1000 Mitama per hour</ListItem>
              <ListItem><strong>LP Vaults:</strong> 0.005 Koban per 1000 Mitama per hour</ListItem>
            </UnorderedList>
            <Text mt={2}>Please be aware of the following limitations:</Text>
            <UnorderedList>
              <ListItem>While a boost is in progress, the vault cannot be tokenized</ListItem>
              <ListItem>Adding more FRTN to a boosted vault will not increase the boost payout until the current boost is claimed and a new one has started</ListItem>
              <ListItem>After an emergency withdraw, a boost cannot be claimed</ListItem>
            </UnorderedList>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
}

export default FaqPage;