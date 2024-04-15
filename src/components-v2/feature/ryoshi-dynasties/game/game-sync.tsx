import React, {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
// import AnnouncementBoard from "@src/Components/BattleBay/Areas/AnnouncementBoard";
// import UserPage from "@src/Components/BattleBay/Areas/UserPage";
import {useDispatch} from 'react-redux';
import Village from "@src/components-v2/feature/ryoshi-dynasties/game/areas/village";
import {useAppSelector} from "@market/state/redux/store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {Box, Center, Spinner, Text, useDisclosure, VStack} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {RyoshiDynastiesContext} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import {RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";

interface GameSyncProps {
  initialRdConfig: RyoshiConfig;
  children: ReactNode;
}
const GameSync = ({initialRdConfig, children}: GameSyncProps) => {
  const router = useRouter();
  // const user = useAppSelector((state) => state.user);
  const user = useUser();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState<string>();
  const [previousPage, setPreviousPage] = useState<string>();

  const { isOpen: isOpenWelcomeModal, onOpen: onOpenWelcomeModal, onClose: onCloseWelcomeModal } = useDisclosure();
  const { isOpen: isOpenErrorModal, onOpen: onOpenErrorModal, onClose: onCloseErrorModal } = useDisclosure();
  const authInitFinished = useAppSelector((state) => state.appInitialize.authInitFinished);

  const {signature, isSignedIn, requestSignature} = useEnforceSignature();

  const { data: rdConfig, status: rdConfigFetchStatus, error: rdFetchError} = useQuery({
    queryKey: ['RyoshiDynastiesContext'],
    queryFn: () => {
      try {
        return ApiService.withoutKey().ryoshiDynasties.getGlobalContext()
      } catch {
        return initialRdConfig;
      }
    },
    placeholderData: initialRdConfig,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 11,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const { data: rdUserContext, refetch: refetchUserContext} = useQuery({
    queryKey: ['RyoshiDynastiesUserContext', user.address, signature],
    queryFn: async () => {
      if (!!signature && !!user.address) {
        return await ApiService.withoutKey().ryoshiDynasties.getUserContext(user.address!, signature)
      }
      throw 'Please sign message in wallet to continue'
    },
    refetchOnWindowFocus: false,
    enabled: !!user.address && isSignedIn,
    refetchInterval: 1000 * 60,
  });

  const { data: rdGameContext, refetch: refetchGameContext} = useQuery({
    queryKey: ['RyoshiDynastiesGameContext', user.address],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getGameContext(),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60,
  });

  const navigate = (page: string) => {
    setPreviousPage(currentPage)
    setCurrentPage(page)
  };

  const refreshUserContext = async () => {
    queryClient.invalidateQueries({queryKey: ['RyoshiDynastiesUserContext', user.address]});
    refetchUserContext();
  }

  const refreshGameContext = async () => {
    queryClient.invalidateQueries({queryKey: ['RyoshiDynastiesGameContext']});
    refetchGameContext();
  }

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
      if (!isSignedIn) {
        try {
          await requestSignature();
        } catch  (e) {
          console.log('sig failed', e);
        }
      }
    }
    if (!!user.address && user.wallet.isConnected) {
      getSig();
    }
  }, [user.address, isSignedIn, user.wallet.isConnected]);

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
      {/*{rdConfigFetchstatus === 'pending' ? (*/}
      {/*  <>*/}
      {/*    /!*{dummyVillage}*!/*/}
      {/*    <RdModal isOpen={true} title='Initializing Game...'>*/}
      {/*      <Center>*/}
      {/*        <Box p={8}>*/}
      {/*          <Spinner />*/}
      {/*        </Box>*/}
      {/*      </Center>*/}
      {/*    </RdModal>*/}
      {/*  </>*/}
      {/*) : rdConfigFetchStatus === "error" ? (*/}
      {/*  <>*/}
      {/*    /!*{dummyVillage}*!/*/}
      {/*    <RdModal isOpen={true} title='Error'>*/}
      {/*      <Center>*/}
      {/*        <Box p={4} textAlign='center'>*/}
      {/*          <Text>*/}
      {/*            Whoops! Looks like something went wrong attempting to retrieve the latest game configuration. Please refresh the page and try again. If the issue persists, please contact support.*/}
      {/*          </Text>*/}
      {/*          <Text mt={8} fontSize='xs'>*/}
      {/*            Error: {(rdFetchError as any).message}*/}
      {/*          </Text>*/}
      {/*        </Box>*/}
      {/*      </Center>*/}
      {/*    </RdModal>*/}
      {/*  </>*/}
      {/*) : */}

      {!!rdConfig ? (
        <RyoshiDynastiesContext.Provider
          value={{
            config: rdConfig ?? initialRdConfig,
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
                  <AuthenticationRdButton>
                    <Center>
                      <RdButton stickyIcon={true} onClick={onCloseWelcomeModal}>
                        Play Now
                      </RdButton>
                    </Center>
                  </AuthenticationRdButton>
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