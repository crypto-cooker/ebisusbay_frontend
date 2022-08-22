import axios from "axios";

const api = axios.create({
  baseURL: '/api',
});

export const getCollections = async (query) => {
  try{
    return await api.get(`collections`, {params: query});
  }
  catch(error){
    throw error;
  }
}