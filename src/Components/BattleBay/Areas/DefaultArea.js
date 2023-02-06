import React, {useEffect, useRef, useState } from 'react';
import { resizeMap } from './mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from './BattleBay.module.scss';

const DefaultArea = ({onChange}) => {
  // const mapRef = useRef();
  // const borderRef = useRef();

  // const [count] = useState(0);
  const [tempWidth, setTempWidth] = useState(1);
  const [tempHeight, setTempHeight] = useState(1);
  const [subDistanceX, setSubDistanceX] = useState(0);
  const [subDistanceY, setSubDistanceY] = useState(0);
  // const [modalFlag, setModalFlag] = useState('none');
  // const [canvasDown, setCanvasDown] = useState(false);
  const [zoomState, setZoomState] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  const getMousePos = (e) => {
    var rect = e.target.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };
  const handleClick = (e) => {
    console.log('you clicked', e);
    const mPos = getMousePos(e);
    console.log('mouse pos', mPos);
    let scale = zoomState.scale;
    // const tileWidth = ref2.current.width / 54;
    // const tileHeight = ref2.current.height / 28;
    // const xPos = Math.floor(mPos.x / (tileWidth * scale));
    // const yPos = Math.floor(mPos.y / (tileHeight * scale));
    // const type = getTileType(xPos, yPos);
    // devLog(type, xPos, yPos, tileInfo);
    // let ctx = ref2.current.getContext('2d');
    // ctx.clearRect(tileWidth * tileInfo.xPos - 1, tileHeight * tileInfo.yPos - 1, tileWidth + 1, tileHeight + 2);

    // const prevTokenId = getTokenId(tileInfo.xPos, tileInfo.yPos);
    // if (listingForToken(prevTokenId)) {
    //   ctx.fillStyle = 'rgba(50, 50, 50, 0.5)';
    //   ctx.fillRect(tileWidth * tileInfo.xPos - 1, tileHeight * tileInfo.yPos - 1, tileWidth + 1, tileHeight + 2);
    // }

    // if (type === 0 || type === 4) {
    //   setModalFlag('none');

    //   return;
    // }

    // const tokenId = getTokenId(xPos, yPos);
    // const listing = listingForToken(tokenId);
    // const nft = nftForToken(tokenId);
    // devLog('selected data', nft, listing);
    // let price = 0;
    // if (listing) {
    //   price = listing.market.price;
    // }

    // const globalX = mPos.x + zoomState.offsetX - (subDistanceX > 0 ? 240 - subDistanceX : 0);
    // const globalY = mPos.y + zoomState.offsetY - (subDistanceY > 0 ? 175 - subDistanceY : 0);

    // setSubDistanceX(0);
    // setSubDistanceY(0);
  };
  
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `Page has loaded`;
    console.log("this is from useEffect")
    // setUpLeaderboard();
    resizeMap();
    // borderRef.current.height = (borderRef.current.clientWidth * 2703) / 4532;
    // let canvas_width = (borderRef.current.clientWidth * 3.65) / 6;
    // let canvas_height = (canvas_width * 620) / 1189;
    // mapRef.current.width = canvas_width;
    // mapRef.current.height = canvas_height;
    // mapRef.current.width = 1000;
    // mapRef.current.height = 1000;

    // setTempWidth(mapRef.current.width);
    // setTempHeight(mapRef.current.height);
    // setTempWidth(1920);
    // setTempHeight(1080);
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
      {/* <p>You clicked {count} times</p> */}
      {/* <button onLoad={() => setUpLeaderboard()} onClick={() => setUpLeaderboard()}> */}
      {/* <button onClick={() => setCount(count + 1)}> */}
      {/* Version 2 */}
      {/* </button> */}
    </div>
      <p id="demo" className="basicText">Version 9</p>
      <div 
      // className={`${styles.bitpixel_back}`}
      className="mapBorder container">
        {/* //  ref={borderRef}> */}
      <TransformWrapper
        onZoom={changeCanvasState}
        onPinching={changeCanvasState}
        onPinchingStop={changeCanvasState}
        onPanningStop={changeCanvasState}
        // onPanning={() => setModalFlag('none')}
        >
        <TransformComponent>

        {/* <div id="panzoom"> */}
          {/* <canvas className={`${styles.canvasFront}`} ref={mapRef} onClick={handleClick}></canvas> */}
        <img src="/img/battle-bay/fancyMenu2.png" usemap="#image-map" width="100%" class="maparea" id="fancyMenu" />
          {/* <img src="/img/battle-bay/fancyMenu2.png"             style={{ width: `${tempWidth}px`, height: `${tempHeight}px` }}            useMap="#image-map" width="100%" id="fancyMenu"/> */}
            {/* useMap="#image-map" width="100%" className="maparea" id="fancyMenu"/> */}
          {/* <map style={{ width: `${tempWidth}px`, height: `${tempHeight}px` }} */}
            {/* name="image-map" width="100%" className={`${styles.canvasFront}`} ref={mapRef} onClick={handleClick}> */}
            <map name="image-map" width="100%">
            <area onClick={() => onChange('bank')} alt="bank" title="bank" coords="396,763,237,839" shape="rect"/>
            <area onClick={() => onChange('barracks')} alt="barracks" title="barracks" coords="705,770,940,871" shape="rect"/>
            <area onClick={() => onChange('battleMap')} alt="tradeport" title="tradeport" coords="1365,807,1638,912" shape="rect" />
            <area onClick={() => onChange('announcementBoard')} alt="announcementBoard" title="announcementBoard" coords="742,675,1197,578" shape="rect"/>
            <area onClick={() => onChange('simpleBattleMap')} alt="townHall" title="townHall" coords="293,441,588,549" shape="rect"/>
            {/* <area onClick={() => onChange('battleMap')} href="fishMarket.html" alt="fishMarket" title="fishMarket" coords="1312,400,1570,502" shape="rect"/> */}
            {/* <area onClick={() => onChange('battleMap')} href="tavern.html" alt="tavern" title="tavern" coords="113,159,298,253" shape="rect"/> */}
            {/* <area onClick={() => onChange('battleMap')} href="academy.html" alt="academy" title="academy" coords="1331,122,1570,215" shape="rect"/> */}
            <area onClick={() => onChange('allianceCenter')} alt="allianceCenter" title="allianceCenter" coords="611,175,957,261" shape="rect"/>
          </map>
        {/* </div> */}
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