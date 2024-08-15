import axios from "axios";

const api = axios.create({
  baseURL: '/api',
});

export const search = async (query) => {
  try{
    return await api.get(`search`, {params: {query}});
  }
  catch(error){
    throw error;
  }
}