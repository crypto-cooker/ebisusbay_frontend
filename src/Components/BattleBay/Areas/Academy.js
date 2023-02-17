import {
  Heading,
  Grid,
  GridItem,
  Button,
  Flex,
  Image,
  Box,

} from '@chakra-ui/react';

const Academy = ({onBack}) => {
  return (
    <section className="gl-legacy container">
      <Button onClick={onBack}>Back to Village Map</Button>
      <Heading className="title text-center">Academy - Wiki</Heading>

      <Grid templateColumns='repeat(2, 1fr)' gap={6}>

      <GridItem w='100%' h='150'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image
            borderRadius='full'
            align={'center'}
            objectFit='cover'
            boxSize='150px'
            src='img/battle-bay/bld0.png'
          />
        </Flex>
      </GridItem>
      <GridItem w='100%' h='150'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image
            borderRadius='full'
            align={'center'}
            objectFit='cover'
            boxSize='150px'
            src='img/battle-bay/bld1.png'
          />
        </Flex>
      </GridItem>
      <GridItem w='100%' h='150' margin={'auto'}>
        <Heading className="title text-center">Alliance Center</Heading>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <p>Allows for faction management</p>
        </Flex>
      </GridItem>
      
        <GridItem w='100%' h='150' margin={'auto'}>
          <Heading className="title text-center">Town Hall</Heading>
          <Flex alignContent={'center'} justifyContent={'center'}>
            <p>The Town Hall provides a Community Wallet, acts as a staking contract for rewarding "no listings" and requires players to own a clan and costs Koban, wood, and fortune.</p>
          </Flex>
        </GridItem>

        <GridItem w='100%' h='150' margin={'auto'}>
          <Heading className="title text-center">Announcement Board</Heading>
          <Flex alignContent={'center'} justifyContent={'center'}>
            <p>includes News (recent game changes/patches/etc.)</p>
          </Flex>
        </GridItem>

      
        <GridItem w='100%' h='150' margin={'auto'}>
          <Heading className="title text-center">Leaderboard</Heading>
          <Flex alignContent={'center'} justifyContent={'center'}>
            <p>hows the amount of Battle Units (which factions have the most units), and Leaderboard Victory Points (which factions have won the most battles).</p>
          </Flex>
        </GridItem>

        <GridItem w='100%' h='150' margin={'auto'}>
        <Heading className="title text-center">Bank</Heading>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <p>Provides Fortune Staking</p>
        </Flex>
      </GridItem>
      <GridItem w='100%' h='150' margin={'auto'}>
        <Heading className="title text-center">Fish Market</Heading>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <p>llows for NFT Trading of Ryoshi items only</p>
        </Flex>
      </GridItem>

      <GridItem w='100%' h='150' margin={'auto'}>
        <Heading className="title text-center">Tavern</Heading>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <p>includes Ryoshi Quests</p>
        </Flex>
      </GridItem>

      <GridItem w='100%' h='150' margin={'auto'}>
        <Heading className="title text-center">Barracks</Heading>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <p>allows players to stake Ryoshi NFTs for battle bonus.</p>
        </Flex>
      </GridItem>

      </Grid>
    </section>
  )
};


export default Academy;