import React, {memo, ReactNode, useEffect, useState} from 'react';
import {
  isLandDeedsCollection,
  isHerosCollection,
} from '@src/utils';

import RdHero from '@src/components-v2/feature/ryoshi-dynasties/components/heroes/rd-hero';
import RdHeroFrame from '@src/components-v2/feature/ryoshi-dynasties/components/heroes/rd-hero-frame';
import RdLand from "@src/components-v2/feature/ryoshi-dynasties/components/rd-land";

export interface DynamicNftImageProps {
  address: string;
  id: string;
  children?: ReactNode;
  showDetails?: boolean;
}

export const DynamicNftImage = ({address, id, children, showDetails}: DynamicNftImageProps) => {
  return (
    <>
      { isLandDeedsCollection(address) ? (
        <RdLand nftId={id} />
        ) : isHerosCollection(address) ? (
          <>
            {showDetails ? (
              <RdHeroFrame nftId={id} />
              ) : (
              <RdHero nftId={id} showStats={true}/>
            )}
          </>
        ) : ( 
        <> 
          {children}
        </> 
        )}
    </>
  );
};

export default memo(DynamicNftImage);