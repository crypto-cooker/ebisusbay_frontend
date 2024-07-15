import {appConfig} from "@src/config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const createBundle = async (address, signature, body) => {
  try{
    return await api.post(`bundle`, body, {params: {address, signature}});
  }
  catch(error){
    throw error;
  }
}