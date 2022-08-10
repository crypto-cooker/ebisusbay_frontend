import {appConfig} from "/src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.api,
});

export const getCollections = async (query) => {
  try{
    const response = await api.get(`collectioninfo?pageSize=500`);
    return response;
  }
  catch(error){
    throw error;
  }
}