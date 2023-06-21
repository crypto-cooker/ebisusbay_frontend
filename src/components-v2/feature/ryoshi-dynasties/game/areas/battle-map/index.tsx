import React, {ReactElement, useEffect, useRef, useState, useContext } from 'react';
import { useDisclosure, Button, AspectRatio, useBreakpointValue, Box, Flex, Image } from '@chakra-ui/react'
// import { resizeBattleMap, setUpMapZooming } from '@src/Components/BattleBay/Areas/mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles0 from '@src/Components/BattleBay/Areas/BattleBay.module.scss';

import { getMap } from "@src/core/api/RyoshiDynastiesAPICalls";
import { getControlPoint } from "@src/core/api/RyoshiDynastiesAPICalls";
import ControlPointModal from '@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/control-point';
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import ImageService from '@src/core/services/image';
import {BattleMapHUD} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battle-map/hud";
import {io} from "socket.io-client";
import {useAppSelector} from "@src/Store/hooks";

import {Contract, ethers, BigNumber} from "ethers";
import {appConfig} from "@src/Config";
import Battlefield from "@src/Contracts/Battlefield.json";
import MapFrame from "@src/components-v2/feature/ryoshi-dynasties/components/map-frame";
import styles from "./style.module.css";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import localFont from "next/font/local";

const gothamCondBlack = localFont({ src: '../../../../../../fonts/GothamCond-Black.woff2' })

interface BattleMapProps {
  onChange: () => void;
}

const BattleMap = ({onChange}: BattleMapProps) => {

  const user = useAppSelector(state => state.user);
  const config = appConfig();
  const { config: rdConfig, user:rdUser, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [elementToZoomTo, setElementToZoomTo] = useState("");
  const transformComponentRef = useRef<any>(null)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [controlPoint, setControlPoint] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomState, setZoomState] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });

  const imageRef1 = useRef();
  const imageRef2 = useRef();
  const imageRef3 = useRef();
  const imageRef4 = useRef();

  const [area, setAreas] = useState([]);
  const [flags, setFlags] = useState([]);

  const [selectedControlPoint, setSelectedControlPoint] = useState(0);
  // const [pins, setPins] = useState([]);
  const [explosion, setExplosion] = useState<ReactElement>();

  useEffect(() => {
    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current as any;
      zoomToElement(elementToZoomTo);
    }
    // console.log("current state " + transformComponentRef?.current?.state);
    // console.log("current state " + transformComponentRef?.current);
    // console.log("current state " + transformComponentRef);
    // transformComponentRef.current.state;
  }, [elementToZoomTo]);

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  const changeCanvasState = (ReactZoomPanPinchRef: any, event: any) => {
    setZoomState({
      offsetX: ReactZoomPanPinchRef.state.positionX,
      offsetY: ReactZoomPanPinchRef.state.positionY,
      scale: ReactZoomPanPinchRef.state.scale,
    });
    console.log(ReactZoomPanPinchRef.state.positionX, ReactZoomPanPinchRef.state.positionY, ReactZoomPanPinchRef.state.scale)
  };
  // function useWindowDimensions() {
  //   const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  //   useEffect(() => {
  //     function handleResize() {
  //       setWindowDimensions(getWindowDimensions());
  //     }

  //     window.addEventListener('resize', handleResize);
  //     return () => window.removeEventListener('resize', handleResize);
  //   }, []);

  //   return windowDimensions;
  // }
  // const GetControlPointImage = async (id: any) => 
  // {
  //   var data = await getControlPoint(id)
  //   console.log(data.leaderBoard[0].image);
  //   return data.leaderBoard[0].image;
  // }
  // function wait(ms: any){
  //   var start = new Date().getTime();
  //   var end = start;
  //   while(end < start + ms) {
  //     end = new Date().getTime();
  //  }
  // }
  const randomlyPlayExplosion = async () => {

    // if(area.length === 0) return;

    // //get random area
    // var randomArea = area[Math.floor(Math.random() * area.length)];
    // var left = randomArea.props.coords.split(",")[0];
    // var top = randomArea.props.coords.split(",")[1];

    // setExplosion(
    //   <Flex position="absolute" zIndex="9" width="100%" height="100%">
    //   <Image
    //    position="relative"
    //     src='/img/battle-bay/explosion.png' 
    //     width={250*5}
    //     height={207*5}
    //     left={left-(250*2.5)}
    //     top={top-(207*2.5)}
    //     zIndex="9"
    //     />
    //   </Flex>
    //   )

    // await new Promise(r => setTimeout(r, 1000));

    // setExplosion(
    //   <Flex position="absolute" zIndex="9" width="100%" height="100%">
    //   <Image
    //    position="relative"
    //     src='/img/battle-bay/explosion.png' 
    //     width={0}
    //     height={0}
    //     left={left-(250*2.5)}
    //     top={top-(207*2.5)}
    //     zIndex="9"
    //     />
    //   </Flex>
    // )
    // setPlayExplosion(!playExlplosion);
  }
  const [regionName, setRegionName] = useState('');

  const [explosionOnPoint, setExplosionOnPoint] = useState(0);

  useEffect(() => {
    PlayExplosion(explosionOnPoint);
  }, [explosionOnPoint]);


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
  //#endregion

  function selectRegion(x: any) {
    GetControlPointInfo(x);
  }
  const GetControlPointInfo = async (x: any) => {
    getControlPoint(x).then((data) => {
      setControlPoint(data);
  }); 
  }
  const RefreshControlPoint = async () => {
    getControlPoint(selectedControlPoint).then((data) => {
      setControlPoint(data);
  });
  }

  useEffect(() => {
    if(area.length === 0) return;

    // setFlags(area.map((a: any) => {
    //   // console.log('controlPoint.id', a.props.alt);
    //   const left = a.props.coords.split(",")[0];
    //   const top = a.props.coords.split(",")[1];
    //   // console.log('left', left, 'top', top);
    //   <Image
    //     position="relative"
    //     src='/img/battle-bay/fire.gif' 
    //     width={1000}
    //     height={1000}
    //     left={left-(250*2.5)}
    //     top={top-(207*2.5)}
    //     zIndex="10"
    //     />
    // }));
  }, [area]);

  useEffect(() => {
    if(!transformComponentRef?.current) return;
    // console.log('transformComponentRef', transformComponentRef);
    setElementToZoomTo('fancyMenu'); 
  }, [transformComponentRef?.current]);

  //Temporarily turning off to use new process with opperator's new images
  const SetUpMap = async () => {
    getMap().then((data) => {
      // console.log(data);
      // resizeBattleMap(7580, 5320);
      setAreas(data.data.data.map.regions.map((region: any) =>
        region.controlPoints.map((controlPoint: any, i: any) => (
          <area 
            onClick={() => {
              console.log('controlPoint.id', controlPoint.id),
              setSelectedControlPoint(controlPoint.id); 
              selectRegion(controlPoint.id); 
              onOpen();
            }}
            coords={controlPoint.name=="Classy Keep" ? "1471,1106,211" :controlPoint.coordinates} 
            shape="circle" 
            alt= {controlPoint.id}
            className='cursor-pointer'
            title={controlPoint.name}
            />
          ))))
          console.log(area);
      // map height and width, may need to be changed in the future

    }); 
    // const data = area.filter((area: any) => area.props.title === "Classy Keep");
  }

  const getImageRef = (id: any) => {
    if(id === 1)
      return imageRef1;
    else if(id === 2)
      return imageRef2;
    else if(id === 3)
      return imageRef3;
    else if(id === 4)
      return imageRef4;
  }
  // const SetUpPins = async () => {
  //     setPins(controlPoints.map((controlPoint, i) => 
  //       (<div id={controlPoint.pinName} title={controlPoint.title}
  //             style={{position:"absolute", marginTop: controlPoint.marginTop, marginLeft: 
  //             controlPoint.marginLeft, zIndex:"9", pointerEvents:"none"}}>
  //       <img width={flagSize} height={flagSize} ref={getImageRef(controlPoint.id)} className={controlPoint.id}/>
  //       <div className= "pinText">
  //         <h3 className="head">{controlPoint.title}</h3>
  //       </div>
  //     </div>
  //       )))
  //     if(imageRef1.current != null)
  //     {
  //       imageRef1.current.src = await GetControlPointImage(1);
  //       imageRef2.current.src = await GetControlPointImage(2);
  //       imageRef3.current.src = await GetControlPointImage(3);
  //       imageRef4.current.src = await GetControlPointImage(4);
  //     }

  // }
  const [skirmishPrice, setSkirmishPrice] = useState(0);
  const [conquestPrice, setConquestPrice] = useState(0);

  const GetAttackPrices = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const resourceContract = new Contract(config.contracts.battleField, Battlefield, readProvider);
    const skirmish = await resourceContract.skirmishPrice();
    const conquest = await resourceContract.conquestPrice();

    setSkirmishPrice(Number(ethers.utils.hexValue(BigNumber.from(skirmish))));
    setConquestPrice(Number(ethers.utils.hexValue(BigNumber.from(conquest))));

    // console.log('skirmish', skirmish, 'conquest', conquest);
  }

  const [mapInitialized, setMapInitialized] = useState(false);

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

  useEffect(() => {
    setMapInitialized(true);
    GetAttackPrices();
  }, []);

  //socket stuff
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  useEffect(() => {
    if (!user.address) return;

    console.log('connecting to socket...');
    const socket = io(`${config.urls.cmsSocket}ryoshi-dynasties/battles?walletAddress=${user.address.toLowerCase()}`);

    function onConnect() {
      setIsSocketConnected(true);
      console.log('connected')
    }

    function onDisconnect() {
      setIsSocketConnected(false);
      console.log('disconnected')
    }

    function onBattleFinishedEvent(data: any) {
      console.log('BATTLE_FINISHED', data)
      const parsedAtack = JSON.parse(data);
      // console.log('parsedAtack', parsedAtack)
      // console.log('parsedAtack.controlPointId', parsedAtack.controlPointId)
      // PlayExplosion(parsedAtack.controlPointId);
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

  const SelectControlPoint = (id: any, regionName: string) => {
    setRegionName(regionName);
    setSelectedControlPoint(id);
    selectRegion(id);
    onOpen();
  }

  const GetControlPointId = (name: any) => {
    if(!rdGameContext) return 0;
    rdGameContext.game.parent.map.regions.map((region: any) =>
      region.controlPoints.map((controlPoint: any, i: any) => (
        controlPoint.name == name ? 
        SelectControlPoint(controlPoint.id, region.name)
         : null
      )))
  }

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
        />
      <Box
        position='relative' h='calc(100vh - 74px)'
        backgroundImage={ImageService.translate(`/img/ryoshi-dynasties/village/background-${user.theme}.png`).convert()}
        backgroundSize='cover'
      >
        {mapInitialized && (
          <TransformWrapper
            // centerOnInit={true}
            ref={transformComponentRef}
            onZoom={changeCanvasState}
            onPinching={changeCanvasState}
            onPinchingStop={changeCanvasState}
            onPanningStop={changeCanvasState}
            // centerOnInit={true}
            // disablePadding={true}
            initialScale={mapProps?.scale}
            initialPositionX={mapProps?.initialPosition.x}
            initialPositionY={mapProps?.initialPosition.y}
            minScale={mapProps?.minScale}
            maxScale={1}
            >
            {(utils) => (
              <React.Fragment>

            <TransformComponent wrapperStyle={{height: '100%', width: '100%', objectFit: 'cover'}}>
              <MapFrame gridHeight={'50px 1fr 50px'} gridWidth={'50px 1fr 50px'}>
              <Box 
                  as='img'
                  //  src={'/img/battle-bay/imgs/world_map_background.jpg'}
                   src={ImageService.translate('/img/ryoshi-dynasties/battle/world-map-background.jpg').custom({width: 2880, height: 2021})}
                   maxW='none'
                   useMap="#imageMap" 
                   className={`${styles0.mapImageArea}`} 
                   id="fancyMenu"/>
                <map name="imageMap" > 
                  {area} 
                </map>
                <Flex position="absolute" zIndex="0" width="100%" height="100%">
                {flags} {explosion}
                <div className={gothamCondBlack.className}>
                  <div className={styles.water}></div>
                  <div id='beach' className={[styles.buccaneer_beach, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Buccaneer Beach")}>
                    <div className={[styles.worldmap_label, styles.buccaneer_beach_label].filter(e => !!e).join(' ')}>Buccaneer Beach</div> </div>
                  <div className={[styles.mitagi_retreat, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Mitagi Retreat")}>
                    <div className={[styles.worldmap_label, styles.mitagi_retreat_label].filter(e => !!e).join(' ')}>Mitagi Retreat</div> </div>	
                  <div className={[styles.omoikanes_athenaeum, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Omoikanes Athenaeum")}>
                    <div className={[styles.worldmap_label, styles.omoikanes_athenaeum_label].filter(e => !!e).join(' ')}>Omoikane's Athenaeum</div> </div>		
                  <div className={[styles.clutch_of_fukurokuju, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Clutch Of Fukurokujo")}>
                    <div className={[styles.worldmap_label, styles.clutch_of_fukurokuju_label].filter(e => !!e).join(' ')}>Clutch of Fukurokuju</div> </div>
                  <div className={[styles.orcunheim, styles.enlarge].filter(e => !!e).join(' ') } onClick={()=> GetControlPointId("Orcunheim")}>
                    <div className={[styles.worldmap_label, styles.orcunheim_label].filter(e => !!e).join(' ')}>Orcunheim</div> </div>
                  <div className={[styles.ice_shrine, styles.enlarge].filter(e => !!e).join(' ') } onClick={()=> GetControlPointId("Ice Shrine")}>
                    <div className={[styles.worldmap_label, styles.ice_shrine_label].filter(e => !!e).join(' ')}>Ice Shrine</div> </div>	
                  <div className={[styles.felisgarde, styles.enlarge].filter(e => !!e).join(' ') } onClick={()=> GetControlPointId("Felisgarde")}>
                    <div className={[styles.worldmap_label, styles.felisgarde_label].filter(e => !!e).join(' ')}>Felisgarde</div> </div>
                  <div className={[styles.ebisusbay, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Ebisus Bay")}>
                    <div className={[styles.worldmap_label, styles.ebisusbay_label].filter(e => !!e).join(' ')}>Ebisu's Bay</div> </div>
                  <div className={[styles.verdant_forest, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Verdant Forest")}>
                    <div className={[styles.worldmap_label, styles.verdant_forest_label].filter(e => !!e).join(' ')}>Verdant Forest</div> </div>
                  <div className={[styles.infinite_nexus, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("The Infinte Nexus")}>
                    <div className={[styles.worldmap_label, styles.infinite_nexus_label].filter(e => !!e).join(' ')}>Infinite Nexus</div></div>
                  <div className={[styles.venoms_descent, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Venoms Descent")}>
                    <div className={[styles.worldmap_label, styles.venoms_descent_label].filter(e => !!e).join(' ')}>Venom's Descent</div></div>
                  <div className={[styles.mitamic_fissure, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Mitamic Fissure")}>
                    <div className={[styles.worldmap_label, styles.mitamic_fissure_label].filter(e => !!e).join(' ')}>Mitamic Fissure</div></div>
                  <div className={[styles.seashrine, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Seashrine")}>
                    <div className={[styles.worldmap_label, styles.seashrine_label].filter(e => !!e).join(' ')}>Seashrine</div></div>
                  <div className={[styles.classy_keep, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Classy Keep")}>
                    <div className={[styles.worldmap_label, styles.classy_keep_label].filter(e => !!e).join(' ')}>Classy Keep</div></div>
                  <div className={[styles.ancestors_final_rest, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Ancestors Final Rest")}>
                    <div className={[styles.worldmap_label, styles.ancestors_final_rest_label].filter(e => !!e).join(' ')}>Ancestor's Final Rest</div></div>
                  <div className={[styles.dragon_roost, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Dragons Roost")}>
                    <div className={[styles.worldmap_label, styles.dragon_roost_label].filter(e => !!e).join(' ')}>Dragon Roost</div></div>	
                  <div className={[styles.nyar_spire, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Insect Race")}>
                    <div className={[styles.worldmap_label, styles.nyar_spire_label].filter(e => !!e).join(' ')}>N'yar Spire</div></div>		
                  <div className={[styles.iron_bastion, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("The Iron Bastion")}>
                    <div className={[styles.worldmap_label, styles.iron_bastion_label].filter(e => !!e).join(' ')}>Iron Bastion</div></div>
                  <div className={[styles.volcanic_reach, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Volcanic Reach")}>
                    <div className={[styles.worldmap_label, styles.volcanic_reach_label].filter(e => !!e).join(' ')}>Volcanic Reach</div></div>	
                  <div className={[styles.the_conflagration, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("The Conflagration")}>
                    <div className={[styles.worldmap_label, styles.the_conflagration_label].filter(e => !!e).join(' ')}>The Conflagration</div></div>
                </div>
                
                </Flex>
                </MapFrame>
              </TransformComponent>
              </React.Fragment>
              )}
            </TransformWrapper>
        )}
        <BattleMapHUD onBack={onChange}/>
      </Box>
    </section>
  )
};


export default BattleMap;

interface MapProps {
  scale: number;
  initialPosition: { x: number; y: number };
  minScale: number;
}