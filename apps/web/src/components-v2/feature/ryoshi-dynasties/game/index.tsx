import React, {useEffect, useRef, useState} from "react";

import BattleMap from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map";
import Academy from "@src/components-v2/feature/ryoshi-dynasties/game/areas/academy";
import Bank from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank";
import Village from "@src/components-v2/feature/ryoshi-dynasties/game/areas/village";
import {useAppSelector} from "@market/state/redux/store/hooks";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import GameSync from "@src/components-v2/feature/ryoshi-dynasties/game/game-sync";
import ImagePreloader from "@src/components-v2/feature/ryoshi-dynasties/game/image-preloader";
import {InlineModalContext} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/inline-modal-context";
import {Box, useBreakpointValue} from "@chakra-ui/react";
import DynastiesLands from "./areas/lands";
import {MapProps} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map";

import AllianceCenter from "@src/components-v2/feature/ryoshi-dynasties/game/areas/alliance-center";
import Barracks from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks";
import PortalModal from "@src/components-v2/feature/ryoshi-dynasties/game/areas/portal";
import FishMarketModal from "@src/components-v2/feature/ryoshi-dynasties/game/areas/fish-market";
import Tavern from "@src/components-v2/feature/ryoshi-dynasties/game/areas/tavern";
import TownHall from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall";
import {useUser} from "@src/components-v2/useUser";

const DEFAULT_SCENE = 'village';

const RyoshiDynasties = ({initialRdConfig, initialScene}: {initialRdConfig: RyoshiConfig, initialScene?: string}) => {
  const user = useUser();

  const [currentPage, setCurrentPage] = useState<string>(initialScene ?? DEFAULT_SCENE);
  const [previousPage, setPreviousPage] = useState<string>();
  const [firstRun, setFirstRun] = useState<boolean>(false);
  const [currentModalRef, setCurrentModalRef] = useState<React.RefObject<HTMLDivElement> | null>(null);
  const ref = useRef(null);

  const navigate = (page: string) => {
    setPreviousPage(currentPage)
    setCurrentPage(page)
  };

  const returnToPreviousPage = () => {
    setCurrentPage(previousPage ?? DEFAULT_SCENE)
  };

  useEffect(() => {
    setCurrentModalRef(ref);
  }, [ref]);

  // Query param fetch can  be delayed so it needs to be an effect instead of initializer
  useEffect(() => {
    if (initialScene) {
      setCurrentPage(initialScene ?? DEFAULT_SCENE)
    }
  }, [initialScene]);


  const mapProps = useBreakpointValue<MapProps>(
    {
      base: {
        scale: 0.40,
        initialPosition: { x: -400, y: -127 },
        minScale: 0.15
      },
      sm: {
        scale: 0.41,
        initialPosition: { x: -335, y: -113 },
        minScale: 0.2
      },
      md: {
        scale: 0.42,
        initialPosition: { x: -185, y: -163 },
        minScale: 0.3
      },
      lg: {
        scale: 0.43,
        initialPosition: { x: 281, y: -33 },
        minScale: 0.45
      },
      xl: {
        scale: 0.44,
        initialPosition: { x: 0.78, y: -123 },
        minScale: 0.44
      },
      '2xl': {
        scale: 0.45,
        initialPosition: { x: 268, y: -33 },
        minScale: 0.45
      },
      xxl: { //doesnt apply to any screen larger than 1920px
        scale: 1.0,
        initialPosition: { x: -20, y: -35 },
        minScale: 1.1
      }
    }
  );

  return (
    <InlineModalContext.Provider
      value={{
        ref: currentModalRef,
        setRef: setCurrentModalRef
      }}
    >
      <GameSync initialRdConfig={initialRdConfig}>
        <ImagePreloader>
          <Box ref={currentModalRef} position='relative'>
            {currentPage === 'barracks' ? (
              <Barracks onBack={returnToPreviousPage} />
            ) : (currentPage === 'battleMap' || currentPage === 'battle-map') ? (
              // <Suspense fallback={<Center><Spinner/></Center>}>
              <BattleMap 
                onChange={returnToPreviousPage} 
                showFullBattlePage={true} 
                mapProps={mapProps} 
                height={'calc(100vh - 74px)'} 
                useCurrentGameId={true}
                blockDeployments={false}
              />
              // </Suspense>
              // ) : currentPage === 'leaderboard' ? (
              //   <Leaderboard onBack={returnToPreviousPage}/>
            ) : currentPage === 'bank' ? (
              <Bank address={user.address ?? ''} onBack={returnToPreviousPage} />
            ) : currentPage === 'alliance-center' ? (
              <AllianceCenter onBack={returnToPreviousPage} />
            ) : currentPage === 'academy' ? (
              <Academy onBack={returnToPreviousPage} />
            ) : currentPage === 'market' ? (
              <FishMarketModal onBack={returnToPreviousPage} />
            ) : currentPage === 'moongate' ? (
              <PortalModal onBack={returnToPreviousPage} />
            ) : currentPage === 'lands' ? (
              <DynastiesLands onBack={returnToPreviousPage} showBackButton={true}/>
              // ): currentPage === 'announcementBoard' ? (
              // <AnnouncementBoard onBack={returnToPreviousPage} />
            ) : currentPage === 'tavern' ? (
              <Tavern onBack={returnToPreviousPage} />
            ) : currentPage === 'townHall' ? (
              <TownHall onBack={returnToPreviousPage} />
            ) : (!currentPage || currentPage === 'village') && (
              <Village onChange={navigate} firstRun={firstRun} onFirstRun={() => setFirstRun(true)}/>
              // <BattleMap onChange={navigate} />
            )}
          </Box>
        </ImagePreloader>
      </GameSync>
    </InlineModalContext.Provider>
  )
}

export default RyoshiDynasties;