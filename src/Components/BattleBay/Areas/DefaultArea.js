import React, {useEffect, useLayoutEffect, useState } from 'react';
import { resizeMap, resizeNewMap } from './mapFunctions.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from './BattleBay.module.scss';
import {
  Button,
  Flex,
  Box,
  Spacer,
  Image
} from "@chakra-ui/react"

const DefaultArea = ({onChange}) => {

  // const [tempWidth, setTempWidth] = useState(1);
  // const [tempHeight, setTempHeight] = useState(1);
  // const [subDistanceX, setSubDistanceX] = useState(0);
  // const [subDistanceY, setSubDistanceY] = useState(0);
  // const [tavernGif, setTavernGif] = useState();

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

  const buildings ={ "allianceCenter" : {height:438, width:554, top:'7%', left:'55%'},
                      "townhall" : {height:607, width:707, top:'13%', left:'36%'},
                      "academy" : {height: 792, width: 744, top: '4%', left: '74%'},
                      "tavern" : {height: 573, width: 725, top: '3%', left: '14%'},
                      "tavernSpin" : {height: 573, width: 725, top: '3%', left: '14%'},

                      "water" : {height: 703, width: 2880, top: '32%', left: '0%'},
                      "boat" : {height: 613, width: 718, top: '33%', left: '2%'},
                      "ebisustatue" : {height: 542, width: 279, top: '35%', left: '40%'},
                      "fishmarket" : {height: 545, width: 793, top: '36.5%', left: '55%'},
                      "barracks" : {height: 579, width: 832, top: '12.5%', left: '-0.5%'},
                      "swordsmen" : {height: 270, width: 383, top: '22%', left: '14%'},

                      "flowers1" : {height: 251, width: 229, top: '3%', left: '14%'},
                      "flowers2" : {height: 251, width: 229, top: '3%', left: '14%'},
                      "flowers3" : {height: 251, width: 229, top: '3%', left: '14%'},

                      "bank" : {height: 456, width: 579, top: '%', left: '33%'},
                      "announcement" : {height: 243, width: 206, top: '28%', left: '60%'},

                      "moongate" : {height: 482, width: 443, top: '23%', left: '67%'},
                      "torii" : {height: 201, width: 236, top: '6%', left: '0%'},
                      "pond" : {height: 311, width: 783, top: '0%', left: '65%'}, 
                    }

  const [sizeMultiplier, setSizeMultiplier] = useState(0.5);

  const [allianceCenterWidth, setAllianceCenterWidth] = useState(buildings.allianceCenter.width);
  const [allianceCenterHeight, setAllianceCenterHeight] = useState(buildings.allianceCenter.height);
  const [allianceCenterTop, setAllianceCenterTop] = useState(buildings.allianceCenter.top);
  const [allianceCenterLeft, setAllianceCenterLeft] = useState(buildings.allianceCenter.left);

  const [townhallWidth, setTownhallWidth] = useState(buildings.townhall.width);
  const [townhallHeight, setTownhallHeight] = useState(buildings.townhall.height);
  const [townhallTop, setTownhallTop] = useState(buildings.townhall.top);
  const [townhallLeft, setTownhallLeft] = useState(buildings.townhall.left);

  const [tavernWidth, setTavernWidth] = useState(buildings.tavern.width);
  const [tavernHeight, setTavernHeight] = useState(buildings.tavern.height);
  const [tavernTop, setTavernTop] = useState(buildings.tavern.top);
  const [tavernLeft, setTavernLeft] = useState(buildings.tavern.left);

  const [academyWidth, setAcademyWidth] = useState(buildings.academy.width);
  const [academyHeight, setAcademyHeight] = useState(buildings.academy.height);
  const [academyTop, setAcademyTop] = useState(buildings.academy.top);
  const [academyLeft, setAcademyLeft] = useState(buildings.academy.left);

  const [tavernSpinWidth, setTavernSpinWidth] = useState(buildings.tavernSpin.width);
  const [tavernSpinHeight, setTavernSpinHeight] = useState(buildings.tavernSpin.height);
  const [tavernSpinTop, setTavernSpinTop] = useState(buildings.tavernSpin.top);
  const [tavernSpinLeft, setTavernSpinLeft] = useState(buildings.tavernSpin.left);

  const [flowers1Width, setFlowers1Width] = useState(buildings.flowers1.width);
  const [flowers1Height, setFlowers1Height] = useState(buildings.flowers1.height);
  const [flowers1Top, setFlowers1Top] = useState(buildings.flowers1.top);
  const [flowers1Left, setFlowers1Left] = useState(buildings.flowers1.left);
                    
  const [flowers2Width, setFlowers2Width] = useState(buildings.flowers2.width);
  const [flowers2Height, setFlowers2Height] = useState(buildings.flowers2.height);
  const [flowers2Top, setFlowers2Top] = useState(buildings.flowers2.top);
  const [flowers2Left, setFlowers2Left] = useState(buildings.flowers2.left);
                    
  const [flowers3Width, setFlowers3Width] = useState(buildings.flowers3.width);
  const [flowers3Height, setFlowers3Height] = useState(buildings.flowers3.height);
  const [flowers3Top, setFlowers3Top] = useState(buildings.flowers3.top);
  const [flowers3Left, setFlowers3Left] = useState(buildings.flowers3.left);

  const [bankWidth, setBankWidth] = useState(buildings.bank.width);
  const [bankHeight, setBankHeight] = useState(buildings.bank.height);
  const [bankTop, setBankTop] = useState(buildings.bank.top);
  const [bankLeft, setBankLeft] = useState(buildings.bank.left);

  const [announcementWidth, setAnnouncementWidth] = useState(buildings.announcement.width);
  const [announcementHeight, setAnnouncementHeight] = useState(buildings.announcement.height);
  const [announcementTop, setAnnouncementTop] = useState(buildings.announcement.top);
  const [announcementLeft, setAnnouncementLeft] = useState(buildings.announcement.left);

  const [waterWidth, setWaterWidth] = useState(buildings.water.width);
  const [waterHeight, setWaterHeight] = useState(buildings.water.height);
  const [waterTop, setWaterTop] = useState(buildings.water.top);
  const [waterLeft, setWaterLeft] = useState(buildings.water.left);

  const [barracksWidth, setBarracksWidth] = useState(buildings.barracks.width);
  const [barracksHeight, setBarracksHeight] = useState(buildings.barracks.height);
  const [barracksTop, setBarracksTop] = useState(buildings.barracks.top);
  const [barracksLeft, setBarracksLeft] = useState(buildings.barracks.left);

  const [fishmarketWidth, setFishmarketWidth] = useState(buildings.fishmarket.width);
  const [fishmarketHeight, setFishmarketHeight] = useState(buildings.fishmarket.height);
  const [fishmarketTop, setFishmarketTop] = useState(buildings.fishmarket.top);
  const [fishmarketLeft, setFishmarketLeft] = useState(buildings.fishmarket.left);

  const [boatWidth, setBoatWidth] = useState(buildings.boat.width);
  const [boatHeight, setBoatHeight] = useState(buildings.boat.height);
  const [boatTop, setBoatTop] = useState(buildings.boat.top);
  const [boatLeft, setBoatLeft] = useState(buildings.boat.left);

  const [ebisustatueWidth, setEbisustatueWidth] = useState(buildings.ebisustatue.width);
  const [ebisustatueHeight, setEbisustatueHeight] = useState(buildings.ebisustatue.height);
  const [ebisustatueTop, setEbisustatueTop] = useState(buildings.ebisustatue.top);
  const [ebisustatueLeft, setEbisustatueLeft] = useState(buildings.ebisustatue.left);

  const [swordsmenWidth, setSwordsmenWidth] = useState(buildings.swordsmen.width);
  const [swordsmenHeight, setSwordsmenHeight] = useState(buildings.swordsmen.height);
  const [swordsmenTop, setSwordsmenTop] = useState(buildings.swordsmen.top);
  const [swordsmenLeft, setSwordsmenLeft] = useState(buildings.swordsmen.left);

  const [moongateWidth, setMoongateWidth] = useState(buildings.moongate.width);
  const [moongateHeight, setMoongateHeight] = useState(buildings.moongate.height);
  const [moongateTop, setMoongateTop] = useState(buildings.moongate.top);
  const [moongateLeft, setMoongateLeft] = useState(buildings.moongate.left);

  const [toriiWidth, setToriiWidth] = useState(buildings.torii.width);
  const [toriiHeight, setToriiHeight] = useState(buildings.torii.height);
  const [toriiTop, setToriiTop] = useState(buildings.torii.top);
  const [toriiLeft, setToriiLeft] = useState(buildings.torii.left);

  const [pondWidth, setPondWidth] = useState(buildings.pond.width);
  const [pondHeight, setPondHeight] = useState(buildings.pond.height);
  const [pondTop, setPondTop] = useState(buildings.pond.top);
  const [pondLeft, setPondLeft] = useState(buildings.pond.left);


useEffect(() => {
  resizeMap();
  setAllianceCenterWidth( buildings.allianceCenter.width * sizeMultiplier);
  setAllianceCenterHeight( buildings.allianceCenter.height * sizeMultiplier);

  setTownhallWidth( buildings.townhall.width * sizeMultiplier);
  setTownhallHeight( buildings.townhall.height * sizeMultiplier);

  setTavernWidth( buildings.tavern.width * sizeMultiplier);
  setTavernHeight( buildings.tavern.height * sizeMultiplier);

  setAcademyWidth( buildings.academy.width * sizeMultiplier);
  setAcademyHeight( buildings.academy.height * sizeMultiplier);
  
  setTavernSpinWidth( buildings.tavernSpin.width * sizeMultiplier);
  setTavernSpinHeight( buildings.tavernSpin.height * sizeMultiplier);

  setFlowers1Width( buildings.flowers1.width * sizeMultiplier);
  setFlowers1Height( buildings.flowers1.height * sizeMultiplier);

  setFlowers2Width( buildings.flowers2.width * sizeMultiplier);
  setFlowers2Height( buildings.flowers2.height * sizeMultiplier);

  setFlowers3Width( buildings.flowers3.width * sizeMultiplier);
  setFlowers3Height( buildings.flowers3.height * sizeMultiplier);

  setBankWidth( buildings.bank.width * sizeMultiplier);
  setBankHeight( buildings.bank.height * sizeMultiplier);

  setAnnouncementWidth( buildings.announcement.width * sizeMultiplier);
  setAnnouncementHeight( buildings.announcement.height * sizeMultiplier);

  setWaterWidth( buildings.water.width * sizeMultiplier);
  setWaterHeight( buildings.water.height * sizeMultiplier);

  setBarracksWidth( buildings.barracks.width * sizeMultiplier);
  setBarracksHeight( buildings.barracks.height * sizeMultiplier);

  setFishmarketWidth( buildings.fishmarket.width * sizeMultiplier);
  setFishmarketHeight( buildings.fishmarket.height * sizeMultiplier);

  setBoatWidth( buildings.boat.width * sizeMultiplier);
  setBoatHeight( buildings.boat.height * sizeMultiplier);

  setEbisustatueWidth( buildings.ebisustatue.width * sizeMultiplier);
  setEbisustatueHeight( buildings.ebisustatue.height * sizeMultiplier);

  setSwordsmenWidth( buildings.swordsmen.width * sizeMultiplier);
  setSwordsmenHeight( buildings.swordsmen.height * sizeMultiplier);

  setMoongateWidth( buildings.moongate.width * sizeMultiplier);
  setMoongateHeight( buildings.moongate.height * sizeMultiplier);

  setToriiWidth( buildings.torii.width * sizeMultiplier);
  setToriiHeight( buildings.torii.height * sizeMultiplier);

  setPondWidth( buildings.pond.width * sizeMultiplier);
  setPondHeight( buildings.pond.height * sizeMultiplier);

}, [sizeMultiplier]);

useEffect(() => {
  function handleResize() {
    // console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
    if (window.innerWidth < 2880) {
      setSizeMultiplier(window.innerWidth / 2880);
    }
}
  window.addEventListener('resize', handleResize)
})

useEffect(() => {
  resizeMap();
  setSizeMultiplier(window.innerWidth / 2880);
  // console.log('sizeMultiplier: ', sizeMultiplier);
}, [])

  return (
    <section>
      <div width="50%">
      <Flex>
        <Spacer/>
        <Box p='3'>
          <Button style={{ display: 'flex', marginTop: '16px' }} 
            onClick={() => onChange('userPage')} variant='outline'size='lg'> 
            User Profile</Button>
        </Box>
      </Flex>
      <TransformWrapper scale={0.5} positionX={200} positionY={100}
        limitToBounds={true}
        onZoom={changeCanvasState}
        onPinching={changeCanvasState}
        onPinchingStop={changeCanvasState}
        onPanningStop={changeCanvasState}
        >
        <TransformComponent>
        
          <img 
          src='/img/battle-bay/mapImages/background.png'
          // src="/img/battle-bay/newMap.png" 
          useMap="#image-map" width="100%" className={`${styles.mapImageArea}`} id="fancyMenu"/>
          <map name="image-map">
            {/* <area onClick={() => onChange('townHall')} alt="Town Hall" title="Town Hall" coords="793,434,1259,861" shape="rect"/> */}
            
              {/* <area onClick={() => onChange('barracks')} alt="Barracks" title="Barracks" coords="194,622,568,968" shape="rect"/>
              <area onClick={() => onChange('')} alt="Town Hall" title="Town Hall" coords="793,434,1259,861" shape="rect"/>
              <area onClick={() => onChange('tavern')} alt="Tavern" title="Tavern" coords="377,255,763,531" shape="rect"/>
              <area onClick={() => onChange('allianceCenter')} alt="Alliance Center" title="Alliance Center" coords="1044,45,1342,414" shape="rect"/>
              <area onClick={() => onChange('bank')} alt="Bank" title="Bank" coords="1367,283,1808,575" shape="rect"/>
              <area onClick={() => onChange('academy')} alt="Academy" title="Academy" coords="2118,246,2523,565" shape="rect"/>
              <area onClick={() => onChange('battleMap')} alt="Fish Market" title="Fish Market" coords="1971,974,2487,1361" shape="rect"/>
              <area onClick={() => onChange('announcementBoard')} alt="Announcement Board" title="Announcement Board" coords="1813,494,2073,798" shape="rect"/> */}
          </map>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: allianceCenterTop, marginLeft: allianceCenterLeft, zIndex:"9"}} onClick={() => onChange('allianceCenter')}>
            <img src='/img/battle-bay/mapImages/alliancecenter_day.png' width={allianceCenterWidth} height={allianceCenterHeight} /> </div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: townhallTop, marginLeft: townhallLeft, zIndex:"9"}} onClick={() => onChange('townHall')}>
            <img src='/img/battle-bay/mapImages/townhall.png' width={townhallWidth} height={townhallHeight}/> </div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: tavernTop, marginLeft: tavernLeft, zIndex:"9"}} onClick={() => onChange('tavern')}>
            <img src='/img/battle-bay/mapImages/tavern.png' width={tavernWidth} height={tavernHeight}/> </div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: academyTop, marginLeft: academyLeft, zIndex:"9"}} onClick={() => onChange('academy')}>
            <img src='/img/battle-bay/mapImages/academy.png' width={academyWidth} height={academyHeight} /> </div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: tavernSpinTop, marginLeft: tavernSpinLeft, zIndex:"9", pointerEvents:"none"}}>
            <img src='/img/battle-bay/mapImages/tavern_turbine.png' width={tavernSpinWidth} height={tavernSpinHeight} /></div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: boatTop, marginLeft: boatLeft, zIndex:"9"}} onClick={() => onChange('battleMap')}>
            <img src='/img/battle-bay/mapImages/boat_day.png' width={boatWidth} height={boatHeight} /> </div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: ebisustatueTop, marginLeft: ebisustatueLeft, zIndex:"9"}} >
            <img src='/img/battle-bay/mapImages/ebisustatue.png' width={ebisustatueWidth} height={ebisustatueHeight} /> </div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: fishmarketTop, marginLeft: fishmarketLeft, zIndex:"9"}} >
            <img src='/img/battle-bay/mapImages/fishmarket_day.png' width={fishmarketWidth} height={fishmarketHeight} /> </div>

          <div style={{position:"absolute", marginTop: waterTop, marginLeft: waterLeft, zIndex:"8"}} >
            <img src='/img/battle-bay/mapImages/water.png' width={waterWidth} height={waterHeight} /> </div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: bankTop, marginLeft: bankLeft, zIndex:"8"}} onClick={() => onChange('bank')}>
            <img src='/img/battle-bay/mapImages/bank_day.png' width={bankWidth} height={bankHeight} /> </div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: announcementTop, marginLeft: announcementLeft, zIndex:"9"}} onClick={() => onChange('announcementBoard')}>
            <img src='/img/battle-bay/mapImages/announcement.png' width={announcementWidth} height={announcementHeight} /> </div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: barracksTop, marginLeft: barracksLeft, zIndex:"9"}} onClick={() => onChange('barracks')}>
            <img src='/img/battle-bay/mapImages/barracks.png' width={barracksWidth} height={barracksHeight} /> </div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: swordsmenTop, marginLeft: swordsmenLeft, zIndex:"9", pointerEvents:"none"}} >
            <img src='/img/battle-bay/mapImages/swordsmen.png' width={swordsmenWidth} height={swordsmenHeight} /> </div>
          
          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: moongateTop, marginLeft: moongateLeft, zIndex:"9"}}>
            <img src='/img/battle-bay/mapImages/moongate_day.png' width={moongateWidth} height={moongateHeight} /> </div>
        
          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: toriiTop, marginLeft: toriiLeft, zIndex:"9"}} >
            <img src='/img/battle-bay/mapImages/torii.png' width={toriiWidth} height={toriiHeight} /> </div>

          <div className={[styles.enlarge]} style={{position:"absolute", marginTop: pondTop, marginLeft: pondLeft, zIndex:"8"}}>
            <img src='/img/battle-bay/mapImages/pond1.png' width={pondWidth} height={pondHeight} /> </div>

          
        </TransformComponent>
      </TransformWrapper>

      </div>
    </section>
  )
};


export default DefaultArea;