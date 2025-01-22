import { appConfig } from '@src/config';
import axios from 'axios';

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const getLayers = async (addressOrUsername) => {
  const response = await api.get('layerbooth/layers', {
    params: {
      walletAddress: addressOrUsername,
    },
  });
  return response.data;
};
