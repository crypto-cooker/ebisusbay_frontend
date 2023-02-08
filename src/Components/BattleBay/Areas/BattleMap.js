import React, {useEffect, useRef, useState } from 'react';
import { resizeBattleMap, setUpMapZooming } from './mapFunctions.js'
// import { setUpBattleMap, selectRegion, getRegionStats, holdRefs } from './battleMapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from './BattleBay.module.scss';


const BattleMap = ({onBack}) => {
  const titleRef = useRef();
  const troopsTableRef = useRef();
  const defenderFactionInputRef = useRef();
  const node = titleRef.current;
  var selectedRegion = "None";
  const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club", "connected wallet"];
  const regionFlags = ["pin-Southern-Trident", "pin-Dragonland", "pin-Human-Kingdoms", "pin-Dwarf-Mines"];
  const deployMode = new Boolean(true);
  var selectedFaction = "";
  var troopsAvailable = 20;
  var defenderFactionInput;
  class Deployment {
    constructor(region, faction, amount, deploymentOwner) {
      this.code = region + faction;
      this.region = region;
      this.faction = faction;
      this.amount = amount;
    }
    addTroops(amount) {
        this.amount += amount;
      }
    getDetails() {
        return "You have deployed " + this.amount +" troops on behalf of "+ this.faction +" to " + this.region + "<br>";
      }};
class DeployedTroops {
    constructor(){
      this.deployments = []
    }
    newDeployment(region, faction, amount){
      let d = new Deployment(region, faction, amount)
      this.deployments.push(d)
      return d
    }
    get allPlayers(){
      return this.deployments
    }
    get numberOfPlayers(){
        return this.deployments.length
    }
    get totalTroops(){
        let total = 0
        this.deployments.forEach(d => total += d.amount)
        console.log(total)
        return total
    }
  }

let deployedTroops = new DeployedTroops()

  useEffect(() => {
    console.log("this is from battleMap useEffect")
    // holdRefs(defenderFactionInputRef);
    resizeBattleMap();
    setUpBattleMap();
    // setUpMapZooming();
  });
  const [zoomState, setZoomState] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  const changeCanvasState = (ReactZoomPanPinchRef, event) => {
    setZoomState({
      offsetX: ReactZoomPanPinchRef.state.positionX,
      offsetY: ReactZoomPanPinchRef.state.positionY,
      scale: ReactZoomPanPinchRef.state.scale,
    });
  };

  const pinText = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: "75%",
    display: "none"
  };

  function setUpBattleMap(){
    console.log("Setting up battle map");
    RandomizeStats();
    displayWinningFactions();
  }
  function RandomizeStats()
  {
      function checkIfDeploymentExists(region, faction)
      {
          for(var i=0; i<deployedTroops.deployments.length; i++)  
          {  
              var code = deployedTroops.deployments[i].code;  
              if(code == region + faction){  
                  return true;  
              }
          }
          return false;
      }
      const factions = ["Mad Merkat", "CroSkull", "Boomer Squad", "Flaming Phenix Club"];
      const regions = ["Dwarf Mines", "Southern Trident", "Dragonland", "Human Kingdoms"];

      for (let index = 0; index < 100; index++) 
      {
          var faction = factions[Math.floor(Math.random()*factions.length)];
          var region = regions[Math.floor(Math.random()*regions.length)];

          //if deployment exists, add troops to it
          if(checkIfDeploymentExists(region, faction) == true)
          {
  
                  // deployedTroops.deployments[].addTroops(val);
                  // deployedTroops.allPlayers.forEach(player => total += player.getDetails())
                  // document.getElementById("deploymentNotes").innerHTML = total;
          }
          else    //create new deployment
          {
              deployedTroops.newDeployment(region, faction, Math.floor(Math.random()*10));
          }
      }
  }
  function displayWinningFactions()
{
    var pins = [];
    regionFlags.forEach(myFunction); 

    function myFunction(item, index) { 
        // console.log("tried to push pin: " + item + ""); 
        pins.push(document.getElementById(item));
    }
    
    for(var i=0; i<pins.length; i++)
    {
        var targetdiv = pins[i].getElementsByClassName("pinText")[0].getElementsByClassName("head")[0];
        // console.log("targetdiv: " + targetdiv);
        targetdiv.textContent = getWinningFactionInRegion(pins[i].title);
        var icon = pins[i].getElementsByClassName("factionIcon")[0]
        icon.src = "/img/battle-bay/"+getWinningFactionInRegion(pins[i].title)+".png";
    }
}
function displayTop3InRegion(region, troopsTableRef)
{
    deployedTroops.deployments.sort(function(b, a){return a.amount - b.amount});
    var troopsTable = document.getElementById("troopsTable");
    while (troopsTable.firstChild) {
        troopsTable.removeChild(troopsTable.lastChild);
        }
    var rank = 1;

    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        if(region == deployedTroops.deployments[i].region)
        {  
            var tr = document.createElement("tr");

            var tdRank = document.createElement("td");
            tdRank.classList.add("text-center");
            tdRank.scope = "row";
            tdRank.innerHTML = rank;
            tr.appendChild(tdRank);

            var tdFaction = document.createElement("td");
            tdFaction.classList.add("text-center");
            tdFaction.scope = "row";
            tdFaction.innerHTML = deployedTroops.deployments[i].faction;
            tr.appendChild(tdFaction);

            var tdTroops = document.createElement("td");
            tdTroops.classList.add("text-center");
            tdTroops.scope = "row";
            tdTroops.innerHTML = deployedTroops.deployments[i].amount;
            tr.appendChild(tdTroops);

            troopsTable.appendChild(tr);

            if(rank==3)
            {
                return;
            }
            rank++;
        }
    }
}
function getWinningFactionInRegion(region)
{
    deployedTroops.deployments.sort(function(b, a){return a.amount - b.amount});
    for(var i=0; i<deployedTroops.deployments.length; i++)  
    {  
        if(region == deployedTroops.deployments[i].region)
        {  
            return deployedTroops.deployments[i].faction;
        }
    }
}
  function getRegionStats(region)
  {
      // document.getElementById("regionName").innerHTML = region;
      // document.getElementById("desc").innerHTML = "<br>" +getTroopsInRegion(region);


      // console.log("Current holder: "+getWinningFactionInRegion(region))
      // var targetdiv = document.getElementById(pin).getElementsByClassName("pin-text")[0].getElementsByClassName("head")[0];
      // console.log(targetdiv)
      // targetdiv.textContent = getWinningFactionInRegion(region);
  }

  function selectRegion(x, troopsTableRef)
  {
      console.log("Selected region: "+x);
      //need to redo as refs
      // openForm();
      selectedRegion = x;
      // document.getElementById("selectedRegion").innerHTML = selectedRegion;
      // displayTop3InRegion(selectedRegion, troopsTableRef);
      // setUpDropDown(defenderFactionInput,'defenderFactionUL', getDefenderFactions(), selectDefenderFaction);
      // setUpDropDown('attackerFactionInput','attackerFactionUl', getAttackerFactions(), selectAttackerFaction);
  }
  
  return (

//     <body>
    
//     {/* old way of returning to village map */}
//     {/* <div>
//       <button class="btn" onClick="window.location.href='../villageMap.html'">back</button>
//     </div> */}

//       <button class="btn" onClick={onBack}>Back to Village Map</button>
//   <div class="form-popup form-container" id="myForm">
//     <form action="/action_page.php" class="form-container">
//       <h1 id="selectedRegion" class = "TitleText"> Region Name</h1>
//       <button type="button" class="x" onClick="closeForm()">Cancel</button>

//       <div class="form-container">
//         <button type="button" name="tablinks" class="smallBtnSelected" onClick="openPanel(event, 'Info'), RefreshInfo()">Info</button>
//         <button type="button" name="tablinks" class="smallBtnDisabled" onClick="openPanel(event, 'Deploy')">Deploy</button>
//         <button type="button" name="tablinks" class="smallBtnDisabled" onClick="openPanel(event, 'Attack')">Attack</button>
//       </div>

//   {/* <!-- Deploy Tab --> */}
//   <div id="Deploy" class="tabcontent">
//     <div >
//       <button type="button" id="deploy" class="smallBtnSelected" onClick="selectDeploy()">Deploy</button>
//       <button type="button" id="recall" class="smallBtnDisabled" onClick="selectRecall()">Recall</button>
//       <p id="troops" class = "basicText" ></p>

//       <label class = "basicText" style ="float: left;" for="quantity">Please select a faction:</label>
//       <input type="text"  id="deployFactionInput" onkeyup="filterFactions('deployFactionInput','deployFactionUl')"
//         onClick="filterFactions('deployFactionInput','deployFactionUl')" placeholder="Search for faction.."class = "entryField"/>
//       <ul id="deployFactionUl"> </ul>

//       <p></p>
//       <label class = "basicText" for="quantity">Quantity:</label>
//       <input class = "css-1fzih88" type="number" id="quantity" name="quantity" min="0"/>
//       <p></p>

//       <button type="button" class="btn" onClick="Apply()">Apply</button>
//       <button type="button" class="btn cancel" onClick="closeForm()">Cancel</button>
//     </div>
//   </div>



<section>
  {/* Attack Tab */}
  {/* <div id="Attack" class="tabcontent">
      <div id="attackSetUp" 
      // style="display: block;"
      >
        <div className="container">
          <p>If you are a faction owner, you will be able to attack other troops in the region with troops you have deployed</p>
          <div className="row">
          </div>
        </div>
              <div className="column border-right">
                  <p>Attackers</p>
                  <label className = "basicText" 
                  // style ="float: left;" 
                  for="quantity">Attacker Faction:</label>
                  <input type="text"  id="attackerFactionInput" onkeyup="filterFactions('attackerFactionInput','attackerFactionUl')" 
                    onclick="filterFactions('attackerFactionInput','attackerFactionUl')" placeholder="Search for faction.."className = "entryField"/>
                  <ul id="attackerFactionUl"> </ul>

                  <label className = "basicText" for="wager" id="troopsToAttackWith">Troops to wager (max 0):</label>
                  <input className = "css-1fzih88" type="number" id="troopsToAttackWithInput" name="wager" min="0"/>
                  <p></p>
              </div>
              <div className="column border-left">
                  <p>Defenders</p>
                  <label className = "basicText" for="quantity">Select A Faction to attack:</label>
                  <input type="text" ref={defenderFactionInputRef} id="defenderFactionInput" onkeyup="filterFactions('defenderFactionInput','defenderFactionUL')" 
                    onclick="filterFactions('defenderFactionInput','defenderFactionUL')" placeholder="Search for faction.."className = "entryField"/>
                  <ul id="defenderFactionUL"></ul>
              </div>

          <div className="bottomform">
            <label className = "basicText" id="battleText" for="Battle"><br/></label>
            <label className = "basicText right" for="attackCost">Cost: 100 Token</label>
            <button type="button" className="btn" onclick="Battle()">Confirm Attack</button>
            <div title="When attacking, a D6 roll is made for both the attacker and the defender. 
              The lower roll (ties going to defender) loses a troop. This continues until one 
                side has run out of troops">How are Attacks Calculated? (Hover for info)</div>
          </div>
    </div>
    <div id="attackConclusion"
    //  style="display: none;"
    >
        <div className="container">
          <p id="attackOutcome">Victory!</p>
          <div className="row">
            <div className="column border-right">
              <p>Attackers</p>
              <label className = "basicText" id="attackerOutcome">Mad Merkat: -7 of 10</label>
              <p></p>
            </div>
            <div className="column border-left">
              <p>Defenders</p>
              <label className = "basicText" id="defenderOutcome">CroSkull: -5 of 5</label>
            </div>
          </div>
          <div className="bottomform">
            <button type="button" className="btn cancel" onclick="attackAgain()">Attack Again</button>
            <button type="button" className="minibtn" id="resultsButton" onclick="showDetailedResults()">See detailed results</button>
          </div>
        </div>

        <div className="form-popup" id="detailedResultsForm" 
        // style="display: none; overflow-y: scroll; min-height:300px; height:300px;"
        >
          <form className="form-container">
            <label className = "basicText" id="">Results:</label>
            <p id="outcomeLog"></p>
          </form>
        </div>

    </div>
    </div> */}

{/* <tbody ref={troopsTableRef}>
    </tbody> */}
        {/* <table className="table">
    <thread className="border-bottom">
        <tr>
            <th scope="col" className="tex-center">Rank</th>
            <th scope="col" className="tex-center">Faction</th>
            <th scope="col" className="tex-center">Troops</th>
        </tr>
    </thread>
    <tbody id="troopsTable">
    </tbody>
</table> */}

<button className="btn" onClick={onBack}>Back to Village Map</button>
<p className="title text-center">Select a region to deploy troops to</p>
<p className="text-center"></p>
  <div className="container" >
    <TransformWrapper
        // onZoom={changeCanvasState}
        // onPinching={changeCanvasState}
        // onPinchingStop={changeCanvasState}
        // onPanningStop={changeCanvasState}
        // onPanning={() => setModalFlag('none')}
        >
      <TransformComponent>

      <img src="/img/battle-bay/fantasyRisk2.png" alt="Trulli" useMap="#image-map" width="100%" style={{backgroundRepeat: 'repeat', backgroundImage:'url("/img/battle-bay/ocean-3.png")'}} className={`${styles.mapImageArea}`} id="islandMap" />
      <map name="image-map" width="100%" height="100%" className={`${styles.mapImageArea}`}>
        <area onMouseOver={getRegionStats("Southern Trident" , 'pin-Southern-Trident')} alt="Southern Trident" 
          onClick={() => selectRegion("Southern Trident", troopsTableRef)}
          coords="255,534,295,532,337,554,396,534,410,481,351,411,331,377,264,391,225,377,208,430,157,439,191,515" shape="poly"/> 
        <area onMouseOver={getRegionStats("Dragonland", 'pin-Dragonland')} alt="Dragonland" 
          onClick={() => selectRegion("DragonLand", troopsTableRef)}
          coords="199,290,208,338,225,368,269,380,328,371,446,298,387,231,421,191,354,160,208,37,185,129,216,214,239,256,295,259,300,309,258,326,233,293" shape="poly"/> 
        <area onMouseOver={getRegionStats("Dwarf Mines", 'pin-Dwarf-Mines')} target="" alt="Dwarf Mines" 
          onClick={() => selectRegion("Dwarf Mines", troopsTableRef)}
          coords="438,529,455,478,491,470,502,349,589,352,699,318,724,340,721,447,699,475,721,520,778,540,741,568,640,546,640,489,550,481,516,526,469,543" shape="poly"/>
        <area onMouseOver={getRegionStats("Human Kingdoms", 'pin-Human-Kingdoms')} target="" alt="Human Kingdoms" 
          onClick={() => selectRegion("Human Kingdoms", troopsTableRef)}
          coords="825,567,853,576,891,569,900,558,939,562,961,564,981,558,1018,564,1033,553,1038,517,1027,476,1004,499,954,521,918,517,914,497,902,474,
          889,458,898,427,900,400,893,379,877,359,850,361,821,357,807,366,776,363,753,352,737,339,712,361,728,370,724,384,735,397,719,418,728,449,708,
          460,685,474,710,491,721,521,753,542,778,536,782,512,805,503,823,485,853,497,873,506,873,519,850,533,846,548,837,556" shape="poly"/>
      
      </map>

      <div id="pin-Southern-Trident" onMouseOver={getRegionStats("Southern Trident", 'pin-Southern-Trident')}
        title="Southern Trident" onClick={selectRegion("Southern Trident", troopsTableRef)} 
        className="image" style={{marginTop: '-20%', marginLeft: '20%', zIndex:"9", pointerEvents:"none"}}>
        <img src=""  width="32" height="32" className="factionIcon"/>
        <div className= "pinText"><h3 className="head">pin-Southern-Trident</h3></div>
      </div>
      <div id="pin-Dragonland" className="image" 
        title="Dragonland" style={{marginTop: '-45%', marginLeft: '-10%', zIndex:"9", pointerEvents:"none"}} >
        <img src=""  width="32" height="32" className="factionIcon"/>
        <div  className="pinText"><h3 className="head">pin-dragon</h3></div>
      </div>
      <div id="pin-Dwarf-Mines" onMouseOver={getRegionStats("Dwarf Mines" , 'pin-Dwarf-Mines')} 
        className="image" title="Dwarf Mines" style={{marginTop: '-30%', marginLeft: '15%', zIndex:"9", pointerEvents:"none"}}
        onClick={selectRegion("Dwarf-Mines", troopsTableRef)}>
        <img src=""  width="32" height="32" className="factionIcon"/>
        <div className="pinText"><h3 className="head">pin-Dwarf-Mines</h3></div>
      </div>
      <div id="pin-Human-Kingdoms" onMouseOver={getRegionStats("Human Kingdoms", 'pin-Human-Kingdoms')} 
        className="image" title="Human Kingdoms" style={{marginTop: '-25%', marginLeft: '10%', zIndex:"9", pointerEvents:"none"}}
        onClick={selectRegion("Human Kingdoms", troopsTableRef)}>
        <img src=""  width="32" height="32" className="factionIcon"/>
        <div className="pinText"><h3 className="head">pin-Human-Kingdoms</h3></div>
      </div>

      </TransformComponent>
    </TransformWrapper>

      

  </div>
    <p ref={titleRef} className = "TitleText"></p>
    <p id="desc" className="css-1fzih88">Mouse over a region to see the troops deployed to it.</p>
    <p id="deploymentNotes" className = "basicText"></p>
</section>

// {/* <!-- <button onClick="reset_troops()">Reset</button>--> */}
// <p class = "basicText" id="troopsAppiled"></p>
// <meta name="viewport" content="width=device-width, initial-scale=1"/> 
  
// </body>

// {/* <!-- close all the forms if clicked --> */}
// <div id="overlay2" onClick="closeForm(), closeDelegateForm(), closeRegistrationForm()"></div>

// {/* <!-- <script type="text/javascript" src="../jquery-1.6.2.min.js"></script> --> */}
// {/* <!-- <script type="text/javascript" src="jquery.maphilight.js"></script> --> */}
// <script type="text/javascript" src="fantasyRisk.js"></script>
// <script type="text/javascript" src="deployToops.js"></script>
// {/* <!-- <script type="text/javascript" src="../factions/registerFaction.js"></script> */}
// {/* <script type="text/javascript" src="../factions/delegateToFaction.js"></script> --> */}
// {/* <!-- <script type="text/javascript" src="jquery.imagemapster.js"></script> --> */}
// <script src="../attack/attackSetUp.js"></script>
// <script src="../attack/attack.js"></script>
// <script type="text/javascript" src="../mapStuff/mapControls.js"></script>

// {/* <!-- resize Map --> */}
// </section>
  )
};


export default BattleMap;