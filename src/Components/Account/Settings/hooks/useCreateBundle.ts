import {useState} from 'react';
import {Contract} from "ethers";
import useCreateSigner from './useCreateSigner';
import {appConfig} from "@src/Config";
import Bundle from "@src/Contracts/Bundle.json";
import {useAppSelector} from "@src/Store/hooks";

type ResponseProps = {
  loading: boolean;
  error?: any;
};

const useCreateBundle = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: null,
  });

  const config = appConfig();

  const [isLoading, getSigner] = useCreateSigner();

  const user = useAppSelector((state) => state.user);

  const createBundle = async (tokens: string[], ids: string[], title: string, description: string, createListing = false) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });
    try {
      const bundleContract = new Contract(config.contracts.bundle, Bundle.abi, user.provider.getSigner());
      const newBundle = await bundleContract.wrap(tokens, ids, title, description)
      await newBundle.wait();

      setResponse({
        ...response,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      console.log(error)
      setResponse({
        ...response,
        loading: false,
        error: error,
      });
      throw error;
    }
  };

  return [createBundle, response] as const;
};

export default useCreateBundle;
