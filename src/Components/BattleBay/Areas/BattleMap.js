import React, {useEffect } from 'react';
import { resizeBattleMap, setUpMapZooming } from './mapFunctions.js'
import { setUpBattleMap } from './battleMapFunctions.js'

const BattleMap = () => {

  useEffect(() => {
    resizeBattleMap();
    setUpBattleMap();
    // setUpMapZooming();
  });

  return (
    <section>
    <body>
    
    {/* old way of returning to village map */}
    {/* <div>
      <button class="btn" onclick="window.location.href='../villageMap.html'">back</button>
    </div> */}

  <div class="form-popup form-container" id="myForm">
    <form action="/action_page.php" class="form-container">
      <h1 id="selectedRegion" class = "TitleText"> Region Name</h1>
      <button type="button" class="x" onclick="closeForm()">Cancel</button>

      <div class="form-container">
        <button type="button" name="tablinks" class="smallBtnSelected" onclick="openPanel(event, 'Info'), RefreshInfo()">Info</button>
        <button type="button" name="tablinks" class="smallBtnDisabled" onclick="openPanel(event, 'Deploy')">Deploy</button>
        <button type="button" name="tablinks" class="smallBtnDisabled" onclick="openPanel(event, 'Attack')">Attack</button>
      </div>

  {/* <!-- Deploy Tab --> */}
  <div id="Deploy" class="tabcontent">
    <div >
      <button type="button" id="deploy" class="smallBtnSelected" onclick="selectDeploy()">Deploy</button>
      <button type="button" id="recall" class="smallBtnDisabled" onclick="selectRecall()">Recall</button>
      <p id="troops" class = "basicText" ></p>

      <label class = "basicText" style ="float: left;" for="quantity">Please select a faction:</label>
      <input type="text"  id="deployFactionInput" onkeyup="filterFactions('deployFactionInput','deployFactionUl')"
        onclick="filterFactions('deployFactionInput','deployFactionUl')" placeholder="Search for faction.."class = "entryField"/>
      <ul id="deployFactionUl"> </ul>

      <p></p>
      <label class = "basicText" for="quantity">Quantity:</label>
      <input class = "css-1fzih88" type="number" id="quantity" name="quantity" min="0"/>
      <p></p>

      <button type="button" class="btn" onclick="Apply()">Apply</button>
      <button type="button" class="btn cancel" onclick="closeForm()">Cancel</button>
    </div>
  </div>

  {/* <!-- Attack Tab --> */}
  <div id="Attack" class="tabcontent">
    <div id="attackSetUp" style="display: block;">
      <div class="container">
        <p>If you are a faction owner, you will be able to attack other troops in the region with troops you have deployed</p>
        <div class="row">
        </div>
      </div>
            <div class="column border-right">
                <p>Attackers</p>
                <label class = "basicText" style ="float: left;" for="quantity">Attacker Faction:</label>
                <input type="text"  id="attackerFactionInput" onkeyup="filterFactions('attackerFactionInput','attackerFactionUl')" 
                  onclick="filterFactions('attackerFactionInput','attackerFactionUl')" placeholder="Search for faction.."class = "entryField"/>
                <ul id="attackerFactionUl"> </ul>

                <label class = "basicText" for="wager" id="troopsToAttackWith">Troops to wager (max 0):</label>
                <input class = "css-1fzih88" type="number" id="troopsToAttackWithInput" name="wager" min="0"/>
                <p></p>
            </div>
            <div class="column border-left">
                <p>Defenders</p>
                <label class = "basicText" for="quantity">Select A Faction to attack:</label>
                <input type="text"  id="defenderFactionInput" onkeyup="filterFactions('defenderFactionInput','defenderFactionUL')" 
                  onclick="filterFactions('defenderFactionInput','defenderFactionUL')" placeholder="Search for faction.."class = "entryField"/>
                <ul id="defenderFactionUL"></ul>
            </div>

        <div class="bottomform">
          <label class = "basicText" id="battleText" for="Battle"><br/></label>
          <label class = "basicText right" for="attackCost">Cost: 100 Token</label>
          <button type="button" class="btn" onclick="Battle()">Confirm Attack</button>
          <div title="When attacking, a D6 roll is made for both the attacker and the defender. 
            The lower roll (ties going to defender) loses a troop. This continues until one 
              side has run out of troops">How are Attacks Calculated? (Hover for info)</div>
        </div>
  </div>
    <div id="attackConclusion" style="display: none;">
      <div class="container">
        <p id="attackOutcome">Victory!</p>
        <div class="row">
          <div class="column border-right">
            <p>Attackers</p>
            <label class = "basicText" id="attackerOutcome">Mad Merkat: -7 of 10</label>
            <p></p>
          </div>
          <div class="column border-left">
            <p>Defenders</p>
            <label class = "basicText" id="defenderOutcome">CroSkull: -5 of 5</label>
          </div>
        </div>
        <div class="bottomform">
          <button type="button" class="btn cancel" onclick="attackAgain()">Attack Again</button>
          <button type="button" class="minibtn" id="resultsButton" onclick="showDetailedResults()">See detailed results</button>
        </div>
      </div>

      <div class="form-popup" id="detailedResultsForm" style="display: none; overflow-y: scroll; 
        min-height:300px; height:300px;">
        <form class="form-container">
          <label class = "basicText" id="">Results:</label>
          <p id="outcomeLog"></p>
        </form>
      </div>

    </div>
  </div>

  {/* <!-- Info Tab --> */}
  <div id="Info" class="tabcontent" style="display: block;">
      {/* <!-- Table Showing Deployed Troops --> */}
  <p id="region Bonus" class = "basicText"> The faction with the highest troop count on (Date & Time Here) will recieve a reward of (Reward Here)</p>
  <div class="mt-4 table-responsive">
    <table class="table">
    <thread class="border-bottom">
        <tr>
            <th scope="col" class="tex-center">Rank</th>
            <th scope="col" class="tex-center">Faction</th>
            <th scope="col" class="tex-center">Troops</th>
        </tr>
    </thread>
    <tbody id="troopsTable">
    </tbody>
</table>
  </div>
  </div>
  
  </form>
</div>


<p id="demo" class = "basicText">Select a region to deploy troops to</p> 

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

<p id="regionName" class = "TitleText"></p>
<p id="desc" class="css-1fzih88">Mouse over a region to see the troops deployed to it.</p>
<p id="deploymentNotes" class = "basicText"></p>
{/* <!-- <button onclick="reset_troops()">Reset</button>--> */}
<p class = "basicText" id="troopsAppiled"></p>
<meta name="viewport" content="width=device-width, initial-scale=1"/> 
  
</body>

{/* <!-- close all the forms if clicked --> */}
<div id="overlay2" onclick="closeForm(), closeDelegateForm(), closeRegistrationForm()"></div>

{/* <!-- <script type="text/javascript" src="../jquery-1.6.2.min.js"></script> --> */}
{/* <!-- <script type="text/javascript" src="jquery.maphilight.js"></script> --> */}
<script type="text/javascript" src="fantasyRisk.js"></script>
<script type="text/javascript" src="deployToops.js"></script>
{/* <!-- <script type="text/javascript" src="../factions/registerFaction.js"></script> */}
{/* <script type="text/javascript" src="../factions/delegateToFaction.js"></script> --> */}
{/* <!-- <script type="text/javascript" src="jquery.imagemapster.js"></script> --> */}
<script src="../attack/attackSetUp.js"></script>
<script src="../attack/attack.js"></script>
<script type="text/javascript" src="../mapStuff/mapControls.js"></script>

{/* <!-- resize Map --> */}
</section>
  )
};


export default BattleMap;