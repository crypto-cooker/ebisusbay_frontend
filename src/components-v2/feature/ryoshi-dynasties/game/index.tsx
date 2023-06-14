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
import GameSync from "@src/components-v2/feature/ryoshi-dynasties/game/game-sync";

const RyoshiDynasties = ({initialRdConfig}: {initialRdConfig: RyoshiConfig | null}) => {
  const user = useAppSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState<string>();
  const [previousPage, setPreviousPage] = useState<string>();

  const navigate = (page: string) => {
    setPreviousPage(currentPage)
    setCurrentPage(page)
  };

  const returnToPreviousPage = () => {
    setCurrentPage(previousPage)
  };

  return (
    <GameSync initialRdConfig={initialRdConfig}>
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
        <AllianceCenter onClose={returnToPreviousPage} />
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
    </GameSync>
  )
}


export default RyoshiDynasties;