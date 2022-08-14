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

export const createProfile = async (formData, signature, address) => {
  try {
    const response = await api.post('profile', formData, {
      params: {
        signature,
        address
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
  }
}

export const updateProfile = async (data, signature, address) => {
  try {
    const response = await api.patch('profile', data, {
      params: {
        signature,
        address
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
  }
}

export const updateAvatar = async (formData, signature, address) => {
  await api.patch('profile/avatar', formData, {
    params: {
      signature,
      address
    }
  });
}

export const updateBanner = async (formData, signature, address) => {
  await api.patch('profile/banner', formData, {
    params: {
      signature,
      address
    }
  });
}