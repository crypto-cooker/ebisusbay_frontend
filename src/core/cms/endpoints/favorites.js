import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const getFavorites = async (address, type =  'nft') => {
  const endpoint = type === 'nft' ? 'nft/favorite' : 'collection/watchList';
  const response = await api.get(endpoint, {params:{address}});
  return response.data?.data;
}

export const addFavorite = async (tokenAddress, tokenId, address, signature) => {
  const endpoint = !!tokenId ? 'nft/favorite' : 'collection/watchList';
  const response = await api.post(endpoint, {
    tokenAddress,
    tokenId
  }, {params:{address, signature}});
  return response.data?.data;
}

export const deleteFavorite = async (tokenAddress, tokenId, address, signature) => {
  const endpoint = !!tokenId ? 'nft/favorite' : 'collection/watchList';
  const response = await api.delete(endpoint, {
    params: {
      tokenAddress,
      tokenId,
      address,
      signature
    }
  });
  return response.data?.data;
}