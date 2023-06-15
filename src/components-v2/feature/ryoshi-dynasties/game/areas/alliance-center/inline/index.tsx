import {appConfig, isLocalEnv} from "@src/Config";
import {useAppSelector} from "@src/Store/hooks";
import {
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
import {AddIcon, ArrowBackIcon, EditIcon} from "@chakra-ui/icons";
import localFont from "next/font/local";
import RdButton from "../../../../components/rd-button";
import React, {useContext, useEffect, useState} from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import {useQuery} from "@tanstack/react-query";
import {addTroops, getAllFactions,getRegistrationCost } from "@src/core/api/RyoshiDynastiesAPICalls";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {RdFaction} from "@src/core/services/api-service/types";
import EditFactionForm from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/edit-faction";
import CreateFactionForm from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/create-faction";
import DelegateTroopsForm from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/delegate-troops";
import AllianceCenterContract from "@src/Contracts/AllianceCenterContract.json";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {useFormik} from 'formik';
import FactionPfp from '../../../../../../../Components/BattleBay/Areas/FactionIconUpload';

import {BigNumber, Contract, ethers} from "ethers";
import Fortune from "@src/Contracts/Fortune.json";
import {ApiService} from "@src/core/services/api-service";

const config = appConfig();
const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

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


type FactionData = {
  faction: RdFaction | null;
  registration: RdFaction | null;
  factionTroops: number;
  walletTroops: number;
  allFactions: RdFaction[];
}

const CurrentFaction = () => {
  const user = useAppSelector((state) => state.user);
  const [_, getSigner] = useCreateSigner();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const { isOpen: isOpenFaction, onOpen: onOpenFaction, onClose: onCloseFaction } = useDisclosure();
  const { isOpen: isOpenCreateFaction, onOpen: onOpenCreateFaction, onClose: onCloseCreateFaction } = useDisclosure();
  const { isOpen: isOpenDelegate, onOpen: onOpenDelegate, onClose: onCloseDelegate } = useDisclosure();

  const [isExecutingRegister, setIsExecutingRegister] = useState(false);
  const [totalTroops, setTotalTroops] = useState(rdContext.user?.season.troops.undeployed ?? 0);
  const {data: allFactions, status, error} = useQuery({
    queryKey: ['GetAllFactions'],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getFactions(),
    enabled: !!user.address,
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
        // if (error.message) {
        //   toast.error(error.message);
        // } else 
        if (error.data) {
          toast.error(error.data.message);
        } else  {
          toast.error('Already processed a registration for this season ');
        }
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
  const handleTJUploadSuccess = (e: any) => {
    // GetFactions();
    console.log(e);
    rdContext.refreshUser();
  }

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
              <Image
                src={rdContext.user?.faction.image}
                w='150px'
                rounded='lg'
                
              />
              {/* <form onSubmit={handleSubmit} >
               <FactionPfp 
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleSubmit}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  handleBlur={handleBlur}
                  faction={rdContext.user.faction}
                  onSuccess={handleTJUploadSuccess}
                />
                </form> */}
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
                    <Text>Regular Cost: {rdContext.config.factions.registration.cost}</Text>
                    <Text >Presale Users: Free for first 3 seasons</Text>
                  </Box>
                )}
              </Box>
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
            <Box bg='#564D4A' p={2} rounded='lg' w='full' mt={2}>
              <SimpleGrid columns={2}>
                <VStack align='start' spacing={0} my='auto'>
                  <Text fontSize='sm'>Available Troops</Text>
                  <HStack>
                    <Text fontSize='lg' fontWeight='bold'>{totalTroops}</Text>
                    {isLocalEnv() && (
                      <IconButton
                        aria-label='Add Troops'
                        icon={<AddIcon />}
                        variant='outline'
                        color={'#FFD700'}
                        size='sm'
                        onClick={handleAddTroops}
                      />
                    )}
                  </HStack>
                  <Text fontSize='sm' pt={4}>Faction Troops</Text>
                  <Text fontSize='lg' fontWeight='bold'>{rdContext.user.season.troops.deployed}</Text>
                </VStack>
                {!!rdContext.user.season.troops.undeployed && !rdContext.user.season.faction && (
                  <RdButton hoverIcon={false} onClick={onOpenDelegate} maxH='50px'>
                    Delegate
                  </RdButton>
                )}
              </SimpleGrid>
            </Box>
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
          <DelegateTroopsForm isOpen={isOpenDelegate} onClose={onCloseDelegate} delegateMode='delegate' factions={allFactions ?? []} troops={rdContext.user.season.troops.deployed} setTotalTroops={setTotalTroops}/>
        </>
      )}

    </Box>
  );
}