import {useState} from 'react';
import {verifyEmail} from "@src/core/cms/endpoints/profile";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

const useResendEmailVerification = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const {requestSignature} = useEnforceSignature();

  const requestNewSettings = async (address) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      const signature = await requestSignature();
      await verifyEmail(signature, address);

      setResponse({
        ...response,
        loading: false,
        error: null,
      });

      return response;
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

export default useResendEmailVerification;
