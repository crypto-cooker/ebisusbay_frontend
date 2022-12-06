import axios from "axios";
import {ListingsQuery} from "@src/core/api/queries/listings";

const api = axios.create({
  baseURL: '/api',
});

export const getListingsByCollection = async (address, listingsQuery) => {
  try{
    if (!listingsQuery) listingsQuery = ListingsQuery.default();

    listingsQuery.collection = address;
    return await api.get(`listings`, {params: listingsQuery.toApi()});
  }
  catch(error){
    throw error;
  }
}

export const getListingsByIds = async (listingIds) => {
  try{
    const ids = listingIds.join(',');
    return await api.get(`listings`, {params: {listingId: ids}});
  }
  catch(error){
    throw error;
  }
}