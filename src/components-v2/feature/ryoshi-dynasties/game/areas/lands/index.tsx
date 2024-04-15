import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Box, Flex, Icon, useBreakpointValue, useDisclosure} from '@chakra-ui/react'
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import styles0 from '@src/Components/BattleBay/Areas/BattleBay.module.scss';
import ImageService from '@src/core/services/image';
import {LandsHUD} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/lands/lands-hud";
import {useAppSelector} from "@market/state/redux/store/hooks";

import MapFrame from "@src/components-v2/feature/ryoshi-dynasties/components/map-frame";
import LandModal from './land-modal';
import NextApiService from "@src/core/services/api-service/next";
import {appConfig} from "@src/Config";
import {useQuery} from "@tanstack/react-query";
import {TriangleUpIcon} from '@chakra-ui/icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuildingColumns} from "@fortawesome/free-solid-svg-icons";
import {getNft} from "@src/core/api/endpoints/nft";

import mapData from './points.json';
import landsMetadata from './lands-metadata.json';
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();

interface SelectedPlot {
  id: number;
  price: number;
  forSale: boolean;
  nft: any;
}

interface BattleMapProps {
  onBack: () => void;
  showBackButton: boolean;
}

const DynastiesLands = ({onBack, showBackButton}: BattleMapProps) => {
  const user = useUser();
  const transformComponentRef = useRef<any>(null)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mapInitialized, setMapInitialized] = useState(false);

  const [selectedPlot, setSelectedPlot] = useState<SelectedPlot | null>(null);

  const [elementToZoomTo, setElementToZoomTo] = useState("");
  const [showText, setShowText] = useState(false);
  const [zoomState, setZoomState] = useState({offsetX: 0, offsetY: 0, scale: 1,});

  const [traitTypes, setTraitTypes] = useState<string[]>([]);
  const [resetMap, setResetMap] = useState(false);
  const [plots, setPlots] = useState<MapPlot[]>([]);
  const collectionAddress = config.collections.find((c: any) => c.slug === 'izanamis-cradle-land-deeds')!.address;

  const {data: listings} = useQuery({
    queryKey: ['IzanamiMapListings', collectionAddress],
    queryFn: async () => {
      const listings = await NextApiService.getListingsByCollection(collectionAddress, {
        pageSize: 2500
      });
      return listings.data.map((element:any) => {
        return element;
      });
    },
    enabled: !!collectionAddress,
    refetchOnWindowFocus: false,
    initialData: []
  });

  const onCloseResetElement = () => {
    setElementToZoomTo("");
    onClose();
  };


  const {data: ownedDeeds} = useQuery({
    queryKey: ['IzanamiMapInventory', user.address],
    queryFn: () => NextApiService.getWallet(user.address!, {
      page: 1,
      pageSize: 100,
      collection: collectionAddress
    }),
    refetchOnWindowFocus: false,
    enabled: !!user.address && !!collectionAddress,
    initialData: {data: [], hasNextPage: false, nextPage: 2, page: 1}
  });

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

  const textColor = (isListed: boolean) => {
    return isListed ? 'gold' : 'white';
  }

  const plotTextPoints = useMemo(() => {
    return plots.map((plot: any) => (
      <>
        {plot.owned ? (
          <Icon
            position="absolute"
            as={FontAwesomeIcon}
            icon={faBuildingColumns}
            color={'#D24547'}
            width={4}
            height={4}
            left={plot.vector.x-2}
            top={1662 - plot.vector.y-2}
            id={plot.nft.id}
            cursor="pointer"
            zIndex="10"
            onClick={() => setElementToZoomTo(plot.nft.id)}
          />
        ) : (
          <Box
            position="absolute"
            textAlign="center"
            fontWeight="bold"
            textColor={textColor(plot.listed)}
            cursor="pointer"
            id={plot.nft.id}
            fontSize={8}
            width={6}
            height={3}
            left={plot.vector.x-3}
            top={1662 - plot.vector.y-1}
            zIndex="10"
            onClick={() => setElementToZoomTo(plot.nft.id)}
          >
            <>{plot.nft.id}</>
          </Box>
        )}
      </>
    ));
  }, [plots]);

  const plotPoints = useMemo(() => {
    return plots.map((plot: any) => (
      <>
        {plot.owned ? (
          <Icon
            position="absolute"
            as={FontAwesomeIcon}
            icon={faBuildingColumns}
            color={'#D24547'}
            width={4}
            height={4}
            left={plot.vector.x}
            top={1662 - plot.vector.y}
            id={plot.nft.id}
            cursor="pointer"
            zIndex="10"
            onClick={() => setElementToZoomTo(plot.nft.id)}
          />
        ) : (
          <TriangleUpIcon
            position="absolute"
            // id={i.toString()}
            width={8}
            height={8}
            left={plot.vector.x-16}
            top={1662 - plot.vector.y-16}
            zIndex="10"
          />
        )}
      </>
    ))
  }, [plots]);

  useEffect(() => {
    if(!plots) return;
    setMapInitialized(true);
  }, [plots]);

  // Load selected plot
  useEffect(() => {
    async function selectPlot(plotId: number) {
      let plot = {
        id: plotId,
        price: 0,
        forSale: false,
        nft: null
      };

      if (!plotId) {
        setSelectedPlot(null);
        return;
      }

      const listing = listings.find((listing: any) => listing.nftId === plotId.toString());
      if(!!listing){
        plot.price = listing.price;
        plot.nft = listing.nft;
        plot.forSale = true;
      } else {
        plot.nft = await getNft(collectionAddress, plotId)
      }
      setSelectedPlot(plot);
    }

    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current as any;

      zoomToElement(elementToZoomTo);
      selectPlot(Number(elementToZoomTo));
      onOpen();
    }
  }, [elementToZoomTo]);

  // Toggle map text
  useEffect(() => {
    if(!showText && zoomState.scale >= 1.1){
      setShowText(true);
    } else if(showText && zoomState.scale < 1.1){
      setShowText(false);
    }
  }, [zoomState.scale]);

  // Populate trait types filter
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

  // Initialize plots
  useEffect(() => {
    if(!landsMetadata) return;
    if(!mapData) return;

    setPlots(landsMetadata.finalMetadata.map((item: any, key) => {
      return {
        nft: item,
        vector: mapData.vectors[key],
        listed: listings.some((listing: any) => listing.nftId === item.id.toString()),
        owned: ownedDeeds.data.some((element:any) => element.nftId === item.id.toString())
      }
    }));
  }, [mapData, landsMetadata, resetMap, listings, ownedDeeds]);

  const handleFilterByTrait = (trait: string) => {
    let filteredMetadata = landsMetadata.finalMetadata.filter((item: any) => {
      return item.attributes.some((attribute: any) => attribute.value === trait);
    });

    setPlots(filteredMetadata.map((item: any, key) => {
      return {
        nft: item,
        vector: mapData.vectors[item.id - 1],
        listed: listings.some((listing: any) => listing.nftId === item.id.toString()),
        owned: ownedDeeds.data.some((element:any) => element.nftId === item.id.toString())
      }
    }));
  }

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
                      {showText ? <>{plotTextPoints}</> : <>{plotPoints}</>}
                    </Flex>
                  </MapFrame>
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        )}
        {selectedPlot && (
          <LandModal isOpen={isOpen} onClose={onCloseResetElement} plot={selectedPlot} />
        )}
        <LandsHUD onBack={onBack} showBackButton={showBackButton} traitTypes={traitTypes} setElementToZoomTo={setElementToZoomTo} FilterByTraitCallback={handleFilterByTrait}/>
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
interface LandNft {
  image:string;
  name:string;
  description:string;
  id:string;
  attributes:Attribute[];
}
interface MapPlot {
  nft: LandNft;
  vector: Vector;
  listed: boolean;
  owned: boolean;
}
interface Vector{
  x:number;
  y:number;
}