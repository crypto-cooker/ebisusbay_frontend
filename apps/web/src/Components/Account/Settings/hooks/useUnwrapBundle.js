import {useState} from 'react';
import {Contract} from "ethers";
import {appConfig} from "@src/config";
import Bundle from "@src/global/contracts/Bundle.json";
import {useUser} from "@src/components-v2/useUser";

const useUnwrapBundle = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const config = appConfig();

  const user = useUser();

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
