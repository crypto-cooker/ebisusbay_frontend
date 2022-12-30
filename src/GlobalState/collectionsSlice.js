import { createSlice } from '@reduxjs/toolkit';
import { getCollectionMetadata } from '../core/api';
import {findCollectionByAddress, isNumeric} from '../utils';

import Constants from '../constants'
import useFeatureFlag from '../hooks/useFeatureFlag';

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

const { Features } = Constants;
const newEndpointEnabled = useFeatureFlag(Features.GET_COLLECTION_NEW_ENDPOINT)

export const getAllCollections =
  (sortKey = 'totalVolume', sortDirection = 'desc') =>
    async (dispatch, state) => {
      try {
        dispatch(collectionsLoading());
        const response = await getCollectionMetadata();

        if (newEndpointEnabled) {
          response.collections = formatCollections(response.collections);
        }
        else {
          response.collections.forEach(function (collection, index) {

            let contract;

            if (collection.collection.indexOf('-') !== -1) {

              let parts = collection.collection.split('-');
              contract = findCollectionByAddress(parts[0], parts[1]);
              if (contract && !contract.split) return;

            } else {
              contract = findCollectionByAddress(collection.collection);
              if (contract && contract.split) return;

            }

            if (contract) {
              if (contract.mergedAddresses) {
                mergeStats(contract, response, index);
              }
              response.collections[index].name = contract.name;
              response.collections[index].slug = contract.slug;
              response.collections[index].metadata = contract.metadata;
              response.collections[index].verification = contract.verification;
              response.collections[index].listable = contract.listable;
              response.collections[index].skip = !!contract.mergedWith;
            }

          });
        }

        const sortedCollections = sortCollections(response.collections, sortKey, sortDirection);
        dispatch(
          collectionsReceived({
            collections: sortedCollections.filter((c) => c.listable && !c.skip),
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
      averageSalePrice: collection?.stats?.total?.avg_sale_price,
      collection: collection?.address,
      floorPrice: collection?.stats?.total?.floor_price,
      listable: collection?.listable,
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
      multiToken: collection?.multiToken
    }
  ))
}