import React, {ReactNode, useEffect, useState} from "react";
import {
  RyoshiDynastiesPreloaderContext
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/preloader-context";
import ImageService from "@src/core/services/image";

interface ImagePreloaderProps {
  // sceneKey: string;
  children: ReactNode;
  // threshold?: number;
}

const ImagePreloader = ({ children }: ImagePreloaderProps) => {

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedUrls, setLoadedUrls] = useState<{ [key: string]: HTMLImageElement }>({});

  useEffect(() => {
    const load = async () => {
      try {
        const loaded: { [key: string]: HTMLImageElement } = {};
        for (const imageUrl of imageUrls) {
          const img = new Image();
          img.src = imageUrl as string;
          loaded[imageUrl] = img;
        }
        setLoadedUrls(loaded);
        setLoading(false);
      } catch (error) {
        console.error('Failed to preload images:', error);
      }
    };

    load();
  }, []);

  const getPreloadedImage = (key: string) => {
    const record = Object.entries(loadedUrls).find(([k, v]) => k === key);
    // console.log('found?', key, Object.entries(loadedUrls), record, !!record);
    return record ? record[1].src : key;
  }

  return (
    <RyoshiDynastiesPreloaderContext.Provider
      value={{
        images: loadedUrls,
        getPreloadedImage
      }}
    >
      {/*{loading ? (*/}
      {/*  <Center>*/}
      {/*    <Spinner />*/}
      {/*  </Center>*/}
      {/*) : (*/}
      <>{children}</>
      {/*)}*/}
      {/*<Box*/}
      {/*  ref={ref}*/}
      {/*  style={{*/}
      {/*    display: isMostImagesLoaded ? "block" : "none",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {children}*/}
      {/*</Box>*/}
      {/*{!isMostImagesLoaded && <p>Loading...</p>}*/}
    </RyoshiDynastiesPreloaderContext.Provider>
  );
};

export default ImagePreloader;


const imageUrls = [
  ImageService.translate('/img/ryoshi-dynasties/battle/world-map-background.jpg').custom({width: 2880, height: 2021}),
  '/img/battle-bay/imgs/water.png',
  '/img/battle-bay/imgs/the_conflagration.gif',
  '/img/battle-bay/imgs/volcanic_reach.png',
  '/img/battle-bay/imgs/pirate_ship.gif',
  '/img/battle-bay/imgs/clutch_of_fukurokujo.gif',
  '/img/battle-bay/imgs/orcunheim.gif',
  '/img/battle-bay/imgs/felisgarde.gif',
  '/img/battle-bay/imgs/ebisusbay.gif',
  '/img/battle-bay/imgs/iron_bastion.png',
  '/img/battle-bay/imgs/dragon_roost.png',
  '/img/battle-bay/imgs/ancestors_final_rest.gif',
  '/img/battle-bay/imgs/nyar_spire.gif',
  '/img/battle-bay/imgs/ice_shrine.png',
  '/img/battle-bay/imgs/omoikanes_athenaeum.png',
  '/img/battle-bay/imgs/hunters_retreat.png',
  '/img/battle-bay/imgs/mitamic_fissure.gif',
  '/img/battle-bay/imgs/seashrine.png',
  '/img/battle-bay/imgs/classy_keep.gif',
  '/img/battle-bay/imgs/venoms_descent.gif',
  '/img/battle-bay/imgs/infinite_ignition.gif',
  '/img/battle-bay/imgs/verdant_forest.png',
  '/img/battle-bay/imgs/explosion.png',
  ImageService.translate('/img/battle-bay/mapImages/boat_day.apng').convert()
];