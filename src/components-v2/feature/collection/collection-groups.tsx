import {PagedList} from "@src/core/services/api-service/paginated-list";
import {InfiniteData} from "@tanstack/query-core";
import {Box, SimpleGrid} from "@chakra-ui/react";
import {isBundle, isNftBlacklisted} from "@src/utils";
import React from "react";
import NftBundleCard from "@src/Components/components/NftBundleCard";
import {NftCard} from "@src/components-v2/shared/nft-card";

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

  const gridSizes = {
    'grid-sm': {base: 2, sm: 3, md: 4, lg: 5, xl: 6, '2xl': 7},
    'grid-lg': {base: 1, sm: 2, lg: 3, xl: 4, '2xl': 6}
  }

  return (
    <SimpleGrid
      columns={!fullWidth ? {base: 1, sm: 2, lg: 3, xl: 4, '2xl': 6} : {base: 2, sm: 3, md: 4, lg: 5, xl: 6, '2xl': 7}}
      gap={3}
    >

      {data.pages.map((items, index) => (
        <React.Fragment key={index}>
          {items.data?.map((nft, index) => (
            <Box key={`${nft.name}`}>
              {isBundle(nft.nftAddress) ? (
                <NftBundleCard
                  listing={nft}
                  imgClass="collection"
                />
              ) : (
                <NftCard
                  nft={nft}
                  imgClass="collection"
                  canBuy={!isNftBlacklisted(nft.nftAddress, nft.nftId) && listable}
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