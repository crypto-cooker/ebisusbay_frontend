import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
  useMediaQuery
} from "@chakra-ui/react";
import React, {useContext, useEffect, useState} from "react";
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import Countdown, {CountdownRenderProps, zeroPad} from "react-countdown";

//for showing koban
import {round, shortAddress, siPrefixedNumber} from "@src/utils";
import NextApiService from "@src/core/services/api-service/next";
import {appConfig} from "@src/Config";
import {Contract, ethers} from "ethers";
import {ERC1155} from "@src/Contracts/Abis";
import {useUser} from "@src/components-v2/useUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHourglassEnd, faRankingStar, faShield, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import ImageService from "@src/core/services/image";
import {commify} from "ethers/lib/utils";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";
import {RdGameState} from "@src/core/services/api-service/types";

const config = appConfig();

interface BattleMapHUDProps {
  onBack: () => void;
}

export const BattleMapHUD = ({onBack}: BattleMapHUDProps) => {
  const user = useUser();
  const {game: rdGameContext, user:rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [koban, setKoban] = useState<number | string>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const {isOpen: isBattleMenuOpen, onOpen: onOpenBattleMenu, onClose: onCloseBattleMenu} = useDisclosure();
  const {isOpen: isLeaderboardMenuOpen, onOpen: onOpenLeaderboardMenu, onClose: onCloseLeaderboardeMenu} = useDisclosure();

  const [troopTimer, setTroopTimer] = useState('');
  const [gameStopTime, setGameStopTime] = useState('');
  const [nextInterval, setNextInterval] = useState<Date>();


  const [isMobile] = useMediaQuery("(max-width: 750px)");
  const [accordionIndex, setAccordionIndex] = useState<number>(0);

  const[availableUserTroops, setAvailableUserTroops] = useState(0);
  const[availableFactionTroops, setAvailableFactionTroops] = useState(0);
  const[totalUserTroops, setTotalUserTroops] = useState(0);
  const[totalFactionTroops, setTotalFactionTroops] = useState(0);

  const getKobanBalance = async () => {
    try {
      setIsLoading(true);
      let nfts = await NextApiService.getWallet(user!.address!, {
        collection: config.contracts.resources,
      });
      let kobanBalance = 0;
      if (nfts.data.length > 0) {
        kobanBalance = Number(nfts.data.find(nft => nft.nftId === '1')?.balance ?? 0);
      } else {
        const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
        const contract = new Contract(config.contracts.resources, ERC1155, readProvider);
        kobanBalance = await contract.balanceOf(user!.address!, 1);
        kobanBalance = Number(kobanBalance);
      }
      setKoban(siPrefixedNumber(round(kobanBalance)));

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkTroopCooldown = () => {
    if(!rdUser) return;

    const redeploymentDelay = rdUser?.armies.redeploymentDelay;
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + redeploymentDelay);
    setTroopTimer(deadline.toISOString());
    setShowTimer(redeploymentDelay > 0)
  }

  useEffect(() => {
    if(!rdUser) return;

    setAvailableUserTroops(rdUser.game.troops.user.available.total);
    setTotalUserTroops(rdUser.game.troops.user.overall.total);
    setAvailableFactionTroops(rdUser.game.troops.faction?.available.total ?? 0);
    setTotalFactionTroops(rdUser.game.troops.faction?.overall.total ?? 0);
    checkTroopCooldown();
  }, [rdUser]); 

  useEffect(() => {
    if(!user) return;

    getKobanBalance();
  }, [user.wallet.isConnected])

  useEffect(() => {
    setAccordionIndex(isMobile ? -1 : 0);
  }, [isMobile]); 

  useEffect(() => {
    if(!rdGameContext) return;
    setGameStopTime(rdGameContext.game.stopAt);
    setNextInterval(rdGameContext.state === RdGameState.IN_PROGRESS ? rdGameContext.nextInterval : undefined);
  }, [rdGameContext]);

  return (
    <Box position='absolute' top={0} left={0}  w='100%' pointerEvents='none' >
      <Flex direction='row' justify='space-between'>
        <ReturnToVillageButton onBack={onBack} />
        <Spacer />

        {/*<Box mb={4} mt={6} mr={2}*/}
        {/*  justifyContent='right'*/}
        {/*  bg={user.theme === 'dark' ? '#272523EE' : '#272523EE'}*/}
        {/*  rounded='md'*/}
        {/*  w={{base: '200px', sm: '200px'}}*/}
        {/*>*/}
        {/*  <Accordion*/}
        {/*    // defaultIndex={[isMobile ? -1 : 0]}*/}
        {/*    index={accordionIndex}*/}
        {/*    allowToggle*/}
        {/*    paddingRight={0}*/}
        {/*    justifyContent='right'*/}
        {/*  >*/}
        {/*    <AccordionItem border='none'>*/}
        {/*      <AccordionButton*/}
        {/*        pointerEvents='auto'*/}
        {/*        onClick={() => setAccordionIndex(accordionIndex === 0 ? -1 : 0)}*/}
        {/*      >*/}
        {/*        {!isLoading ? (*/}
        {/*          <>*/}
        {/*            {!!user.address ? (*/}
        {/*              <>*/}
        {/*                <Flex justify="right" align="right">*/}
        {/*                  <HStack justifyContent='right' marginTop='0'>*/}
        {/*                    <Text fontSize='xs' color="#aaa" zIndex='9'>Game End:</Text>*/}
        {/*                    <Text fontWeight='bold' zIndex='9' color='white'>*/}
        {/*                      <Countdown*/}
        {/*                        date={gameStopTime ?? 0}*/}
        {/*                        renderer={({days, hours, minutes, seconds, completed }) => {*/}
        {/*                          return (days > 0 ?*/}
        {/*                            <span>{days} days</span>*/}
        {/*                            :*/}
        {/*                            <span>{hours}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>)*/}
        {/*                          }*/}
        {/*                        }*/}
        {/*                      />*/}
        {/*                    </Text>*/}
        {/*                    <AccordionIcon color='#ffffff'/>*/}
        {/*                  </HStack>*/}
        {/*                </Flex>*/}
        {/*              </>*/}
        {/*            ) : (*/}
        {/*              <Text align='center'>Connect wallet for stats</Text>*/}
        {/*            )}*/}
        {/*          </>*/}
        {/*        ) : (*/}
        {/*          <Progress size='xs' colorScheme='orange' isIndeterminate w='full'/>*/}
        {/*        )}*/}
        {/*      </AccordionButton>*/}

        {/*      <AccordionPanel pb={4} alignItems={'right'} pointerEvents='auto'>*/}
        {/*        <AuthenticationRdButton*/}
        {/*          connectText=''*/}
        {/*          signinText=''*/}
        {/*          size={'sm'}*/}
        {/*        >*/}
        {/*          <Center>*/}
        {/*            <Tag  variant='outline'>*/}
        {/*              <Image*/}
        {/*                src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()}*/}
        {/*                alt="troopsIcon"*/}
        {/*                boxSize={4}*/}
        {/*              />*/}
        {/*              <Box ms={1}>*/}
        {/*                {!isLoading ? (*/}
        {/*                  <>{koban}</>*/}
        {/*                ) : (*/}
        {/*                  <Progress size='xs' colorScheme='orange' isIndeterminate w='full'/>*/}
        {/*                )}*/}
        {/*              </Box>*/}
        {/*            </Tag>*/}
        {/*          </Center>*/}
        {/*          <Box mt={4} fontSize='sm'>*/}
        {/*            <HStack justify='space-between'>*/}
        {/*              <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()} alt="troopsIcon" boxSize={4}/>*/}
        {/*              <Text fontWeight='bold' color='white'>Ryoshi On Duty</Text>*/}
        {/*            </HStack>*/}
        {/*            <HStack justify='space-between'>*/}
        {/*              <Box color="#aaa">User:</Box>*/}
        {/*              <Box fontWeight='bold' color='white'>{availableUserTroops} / {totalUserTroops}</Box>*/}
        {/*            </HStack>*/}
        {/*            <HStack justify='space-between'>*/}
        {/*              <Box color="#aaa">Faction:</Box>*/}
        {/*              <Box fontWeight='bold' color='white'>{availableFactionTroops} / {totalFactionTroops}</Box>*/}
        {/*            </HStack>*/}
        {/*          </Box>*/}
        {/*        </AuthenticationRdButton>*/}
        {/*      </AccordionPanel>*/}
        {/*    </AccordionItem>*/}
        {/*  </Accordion>*/}
        {/*  {!isLoading && (*/}
        {/*    <>*/}
        {/*      {showTimer &&  (*/}
        {/*        <Box*/}
        {/*          mt={-3} bg='#cc2828'*/}
        {/*          p={2} roundedBottom='md'*/}
        {/*          w={{base: '200px', sm: '200px'}}*/}
        {/*          h={{base: '35px', sm: '35px'}}*/}
        {/*        >*/}
        {/*          <HStack justifyContent='space-between'>*/}
        {/*            <Text fontSize='xs' >Troop Cooldown:</Text>*/}
        {/*            <Text verticalAlign='bottom' fontWeight='bold'>*/}
        {/*              <Countdown*/}
        {/*                date={troopTimer ?? 0}*/}
        {/*                onComplete={()=> setShowTimer(false)}*/}
        {/*                renderer={({hours, minutes, seconds }) => {*/}
        {/*                  return (<span>{hours}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>)*/}
        {/*                  }*/}
        {/*                }*/}
        {/*              />*/}
        {/*            </Text>*/}
        {/*          </HStack>*/}
        {/*        </Box>*/}
        {/*      )}*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*</Box>*/}
        <Box mb={4} mt={6} mr={2}>
          <SimpleGrid columns={1} gap={2}>
            <Accordion
              allowToggle
              pointerEvents='auto'
              w={{base: '220px', sm: '220px'}}
              color='#272523EE !important'
              rounded='md'
              bg='linear-gradient(to left, #272523EE, #151418 )'
              border='4px solid #4c4859'
              p={2}
            >
              <AccordionItem border='none'>
                <AccordionButton p={0} fontSize='sm'>
                  <Flex color='white' my='auto' w='full'>
                    <HStack>
                      <Icon as={FontAwesomeIcon} icon={faHourglassEnd} color='white' alignSelf='center' />
                      <Text fontSize='xs' color="#aaa" zIndex='9'>Game End:</Text>
                    </HStack>
                    <Box fontWeight='bold' color='white' flex='1' textAlign='end'>
                      {gameStopTime && (
                        <Countdown
                          date={gameStopTime ?? 0}
                          renderer={({days, hours, minutes, seconds, completed }) => {
                            return (days > 0 ? <span>{days} days</span> :
                                <span>{hours}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>
                            )
                          }}
                        />
                      )}
                    </Box>
                    <AccordionIcon color='#ffffff' ms={1} />
                  </Flex>
                </AccordionButton>
                <AccordionPanel p={0} pt={1} fontSize='sm'>
                  <Flex color='white' my='auto' w='full'>
                    <HStack>
                      <Icon as={FontAwesomeIcon} icon={faStopwatch} color='white' alignSelf='center' />
                      <Text fontSize='xs' color="#aaa" zIndex='9'>Interval:</Text>
                    </HStack>
                    <Box color='white' flex='1' textAlign='end' pe='21px'>
                      {nextInterval && (
                        <Countdown
                          key={nextInterval.toString()}
                          date={nextInterval ?? 0}
                          renderer={({minutes, seconds, completed }) => {
                            return <span>{zeroPad(minutes)}:{zeroPad(seconds)}</span>
                          }}
                        />
                      )}
                    </Box>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Box textAlign='end'>
              <DarkButton onClick={onOpenBattleMenu} icon={faShield}/>
            </Box>

            <Box textAlign='end'>
              <DarkButton onClick={onOpenLeaderboardMenu} icon={faRankingStar} />
            </Box>

          </SimpleGrid>
        </Box>
      </Flex>
      <BattleDrawer isOpen={isBattleMenuOpen} onClose={onCloseBattleMenu} />
      <LeaderboardDrawer isOpen={isLeaderboardMenuOpen} onClose={onCloseLeaderboardeMenu} />
    </Box>
  )
}

interface ButtonProps {
  onClick: () => void;
  icon?: any;
}
const DarkButton = ({onClick, icon}: ButtonProps) => {
  return (
    <>
      <Box
        pointerEvents='auto'
        as='button'
        w={{base: '50px', sm: '50px'}}
        h={{base: '45px', sm: '45px'}}
        borderColor='#4c4859'
        color='#272523EE !important'
        borderRadius='4px'
        position='relative'
        borderWidth='4px 4px 4px 4px'
        data-group
        className='rd-button'
        _active={{
          borderColor: '#FFFFFF'
        }}
        bgColor='transparent !important'
        onClick={onClick}
      >
        <Flex
          direction='column'
          justify='center'
          px={0}
          bg='linear-gradient(to left, #272523EE, #151418 )'
          _groupHover={{
            bg: 'linear-gradient(to left, #272523EE, #272523EE )' ,
            ps: '0px',
          }}
          h='full'
        >
          <FontAwesomeIcon icon={icon} color='white'/>
        </Flex>
      </Box>
    </>
  )
}

interface FiveMinuteIntervalCountdownProps {
  startDate: Date;
}

const FiveMinuteIntervalCountdown = ({ startDate }: FiveMinuteIntervalCountdownProps) => {

  const calculateNextTarget = (): Date => {
    const now = new Date();
    const elapsed = now.getTime() - startDate.getTime();
    const remainder = elapsed % (5 * 60 * 1000);
    const nextInterval = (5 * 60 * 1000) - remainder;
    return new Date(now.getTime() + nextInterval);
  };

  const [targetDate, setTargetDate] = useState<Date>(calculateNextTarget());

  useEffect(() => {
    const updateAfterNextInterval = () => {
      const now = new Date();
      const timeUntilNextTarget = targetDate.getTime() - now.getTime();
      return setTimeout(() => {
        setTargetDate(calculateNextTarget());
      }, timeUntilNextTarget);
    };

    const timer = updateAfterNextInterval();

    return () => clearTimeout(timer);
  }, [targetDate]);

  const renderer = ({ minutes, seconds }: CountdownRenderProps) => {
    return <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>;
  };

  return (
    <Countdown
      key={targetDate.toString()}
      date={targetDate}
      renderer={renderer}
    />
  );
};

interface BattleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BattleDrawer = ({isOpen, onClose}: BattleDrawerProps) => {
  const user = useUser();
  const {game: rdGameContext, user: rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const {data: kobanBalance} = useQuery({
    queryKey: ['KobanBalance', user.address],
    queryFn: async () => getKobanBalance(),
    enabled: !!user.address
  });

  const getKobanBalance = async () => {
    let nfts = await NextApiService.getWallet(user!.address!, {
      collection: config.contracts.resources,
    });
    let kobanBalance = 0;
    if (nfts.data.length > 0) {
      kobanBalance = Number(nfts.data.find(nft => nft.nftId === '1')?.balance ?? 0);
    } else {
      const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
      const contract = new Contract(config.contracts.resources, ERC1155, readProvider);
      kobanBalance = await contract.balanceOf(user!.address!, 1);
      kobanBalance = Number(kobanBalance);
    }

    return kobanBalance;
  };

  const deployedFactionTroops = rdUser?.game.troops.faction?.deployed.users
    .filter((user) => user.profileId === 0)?.flatMap((user) => user.controlPoints) ?? [];

  const deployedUserTroops = rdUser?.game.troops.user?.deployed.factions.flatMap((user) => user.controlPoints) ?? [];

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} size='sm'>
        <DrawerOverlay />
        <DrawerContent bg='linear-gradient(#1f1818, #332727, #1f1818)'>
          <DrawerCloseButton />
          <DrawerHeader>
            <Box position='relative' maxW='250px' h='56px' mx='auto'>
              <Image
                position='absolute'
                maxW='250px'
                zIndex={1}
                src={ImageService.translate(`/img/ryoshi-dynasties/announcements/base/small_header.png`).convert()}
              />
              <Text
                position='absolute'
                zIndex={2}
                color='white'
                fontSize='lg'
                w='full'
                display='flex'
                alignItems='center'
                justifyContent='center'
                p={4}
              >
                Battle Info
              </Text>
            </Box>
          </DrawerHeader>
          <Image
            position='absolute'
            left={0}
            top={0}
            bottom={0}
            src={ImageService.translate(`/img/ryoshi-dynasties/announcements/base/small_frame_left.png`).convert()}
            alt='Edge'
            w='16px'
            h='full'
          />
          <DrawerBody>
            <AuthenticationRdButton>
              <HStack justify='space-between'>
                <HStack fontWeight='bold' color='white'>
                  <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/>
                  <Box>Koban</Box>
                </HStack>
                <Text>{kobanBalance ? commify(kobanBalance) : ''}</Text>
              </HStack>
              {!!rdUser && (
                <Box ps={2}>
                  {!!rdUser.faction && (
                    <Box mt={4}>
                      {/*<Text fontSize='lg' fontWeight='bold' color='white'>Faction</Text>*/}
                      <Box border='1px solid #F48F0C' rounded='md' p={2}>
                        <HStack>
                          <Avatar
                            width='40px'
                            height='40px'
                            padding={1}
                            src={ImageService.translate(rdUser?.faction.image).avatar()}
                          />
                          <Text>{rdUser?.faction.name}</Text>
                        </HStack>
                        <Box py={2}>
                          <hr/>
                        </Box>

                        <Box fontSize='sm'>Deployed Troops</Box>
                        {deployedFactionTroops.length > 0 ? (
                          <>
                            {deployedFactionTroops.map((controlPoint, index) => (
                              <HStack key={index} justify='space-between'>
                                <Box fontWeight='bold'>{controlPoint.name}</Box>
                                <Text>{commify(controlPoint.troops)}</Text>
                              </HStack>
                            ))}
                          </>
                        ) : (
                          <Box>None</Box>
                        )}
                      </Box>
                    </Box>
                  )}
                  <Box mt={4}>
                    {/*<Text fontSize='lg' fontWeight='bold' color='white'>User</Text>*/}
                    <Box border='1px solid #F48F0C' rounded='md' p={2}>
                      <HStack>
                        <Avatar
                          width='40px'
                          height='40px'
                          padding={1}
                          src={ImageService.translate(user.profile.profilePicture).avatar()}
                        />
                        <Text>{user.profile?.username ?? shortAddress(user.address)}</Text>
                      </HStack>
                      <Box py={2}>
                        <hr/>
                      </Box>

                      <Box fontSize='sm'>Deployed Troops</Box>
                      {deployedUserTroops.length > 0 ? (
                        <>
                          {deployedUserTroops.map((controlPoint, index) => (
                            <HStack key={index} justify='space-between'>
                              <Box fontWeight='bold'>{controlPoint.name}</Box>
                              <Text>{commify(controlPoint.troops)}</Text>
                            </HStack>
                          ))}
                        </>
                      ) : (
                        <Box>None</Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}
            </AuthenticationRdButton>
            <Box>
              <Box></Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

interface LeaderboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardDrawer = ({isOpen, onClose}: LeaderboardDrawerProps) => {
  const user = useUser();
  const {game: rdGameContext, user: rdUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const gameId = rdGameContext?.game.id;
  const isMobile = useBreakpointValue({ base: true, sm: false });

  const [page, setPage] = useState(0)
  const pageSize = 10;

  const {data: factionsByPoints} = useQuery({
    queryKey: ['RdPointLeaders', gameId],
    queryFn: async () => ApiService.withoutKey().ryoshiDynasties.getFactionsByPoints(gameId!),
    enabled: !!rdGameContext
  });

  const pagedFactions = factionsByPoints?.slice(page * pageSize, (page + 1) * pageSize) ?? [];

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} size='lg'>
        <DrawerOverlay />
        <DrawerContent bg='linear-gradient(#1f1818, #332727, #1f1818)'>
          <DrawerCloseButton />
          <DrawerHeader>
            <Box position='relative' maxW='250px' h='56px' mx='auto'>
              <Image
                position='absolute'
                maxW='250px'
                zIndex={1}
                src={ImageService.translate(`/img/ryoshi-dynasties/announcements/base/small_header.png`).convert()}
              />
              <Text
                position='absolute'
                zIndex={2}
                color='white'
                fontSize='lg'
                w='full'
                display='flex'
                alignItems='center'
                justifyContent='center'
                p={4}
              >
                Points Leaderboard
              </Text>
            </Box>
          </DrawerHeader>
          <Image
            position='absolute'
            left={0}
            top={0}
            bottom={0}
            src={ImageService.translate(`/img/ryoshi-dynasties/announcements/base/small_frame_left.png`).convert()}
            alt='Edge'
            w='16px'
            h='full'
          />
          <DrawerBody>
            <Box mt={2}>
              <TableContainer w={{base: '95%', sm: '100%'}}>
                <Table size='sm'>
                  <Thead>
                    <Tr>
                      <Th textAlign='left'>Rank</Th>
                      <Th textAlign='left'>Faction</Th>
                      <Th textAlign='left' isNumeric>Points</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pagedFactions.map((entry: any, index: any) => (
                      <Tr key={entry.faction.name}>
                        <Td w={8}>{(page * pageSize) + index + 1}</Td>
                        <Td
                          textAlign='left'
                          alignSelf='center'
                          alignContent='center'
                          alignItems='center'
                          display='flex'
                          h='43px'
                          w={isMobile ? '140px': '200px'}
                        >
                          <HStack>
                            <Avatar
                              width='40px'
                              height='40px'
                              padding={1}
                              src={ImageService.translate(entry.faction.image).avatar()}
                            />
                            <Text isTruncated={isMobile} maxW={isMobile ? '140px': '200px'}>{entry.faction.name}</Text>
                          </HStack>
                        </Td>
                        <Td textAlign='left' maxW='200px' isNumeric>{commify(entry.points)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Box textAlign='center' mt={2}>
                <ButtonGroup>
                  <Button
                    onClick={() => setPage(page - 1)}
                    isDisabled={page === 0}
                    size='sm'
                    leftIcon={<ChevronLeftIcon />}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setPage(page + 1)}
                    isDisabled={pagedFactions.length < pageSize}
                    size='sm'
                    rightIcon={<ChevronRightIcon />}
                  >
                    Next
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}