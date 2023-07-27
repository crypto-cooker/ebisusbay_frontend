import {appConfig} from "@src/Config";
import {useAppSelector} from "@src/Store/hooks";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {ArrowBackIcon, EditIcon} from "@chakra-ui/icons";
import localFont from "next/font/local";
import RdButton from "../../../../components/rd-button";
import React, {useContext, useEffect, useState} from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import {useQuery} from "@tanstack/react-query";
import {addTroops, getRegistrationCost} from "@src/core/api/RyoshiDynastiesAPICalls";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {RdUserContextNoOwnerFactionTroops, RdUserContextOwnerFactionTroops} from "@src/core/services/api-service/types";
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
import {useFormik} from 'formik';

import {BigNumber, Contract, ethers} from "ethers";
import Fortune from "@src/Contracts/Fortune.json";
import {ApiService} from "@src/core/services/api-service";
import {commify, isAddress} from "ethers/lib/utils";
import {parseErrorMessage} from "@src/helpers/validator";
import ImageService from "@src/core/services/image";

const config = appConfig();
const gothamBook = localFont({
  src: '../../../../../../../fonts/Gotham-Book.woff2',
  fallback: ['Roboto', 'system-ui', 'arial'],
})

interface AllianceCenterInlineProps {
  onClose: () => void;
}

const AllianceCenterInline = ({onClose}: AllianceCenterInlineProps) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);

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

  return (
    <Flex
      border='1px solid #FFD700'
      backgroundColor='#292626'
      flexDirection='column'
      textAlign='center'
      borderRadius={'10px'}
      justifyContent='space-around'
      padding={4}
      minW={{base: '100%', xl: '450px' }}
      boxShadow='0px 0px 10px 0px #000000'
      className={gothamBook.className}
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
          <CurrentFaction />
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
  )
}

export default AllianceCenterInline;


const CurrentFaction = () => {
  const user = useAppSelector((state) => state.user);
  const [_, getSigner] = useCreateSigner();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const { isOpen: isOpenFaction, onOpen: onOpenFaction, onClose: onCloseFaction } = useDisclosure();
  const { isOpen: isOpenCreateFaction, onOpen: onOpenCreateFaction, onClose: onCloseCreateFaction } = useDisclosure();
  const { isOpen: isOpenDelegate, onOpen: onOpenDelegate, onClose: onCloseDelegate } = useDisclosure();

  const [isExecutingRegister, setIsExecutingRegister] = useState(false);
  // const [totalTroops, setTotalTroops] = useState(rdContext.user?.season.troops.undeployed ?? 0);
  const {data: allFactions, status, error} = useQuery({
    queryKey: ['GetAllFactions'],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getFactions(rdContext.game?.game.id),
    enabled: !!user.address && !!rdContext.game?.game.id,
    initialData: [],
    refetchOnWindowFocus: false,
  });

  const handleActionComplete = async ()=> {
    onCloseFaction();
    onCloseCreateFaction();
    onCloseDelegate();
    await rdContext.refreshUser();
    // queryClient.invalidateQueries(['GetAllFactions']);
  }
  const handleAddTroops = async () => {
    if (!user.address) return;

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const res = await addTroops(user.address!.toLowerCase(), signatureInStorage, 8);
        // console.log(res)
        await rdContext.refreshUser();
        // await queryClient.invalidateQueries(['GetFactionData', user.address]);
      } catch (error) {
        console.log(error)
      }
    }
  }
  const checkForApproval = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
    const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), config.contracts.allianceCenter);
    return totalApproved as BigNumber;
  }
  const handleRegister = async () => {
    if (!user.address) return;

    if(!!rdContext.user?.season.faction) {
      console.log('Already Registered');
    } else {
      try {
        setIsExecutingRegister(true);
        let signatureInStorage = getAuthSignerInStorage()?.signature;
        if (!signatureInStorage) {
          const { signature } = await getSigner();
          signatureInStorage = signature;
        }
        if (signatureInStorage) {
          // console.log(rdContext);
          const data = await getRegistrationCost(user.address?.toLowerCase(), signatureInStorage, 
            rdContext.game?.season.blockId, rdContext.game?.game.id, rdContext.user?.faction.id)

          const totalApproved = await checkForApproval();
          if(totalApproved.lt(data.cost))
          {
            toast.error('Please approve the contract to spend your tokens');
            const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
            const tx1 = await fortuneContract.approve(config.contracts.allianceCenter, data.cost);
            const receipt1 = await tx1.wait();
            toast.success(createSuccessfulTransactionToastContent(receipt1.transactionHash));
          }

          const registrationStruct = {
            leader: user.address?.toLowerCase(),
            cost: data.cost,
            season: rdContext.game?.season.blockId
          }
          console.log(registrationStruct);
          console.log(Number(ethers.utils.formatEther(data.cost)));
          const registerFactionContract = new Contract(config.contracts.allianceCenter, AllianceCenterContract, user.provider.getSigner());
          const tx = await registerFactionContract.registerFaction(registrationStruct, data.signature)
          const receipt = await tx.wait();
          rdContext.refreshUser();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        }
      } catch (error: any) {
        console.log(error);
        toast.error(parseErrorMessage(error));
      } finally {
        setIsExecutingRegister(false);
      }
    }
  }
  const formikProps = useFormik({
    onSubmit: () => console.log('submit'),
    // validationSchema: userInfoValidation,
    initialValues: {},
    enableReinitialize: true,
  });

  const [factionCreatedAndEnabled, setFactionCreatedAndEnabled] = useState(false);

  useEffect(() => {
    if(!rdContext.user) return;

    // console.log(rdContext.user?.armiesInfo);
    // console.log(getAuthSignerInStorage()?.signature)
    // console.log(user.address)
    if(rdContext.user?.faction?.id !== undefined && rdContext.user?.faction.isEnabled){
      console.log('Faction Created and Enabled');
      setFactionCreatedAndEnabled(true);
    }
    else{
      console.log('Faction Not Created or Enabled');
      setFactionCreatedAndEnabled(false);
    }
}, [rdContext]); 



  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    validateForm,
    handleSubmit,
  } = formikProps;
  return (
    <Box mt={4}>
      {status === 'loading' ? (
        <Box padding={6}>
          <Center><SkeletonCircle size='20' startColor='#ccc' /></Center>
          <SkeletonText mt={4} noOfLines={2} spacing='4' skeletonHeight='2' startColor='#ccc' />
          <SkeletonText mt={8} noOfLines={2} spacing='4' skeletonHeight='2' startColor='#ccc' />
          <SkeletonText mt={8} noOfLines={2} spacing='4' skeletonHeight='2' startColor='#ccc' />
        </Box>
      ) : status === 'error' ? (
        <Center>
          <Text>{(error as any).message}</Text>
        </Center>
      ) : (
        <>
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
                  color={'#FFD700'}
                  onClick={onOpenFaction}
                />
              </Stack>
              {factionCreatedAndEnabled && (
              <Box bg='#564D4A' p={2} rounded='lg' w='full'>
                <SimpleGrid columns={2}>
                  <VStack align='start' spacing={0} my='auto'>
                    <Text fontSize='sm'>Current Season</Text>
                    <Text fontSize='lg' fontWeight='bold'>{!!rdContext.user.season.faction ? 'Registered' : 'Unregistered'}</Text>
                  </VStack>
                  {!rdContext.user.season.faction && (
                    <RdButton
                      hoverIcon={false}
                      onClick={handleRegister}
                      isLoading={isExecutingRegister}
                      isDisabled={isExecutingRegister}
                    >
                      Register
                    </RdButton>
                  )}
                </SimpleGrid>
                {!rdContext.user.season.faction && (
                  <Box textAlign='start' mt={2} fontSize='sm'>
                    <Text>Regular Cost: {commify(rdContext.config.factions.registration.cost)} Fortune + {rdContext.config.factions.registration.troopsCost} Troops</Text>
                    <Text >Presale Users: Free for first season</Text>
                  </Box>
                )}
              </Box>
              )}
            </VStack>
          ) : (
            <Center>
              <VStack spacing={6} mb={2}>
                <Text>You are not the owner of any faction yet</Text>
                <RdButton
                  stickyIcon={true}
                  onClick={onOpenCreateFaction}
                >
                  Create Faction
                </RdButton>
              </VStack>
            </Center>
          )}

          {!!rdContext.user && (
            <>
              <HStack mt={4}>
                <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()} alt="troopsIcon" boxSize={6}/>
                <Text fontSize='xl' fontWeight='bold'textAlign='start'>Troops</Text>
              </HStack>
              <Accordion w='full' mt={2} allowMultiple>
                <AccordionItem bgColor='#564D4A' rounded='md'>
                  <Flex w='100%' ps={4}>
                    <Box flex='1' textAlign='left' my='auto'>Total</Box>
                    <Box ms={2} my='auto' fontWeight='bold'>{commify(rdContext.user.season.troops.overall.total)}</Box>
                    <AccordionButton w='auto'>
                      <AccordionIcon />
                    </AccordionButton>
                  </Flex>
                  <AccordionPanel pb={1} fontSize='sm'>
                    <SimpleGrid columns={2} w='full'>
                      <Box textAlign='start'>Owned</Box>
                      <Box textAlign='end'>{commify(rdContext.user.season.troops.overall.owned)}</Box>
                      <Box textAlign='start'>Delegated</Box>
                      <Box textAlign='end'>{commify(rdContext.user.season.troops.overall.delegated)}</Box>
                    </SimpleGrid>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem bgColor='#564D4A' rounded='md' mt={2}>
                  <Flex w='100%' ps={4}>
                    <Box flex='1' textAlign='left' my='auto'>Available</Box>
                    <Box ms={2} my='auto' fontWeight='bold'>{commify(rdContext.user.season.troops.available.total)}</Box>
                    <AccordionButton w='auto'>
                      <AccordionIcon />
                    </AccordionButton>
                  </Flex>
                  <AccordionPanel pb={1} pt={0} fontSize='sm'>
                    <Text color='#ccc' textAlign='start' pb={2}>Alive Troops ready for deployment</Text>
                    <SimpleGrid columns={2} w='full'>
                      <Box textAlign='start'>Owned</Box>
                      <Box textAlign='end'>{commify(rdContext.user.season.troops.available.owned)}</Box>
                      {rdContext.user.faction && (
                        <>
                          <Box textAlign='start'>Delegated</Box>
                          <Box textAlign='end'>{commify(rdContext.user.season.troops.delegate.total)}</Box>
                        </>
                      )}
                    </SimpleGrid>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem bgColor='#564D4A' rounded='md' mt={2}>
                  <Flex w='100%' ps={4}>
                    <Box flex='1' textAlign='left' my='auto'>Delegations</Box>
                    <Box ms={2} my='auto' fontWeight='bold'>{commify(rdContext.user.season.troops.delegate.total)}</Box>
                    <AccordionButton w='auto'>
                      <AccordionIcon />
                    </AccordionButton>
                  </Flex>
                  <AccordionPanel pb={1} pt={0} fontSize='sm'>
                    {rdContext.user.faction ? (
                      <>
                        <Text color='#ccc' textAlign='start' pb={2}>Troops received from users</Text>
                        {(rdContext.user.season.troops as RdUserContextOwnerFactionTroops).delegate.users.length > 0 ? (
                          <SimpleGrid columns={2} w='full'>
                            {(rdContext.user.season.troops as RdUserContextOwnerFactionTroops).delegate.users.map((user) => (
                              <>
                                <Box textAlign='start'>{isAddress(user.profileName) ? shortAddress(user.profileName) : user.profileName}</Box>
                                <Box textAlign='end'>{commify(user.troops)}</Box>
                              </>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <>None</>
                        )}
                      </>
                    ) : (
                      <>
                        <Text color='#ccc' textAlign='start' pb={2}>Troops delegated to factions</Text>
                        {(rdContext.user.season.troops as RdUserContextNoOwnerFactionTroops).delegate.factions.length > 0 ? (
                          <SimpleGrid columns={2} w='full'>
                            {(rdContext.user.season.troops as RdUserContextNoOwnerFactionTroops).delegate.factions.map((faction) => (
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
                  <Flex w='100%' ps={4}>
                    <Box flex='1' textAlign='left' my='auto'>Deployments</Box>
                    <Box ms={2} my='auto' fontWeight='bold'>{commify(rdContext.user.season.troops.deployed.total)}</Box>
                    <AccordionButton w='auto'>
                      <AccordionIcon />
                    </AccordionButton>
                  </Flex>
                  <AccordionPanel pb={1} pt={0} fontSize='sm'>
                    <Text color='#ccc' textAlign='start' pb={2}>Troops deployed to control points</Text>
                    {rdContext.user.faction ? (
                      <>
                        {(rdContext.user.season.troops as RdUserContextOwnerFactionTroops).deployed.users.length > 0 ? (
                          <Accordion allowMultiple>
                            {(rdContext.user.season.troops as RdUserContextOwnerFactionTroops).deployed.users.map((user) => (
                              <AccordionItem bgColor='#564D4A' rounded='md'>
                                <Flex w='100%' ps={4}>
                                  <Box flex='1' textAlign='left' my='auto'>{isAddress(user.profileName) ? shortAddress(user.profileName) : user.profileName}</Box>
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
                        {(rdContext.user.season.troops as RdUserContextNoOwnerFactionTroops).deployed.factions.length > 0 ? (
                          <Accordion allowMultiple>
                            {(rdContext.user.season.troops as RdUserContextNoOwnerFactionTroops).deployed.factions.map((faction) => (
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
                  <Flex w='100%' ps={4}>
                    <Box flex='1' textAlign='left' my='auto'>Slain</Box>
                    <Box ms={2} my='auto' fontWeight='bold'>{commify(rdContext.user.season.troops.slain.total)}</Box>
                    <AccordionButton w='auto'>
                      <AccordionIcon />
                    </AccordionButton>
                  </Flex>
                  <AccordionPanel pb={1} pt={0} fontSize='sm'>
                    <Text color='#ccc' textAlign='start' pb={2}>Troops defeated in battle</Text>
                    {rdContext.user.faction ? (
                      <>
                        {(rdContext.user.season.troops as RdUserContextOwnerFactionTroops).slain.users.length > 0 ? (
                          <Accordion allowMultiple>
                            {(rdContext.user.season.troops as RdUserContextOwnerFactionTroops).slain.users.map((user) => (
                              <AccordionItem bgColor='#564D4A' rounded='md'>
                                <Flex w='100%' ps={4}>
                                  <Box flex='1' textAlign='left' my='auto'>{isAddress(user.profileName) ? shortAddress(user.profileName) : user.profileName}</Box>
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
                        {(rdContext.user.season.troops as RdUserContextNoOwnerFactionTroops).slain.factions.length > 0 ? (
                          <Accordion allowMultiple>
                            {(rdContext.user.season.troops as RdUserContextNoOwnerFactionTroops).slain.factions.map((faction) => (
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
            </>
          )}
        </>
      )}

      {!!rdContext.user && (
        <>
          {!!rdContext.user.faction ? (
            <EditFactionForm isOpen={isOpenFaction} onClose={onCloseFaction} faction={rdContext.user.faction} handleClose={handleActionComplete} isRegistered={!!rdContext.user.season.faction} />
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