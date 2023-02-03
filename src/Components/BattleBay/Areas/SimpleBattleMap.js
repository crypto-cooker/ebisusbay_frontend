import React, {useEffect } from 'react';
import { resizeBattleMap, setUpMapZooming } from './mapFunctions.js'
import { setUpBattleMap } from './battleMapFunctions.js'

const SimpleBattleMap = ({onBack}) => {

  useEffect(() => {
    resizeBattleMap();
    setUpBattleMap();
    // setUpMapZooming();
  });

  return (
    <section>
  <div class="mapBorder container" >
    <div id="panzoom" >
      <img src="/img/battle-bay/fantasyRisk2.png" alt="Trulli" usemap="#image-map" width="100%" class="maparea" id="islandMap" />
      <map name="image-map" width="100%">
      <area onmouseover="getRegionStats(title, 'pin-Southern-Trident')" target="" alt="Southern Trident" title="Southern Trident" onclick="selectRegion(title), openForm()"
            coords="255,534,295,532,337,554,396,534,410,481,351,411,331,377,264,391,225,377,208,430,157,439,191,515" shape="poly"/> 
        <area onmouseover="getRegionStats(title, 'pin-Dragonland')" target="" alt="Dragonland" title="Dragonland" onclick="selectRegion(title), openForm()" 
            coords="199,290,208,338,225,368,269,380,328,371,446,298,387,231,421,191,354,160,208,37,185,129,216,214,239,256,295,259,300,309,258,326,233,293" shape="poly"/> 
        <area onmouseover="getRegionStats(title, 'pin-Dwarf-Mines')" target="" alt="Dwarf Mines" title="Dwarf Mines" onclick="selectRegion(title), openForm()" 
            coords="438,529,455,478,491,470,502,349,589,352,699,318,724,340,721,447,699,475,721,520,778,540,741,568,640,546,640,489,550,481,516,526,469,543" shape="poly"/>
        <area onmouseover="getRegionStats(title, 'pin-Human-Kingdoms')" target="" alt="Human Kingdoms" title="Human Kingdoms" onclick="selectRegion(title), openForm()" 
            coords="825,567,853,576,891,569,900,558,939,562,961,564,981,558,1018,564,1033,553,1038,517,1027,476,1004,499,954,521,918,517,914,497,902,474,889,458,898,427,900,400,893,379,877,359,850,361,821,357,807,366,776,363,753,352,737,339,712,361,728,370,724,384,735,397,719,418,728,449,708,460,685,474,710,491,721,521,753,542,778,536,782,512,805,503,823,485,853,497,873,506,873,519,850,533,846,548,837,556" shape="poly"/>
      </map>

      <div id="pin-Southern-Trident" onmouseover="getRegionStats(title, 'pin-Southern-Trident')" title="Southern Trident"
        onclick="selectRegion(title), openForm()" class="box">
        <img src=""  width="64" height="64" class="factionIcon"/>
        <div class="pin-text"><h3 class="head">pin-Southern-Trident</h3></div>
      </div>
      <div id="pin-Dragonland" onmouseover="getRegionStats(title, 'pin-Dragonland')" title="Dragonland" 
        onclick="selectRegion(title), openForm()" class="box">
        <img src=""  width="64" height="64" class="factionIcon"/>
        <div class="pin-text"><h3 class="head">pin-dragon</h3></div>
      </div>
      <div id="pin-Dwarf-Mines" onmouseover="getRegionStats(title, 'pin-Dwarf-Mines')" title="Dwarf Mines" 
        onclick="selectRegion(title), openForm()" class="box">
        <img src=""  width="64" height="64" class="factionIcon"/>
        <div class="pin-text"><h3 class="head">pin-Dwarf-Mines</h3></div>
      </div>
      <div id="pin-Human-Kingdoms" onmouseover="getRegionStats(title, 'pin-Human-Kingdoms')" title="Human Kingdoms"
        onclick="selectRegion(title), openForm()" class="box">
        <img src=""  width="64" height="64" class="factionIcon"/>
        <div class="pin-text"><h3 class="head">pin-Human-Kingdoms</h3></div>
      </div>

    </div>
  </div>





{/* <!-- resize Map --> */}
</section>
  )
};


export default SimpleBattleMap;