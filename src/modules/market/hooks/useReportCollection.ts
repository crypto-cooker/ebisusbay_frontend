import {useState} from 'react';
import {reportCollection} from "@src/core/cms/endpoints/collections";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

const useReportCollection = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const {requestSignature} = useEnforceSignature();

  const createNewReport = async (address: string, data: any) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      const signature = await requestSignature();
      const fetchResponse = await reportCollection(address, signature, data);

      setResponse({
        ...response,
        loading: false,
        error: null,
      });

      return fetchResponse;
    } catch (error: any) {
      setResponse({
        ...response,
        loading: false,
        error: error,
      });
    }
  };

  return [createNewReport, response];
};

export default useReportCollection;
