import React, {ReactElement, useContext, useEffect, useRef, useState} from 'react';
import {Avatar, Box, Flex, Image, Text, useDisclosure} from '@chakra-ui/react'
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import styles0 from '@src/Components/BattleBay/Areas/BattleBay.module.scss';

import {getAllFactionsSeasonId, getControlPoint, getLeadersForSeason} from "@src/core/api/RyoshiDynastiesAPICalls";
import ControlPointModal from '@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point';
import ImageService from '@src/core/services/image';
import {BattleMapHUD} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/hud";
import {io} from "socket.io-client";

import {BigNumber, Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import Battlefield from "@src/Contracts/Battlefield.json";
import MapFrame from "@src/components-v2/feature/ryoshi-dynasties/components/map-frame";
import styles from "./style.module.css";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {
  RyoshiDynastiesPreloaderContext,
  RyoshiDynastiesPreloaderProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/preloader-context";
import localFont from "next/font/local";
import {RdGameState} from "@src/core/services/api-service/types";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {RdModalAlert} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {useUser} from "@src/components-v2/useUser";

const gothamCondBlack = localFont({ src: '../../../../../../fonts/GothamCond-Black.woff2' })

interface BattleMapProps {
  onChange: () => void;
  showFullBattlePage: boolean;
  mapProps?: MapProps;
  height: string;
  useCurrentGameId: boolean;
  blockDeployments: boolean;
}
export interface MapProps {
  scale: number;
  initialPosition: { x: number; y: number };
  minScale: number;
}
interface Icon {
  name: string;
  image: string;
}

const BattleMap = ({onChange, showFullBattlePage: showActiveGame, mapProps, height, useCurrentGameId, blockDeployments}: BattleMapProps) => {
  const { getPreloadedImage } = useContext(RyoshiDynastiesPreloaderContext) as RyoshiDynastiesPreloaderProps;
  const user = useUser();
  const config = appConfig();
  const { config: rdConfig, user:rdUser, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [elementToZoomTo, setElementToZoomTo] = useState("");
  const transformComponentRef = useRef<any>(null)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [controlPoint, setControlPoint] = useState([]);
  const [skirmishPrice, setSkirmishPrice] = useState(0);
  const [conquestPrice, setConquestPrice] = useState(0);
  const [selectedControlPoint, setSelectedControlPoint] = useState(0);
  const [area, setAreas] = useState([]);
  const [flags, setFlags] = useState([]);
  const [explosion, setExplosion] = useState<ReactElement>();
  const { isOpen: isResetModalOpen, onOpen: onOpenResetModal, onClose: onCloseResetModal } = useDisclosure();
  const [allFactions, setAllFactions] = useState<any>([]);
  const[currentIconsAquired, setCurrentIconsAqcuired] = useState(false);
  const[prevIconsAquired, setPrevIconsAqcuired] = useState(false);

  const[icons, setIcons] = useState<Icon[]>([]);
  const[currentIcons, setCurrentIcons] = useState<Icon[]>([]);
  const[previousIcons, setPreviousIcons] = useState<Icon[]>([]);

  const [zoomState, setZoomState] = useState({ offsetX: 0, offsetY: 0, scale: 1 });
  const [regionName, setRegionName] = useState('');
  const [explosionOnPoint, setExplosionOnPoint] = useState(0);
  const [mapInitialized, setMapInitialized] = useState(false);

  const changeCanvasState = (ReactZoomPanPinchRef: any, event: any) => {
    setZoomState({
      offsetX: ReactZoomPanPinchRef.state.positionX,
      offsetY: ReactZoomPanPinchRef.state.positionY,
      scale: ReactZoomPanPinchRef.state.scale,
    });
    // console.log(ReactZoomPanPinchRef.state.positionX, ReactZoomPanPinchRef.state.positionY, ReactZoomPanPinchRef.state.scale)
  };
  const PlayExplosion = async (controlPointId : number) => {

    if(controlPointId === 0) return;

    if(area.length === 0) return;

    //get random area
    var left = 0;
    var top = 0;

    area.forEach((a: any) => {
      if(a.props.alt === controlPointId)
      {
        left = a.props.coords.split(",")[0];
        top = a.props.coords.split(",")[1];
      }
    });

    setExplosion(
      <Image
        position="relative"
        src='/img/battle-bay/explosion.png' 
        width={250*5}
        height={207*5}
        left={left-(250*2.5)}
        top={top-(207*2.5)}
        zIndex="9"
        />)

    await new Promise(r => setTimeout(r, 1000));

    setExplosion(
      <Image
       position="relative"
        src='/img/battle-bay/bld0.png' 
        width={0}
        height={0}
        left={0}
        top={0}
        zIndex="9"
        />)

    setExplosionOnPoint(0);
  }
  function selectRegion(x: any) {
    GetControlPointInfo(x);
  }
  const GetGameId = () => {
    if(!rdGameContext) return;
    return useCurrentGameId ? rdGameContext.game.id : rdGameContext.history.previousGameId;
  }
  const GetControlPointInfo = async (x: any) => {
    getControlPoint(x, GetGameId()).then((data) => {
      setControlPoint(data);
  }); 
  }
  const RefreshControlPoint = async () => {
    getControlPoint(selectedControlPoint, GetGameId()).then((data) => {
      setControlPoint(data);
  });
  }
  const GetAttackPrices = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const resourceContract = new Contract(config.contracts.battleField, Battlefield, readProvider);
    const skirmish = await resourceContract.skirmishPrice();
    const conquest = await resourceContract.conquestPrice();

    // console.log('skirmish', skirmish, 'conquest', conquest);
    setSkirmishPrice(Number(ethers.utils.hexValue(BigNumber.from(skirmish))));
    setConquestPrice(Number(ethers.utils.hexValue(BigNumber.from(conquest))));
  }
  const GetFactions = async () => {
    const factions = await getAllFactionsSeasonId(GetGameId(), rdGameContext?.season.id);
    setAllFactions(factions);
  }
  const SelectControlPoint = (id: any, regionName: string) => {
    setRegionName(regionName);
    setSelectedControlPoint(id);
    selectRegion(id);
    if(blockDeployments) return;
    onOpen();
  }
  const GetControlPointId = (name: any) => {
    if(!rdGameContext || blockDeployments) return 0;

    rdGameContext.game.season.map.regions.map((region: any) =>
      region.controlPoints.map((controlPoint: any, i: any) => (
        controlPoint.name == name ? 
        SelectControlPoint(controlPoint.id, region.name)
         : null
      )))
  }
  const GetLeaderIcon = (name: any) => {
    if(!currentIconsAquired) return 'img/avatar.jpg';

    let icon = icons.find((icon) => icon.name === name);
    // console.log('GetLeaderIcon', icon);
    if(icon) return icon.image;
  }
  const GetCurrentIcons = async() => {
    if(!rdGameContext) return;
    if(currentIconsAquired) return;

    let newIcons: Icon[] = [];
    rdGameContext.game.season.map.regions.map((region: any) =>
      region.controlPoints.map((controlPoint: any) => (
        newIcons.push({name: controlPoint.name, image: 'img/avatar.jpg'})
    )))

    try {
      newIcons.forEach((newIcons: any) => (
        rdGameContext.gameLeaders.forEach((controlPointWithLeader: any) => (
          newIcons.name === controlPointWithLeader.name ? newIcons.image = controlPointWithLeader.factions[0].image : null
      ))))

      setCurrentIcons(newIcons);
      setCurrentIconsAqcuired(true);
    } catch (error: any) {
      console.log(error);
    }
  }
  const GetPreviousIcons = async() => {
    if(!rdGameContext) return;
    if(prevIconsAquired) return;

    let prevIcons: Icon[] = [];
    rdGameContext.game.season.map.regions.map((region: any) =>
      region.controlPoints.map((controlPoint: any) => (
        prevIcons.push({name: controlPoint.name, image: 'img/avatar.jpg'})
    )))

    try {
      const newData = await getLeadersForSeason(rdGameContext.history.previousGameId);
      newData.forEach((newData: any) => (
        prevIcons.forEach((prevIcons: any) => (
          newData.name === prevIcons.name ? prevIcons.image = newData.factions[0].image : null
      ))))
      
      setPreviousIcons(prevIcons);
      setPrevIconsAqcuired(true);
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    setIcons(useCurrentGameId ? currentIcons : previousIcons);
  }, [useCurrentGameId, currentIcons, previousIcons]);

  useEffect(() => {
    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current as any;
      zoomToElement(elementToZoomTo);
    }
  }, [elementToZoomTo]);

  useEffect(() => {
    setMapInitialized(true);
    GetAttackPrices();
  }, []);

  useEffect(() => {
    if(useCurrentGameId) {
      GetCurrentIcons();
    } else {
      GetPreviousIcons();
    }
  }, [rdGameContext, useCurrentGameId]);

  useEffect(() => {
    if(!rdGameContext) return;

    GetFactions();
    if (rdGameContext.state === RdGameState.RESET && !blockDeployments) {
      onOpenResetModal();
    }
  }, [rdGameContext]);

  
  useEffect(() => {
    PlayExplosion(explosionOnPoint);
  }, [explosionOnPoint]);

  useEffect(() => {
    if (!user.address) return;
  
    // console.log('connecting to socket...');
    const socket = io(`${config.urls.cmsSocket}ryoshi-dynasties/battles?walletAddress=${user.address.toLowerCase()}`);
  
    function onConnect() {
      // setIsSocketConnected(true);
      // console.log('connected')
    }
  
    function onDisconnect() {
      // setIsSocketConnected(false);
      // console.log('disconnected')
    }
  
    function onBattleFinishedEvent(data: any) {
      // console.log('BATTLE_FINISHED', data)
      const parsedAtack = JSON.parse(data);
      setExplosionOnPoint(parsedAtack.controlPointId);
    }
  
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('BATTLE_FINISHED', onBattleFinishedEvent);
  
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('BATTLE_FINISHED', onBattleFinishedEvent);
    };
  }, [!!user.address]);

  useEffect(() => {
    if(!transformComponentRef?.current) return;
    setElementToZoomTo('fancyMenu'); 
  }, [transformComponentRef?.current]);

  useEffect(() => {
    // console.log('useCurrentGameId', useCurrentGameId);
  }, [useCurrentGameId]);

  return (
    <section>
      <ControlPointModal 
        isOpen={isOpen} 
        onClose={onClose} 
        controlPoint={controlPoint}
        refreshControlPoint={RefreshControlPoint}
        skirmishPrice={skirmishPrice}
        conquestPrice={conquestPrice}
        regionName={regionName}
        allFactions={allFactions}
        showActiveGame={showActiveGame}
        useCurrentGameId={useCurrentGameId}
      />
      <Box
        position='relative' 
        h={height}
        backgroundImage={ImageService.translate(`/img/ryoshi-dynasties/village/background-${user.theme}.png`).convert()}
        backgroundSize='cover'
      >
        {mapInitialized && (
          <TransformWrapper
            // centerOnInit={true}
            // disablePadding={true}
            ref={transformComponentRef}
            onZoom={changeCanvasState}
            onPinching={changeCanvasState}
            onPinchingStop={changeCanvasState}
            onPanningStop={changeCanvasState}
            initialScale={mapProps?.scale}
            initialPositionX={mapProps?.initialPosition.x}
            initialPositionY={mapProps?.initialPosition.y}
            minScale={mapProps?.minScale}
            maxScale={1}
            >
            {(utils) => (
              <React.Fragment>

            <TransformComponent wrapperStyle={{height: '100%', width: '100%', objectFit: 'cover'}}>
              <MapFrame gridHeight={'50px 1fr 50px'} gridWidth={'50px 1fr 50px'} w='2930px' h='2061px'>
                <Box
                  as='img'
                   src={getPreloadedImage(ImageService.translate('/img/ryoshi-dynasties/battle/world-map-background.jpg').custom({width: 2880, height: 2021}))}
                   maxW='none'
                   useMap="#imageMap" 
                   className={`${styles0.mapImageArea}`} 
                   id="fancyMenu"
                />
                <map name="imageMap" > 
                  {area} 
                </map>
                <Flex position="absolute" zIndex="0" width="100%" height="100%">
                {flags} {explosion}
                <div className={gothamCondBlack.className}>
                  <div className={styles.water}></div>
                  <div id='beach' className={[styles.buccaneer_beach, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Buccaneer Beach")}>
                    <div className={[styles.worldmap_label, styles.buccaneer_beach_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Buccaneer Beach")}></Avatar>Buccaneer Beach</div> </div>
                  <div className={[styles.mitagi_retreat, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Mitagi Retreat")}>
                    <div className={[styles.worldmap_label, styles.mitagi_retreat_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Mitagi Retreat")}></Avatar>Mitagi Retreat</div> </div>	
                  <div className={[styles.omoikanes_athenaeum, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Omoikanes Athenaeum")}>
                    <div className={[styles.worldmap_label, styles.omoikanes_athenaeum_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Omoikanes Athenaeum")}></Avatar>Omoikane's Athenaeum</div> </div>		
                  <div className={[styles.clutch_of_fukurokuju, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Clutch Of Fukurokujo")}>
                    <div className={[styles.worldmap_label, styles.clutch_of_fukurokuju_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Clutch Of Fukurokujo")}></Avatar>Clutch of Fukurokuju</div> </div>
                  <div className={[styles.orcunheim, styles.enlarge].filter(e => !!e).join(' ') } onClick={()=> GetControlPointId("Orcunheim")}>
                    <div className={[styles.worldmap_label, styles.orcunheim_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Orcunheim")}></Avatar>Orcunheim</div> </div>
                  <div className={[styles.ice_shrine, styles.enlarge].filter(e => !!e).join(' ') } onClick={()=> GetControlPointId("Ice Shrine")}>
                    <div className={[styles.worldmap_label, styles.ice_shrine_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Ice Shrine")}></Avatar>Ice Shrine</div> </div>	
                  <div className={[styles.felisgarde, styles.enlarge].filter(e => !!e).join(' ') } onClick={()=> GetControlPointId("Felisgarde")}>
                    <div className={[styles.worldmap_label, styles.felisgarde_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Felisgarde")}></Avatar>Felisgarde</div> </div>
                  <div className={[styles.ebisusbay, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Ebisus Bay")}>
                    <div className={[styles.worldmap_label, styles.ebisusbay_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Ebisus Bay")}></Avatar>Ebisu's Bay</div> </div>
                  <div className={[styles.verdant_forest, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Verdant Forest")}>
                    <div className={[styles.worldmap_label, styles.verdant_forest_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Verdant Forest")}></Avatar>Verdant Forest</div> </div>
                  <div className={[styles.infinite_nexus, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("The Infinite Nexus")}>
                    <div className={[styles.worldmap_label, styles.infinite_nexus_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("The Infinite Nexus")}></Avatar>Infinite Nexus</div></div>
                  <div className={[styles.venoms_descent, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Venoms Descent")}>
                    <div className={[styles.worldmap_label, styles.venoms_descent_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Venoms Descent")}></Avatar>Venom's Descent</div></div>
                  <div className={[styles.mitamic_fissure, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Mitamic Fissure")}>
                    <div className={[styles.worldmap_label, styles.mitamic_fissure_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Mitamic Fissure")}></Avatar>Mitamic Fissure</div></div>
                  <div className={[styles.seashrine, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Seashrine")}>
                    <div className={[styles.worldmap_label, styles.seashrine_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag}  src={GetLeaderIcon("Seashrine")}></Avatar>Seashrine</div></div>
                  <div className={[styles.classy_keep, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Classy Keep")}>
                    <div className={[styles.worldmap_label, styles.classy_keep_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Classy Keep")}></Avatar>Classy Keep</div></div>
                  <div className={[styles.ancestors_final_rest, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Ancestors Final Rest")}>
                    <div className={[styles.worldmap_label, styles.ancestors_final_rest_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Ancestors Final Rest")}></Avatar>Ancestor's Final Rest</div></div>
                  <div className={[styles.dragon_roost, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Dragons Roost")}>
                    <div className={[styles.worldmap_label, styles.dragon_roost_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Dragons Roost")}></Avatar>Dragon Roost</div></div>	
                  <div className={[styles.nyar_spire, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("N'yar Spire")}>
                    <div className={[styles.worldmap_label, styles.nyar_spire_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("N'yar Spire")}></Avatar>N'yar Spire</div></div>		
                  <div className={[styles.iron_bastion, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("The Iron Bastion")}>
                    <div className={[styles.worldmap_label, styles.iron_bastion_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("The Iron Bastion")}></Avatar>Iron Bastion</div></div>
                  <div className={[styles.volcanic_reach, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Volcanic Reach")}>
                    <div className={[styles.worldmap_label, styles.volcanic_reach_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag}  src={GetLeaderIcon("Volcanic Reach")}></Avatar>Volcanic Reach</div></div>	
                  <div className={[styles.the_conflagration, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("The Conflagration")}>
                    <div className={[styles.worldmap_label, styles.the_conflagration_label].filter(e => !!e).join(' ')}>
                      <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("The Conflagration")} ></Avatar>The Conflagration</div></div>
                </div>
                
                </Flex>
                </MapFrame>
              </TransformComponent>
              </React.Fragment>
              )}
            </TransformWrapper>
        )}
        {showActiveGame && (<BattleMapHUD onBack={onChange}/>)
      }
      </Box>
      <RdModal
        isOpen={isResetModalOpen}
        onClose={() => {
          onChange();
        }}
        title='Game Ended'
      >
        <RdModalAlert>
          <Text>The current game has ended and rewards are being calculated. A new game will begin shortly!</Text>
        </RdModalAlert>
      </RdModal>
    </section>
  )
};


export default BattleMap;