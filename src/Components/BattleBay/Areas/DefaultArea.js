import React, {useEffect, useState } from 'react';
import { resizeMap } from './mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from './BattleBay.module.scss';
import {
  Button,
  Flex,
  Box,
  Spacer,
} from "@chakra-ui/react"

const DefaultArea = ({onChange}) => {

  const [tempWidth, setTempWidth] = useState(1);
  const [tempHeight, setTempHeight] = useState(1);
  const [subDistanceX, setSubDistanceX] = useState(0);
  const [subDistanceY, setSubDistanceY] = useState(0);

  const [zoomState, setZoomState] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `Page has loaded`;
    // setUpLeaderboard();
    resizeMap();
  });
  const changeCanvasState = (ReactZoomPanPinchRef, event) => {
    setZoomState({
      offsetX: ReactZoomPanPinchRef.state.positionX,
      offsetY: ReactZoomPanPinchRef.state.positionY,
      scale: ReactZoomPanPinchRef.state.scale,
    });
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

      <TransformWrapper
        onZoom={changeCanvasState}
        onPinching={changeCanvasState}
        onPinchingStop={changeCanvasState}
        onPanningStop={changeCanvasState}
        >
        <TransformComponent>

        <div className="mapDiv">
        {/* <img src="/img/battle-bay/fancyMenu2.png" useMap="#image-map" width="100%" className={`${styles.mapImageArea}`} id="fancyMenu"/>
            <map name="image-map" width="100%" height="100%" className={`${styles.mapImageArea}`} >
            <area onClick={() => onChange('bank')} alt="bank" title="bank" coords="396,763,237,839" shape="rect"/>
            <area onClick={() => onChange('barracks')} alt="barracks" title="barracks" coords="705,770,940,871" shape="rect"/>
            <area onClick={() => onChange('battleMap')} alt="tradeport" title="tradeport" coords="1365,807,1638,912" shape="rect" />
            <area onClick={() => onChange('announcementBoard')} alt="announcementBoard" title="announcementBoard" coords="742,675,1197,578" shape="rect"/>
            <area onClick={() => onChange('townHall')} alt="townHall" title="townHall" coords="293,441,588,549" shape="rect"/>
            <area onClick={() => onChange('fishMarket')} alt="fishMarket" title="fishMarket" coords="1312,400,1570,502" shape="rect"/>
            <area onClick={() => onChange('tavern')} alt="tavern" title="tavern" coords="113,159,298,253" shape="rect"/>
            <area onClick={() => onChange('academy')} alt="academy" title="academy" coords="1331,122,1570,215" shape="rect"/>
            <area onClick={() => onChange('allianceCenter')} alt="allianceCenter" title="allianceCenter" coords="611,175,957,261" shape="rect"/>
          </map> */}
          <img src="/img/battle-bay/newMap.png" useMap="#image-map" width="100%" className={`${styles.mapImageArea}`} id="fancyMenu"/>
          <map name="image-map">
              <area onClick={() => onChange('barracks')} alt="Barracks" title="Barracks" coords="194,622,568,968" shape="rect"/>
              <area onClick={() => onChange('townHall')} alt="Town Hall" title="Town Hall" coords="793,434,1259,861" shape="rect"/>
              <area onClick={() => onChange('tavern')} alt="Tavern" title="Tavern" coords="377,255,763,531" shape="rect"/>
              <area onClick={() => onChange('allianceCenter')} alt="Alliance Center" title="Alliance Center" coords="1044,45,1342,414" shape="rect"/>
              <area onClick={() => onChange('bank')} alt="Bank" title="Bank" coords="1367,283,1808,575" shape="rect"/>
              <area onClick={() => onChange('academy')} alt="Academy" title="Academy" coords="2118,246,2523,565" shape="rect"/>
              <area onClick={() => onChange('battleMap')} alt="Fish Market" title="Fish Market" coords="1971,974,2487,1361" shape="rect"/>
              <area onClick={() => onChange('announcementBoard')} alt="Announcement Board" title="Announcement Board" coords="1813,494,2073,798" shape="rect"/>
          </map>
        </div>

        </TransformComponent>
      </TransformWrapper>

      </div>
      
    </section>
  )
};


export default DefaultArea;