import React, {memo, ReactNode, useEffect, useState} from 'react';
import {
  isLandDeedsCollection,
  isHerosCollection,
} from '@src/utils';

import RdHero from '@src/components-v2/feature/ryoshi-dynasties/components/heroes/rd-hero';
import RdLand from "@src/components-v2/feature/ryoshi-dynasties/components/rd-land";

export interface DynamicNftImageProps {
  address: string;
  id: string;
  children?: ReactNode;
}

export const DynamicNftImage = ({address, id, children}: DynamicNftImageProps) => {
  return (
    <>
      { isLandDeedsCollection(address) ? (
        <RdLand nftId={id} />
        ) : isHerosCollection(address) ? (
        <RdHero nftId={id} />
        ) : ( 
        <> 
          {children}
        </> 
        )}
    </>
  );
};

export default memo(DynamicNftImage);