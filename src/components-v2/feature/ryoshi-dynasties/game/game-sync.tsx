import React, {ReactNode, useCallback, useEffect, useMemo, useState} from "react";

import Barracks from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks";
import BattleMap from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map";
import AllianceCenter from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/inline";
// import AnnouncementBoard from "@src/Components/BattleBay/Areas/AnnouncementBoard";
import Academy from "@src/components-v2/feature/ryoshi-dynasties/game/areas/academy";
// import UserPage from "@src/Components/BattleBay/Areas/UserPage";
import {useDispatch} from 'react-redux';
import Bank from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank";
import Village from "@src/components-v2/feature/ryoshi-dynasties/game/areas/village";
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {Box, Center, Spinner, Text, useDisclosure, VStack} from "@chakra-ui/react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useRouter} from "next/router";
import {RyoshiDynastiesContext} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {io} from "socket.io-client";
import {appConfig} from "@src/Config";

const config = appConfig();

interface GameSyncProps {
  initialRdConfig: RyoshiConfig | null;
  children: ReactNode;
}
const GameSync = ({initialRdConfig, children}: GameSyncProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState<string>();
  const [previousPage, setPreviousPage] = useState<string>();

  const { isOpen: isOpenWelcomeModal, onOpen: onOpenWelcomeModal, onClose: onCloseWelcomeModal } = useDisclosure();
  const { isOpen: isOpenErrorModal, onOpen: onOpenErrorModal, onClose: onCloseErrorModal } = useDisclosure();
  const authInitFinished = useAppSelector((state) => state.appInitialize.authInitFinished);

  const [_, getSigner] = useCreateSigner();
  const [signature, setSignature] = useState<string | null>(null);

  const { data: rdConfig, status: rdConfigFetchStatus, error: rdFetchError} = useQuery(
    ['RyoshiDynastiesContext'],
    () => ApiService.withoutKey().ryoshiDynasties.getGlobalContext(),
    {
      initialData: initialRdConfig ?? undefined,
      // staleTime: 1000 * 60 * 25,
      // cacheTime: 1000 * 60 * 30,
      refetchInterval: 1000 * 60,
      refetchOnWindowFocus: false,
    }
  );

  const { data: rdUserContext, refetch: refetchUserContext} = useQuery(
    ['RyoshiDynastiesUserContext', user.address],
    async () => {
      if (signature) {
        return await ApiService.withoutKey().ryoshiDynasties.getUserContext(user.address!, signature)
      }
      throw 'Please sign message in wallet to continue'
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!user.address && !!signature,
      refetchInterval: 1000 * 60,
    }
  );

  const { data: rdGameContext, refetch: refetchGameContext} = useQuery(
    ['RyoshiDynastiesGameContext', user.address],
    () => ApiService.withoutKey().ryoshiDynasties.getGameContext(),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60,
    }
  );

  const navigate = (page: string) => {
    setPreviousPage(currentPage)
    setCurrentPage(page)
  };

  const refreshUserContext = async () => {
    queryClient.invalidateQueries(['RyoshiDynastiesUserContext', user.address]);
    refetchUserContext();
  }

  const refreshGameContext = async () => {
    queryClient.invalidateQueries(['RyoshiDynastiesGameContext']);
    refetchGameContext();
  }

  const connectWalletPressed = async () => {
    if (user.needsOnboard) {
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    } else if (!user.address) {
      dispatch(connectAccount());
    } else if (!user.correctChain) {
      dispatch(chainConnect());
    }
  };

  const handleCloseWelcomeModal = useCallback(() => {
    if (!authInitFinished || !!user.address) {
      return;
    }

    if (!!user.address) {
      onCloseWelcomeModal();
    } else {
      router.push('/');
    }
  }, [user.address]);

  const handleRefreshPage = () => {
    router.reload();
  }

  const dummyVillage = useMemo(() => {
    return <Village onChange={() => {}} firstRun={false} onFirstRun={() => {}}/>
  }, []);

  // useEffect(() => {
  //   if (!user.address) {
  //     onOpenWelcomeModal();
  //   }
  // }, [user.address]);

  useEffect(() => {
    async function getSig() {
      let signatureInStorage = getAuthSignerInStorage()?.signature;
      if (!signatureInStorage) {
        const { signature } = await getSigner();
        signatureInStorage = signature;
      }
      setSignature(signatureInStorage);
    }
    if (!!user.address) {
      getSig();
    } else {
      setSignature(null);
    }
  }, [user.address]);

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isInMaintenanceMode, setIsInMaintenanceMode] = useState(false);
  // useEffect(() => {
  //   if (!user.address) return;
  //
  //   // console.log('connecting to socket...');
  //   const socket = io(`${config.urls.cmsSocket}ryoshi-dynasties/games?walletAddress=${user.address}`);
  //
  //   function onConnect() {
  //     setIsSocketConnected(true);
  //     console.log('connected')
  //   }
  //
  //   function onDisconnect() {
  //     setIsSocketConnected(false);
  //     console.log('disconnected')
  //   }
  //
  //   function onGameStatusEvent(data: { gameId: number, newStatus: string }) {
  //     console.log('GAME_STATUS', data);
  //   }
  //
  //   socket.on('connect', onConnect);
  //   socket.on('disconnect', onDisconnect);
  //   socket.on('GAME_STATUS', onGameStatusEvent);
  //
  //   return () => {
  //     socket.off('connect', onConnect);
  //     socket.off('disconnect', onDisconnect);
  //     socket.off('GAME_STATUS', onGameStatusEvent);
  //   };
  // }, []);

  return (
    <>
      {rdConfigFetchStatus === "loading" ? (
        <>
          {dummyVillage}
          <RdModal isOpen={true} title='Initializing Game...'>
            <Center>
              <Box p={8}>
                <Spinner />
              </Box>
            </Center>
          </RdModal>
        </>
      ) : rdConfigFetchStatus === "error" ? (
        <>
          {dummyVillage}
          <RdModal isOpen={true} title='Error'>
            <Center>
              <Box p={4} textAlign='center'>
                <Text>
                  Whoops! Looks like something went wrong attempting to retrieve the latest game configuration. Please refresh the page and try again. If the issue persists, please contact support.
                </Text>
                <Text mt={8} fontSize='xs'>
                  Error: {(rdFetchError as any).message}
                </Text>
              </Box>
            </Center>
          </RdModal>
        </>
      ) : !!rdConfig ? (
        <RyoshiDynastiesContext.Provider
          value={{
            config: rdConfig!,
            user: rdUserContext,
            refreshUser: refreshUserContext,
            game: rdGameContext,
            refreshGame: refreshGameContext
          }}
        >
          <>{children}</>
          <RdModal isOpen={isOpenWelcomeModal} onClose={handleCloseWelcomeModal} title='Ryoshi Dynasties Beta'>
            <VStack p={4} spacing={8} fontSize='sm' textAlign='center'>
              <Text fontSize='md'>
                Welcome to Ryoshi Dynasties! A captivating gamified DAO experience, combining NFT marketplace, battles, and strategic gameplay. Build your dynasty, collect rare NFTs, and earn rewards.
              </Text>
              {authInitFinished ? (
                <>
                  {!!user.address && user.correctChain ? (
                    <>
                      <Center>
                        <RdButton stickyIcon={true} onClick={onCloseWelcomeModal}>
                          Play Now
                        </RdButton>
                      </Center>
                    </>
                  ) : (!!user.address && !user.correctChain) ? (
                    <Center>
                      <RdButton stickyIcon={true} onClick={connectWalletPressed}>
                        Switch Network
                      </RdButton>
                    </Center>
                  ) : (
                    <Center>
                      <RdButton stickyIcon={true} onClick={connectWalletPressed}>
                        Connect
                      </RdButton>
                    </Center>
                  )}
                  <Text fontSize='sm'>
                    Users wishing to visit the Ebisu's Bay marketplace experience can still do so by using the links at the top of the page.
                  </Text>
                </>
              ) : (
                <Center>
                  <Spinner />
                </Center>
              )}
            </VStack>
          </RdModal>
        </RyoshiDynastiesContext.Provider>
      ) : (
        <>
          {dummyVillage}
          <RdModal isOpen={true} title='Error'>
            <Center>
              <Box p={4} textAlign='center'>
                <Text>
                  Whoops! Looks like something went wrong attempting to retrieve the latest game configuration. Please refresh the page and try again. If the issue persists, please contact support.
                </Text>
              </Box>
            </Center>
            <RdModalFooter>
              <Center>
                <RdButton stickyIcon={true} onClick={handleRefreshPage}>
                  Refresh
                </RdButton>
              </Center>
            </RdModalFooter>
          </RdModal>
        </>
      )}
    </>
  )
}


export default GameSync;