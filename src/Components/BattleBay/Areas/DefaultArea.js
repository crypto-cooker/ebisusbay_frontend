import React, {useEffect, useState } from 'react';
import { resizeNewMap } from './mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from './BattleBay.module.scss';
import {
  Button,
  Flex,
  Box,
  Spacer,
} from "@chakra-ui/react"

const DefaultArea = ({onChange}) => {

  // const [tempWidth, setTempWidth] = useState(1);
  // const [tempHeight, setTempHeight] = useState(1);
  // const [subDistanceX, setSubDistanceX] = useState(0);
  // const [subDistanceY, setSubDistanceY] = useState(0);
  // const [tavernGif, setTavernGif] = useState();

  const [zoomState, setZoomState] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  
  useEffect(() => {
    // resizeNewMap();
    console.log("DefaultArea useEffect");
    console.log("zoomState: " + zoomState.scale)
    // setTavernGif(<div style={{position:"absolute", marginTop: '5%', marginLeft: '10%', zIndex:"9", pointerEvents:"none"}}>
    //              <img src='/img/battle-bay/tavern_gif.gif' width={200} height={200} />
    //              </div>)
  }, []);

  const changeCanvasState = (ReactZoomPanPinchRef, event) => {
    setZoomState({
      offsetX: ReactZoomPanPinchRef.state.positionX,
      offsetY: ReactZoomPanPinchRef.state.positionY,
      scale: ReactZoomPanPinchRef.state.scale,
    });
    // console.log("scale: " + ReactZoomPanPinchRef.state.scale)
  };

  return (
    <section>
      
      <div>
      <Flex>
        <Spacer/>
        <Box p='3'>
          <Button style={{ display: 'flex', marginTop: '16px' }} 
            onClick={() => onChange('userPage')} variant='outline'size='lg'> 
            User Profile</Button>
        </Box>
      </Flex>

      <TransformWrapper scale={0.5} positionX={200} positionY={100}
        limitToBounds={true}
        onZoom={changeCanvasState}
        onPinching={changeCanvasState}
        onPinchingStop={changeCanvasState}
        onPanningStop={changeCanvasState}
        >
        <TransformComponent>

        <div className={[styles.background, "mapDiv"].join(' ')} id="fancyMenu">
        {/* {tavernGif} */}

          {/* <img src="/img/battle-bay/newMap.png" useMap="#image-map" width="100%" className={`${styles.mapImageArea}`} id="fancyMenu"/>
          <map name="image-map">
              <area onClick={() => onChange('barracks')} alt="Barracks" title="Barracks" coords="194,622,568,968" shape="rect"/>
              <area onClick={() => onChange('townHall')} alt="Town Hall" title="Town Hall" coords="793,434,1259,861" shape="rect"/>
              <area onClick={() => onChange('tavern')} alt="Tavern" title="Tavern" coords="377,255,763,531" shape="rect"/>
              <area onClick={() => onChange('allianceCenter')} alt="Alliance Center" title="Alliance Center" coords="1044,45,1342,414" shape="rect"/>
              <area onClick={() => onChange('bank')} alt="Bank" title="Bank" coords="1367,283,1808,575" shape="rect"/>
              <area onClick={() => onChange('academy')} alt="Academy" title="Academy" coords="2118,246,2523,565" shape="rect"/>
              <area onClick={() => onChange('battleMap')} alt="Fish Market" title="Fish Market" coords="1971,974,2487,1361" shape="rect"/>
              <area onClick={() => onChange('announcementBoard')} alt="Announcement Board" title="Announcement Board" coords="1813,494,2073,798" shape="rect"/>
          </map> */}

          <div className={styles.pond} ></div>	
          <div className={styles.flowers1}></div>
          <div className={[styles.bank, styles.enlarge].join(' ')} onClick={() => onChange('bank')}/>
          <div className={[styles.tavern, styles.enlarge].join(' ')}>
            <img className={styles.image1} src="/img/battle-bay/mapImages/tavern_turbine.png" />
            <img className={styles.image2} src="/img/battle-bay/mapImages/tavern.png" onClick={() => onChange('tavern')}/>
          </div>
          <div className={[styles.academy, styles.enlarge].join(' ')} onClick={() => onChange('academy')}/>
          <div className={[styles.townhall, styles.enlarge].join(' ')}/>
          <div className={[styles.announcement, styles.enlarge].join(' ')}/>

          <div className={styles.water}/>
          <div className={[styles.fishmarket, styles.enlarge].join(' ')}/>
          <div className={[styles.boat, styles.enlarge].join(' ')}  onClick={() => onChange('battleMap')}/>
          <div className={styles.flowers2}></div>

          <div className={[styles.allianceCenter, styles.enlarge].join(' ')} onClick={() => onChange('allianceCenter')}/>
          <div className={[styles.barracks, styles.enlarge].join(' ')} onClick={() => onChange('barracks')}>
            <div className={[styles.swordsmen, styles.enlarge].join(' ')} onClick={() => onChange('barracks')}/>
          </div>
          <div className={[styles.ebisustatue, styles.enlarge].join(' ')}/>
          <div className={[styles.moongate, styles.enlarge].join(' ')}/>
          <div className={styles.torii}/>
          <div className={styles.flowers3}></div>
        </div>
        {/* </Flex> */}

        </TransformComponent>
      </TransformWrapper>

      </div>
    </section>
  )
};


export default DefaultArea;