import {toast} from "react-toastify";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {useUser} from "@src/components-v2/useUser";
import {parseErrorMessage} from "@src/helpers/validator";
import { useActiveChainId } from "@dex/swap/imported/pancakeswap/web/hooks/useActiveChainId";
import {useAccount} from "wagmi";

const useAuthedFunctionWithChainID = (id?: number) => {
  const { open } = useWeb3Modal();
  const user = useUser();
  const { chainId: wagmiChainId } = useAccount();
  // const { chainId } = useActiveChainId()

  const runAuthedFunction = async (fn: Function, targetChainId?: number | number[]) => {
    if (targetChainId && !Array.isArray(targetChainId)) targetChainId = [targetChainId];
    const primaryTargetChains = [targetChainId ?? id];
    const isCorrectChain = primaryTargetChains.includes(wagmiChainId);

    if (user.wallet.isConnected && user.wallet.address && isCorrectChain) {
      try {
        await fn();
      } catch (error: any) {
        toast.error(parseErrorMessage(error));
      }
    } else if (!user.wallet.isConnected || !user.wallet.address) {
      await open();
    } else if (isCorrectChain) {
      await open({view: 'Networks'});
    }
  };

  return [runAuthedFunction];
};

export default useAuthedFunctionWithChainID;