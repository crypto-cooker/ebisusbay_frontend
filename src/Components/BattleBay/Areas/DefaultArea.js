import React from "react";

const DefaultArea = ({onChange}) => {
  return (
    <div>
      <p id="demo" className="basicText">Select a building</p>
      <div className="mapBorder container">
        <div id="panzoom">
          <img src="/img/battle-bay/fancyMenu2.png" useMap="#image-map" width="100%" className="maparea" id="fancyMenu"/>
          <map name="image-map" width="100%">
            <area onClick={() => onChange('bank')} alt="bank" title="bank" coords="396,763,237,839" shape="rect"/>
            <area onClick={() => onChange('barracks')} alt="barracks" title="barracks" coords="705,770,940,871"
                  shape="rect"/>
            <area onClick={() => onChange('battleMap')} alt="tradeport" title="tradeport" coords="1365,807,1638,912"
                  shape="rect" />
            <area href="announcementBoard/announcementBoard.html" alt="announcementBoard" title="announcementBoard"
                  href="" coords="742,675,1197,578" shape="rect"/>
            <area href="townHall.html" alt="townHall" title="townHall" href="" coords="293,441,588,549"
                  shape="rect"/>
            <area href="fishMarket.html" alt="fishMarket" title="fishMarket" href="" coords="1312,400,1570,502"
                  shape="rect"/>
            <area href="tavern.html" alt="tavern" title="tavern" href="" coords="113,159,298,253" shape="rect"/>
            <area href="academy.html" alt="academy" title="academy" href="" coords="1331,122,1570,215"
                  shape="rect"/>
            <area href="allianceCenter/allianceCenter.html" alt="allianceCenter" title="allianceCenter" href=""
                  coords="611,175,957,261" shape="rect"/>
          </map>
        </div>
      </div>
      <div id="pin-Alliance-Center" className="box" style={{display: 'none'}}>
        <img src="" width="64" height="64" className="factionIcon"/>
        <div className="map-Text"><h3 className="head">Alliance Hall</h3></div>
      </div>
    </div>
  )
};


export default DefaultArea;