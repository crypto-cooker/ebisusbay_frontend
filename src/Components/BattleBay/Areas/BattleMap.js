import React, {useEffect, useRef, useState } from 'react';
import { resizeBattleMap, setUpMapZooming } from './mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from './BattleBay.module.scss';
import { FactionForm } from './battleMap/components/index.js';
import { useDisclosure } from '@chakra-ui/react'
import { getMap } from "@src/core/api/RyoshiDynastiesAPICalls";
import { getControlPoint } from "@src/core/api/RyoshiDynastiesAPICalls";

const BattleMap = ({onBack, factions=[]}) => {

  //#region variables
  const gif = "/img/battle-bay/fire.gif";
  const mapRef = useRef();
  const regionFlags = ["pin-Southern-Trident", "pin-Dragonland", "pin-Human-Kingdoms", "pin-Dwarf-Mines"];
  const  [flagSize, setFlagSize] = useState("32px");
  const [buildingSize, setBuildingSize] = useState("50px");
  const { height, width: windowWidth } = useWindowDimensions();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [controlPoint, setControlPoint] = useState([], () => {});
  const mapData = [];
  const [area, setAreas] = useState([]);

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
  }
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
    // const [zoomState, setZoomState] = useState({
    //   offsetX: 0,
    //   offsetY: 0,
    //   scale: 1,
    // });
    // const changeCanvasState = (ReactZoomPanPinchRef, event) => {
    //   setZoomState({
    //     offsetX: ReactZoomPanPinchRef.state.positionX,
    //     offsetY: ReactZoomPanPinchRef.state.positionY,
    //     scale: ReactZoomPanPinchRef.state.scale,
    //   });
    // };
  //#endregion

  //#region Map Functions
  function setUpBattleMap(){
    // console.log("Setting up battle map");
    RandomizeStats();
    displayWinningFactions();
  }
  function RandomizeStats()
  {
    //this is for adding dummy data to the map
    console.log("Randomizing stats");
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
    regionFlags.forEach(pushPin); 

    function pushPin(item, index) { 
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
  function selectRegion(x)
  {
    GetControlPointInfo(x);
  }
  const GetControlPointInfo = async (x) => {
    getControlPoint(x).then((data) => {
      setControlPoint(data.data.data);
  }); 
  }
  //#endregion

  useEffect(() => {
    setUpBattleMap();
    SetUpMap();
    setFlagSize(windowWidth/30 + "px");
    setBuildingSize(windowWidth/20 + "px");
  }, [controlPoint]);
  
  const SetUpMap = async () => {
    getMap(0).then((data) => {
      mapData = data.data.data.map; 
      setAreas( mapData.regions[0].controlPoints.map((controlPoint, i) => 
        (<area onClick={() => {selectRegion(controlPoint.id); onOpen();}}
            coords={controlPoint.coordinates} shape="poly" alt= {controlPoint.name}/>
        )))
      resizeBattleMap();
    }); 
  }

  return (
  <section>

  <FactionForm isOpen={isOpen} onClose={onClose} controlPoint={controlPoint} factions={factions}/>

  <button className="btn" onClick={onBack}>Back to Village Map</button>
  <p className="title text-center">Select a region to deploy troops to</p>
  <div>
     </div>

  <div className="container">
    <TransformWrapper>
      <TransformComponent>
       
      <img src="/img/battle-bay/fantasyRisk2.png" alt="Trulli" useMap="#image-map" width="100%" 
        style={{backgroundRepeat: 'repeat', backgroundImage:'url("/img/battle-bay/ocean-3.png")'}} 
        className={`${styles.mapImageArea}`} id="islandMap" ref={mapRef} />

      <map name="image-map" width="100%" height="100%" className={`${styles.mapImageArea}`}>
        {area}

        {/* <area onMouseOver={getRegionStats("Southern Trident" , 'pin-Southern-Trident')} alt="Southern Trident" 
          onClick={() => {selectRegion("Southern Trident", troopsTableRef); onOpen();}}
          coords="255,534,295,532,337,554,396,534,410,481,351,411,331,377,264,391,225,377,208,430,157,439,191,515" shape="poly"/> 

        <area onMouseOver={getRegionStats("Dragonland", 'pin-Dragonland')} alt="Dragonland" 
          onClick={() => {selectRegion("Dragonland", troopsTableRef); onOpen();}}
          coords="199,290,208,338,225,368,269,380,328,371,446,298,387,231,421,191,354,160,208,37,185,129,216,214,239,256,295,259,300,309,258,326,233,293" shape="poly"/> 

        <area onMouseOver={getRegionStats("Dwarf Mines", 'pin-Dwarf-Mines')} target="" alt="Dwarf Mines" 
          onClick={() => {selectRegion("Dwarf Mines", troopsTableRef); onOpen();}}
          coords="438,529,455,478,491,470,502,349,589,352,699,318,724,340,721,447,699,475,721,520,778,540,741,568,640,546,640,489,550,481,516,526,469,543" shape="poly"/>
        
        <area onMouseOver={getRegionStats("Human Kingdoms", 'pin-Human-Kingdoms')} target="" alt="Human Kingdoms" 
          onClick={() => {selectRegion("Human Kingdoms", troopsTableRef); onOpen();}}
          coords="825,567,853,576,891,569,900,558,939,562,961,564,981,558,1018,564,1033,553,1038,517,1027,476,1004,499,954,521,918,517,914,497,902,474,
          889,458,898,427,900,400,893,379,877,359,850,361,821,357,807,366,776,363,753,352,737,339,712,361,728,370,724,384,735,397,719,418,728,449,708,
          460,685,474,710,491,721,521,753,542,778,536,782,512,805,503,823,485,853,497,873,506,873,519,850,533,846,548,837,556" shape="poly"/> */}

      </map>

      <div id="pin-Southern-Trident" title="Southern Trident"
        style={{position:"absolute", marginTop: '32%', marginLeft: '20%', zIndex:"9", pointerEvents:"none"}}>
        <img src=""  width={flagSize} height={flagSize} className="factionIcon"/>
        <div className= "pinText"><h3 className="head">pin-Southern-Trident</h3></div>
      </div>
      <div id="pin-Dragonland" title="Dragonland" 
        style={{position:"absolute", marginTop: '17%', marginLeft: '24%', zIndex:"9", pointerEvents:"none"}}>
        <img src=""  width={flagSize} height={flagSize} className="factionIcon"/>
        <div  className="pinText"><h3 className="head">pin-dragon</h3></div>
      </div>
      <div id="pin-Dwarf-Mines" title="Dwarf Mines" 
        style={{position:"absolute", marginTop: '32%', marginLeft: '47%', zIndex:"9", pointerEvents:"none"}}>
        <img src=""  width={flagSize} height={flagSize} className="factionIcon"/>
        <div className="pinText"><h3 className="head">pin-Dwarf-Mines</h3></div>
      </div>
      <div id="pin-Human-Kingdoms" title="Human Kingdoms" 
        style={{position:"absolute", marginTop: '30%', marginLeft: '63%', zIndex:"9", pointerEvents:"none"}}>
        <img src=""  width={flagSize} height={flagSize} className="factionIcon"/>
        <div className="pinText"><h3 className="head">pin-Human-Kingdoms</h3></div>
      </div>

      <div 
        style={{position:"absolute", marginTop: '25%', marginLeft: '50%', zIndex:"9", pointerEvents:"none"}}>
        <img src={gif}  width={buildingSize} height={buildingSize}/>
      </div>

        </TransformComponent>
      </TransformWrapper>

    </div>

    {/* <p  className = "TitleText"></p>
    <p id="desc" className="css-1fzih88">Mouse over a region to see the troops deployed to it.</p>
    <p id="deploymentNotes" className = "basicText"></p> */}

  </section>
  )
};


export default BattleMap;