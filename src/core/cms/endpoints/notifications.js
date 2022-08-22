import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const getNotifications = async (address) => {
  try {
    const response = await api.get('notification/all', {
      params: {
        walletAddress: address
      }
    })
    return response.data;
  } catch (e) {
    console.log('error', e);
  }
}

export const deleteNotifications = async (notificationId = null, address, signature) => {
  try {
    const response = await api.delete('notification', {
      params: {
        notificationId,
        address,
        signature
      }
    })
    return response.data;
  } catch (e) {
    console.log('error', e);
  }
}