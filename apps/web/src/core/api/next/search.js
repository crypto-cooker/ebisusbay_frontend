import axios from "axios";

const api = axios.create({
  baseURL: '/api',
});

export const search = async (query) => {
  try{
    const response = await api.get(`search`, {params: {query}});
    return response.data.collections.sort((a, b) => b.verification?.verified - a.verification?.verified);
  }
  catch(error){
    throw error;
  }
}