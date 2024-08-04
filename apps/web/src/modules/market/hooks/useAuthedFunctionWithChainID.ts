import {toast} from "react-toastify";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {useUser} from "@src/components-v2/useUser";
import {parseErrorMessage} from "@src/helpers/validator";
import { useActiveChainId } from "@dex/swap/imported/pancakeswap/web/hooks/useActiveChainId";

const useAuthedFunctionWithChainID = (id : number) => {
  const { open } = useWeb3Modal();
  const user = useUser();
  const { chainId } = useActiveChainId()

  const runAuthedFunction = async (fn: Function) => {
    console.log(user);
    if (user.wallet.isConnected && user.wallet.address && chainId === id) {
      try {
        await fn();
      } catch (error: any) {
        toast.error(parseErrorMessage(error));
      }
    } else if (!user.wallet.isConnected || !user.wallet.address) {
      await open();
    } else if (chainId !== id) {
      await open({view: 'Networks'});
    }
  };

  return [runAuthedFunction];
};

export default useAuthedFunctionWithChainID;