import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Stack,
  Text,
} from "@chakra-ui/react"
import localFont from 'next/font/local';

const gothamBook = localFont({ src: '../../../../../../../global/assets/fonts/Gotham-Book.woff2' })

const FaqPage = () => {

  return (
    <Stack spacing={3}className={gothamBook.className} mt={10} fontSize={{ base: 'xs', md: 'sm' }}>
      <Text p={4}>
      Ryoshi Dynasties is a gamified DAO governance system built on top of Ebisu’s Bay. This system is designed to reward Ebisu’s Bay users for their participation in the platform and their daily check-ins, while nourishing and supporting the Cronos NFT & Game-Fi ecosystem.
      </Text>
      <Accordion fontSize='sm' defaultIndex={[0]}>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
              What is a Faction and how to register one
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>Factions are groups of either users or NFT collections. Anyone can visit the Alliance Center and register their wallet or collection address as a faction in Ryoshi Dynasties, 
              to compete for community votes, battle for control points on the map and accrue platform rewards.</Text>
            <Text mt={2}>Once created, troops can be delegated to the faction, and the faction owner can deploy those troops to various locations on the battle map, attack other factions, or defend against other attacking factions.</Text>
            <Text mt={2}>At the end of each week, rewards are granted by Ryoshi Dynasties to those factions with the most troops on each world map location.</Text>          
            <Text mt={2}>There are 2 types of factions:
                User Faction: One or more users (up to 15) registers their contract addresses as an in-game faction, enabling users within that faction to earn platform rewards!</Text>          
            <Text mt={2}>Collection Faction: NFT collections (up to 3) can register their collection address as an in game faction, and all holders of those NFT collections will be eligible for platform rewards.</Text>          
            <Text mt={2}>Players must have at least 20 Mitama in their wallet to register a faction, and it costs 1000 Fortune to register a faction. However the registration is valid for only a single season, after which the faction must be re-registered to continue playing. The registration fee is automatically waived for those players who previously participated in the Fortune presale.</Text>          
            <Text mt={2}>Faction owners can only delegate troops to their own faction; Participants who don’t own or manage a faction can delegate troops to any and all factions.
            </Text>          
                    
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
            How does the game work?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text> Faction owners and other players acquire troops by staking $Fortune coins, and the troops can be delegated to specific factions.  Faction owners then place the troops on locations on a world map, much like the game “Risk”.  For a $Koban fee, faction owners can initiate battles with other factions within the same geographic location.  At the end of each week, rewards are distributed to the faction with the most troops in each geographic location. Therefore, factions can conquer new territories, defend themselves or eventually attack other factions to gain territory, and to receive in-game rewards.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
            Who is eligible for rewards?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>Everyone can benefit from Ryoshi Dynasties! NFT collections and communities can take part in the game to earn extra rewards. Meanwhile Ebisu’s Bay users can receive platform rewards for their own platform activities & daily check-ins, as well as extra Fortune Token rewards. Extra Fortune Token rewards are issued to holders of NFTs if these NFTs are part of a Collection Faction in Ryoshi Dynasties.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
            Votes & rewards
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>Ebisu’s Bay users can vote for their favorite factions providing them with Troops! By casting your vote, you'll help determine the amount of platform rewards issued to all NFT holders of a voted faction. When users delegate troops to a faction, they are effectively voting for, and determining, the size of listing rewards for the specific collections and people represented by the collection and user factions, respectively.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
            Battles
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>Factions need to control countries on the map for weekly rewards. Some areas (aka “control points”) are more valuable due to their location!  At the end of each week, listing rewards will be distributed to factions with the most troops on each country. 
Factions can spend Koban tokens to attack each other. The fate of the battle will be decided by rolling a pair of statistically accurate, virtual dice! </Text>
          <Text mt={2}> For each roll, whichever participant has the higher numbered die wins that roll.  Any ties result in a re-roll of both dice until the tie is eliminated.
Attacking factions earn one of 60 Battle Card NFTs as a reward for each dice roll won.
Separately, a player can burn 3 matching Battle Card NFTs in exchange for additional troops in the game.</Text>  
          <Text mt={2}> <strong>Skirmish</strong> - Battle attack continues for a more or less fixed set of rolls. User can select up to three (3) troops for the skirmish, and pays 20 Koban per troop.  Attack continues up to a maximum of the troop number selected.  If an attacker selects 3 troops for a skirmish, and the defender has 3 troops, then the dice are rolled three times. If the attacker wins 2 of the 3 rolls, then they also receive two Battle Cards, which they will need to subsequently claim.</Text>
          <Text mt={2}> <strong>Conquest</strong> - Battle attack continues until either the attacker looses their troops (up to 3 maximum) or defender has no more troops at all within the country.  User pays a flat fee of 50 Koban for each troop allocated to the attack, with a maximum of three (3) troops. </Text>
          <Text mt={2}> </Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
            Daily Rewards
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text> Get rewarded for simply visiting Ryoshi Dynasties! Ryoshi Dynasties counts the number of days in a row (aka “a streak”) that a user visits the site.  Players even get Koban for a single check in</Text>
            <Text mt={2}>Players will complete daily check-ins to earn Koban which is required within Ryoshi Dynasties – players pay for their attacks with Koban.</Text>
            <Text mt={2}>The size of the check in rewards increases every day, and the check-in streaks are restarted each week. </Text>
            <Text mt={2}>In order to view the current check-in streak, and to claim check-in Koban rewards, players can select the “Claim Reward” button on the “In-game wallet” in the upper left of the Village map, or visit the “Claim Daily Reward” button on the Announcements page.</Text>
            <Text mt={2}>All Resources are 1155 tokens and will be freely tradable on the open NFT market.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
            Ecosystem Tokens
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>The Ryoshi Dynasties ecosystem is fueled by 3 Tokens:</Text>
            <Text mt={2}>$Fortune is a standard CRC-20 which can be freely traded on exchanges and will be used for rewards and purchasing services from Ebisu’s Bay. $Fortune tokens can be staked to earn more $Fortune, $Mitama and Troops. </Text>
            <Text mt={2}>$Koban is an ERC-1155 token and can be freely traded on Ebisu’s Bay Marketplace. Koban is earned by checking into Ryoshi Dynasties on a daily basis -- the more days in a row of check-ins, the more Koban is earned.  A faction owner must pay for their battle attacks with Koban. In addition, Koban can be exchanged for $Fortune if the ‘RyoshiFella’ Global Banker bonus is present.</Text>
            <Text mt={2}>$Mitama is a soulbound token which is gained by staking $Fortune. $Mitama represents users’ governance on Ebisu’s Bay as well as users’ ownership of battle units: the longer they stake their tokens, the more troops they receive for each unit of tokens staked.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton fontSize='sm' fontWeight='bold'>
            <Box as="span" flex='1' textAlign='left' fontSize='sm'>
            No time to play? Delegate!
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>The Ryoshi Dynasties ecosystem is designed to be accessible to any type of user! If you don’t have the time to check in daily, you can always stake your $Fortune tokens to earn more $Fortune over time, and delegate your Troops to the best offeror or to projects you like! 
You might also be eligible to earn weekly extra $Fortune tokens for your NFT listings on Ebisu’s Bay if these NFTs are doing well in Ryoshi Dynasties, with no extra actions required on your end!</Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
}

export default FaqPage;