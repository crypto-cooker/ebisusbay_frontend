import axios from "axios";

const api = axios.create({
  baseURL: '/api',
});

export const getNotifications = async (address, signature, query) => {
  const response = await api.get('notifications', {
    params: {
      address,
      signature,
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