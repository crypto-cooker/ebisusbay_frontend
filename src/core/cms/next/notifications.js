import axios from "axios";

const api = axios.create({
  baseURL: '/api',
});

export const getNotifications = async (address, query) => {
  const response = await api.get(`users/${address}/notifications`, {
    params: {...query}
  })
  return response.data;
}

export const deleteNotifications = async (notificationId = null, address, signature) => {
  const response = await api.delete(`users/${address}/notifications/${notificationId}`, {
    params: {signature}
  })
  return response.data;
}