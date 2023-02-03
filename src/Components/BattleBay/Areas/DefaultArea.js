import React, {useEffect, Component } from 'react';
import { resizeMap } from './mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const DefaultArea = ({onChange}) => {

  // const [count] = useState(0);

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `Page has loaded`;
    console.log("this is from useEffect")
    // setUpLeaderboard();
    resizeMap();
  });

  return (
    <section>
       {/* onLoad={() => setUpLeaderboard()}> */}
    <div>
      {/* <p>You clicked {count} times</p> */}
      {/* <button onLoad={() => setUpLeaderboard()} onClick={() => setUpLeaderboard()}> */}
      {/* <button onClick={() => setCount(count + 1)}> */}
      {/* Version 2 */}
      {/* </button> */}
    </div>
      <p id="demo" className="basicText">Version 3</p>
      <div className="mapBorder container">
      <TransformWrapper>
        <TransformComponent>

        {/* <div id="panzoom"> */}
          <img src="/img/battle-bay/fancyMenu2.png" useMap="#image-map" width="100%" className="maparea" id="fancyMenu"/>
          <map name="image-map" width="100%">
            <area onClick={() => onChange('bank')} alt="bank" title="bank" coords="396,763,237,839" shape="rect"/>
            <area onClick={() => onChange('barracks')} alt="barracks" title="barracks" coords="705,770,940,871" shape="rect"/>
            <area onClick={() => onChange('battleMap')} alt="tradeport" title="tradeport" coords="1365,807,1638,912" shape="rect" />
            <area onClick={() => onChange('announcementBoard')} alt="announcementBoard" title="announcementBoard" coords="742,675,1197,578" shape="rect"/>
            <area onClick={() => onChange('simpleBattleMap')} href="townHall" alt="townHall" title="townHall" coords="293,441,588,549" shape="rect"/>
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