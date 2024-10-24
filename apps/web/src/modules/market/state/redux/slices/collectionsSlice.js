import { createSlice } from '@reduxjs/toolkit';
import { getCollectionMetadata } from '../../../../../core/api';
import {findCollectionByAddress, isNumeric} from '../../../helpers/utils';

import Constants from '../../../../../constants'
import useFeatureFlag from '@market/hooks/useFeatureFlag';

const collectionsSlice = createSlice({
  name: 'collections',
  initialState: {
    loading: false,
    error: false,
    collections: [],
    sort: {
      key: 'totalVolume',
      direction: 'desc',
    },
  },
  reducers: {
    collectionsLoading: (state) => {
      state.loading = true;
    },
    collectionsReceived: (state, action) => {
      state.loading = false;
      state.collections = action.payload.collections;
      state.sort = action.payload.sort;
    },
  },
});

export const { collectionsLoading, collectionsReceived } = collectionsSlice.actions;

export default collectionsSlice.reducer;

export const getAllCollections =
  (sortKey = 'totalVolume', sortDirection = 'desc') =>
    async (dispatch, state) => {
      try {
        dispatch(collectionsLoading());
        const response = await getCollectionMetadata();
        response.collections = formatCollections(response.collections);

        const sortedCollections = sortCollections(response.collections, sortKey, sortDirection);
        dispatch(
          collectionsReceived({
            collections: sortedCollections.filter((c) => isCollectionListable(c) && !c.skip),
            sort: {
              key: sortKey,
              direction: sortDirection,
            },
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

function sortCollections(collections, key, direction) {
  return collections.sort((a, b) => {
    const newA = isNumeric(a[key]) ? parseInt(a[key]) : a[key];
    const newB = isNumeric(b[key]) ? parseInt(b[key]) : b[key];

    if (direction === 'asc') {
      return newA > newB ? 1 : -1;
    }

    return newA < newB ? 1 : -1;
  });
}

function mergeStats(contract, response, index) {
  const merged = response.collections
    .filter((c) => {
      const addresses = [contract.address, ...contract.mergedAddresses];
      return addresses.includes(c.collection);
    })
    .reduce((a, b) => {
      return {
        numberActive: parseInt(a.numberActive) + parseInt(b.numberActive),
        volume1d: parseInt(a.volume1d) + parseInt(b.volume1d),
        volume7d: parseInt(a.volume7d) + parseInt(b.volume7d),
        volume30d: parseInt(a.volume30d) + parseInt(b.volume30d),
        totalVolume: parseInt(a.totalVolume) + parseInt(b.totalVolume),
        numberOfSales: parseInt(a.numberOfSales) + parseInt(b.numberOfSales),
        sales1d: parseInt(a.sales1d) + parseInt(b.sales1d),
        sales7d: parseInt(a.sales7d) + parseInt(b.sales7d),
        sales30d: parseInt(a.sales30d) + parseInt(b.sales30d),
        totalRoyalties: parseInt(a.totalRoyalties) + parseInt(b.totalRoyalties),
        floorPrice: parseInt(a.floorPrice) < parseInt(b.floorPrice) ? parseInt(a.floorPrice) : parseInt(b.floorPrice),
        averageSalePrice: (parseInt(a.averageSalePrice) + parseInt(b.averageSalePrice)) / 2,
      };
    });
  response.collections[index] = { ...response.collections[index], ...merged };
}

const formatCollections = (collections) => {

  return collections.map((collection) => (
    {
      averageSalePrice: collection?.stats?.total?.avgSalePrice,
      collection: collection?.address,
      floorPrice: collection?.stats?.total?.floorPrice,
      listable: isCollectionListable(collection),
      metadata: collection?.metadata,
      name: collection?.name,
      numberActive: collection?.stats?.total?.active,
      numberCancelled: collection?.stats?.total?.cancelled,
      numberOfSales: collection?.stats?.total?.complete,
      sales1d: collection?.stats?.total?.sales1d,
      sales7d: collection?.stats?.total?.sales7d,
      sales30d: collection?.stats?.total?.sales30d,
      skip: collection?.stats?.total?.onChain,
      slug: collection?.slug,
      totalFees: collection?.stats?.total?.fee,
      totalRoyalties: collection?.stats?.total?.royalty,
      totalVolume: collection?.stats?.total?.volume,
      volume1d: collection?.stats?.total?.volume1d,
      volume7d: collection?.stats?.total?.volume7d,
      volume30d: collection?.stats?.total?.volume30d,
      is1155: collection?.is1155
    }
  ))
}