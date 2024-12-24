import {appConfig} from "@src/config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const getList = async () => {
  try{
    return await api.get(`lootbox/list`);
  }
  catch(error){
    throw error;
  }
}

export const getBoxInfo = async (id) => {
  try{
    return await api.get(`lootbox/info/${id}`);
  } catch (error) {
    throw error;
  }
}

export const getBalances = async (walletAddress) => {
  try {
    return await api.get(`lootbox/balance`,{
      params:{
        walletAddress
      }
    })
  } catch (error) {
    throw error;
  }
}

export const openBox = async (id) => {
  try {
    return await api.post(`lootbox/open/${id}`)
  } catch (error) {
    throw error;
  }
}