import {toast} from "react-toastify";
import { useAppKit } from '@reown/appkit/react'
import {useUser} from "@src/components-v2/useUser";
import {parseErrorMessage} from "@src/helpers/validator";

const useAuthedFunction = () => {
  const { open } = useAppKit();
  const user = useUser();

  const runAuthedFunction = async (fn: Function) => {
    if (user.wallet.isConnected && user.wallet.address && user.wallet.correctChain) {
      try {
        await fn();
      } catch (error: any) {
        toast.error(parseErrorMessage(error));
      }
    } else if (!user.wallet.isConnected || !user.wallet.address) {
      await open();
    } else if (!user.wallet.correctChain) {
      await open({view: 'Networks'});
    }
  };

  return [runAuthedFunction];
};

export default useAuthedFunction;
