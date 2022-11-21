import {appConfig} from "@src/Config";
import {Axios} from "@src/core/http/axios";

const config = appConfig();
const api = Axios.create(config.urls.api);

export const search = async (query) => {
  try{
    return await api.get(`search`, {params: {query}});
  }
  catch(error){
    throw error;
  }
}