import {appConfig} from "@src/config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const getCollections = async (query) => {
  try{
    const params = {...query};

    return await api.get(`collection`, {params});
  }
  catch(error){
    throw error;
  }
}

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

export const update = async (query, body) => {
  try{
    const params = {...query};
    return await api.put(`collection/update`, body, {params});
  }
  catch(error){
    throw error;
  }
}

export const updateAvatar = async (query, body) => {
  try{
    const params = {...query};
    return await api.patch(`collection/avatar`, body, {params});
  }
  catch(error){
    throw error;
  }
}

export const updateBanner = async (query, body) => {
  try{
    const params = {...query};
    return await api.patch(`collection/banner`, body, {params});
  }
  catch(error){
    throw error;
  }
}

export const updateCard = async (query, body) => {
  try{
    const params = {...query};
    return await api.patch(`collection/card`, body, {params});
  }
  catch(error){
    throw error;
  }
}

export const reportCollection = async (address, signature, body) => {
  try{
    return await api.post(`collection/report`, body, {params: {address, signature}});
  }
  catch(error){
    throw error;
  }
}