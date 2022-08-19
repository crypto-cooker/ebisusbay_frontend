import { useCallback, useState } from 'react';
import {appConfig} from "/src/Config";

import axios from "axios";


const config = appConfig();

const api = axios.create({

  baseURL: config.urls.api,

});

export const useGetCollection = () => {
  const [response, setResponse] = useState({
    isLoading: true,
    response: null,
  });

  const getCollections = useCallback(async (address) => {
    setResponse({
      ...response,
      isLoading: true,
    });

    try {
      const payload = await api.get(`collectioninfo?owner=${address}`);;

      setResponse({
        isLoading: false,
        response: payload.data,
      });
    } catch (e) {
      setResponse({
        isLoading: false,
        response: null,
        error: e,
      });

    }},
    [setResponse, response]
  );

  return [response, getCollections];
};

export default useGetCollection;