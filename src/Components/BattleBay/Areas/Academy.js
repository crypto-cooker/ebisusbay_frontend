import {
  Heading,
  Grid,
  GridItem,
  Button,
  Flex,
  Image,
  Box,
  VStack,
} from '@chakra-ui/react';
import { getProfileTroops, getWeeklyGameId, getReward, getProfileId, getFactionsOwned, subscribeFaction, getSeasonGameId } from "@src/core/api/RyoshiDynastiesAPICalls";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import { useState, useEffect } from "react";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'



const Academy = ({onBack}) => {

  const user = useSelector((state) => state.user);
  const [isLoading, getSigner] = useCreateSigner();
  const {address, theme, profile} = useSelector((state) => state.user);

  const GetGameId = async () => {
    const res = await getWeeklyGameId();
    console.log(res)
  }
  const GetReward = async () => {
    const res = await getReward(1);
    console.log(res)
  }
  const GetProfileTroops = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        try {
          const res = await getProfileTroops(user.address.toLowerCase(), signatureInStorage);
          console.log("Total Troops: "+res.data.data[0].troops)
        } catch (error) {
          console.log(error)
        }
      }
  }
  const GetFactions = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        try {
    
          // const res = await getProfileId(user.address.toLowerCase(), signatureInStorage);
          // console.log("Profile Id: "+res.data.data[0].profileId)
          const data = await getFactionsOwned(user.address.toLowerCase(), signatureInStorage);
          console.log(data.data.data[0])

        } catch (error) {
          console.log(error)
        }
      }
  }
  const SubscribeFaction = async (factionId) => {
    factionId = 4;
    let signatureInStorage = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      if (signatureInStorage) {
        try {
          const gameID = await getSeasonGameId();
          const res = await subscribeFaction(
            user.address.toLowerCase(), 
            signatureInStorage,
            gameID,
            factionId);

          console.log(res)

        } catch (error) {
          console.log(error)
        }
      }
  }

  return (
    <section className="gl-legacy container">
      <Button onClick={onBack}>Back to Village Map</Button>
      <Heading className="title text-center">Academy - Wiki</Heading>

      <Grid templateColumns='repeat(2, 1fr)' gap={6}>

      <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src='img/battle-bay/alliancecenter_day.png'/>
        </Flex>
      </GridItem>
      <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src='img/battle-bay/townhall_day.png'/>
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
          <Image src='img/battle-bay/academy_day.png'/>
        </Flex>
      </GridItem>
      <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src='img/battle-bay/academy_day.png'/>
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
          <Image src='img/battle-bay/bank_day.png'/>
        </Flex>
      </GridItem>
      <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src='img/battle-bay/fishmarket_day.png'/>
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
          <Image src='img/battle-bay/tavern_day.png'/>
        </Flex>
      </GridItem>
      <GridItem w='100%' h='100%'>
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Image src='img/battle-bay/barracks_day.png'/>
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
    {/* <VStack spacing={4} align="stretch">
    <Button onClick={GetGameId}>Get Game ID: </Button>
    <Button onClick={GetProfileTroops}>Get ProfileTroops: </Button>
    <Button onClick={GetReward}>Get Reward: 1</Button>
    <Button onClick={GetFactions}>Get Factions owned</Button>
    <Button onClick={SubscribeFaction}>Subscribe Faction: </Button>
    </VStack> */}

    </section>
  )
};


export default Academy;