import {toast} from "react-toastify";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {useUser} from "@src/components-v2/useUser";
import {parseErrorMessage} from "@src/helpers/validator";
import {useAccount} from "wagmi";
import {DEFAULT_CHAIN_ID} from "@src/config/chains";

const useAuthedFunctionWithChainID = (id?: number | number[]) => {
  const { open } = useWeb3Modal();
  const user = useUser();
  const { chainId: wagmiChainId } = useAccount();
  // const { chainId } = useActiveChainId()

  const runAuthedFunction = async (fn: Function, innerChainId?: number | number[]) => {
    let targetChainId = innerChainId ?? id;
    if (!targetChainId) targetChainId = DEFAULT_CHAIN_ID;

    if (targetChainId && !Array.isArray(targetChainId)) targetChainId = [targetChainId];
    const primaryTargetChains = targetChainId as number[];
    const isCorrectChain = primaryTargetChains.includes(wagmiChainId ?? DEFAULT_CHAIN_ID);

    if (user.wallet.isConnected && user.wallet.address && isCorrectChain) {
      try {
        await fn();
      } catch (error: any) {
        toast.error(parseErrorMessage(error));
      }
    } else if (!user.wallet.isConnected || !user.wallet.address) {
      await open();
    } else if (!isCorrectChain) {
      await open({view: 'Networks'});
    }
  };

  return [runAuthedFunction];
};

export default useAuthedFunctionWithChainID;