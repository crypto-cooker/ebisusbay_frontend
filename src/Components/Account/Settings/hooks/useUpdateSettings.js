import { useState } from 'react';
import axios from 'axios';

import { appConfig } from '../../../../Config';
import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from './useCreateSigner';
import {updateAvatar, updateBanner, updateProfile} from "@src/core/cms/endpoints/profile";

const useUpdateSettings = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const requestUpdateSettings = async (data) => {
    const { userInfo, userBanner, userAvatar } = data.userInfo;

    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    const nonce = 'ProfileSettings';
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const fetchResponse = await updateProfile(userInfo, signatureInStorage, nonce);

        if (userAvatar?.profilePicture[0]?.file?.name) {
          const formData = new FormData();
          formData.append('profilePicture', userAvatar?.profilePicture[0].file);
          await updateAvatar(formData, signatureInStorage, nonce);
        }
        
        if (userBanner?.banner[0]?.file?.name) {
          const formData = new FormData();
          formData.append('banner', userBanner?.banner[0].file);
          await updateBanner(formData, signatureInStorage, nonce);
        }
        
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

  return [requestUpdateSettings, response];
};

export default useUpdateSettings;
