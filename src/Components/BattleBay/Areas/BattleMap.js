import React, {useEffect, useRef, useState } from 'react';
import { resizeBattleMap, setUpMapZooming } from './mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from './BattleBay.module.scss';
import { FactionForm } from './battleMap/components/index.js';

const BattleMap = ({onBack}) => {

//#region variables
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
//#endregion

//#region Map Zooming
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
//#endregion

//#region Map Functions
useEffect(() => {
  console.log("this is from battleMap useEffect")
  // holdRefs(defenderFactionInputRef);
  resizeBattleMap();
  setUpBattleMap();
  // setUpMapZooming();
});
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
      selectedRegion = x;
      // document.getElementById("selectedRegion").innerHTML = selectedRegion;
      // displayTop3InRegion(selectedRegion, troopsTableRef);
      // setUpDropDown(defenderFactionInput,'defenderFactionUL', getDefenderFactions(), selectDefenderFaction);
      // setUpDropDown('attackerFactionInput','attackerFactionUl', getAttackerFactions(), selectAttackerFaction);
  }
  
//#endregion

function openForm(){
  console.log("open form");
  <FactionForm/>
}
  return (


<section>

<FactionForm/>

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
          onClick={() => {selectRegion("Southern Trident", troopsTableRef); openForm();}}
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

  )
};


export default BattleMap;