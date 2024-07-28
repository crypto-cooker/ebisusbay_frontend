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
  ImageService.translate( '/img/battle-bay/imgs/water.png').convert(),
  ImageService.translate('/img/battle-bay/imgs/the_conflagration.gif').convert(),
  ImageService.translate( '/img/battle-bay/imgs/volcanic_reach.png').convert(),
  ImageService.translate('/img/battle-bay/imgs/pirate_ship.gif').convert(),
  ImageService.translate( '/img/battle-bay/imgs/clutch_of_fukurokujo.gif').convert(),
  ImageService.translate( '/img/battle-bay/imgs/orcunheim.gif').convert(),
  ImageService.translate('/img/battle-bay/imgs/felisgarde.gif').convert(),
  ImageService.translate('/img/battle-bay/imgs/ebisusbay.gif').convert(),
  ImageService.translate( '/img/battle-bay/imgs/iron_bastion.png').convert(),
  ImageService.translate( '/img/battle-bay/imgs/dragon_roost.png').convert(),
  ImageService.translate( '/img/battle-bay/imgs/ancestors_final_rest.gif').convert(),
  ImageService.translate('/img/battle-bay/imgs/nyar_spire.gif').convert(),
  ImageService.translate( '/img/battle-bay/imgs/ice_shrine.png').convert(),
  ImageService.translate('/img/battle-bay/imgs/omoikanes_athenaeum.png').convert(),
  ImageService.translate('/img/battle-bay/imgs/hunters_retreat.png').convert(),
  ImageService.translate('/img/battle-bay/imgs/mitamic_fissure.gif').convert(),
  ImageService.translate( '/img/battle-bay/imgs/seashrine.png').convert(),
  ImageService.translate('/img/battle-bay/imgs/classy_keep.gif').convert(),
  ImageService.translate('/img/battle-bay/imgs/venoms_descent.gif').convert(),
  ImageService.translate('/img/battle-bay/imgs/infinite_ignition.gif').convert(),
  ImageService.translate('/img/battle-bay/imgs/verdant_forest.png').convert(),
  ImageService.translate('/img/battle-bay/imgs/explosion.png').convert(),
  ImageService.translate('/img/battle-bay/mapImages/boat_day.apng').convert(),
  ImageService.translate('/img/ryoshi-dynasties/announcements/ads/vvs.webp').convert(),
  ImageService.translate('/img/ryoshi-dynasties/announcements/ads/vvs-sm.gif').convert(),
  ImageService.translate('/img/ryoshi-dynasties/announcements/ads/ryoshi-clubs-lg.webp').convert(),
  ImageService.translate('/img/ryoshi-dynasties/announcements/ads/ryoshi-clubs-sm.webp').convert()
];