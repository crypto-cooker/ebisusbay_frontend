import {useState} from 'react';
import {deleteNotifications} from "@src/core/cms/next/notifications";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

type ResponseProps = {
  loading: boolean;
  error?: any;
};

const useDeleteNotifications = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: undefined,
  });

  const {requestSignature} = useEnforceSignature();

  const requestDeleteNotifications = async (address: string, notificationId?: string | number) => {
    setResponse({
      ...response,
      loading: true,
      error: undefined,
    });

    try {
      const signature = await requestSignature();
      const fetchResponse = await deleteNotifications(notificationId ?? null, address, signature);

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
  };

  return [requestDeleteNotifications, response] as const;
};

export default useDeleteNotifications;
