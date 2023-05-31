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
import React, {useState} from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {
  addTroops,
  getAllFactions,
  getFactionsOwned,
  getFactionsRegistered,
  getFactionUndeployedArmies,
  getProfileArmies
} from "@src/core/api/RyoshiDynastiesAPICalls";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {RdArmy, RdFaction} from "@src/core/services/api-service/types";
import EditFactionForm from "@src/Components/BattleBay/Areas/FactionForm";
import CreateFactionForm from "@src/Components/BattleBay/Areas/FactionRegistrationForm";
import DelegateForm from "@src/Components/BattleBay/Areas/DelegateForm";
import {Contract} from "ethers";
import AllianceCenterContract from "@src/Contracts/AllianceCenterContract.json";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@src/utils";

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
      border='2px solid #FFD700'
      backgroundColor='#292626'
      flexDirection='column'
      textAlign='center'
      borderRadius={'10px'}
      justifyContent='space-around'
      padding={4}
      minW={{base: '100%', xl: '450px' }}
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
  const queryClient = useQueryClient();

  const { isOpen: isOpenFaction, onOpen: onOpenFaction, onClose: onCloseFaction } = useDisclosure();
  const { isOpen: isOpenCreateFaction, onOpen: onOpenCreateFaction, onClose: onCloseCreateFaction } = useDisclosure();
  const { isOpen: isOpenDelegate, onOpen: onOpenDelegate, onClose: onCloseDelegate } = useDisclosure();

  const [isExecutingRegister, setIsExecutingRegister] = useState(false);

  const getUserOwnedFaction = async (): Promise<FactionData> => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      const response = await getFactionsOwned(user.address!.toLowerCase(), signatureInStorage);
      console.log('RES', response);
      // if (response.data.data.length) {
      const faction = response.data.data[0];
      const factionRegisteredData = await getFactionsRegistered(user.address!.toLowerCase(), signatureInStorage);
      const factionTroopsData = await getFactionUndeployedArmies(user.address!.toLowerCase(), signatureInStorage);
      const profileArmies = await getProfileArmies(user.address!.toLowerCase(), signatureInStorage);
      const factionResponse = await getAllFactions();

      return {
        faction,
        registration: factionRegisteredData.data.data[0] ?? null,
        factionTroops: factionTroopsData,
        walletTroops: profileArmies.data.data.reduce((p: number, n: RdArmy) => p + (n.troops ?? 0), 0),
        allFactions: factionResponse
      }
      // }
      // return response.data.data.length > 0 ? response.data.data[0] : null;
    }

    return {
      faction: null,
      registration: null,
      factionTroops: 0,
      walletTroops: 0,
      allFactions: []
    }
  }

  const {data: factionData, status, error} = useQuery({
    queryKey: ['GetFactionData', user.address],
    queryFn: getUserOwnedFaction,
    enabled: !!user.address,
  });

  console.log('data', factionData);

  const handleActionComplete = ()=> {
    onCloseFaction();
    onCloseCreateFaction();
    onCloseDelegate();
    queryClient.invalidateQueries(['GetFactionData', user.address]);
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
        await queryClient.invalidateQueries(['GetFactionData', user.address]);
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleRegister = async () => {
    if (!user.address) return;

    if(!!factionData?.registration) {
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
          const registerFactionContract = new Contract(config.contracts.allianceCenter, AllianceCenterContract, user.provider.getSigner());
          const tx = await registerFactionContract.registerFaction(user.address.toLowerCase())
          const receipt = await tx.wait();
          toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        }
      } catch (error: any) {
        console.log(error);
        if (error.data) {
          toast.error(error.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('Unknown Error');
        }
      } finally {
        setIsExecutingRegister(false);
      }
    }
  }

  return (
    <Box mt={4}>
      {status === 'loading' ? (
        <Box padding={6}>
          <Center><SkeletonCircle size='20' startColor='#ccc' /></Center>
          <SkeletonText mt='4' noOfLines={2} spacing='4' skeletonHeight='2' startColor='#ccc' />
        </Box>
      ) : status === 'error' ? (
        <Center>
          <Text>{(error as any).message}</Text>
        </Center>
      ) : !!factionData?.faction ? (
        <VStack>
          <Image
            src={factionData.faction.image}
            w='150px'
            rounded='lg'
          />
          <Stack direction='row' align='center'>
            <Text fontSize='lg' fontWeight='bold'>{factionData.faction.name}</Text>
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
                <Text fontSize='lg' fontWeight='bold'>{!!factionData.registration ? 'Registered' : 'Unregistered'}</Text>
              </VStack>
              {!factionData.registration && (
                <RdButton
                  hideIcon={true}
                  fontSize='lg'
                  onClick={onOpenCreateFaction}
                  isLoading={isExecutingRegister}
                  isDisabled={isExecutingRegister}
                >
                  Register
                </RdButton>
              )}
            </SimpleGrid>
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

      <Box bg='#564D4A' p={2} rounded='lg' w='full' mt={2}>
        <SimpleGrid columns={2}>
          <VStack align='start' spacing={0} my='auto'>
            <Text fontSize='sm'>Available Troops</Text>
            <HStack>
              <Text fontSize='lg' fontWeight='bold'>{factionData?.walletTroops}</Text>
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
            <Text fontSize='lg' fontWeight='bold'>{factionData?.factionTroops}</Text>
          </VStack>
          {!!factionData?.walletTroops && (
            <RdButton hideIcon={true} fontSize='lg' onClick={onOpenDelegate} maxH='50px'>
              Delegate
            </RdButton>
          )}
        </SimpleGrid>
      </Box>

      {!!factionData && (
        <>
          {!!factionData.faction ? (
            <EditFactionForm isOpen={isOpenFaction} onClose={onCloseFaction} faction={factionData.faction} handleClose={handleActionComplete} isRegistered={!!factionData.registration} />
          ) : (
            <CreateFactionForm isOpen={isOpenCreateFaction} onClose={onCloseCreateFaction} handleClose={handleActionComplete} />
          )}
          <DelegateForm isOpen={isOpenDelegate} onClose={onCloseDelegate} delegateMode='delegate' factions={factionData.allFactions} troops={factionData.factionTroops} setTotalTroops={factionData.walletTroops}/>
        </>
      )}

    </Box>
  );
}