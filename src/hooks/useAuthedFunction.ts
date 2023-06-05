import {useDispatch, useSelector} from 'react-redux';
import {toast} from "react-toastify";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useAppSelector} from "@src/Store/hooks";

const useAuthedFunction = () => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);

  const runAuthedFunction = async (fn: Function) => {
    if (user.address) {
      try {
        await fn();
      } catch (error: any) {
        if (error.data) {
          toast.error(error.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          console.log(error);
          toast.error('Unknown Error');
        }
      }
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  };

  return [runAuthedFunction];
};

export default useAuthedFunction;
