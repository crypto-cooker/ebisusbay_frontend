import axios from "axios";
import { useState } from "react";
import {appConfig} from "@src/config";
import mergedCollections from "@src/core/data/merged-collections.json";
import {ciEquals, isWeirdApesCollection} from "@market/helpers/utils";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.api
});

const useGetCollections = () => {

  const [filters, setFilters] = useState({
    pageSize: 50,
    direction: 'desc',
    verified: null,
    sortBy: 'totalvolume7d',
    search: '',
  });
  

  const changeFilters = (newFilter: any) => {
    setFilters({...filters, ...newFilter});
  }

  const formatCollections = (collections: any) => {

    const skippableCollections = mergedCollections.reduce((p: any[], n) => {
      p.push(...n.addresses.map((a: any) => a.toLowerCase()));
      return p;
    }, []);

    return collections
      .filter((collection: any) => {
        return !skippableCollections.some((c) => ciEquals(c, collection.address));
      })
      .map((collection: any) => {
        let totalVolume = collection.stats?.total?.volume;
        if (isWeirdApesCollection(collection.address)) {
          totalVolume = (Number(totalVolume) + 679536.64).toString();
        }

        return {
          averageSalePrice: collection.stats?.total?.avgSalePrice,
          averageSalePrice1d: collection.stats?.total?.avgSalePrice1d,
          averageSalePrice7d: collection.stats?.total?.avgSalePrice7d,
          averageSalePrice30d: collection.stats?.total?.avgSalePrice30d,
          averageSalePrice1dIncrease: collection.stats?.total?.avgSalePrice1d_increase,
          averageSalePrice7dIncrease: collection.stats?.total?.avgSalePrice7d_increase,
          collection: collection.address,
          floorPrice: collection.stats?.total?.floorPrice,
          listable: collection.listable,
          metadata: collection.metadata,
          name: collection.name,
          numberActive: collection.stats?.total?.active,
          numberCancelled: collection.stats?.total?.cancelled,
          numberOfSales: collection.stats?.total?.sales,
          sales1d: collection.stats?.total?.sales1d,
          sales7d: collection.stats?.total?.sales7d,
          sales30d: collection.stats?.total?.sales30d,
          sales1dIncrease: collection.stats?.total?.sales1d_increase,
          sales7dIncrease: collection.stats?.total?.sales7d_increase,
          slug: collection.slug,
          totalFees: collection.stats?.total?.fee,
          totalRoyalties: collection.stats?.total?.royalty,
          totalVolume: totalVolume,
          volume1d: collection.stats?.total?.volume1d,
          volume7d: collection.stats?.total?.volume7d,
          volume30d: collection.stats?.total?.volume30d,
          volume1dIncrease: collection.stats?.total?.volume1d_increase,
          volume7dIncrease: collection.stats?.total?.volume7d_increase,
          is_1155: collection.is_1155,
          verification: collection.verification,
          chain: collection.chain
        };
      }
    );
  }

  // const mergeStats = (contract, response, index) => {
  //   const merged = response.collections
  //     .filter((c) => {
  //       const addresses = [contract.address, ...contract.mergedAddresses];
  //       return addresses.includes(c.collection);
  //     })
  //     .reduce((a, b) => {
  //       return {
  //         numberActive: parseInt(a.numberActive) + parseInt(b.numberActive),
  //         volume1d: parseInt(a.volume1d) + parseInt(b.volume1d),
  //         volume7d: parseInt(a.volume7d) + parseInt(b.volume7d),
  //         volume30d: parseInt(a.volume30d) + parseInt(b.volume30d),
  //         totalVolume: parseInt(a.totalVolume) + parseInt(b.totalVolume),
  //         numberOfSales: parseInt(a.numberOfSales) + parseInt(b.numberOfSales),
  //         sales1d: parseInt(a.sales1d) + parseInt(b.sales1d),
  //         sales7d: parseInt(a.sales7d) + parseInt(b.sales7d),
  //         sales30d: parseInt(a.sales30d) + parseInt(b.sales30d),
  //         totalRoyalties: parseInt(a.totalRoyalties) + parseInt(b.totalRoyalties),
  //         floorPrice: parseInt(a.floorPrice) < parseInt(b.floorPrice) ? parseInt(a.floorPrice) : parseInt(b.floorPrice),
  //         averageSalePrice: (parseInt(a.averageSalePrice) + parseInt(b.averageSalePrice)) / 2,
  //       };
  //     });
  //   response.collections[index] = { ...response.collections[index], ...merged };
  // }

  const getCollections = async (page = 1) => {
    const res = await api.get(`/collectioninfo`, { params: {
      ...filters,
      page
    }});

    let formattedCollections = formatCollections(res.data.collections);

    // Weird Apes hack
    if (filters.sortBy === 'totalvolume' && filters.direction === 'desc' && page === 1) {
      formattedCollections = formattedCollections.sort((a: any, b: any) => Number(a.totalVolume) < Number(b.totalVolume) ? 1 : -1);
    }
    
    return formattedCollections;
  }

  return [filters, getCollections, changeFilters] as const;
}

export default useGetCollections;