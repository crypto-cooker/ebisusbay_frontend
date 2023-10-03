import {useState} from 'react';
import {updateAvatar} from "@src/core/cms/endpoints/profile";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

const useUpdatePfp = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const {requestSignature} = useEnforceSignature();

  const requestUpdatePfp = async (formData, address) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      const signature = await requestSignature();
      const fetchResponse = await updateAvatar(formData, signature, address);

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

  return [requestUpdatePfp, response];
};

export default useUpdatePfp;
