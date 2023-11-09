import {Box, Fade, Modal, ModalContent, ModalOverlay, Text, useBreakpointValue, useDisclosure} from "@chakra-ui/react"

import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import styles from '@src/Components/BattleBay/Areas/BattleBay.module.scss';

//contracts
import DailyCheckinModal from "@src/components-v2/feature/ryoshi-dynasties/game/modals/daily-checkin";
import {useAppSelector} from "@src/Store/hooks";
import AnnouncementBoardModal from "@src/components-v2/feature/ryoshi-dynasties/game/areas/announcements/modal/inline";
import {VillageHud} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/village/hud";
import BattleLog from "@src/components-v2/feature/ryoshi-dynasties/game/modals/battle-log";
import Buildings from "@src/components-v2/feature/ryoshi-dynasties/game/modals/buildings";

import ImageService from "@src/core/services/image";
import MapFrame from "@src/components-v2/feature/ryoshi-dynasties/components/map-frame";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {RdModalAlert} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {RdGameState} from "@src/core/services/api-service/types";
import {isRdAnnouncementDismissed, persistRdAnnouncementDismissal} from "@src/helpers/storage";
import {motion} from "framer-motion";
// import FactionDirectory from "@src/components-v2/feature/ryoshi-dynasties/game/modals/xp-leaderboard";
interface VillageProps {
  onChange: (value: string) => void;
  firstRun: boolean;
  onFirstRun: () => void;
}
const Village = ({onChange, firstRun, onFirstRun}: VillageProps) => {
  const { config: rdConfig, game: rdGameContext, user: rdUser, refreshUser} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useAppSelector((state) => state.user);
  const { isOpen:isOpenOverlay, onToggle } = useDisclosure()

  const transformComponentRef = useRef<any>(null)
  const [elementToZoomTo, setElementToZoomTo] = useState("");
  const [zoomState, setZoomState] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });

  const [sizeMultiplier, setSizeMultiplier] = useState(1);
  const [initialPositionX, setInitialPositionX] = useState(-906);
  const [initialPositionY, setInitialPositionY] = useState(-414);
  const [dimensionsLoaded, setDimensionsLoaded] = useState(false);

  // const [buildingOpen, setBuildingOpen] = useState(false);

  const buildingButtonRef = useRef<any>(null)
  const announcementBoardRef = useRef<any>(null)
  const { isOpen: isOpenBuildings, onOpen: onOpenBuildings, onClose: onCloseBuildings } = useDisclosure();
  const { isOpen: isOpenAnnouncementBoard, onOpen: onOpenAnnouncementBoard, onClose: onCloseAnnouncementBoard } = useDisclosure();
  // const { isOpen: isOpenAllianceCenter, onOpen: onOpenAllianceCenter, onClose: onCloseAllianceCenter } = useDisclosure();
  const { isOpen: isOpenDailyCheckin, onOpen: onOpenDailyCheckin, onClose: onCloseDailyCheckin } = useDisclosure();
  // const [battleRewards, setBattleRewards] = useState<any[]>([]);
  const [forceRefreshBool, setForceRefreshBool] = useState(false);
  const { isOpen: isOpenBattleLog, onOpen: onOpenBattleLog, onClose: onCloseBattleLog } = useDisclosure();
  const { isOpen: isOpenXPLeaderboard, onOpen: onOpenXPLeaderboard, onClose: onCloseXPLeaderboard } = useDisclosure();
    
  const forceRefresh = () => {
    setForceRefreshBool(!forceRefreshBool);
  }

  useEffect(() => {
    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current as any;
      zoomToElement(elementToZoomTo);
    }
    // console.log("current state " + transformComponentRef?.current?.state) ;
    // transformComponentRef.current.state;
  }, [elementToZoomTo]);

  const changeCanvasState = (ReactZoomPanPinchRef: any, event: any) => {
    setZoomState({
      offsetX: ReactZoomPanPinchRef.state.positionX,
      offsetY: ReactZoomPanPinchRef.state.positionY,
      scale: ReactZoomPanPinchRef.state.scale,
    });
    // console.log(ReactZoomPanPinchRef.state.positionX, ReactZoomPanPinchRef.state.positionY, ReactZoomPanPinchRef.state.scale)
  };

  const buildings ={ "allianceCenter" : {height:438, width:554, top:'7%', left:'55%'},
    "townhall" : {height:607, width:707, top:'13.25%', left:'36.25%'},
    "academy" : {height: 792, width: 744, top: '4%', left: '74%'},
    "tavern" : {height: 573, width: 725, top: '3%', left: '14%'},
    "tavernSpin" : {height: 573, width: 725, top: '3%', left: '14%'},

    "water" : {height: 703, width: 2880, top: '32%', left: '0%'},
    "boat" : {height: 613, width: 718, top: '33%', left: '2%'},
    "ebisustatue" : {height: 542, width: 279, top: '35%', left: '40%'},
    "market" : {height: 545, width: 793, top: '36.5%', left: '55%'},
    "barracks" : {height: 579, width: 832, top: '12.5%', left: '-0.5%'},
    "swordsmen" : {height: 270, width: 383, top: '22%', left: '14%'},

    "flowers1" : {height: 251, width: 229, top: '3%', left: '14%'},
    "flowers2" : {height: 251, width: 229, top: '3%', left: '14%'},
    "flowers3" : {height: 251, width: 229, top: '3%', left: '14%'},

    "bank" : {height: 456, width: 579, top: '%', left: '33%', x: 444, y: 444, scale: 4},
    "announcement" : {height: 243, width: 206, top: '28%', left: '60%'},

    "moongate" : {height: 482, width: 443, top: '23%', left: '67%'},
    "torii" : {height: 201, width: 236, top: '6%', left: '0%'},
    "pond" : {height: 311, width: 783, top: '0%', left: '65%'},

    'alliancecenter_label' : {height: 438, width: 554, top: '0%', left: '0%'},
    'announcementboard_label' : {height: 243, width: 279, top: '28%', left: '60%'},
    'moongate_label' : {height: 482, width: 443, top: '23%', left: '67%'},
    'academy_label' : {height: 792, width: 744, top: '4%', left: '74%'},
    'tavern_label' : {height: 573, width: 725, top: '3%', left: '14%'},

    'townhall_label' : {height: 607, width: 707, top: '13%', left: '36%'},
    'barracks_label' : {height: 579, width: 832, top: '12.5%', left: '-0.5%'},
    'fishmarket_label' : {height: 545, width: 793, top: '36.5%', left: '55%'},
    'bank_label' : {height: 456, width: 579, top: '7%', left: '33%'},
  }

  const OpenAllianceCenter = () => {
    setElementToZoomTo('Alliance Center');
    DelayedOpen('Alliance Center');
  }
  const OpenBarracks = () => {
    setElementToZoomTo('Barracks');
    DelayedOpen('Barracks');
  }
  const OpenPortal = () => {
    setElementToZoomTo('Moongate');
    DelayedOpen('Moongate');
  }
  const OpenMarket = () => {
    setElementToZoomTo('Market');
    DelayedOpen('Market');
  }
  const OpenBank = () => {
    setElementToZoomTo('Bank');
    DelayedOpen('Bank');
  }
  const OpenBattleMap = () => {
    handleSceneChange('battleMap');
  }
  const OpenTavern = () => {
    setElementToZoomTo('Tavern');
    DelayedOpen('Tavern');
  }
  const OpenTownHall = () => {
    setElementToZoomTo('Town Hall');
    DelayedOpen('Town Hall');
  }

  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}
  const DelayedOpen = async (thingToOpen:string) => {
    onToggle();
    await timeout(500); //for 0.5 sec delay
    if(thingToOpen == 'Alliance Center') {
      onChange('allianceCenter')
    } else if(thingToOpen == 'Barracks') {
      onChange('barracks');
    } else if(thingToOpen == 'Moongate') {
      onChange('moongate');
    } else if(thingToOpen == 'Market') {
      onChange('market');
    } else if(thingToOpen == 'Bank') {
      onChange('bank');
    } else if(thingToOpen == 'Battle Map') {
      onChange('battleMap');
    } else if(thingToOpen == 'Tavern') {
      onChange('tavern');
    } else if(thingToOpen == 'Town Hall') {
      onChange('townHall');
    }
  }

//#region all resizing stuff

  const [allianceCenterWidth, setAllianceCenterWidth] = useState(buildings.allianceCenter.width);
  const [allianceCenterHeight, setAllianceCenterHeight] = useState(buildings.allianceCenter.height);
  const [allianceCenterTop, setAllianceCenterTop] = useState(buildings.allianceCenter.top);
  const [allianceCenterLeft, setAllianceCenterLeft] = useState(buildings.allianceCenter.left);

  const [townhallWidth, setTownhallWidth] = useState(buildings.townhall.width);
  const [townhallHeight, setTownhallHeight] = useState(buildings.townhall.height);
  const [townhallTop, setTownhallTop] = useState(buildings.townhall.top);
  const [townhallLeft, setTownhallLeft] = useState(buildings.townhall.left);

  const [tavernWidth, setTavernWidth] = useState(buildings.tavern.width);
  const [tavernHeight, setTavernHeight] = useState(buildings.tavern.height);
  const [tavernTop, setTavernTop] = useState(buildings.tavern.top);
  const [tavernLeft, setTavernLeft] = useState(buildings.tavern.left);

  const [academyWidth, setAcademyWidth] = useState(buildings.academy.width);
  const [academyHeight, setAcademyHeight] = useState(buildings.academy.height);
  const [academyTop, setAcademyTop] = useState(buildings.academy.top);
  const [academyLeft, setAcademyLeft] = useState(buildings.academy.left);

  const [tavernSpinWidth, setTavernSpinWidth] = useState(buildings.tavernSpin.width);
  const [tavernSpinHeight, setTavernSpinHeight] = useState(buildings.tavernSpin.height);
  const [tavernSpinTop, setTavernSpinTop] = useState(buildings.tavernSpin.top);
  const [tavernSpinLeft, setTavernSpinLeft] = useState(buildings.tavernSpin.left);

  const [flowers1Width, setFlowers1Width] = useState(buildings.flowers1.width);
  const [flowers1Height, setFlowers1Height] = useState(buildings.flowers1.height);
  const [flowers1Top, setFlowers1Top] = useState(buildings.flowers1.top);
  const [flowers1Left, setFlowers1Left] = useState(buildings.flowers1.left);

  const [flowers2Width, setFlowers2Width] = useState(buildings.flowers2.width);
  const [flowers2Height, setFlowers2Height] = useState(buildings.flowers2.height);
  const [flowers2Top, setFlowers2Top] = useState(buildings.flowers2.top);
  const [flowers2Left, setFlowers2Left] = useState(buildings.flowers2.left);

  const [flowers3Width, setFlowers3Width] = useState(buildings.flowers3.width);
  const [flowers3Height, setFlowers3Height] = useState(buildings.flowers3.height);
  const [flowers3Top, setFlowers3Top] = useState(buildings.flowers3.top);
  const [flowers3Left, setFlowers3Left] = useState(buildings.flowers3.left);

  const [bankWidth, setBankWidth] = useState(buildings.bank.width);
  const [bankHeight, setBankHeight] = useState(buildings.bank.height);
  const [bankTop, setBankTop] = useState(buildings.bank.top);
  const [bankLeft, setBankLeft] = useState(buildings.bank.left);

  const [announcementWidth, setAnnouncementWidth] = useState(buildings.announcement.width);
  const [announcementHeight, setAnnouncementHeight] = useState(buildings.announcement.height);
  const [announcementTop, setAnnouncementTop] = useState(buildings.announcement.top);
  const [announcementLeft, setAnnouncementLeft] = useState(buildings.announcement.left);

  const [waterWidth, setWaterWidth] = useState(buildings.water.width);
  const [waterHeight, setWaterHeight] = useState(buildings.water.height);
  const [waterTop, setWaterTop] = useState(buildings.water.top);
  const [waterLeft, setWaterLeft] = useState(buildings.water.left);

  const [barracksWidth, setBarracksWidth] = useState(buildings.barracks.width);
  const [barracksHeight, setBarracksHeight] = useState(buildings.barracks.height);
  const [barracksTop, setBarracksTop] = useState(buildings.barracks.top);
  const [barracksLeft, setBarracksLeft] = useState(buildings.barracks.left);

  const [fishmarketWidth, setFishmarketWidth] = useState(buildings.market.width);
  const [fishmarketHeight, setFishmarketHeight] = useState(buildings.market.height);
  const [fishmarketTop, setFishmarketTop] = useState(buildings.market.top);
  const [fishmarketLeft, setFishmarketLeft] = useState(buildings.market.left);

  const [boatWidth, setBoatWidth] = useState(buildings.boat.width);
  const [boatHeight, setBoatHeight] = useState(buildings.boat.height);
  const [boatTop, setBoatTop] = useState(buildings.boat.top);
  const [boatLeft, setBoatLeft] = useState(buildings.boat.left);

  const [ebisustatueWidth, setEbisustatueWidth] = useState(buildings.ebisustatue.width);
  const [ebisustatueHeight, setEbisustatueHeight] = useState(buildings.ebisustatue.height);
  const [ebisustatueTop, setEbisustatueTop] = useState(buildings.ebisustatue.top);
  const [ebisustatueLeft, setEbisustatueLeft] = useState(buildings.ebisustatue.left);

  const [swordsmenWidth, setSwordsmenWidth] = useState(buildings.swordsmen.width);
  const [swordsmenHeight, setSwordsmenHeight] = useState(buildings.swordsmen.height);
  const [swordsmenTop, setSwordsmenTop] = useState(buildings.swordsmen.top);
  const [swordsmenLeft, setSwordsmenLeft] = useState(buildings.swordsmen.left);

  const [moongateWidth, setMoongateWidth] = useState(buildings.moongate.width);
  const [moongateHeight, setMoongateHeight] = useState(buildings.moongate.height);
  const [moongateTop, setMoongateTop] = useState(buildings.moongate.top);
  const [moongateLeft, setMoongateLeft] = useState(buildings.moongate.left);

  const [toriiWidth, setToriiWidth] = useState(buildings.torii.width);
  const [toriiHeight, setToriiHeight] = useState(buildings.torii.height);
  const [toriiTop, setToriiTop] = useState(buildings.torii.top);
  const [toriiLeft, setToriiLeft] = useState(buildings.torii.left);

  const [pondWidth, setPondWidth] = useState(buildings.pond.width);
  const [pondHeight, setPondHeight] = useState(buildings.pond.height);
  const [pondTop, setPondTop] = useState(buildings.pond.top);
  const [pondLeft, setPondLeft] = useState(buildings.pond.left);

  const [alliancecenter_labelWidth, setalliancecenter_labelWidth] = useState<number | string>(buildings.alliancecenter_label.left);
  const [alliancecenter_labelHeight, setalliancecenter_labelHeight] = useState<number | string>(buildings.alliancecenter_label.top);
  const [alliancecenter_labelTop, setalliancecenter_labelTop] = useState<number | string>(buildings.alliancecenter_label.width);
  const [alliancecenter_labelLeft, setalliancecenter_labelLeft] = useState<number | string>(buildings.alliancecenter_label.height);

  const [townhall_labelWidth, settownhall_labelWidth] = useState<number | string>(buildings.townhall_label.left);
  const [townhall_labelHeight, settownhall_labelHeight] = useState<number | string>(buildings.townhall_label.top);
  const [townhall_labelTop, settownhall_labelTop] = useState<number | string>(buildings.townhall_label.width);
  const [townhall_labelLeft, settownhall_labelLeft] = useState<number | string>(buildings.townhall_label.height);

  const [tavern_labelWidth, settavern_labelWidth] = useState<number | string>(buildings.tavern_label.left);
  const [tavern_labelHeight, settavern_labelHeight] = useState<number | string>(buildings.tavern_label.top);
  const [tavern_labelTop, settavern_labelTop] = useState<number | string>(buildings.tavern_label.width);
  const [tavern_labelLeft, settavern_labelLeft] = useState<number | string>(buildings.tavern_label.height);

  const [academy_labelWidth, setacademy_labelWidth] = useState<number | string>(buildings.academy_label.left);
  const [academy_labelHeight, setacademy_labelHeight] = useState<number | string>(buildings.academy_label.top);
  const [academy_labelTop, setacademy_labelTop] = useState<number | string>(buildings.academy_label.width);
  const [academy_labelLeft, setacademy_labelLeft] = useState<number | string>(buildings.academy_label.height);

  const [announcementboard_labelWidth, setannouncementboard_labelWidth] = useState<number | string>(buildings.announcementboard_label.left);
  const [announcementboard_labelHeight, setannouncementboard_labelHeight] = useState<number | string>(buildings.announcementboard_label.top);
  const [announcementboard_labelTop, setannouncementboard_labelTop] = useState<number | string>(buildings.announcementboard_label.width);
  const [announcementboard_labelLeft, setannouncementboard_labelLeft] = useState<number | string>(buildings.announcementboard_label.height);

  const [fishmarket_labelWidth, setfishmarket_labelWidth] = useState<number | string>(buildings.fishmarket_label.left);
  const [fishmarket_labelHeight, setfishmarket_labelHeight] = useState<number | string>(buildings.fishmarket_label.top);
  const [fishmarket_labelTop, setfishmarket_labelTop] = useState<number | string>(buildings.fishmarket_label.width);
  const [fishmarket_labelLeft, setfishmarket_labelLeft] = useState<number | string>(buildings.fishmarket_label.height);

  const [moongate_labelWidth, setmoongate_labelWidth] = useState<number | string>(buildings.moongate_label.left);
  const [moongate_labelHeight, setmoongate_labelHeight] = useState<number | string>(buildings.moongate_label.top);
  const [moongate_labelTop, setmoongate_labelTop] = useState<number | string>(buildings.moongate_label.width);
  const [moongate_labelLeft, setmoongate_labelLeft] = useState<number | string>(buildings.moongate_label.height);

  const [bank_labelWidth, setbank_labelWidth] = useState<number | string>(buildings.bank_label.left);
  const [bank_labelHeight, setbank_labelHeight] = useState<number | string>(buildings.bank_label.top);
  const [bank_labelTop, setbank_labelTop] = useState<number | string>(buildings.bank_label.width);
  const [bank_labelLeft, setbank_labelLeft] = useState<number | string>(buildings.bank_label.height);

  const [barracks_labelWidth, setbarracks_labelWidth] = useState<number | string>(buildings.barracks_label.left);
  const [barracks_labelHeight, setbarracks_labelHeight] = useState<number | string>(buildings.barracks_label.top);
  const [barracks_labelTop, setbarracks_labelTop] = useState<number | string>(buildings.barracks_label.width);
  const [barracks_labelLeft, setbarracks_labelLeft] = useState<number | string>(buildings.barracks_label.height);

  const [mapInitialized, setMapInitialized] = useState(false);

//#endregion

  useEffect(() => {
    if(sizeMultiplier == 1) return;

    // resizeMap();
    setAllianceCenterWidth( buildings.allianceCenter.width * sizeMultiplier);
    setAllianceCenterHeight( buildings.allianceCenter.height * sizeMultiplier);

    setTownhallWidth( buildings.townhall.width * sizeMultiplier);
    setTownhallHeight( buildings.townhall.height * sizeMultiplier);

    setTavernWidth( buildings.tavern.width * sizeMultiplier);
    setTavernHeight( buildings.tavern.height * sizeMultiplier);

    setAcademyWidth( buildings.academy.width * sizeMultiplier);
    setAcademyHeight( buildings.academy.height * sizeMultiplier);

    setTavernSpinWidth( buildings.tavernSpin.width * sizeMultiplier);
    setTavernSpinHeight( buildings.tavernSpin.height * sizeMultiplier);

    setFlowers1Width( buildings.flowers1.width * sizeMultiplier);
    setFlowers1Height( buildings.flowers1.height * sizeMultiplier);

    setFlowers2Width( buildings.flowers2.width * sizeMultiplier);
    setFlowers2Height( buildings.flowers2.height * sizeMultiplier);

    setFlowers3Width( buildings.flowers3.width * sizeMultiplier);
    setFlowers3Height( buildings.flowers3.height * sizeMultiplier);

    setBankWidth( buildings.bank.width * sizeMultiplier);
    setBankHeight( buildings.bank.height * sizeMultiplier);

    setAnnouncementWidth( buildings.announcement.width * sizeMultiplier);
    setAnnouncementHeight( buildings.announcement.height * sizeMultiplier);

    setWaterWidth( buildings.water.width * sizeMultiplier);
    setWaterHeight( buildings.water.height * sizeMultiplier);

    setBarracksWidth( buildings.barracks.width * sizeMultiplier);
    setBarracksHeight( buildings.barracks.height * sizeMultiplier);

    setFishmarketWidth( buildings.market.width * sizeMultiplier);
    setFishmarketHeight( buildings.market.height * sizeMultiplier);

    setBoatWidth( buildings.boat.width * sizeMultiplier);
    setBoatHeight( buildings.boat.height * sizeMultiplier);

    setEbisustatueWidth( buildings.ebisustatue.width * sizeMultiplier);
    setEbisustatueHeight( buildings.ebisustatue.height * sizeMultiplier);

    setSwordsmenWidth( buildings.swordsmen.width * sizeMultiplier);
    setSwordsmenHeight( buildings.swordsmen.height * sizeMultiplier);

    setMoongateWidth( buildings.moongate.width * sizeMultiplier);
    setMoongateHeight( buildings.moongate.height * sizeMultiplier);

    setToriiWidth( buildings.torii.width * sizeMultiplier);
    setToriiHeight( buildings.torii.height * sizeMultiplier);

    setPondWidth( buildings.pond.width * sizeMultiplier);
    setPondHeight( buildings.pond.height * sizeMultiplier);

    setalliancecenter_labelWidth( buildings.alliancecenter_label.width * sizeMultiplier);
    setalliancecenter_labelHeight( buildings.alliancecenter_label.height * sizeMultiplier);

    settownhall_labelWidth( buildings.townhall_label.width * sizeMultiplier);
    settownhall_labelHeight( buildings.townhall_label.height * sizeMultiplier);

    settavern_labelWidth( buildings.tavern_label.width * sizeMultiplier);
    settavern_labelHeight( buildings.tavern_label.height * sizeMultiplier);

    setacademy_labelWidth( buildings.academy_label.width * sizeMultiplier);
    setacademy_labelHeight( buildings.academy_label.height * sizeMultiplier);

    setbank_labelWidth( buildings.bank_label.width * sizeMultiplier);
    setbank_labelHeight( buildings.bank_label.height * sizeMultiplier);

    setbarracks_labelWidth( buildings.barracks_label.width * sizeMultiplier);
    setbarracks_labelHeight( buildings.barracks_label.height * sizeMultiplier);

    setmoongate_labelWidth( buildings.moongate_label.width * sizeMultiplier);
    setmoongate_labelHeight( buildings.moongate_label.height * sizeMultiplier);

    setfishmarket_labelWidth( buildings.fishmarket_label.width * sizeMultiplier);
    setfishmarket_labelHeight( buildings.fishmarket_label.height * sizeMultiplier);

    setannouncementboard_labelWidth( buildings.announcementboard_label.width * sizeMultiplier);
    setannouncementboard_labelHeight( buildings.announcementboard_label.height * sizeMultiplier);
  }, [sizeMultiplier]);

  useEffect(() => {
    function handleResize(){
      // console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
      if (window.innerWidth < 2880) {
        setSizeMultiplier(window.innerWidth / 2880);
        // setInitialPositionX(window.innerWidth / 2);
        // setInitialPositionY(window.innerHeight / 2);
        // setZoomState({
        //   offsetX: window.innerWidth / 2,
        //   offsetY: window.innerHeight / 2,
        //   // scale: ReactZoomPanPinchRef.state.scale,
        // });
      }
    }
    window.addEventListener('resize', handleResize)
  })

  useEffect(() => {
    // resizeMap();
    setSizeMultiplier(window.innerWidth / 2880);
  }, [])

  useEffect(() => {
    if (!firstRun) {

      // Use timer to allow SEO bots to crawl the page before announcement board pops up.
      const timer = setTimeout(() => {
        if (!isRdAnnouncementDismissed()) {
          onOpenAnnouncementBoard();
          onFirstRun();
          persistRdAnnouncementDismissal();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if(!transformComponentRef?.current || !mapInitialized || !dimensionsLoaded) return;
    setElementToZoomTo('fancyMenu'); 
  }, [transformComponentRef?.current, mapInitialized, dimensionsLoaded]);
  
  const mapProps = useBreakpointValue<MapProps>(
    {
      base: {
        scale: 0.4,
        initialPosition: { x: -370, y: -22 },
        minScale: 0.15
      },
      sm: {
        scale: 0.50,
        initialPosition: { x: -439, y: -36 },
        minScale: 0.2
      },
      md: {
        scale: 0.52,
        initialPosition: { x: -317, y: -42 },
        minScale: 0.52
      },
      lg: {
        scale: 0.51,
        initialPosition: { x: -130, y: 20 },
        minScale: 0.51
      },
      xl: {
        scale: 0.55,
        initialPosition: { x: -130, y: 20 },
        minScale: 0.55
      },
      '2xl': {
        scale: 0.7,
        initialPosition: { x: -60, y: -105 },
        minScale: 0.7
      },
      xxl: { //doesnt apply to any screen larger than 1920px
        scale: 1.0,
        initialPosition: { x: -20, y: -35 },
        minScale: 1.1
      }
    }
  );

  useEffect(() => {
    setMapInitialized(true);
  }, [user.mitamaBalance]);


  useEffect(() => {
    // config.reg
    if(!rdGameContext) return;
    if(!rdUser) return;

    // console.log(rdGameContext)
    // console.log(rdUser)




    // console.log(rdConfig)
    // console.log(rdGameContext)
    // refreshUser();
    // console.log(refreshUser()) 
     
  }, [rdGameContext, rdUser, rdConfig])

  const { isOpen: isBlockingModalOpen, onOpen: onOpenBlockingModal, onClose: onCloseBlockingModal } = useDisclosure();
  const { isOpen: isResetModalOpen, onOpen: onOpenResetModal, onClose: onCloseResetModal } = useDisclosure();
  const { isOpen: isTownHallModalOpen, onOpen: onOpenTownHallModal, onClose: onCloseTownHalltModal } = useDisclosure();

  const handleSceneChange = useCallback((area: string) => {
    if (area === 'battleMap') {
      const blockableStates = [RdGameState.IN_MAINTENANCE, RdGameState.NOT_STARTED];
      if (!rdGameContext?.state || blockableStates.includes(rdGameContext?.state)) {
        onOpenBlockingModal();
        return;
      }
      const hasStopAtPassed = !!rdGameContext?.game?.stopAt && new Date > new Date(rdGameContext.game.stopAt);
      if ((!!rdGameContext?.state && rdGameContext.state === RdGameState.RESET) || hasStopAtPassed) {
        onOpenResetModal();
        return;
      }
      // console.log('not blocked');
      setElementToZoomTo('Battle Map');
      DelayedOpen('Battle Map');
    }

    if (area === 'barracks') {
      OpenBarracks();
      // onOpenBlockingModal();
      return;
    }

    
    
  }, [rdGameContext]);

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1,
      transition: {
      }
     }
  }


  return (
    <section>
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          >
      <Box
        position='relative' h='calc(100vh - 74px)'
        backgroundImage={ImageService.translate(`/img/ryoshi-dynasties/village/background-${user.theme}.png`).convert()}
        backgroundSize='cover'
      >
    
        {mapInitialized && (
          <TransformWrapper
            // limitToBounds={true}
            ref={transformComponentRef}
            onZoom={changeCanvasState}
            onPinching={changeCanvasState}
            onPinchingStop={changeCanvasState}
            onPanningStop={changeCanvasState}
            initialPositionX={mapProps?.initialPosition?.x}
            initialPositionY={mapProps?.initialPosition?.y}
            // centerOnInit={true}
            disablePadding={true}
            initialScale={mapProps?.scale}
            minScale={mapProps?.minScale}
          >
            {(utils) => (
              <React.Fragment>
                {/* <button onClick={zoomToImage}>Zoom to 1</button> */}
                {/* <Controls {...utils} /> */}
                <TransformComponent wrapperStyle={{height: '100%', width: '100%', objectFit: 'cover'}}>
                  <MapFrame gridHeight={'50px 1fr 50px'} gridWidth={'50px 1fr 50px'}>
                    <Box
                      as='img'
                      src={ImageService.translate('/img/battle-bay/mapImages/background.png').custom({width: 2880, height: 1620})}
                      maxW='none'
                      useMap="#image-map"
                      className={`${styles.mapImageArea}`}
                      id="fancyMenu"
                      onLoad={() => setDimensionsLoaded(true)}
                    />
                    <map name="image-map">
                    </map>

                    <Box id="Alliance Center" className={styles.enlarge} style={{position:"absolute", marginTop: allianceCenterTop, marginLeft: allianceCenterLeft, zIndex:"9"}}
                      // onClick={() => onChange('allianceCenter')}
                         onClick={() => OpenAllianceCenter()}
                    >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/alliancecenter_day.png').convert()} />
                      <Box className={styles.enlarge} style={{position:"absolute", marginTop: alliancecenter_labelTop, marginLeft: alliancecenter_labelLeft, zIndex:"20"}}>
                        <img src={ImageService.translate('/img/battle-bay/building_labels/alliancecenter_label.png').convert()} />
                      </Box>
                    </Box>

                    <Box id='Town Hall' className={styles.enlarge} style={{position:"absolute", marginTop: townhallTop, marginLeft: townhallLeft, zIndex:"9"}}
                      onClick={OpenTownHall}
                    >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/townhall.png').convert()} />
                    </Box>

                    <Box id='Tavern' className={styles.enlarge} style={{position:"absolute", marginTop: tavernTop, marginLeft: tavernLeft, zIndex:"9"}}
                      onClick={OpenTavern}
                    >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/tavern.png').convert()} />
                    </Box>

                    <Box  style={{position:"absolute", marginTop: academyTop, marginLeft: academyLeft, zIndex:"9"}}
                      // onClick={() => onChange('academy')}
                    >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/academy.png').convert()} />
                    </Box>

                    <Box  style={{position:"absolute", marginTop: tavernSpinTop, marginLeft: tavernSpinLeft, zIndex:"9", pointerEvents:"none"}}>
                      <img src={ImageService.translate('/img/battle-bay/mapImages/tavern_turbine.apng').convert()} />
                    </Box>

                    <Box id="Battle Map" className={styles.enlarge} style={{position:"absolute", marginTop: boatTop, marginLeft: boatLeft, zIndex:"9"}}
                         onClick={() => OpenBattleMap()}
                    >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/boat_day.apng').convert()} />
                    </Box>

                    <Box style={{position:"absolute", marginTop: ebisustatueTop, marginLeft: ebisustatueLeft, zIndex:"9"}} >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/ebisustatue.png').convert()} />
                    </Box>

                    <Box 
                      id="Market"
                      className={styles.enlarge}
                      onClick={() => OpenMarket()}
                      style={{position:"absolute", marginTop: fishmarketTop, marginLeft: fishmarketLeft, zIndex:"9"}} >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/fishmarket_day.apng').convert()}/>
                    </Box>

                    <Box style={{position:"absolute", marginTop: waterTop, marginLeft: waterLeft, zIndex:"8"}} >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/water.png').custom({width: 2880, height: 703})} />
                    </Box>

                    <Box 
                      id="Bank" 
                      className={styles.enlarge} 
                      style={{position:"absolute", marginTop: bankTop, marginLeft: bankLeft, zIndex:"8"}}
                      // onClick={() => onChange('bank')}
                      onClick={() => OpenBank()}
                    >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/bank_day.png').convert()} />
                    </Box>

                    <Box id="Announcements" className={styles.enlarge} style={{position:"absolute", marginTop: announcementTop, marginLeft: announcementLeft, zIndex:"9"}}
                         onClick={onOpenAnnouncementBoard}
                    >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/announcement.png').convert()} />
                    </Box>

                    <Box 
                      id="Barracks" 
                      className={styles.enlarge} 
                      style={{position:"absolute", marginTop: barracksTop, marginLeft: barracksLeft, zIndex:"9"}}
                      onClick={() => handleSceneChange('barracks')}
                    >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/barracks.png').convert()} />
                    </Box>

                    <Box className={styles.enlarge} style={{position:"absolute", marginTop: swordsmenTop, marginLeft: swordsmenLeft, zIndex:"9", pointerEvents:"none"}} >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/swordsmen.apng').convert()} />
                    </Box>

                    <Box id="Moongate" className={styles.enlarge} style={{position:"absolute", marginTop: moongateTop, marginLeft: moongateLeft, zIndex:"9"}}
                      onClick={() => OpenPortal()}>
                      <img src={ImageService.translate('/img/battle-bay/mapImages/moongate_day.apng').convert()} onClick={() => OpenPortal()}/>
                      {/* <div className={[styles.enlarge]} style={{position:"absolute",  zIndex:"20"}}>
                        <img src='/img/battle-bay/building_labels/moongate_label.png' /> </div> */}
                    </Box>

                    <Box 
                      id="torii"  
                      className={styles.enlarge} 
                      style={{position:"absolute", marginTop: toriiTop, marginLeft: toriiLeft, zIndex:"8"}}
                      onClick={() => onChange('lands')}
                    >
                      <img src={ImageService.translate('/img/battle-bay/mapImages/torii.png').convert()} />
                    </Box>

                    <Box style={{position:"absolute", marginTop: pondTop, marginLeft: pondLeft, zIndex:"8"}}>
                      <img src={ImageService.translate('/img/battle-bay/mapImages/pond1.apng').convert()} />
                    </Box>


                    {/* <div className={[styles.enlarge]} style={{position:"absolute", marginTop: townhall_labelTop, marginLeft: townhall_labelLeft, zIndex:"20"}}>
                      <img src='/img/battle-bay/building_labels/townhall_label.png' width={townhall_labelWidth} height={townhall_labelHeight} /> </div>

                    <div className={[styles.enlarge]} style={{position:"absolute", marginTop: tavern_labelTop, marginLeft: tavern_labelLeft, zIndex:"20"}}>
                      <img src='/img/battle-bay/building_labels/tavern_label.png' width={tavern_labelWidth} height={tavern_labelHeight} /> </div>

                    <div className={[styles.enlarge]} style={{position:"absolute", marginTop: academy_labelTop, marginLeft: academy_labelLeft, zIndex:"20"}}>
                      <img src='/img/battle-bay/building_labels/academy_label.png' width={academy_labelWidth} height={academy_labelHeight} /> </div>



                    <div className={[styles.enlarge]} style={{position:"absolute", marginTop: barracks_labelTop, marginLeft: barracks_labelLeft, zIndex:"20"}}>
                      <img src='/img/battle-bay/building_labels/barracks_label.png' width={barracks_labelWidth} height={barracks_labelHeight} /> </div>


                    <div className={[styles.enlarge]} style={{position:"absolute", marginTop: fishmarket_labelTop, marginLeft: fishmarket_labelLeft, zIndex:"20"}}>
                      <img src='/img/battle-bay/building_labels/fishmarket_label.png' width={fishmarket_labelWidth} height={fishmarket_labelHeight} /> </div>

                    <div className={[styles.enlarge]} style={{position:"absolute", marginTop: announcementboard_labelTop, marginLeft: announcementboard_labelLeft, zIndex:"20"}}>
                      <img src='/img/battle-bay/building_labels/announcementboard_label.png' width={announcementboard_labelWidth} height={announcementboard_labelHeight} /> </div> */}
                  </MapFrame>
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        )}

          <VillageHud onOpenBuildings={onOpenBuildings} onOpenDailyCheckin={onOpenDailyCheckin} 
            onOpenBattleLog={onOpenBattleLog} onOpenXPLeaderboard={onOpenXPLeaderboard} forceRefresh={forceRefreshBool} />
      </Box>

      <AnnouncementBoardModal isOpen={isOpenAnnouncementBoard} onClose={onCloseAnnouncementBoard} onOpenDailyCheckin={onOpenDailyCheckin}/>
      <DailyCheckinModal isOpen={isOpenDailyCheckin} onClose={onCloseDailyCheckin} forceRefresh={forceRefresh}/>
      <BattleLog isOpen={isOpenBattleLog} onClose={onCloseBattleLog} />
      <Buildings isOpenBuildings={isOpenBuildings} onCloseBuildings={onCloseBuildings} buildingButtonRef={buildingButtonRef} setElementToZoomTo={setElementToZoomTo}/>
      {/* <FactionDirectory isOpen={isOpenXPLeaderboard} onClose={onCloseXPLeaderboard} /> */}
      <Fade in={isOpenOverlay} 
        >
        <Modal
          onClose={() => {}}
          isOpen={isOpenOverlay}
          >
          <ModalOverlay 
          bg='rgba(0,0,0,1)'
          pointerEvents={'auto'}
          transitionDuration={'0.5s'}
          />
          <ModalContent>

          </ModalContent>
          </Modal>
        </Fade>
      
      <RdModal
        isOpen={isBlockingModalOpen}
        onClose={onCloseBlockingModal}
        title='Coming Soon'
      >
        <RdModalAlert>
          <Text>This area is currently unavailable, either due to maintenance, or a game that has yet to be started. Check back again soon!</Text>
        </RdModalAlert>
      </RdModal>
      <RdModal
        isOpen={isResetModalOpen}
        onClose={onCloseResetModal}
        title='Game Ended'
      >
        <RdModalAlert>
          <Text>The current game has ended and rewards are being calculated. A new game will begin shortly!</Text>
        </RdModalAlert>
      </RdModal>
      <RdModal
        isOpen={isTownHallModalOpen}
        onClose={onCloseTownHalltModal}
        title='Coming Soon'
      >
        <RdModalAlert>
          <Text>Town Hall staking will be starting shortly. Check back soon!</Text>
        </RdModalAlert>
      </RdModal>
      </motion.div>
    </section>
  )
};


export default Village;

interface MapProps {
  scale: number;
  initialPosition: { x: number; y: number };
  minScale: number;
}