import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const getNotifications = async (walletAddress) => {
  try {
    const response = await api.get('notification/all', {
      params: {
        walletAddress
      }
    })
    return response.data;
  } catch (e) {
    console.log('error', e);
  }
}

export const deleteNotification = async (walletAddress, notificationId) => {
  try {
    const response = await api.delete('notification', {
      params: {
        walletAddress,
        notificationId
      }
    })
    return response.data;
  } catch (e) {
    console.log('error', e);
  }
}