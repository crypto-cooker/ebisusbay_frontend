import axios from "axios";
import { useState } from "react";
import {appConfig} from "@src/Config";

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

    return collections.map((collection) => (
      {
        averageSalePrice: collection?.stats?.total?.avgSalePrice,
        collection: collection?.address,
        floorPrice: collection?.stats?.total?.floorPrice,
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