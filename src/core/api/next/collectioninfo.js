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

export const getOwnerCollections = async (address, query) => {
  return getCollections({owner: address, ...query});
}