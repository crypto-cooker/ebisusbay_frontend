import React, {ReactElement, useEffect, useRef, useState } from 'react';
import { useDisclosure, Button, AspectRatio, useBreakpointValue, Box, Flex } from '@chakra-ui/react'
// import { resizeBattleMap, setUpMapZooming } from '@src/Components/BattleBay/Areas/mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from '@src/Components/BattleBay/Areas/BattleBay.module.scss';

import { getMap } from "@src/core/api/RyoshiDynastiesAPICalls";
import { getControlPoint } from "@src/core/api/RyoshiDynastiesAPICalls";
import ControlPointForm from '@src/Components/BattleBay/Areas/battleMap/components/ControlPointForm.js';
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import ImageService from '@src/core/services/image';
import {BattleMapHUD} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/battleMap/hud";

interface BattleMapProps {
  onChange: () => void;
}

const BattleMap = ({onChange}: BattleMapProps) => {

  const mapRef = useRef();
  const  [flagSize, setFlagSize] = useState("1px");
  const [buildingSize, setBuildingSize] = useState("50px");
  const { height, width: windowWidth } = useWindowDimensions();
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
  const [selectedControlPoint, setSelectedControlPoint] = useState(0);
  const [pins, setPins] = useState([]);
  const [explosion, setExplosion] = useState<ReactElement[]>([]);
  const [playExlplosion, setPlayExplosion] = useState(false);

  const controlPoints = [{id:4, title:"Southern Trident",pinName: "pin-Southern-Trident",marginTop: '32%', marginLeft: '20%'},
                         {id:3, title:"Dragonland",pinName: "pin-Dragonland",marginTop: '17%', marginLeft: '24%'},
                         {id:2, title:"Dwarf Mines",pinName: "pin-Dwarf-Mines",marginTop: '32%', marginLeft: '47%'},
                         {id:1, title:"Human Kingdoms",pinName: "pin-Human-Kingdoms",marginTop: '30%', marginLeft: '63%'}];

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
    //get random control point
    var explosionPoint = controlPoints[Math.floor(Math.random() * controlPoints.length)];

    // setExplosion(
    //   <div style={{position:"absolute", marginTop: explosionPoint.marginTop, marginLeft: explosionPoint.marginLeft, zIndex:"9", pointerEvents:"none"}}>
    //     <img src='/img/battle-bay/explosion.png' width={flagSize} height={flagSize} className="factionIcon"/>
    //   </div>
    // )
    // console.log("waiting");
    await new Promise(r => setTimeout(r, 1000));
    // console.log("done waiting");

    // setExplosion(
    //   <div style={{position:"absolute", marginTop: explosionPoint.marginTop, marginLeft: explosionPoint.marginLeft, zIndex:"9", pointerEvents:"none"}}>
    //     <img src='/img/battle-bay/explosion.png' width={0} height={0} className="factionIcon"/>
    //   </div>
    // )
    // setPlayExplosion(!playExlplosion);
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
    console.log(isLoading);
  }, [isLoading]);

  useEffect(() => {
    SetUpMap();
    setFlagSize(windowWidth/30 + "px");
    setBuildingSize(windowWidth/20 + "px");
  }, [controlPoint]);

  useEffect(() => {
    // SetUpPins();
    // randomlyPlayExplosion();
  }, [flagSize]);

  useEffect(() => {
    // randomlyPlayExplosion();
  }, [playExlplosion]);

  useEffect(() => {
    SetUpMap();
  }, []);

  const SetUpMap = async () => {
    getMap().then((data) => {
      console.log(data);
      // resizeBattleMap(7580, 5320);
      setAreas(data.data.data.map.regions[0].controlPoints.map((controlPoint: any, i: any) => (
        <area 
          onClick={() => {
            // console.log(controlPoint.id);
            setSelectedControlPoint(controlPoint.id); 
            selectRegion(controlPoint.id); 
            onOpen();
          }}
          coords={controlPoint.coordinates} 
          shape="circle" 
          alt= {controlPoint.name}
          className='cursor-pointer'
          />
        )))
      // map height and width, may need to be changed in the future

    }); 
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
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapScale = useBreakpointValue(
    {base: 0.15, sm: 0.6, md: 0.7, lg: 0.8, xl: 0.9, '2xl': 1},
    {fallback: 'lg'}
  )
  const mapProps = useBreakpointValue<MapProps>(
    {
      base: {
        scale: 0.15,
        initialPosition: { x: -325, y: -10 },
        minScale: 0.15
      },
      sm: {
        scale: 0.16,
        initialPosition: { x: -220, y: -150 },
        minScale: 0.16
      },
      md: {
        scale: 0.18,
        initialPosition: { x: -220, y: -150 },
        minScale: 0.18
      },
      lg: {
        scale: 0.20,
        initialPosition: { x: -220, y: -150 },
        minScale: 0.20
      },
      xl: {
        scale: 0.28,
        initialPosition: { x: -220, y: -150 },
        minScale: 0.28
      },
      '2xl': {
        scale: 0.25,
        initialPosition: { x: -0, y: -180 },
        minScale: 0.24
      }
    }
  );
 
  useEffect(() => {
    setMapInitialized(true);
  }, []);

  return (
  <section>
  <ControlPointForm isOpen={isOpen} onClose={onClose} controlPoint={controlPoint} refreshControlPoint={RefreshControlPoint}/>
  <Box position='relative' h='calc(100vh - 74px)'>
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
        <Box as='img'
             src='/img/battle-bay/opMap.png'
             maxW='none'
             useMap="#image-map" className={`${styles.mapImageArea}`} id="fancyMenu"/>
        <map name="image-map">
          {area}
        </map>
          {pins}
          {explosion}
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