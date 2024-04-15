import {PagedList} from "@src/core/services/api-service/paginated-list";
import {InfiniteData} from "@tanstack/query-core";
import {Box, SimpleGrid} from "@chakra-ui/react";
import {isBundle, isNftBlacklisted} from "@market/helpers/utils";
import React from "react";
import NftBundleCard from "@src/Components/components/NftBundleCard";
import {NftCard} from "@src/components-v2/shared/nft-card";
import {ResponsiveValue} from "@chakra-ui/system";

interface CollectionGroupsProps {
  data: InfiniteData<PagedList<any>>;
  canLoadMore: boolean;
  loadMore: () => void;
  fullWidth: boolean;
  listable: boolean;
  is1155: boolean;
  viewType: string;
}

export const CollectionNftsGroup = ({data, canLoadMore, loadMore, fullWidth, listable, is1155, viewType}: CollectionGroupsProps) => {

  const gridSizes: {[key: string]: ResponsiveValue<number>} = {
    'grid-sm': {base: 2, sm: 3, md: 4, lg: 5, xl: 6, '2xl': 8},
    'grid-lg': {base: 2, sm: 2, lg: 3, xl: 4, '2xl': 6}
  }

  const adjustedGridSize: ResponsiveValue<number> = Object.fromEntries(
    Object.entries(gridSizes[viewType]).map(
      ([key, value]) => [key, fullWidth ? value : Math.max(1, value - 1)]
    )
  );

  return (
    <SimpleGrid
      columns={adjustedGridSize}
      gap={3}
    >

      {data.pages.map((items, index) => (
        <React.Fragment key={index}>
          {items.data?.map((nft, index) => (
            <Box key={`${nft.id ?? nft.nftId}-${nft.name}`}>
              {isBundle(nft.address ?? nft.nftAddress) ? (
                <NftBundleCard
                  listing={nft}
                  imgClass="collection"
                />
              ) : (
                <NftCard
                  nft={nft}
                  imgClass="collection"
                  canBuy={!isNftBlacklisted(nft.address ?? nft.nftAddress, nft.id ?? nft.nftId) && listable}
                  is1155={is1155}
                />
              )}
            </Box>
          ))}

        </React.Fragment>
      ))}
    </SimpleGrid>
  )
}