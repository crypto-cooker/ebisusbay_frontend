import {appConfig} from "@src/config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const getNftFavorites = async (tokenAddress, tokenId) => {
  const response = await api.get('nft/favorites', {params:{tokenAddress, tokenId}});
  return response.data?.data;
}

export const getUserFavorites = async (address) => {
  const response = await api.get('profile/favorites', {params:{address}});
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