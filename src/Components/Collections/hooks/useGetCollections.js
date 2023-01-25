import axios from "axios";
import { useState } from "react";
import {appConfig} from "@src/Config";
import mergedCollections from "@src/core/data/merged-collections.json";
import {caseInsensitiveCompare} from "@src/utils";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.api
});

const useGetCollections = () => {

  const [filters, setFilters] = useState({
    pageSize: 50,
    direction: 'desc',
    verified: null,
    sortBy: 'totalvolume',
    search: ''
  });
  

  const changeFilters = (newFilter) => {
    setFilters({...filters, ...newFilter});
  }

  const formatCollections = (collections) => {

    const skippableCollections = mergedCollections.reduce((p, n) => {
      p.push(...n.addresses.map((a) => a.toLowerCase()));
      return p;
    }, []);

    return collections
      .filter((collection) => {
        return !skippableCollections.some((c) => caseInsensitiveCompare(c, collection.address));
      })
      .map((collection) => {
      return {
        averageSalePrice: collection.stats?.total?.avgSalePrice,
        collection: collection.address,
        floorPrice: collection.stats?.total?.floorPrice,
        listable: collection.listable,
        metadata: collection.metadata,
        name: collection.name,
        numberActive: collection.stats?.total?.active,
        numberCancelled: collection.stats?.total?.cancelled,
        numberOfSales: collection.stats?.total?.complete,
        sales1d: collection.stats?.total?.sales1d,
        sales7d: collection.stats?.total?.sales7d,
        sales30d: collection.stats?.total?.sales30d,
        slug: collection.slug,
        totalFees: collection.stats?.total?.fee,
        totalRoyalties: collection.stats?.total?.royalty,
        totalVolume: collection.stats?.total?.volume,
        volume1d: collection.stats?.total?.volume1d,
        volume7d: collection.stats?.total?.volume7d,
        volume30d: collection.stats?.total?.volume30d,
        multiToken: collection.multiToken,
        verification: collection.verification
      };
    });
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
    }})
    return formatCollections(res.data.collections);
  }

  return [filters, getCollections, changeFilters];
}

export default useGetCollections;