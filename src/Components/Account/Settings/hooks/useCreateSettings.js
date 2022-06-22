import { useState } from 'react';
import { appConfig } from '../../../../Config';

const useCreateSettings = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const requestNewSettings = async (formData) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      const fetchResponse = await fetch(`${appConfig('urls.profileSettingsApi')}profile/create_profile`, {
        method: 'post',
        body: formData,
      });

      setResponse({
        ...response,
        loading: false,
        error: null,
      });

      return fetchResponse.json();
    } catch (error) {
      setResponse({
        ...response,
        loading: false,
        error: error,
      });
    }
  };

  return [requestNewSettings, response];
};

export default useCreateSettings;
