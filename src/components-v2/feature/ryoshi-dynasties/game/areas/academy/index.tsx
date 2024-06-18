import {
  Heading,
  Grid,
  GridItem,
  Flex,
  Image,
} from '@chakra-ui/react';
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";
import ImageService from "@src/core/services/image";

interface AcademySceneProps {
  onBack: () => void;
}

const Academy = ({onBack}:AcademySceneProps) => {
  return (
    <section className="gl-legacy container">
      <ReturnToVillageButton onBack={onBack} />
      <Heading className="title text-center">Academy - Wiki</Heading>

      <Grid templateColumns='repeat(2, 1fr)' gap={6}>

      <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src={ImageService.translate('img/battle-bay/alliancecenter_day.png').convert()}/>
        </Flex>
      </GridItem>
      <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src={ImageService.translate('img/battle-bay/townhall_day.png').convert()}/>
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

        <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src={ImageService.translate('img/battle-bay/academy_day.png').convert()}/>
        </Flex>
      </GridItem>
      <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src={ImageService.translate('img/battle-bay/academy_day.png').convert()}/>
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
            <p>Shows the amount of Battle Units (which factions have the most units), and Leaderboard Victory Points (which factions have won the most battles).</p>
          </Flex>
        </GridItem>

        <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src={ImageService.translate('img/battle-bay/bank_day.png').convert()}/>
        </Flex>
      </GridItem>
      <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src={ImageService.translate('img/battle-bay/fishmarket_day.png').convert()}/>
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
          <p>Allows for NFT Trading of Ryoshi items only</p>
        </Flex>
      </GridItem>

      <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src={ImageService.translate('img/battle-bay/tavern_day.png').convert()}/>
        </Flex>
      </GridItem>
      <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src={ImageService.translate('img/battle-bay/barracks_day.png').convert()}/>
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