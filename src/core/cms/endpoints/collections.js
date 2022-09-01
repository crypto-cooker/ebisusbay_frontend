import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const setOwner = async (query, collectionAddress, ownerAddress) => {
  const params = {...query};
  try{
    return await api.patch(`collection/setOwner`, {collectionAddress, ownerAddress}, {params});
  }
  catch(error){
    console.log('ERROR: ', error)
    throw error;
  }
}

export const clearOwner = async (query, collectionAddress) => {
  const params = {...query};
  try{
    return await api.patch(`collection/clearOwner`, {collectionAddress}, {params});
  }
  catch(error){
    throw error;
  }
}