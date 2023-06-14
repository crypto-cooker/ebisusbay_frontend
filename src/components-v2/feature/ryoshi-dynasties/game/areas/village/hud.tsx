import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Image,
  Progress,
  SimpleGrid,
  Spacer,
  Stack,
  Text
} from "@chakra-ui/react";
import RdButton from "../../../components/rd-button";
import React, {useEffect, useState} from "react";
import NextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import {ethers} from "ethers";
import {useAppSelector} from "@src/Store/hooks";
import {siPrefixedNumber} from "@src/utils";
import ImageService from "@src/core/services/image";

interface VillageHudProps {
  onOpenBuildings: () => void;
  onOpenDailyCheckin: () => void;
  forceRefresh: boolean;
}

export const VillageHud = ({onOpenBuildings, onOpenDailyCheckin, forceRefresh}: VillageHudProps) => {
  const user = useAppSelector((state) => state.user);

  const[isLoading, setIsLoading] = useState(false);
  const[koban, setKoban] = useState<number | string>(0);
  const[fortune, setFortune] = useState<number | string>(0);
  const[mitama, setMitama] = useState<number | string>(0);

  const getResources = async () => {
    try {
      setIsLoading(true);
      let nfts = await NextApiService.getWallet(user!.address!, {
        collection: ['0xda72ee0b52a5a6d5c989f0e817c9e2af72e572b5'],
      });
      const fortuneAndMitama = await ApiService.withoutKey().ryoshiDynasties.getErc20Account(user!.address!)

      if (nfts.data.length > 0) {
        setKoban(siPrefixedNumber(nfts.data[0].balance));
      }
      if (!!fortuneAndMitama) {
        setFortune(siPrefixedNumber(ethers.utils.formatEther(fortuneAndMitama.fortuneBalance)));
        setMitama(siPrefixedNumber(fortuneAndMitama.mitamaBalance));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // get all resources
    if (!!user.address) {
      getResources();
    }
  }, [user.address, forceRefresh])

  return (
    <Box position='absolute' top={0} left={0} p={4}  pointerEvents='none' >
      <Flex direction='row' justify='space-between' >
        <Box mb={4} 
        bg={user.theme === 'dark' ? '#272523EE' : '#272523EE'}
        p={2} rounded='md' w={{base: '345px', sm: '400px'}}>
          <Accordion defaultIndex={[0]} allowToggle>
            <AccordionItem border='none'>
              <AccordionButton pointerEvents='auto'>
                {!isLoading ? (
                  <>
                    {!!user.address ? (
                      <HStack w='full' spacing={4}>
                        <HStack>
                          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/fortune.svg').convert()} alt="walletIcon" boxSize={6}/>
                          <Text
                            textColor={user.theme === 'dark' ? '#ffffff' : '#ffffff'}
                            >{fortune}</Text>
                        </HStack>
                        <HStack>
                          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/mitama.png').convert()} alt="walletIcon" boxSize={6}/>
                          <Text
                            textColor={user.theme === 'dark' ? '#ffffff' : '#ffffff'}
                            >{mitama}</Text>
                        </HStack>
                        <HStack>
                          <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="walletIcon" boxSize={6}/>
                          <Text
                            textColor={user.theme === 'dark' ? '#ffffff' : '#ffffff'}
                            >{koban}</Text>
                        </HStack>
                      </HStack>
                    ) : (
                      <Text align='center'>Connect wallet for stats</Text>
                    )}
                    <Spacer />
                    <AccordionIcon 
                      color='#ffffff'/>
                  </>
                ) : (
                  <Progress size='xs' colorScheme='orange' isIndeterminate w='full'/>
                )}
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack direction='row'>
                  <RdButton
                    pointerEvents='auto'
                    fontSize='m'
                    hoverIcon={false}
                    onClick={onOpenBuildings}
                  >
                    View Building
                  </RdButton>
                  <Spacer h='4'/>
                  <RdButton
                    pointerEvents='auto'
                    size='sm'
                    hoverIcon={false}
                    onClick={onOpenDailyCheckin}
                  >
                    Daily Claim
                  </RdButton>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Flex>
    </Box>
  )
}