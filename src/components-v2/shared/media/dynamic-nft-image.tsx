import React, {memo, ReactNode, useEffect, useState} from 'react';
import {
  isLandDeedsCollection,
  isHeroesCollection, isVaultCollection,
} from '@src/utils';

import RdHero from '@src/components-v2/feature/ryoshi-dynasties/components/heroes/rd-hero';
import RdHeroFrame from '@src/components-v2/feature/ryoshi-dynasties/components/heroes/rd-hero-frame';
import RdLand from "@src/components-v2/feature/ryoshi-dynasties/components/rd-land";
import VaultNft from "@src/components-v2/feature/ryoshi-dynasties/components/vault-nft";

export interface DynamicNftImageProps {
  nft?: {
    id?: string;
    address?: string;
    nftId?: string;
    nftAddress?: string;
    attributes?: any[]
  }
  address: string;
  id: string;
  children?: ReactNode;
  showDetails?: boolean;
  showStats?: boolean;
}

export const DynamicNftImage = ({nft, address, id, children, showDetails, showStats = true}: DynamicNftImageProps) => {
  return (
    <>
      { isLandDeedsCollection(address) ? (
        <RdLand nftId={id} />
      ) : isHeroesCollection(address) ? (
        <>
          {showDetails ? (
            <RdHeroFrame nftId={id} />
            ) : (
            <RdHero nftId={id} showStats={showStats}/>
          )}
        </>
      ) : isVaultCollection(address) && nft ? (
        <>
          <VaultNft nft={nft} children={children} />
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