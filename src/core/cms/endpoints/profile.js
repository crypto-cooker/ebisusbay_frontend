import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();

export const getProfile = async (addressOrSlug) => {
  try {
    const response = await axios.get(`${config.urls.cms}profile`, {
      params: {
        walletAddress: addressOrSlug
      }
    })
    return response.data;
  } catch (e) {
    console.log('error', e);
  }
}

export const createProfile = async (formData, signature, nonce) => {
  try {
    formData.append('signature', signature);
    formData.append('nonce', nonce);

    const response = await axios.post(`${config.urls.cms}profile`, formData, {
      params: {
        signature,
        nonce
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
  }
}