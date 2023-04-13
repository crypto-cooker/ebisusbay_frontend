import { useState } from 'react';
import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from '../Components/Account/Settings/hooks/useCreateSigner';
import {deleteNotifications} from "@src/core/cms/next/notifications";
import {ContractReceipt} from "ethers";

type ResponseProps = {
  loading: boolean;
  error?: any;
};

const useDeleteNotifications = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: undefined,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const requestDeleteNotifications = async (address: string, notificationId?: string | number) => {
    setResponse({
      ...response,
      loading: true,
      error: undefined,
    });

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const fetchResponse = await deleteNotifications(notificationId ?? null, address, signatureInStorage);
        
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
        loading: false,
        error: { message: 'Something went wrong' },
      });
    }
  };

  return [requestDeleteNotifications, response] as const;
};

export default useDeleteNotifications;
