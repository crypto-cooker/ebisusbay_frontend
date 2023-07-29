import React, {ReactElement, useEffect, useRef, useState, useContext, use } from 'react';
import {
  useDisclosure,
  Button,
  AspectRatio,
  useBreakpointValue,
  Box,
  Flex,
  Image,
  Avatar,
  WrapItem,
  Text
} from '@chakra-ui/react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles0 from '@src/Components/BattleBay/Areas/BattleBay.module.scss';
import ImageService from '@src/core/services/image';
import {LandsHUD} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/lands/lands-hud";
import {useAppSelector} from "@src/Store/hooks";

import MapFrame from "@src/components-v2/feature/ryoshi-dynasties/components/map-frame";
import localFont from "next/font/local";
import LandModal from './land-modal';
import myData from './points.json';
import NextApiService from "@src/core/services/api-service/next";

const gothamCondBlack = localFont({ src: '../../../../../../fonts/GothamCond-Black.woff2' })

interface BattleMapProps {
  onBack: () => void;
}

const DynastiesLands = ({onBack}: BattleMapProps) => {
  // const { getPreloadedImage } = useContext(RyoshiDynastiesPreloaderContext) as RyoshiDynastiesPreloaderProps;

  const user = useAppSelector(state => state.user);
  // const config = appConfig();
  // const { config: rdConfig, user:rdUser, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const transformComponentRef = useRef<any>(null)
  // const previousElementToZoomTo = useRef<any>(null)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [zoomState, setZoomState] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  const [area, setAreas] = useState<ReactElement[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [listings, SetListings] = useState<any>([]);
  
  const [plotId, setPlotId] = useState(0);
  const [plotPrice, setPlotPrice] = useState(0);
  const [forSale, setForSale] = useState(false);
  const [nft, setNft] = useState<any>(null);

  //zoomin
  const [elementToZoomTo, setElementToZoomTo] = useState("");
  useEffect(() => {
    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current as any;
      zoomToElement(elementToZoomTo);
      setPlotId(Number(elementToZoomTo)+1);
      onOpen();
    }
    // if(previousElementToZoomTo !== elementToZoomTo){
    //   // previousElementToZoomTo.
    //   setPreviousElementToZoomTo(elementToZoomTo);
    // }
  }, [elementToZoomTo]);
  const GetListings = async () => {
    return await NextApiService.getListingsByCollection("0x1189C0A75e7965974cE7c5253eB18eC93F2DE4Ad", {
      pageSize: 2500
    });
  }

  const CheckIfListing = (i :number) => {
    let isListing = false;
    listings.forEach((element:any) => {
        if(element.nftId === (i).toString()){
          isListing = true;
        }
    })
    return isListing;
  }
  const GetListingPrice = (i :number) => {
    let listingPrice = 0;
    listings.forEach((element:any) => {
        if(element.nftId === (i).toString()){
          listingPrice = element.price;
        }
    })
    return listingPrice;
  }
  const GetListingNft = (i :number) => {
    let listingNft = null;
    listings.forEach((element:any) => {
        if(element.nftId === (i).toString()){
          listingNft = element.nft;
        }
    })
    return listingNft;
  }
 
  const loadPoints = () => {
    setAreas(
      myData.vectors.map((point: any, i :number) => (
      <Text
        position="absolute"
        textAlign="center"
        as={'b'}
        textColor={CheckIfListing(i+1) ? "red" : "white"}
        cursor="pointer"
        id={i.toString()}
        fontSize={8}
        width={6}
        height={3}
        left={point.x}
        top={1662 - point.y}
        zIndex="10"
        onClick={() => {
          setElementToZoomTo((i).toString());
        }}
        >{i+1}</Text>
      )))
    
    setMapInitialized(true);
  }

  useEffect(() => {
    if(listings.length <= 0) return;
    console.log(listings);
    loadPoints();
  }, [listings]);

  useEffect(() => {
    if(CheckIfListing(plotId)){
      setPlotPrice(GetListingPrice(plotId));
      setNft(GetListingNft(plotId));
      setForSale(true);
    }
    else{
      setPlotPrice(0);
      setNft(null);
      setForSale(false);
    }
  }, [plotId]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await GetListings();
      if(data){
        //itterate through
        let listings = data.data.map((item: any) => {
          // console.log(item);
          return item;
        });
        SetListings(listings)
      }
    }
    fetchData()
    .catch(console.error);;

  }, []);

  const mapProps = useBreakpointValue<MapProps>(
    {
      base: {
        scale: 0.40,
        initialPosition: { x: -400, y: -127 },
        minScale: 0.15
      },
      sm: {
        scale: 0.41,
        initialPosition: { x: -335, y: -113 },
        minScale: 0.2
      },
      md: {
        scale: 0.42,
        initialPosition: { x: -185, y: -163 },
        minScale: 0.3
      },
      lg: {
        scale: 0.43,
        initialPosition: { x: 281, y: -33 },
        minScale: 0.45
      },
      xl: {
        scale: 0.44,
        initialPosition: { x: 0.78, y: -123 },
        minScale: 0.44
      },
      '2xl': {
        scale: 0.45,
        initialPosition: { x: 268, y: -33 },
        minScale: 0.45
      },
      xxl: { //doesnt apply to any screen larger than 1920px
        scale: 1.0,
        initialPosition: { x: -20, y: -35 },
        minScale: 1.1
      }
    }
  );

  return (
    <section>
      <Box 
        h='600px'
        marginBottom={'30'}
        position='relative' 
        backgroundImage={ImageService.translate(`/img/ryoshi-dynasties/village/background-${user.theme}.png`).convert()}
        backgroundSize='cover'
      >
        {mapInitialized && (
          <TransformWrapper
            // centerOnInit={true}
            ref={transformComponentRef}
            initialScale={mapProps?.scale}
            initialPositionX={mapProps?.initialPosition.x}
            initialPositionY={mapProps?.initialPosition.y}
            minScale={mapProps?.minScale}
            maxScale={2.5}
            >
            {(utils) => (
              <React.Fragment>

            <TransformComponent wrapperStyle={{height: '100%', width: '100%', objectFit: 'cover'}}>
              <MapFrame
                gridHeight={'50px 1fr 50px'}
                gridWidth={'50px 1fr 50px'}
                w='2048px'
                h='1662px'
                topFrame={ImageService.translate(`/img/ryoshi-dynasties/lands/frame-top-${user.theme}.png`).convert()}
                rightFrame={ImageService.translate(`/img/ryoshi-dynasties/lands/frame-right-${user.theme}.png`).convert()}
                bottomFrame={ImageService.translate(`/img/ryoshi-dynasties/lands/frame-bottom-${user.theme}.png`).convert()}
                leftFrame={ImageService.translate(`/img/ryoshi-dynasties/lands/frame-left-${user.theme}.png`).convert()}
              >
                <Box
                  as='img'
                  //  src={'/img/ryoshi-dynasties/lands/emptyIsland.png'}
                   src={ImageService.translate('/img/ryoshi-dynasties/lands/emptyIsland.png').custom({width: 2048, height: 1662})}
                   //  src={getPreloadedImage(ImageService.translate('/img/ryoshi-dynasties/lands/emptyIsland.png').custom({width: 2048, height: 1662}))}
                   maxW='none'
                   useMap="#imageMap" 
                   className={`${styles0.mapImageArea}`} 
                   id="fancyMenu"
                />
                <map name="imageMap" > 
                  {/* {area}  */}
                </map>
                <Flex position="absolute" zIndex="0" width="100%" height="100%">
                {area}
                {/* <div className={gothamCondBlack.className}>
                  <div className={styles.water}></div>
                  <div id='beach' className={[styles.buccaneer_beach, styles.enlarge].filter(e => !!e).join(' ')} onClick={()=> GetControlPointId("Buccaneer Beach")}>
                    <div className={[styles.worldmap_label, styles.buccaneer_beach_label].filter(e => !!e).join(' ')}>
                    <Avatar position={'absolute'} size={'xl'} className={styles.leader_flag} src={GetLeaderIcon("Buccaneer Beach")}></Avatar>Buccaneer Beach</div> </div>
                </div> */}

           

                
                </Flex>
                </MapFrame>
              </TransformComponent>
              </React.Fragment>
              )}
            </TransformWrapper>
        )}
        <LandModal isOpen={isOpen}  onClose={onClose} plotId={plotId} forSale={forSale} price={plotPrice} nft={nft}/>
        <LandsHUD onBack={onBack} setElementToZoomTo={setElementToZoomTo} showBack={false}/>
      </Box>
    </section>
  )
};


export default DynastiesLands;

interface MapProps {
  scale: number;
  initialPosition: { x: number; y: number };
  minScale: number;
}