import {appConfig} from "@src/config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const getNotifications = async (address, query) => {
  const response = await api.get('notification/all', {
    params: {
      address,
      ...query
    }
  });
  return response.data?.data;
}

export const deleteNotifications = async (notificationId, address, signature) => {
  const response = await api.delete('notification', {
    params: {
      notificationId,
      address,
      signature
    }
  });
  return response.data?.data;
}