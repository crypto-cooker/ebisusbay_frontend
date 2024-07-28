import axios from "axios";

const api = axios.create({
  baseURL: '/api',
});
const defaults = {
  pageSize: 500
};

export const getCollections = async (query) => {
  try{
    const params = {...defaults, ...query};

    return await api.get(`collections`, {params});
  }
  catch(error){
    throw error;
  }
}

export const getCollection = async (address) => {
  try{
    const params = {...defaults, ...{address}};

    const collections = await api.get(`collections`, {params});
    return collections.data.collections[0];
  }
  catch(error){
    throw error;
  }
}

//added by Tea for getting multiple collections, can be removed if easier way exists
export const getMultipleCollections = async (address) => {
  try{
    const params = {...defaults, ...{address}};

    const collections = await api.get(`collections`, {params});
    return collections.data.collections;
  }
  catch(error){
    throw error;
  }
}

export const getOwnerCollections = async (address, query) => {
  return getCollections({owner: address, ...query});
}

export const setOwner = async (query, collectionAddress, ownerAddress) => {
  try{
    const params = {...query};
    return await api.post(`setCollectionOwner`, {collectionAddress, ownerAddress}, {params});
  }
  catch(error){
    throw error;
  }
}

export const clearOwner = async (query, collectionAddress) => {
  try{
    const params = {...query};

    return await api.post(`clearCollectionOwner`, { collectionAddress }, {params});
  }
  catch(error){
    throw error;
  }
}