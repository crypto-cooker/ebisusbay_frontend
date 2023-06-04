import React, {useCallback, useEffect, useState} from "react";

import Barracks from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks";
import BattleMap from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map";
import AllianceCenter from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/inline";
// import AnnouncementBoard from "@src/Components/BattleBay/Areas/AnnouncementBoard";
import Academy from "@src/Components/BattleBay/Areas/Academy";
import UserPage from "@src/Components/BattleBay/Areas/UserPage";
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

const RyoshiDynasties = ({initialRdConfig}: {initialRdConfig: RyoshiConfig | null}) => {
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
      initialData: initialRdConfig,
      staleTime: 1000 * 60 * 25,
      cacheTime: 1000 * 60 * 30,
    }
  );

  const { data: rdUserContext, refetch: refetchUserContext} = useQuery(
    ['RyoshiDynastiesUserContext', user.address],
    async () => {
      if (signature) {
        return await ApiService.withoutKey().ryoshiDynasties.getUserContext(user.address!, signature)
      }
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!user.address && !!signature,
    }
  );

  const { data: rdGameContext, refetch: refetchGameContext} = useQuery(
    ['RyoshiDynastiesGameContext', user.address],
    () => ApiService.withoutKey().ryoshiDynasties.getGameContext(),
    {
      refetchOnWindowFocus: false
    }
  );
  const navigate = (page: string) => {
    setPreviousPage(currentPage)
    setCurrentPage(page)
  };

  const returnToPreviousPage = () => {
    setCurrentPage(previousPage)
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
    if (!authInitFinished || (!!user.address && !user.loadedFortuneBalance && !user.loadedMitamaBalance)) {
      return;
    }

    if (!!user.address && (user.fortuneBalance > 0 || user.mitamaBalance > 0)) {
      onCloseWelcomeModal();
    } else {
      router.push('/');
    }
  }, [user.address, user.fortuneBalance, user.mitamaBalance, user.loadedMitamaBalance, user.loadedFortuneBalance]);

  useEffect(() => {
    if (!user.address || (user.fortuneBalance === 0 && user.mitamaBalance === 0)) {
      onOpenWelcomeModal();
    }
  }, [user.address, user.loadedFortuneBalance, user.loadedMitamaBalance]);

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

  return (
    <>
      {(rdConfigFetchStatus === "error" || rdConfigFetchStatus === "loading") ? (
        <>
          <Village onChange={navigate} />
          {rdConfigFetchStatus === "loading" ? (
            <RdModal isOpen={true} title='Initializing Game...'>
              <Center>
                <Box p={8}>
                  <Spinner />
                </Box>
              </Center>
            </RdModal>
          ) : (
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
          )}
        </>
      ) : (
        <RyoshiDynastiesContext.Provider
          value={{
            config: rdConfig!,
            user: rdUserContext,
            refreshUser: refreshUserContext,
            game: rdGameContext,
            refreshGame: refreshGameContext
          }}
        >
          {currentPage === 'barracks' ? (
            <Barracks onBack={returnToPreviousPage} />
          ) : currentPage === 'battleMap' ? (
            // <Suspense fallback={<Center><Spinner/></Center>}>
            <BattleMap onChange={returnToPreviousPage}/>
            // </Suspense>
            // ) : currentPage === 'leaderboard' ? (
            //   <Leaderboard onBack={returnToPreviousPage}/>
          ): currentPage === 'bank' ? (
            <Bank address={user.address ?? ''} onBack={returnToPreviousPage} />
          ): currentPage === 'allianceCenter' ? (
            <AllianceCenter onBack={returnToPreviousPage} />
          ): currentPage === 'academy' ? (
            <Academy onBack={returnToPreviousPage} />
            // ): currentPage === 'announcementBoard' ? (
            // <AnnouncementBoard onBack={returnToPreviousPage} />
          ): currentPage === 'userPage' ? (
            <UserPage onBack={returnToPreviousPage} />
          ): (
            <Village onChange={navigate} />
            // <BattleMap onChange={navigate} />
          )}
          <RdModal isOpen={isOpenWelcomeModal} onClose={handleCloseWelcomeModal} title='Ryoshi Dynasties Beta'>
            <VStack p={4} spacing={8} fontSize='sm' textAlign='center'>
              <Text>
                Welcome to the beta version of Ryoshi Dynasties! This is a <strong>TESTNET</strong> beta and is accessible for users with test $Fortune in their wallet, which was distributed to those who participated in the Fortune token sale.
              </Text>

              {authInitFinished ? (
                <>
                  {!!user.address && user.loadedFortuneBalance && user.loadedMitamaBalance ? (
                    <>
                      {user.fortuneBalance > 0 || user.mitamaBalance > 0 ? (
                        <>
                          <Text>
                            Please note that the beta version is still under active development which may result in unexpected changes in the gaming experience. We are working hard to get the game ready for the official launch, which is planned for June 15th. Please join our Discord server for updates and to provide feedback.
                          </Text>
                          <Center>
                            <RdButton stickyIcon={true} onClick={onCloseWelcomeModal}>
                              Play Now
                            </RdButton>
                          </Center>
                        </>
                      ) : (
                        <Box>
                          No Fortune tokens found in your wallet, which is a requirement for participating in the Beta.
                        </Box>
                      )}
                    </>
                  ) : (!!user.address && !user.correctChain) ? (
                    <Center>
                      <RdButton stickyIcon={true} onClick={connectWalletPressed}>
                        Switch Network
                      </RdButton>
                    </Center>
                  ) : (!!user.address && !user.loadedFortuneBalance && !user.loadedMitamaBalance) ? (
                    <Center>
                      <Spinner />
                    </Center>
                  ) : (
                    <Center>
                      <RdButton stickyIcon={true} onClick={connectWalletPressed}>
                        Connect
                      </RdButton>
                    </Center>
                  )}
                </>
              ) : (
                <Center>
                  <Spinner />
                </Center>
              )}
            </VStack>
          </RdModal>
        </RyoshiDynastiesContext.Provider>
      )}
    </>
  )
}


export default RyoshiDynasties;