import React, {useState} from "react";

import Barracks from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks";
import BattleMap from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map";
import AllianceCenter from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center/inline";
// import AnnouncementBoard from "@src/Components/BattleBay/Areas/AnnouncementBoard";
import Academy from "@src/components-v2/feature/ryoshi-dynasties/game/areas/academy";
// import UserPage from "@src/Components/BattleBay/Areas/UserPage";
import Bank from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank";
import Village from "@src/components-v2/feature/ryoshi-dynasties/game/areas/village";
import {useAppSelector} from "@src/Store/hooks";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import GameSync from "@src/components-v2/feature/ryoshi-dynasties/game/game-sync";
import ImagePreloader from "@src/components-v2/feature/ryoshi-dynasties/game/image-preloader";

const RyoshiDynasties = ({initialRdConfig}: {initialRdConfig: RyoshiConfig | null}) => {
  const user = useAppSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState<string>('village');
  const [previousPage, setPreviousPage] = useState<string>();
  const [firstRun, setFirstRun] = useState<boolean>(false);

  const navigate = (page: string) => {
    setPreviousPage(currentPage)
    setCurrentPage(page)
  };

  const returnToPreviousPage = () => {
    setCurrentPage(previousPage ?? 'village')
  };

  return (
    <GameSync initialRdConfig={initialRdConfig}>
      <ImagePreloader>
        {currentPage === 'barracks' ? (
          <Barracks onBack={returnToPreviousPage} />
        ) : currentPage === 'battleMap' ? (
          // <Suspense fallback={<Center><Spinner/></Center>}>
          <BattleMap onChange={returnToPreviousPage}/>
          // </Suspense>
          // ) : currentPage === 'leaderboard' ? (
          //   <Leaderboard onBack={returnToPreviousPage}/>
        ) : currentPage === 'bank' ? (
          <Bank address={user.address ?? ''} onBack={returnToPreviousPage} />
        ) : currentPage === 'allianceCenter' ? (
          <AllianceCenter onClose={returnToPreviousPage} />
        ) : currentPage === 'academy' ? (
          <Academy onBack={returnToPreviousPage} />
          // ): currentPage === 'announcementBoard' ? (
          // <AnnouncementBoard onBack={returnToPreviousPage} />
        ) : (!currentPage || currentPage === 'village') && (
          <Village onChange={navigate} firstRun={firstRun} onFirstRun={() => setFirstRun(true)}/>
          // <BattleMap onChange={navigate} />
        )}
      </ImagePreloader>
    </GameSync>
  )
}


export default RyoshiDynasties;