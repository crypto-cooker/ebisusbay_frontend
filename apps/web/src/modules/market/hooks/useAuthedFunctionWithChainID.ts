import {toast} from "react-toastify";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {useUser} from "@src/components-v2/useUser";
import {parseErrorMessage} from "@src/helpers/validator";
import { useActiveChainId } from "@dex/swap/imported/pancakeswap/web/hooks/useActiveChainId";

const useAuthedFunctionWithChainID = (id?: number) => {
  const { open } = useWeb3Modal();
  const user = useUser();
  const { chainId } = useActiveChainId()

  const runAuthedFunction = async (fn: Function, targetChainId?: number) => {
    const primaryTargetChain = targetChainId ?? id;
    if (user.wallet.isConnected && user.wallet.address && chainId === primaryTargetChain) {
      try {
        await fn();
      } catch (error: any) {
        toast.error(parseErrorMessage(error));
      }
    } else if (!user.wallet.isConnected || !user.wallet.address) {
      await open();
    } else if (chainId !== primaryTargetChain) {
      await open({view: 'Networks'});
    }
  };

  return [runAuthedFunction];
};

export default useAuthedFunctionWithChainID;