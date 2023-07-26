import React, {ReactElement, useEffect, useRef, useState, useContext } from 'react';
import {
  useDisclosure,
  Button,
  AspectRatio,
  useBreakpointValue,
  Box,
  Flex,
  Image,
  Avatar,
  WrapItem,
  Text
} from '@chakra-ui/react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles0 from '@src/Components/BattleBay/Areas/BattleBay.module.scss';
import ImageService from '@src/core/services/image';
import {LandsHUD} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/lands/lands-hud";
import {useAppSelector} from "@src/Store/hooks";

import {appConfig} from "@src/Config";
import MapFrame from "@src/components-v2/feature/ryoshi-dynasties/components/map-frame";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {
  RyoshiDynastiesPreloaderContext,
  RyoshiDynastiesPreloaderProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/preloader-context";
import localFont from "next/font/local";
import LandModal from './land-modal';
import myData from './points.json';

const gothamCondBlack = localFont({ src: '../../../../../../fonts/GothamCond-Black.woff2' })

interface BattleMapProps {
  onBack: () => void;
}

const DynastiesLands = ({onBack}: BattleMapProps) => {
  const { getPreloadedImage } = useContext(RyoshiDynastiesPreloaderContext) as RyoshiDynastiesPreloaderProps;

  const user = useAppSelector(state => state.user);
  const config = appConfig();
  const { config: rdConfig, user:rdUser, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const transformComponentRef = useRef<any>(null)
  const previousElementToZoomTo = useRef<any>(null)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [zoomState, setZoomState] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  const [area, setAreas] = useState<ReactElement[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [plotId, setPlotId] = useState(0);

  //zoomin
  const [elementToZoomTo, setElementToZoomTo] = useState("");
  useEffect(() => {
    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current as any;
      zoomToElement(elementToZoomTo);
      setPlotId(Number(elementToZoomTo));
      onOpen();
    }
    // if(previousElementToZoomTo !== elementToZoomTo){
    //   // previousElementToZoomTo.
    //   setPreviousElementToZoomTo(elementToZoomTo);
    // }
  }, [elementToZoomTo]);

  const loadPoints = () => {
    setAreas(
      myData.vectors.map((point: any, i :number) => (
      <Text
        position="absolute"
        textAlign="center"
        textColor={'#aaa'}
        cursor="pointer"
        id={i.toString()}
        fontSize={8}
        width={6}
        height={3}
        left={point.x}
        top={1662 - point.y}
        zIndex="10"
        onClick={() => {
          setElementToZoomTo((i+1).toString());
          setPlotId(i+1);
          onOpen();
        }}
        >{i+1}</Text>
      )))
    
    setMapInitialized(true);
  }

  useEffect(() => {
    loadPoints();
  }, []);

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
    <section>
      <LandModal 
        isOpen={isOpen} 
        onClose={onClose}
        plotId={plotId}
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
            initialScale={mapProps?.scale}
            initialPositionX={mapProps?.initialPosition.x}
            initialPositionY={mapProps?.initialPosition.y}
            minScale={mapProps?.minScale}
            maxScale={2.5}
            >
            {(utils) => (
              <React.Fragment>

            <TransformComponent wrapperStyle={{height: '100%', width: '100%', objectFit: 'cover'}}>
              <MapFrame gridHeight={'50px 1fr 50px'} gridWidth={'50px 1fr 50px'} w='2048px' h='1662px'>
                <Box
                  as='img'
                  //  src={'/img/ryoshi-dynasties/lands/emptyIsland.png'}
                   src={getPreloadedImage(ImageService.translate('/img/ryoshi-dynasties/lands/emptyIsland.png').custom({width: 2048, height: 1662}))}
                   maxW='none'
                   useMap="#imageMap" 
                   className={`${styles0.mapImageArea}`} 
                   id="fancyMenu"
                />
                <map name="imageMap" > 
                  {/* {area}  */}
                </map>
                <Flex position="absolute" zIndex="0" width="100%" height="100%">
                {area}
                {/* <div className={gothamCondBlack.className}>
                  <div className={styles.water}></div>
                  <div id='beach' className={[styles.buccaneer_beach, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Buccaneer Beach")}>
                    <div className={[styles.worldmap_label, styles.buccaneer_beach_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Buccaneer Beach")}></Avatar>Buccaneer Beach</div> </div>
                </div> */}
                
                </Flex>
                </MapFrame>
              </TransformComponent>
              </React.Fragment>
              )}
            </TransformWrapper>
        )}
        <LandsHUD onBack={onBack} setElementToZoomTo={setElementToZoomTo}/>
      </Box>
    </section>
  )
};


export default DynastiesLands;

interface MapProps {
  scale: number;
  initialPosition: { x: number; y: number };
  minScale: number;
}