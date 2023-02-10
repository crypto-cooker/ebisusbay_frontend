import {
  Heading,
} from '@chakra-ui/react';

const Academy = ({onBack}) => {
  return (
    <section className="gl-legacy container">
      <button class="btn" onClick={onBack}>Back to Village Map</button>
      <Heading className="title text-center">Academy - Wiki</Heading>
      <p className="text-center">- The Alliance Center allows for faction management.
        - The Town Hall provides a Community Wallet, acts as a staking contract for rewarding "no listings" and requires players to own a clan and costs Koban, wood, and fortune.
        - The Announcement Board includes News (recent game changes/patches/etc.)
        - Leaderboard shows the amount of Battle Units (which factions have the most units), and Leaderboard Victory Points (which factions have won the most battles).
        - The Academy offers a Wiki.
        - The Bank provides Fortune Staking.
        - The Fish Market allows for NFT Trading of Ryoshi items only.
        - The Tavern includes Ryoshi Quests.
        - The Barracks allows players to stake Ryoshi NFTs for battle bonus.</p>
    </section>
  )
};


export default Academy;