import React, {useEffect, useRef, useState } from 'react';
import { resizeMap } from './mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from './BattleBay.module.scss';

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
    document.title = `Page has loaded`;
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
       {/* onLoad={() => setUpLeaderboard()}> */}
    <div >
    </div>
      <p id="demo" className="basicText">Version 2</p>
      <div className="mapBorder container">
      <TransformWrapper
        onZoom={changeCanvasState}
        onPinching={changeCanvasState}
        onPinchingStop={changeCanvasState}
        onPanningStop={changeCanvasState}
        // onPanning={() => setModalFlag('none')}
        >
        <TransformComponent>

        <div className="mapDiv">
        <img src="/img/battle-bay/fancyMenu2.png" useMap="#image-map" width="100%" className={`${styles.mapImageArea}`} id="fancyMenu"/>
        {/* <div onClick={() => onChange('bank')}> bandk  */}
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
          </map>
          {/* </div> */}
        </div>

        </TransformComponent>
      </TransformWrapper>
      </div>
      <div id="pin-Alliance-Center" className="box" style={{display: 'none'}}>
        <img src="" width="64" height="64" className="factionIcon"/>
        <div className="map-Text"><h3 className="head">Alliance Hall</h3></div>
      </div>

    </section>
  )
};


export default DefaultArea;