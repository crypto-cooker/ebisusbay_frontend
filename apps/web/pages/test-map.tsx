import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import MapFrame from "@src/components-v2/feature/ryoshi-dynasties/components/map-frame";
import React, {useEffect, useState} from "react";
import {Box, useBreakpointValue} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import styles from "@src/Components/BattleBay/Areas/BattleBay.module.scss";

const TestMap = () => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapProps = useBreakpointValue<MapProps>(
    {
      base: {
        scale: 0.4,
        minScale: 0.15,
        centerOnInit: true
      },
      sm: {
        scale: 0.5,
        minScale: 0.5,
        centerOnInit: false
      },
      md: {
        scale: 0.5,
        minScale: 0.5,
        centerOnInit: false
      },
      lg: {
        scale: 0.5,
        minScale: 0.5,
        centerOnInit: false
      },
      xl: {//1920x1080
        scale: 0.55,
        minScale: 0.55,
        centerOnInit: false
      },
      '2xl': { //ultrawide
        scale: 0.7,
        minScale: 0.7,
        centerOnInit: false
      },
    }
  );

  useEffect(() => {
    if (mapProps) {
      setMapInitialized(true);
    }
  }, [mapProps]);

  return (
    <Box
      position='relative' h='calc(100vh - 74px)'
      // backgroundImage={ImageService.translate(`/img/ryoshi-dynasties/village/background-${user.theme}.png`).convert()}
      backgroundSize='cover'
    >
      {mapInitialized && (
        <TransformWrapper
          // centerOnInit
          centerZoomedOut={true}
          initialScale={mapProps!.scale}
          minScale={mapProps!.minScale}
          // {({zoomIn, zoomOut, resetTransform, ...utils})}
        >
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
                />
                <map name="image-map">
                </map>
              </MapFrame>
            </TransformComponent>
          </React.Fragment>

        </TransformWrapper>
      )}
    </Box>
  )
}

export default TestMap;

interface MapProps {
  scale: number;
  minScale: number;
  centerOnInit?: boolean;
}