import PageHead from "@src/components-v2/shared/layout/page-head";
import React, {useCallback, useEffect, useState} from "react";

import Barracks from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks";
import BattleMap from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battleMap";
import AllianceCenter from "@src/Components/BattleBay/Areas/AllianceCenter";
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

const BattleBay = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<string>();
  const [previousPage, setPreviousPage] = useState<string>();
  const user = useAppSelector((state) => state.user);
  const { isOpen: isOpenGateModal, onOpen: onOpenGateModal, onClose: onCloseGateModal } = useDisclosure();
  const authInitFinished = useAppSelector((state) => state.appInitialize.authInitFinished);

  const navigate = (page: string) => {
    setPreviousPage(currentPage)
    setCurrentPage(page)
  };
  const returnToPreviousPage = () => {
    setCurrentPage(previousPage)
  };

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

  const handleCloseGateModal = useCallback(() => {
    if (!user.address || !(user.fortuneBalance > 0)) {
      router.push('/');
    } else {
      onCloseGateModal();
    }
  }, [user.address, user.fortuneBalance, user.loadedFortuneBalance]);

  useEffect(() => {
    if (!user.address || !(user.fortuneBalance > 0)) {
      onOpenGateModal();
    }

    // else {
    //   onCloseGateModal();
    // }
  }, [user.address, user.loadedFortuneBalance]);

  return (
    <>
      <PageHead
        title="Ryoshi Dynasties"
        description="some description.."
        url={`/battle-bay`}
      />
      {currentPage === 'barracks' ? (
        <Barracks onBack={returnToPreviousPage} />
      ) : currentPage === 'battleMap' ? (
        <BattleMap onChange={returnToPreviousPage}/>
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
      <RdModal isOpen={isOpenGateModal} onClose={handleCloseGateModal} title='Ryoshi Dynasties Beta'>
        <VStack p={4} spacing={8} fontSize='sm' textAlign='center'>
          <Text align='center'>
            Welcome to the beta version of Ryoshi Dynasties! The beta is accessible for users with test $Fortune in their wallet, which was distributed to those who participated in the Fortune token sale.
          </Text>

          {authInitFinished ? (
            <>
              {!!user.address && user.loadedFortuneBalance ? (
                <>
                  {user.fortuneBalance > 0 ? (
                    <>
                      <Text>
                        Please note that the beta version is still under active development which may result in unexpected changes in the gaming experience. We are working hard to get the game ready for the official launch, which is planned for June 15th. Please join our Discord server for updates and to provide feedback.
                      </Text>
                      <Center>
                        <RdButton stickyIcon={true} onClick={onCloseGateModal}>
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
              ) : (!!user.address && !user.loadedFortuneBalance) ? (
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
            <Center>s
              <Spinner />
            </Center>
          )}
        </VStack>
      </RdModal>
    </>
  )
}


export default BattleBay;