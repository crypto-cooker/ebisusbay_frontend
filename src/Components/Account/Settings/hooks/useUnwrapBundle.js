import {useState} from 'react';
import {Contract} from "ethers";
import useCreateSigner from './useCreateSigner';
import {useSelector} from "react-redux";
import {appConfig} from "@src/Config";
import Bundle from "@src/Contracts/Bundle.json";

const useUnwrapBundle = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const config = appConfig();

  const [isLoading, getSigner] = useCreateSigner();

  const user = useSelector((state) => state.user);

  const unwrapBundle = async (bundleId) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });
    try {
      const bundleContract = new Contract(config.contracts.bundle, Bundle.abi, user.provider.getSigner());
      const newBundle = await bundleContract.unwrap(bundleId)
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

  return [unwrapBundle, response];
};

export default useUnwrapBundle;
