import axios from "axios";

const api = axios.create({
  baseURL: '/api',
});

export const getNotifications = async (address, query) => {
  try {
    const response = await api.get('notifications', {
      params: {
        walletAddress: address,
        ...query
      }
    })
    return response.data;
  } catch (e) {
    console.log('error', e);
  }
}

export const deleteNotifications = async (notificationId = null, address, signature) => {
  try {
    const response = await api.delete('notifications', {
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