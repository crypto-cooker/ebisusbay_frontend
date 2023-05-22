import {Box, Flex, HStack, Image, Spacer, Spinner, Text, VStack} from "@chakra-ui/react";
import RdButton from "../../../components/rd-button";
import AnnouncementBoardModal from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal";
import DailyCheckinModal from "@src/components-v2/feature/ryoshi-dynasties/game/modals/daily-checkin";
import React, {useEffect, useState} from "react";
import NextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import {ethers} from "ethers";
import {useAppSelector} from "@src/Store/hooks";

interface VillageHudProps {
  onOpenBuildings: () => void;
  onOpenDailyCheckin: () => void;
}

export const VillageHud = ({onOpenBuildings, onOpenDailyCheckin}: VillageHudProps) => {
  const user = useAppSelector((state) => state.user);

  const[resourcesAcquired, setResourcesAcquired] = useState(false);
  const[koban, setKoban] = useState<number | string>(0);
  const[fortune, setFortune] = useState<number | string>(0);
  const[mitama, setMitama] = useState<number | string>(0);

  const GetResources = async () => {
    try {
      setResourcesAcquired(false);
      let nfts = await NextApiService.getWallet(user!.address!, {
        collection: ['0xda72ee0b52a5a6d5c989f0e817c9e2af72e572b5'],
      });
      const fortuneAndMitama = await ApiService.withoutKey().ryoshiDynasties.getErc20Account(user!.address!)

      if (nfts.data.length > 0) {
        setKoban(nFormatter(nfts.data[0].balance, 1));
      }
      if (!!fortuneAndMitama) {
        setFortune(nFormatter(Number(ethers.utils.formatEther(fortuneAndMitama.fortuneBalance)), 1));
        setMitama(nFormatter(Number(fortuneAndMitama.mitamaBalance), 1));
      }

      setResourcesAcquired(true);
    } catch (error) {
      console.log(error);
    }
  };

  function nFormatter(num: any, digits: number) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  useEffect(() => {
    // get all resources
    if (!!user.address) {
      GetResources();
    }
  }, [user.address])

  return (
    <Box position='absolute' top={0} left={0} p={4}  pointerEvents='none' >
      <Flex direction='row' justify='space-between' >
        <Box mb={4} bg='#272523' p={2} rounded='md'>
          <Flex alignItems='left'>
            <VStack alignItems='left'>
              <HStack>
                <Image src='/img/battle-bay/bankinterior/fortune_token.svg' alt="walletIcon" boxSize={6}/>
                <Text >Fortune : {!resourcesAcquired ? <Spinner size='sm'/> :fortune}</Text>
              </HStack>
              <HStack>
                <Image src='/img/battle-bay/announcementBoard/mitama.png' alt="walletIcon" boxSize={6}/>
                <Text align='left'>Mitama : {!resourcesAcquired ? <Spinner size='sm'/> :mitama}</Text>
              </HStack>
              <HStack>
                <Image src='/img/battle-bay/announcementBoard/koban.png' alt="walletIcon" boxSize={6}/>
                <Text align='left'>Koban : {!resourcesAcquired ? <Spinner size='sm'/> : koban}</Text>
              </HStack>
            </VStack>
          </Flex>

          <Spacer h='4'/>
          <RdButton
            w='150px'
            pointerEvents='auto'
            fontSize={{base: 'm', sm: 'm'}}
            hideIcon={true}
            onClick={onOpenBuildings}
          >
            View Building
          </RdButton>
          <Spacer h='4'/>
          <RdButton
            w='150px'
            pointerEvents='auto'
            fontSize={{base: 'm', sm: 'm'}}
            hideIcon={true}
            onClick={onOpenDailyCheckin}
          >
            Claim Daily Reward
          </RdButton>
        </Box>
      </Flex>
    </Box>
  )
}