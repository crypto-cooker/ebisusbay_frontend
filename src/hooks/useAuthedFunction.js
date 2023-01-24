import {useDispatch, useSelector} from 'react-redux';
import {toast} from "react-toastify";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";

const useAuthedFunction = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const runAuthedFunction = async (fn) => {
    if (user.address) {
      try {
        await fn();
      } catch (error) {
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
