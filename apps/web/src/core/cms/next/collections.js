import axios from "axios";

const api = axios.create({
  baseURL: '/api',
});

export const getOwnerCollections = async (owner) => {
  try{
    const params = {owner};

    return await api.get(`getOwnerCollections`, {params});
  }
  catch(error){
    throw error;
  }
}

export const updateCollection = async (query, body) => {
  try{
    const params = {...query};
    return await api.put(`updateCollections`, body , {params});
  }
  catch(error){
    throw error;
  }
}

export const updateAvatar = async (query, body) => {
  try{
    console.log('Si llego')
    const params = {...query};
    return await api.patch(`edit-collection/avatar`, body , {params});
  }
  catch(error){
    throw error;
  }
}

export const updateBanner = async (query, body) => {
  try{
    const params = {...query};
    return await api.patch(`edit-collection/banner`, body , {params});
  }
  catch(error){
    throw error;
  }
}

export const updateCard = async (query, body) => {
  try{
    const params = {...query};
    return await api.patch(`edit-collection/card`, body , {params});
  }
  catch(error){
    throw error;
  }
}

