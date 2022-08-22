import { useState } from 'react';
import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from './useCreateSigner';
import {updateNotifications} from "@src/core/cms/endpoints/profile";
import {deleteNotifications} from "@src/core/cms/endpoints/notifications";

const useDeleteNotifications = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const requestDeleteNotifications = async (address, notificationId) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const fetchResponse = await deleteNotifications(notificationId, address, signatureInStorage);
        
        setResponse({
          ...response,
          loading: false,
          error: null,
        });

        return fetchResponse.data;
      } catch (error) {
        setResponse({
          ...response,
          loading: false,
          error: error,
        });
      }
    } else {
      setResponse({
        isLoading: false,
        response: [],
        error: { message: 'Something went wrong' },
      });
    }
  };

  return [requestDeleteNotifications, response];
};

export default useDeleteNotifications;
