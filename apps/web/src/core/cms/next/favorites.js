import axios from "axios";

const api = axios.create({
  baseURL: '/api',
});

export const getNftFavorites = async (tokenAddress, tokenId) => {
  const response = await api.get(`nft/favorites`, {params:{tokenAddress, tokenId}});
  return response.data;
}

export const getUserFavorites = async (address) => {
  const response = await api.get(`users/${address}/favorites`);
  return response.data;
}

export const addFavorite = async (tokenAddress, tokenId, address, signature) => {
  const response = await api.post(`users/${address}/favorites`, {
    tokenAddress,
    tokenId,
    address,
    signature
  });
  return response.data;
}

export const removeFavorite = async (tokenAddress, tokenId, address, signature) => {
  const response = await api.delete(`users/${address}/favorites`, {
    params: {
      tokenAddress,
      tokenId,
      address,
      signature
    }
  })
  return response.data;
}