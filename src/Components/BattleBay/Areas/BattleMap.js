import React, {useEffect, useRef, useState } from 'react';
import { resizeBattleMap, setUpMapZooming } from './mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from './BattleBay.module.scss';

import { useDisclosure, Button } from '@chakra-ui/react'
import { getMap } from "@src/core/api/RyoshiDynastiesAPICalls";
import { getControlPoint } from "@src/core/api/RyoshiDynastiesAPICalls";
import ControlPointForm from './battleMap/components/ControlPointForm.js';

const BattleMap = ({onBack, factions=[]}) => {

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
    var data = await getControlPoint(id)
    console.log(data.leaderBoard[0].image);
    return data.leaderBoard[0].image;
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

  function selectRegion(x) {
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

  useEffect(() => {
    SetUpMap();
    setFlagSize(windowWidth/30 + "px");
    setBuildingSize(windowWidth/20 + "px");
  }, [controlPoint]);

  useEffect(() => {
    // SetUpPins();
    // randomlyPlayExplosion();
  }, [flagSize]);

  useEffect(() => {
    // randomlyPlayExplosion();
  }, [playExlplosion]);

  useEffect(() => {
    SetUpMap();
  }, []);

  const SetUpMap = async () => {
    getMap().then((data) => {
      console.log(data);
      resizeBattleMap(7580, 5320);
      setAreas(data.data.data.map.regions[0].controlPoints.map((controlPoint, i) => (
        <area 
          onClick={() => {
            // console.log(controlPoint.id);
            setSelectedControlPoint(controlPoint.id); 
            selectRegion(controlPoint.id); 
            onOpen();
          }}
          coords={controlPoint.coordinates} 
          shape="circle" 
          alt= {controlPoint.name}
          className='cursor-pointer'
          />
        )))
      // map height and width, may need to be changed in the future

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

  <div className="container">
    <TransformWrapper>
      <TransformComponent>
        <img 
          src="/img/battle-bay/opMap.png" 
          useMap="#image-map" 
          width="100%" 
          className={`${styles.mapImageArea}`}
          id="islandMap"
          ref={mapRef}
          // style={{backgroundRepeat: 'repeat', backgroundImage:'url("/img/battle-bay/ocean-3.png")'}} 
          />
        <map name="image-map" width="100%" height="100%" className={`${styles.mapImageArea}`}>
          {area}
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