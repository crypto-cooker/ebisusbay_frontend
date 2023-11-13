import {appConfig} from "@src/Config";
import {useAppSelector} from "@src/Store/hooks";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Avatar,
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useClipboard,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {ArrowBackIcon, CopyIcon, DownloadIcon, EditIcon} from "@chakra-ui/icons";
import localFont from "next/font/local";
import RdButton from "../../../../components/rd-button";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import {getRegistrationCost} from "@src/core/api/RyoshiDynastiesAPICalls";
import {
  RdFaction,
  RdUserContextNoOwnerFactionTroops,
  RdUserContextOwnerFactionTroops
} from "@src/core/services/api-service/types";
import EditFactionForm from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/edit-faction";
import CreateFactionForm from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/create-faction";
import DelegateTroopsForm from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/delegate-troops";
import AllianceCenterContract from "@src/Contracts/AllianceCenterContract.json";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, shortAddress} from "@src/utils";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";

import {BigNumber, Contract, ethers} from "ethers";
import Fortune from "@src/Contracts/Fortune.json";
import {ApiService} from "@src/core/services/api-service";
import {commify, isAddress} from "ethers/lib/utils";
import {parseErrorMessage} from "@src/helpers/validator";
import ImageService from "@src/core/services/image";
import {motion} from "framer-motion";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import axios from 'axios';

const config = appConfig();
const gothamBook = localFont({
  src: '../../../../../../../fonts/Gotham-Book.woff2',
  fallback: ['Roboto', 'system-ui', 'arial'],
})

interface AllianceCenterProps {
  onClose: () => void;
}

const AllianceCenter = ({onClose}: AllianceCenterProps) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const {isSignedIn, isSigningIn, signin} = useEnforceSigner();

  const handleConnect = async () => {
    if (!user.address) {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  }

  const handleSignin = async () => {
    await signin();
  }

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1,
      transition: {
      }
     }
  }

  return (
<Box
      position='relative'
      h='calc(100vh - 74px)'
      overflow={'scroll'}
      minH={{base: '900px', xl: '100vh' }}
      >
     <motion.div
        variants={item}
        initial="hidden"
        animate="show"
      >
        <Box 
          position='absolute'
          top={0}
          left={0}
          zIndex={1}
          w='100%'
          h='100%'
        >
          {/* <FactionDirectoryComponent /> */}
          <Flex
          justifyContent={'center'}
          alignItems={'center'}
          h='100%'
            >
          <Flex
            maxW={'500px'}
            border='1px solid #FFD700'
            backgroundColor='#292626'
            flexDirection='column'
            textAlign='center'
            borderRadius={'10px'}
            justifyContent='space-around'
            padding={4}
            w={{base: '100%', xl: '450px' }}
            boxShadow='0px 0px 10px 0px #000000'
            className={gothamBook.className}
            position='absolute'
            >
          <Flex justify='space-between'>
            <Box
              left={6}
              top={6}
              rounded='full'
              zIndex={1}
              _groupHover={{
                cursor: 'pointer'
              }}
              data-group
            >
              <Button
                bg='#C17109'
                rounded='full'
                border='8px solid #F48F0C'
                w={14}
                h={14}
                onClick={onClose}
                _groupHover={{
                  bg: '#de8b08',
                  borderColor: '#f9a50b',
                }}
              >
                <ArrowBackIcon boxSize={8} />
              </Button>
            </Box>
            <Box textAlign='end' ms={2}>
              <Text textColor='#ffffffeb' fontSize={{ base: '28px', md: '32px' }} fontWeight='bold'>Alliance Center</Text>
              <Text textColor='#ffffffeb' fontSize='sm' fontStyle='italic'>Manage your Faction, Delegate your troops</Text>
            </Box>
          </Flex>
        <Box>
        {!!user.address ? (
          <>
            {isSignedIn ? (
              <CurrentFaction />
            ) : (
              <Box textAlign='center' mt={4}>
                <Text mb={2}>Sign in to view faction information</Text>
                <RdButton
                  stickyIcon={true}
                  onClick={handleSignin}
                  isLoading={isSigningIn}
                >
                  Sign in
                </RdButton>
              </Box>
            )}
          </>
        ) : (
          <Box textAlign='center' pt={8} pb={4} px={2}>
            <Box ps='20px'>
              <RdButton
                w='250px'
                fontSize={{base: 'xl', sm: '2xl'}}
                stickyIcon={true}
                onClick={handleConnect}
              >
                Connect
              </RdButton>
            </Box>
          </Box>
        )}
      </Box>

    </Flex>
    </Flex>

        </Box>
         <AspectRatio ratio={1920/1080} overflow='visible' >
          <Image
          position={'absolute'}
            src={'/img/ryoshi-dynasties/village/background-alliance-center.webp'}
            opacity={0.2}
            zIndex={0}
            // src={ImageService.translate('/img/ryoshi-dynasties/village/background-alliance-center.webp').convert()}
            minH='calc(100vh - 74px)'
          />
        </AspectRatio>
      </motion.div>
    </Box>
  )
}

export default AllianceCenter;

const CurrentFaction = () => {
  const user = useAppSelector((state) => state.user);
  const {requestSignature} = useEnforceSignature();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const { isOpen: isOpenFaction, onOpen: onOpenFaction, onClose: onCloseFaction } = useDisclosure();
  const { isOpen: isOpenCreateFaction, onOpen: onOpenCreateFaction, onClose: onCloseCreateFaction } = useDisclosure();
  const { isOpen: isOpenDelegate, onOpen: onOpenDelegate, onClose: onCloseDelegate } = useDisclosure();
  const { isOpen: noEditsModalisOpen, onOpen: noEditsModalOnOpen, onClose: noEditsModalonClose } = useDisclosure()

  const [factionCreatedAndEnabled, setFactionCreatedAndEnabled] = useState(false);
  const [isRegisteredCurrentSeason, setIsRegisteredCurrentSeason] = useState(false);
  const [isRegisteredNextSeason, setIsRegisteredNextSeason] = useState(false);

  const [troopsByGame, setTroopsByGame] = useState(rdContext.user?.season.troops);
  const [loadingTroopsBreakdown, setLoadingTroopsBreakdown] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>('current');

  const getDaysSinceGameStart = () => {
    if(!rdContext.game) return 0;
    const startDate = new Date(rdContext.game.game.startAt);
    const timeSinceStart = Date.now() - startDate.getTime();
    const daysSinceStart = timeSinceStart / (1000 * 3600 * 24);
    return daysSinceStart;
  }

  const OpenEditFaction = () => {
    onOpenFaction();
    if(getDaysSinceGameStart() >= rdContext.config.factions.editableDays-1){
      console.log('Open Modal');
      //will give a warning on day 3, explain on day 4
      noEditsModalOnOpen();
    }
  }
  const [isExecutingRegister, setIsExecutingRegister] = useState(false);

  const handleActionComplete = async ()=> {
    onCloseFaction();
    onCloseCreateFaction();
    onCloseDelegate();
    await rdContext.refreshUser();
  }

  const checkForApproval = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
    const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), config.contracts.allianceCenter);
    return totalApproved as BigNumber;
  }
  const handleRegister = async (seasonBlockId : number) => {
    if (!user.address) return;

    const currentSeasonBlockId = rdContext.game?.season.blockId;
    if (!currentSeasonBlockId) {
      console.log('No active season');
      return;
    }
    const nextSeasonBlockId = currentSeasonBlockId + 1;

    if(isRegisteredCurrentSeason && seasonBlockId === currentSeasonBlockId ||
      isRegisteredNextSeason && seasonBlockId === nextSeasonBlockId) {
      console.log('Already Registered');
    } else {
      try {
        setIsExecutingRegister(true);
        const signinSignature = await requestSignature();
        const { signature, ...registrationStruct } = await getRegistrationCost(
          user.address?.toLowerCase(),
          signinSignature,
          seasonBlockId,
          rdContext.game?.game.id,
          rdContext.user?.faction.id
        );

        const totalApproved = await checkForApproval();
        if(totalApproved.lt(registrationStruct.cost)) {
          toast.warning('Please approve the contract to spend your tokens');
          const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
          const tx1 = await fortuneContract.approve(config.contracts.allianceCenter, registrationStruct.cost);
          const receipt1 = await tx1.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt1.transactionHash));
        }

        const registerFactionContract = new Contract(config.contracts.allianceCenter, AllianceCenterContract, user.provider.getSigner());
        const tx = await registerFactionContract.registerFaction(registrationStruct, signature)
        const receipt = await tx.wait();
        rdContext.refreshUser();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      } catch (error: any) {
        console.log(error);
        toast.error(parseErrorMessage(error));
      } finally {
        setIsExecutingRegister(false);
      }
    }
  }

  const [focusedGameId, setFocusedGameId] = useState<number>(rdContext.game?.game.id ?? 0);
  const handleGameChange = async (game?: string) => {
    if (game === 'previous' && !!rdContext.game) {
      try {
        setLoadingTroopsBreakdown(true);
        const previousGameId = rdContext.game.history.previousGameId;
        const signature = await requestSignature();
        const troops = await ApiService.withoutKey().ryoshiDynasties.getTroopsBreakdown(previousGameId, user.address!, signature);
        setTroopsByGame(troops);
        setFocusedGameId(previousGameId);
      } catch (e) {
        console.log(e);
        setTroopsByGame(rdContext.user?.season.troops);
        setFocusedGameId(rdContext.game.game.id);
      } finally {
        setLoadingTroopsBreakdown(false);
      }
    } else {
      setTroopsByGame(rdContext.user?.season.troops);
    }
  }
  
  useEffect(() => {
    if(!rdContext.user) return;

    setFactionCreatedAndEnabled(rdContext.user?.faction?.id !== undefined && rdContext.user?.faction.isEnabled);

    setIsRegisteredCurrentSeason(rdContext.user.season.registrations.current);
    setIsRegisteredNextSeason(rdContext.user.season.registrations.next);

    setTroopsByGame(rdContext.user.season.troops);
    setSelectedGame('current');
  }, [rdContext.user]);

  useEffect(() => {
    handleGameChange(selectedGame);
  }, [selectedGame]);

  return (
    <Box mt={4}>
          {!!rdContext.user?.faction ? (
            <VStack>
              <Avatar
                size='2xl'
                src={rdContext.user?.faction.image}
                filter={factionCreatedAndEnabled ? 'none' : 'grayscale(100%)'}
                // w='150px'
                // rounded='lg
              />
              <Text paddingTop='40px' position='absolute' fontSize='lg' as='i' fontWeight='bold' textColor='red'>{factionCreatedAndEnabled ? '':'Faction Disbanded'}</Text>
              <Stack direction='row' align='center'>
                <Text fontSize='lg' fontWeight='bold'>{rdContext.user.faction.name}</Text>
                <IconButton
                  aria-label='Edit Faction'
                  icon={<EditIcon />}
                  variant='ghost'
                  color={getDaysSinceGameStart() > rdContext.config.factions.editableDays ? 'red' :'#FFD700'}
                  onClick={OpenEditFaction}
                />
              </Stack>
              {factionCreatedAndEnabled ? (
                <>
                  <Box bg='#564D4A' p={2} rounded='lg' w='full'>
                    <SimpleGrid columns={2}>
                      <VStack align='start' spacing={0} my='auto'>
                        <Text fontSize='sm'>Current Season {!!rdContext.game?.season && <>({rdContext.game?.season.blockId})</>}</Text>
                        <Text fontSize='lg' fontWeight='bold'>{!!rdContext.user.season.faction ? 'Registered' : 'Unregistered'}</Text>
                      </VStack>
                      {!rdContext.user.season.faction && !!rdContext.game?.season && (
                        <RdButton
                          hoverIcon={false}
                          onClick={() => handleRegister(rdContext.game!.season.blockId)}
                          isLoading={isExecutingRegister}
                          isDisabled={isExecutingRegister}
                        >
                          Register
                        </RdButton>
                      )}
                    </SimpleGrid>
                    {!rdContext.user.season.faction && (
                      <Box textAlign='start' mt={2} fontSize='sm'>
                        <Text>Regular Cost: {commify(rdContext.config.factions.registration.fortuneCost)} Fortune + {rdContext.config.factions.registration.mitamaCost} Mitama</Text>
                      </Box>
                    )}
                  </Box>
                </>
              ) : (!!rdContext.user && rdContext.user.season.troops.available.total > 0) && (
                <RdButton
                  onClick={onOpenDelegate}
                  maxH='50px'
                  size='sm'
                >
                  Delegate
                </RdButton>
              )}
            </VStack>
          ) : (
            <Center>
              <VStack spacing={6} mb={2} w='full'>
                <Text>You are not the owner of any faction yet</Text>
                <Stack direction='row' justify='space-around' w='full'>
                  <RdButton
                    onClick={onOpenCreateFaction}
                    size='sm'
                  >
                    Create Faction
                  </RdButton>
                  {(!!rdContext.user && rdContext.user.season.troops.available.total > 0 && !factionCreatedAndEnabled) && (
                    <RdButton
                      onClick={onOpenDelegate}
                      maxH='50px'
                      size='sm'
                    >
                      Delegate
                    </RdButton>
                  )}
                </Stack>
              </VStack>
            </Center>
          )}

          {!!rdContext.user && (
            <>
              <Flex mt={4} justify='space-between'>
                <HStack>
                  <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()} alt="troopsIcon" boxSize={6}/>
                  <Text fontSize='xl' fontWeight='bold'textAlign='start'>Troops</Text>
                </HStack>
                <Select
                  onChange={(e) => setSelectedGame(e.target.value)}
                  value={selectedGame}
                  maxW='175px'
                  size='sm'
                  rounded='md'
                >
                  <option value='current'>Current Game</option>
                  <option value='previous'>Previous Game</option>
                </Select>
              </Flex>
              {!!troopsByGame && (
                <TroopsBreakdown
                  faction={rdContext.user.faction}
                  troops={troopsByGame}
                  gameId={focusedGameId}
                />
              )}
            </>
          )}

      {!!rdContext.user && (
        <>
          {!!rdContext.user.faction ? (
            <>
            <EditFactionForm isOpen={isOpenFaction} onClose={onCloseFaction} faction={rdContext.user.faction} handleClose={handleActionComplete} isRegistered={!!rdContext.user.season.faction} />
            <Modal isCentered={true} closeOnOverlayClick={false} isOpen={noEditsModalisOpen} onClose={noEditsModalonClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Mid Game Faction Editing Disabled</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>{getDaysSinceGameStart() < rdContext.config.factions.editableDays ? (<>
                      Today is the last day you can make changes to your faction this game. Changes may be made during the first {rdContext.config.factions.editableDays} days of every game.
                    </>):(<>
                      You cannot edit your faction at this point in the game. Changes may be made during the first {rdContext.config.factions.editableDays} days of every game.
                    </>)
                    
                  }
                  </ModalBody>
                  <ModalFooter justifyContent={'center'}>
                    <Button onClick={noEditsModalonClose}>I Understand</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
            
          ) : (
            <CreateFactionForm isOpen={isOpenCreateFaction} onClose={onCloseCreateFaction} handleClose={handleActionComplete} />
          )}
          <DelegateTroopsForm 
            isOpen={isOpenDelegate} 
            onClose={onCloseDelegate} 
            delegateMode='delegate' 
          />
        </>
      )}

    </Box>
  );
}

const TroopsBreakdown = ({faction, troops, gameId}: {faction: RdFaction, gameId: number, troops: RdUserContextOwnerFactionTroops | RdUserContextNoOwnerFactionTroops}) => {
  const user = useAppSelector((state) => state.user);
  const {signature} = useEnforceSignature();

  return (
    <Accordion w='full' mt={2} allowMultiple>
      <AccordionItem bgColor='#564D4A' rounded='md'>
        <AccordionButton>
          <Flex w='full'>
            <Box flex='1' textAlign='left' my='auto'>Total</Box>
            <Box ms={2} my='auto' fontWeight='bold'>{commify(troops.overall.total)}</Box>
            <AccordionIcon ms={4} my='auto'/>
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={1} fontSize='sm'>
          <SimpleGrid columns={2} w='full'>
            <Box textAlign='start'>Owned</Box>
            <Box textAlign='end'>{commify(troops.overall.owned)}</Box>
            {faction && faction.isEnabled && (
              <>
                <Box textAlign='start'>Delegated</Box>
                <Box textAlign='end'>{commify(troops.overall.delegated)}</Box>
              </>
            )}
          </SimpleGrid>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem bgColor='#564D4A' rounded='md' mt={2}>
        <AccordionButton>
          <Flex w='full'>
            <Box flex='1' textAlign='left' my='auto'>Available</Box>
            <Box ms={2} my='auto' fontWeight='bold'>{commify(troops.available.total)}</Box>
            <AccordionIcon ms={4} my='auto'/>
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={1} pt={0} fontSize='sm'>
          <Text color='#ccc' textAlign='start' pb={2}>Troops ready for deployment</Text>
          <SimpleGrid columns={2} w='full'>
            <Box textAlign='start'>Owned</Box>
            <Box textAlign='end'>{commify(troops.available.owned)}</Box>
            {/*{rdContext.user.faction && rdContext.user.faction.isEnabled && (*/}
            {/*  <>*/}
            {/*    <Box textAlign='start'>Delegated</Box>*/}
            {/*    <Box textAlign='end'>{commify(rdContext.user.season.troops.delegate.total)}</Box>*/}
            {/*  </>*/}
            {/*)}*/}
          </SimpleGrid>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem bgColor='#564D4A' rounded='md' mt={2}>
        <AccordionButton>
          <Flex w='full'>
            <Box flex='1' textAlign='left' my='auto'>Delegations</Box>
            <Box ms={2} my='auto' fontWeight='bold'>{commify(troops.delegate.total)}</Box>
            <AccordionIcon ms={4} my='auto'/>
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={1} pt={0} fontSize='sm'>
          {faction && faction.isEnabled ? (
            <>
              <Text color='#ccc' textAlign='start' pb={2}>Troops received from users</Text>
              {(troops as RdUserContextOwnerFactionTroops).delegate.users.length > 0 ? (
                <>
                  <SimpleGrid columns={2} w='full'>
                    {(troops as RdUserContextOwnerFactionTroops).delegate.users.map((user) => (
                      <>
                        <Box textAlign='start'>
                          <CopyableText
                            text={user.profileWalletAddress}
                            label={isAddress(user.profileName) ? shortAddress(user.profileName) : user.profileName}
                          />
                        </Box>
                        <Box textAlign='end'>{commify(user.troops)}</Box>
                      </>
                    ))}
                  </SimpleGrid>
                  <ExportDataComponent
                    data={(troops as RdUserContextOwnerFactionTroops).delegate.users.map((user) => ({
                      address: user.profileWalletAddress,
                      name: user.profileName,
                      troops: user.troops,
                    })).sort((a, b) => b.troops - a.troops)}
                    address={user.address!}
                    signature={signature}
                    gameId={gameId}
                  />
                </>
              ) : (
                <>None</>
              )}
            </>
          ) : (
            <>
              <Text color='#ccc' textAlign='start' pb={2}>Troops delegated to factions</Text>
              {(troops as RdUserContextNoOwnerFactionTroops).delegate.factions.length > 0 ? (
                <SimpleGrid columns={2} w='full'>
                  {(troops as RdUserContextNoOwnerFactionTroops).delegate.factions.map((faction) => (
                    <>
                      <Box textAlign='start'>{faction.factionName}</Box>
                      <Box textAlign='end'>{commify(faction.troops)}</Box>
                    </>
                  ))}
                </SimpleGrid>
              ) : (
                <>None</>
              )}
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem bgColor='#564D4A' rounded='md' mt={2}>
        <AccordionButton>
          <Flex w='full'>
            <Box flex='1' textAlign='left' my='auto'>Deployments</Box>
            <Box ms={2} my='auto' fontWeight='bold'>{commify(troops.deployed.total)}</Box>
            <AccordionIcon ms={4} my='auto'/>
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={1} pt={0} fontSize='sm'>
          <Text color='#ccc' textAlign='start' pb={2}>Troops deployed to control points</Text>
          {faction && faction.isEnabled ? (
            <>
              {(troops as RdUserContextOwnerFactionTroops).deployed.users.length > 0 ? (
                <Accordion allowMultiple>
                  {(troops as RdUserContextOwnerFactionTroops).deployed.users.map((user) => (
                    <AccordionItem bgColor='#564D4A' rounded='md'>
                      <Flex w='100%' ps={4}>
                        <Box flex='1' textAlign='left' my='auto'>
                          <CopyableText
                            text={user.profileWalletAddress}
                            label={isAddress(user.profileName) ? shortAddress(user.profileName) : user.profileName}
                          />
                        </Box>
                        <Box ms={2} my='auto' fontWeight='bold'>{commify(user.troops)}</Box>
                        <AccordionButton w='auto'>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>
                      <AccordionPanel pb={1} pt={0} fontSize='sm'>
                        {user.controlPoints.length > 0 ? (
                          <SimpleGrid columns={2} w='full'>
                            {user.controlPoints.map((cp) => (
                              <>
                                <Box textAlign='start'>{cp.name}</Box>
                                <Box textAlign='end'>{commify(cp.troops)}</Box>
                              </>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <>None</>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <>None</>
              )}
            </>
          ) : (
            <>
              {(troops as RdUserContextNoOwnerFactionTroops).deployed.factions.length > 0 ? (
                <Accordion allowMultiple>
                  {(troops as RdUserContextNoOwnerFactionTroops).deployed.factions.map((faction) => (
                    <AccordionItem bgColor='#564D4A' rounded='md'>
                      <Flex w='100%' ps={4}>
                        <Box flex='1' textAlign='left' my='auto'>{faction.factionName}</Box>
                        <Box ms={2} my='auto' fontWeight='bold'>{commify(faction.troops)}</Box>
                        <AccordionButton w='auto'>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>
                      <AccordionPanel pb={1} pt={0} fontSize='sm'>
                        {faction.controlPoints.length > 0 ? (
                          <SimpleGrid columns={2} w='full'>
                            {faction.controlPoints.map((cp) => (
                              <>
                                <Box textAlign='start'>{cp.name}</Box>
                                <Box textAlign='end'>{commify(cp.troops)}</Box>
                              </>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <>None</>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <>None</>
              )}
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem bgColor='#564D4A' rounded='md' mt={2}>
        <AccordionButton>
          <Flex w='full'>
            <Box flex='1' textAlign='left' my='auto'>Slain</Box>
            <Box ms={2} my='auto' fontWeight='bold'>{commify(troops.slain.total)}</Box>
            <AccordionIcon ms={4} my='auto'/>
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={1} pt={0} fontSize='sm'>
          <Text color='#ccc' textAlign='start' pb={2}>Troops defeated in battle</Text>
          {faction && faction.isEnabled ? (
            <>
              {(troops as RdUserContextOwnerFactionTroops).slain.users.length > 0 ? (
                <Accordion allowMultiple>
                  {(troops as RdUserContextOwnerFactionTroops).slain.users.map((user) => (
                    <AccordionItem bgColor='#564D4A' rounded='md'>
                      <Flex w='100%' ps={4}>
                        <Box flex='1' textAlign='left' my='auto'>
                          <CopyableText
                            text={user.profileWalletAddress}
                            label={isAddress(user.profileName) ? shortAddress(user.profileName) : user.profileName}
                          />
                        </Box>
                        <Box ms={2} my='auto' fontWeight='bold'>{commify(user.troops)}</Box>
                        <AccordionButton w='auto'>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>
                      <AccordionPanel pb={1} pt={0} fontSize='sm'>
                        {user.controlPoints.length > 0 ? (
                          <SimpleGrid columns={2} w='full'>
                            {user.controlPoints.map((cp) => (
                              <>
                                <Box textAlign='start'>{cp.name}</Box>
                                <Box textAlign='end'>{commify(cp.troops)}</Box>
                              </>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <>None</>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <>None</>
              )}
            </>
          ) : (
            <>
              {(troops as RdUserContextNoOwnerFactionTroops).slain.factions.length > 0 ? (
                <Accordion allowMultiple>
                  {(troops as RdUserContextNoOwnerFactionTroops).slain.factions.map((faction) => (
                    <AccordionItem bgColor='#564D4A' rounded='md'>
                      <Flex w='100%' ps={4}>
                        <Box flex='1' textAlign='left' my='auto'>{faction.factionName}</Box>
                        <Box ms={2} my='auto' fontWeight='bold'>{commify(faction.troops)}</Box>
                        <AccordionButton w='auto'>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>
                      <AccordionPanel pb={1} pt={0} fontSize='sm'>
                        {faction.controlPoints.length > 0 ? (
                          <SimpleGrid columns={2} w='full'>
                            {faction.controlPoints.map((cp) => (
                              <>
                                <Box textAlign='start'>{cp.name}</Box>
                                <Box textAlign='end'>{commify(cp.troops)}</Box>
                              </>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <>None</>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <>None</>
              )}
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

const CopyableText = ({text, label}: {text: string, label: string}) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard('');

  useEffect(() => {
    setValue(text);
  }, [text]);

  return (
    <Text cursor='pointer' onClick={onCopy}>{label}</Text>
  )
}

const ExportDataComponent = ({data, gameId, address, signature}: {data: any, gameId: number, address: string, signature: string}) => {
  const csvData = convertToCSV(data);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const downloadLink = URL.createObjectURL(blob);
  const [token, setToken] = useState('');
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const {isOpen, onOpen} = useDisclosure();

  const handleAlternative = async () => {
    const response = await axios.get('/api/export/request-token', {
      params: {
        address,
        signature,
        gameId,
        type: 'ryoshi-dynasties/delegations'
      }
    });
    if (response.data.token) {
      setValue(`${config.urls.app}ryoshi/export?token=${response.data.token}`)
    }
    setToken(response.data.token);
  }

  useEffect(() => {
    if (!!value) {
      onCopy();
    }
  }, [value]);

  return (
    <Box textAlign='end' mt={2}>
      <Button
        variant='link'
        size='xs'
        leftIcon={<DownloadIcon />}
        onClick={onOpen}
      >
        Export Options
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Stack direction='row' justify='center' my={2}>
          <Link
            href={downloadLink}
            download='delegations.csv'
          >
            <Button
              leftIcon={<DownloadIcon />}
              size='sm'
              _hover={{
                color:'#F48F0C'
              }}
            >
              Export Data
            </Button>
          </Link>
          <Box>
            <Button
              leftIcon={<CopyIcon />}
              size='sm'
              onClick={handleAlternative}
            >
              {hasCopied ? "Copied!" : "Copy Download link"}
            </Button>
          </Box>
        </Stack>
      </Collapse>
    </Box>
  )
}


function convertToCSV(objArray: Array<{ [key: string]: any }>) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  if (array.length === 0) return '';
  let str = '';

  // headers
  const headers = Object.keys(array[0]);
  str += headers.join(',') + '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line !== '') line += ',';

      // Handle values that contain comma or newline
      let value = array[i][index] ?? '';
      line += '"' + value.toString().replace(/"/g, '""') + '"';
    }
    str += line + '\r\n';
  }
  return str;
}