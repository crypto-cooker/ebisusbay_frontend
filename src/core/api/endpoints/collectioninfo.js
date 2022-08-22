import {appConfig} from "@src/Config";
import {Axios} from "@src/core/http/axios";

const config = appConfig();
const api = Axios.create(config.urls.api);
const defaults = {
  pageSize: 500
};

export const getCollections = async (query) => {
  try{
    const params = {...defaults, ...query};

    return await api.get(`collectioninfo`, {params});
  }
  catch(error){
    throw error;
  }
}

export const getOwnerCollections = async (address, query) => {
  return getCollections({owner: address, ...query});
}
