import axios from "axios";

const api = axios.create({
  baseURL: '/api',
});

export const getListingsByCollection = async (address, listingsQuery) => {
  try{
    listingsQuery.collection = address;
    return await api.get(`listings`, {params: listingsQuery.toApi()});
  }
  catch(error){
    throw error;
  }
}