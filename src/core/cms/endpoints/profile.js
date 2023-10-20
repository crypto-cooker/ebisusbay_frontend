import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const getProfile = async (addressOrUsername) => {
  const response = await api.get('profile', {
    params: {
      walletAddress: addressOrUsername
    }
  })
  return response.data;
}

export const createProfile = async (formData, signature, address) => {
  const response = await api.post('profile', formData, {
    params: {
      signature,
      address
    }
  });

  return response.data;
}

export const updateProfile = async (data, signature, address) => {
  const response = await api.patch('profile', data, {
    params: {
      signature,
      address
    }
  });

  return response.data;
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

export const verifyEmail = async (signature, address) => {
  return await api.get('profile/email-verification', {
    params: {
      signature,
      address
    }
  })
}

export const updateNotifications = async (notificationMethods, notificationTypes, signature, address) => {
  await api.patch('profile/notifications', {notificationMethods, notificationTypes}, {
    params: {
      signature,
      address
    }
  });
}