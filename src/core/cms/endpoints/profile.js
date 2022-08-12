import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const getProfile = async (addressOrUsername) => {
  try {
    const response = await api.get('profile', {
      params: {
        walletAddress: addressOrUsername
      }
    })
    return response.data;
  } catch (e) {
    console.log('error', e);
  }
}

export const createProfile = async (formData, signature, nonce) => {
  try {
    const response = await api.post('profile', formData, {
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

export const updateProfile = async (data, signature, nonce) => {
  try {
    const response = await api.patch('profile', data, {
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

export const updateAvatar = async (formData, signature, nonce) => {
  await api.patch('profile/avatar', formData, {
    params: {
      signature,
      nonce
    }
  });
}

export const updateBanner = async (formData, signature, nonce) => {
  await api.patch('profile/banner', formData, {
    params: {
      signature,
      nonce
    }
  });
}