import axios from "axios";

const api = axios.create({
  baseURL: '/api',
});

export const getNotifications = async (address, query) => {
  const response = await api.get('notifications', {
    params: {
      address,
      ...query
    }
  })
  return response.data;
}

export const deleteNotifications = async (notificationId = null, address, signature) => {
  const response = await api.delete('notifications', {
    params: {
      notificationId,
      address,
      signature
    }
  })
  return response.data;
}