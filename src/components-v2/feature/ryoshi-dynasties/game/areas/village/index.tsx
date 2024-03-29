import {
  Box,
  Button,
  Fade,
  Image,
  keyframes,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useDisclosure,
  usePrefersReducedMotion,
  VStack
} from "@chakra-ui/react"

import React, {useContext, useEffect, useRef, useState} from 'react';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import styles from '@src/Components/BattleBay/Areas/BattleBay.module.scss';

//contracts
import DailyCheckinModal from "@src/components-v2/feature/ryoshi-dynasties/game/modals/daily-checkin";
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
import xmasMessages from "@src/components-v2/feature/ryoshi-dynasties/game/areas/village/xmasMessages.json";
import {RdModalFooter} from "../../../components/rd-announcement-modal";
import {useUser} from "@src/components-v2/useUser";
import {ApiService} from "@src/core/services/api-service";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {appConfig} from "@src/Config";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {Contract} from "ethers";
import Resources from "@src/Contracts/Resources.json";
import {parseErrorMessage} from "@src/helpers/validator";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {VillageMerchant} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/village/merchant";
import {ShakeTreeDialog} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/village/christmas";
import {ValentinesDayDialog} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/village/valentines";

const config = appConfig();
const xmasCutoffDate = new Date(Date.UTC(2024, 0, 8, 0, 0, 0));
const currentDate = new Date();
const isChristmasTime = currentDate < xmasCutoffDate;

interface VillageProps {
  onChange: (value: string) => void;
  firstRun: boolean;
  onFirstRun: () => void;
}
const Village = ({onChange, firstRun, onFirstRun}: VillageProps) => {
  const xmasTheme = isChristmasTime ? '_xmas' : '';
  const { config: rdConfig, game: rdGameContext, user: rdUser, refreshUser} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useUser();
  const { isOpen:isOpenOverlay, onToggle } = useDisclosure()

  const transformComponentRef = useRef<any>(null)
  const [elementToZoomTo, setElementToZoomTo] = useState("");

  const [dimensionsLoaded, setDimensionsLoaded] = useState(false);

  const buildingButtonRef = useRef<any>(null)
  const { isOpen: isOpenBuildings, onOpen: onOpenBuildings, onClose: onCloseBuildings } = useDisclosure();
  const { isOpen: isOpenAnnouncementBoard, onOpen: onOpenAnnouncementBoard, onClose: onCloseAnnouncementBoard } = useDisclosure();
  const { isOpen: isOpenDailyCheckin, onOpen: onOpenDailyCheckin, onClose: onCloseDailyCheckin } = useDisclosure();
  const { isOpen: isOpenMerchant, onOpen: onOpenMerchant, onClose: onCloseMerchant } = useDisclosure();
  const [forceRefreshBool, setForceRefreshBool] = useState(false);
  const { isOpen: isOpenBattleLog, onOpen: onOpenBattleLog, onClose: onCloseBattleLog } = useDisclosure();
  const { isOpen: isOpenXPLeaderboard, onOpen: onOpenXPLeaderboard, onClose: onCloseXPLeaderboard } = useDisclosure();
  const { isOpen: isOpenValentinesDialog, onOpen: onOpenValentiesDialog, onClose: onCloseValentinesDialog } = useDisclosure();
  const forceRefresh = () => {
    setForceRefreshBool(!forceRefreshBool);
  }


  const [openShakePresent,setOpenShakePresent ] = useState(false);
  const [presentMessage, setPresentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const getRandomEntry = (entries: string[]): string => {
    const randomIndex = Math.floor(Math.random() * entries.length);
    return entries[randomIndex];
  };
  const PresentPresent = async () => {
    onOpenPresentModal();

    setShowMessage(false);
    await new Promise(r => setTimeout(r, 2000));
    setShowMessage(true);

    setPresentMessage(getRandomEntry(xmasMessages));
    setOpenShakePresent(false);
  }

  useEffect(() => {
    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current as any;
      zoomToElement(elementToZoomTo);
    }
  }, [elementToZoomTo]);


  const buildings = {
    'allianceCenter': {height:438, width:554, top: '7%', left: '55%'},
    'townhall': {height:607, width:707, top: '13.25%', left: '36.25%'},
    'academy': {height: 792, width: 744, top: '4%', left: '74%'},
    'tavern': {height: 500, width: 700, top: '2%', left: '17%'},
    'tavernSpin': {height: 573, width: 725, top: '2%', left: '17.05%'},

    'water': {height: 703, width: 2880, top: '32%', left: '0%'},
    'boat': {height: 613, width: 718, top: '34%', left: '3%'},
    'ebisustatue': {height: 542, width: 279, top: '35%', left: '40%'},
    'market': {height: 545, width: 793, top: '36.5%', left: '55%'},
    'barracks': {height: 579, width: 832, top: '15.5%', left: '-0.5%'},
    'swordsmen': {height: 270, width: 383, top: '34%', left: '50.5%'},
    'xmas_tree': {height: 505, width: 344, top: '23%', left: '27%'},

    'flowers1': {height: 251, width: 229, top: '3%', left: '14%'},
    'flowers2': {height: 251, width: 229, top: '3%', left: '14%'},
    'flowers3': {height: 251, width: 229, top: '3%', left: '14%'},

    'bank': {height: 456, width: 579, top: '%', left: '36%', x: 444, y: 444, scale: 4},
    'announcement': {height: 243, width: 206, top: '28%', left: '60%'},

    'moongate': {height: 482, width: 443, top: '23%', left: '67%'},
    'torii': {height: 201, width: 236, top: '6%', left: '0%'},
    'pond': {height: 311, width: 783, top: '0%', left: '65%'},

    'alliancecenter_label': {height: 438, width: 554, top: '0%', left: '0%'},
    'announcementboard_label': {height: 243, width: 279, top: '28%', left: '60%'},
    'moongate_label': {height: 482, width: 443, top: '23%', left: '67%'},
    'academy_label': {height: 792, width: 744, top: '4%', left: '74%'},
    'tavern_label': {height: 573, width: 725, top: '3%', left: '14%'},

    'townhall_label': {height: 607, width: 707, top: '13%', left: '36%'},
    'barracks_label': {height: 579, width: 832, top: '12.5%', left: '-0.5%'},
    'fishmarket_label': {height: 545, width: 793, top: '36.5%', left: '55%'},
    'bank_label': {height: 456, width: 579, top: '7%', left: '33%'},

    'merchant': {top: '18.5%', left: '28.5%'},
    'valentines': {top: '32%', left: '30%'}
  }

  const handleEnterScene = async (elementId: string) => {
    if (elementId === 'battleMap') {
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
    }

    setElementToZoomTo(elementId);
    await enterScene(elementId);
  }

  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  }

  const enterScene = async (thingToOpen:string) => {
    onToggle();
    await timeout(500); //for 0.5 sec delay
    onChange(thingToOpen);
  }

  const [xmasTreeTop, setXmasTreeTop] = useState(buildings.xmas_tree.top);
  const [xmasTreeLeft, setXmasTreeLeft] = useState(buildings.xmas_tree.left);
  const [mapInitialized, setMapInitialized] = useState(false);

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
  }, []);

  const { isOpen: isBlockingModalOpen, onOpen: onOpenBlockingModal, onClose: onCloseBlockingModal } = useDisclosure();
  const { isOpen: isResetModalOpen, onOpen: onOpenResetModal, onClose: onCloseResetModal } = useDisclosure();
  const { isOpen: isTownHallModalOpen, onOpen: onOpenTownHallModal, onClose: onCloseTownHalltModal } = useDisclosure();
  const { isOpen: isPresentModalOpen, onOpen: onOpenPresentModal, onClose: onClosePresentModal } = useDisclosure();

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
                        src={ImageService.translate(`/img/battle-bay/mapImages/background${xmasTheme}.png`).custom({width: 2880, height: 1620})}
                        maxW='none'
                        useMap="#image-map"
                        className={`${styles.mapImageArea}`}
                        id="fancyMenu"
                        onLoad={() => setDimensionsLoaded(true)}
                      />
                      <map name="image-map">
                      </map>

                      <Sprite
                        id='allianceCenter'
                        position={{x: buildings.allianceCenter.left, y: buildings.allianceCenter.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/alliancecenter${xmasTheme}.png`).convert()}
                        onClick={handleEnterScene}
                      />
                      <Sprite
                        id='townHall'
                        position={{x: buildings.townhall.left, y: buildings.townhall.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/townhall${xmasTheme}.png`).convert()}
                        onClick={handleEnterScene}
                      />
                      <Sprite
                        id='tavern'
                        position={{x: buildings.tavern.left, y: buildings.tavern.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/tavern${xmasTheme}.png`).convert()}
                        layers={[{
                          image: ImageService.translate(`/img/battle-bay/mapImages/tavern_turbine.apng`).convert(),
                          position: {x: 0, y: 0}
                        }]}
                        onClick={handleEnterScene}
                      />
                      <Sprite
                        id='academy'
                        position={{x: buildings.academy.left, y: buildings.academy.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/academy${xmasTheme}.png`).convert()}
                      />
                      <Sprite
                        id='battleMap'
                        position={{x: buildings.boat.left, y: buildings.boat.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/boat${xmasTheme}.apng`).convert()}
                        onClick={handleEnterScene}
                      />
                      <Sprite
                        id='statue'
                        position={{x: buildings.ebisustatue.left, y: buildings.ebisustatue.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/ebisustatue${xmasTheme}.png`).convert()}
                      />
                      <Sprite
                        id='market'
                        position={{x: buildings.market.left, y: buildings.market.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/fishmarket${xmasTheme}.apng`).convert()}
                        onClick={handleEnterScene}
                      />
                      <Sprite
                        id='water'
                        position={{x: buildings.water.left, y: buildings.water.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/water.png`).custom({width: 2880, height: 703})}
                        zIndex={8}
                      />
                      <Sprite
                        id='bank'
                        position={{x: buildings.bank.left, y: buildings.bank.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/bank${xmasTheme}.png`).convert()}
                        onClick={handleEnterScene}
                        zIndex={8}
                      />
                      <Sprite
                        id='announcements'
                        position={{x: buildings.announcement.left, y: buildings.announcement.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/announcement${xmasTheme}.png`).convert()}
                        onClick={onOpenAnnouncementBoard}
                      />
                      <Sprite
                        id='barracks'
                        position={{x: buildings.barracks.left, y: buildings.barracks.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/barracks${xmasTheme}.png`).convert()}
                        layers={[{
                          image: ImageService.translate(`/img/battle-bay/mapImages/swordsmen.apng`).convert(),
                          position: {x: buildings.swordsmen.left, y: buildings.swordsmen.top}
                        }]}
                        onClick={handleEnterScene}
                      />
                      <Sprite
                        id='moongate'
                        position={{x: buildings.moongate.left, y: buildings.moongate.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/moongate${xmasTheme}.apng`).convert()}
                      />
                      <Sprite
                        id='torii'
                        position={{x: buildings.torii.left, y: buildings.torii.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/torii${xmasTheme}.png`).convert()}
                        onClick={() => onChange('lands')}
                        zIndex={8}
                      />
                      <Sprite
                        id='pond'
                        position={{x: buildings.pond.left, y: buildings.pond.top}}
                        image={ImageService.translate(`/img/battle-bay/mapImages/pond${xmasTheme}.apng`).convert()}
                        zIndex={8}
                      />
                      <Sprite
                        id='merchant'
                        position={{x: buildings.merchant.left, y: buildings.merchant.top}}
                        image={ImageService.translate(`/img/ryoshi-dynasties/village/buildings/merchant-looped.apng`).convert()}
                        zIndex={9}
                        onClick={onOpenMerchant}
                      />

                      {  <Sprite
                        id='ryoshiwithknife'
                        position={{x: buildings.valentines.left, y: buildings.valentines.top}}
                        image={ImageService.translate(`/img/ryoshi-with-knife/ryoshiwithknife_village.apng`).convert()}
                        zIndex={9}
                        onClick={() => window.open('https://swap.ebisusbay.com/#/swap?outputCurrency=0x055c517654d72A45B0d64Dc8733f8A38E27Fd49C&inputCurrency=0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', '_blank')}
                      />
                      } 
                      {/*{isChristmasTime && (*/}
                      {/*  <EventSprite*/}
                      {/*    id='christmas'*/}
                      {/*    position={{x: buildings.xmas_tree.left, y: buildings.xmas_tree.top}}*/}
                      {/*    image={ImageService.translate(`/img/battle-bay/mapImages/xmas_tree.apng`).convert()}*/}
                      {/*    ctaImage={ImageService.translate(`/img/battle-bay/mapImages/open_present.png`).convert()}*/}
                      {/*    ctaImageHover={ImageService.translate(`/img/battle-bay/mapImages/open_present_hover.png`).convert()}*/}
                      {/*    zIndex={9}*/}
                      {/*    onClick={onOpenPresentModal}*/}
                      {/*  />*/}
                      {/*)}*/}

                      { xmasTheme ? ( <>
                          <Box
                            as='img'
                            src={ImageService.translate('/img/battle-bay/mapImages/snow_overlay.gif').custom({width: 2880, height: 1620})}
                            maxW='none'
                            useMap="#image-map"
                            id="fancyMenu"
                            onLoad={() => setDimensionsLoaded(true)}
                            style={{position:"absolute", marginTop: 0, marginLeft: 0, zIndex:"10"}}
                            pointerEvents={'none'}
                          />

                          <Box className={styles.enlarge} style={{position:"absolute", marginTop: xmasTreeTop, marginLeft: xmasTreeLeft, zIndex:"8"}}
                            onClick={() => setOpenShakePresent(!openShakePresent)}>
                              <VStack
                                justifyContent={'center'}
                                alignItems={'center'}
                                >
                                <img src={ImageService.translate('/img/battle-bay/mapImages/xmas_tree.apng').convert()} />
                                { openShakePresent && (
                                  <>
                                    <Box
                                      position='absolute'
                                      bgImage={'/img/battle-bay/mapImages/open_present.png'}
                                      top={450}
                                      rounded='full'
                                      zIndex={13}
                                      data-group
                                      w={357}
                                      h={81}
                                      left={25}
                                    >
                                      <Button
                                        bg={'transparent'}
                                        w={357}
                                        h={81}
                                        fontSize='28px'
                                        onClick={PresentPresent}
                                        _groupHover={{
                                          cursor: 'pointer',
                                          bg: 'transparent',
                                          bgImage:'/img/battle-bay/mapImages/open_present_hover.png',
                                        }}
                                      >
                                      </Button>
                                    </Box>
                                  </>
                                  )
                                }
                            </VStack>
                          </Box>
                      </>) : (<></>) }

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

          <VillageHud
            onOpenBuildings={onOpenBuildings}
            onOpenDailyCheckin={onOpenDailyCheckin}
            onOpenBattleLog={onOpenBattleLog}
            onOpenXPLeaderboard={onOpenXPLeaderboard}
            forceRefresh={forceRefreshBool}
          />
        </Box>

        <AnnouncementBoardModal isOpen={isOpenAnnouncementBoard} onClose={onCloseAnnouncementBoard} onOpenDailyCheckin={onOpenDailyCheckin}/>
        <DailyCheckinModal isOpen={isOpenDailyCheckin} onClose={onCloseDailyCheckin} forceRefresh={forceRefresh}/>
        <BattleLog isOpen={isOpenBattleLog} onClose={onCloseBattleLog} />
        <Buildings isOpenBuildings={isOpenBuildings} onCloseBuildings={onCloseBuildings} buildingButtonRef={buildingButtonRef} setElementToZoomTo={setElementToZoomTo}/>
        <ShakeTreeDialog isOpen={isPresentModalOpen} onClose={onClosePresentModal} />
        <ValentinesDayDialog isOpen={isOpenValentinesDialog} onClose={onCloseValentinesDialog} />
        <VillageMerchant isOpen={isOpenMerchant} onClose={onCloseMerchant} forceRefresh={forceRefresh} />

        <Fade in={isOpenOverlay}>
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

interface SpriteProps {
  id: string;
  position: { x: string | number; y: string | number };
  image: string;
  layers?: SpriteLayerProps[];
  zIndex?: number;
  onClick?: (id: string) => void;
}

interface SpriteLayerProps {
  position: { x: string | number; y: string | number };
  image: string;
}

const Sprite = ({id, position, image, layers, zIndex, onClick}: SpriteProps) => {
  return (
    <Box
      id={id}
      className={onClick ? styles.enlarge : undefined}
      position='absolute'
      top={0}
      left={0}
      mt={position.y}
      ms={position.x}
      zIndex={zIndex ?? 9}
      onClick={() => onClick?.(id) ?? {}}
      cursor={onClick ? 'pointer' : undefined}
    >
      <Image src={image} alt={id} />
      {layers?.map((layer, key) => (
        <Sprite key={key} id={''} position={layer.position} image={layer.image} />
      ))}
    </Box>
  )
}

interface EventSpriteProps extends SpriteProps {
  ctaImage: string;
  ctaImageHover?: string;
}

const EventSprite = ({id, position, image, ctaImage, ctaImageHover, zIndex, onClick}: EventSpriteProps) => {
  const [showActionButton,setShowActionButton ] = useState(false);

  return (
    <Box
      id={id}
      className={onClick ? styles.enlarge : undefined}
      position='absolute'
      top={0}
      left={0}
      mt={position.y}
      ms={position.x}
      zIndex={zIndex ?? 9}
      onClick={() => setShowActionButton(true)}
      cursor={onClick ? 'pointer' : undefined}
    >
      <Image src={image} alt={id} />
      {showActionButton && (
        <Box
          position='absolute'
          bgImage={ctaImage}
          zIndex={13}
          data-group
          w={187}
          h={46}
          left='120px'
        >
          <Button
            bg={'transparent'}
            w={187}
            h={46}
            fontSize='28px'
            onClick={() => onClick?.(id) ?? {}}
            _groupHover={{
              cursor: 'pointer',
              bg: 'transparent',
              bgImage:ctaImageHover,
            }}
          >
          </Button>
        </Box>
      )}
    </Box>
  )
}