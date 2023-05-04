import React, {useEffect, useRef, useState } from 'react';
import { resizeBattleMap, setUpMapZooming } from './mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from './BattleBay.module.scss';
import { FactionForm } from './battleMap/components/index.js';
import { useDisclosure } from '@chakra-ui/react'
import { getMap } from "@src/core/api/RyoshiDynastiesAPICalls";
import { getControlPoint } from "@src/core/api/RyoshiDynastiesAPICalls";
import ControlPointForm from './battleMap/components/ControlPointForm.js';

const BattleMap = ({onBack, factions=[]}) => {

  //#region variables
  // const gif = "/img/battle-bay/fire.gif";
  const mapRef = useRef();
  const  [flagSize, setFlagSize] = useState("1px");
  const [buildingSize, setBuildingSize] = useState("50px");
  const { height, width: windowWidth } = useWindowDimensions();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [controlPoint, setControlPoint] = useState([], () => {});
  
  const imageRef1 = useRef();
  const imageRef2 = useRef();
  const imageRef3 = useRef();
  const imageRef4 = useRef();

  // const [mapData, setMap] = useState([], () => {});
  // const mapData = [];

  const [area, setAreas] = useState([]);
  const [selectedControlPoint, setSelectedControlPoint] = useState(0);
  const [pins, setPins] = useState([]);
  const [explosion, setExplosion] = useState([]);
  const [playExlplosion, setPlayExplosion] = useState(false);

  const controlPoints = [{id:4, title:"Southern Trident",pinName: "pin-Southern-Trident",marginTop: '32%', marginLeft: '20%'},
                         {id:3, title:"Dragonland",pinName: "pin-Dragonland",marginTop: '17%', marginLeft: '24%'},
                         {id:2, title:"Dwarf Mines",pinName: "pin-Dwarf-Mines",marginTop: '32%', marginLeft: '47%'},
                         {id:1, title:"Human Kingdoms",pinName: "pin-Human-Kingdoms",marginTop: '30%', marginLeft: '63%'}];

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
  const GetControlPointImage = async (id) => 
  {
    // console.log(id);
    var data = await getControlPoint(id)
    console.log(data.leaderBoard[0].image);
    return data.leaderBoard[0].image;
    // .then((data) => {
    //   // setControlPoint(data);
      
    // }); 
    // console.log("done");

    // return "/img/battle-bay/townhall_day.png";
  }

  function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

  const randomlyPlayExplosion = async () => {
    //get random control point
    var explosionPoint = controlPoints[Math.floor(Math.random() * controlPoints.length)];

    setExplosion(
      <div style={{position:"absolute", marginTop: explosionPoint.marginTop, marginLeft: explosionPoint.marginLeft, zIndex:"9", pointerEvents:"none"}}>
        <img src='/img/battle-bay/explosion.png' width={flagSize} height={flagSize} className="factionIcon"/>
      </div>
    )
    // console.log("waiting");
    await new Promise(r => setTimeout(r, 1000));
    // console.log("done waiting");

    // setExplosion(
    //   <div style={{position:"absolute", marginTop: explosionPoint.marginTop, marginLeft: explosionPoint.marginLeft, zIndex:"9", pointerEvents:"none"}}>
    //     <img src='/img/battle-bay/explosion.png' width={0} height={0} className="factionIcon"/>
    //   </div>
    // )
    setPlayExplosion(!playExlplosion);
  }
  //#endregion

  //#region Map Functions
  function selectRegion(x)
  {
    GetControlPointInfo(x);
  }
  const GetControlPointInfo = async (x) => {
    getControlPoint(x).then((data) => {
      setControlPoint(data);
  }); 
  }
  const RefreshControlPoint = async () => {
    getControlPoint(selectedControlPoint).then((data) => {
      setControlPoint(data);
  });
}
  //#endregion

  useEffect(() => {
    SetUpMap();
    setFlagSize(windowWidth/30 + "px");
    setBuildingSize(windowWidth/20 + "px");
  }, [controlPoint]);

  useEffect(() => {
    SetUpPins();
    // randomlyPlayExplosion();
  }, [flagSize]);

  useEffect(() => {
    randomlyPlayExplosion();
  }, [playExlplosion]);

  const SetUpMap = async () => {
    getMap().then((data) => {
      // mapData = data.data.data.map; 
      console.log(data.data.data.map);
      setAreas(data.data.data.map.regions[0].controlPoints.map((controlPoint, i) => 
        (<area onClick={() => {setSelectedControlPoint(controlPoint.id); selectRegion(controlPoint.id); onOpen();}}
            coords={controlPoint.coordinates} shape="poly" alt= {controlPoint.name}/>
        )))
      resizeBattleMap();
    }); 
  }
  const getImageRef = (id) => {
    if(id === 1)
      return imageRef1;
    else if(id === 2)
      return imageRef2;
    else if(id === 3)
      return imageRef3;
    else if(id === 4)
      return imageRef4;
  }
  const SetUpPins = async () => {
      setPins(controlPoints.map((controlPoint, i) => 
        (<div id={controlPoint.pinName} title={controlPoint.title}
              style={{position:"absolute", marginTop: controlPoint.marginTop, marginLeft: 
              controlPoint.marginLeft, zIndex:"9", pointerEvents:"none"}}>
        <img width={flagSize} height={flagSize} ref={getImageRef(controlPoint.id)} className={controlPoint.id}/>
        <div className= "pinText">
          <h3 className="head">{controlPoint.title}</h3>
        </div>
      </div>
        )))
      if(imageRef1.current != null)
      {
        imageRef1.current.src = await GetControlPointImage(1);
        imageRef2.current.src = await GetControlPointImage(2);
        imageRef3.current.src = await GetControlPointImage(3);
        imageRef4.current.src = await GetControlPointImage(4);
      }

  }

  return (
  <section>

  <ControlPointForm isOpen={isOpen} onClose={onClose} controlPoint={controlPoint} factions={factions} refreshControlPoint={RefreshControlPoint}/>

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
      {pins}
      {explosion}
        </TransformComponent>
      </TransformWrapper>
    </div>
  </section>
  )
};


export default BattleMap;