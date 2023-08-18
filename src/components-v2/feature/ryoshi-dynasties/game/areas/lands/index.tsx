import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {
  useDisclosure,
  useBreakpointValue,
  Box,
  Flex,
  Text,
  Icon
} from '@chakra-ui/react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles0 from '@src/Components/BattleBay/Areas/BattleBay.module.scss';
import ImageService from '@src/core/services/image';
import {LandsHUD} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/lands/lands-hud";
import {useAppSelector} from "@src/Store/hooks";

import MapFrame from "@src/components-v2/feature/ryoshi-dynasties/components/map-frame";
import LandModal from './land-modal';
import NextApiService from "@src/core/services/api-service/next";
import {appConfig} from "@src/Config";
const config = appConfig();

import {useInfiniteQuery} from "@tanstack/react-query";
import {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import {TriangleUpIcon } from '@chakra-ui/icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuildingColumns} from "@fortawesome/free-solid-svg-icons";
import {getNft} from "@src/core/api/endpoints/nft";

import mapData from './points.json';
import landsMetadata from './lands-metadata.json';

interface BattleMapProps {
  onBack: () => void;
}

const DynastiesLands = ({onBack}: BattleMapProps) => {
  const user = useAppSelector(state => state.user);
  const transformComponentRef = useRef<any>(null)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [textArea, setTextArea] = useState<ReactElement[]>([]);
  const [pointArea, setPointArea] = useState<ReactElement[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [listings, SetListings] = useState<any>([]);
  const [allNFTs, SetAllNFTs] = useState<any>([]);
  
  const [plotId, setPlotId] = useState(0);
  const [plotPrice, setPlotPrice] = useState(0);
  const [forSale, setForSale] = useState(false);
  const [nft, setNft] = useState<any>(null);

  const [elementToZoomTo, setElementToZoomTo] = useState("");
  const [showText, setShowText] = useState(false);
  const [zoomState, setZoomState] = useState({offsetX: 0, offsetY: 0, scale: 1,});

  // const [attributes, setAttributes] = useState<Attribute>([]);
  const [traitTypes, setTraitTypes] = useState<string[]>([]);
  const [filteredMapData, setFilteredMapData] = useState<MapPoints>()
  const [filteredMetadata, setFilteredMetadata] = useState<MetaData>()
  const [resetMap, setResetMap] = useState(false);
  
  const GetListings = async () => {
    const collectionAddress = config.collections.find((c: any) => c.slug === 'izanamis-cradle-land-deeds')?.address;
    return await NextApiService.getListingsByCollection(collectionAddress, {
      pageSize: 2500
    });
  }

  const GetSpecificNFT = async (tokenId: number) => {
    const collectionAddress = config.collections.find((c: any) => c.slug === 'izanamis-cradle-land-deeds').address;
    // console.log("collectionAddress", collectionAddress);
    // console.log("tokenId", tokenId);
    const data = await getNft(collectionAddress, tokenId);
    // console.log("data", data);
    setNft(data);
  }

  const [queryParams, setQueryParams] = useState<WalletsQueryParams>({
    collection: config.collections.find((c: any) => c.slug === 'izanamis-cradle-land-deeds')?.address,
  });
  const fetcher = async ({ pageParam = 1 }) => {
    const params: WalletsQueryParams = {
      page: pageParam,
      ...queryParams
    }
    return NextApiService.getWallet(user.address!, params);
  };
  const changeCanvasState = (ReactZoomPanPinchRef: any, event: any) => {
    setZoomState({
      offsetX: ReactZoomPanPinchRef.state.positionX,
      offsetY: ReactZoomPanPinchRef.state.positionY,
      scale: ReactZoomPanPinchRef.state.scale,
    });
  };
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
  const {data: ownedDeeds, error, fetchNextPage, hasNextPage, status, refetch} = useInfiniteQuery(
    ['Inventory', user.address, queryParams],
    fetcher,
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    }
  )
  const GetTextColor = (i :number) => {
    if(CheckIfListing(i)){
      return "gold";
     }
     return "white";
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
    console.log("listingNft", listingNft);
    return listingNft;
  }
  const loadPoints = () => {
    if(!filteredMapData || !filteredMetadata) return;

    // console.log("loadPoints", filteredMetadata);
    
    setTextArea(
      filteredMapData.vectors.map((point: any, i :number) => (
        <>
          {ownedDeeds?.pages[0].data.find((element:any) => element.nftId === (i + 1).toString()) ? (<>
            <Icon
              position="absolute"
              as={FontAwesomeIcon} 
              icon={faBuildingColumns}
              color={'#D24547'}
              width={4}
              height={4}
              left={point.x-2}
              top={1662 - point.y-2}
              id={filteredMapData.nfts[i].id}
              cursor="pointer"
              zIndex="10"
              onClick={() => {
                setElementToZoomTo(filteredMapData.nfts[i]);
              }}
            ></Icon>
          </> ) : (<> 
          <>
            <Text
              position="absolute"
              textAlign="center"
              as={'b'}
              textColor={GetTextColor(Number(filteredMapData.nfts[i].id)+1)}
              cursor="pointer"
              id={filteredMapData.nfts[i].id}
              fontSize={8}
              width={6}
              height={3}
              left={point.x-3}
              top={1662 - point.y-1}
              zIndex="10"
              onClick={() => {
                setElementToZoomTo(filteredMapData.nfts[i]);
              }}
            >
              <>{filteredMapData.nfts[i]}</>
            </Text>
          </>
          </>)}
        </>
      )))

    setPointArea(
      filteredMapData.vectors.map((point: any, i :number) => (
          <>
            {ownedDeeds?.pages[0].data.find((element:any) => element.nftId === (i + 1).toString()) ? (<>
              <Icon
                position="absolute"
                as={FontAwesomeIcon} 
                icon={faBuildingColumns}
                color={'#D24547'}
                width={4}
                height={4}
                left={point.x}
                top={1662 - point.y}
                id={i.toString()}
                cursor="pointer"
                zIndex="10"
                onClick={() => {
                  setElementToZoomTo(filteredMapData.nfts[i].id);
                }}
              ></Icon>
            </> ) : (<> 
              <TriangleUpIcon
                position="absolute"
                // id={i.toString()}
                width={8}
                height={8}
                left={point.x-16}
                top={1662 - point.y-16}
                zIndex="10"
                ></TriangleUpIcon>
            </>)}
          </>
        )))
    setMapInitialized(true);
  }

  useEffect(() => {
    if(!filteredMapData) return;
    loadPoints();
  }, [listings, filteredMapData, ownedDeeds]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await GetListings();
      if(data){
        let listings = data.data.map((element:any) => {
          return element;
          });
          SetListings(listings);
      }
    }
    fetchData().catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    console.log("plotId", plotId);
    if(CheckIfListing(plotId)){
      console.log("for sale");
      setPlotPrice(GetListingPrice(plotId));
      setNft(GetListingNft(plotId));
      setForSale(true);
    }
    else{
      console.log("not for sale");
      setPlotPrice(0);
      GetSpecificNFT(plotId);
      setForSale(false);
    }
  }, [plotId]);

  useEffect(() => {
    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current as any;

      // console.log("elementToZoomTo", elementToZoomTo);
      zoomToElement(elementToZoomTo);
      setPlotId(Number(elementToZoomTo));
      onOpen();
    }
  }, [elementToZoomTo]);
  useEffect(() => {
    if(!showText && zoomState.scale >= 1.1){
      setShowText(true);
    }
    else if(showText && zoomState.scale < 1.1){
      setShowText(false);
    }
  }, [zoomState.scale]);
  useEffect(() => {
    if(!landsMetadata) return;

    let allTraitTypes: string[] = [];
    landsMetadata.finalMetadata.map((item: any) => {
      //check if attribute exists
      //itterate through item attributes
      item.attributes.forEach((attribute: any) => {
        if(!allTraitTypes.includes(attribute.value)){
          allTraitTypes.push(attribute.value);
        }
      });
    });
    setTraitTypes(allTraitTypes.sort());
  }, [landsMetadata]);

  useEffect(() => {
    if(!landsMetadata) return;
    if(!mapData) return;

    setFilteredMapData({vectors: mapData.vectors, nfts: landsMetadata.finalMetadata});
    setFilteredMetadata(landsMetadata);
  }, [mapData, landsMetadata, resetMap]);

  const FilterByTraitCallback = (trait:string) => {
    if(!filteredMetadata) return;
    //filter to only get the ones with that trait under attributes
    let filteredMetadataLocal = landsMetadata.finalMetadata.filter((item: any) => {
      return item.attributes.some((attribute: any) => attribute.value === trait);
    });
    console.log(trait, "count:", filteredMetadataLocal.length);
    setFilteredMetadata({finalMetadata: filteredMetadataLocal});
  }

  useEffect(() => {
    if(!filteredMetadata) return;
    if(!filteredMapData) return;

    // console.log("", filteredMetadata.finalMetadata.length);
    // console.log("filteredMapData", filteredMapData);

    let filteredMapDataLocal = mapData.vectors.filter((item: any, index:number) => {
      return filteredMetadata.finalMetadata.some((metadata: landNFT) => metadata.id === (index+1).toString());
    });

    let nftIdsLocal = filteredMetadata.finalMetadata.map((item: any) => {
      return item.id;
    });

    setFilteredMapData({vectors: filteredMapDataLocal, nfts: nftIdsLocal});

  }, [filteredMetadata]);

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
            ref={transformComponentRef}
            onZoom={changeCanvasState}
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
                gridHeight={'18px 1fr 18px'}
                gridWidth={'18px 1fr 18px'}
                w='2084px'
                h='1662px'
                topFrame={ImageService.translate(`/img/ryoshi-dynasties/lands/frame-top-${user.theme}.png`).convert()}
                rightFrame={ImageService.translate(`/img/ryoshi-dynasties/lands/frame-right-${user.theme}.png`).convert()}
                bottomFrame={ImageService.translate(`/img/ryoshi-dynasties/lands/frame-bottom-${user.theme}.png`).convert()}
                leftFrame={ImageService.translate(`/img/ryoshi-dynasties/lands/frame-left-${user.theme}.png`).convert()}
              >
                <Box
                  as='img'
                   src={ImageService.translate('/img/ryoshi-dynasties/lands/emptyIsland.png').custom({width: 2048, height: 1662})}
                   //  src={getPreloadedImage(ImageService.translate('/img/ryoshi-dynasties/lands/emptyIsland.png').custom({width: 2048, height: 1662}))}
                   maxW='none'
                   useMap="#imageMap" 
                   className={`${styles0.mapImageArea}`} 
                   id="fancyMenu"
                />
                <map name="imageMap" > 
                </map>
                <Flex position="absolute" zIndex="0" width="100%" height="100%">
                {showText ?(
                  <>
                    {textArea}
                  </> 
                )  : (
                  <>
                    {pointArea}
                  </>
                )}
                </Flex>
                </MapFrame>
              </TransformComponent>
              </React.Fragment>
              )}
            </TransformWrapper>
        )}
        <LandModal isOpen={isOpen}  onClose={onClose} plotId={plotId} forSale={forSale} price={plotPrice} nft={nft}/>
        <LandsHUD onBack={onBack} traitTypes={traitTypes} setElementToZoomTo={setElementToZoomTo} showBack={false} FilterByTraitCallback={FilterByTraitCallback}/>
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
interface Attribute {
  trait_type: string;
  value: string;
  display_type:string;
}
interface MetaData {
  finalMetadata: landNFT[]
}
interface landNFT{
  image:string;
  name:string;
  description:string;
  id:string;
  attributes:Attribute[];
}
interface MapPoints{
  vectors:Vector[];
  nfts:landNFT[];
}
interface Vector{
  x:number;
  y:number;
}