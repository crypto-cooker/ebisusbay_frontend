import axios from "axios";
import {ListingsQuery} from "@src/core/api/queries/listings";
import {getValidListings} from "@src/core/api/endpoints/listings"
import {listingState} from "@src/core/api/enums";
const api = axios.create({
  baseURL: '/api',
});

/**
 * @deprecated: use @src/core/service/api-service/next/getListingsByCollection
  */
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

/**
 * @deprecated: use @src/core/service/api-service/next/getListingsByIds
 */
export const getListingsByIds = async (listingIds) => {
  if (!Array.isArray(listingIds)) listingIds = [listingIds];

  try{
    const ids = listingIds.join(',');
    return await api.get(`listings`, {params: {listingId: ids}});
  }
  catch(error){
    throw error;
  }
}

/**
 * @deprecated
 */
export const getValidListingsByIds = async (listingIds) => {
  try{
    const ids = listingIds.join(',');
    return await getValidListings({listingId: ids});
  }
  catch(error){
    throw error;
  }
}

/**
 * @deprecated: use @src/core/service/api-service/next/getAllListingsByUser
 */
export const getAllListingsByUser = async (address) => {
  try{
    const listings = await api.get(`listings`, {params: {
      seller: address,
      pageSize: 1000,
      state: listingState.ACTIVE
    }});

    return listings;
  }
  catch(error){
    throw error;
  }
}