import React, {ReactElement, useEffect, useRef, useState } from 'react';
import { useDisclosure, Button, AspectRatio, useBreakpointValue, Box, Flex, Image } from '@chakra-ui/react'
// import { resizeBattleMap, setUpMapZooming } from '@src/Components/BattleBay/Areas/mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from '@src/Components/BattleBay/Areas/BattleBay.module.scss';

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

interface BattleMapProps {
  onChange: () => void;
}

const BattleMap = ({onChange}: BattleMapProps) => {

  const user = useAppSelector(state => state.user);
  const config = appConfig();

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
  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
  }
  const GetControlPointImage = async (id: any) => 
  {
    var data = await getControlPoint(id)
    console.log(data.leaderBoard[0].image);
    return data.leaderBoard[0].image;
  }
  function wait(ms: any){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
  }
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
    SetUpMap();
  }, []);

  const SetUpMap = async () => {
    getMap().then((data) => {
      // console.log(data);
      // resizeBattleMap(7580, 5320);
      setAreas(data.data.data.map.regions[0].controlPoints.map((controlPoint: any, i: any) => (
        <area 
          onClick={() => {
            setSelectedControlPoint(controlPoint.id); 
            selectRegion(controlPoint.id); 
            onOpen();
          }}
          coords={controlPoint.name === "Felisgarde" ? "2559,3366,499" : controlPoint.coordinates} 
          shape="circle" 
          alt= {controlPoint.id}
          className='cursor-pointer'
          title={controlPoint.name}
          />
        )))
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
        scale: 0.15,
        initialPosition: { x: -325, y: -10 },
        minScale: 0.05
      },
      sm: {
        scale: 0.16,
        initialPosition: { x: -220, y: -150 },
        minScale: 0.10
      },
      md: {
        scale: 0.18,
        initialPosition: { x: -220, y: -150 },
        minScale: 0.10
      },
      lg: {
        scale: 0.20,
        initialPosition: { x: -220, y: -150 },
        minScale: 0.10
      },
      xl: {//1920x1080
        scale: 0.24,
        initialPosition: { x: -15, y: -333 },
        minScale: 0.24
      },
      '2xl': {//ultrawide
        scale: 0.24,
        initialPosition: { x: 646, y: -100 },
        minScale: 0.24
      },
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
    const socket = io('wss://testcms.ebisusbay.biz/socket/ryoshi-dynasties/battles?walletAddress='+user.address.toLowerCase());

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

  return (
    <section>
      <ControlPointModal 
        isOpen={isOpen} 
        onClose={onClose} 
        controlPoint={controlPoint}
        refreshControlPoint={RefreshControlPoint}
        skirmishPrice={skirmishPrice}
        conquestPrice={conquestPrice}
        />
      <Box
        position='relative' h='calc(100vh - 74px)'
        backgroundImage={ImageService.translate(`/img/ryoshi-dynasties/village/background-${user.theme}.png`).convert()}
        backgroundSize='cover'
      >
        {mapInitialized && (
          <TransformWrapper
            // centerOnInit={true}
            onZoom={changeCanvasState}
            onPinching={changeCanvasState}
            onPinchingStop={changeCanvasState}
            onPanningStop={changeCanvasState}

            initialPositionX={mapProps?.initialPosition.x}
            initialPositionY={mapProps?.initialPosition.y}
            disablePadding={true}
            initialScale={mapProps?.scale}
            minScale={mapProps?.minScale}
            maxScale={1}
            >
            {(utils) => (
              <React.Fragment>

            <TransformComponent wrapperStyle={{height: '100%', width: '100%', objectFit: 'cover'}}>
              <MapFrame gridHeight={'125px 1fr 150px'} gridWidth={'150px 1fr 150px'}>
              <Box as='img'
                   src={ImageService.translate('/img/battle-bay/opMap.png').convert()}
                   maxW='none'
                   useMap="#image-map" className={`${styles.mapImageArea}`} id="fancyMenu"/>
                <map name="image-map"> {area} </map>
                <Flex position="absolute" zIndex="9" width="100%" height="100%" pointerEvents='none'>
                {flags} {explosion}
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