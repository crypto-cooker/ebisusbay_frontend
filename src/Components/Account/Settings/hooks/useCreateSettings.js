import { getAuthSignerInStorage } from '@src/helpers/storage';
import { useState } from 'react';
import axios from 'axios';

import useCreateSigner from './useCreateSigner';
import { appConfig } from "@src/Config";
import {createProfile, updateAvatar, updateBanner} from "@src/core/cms/endpoints/profile";

const useCreateSettings = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const requestNewSettings = async (address, data) => {
    const { userInfo, userBanner, userAvatar } = data.userInfo;

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
        const fetchResponse = await createProfile(userInfo, signatureInStorage, address);

        if (userAvatar?.profilePicture[0]?.file?.name) {
          const formData = new FormData();
          formData.append('profilePicture', userAvatar?.profilePicture[0].file);
          await updateAvatar(formData, signatureInStorage, address);
        }
        
        if (userBanner?.banner[0]?.file?.name) {
          const formData = new FormData();
          formData.append('banner', userBanner?.banner[0].file);
          await updateBanner(formData, signatureInStorage, address);
        }

        setResponse({
          ...response,
          loading: false,
          error: null,
        });

        return fetchResponse;
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

  return [requestNewSettings, response];
};

export default useCreateSettings;
