import {useContext, useEffect, useMemo, useState} from "react";
import {providers} from "ethers";
import UserContractService from "@src/core/contractService";
import {UserContext} from "@src/components-v2/shared/contexts/user";
import {useWalletClient, WalletClient} from "wagmi";
import {useWeb3Modal} from "@web3modal/wagmi/react";

export const useUser = () => {
  const context = useContext(UserContext);
  const { open: connect } = useWeb3Modal();

  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }

  const { user, disconnect, toggleTheme } = context;

  return {
    ...user,

    connect,
    disconnect,
    toggleTheme,

    // Legacy
    address: context.user.wallet.address,
    provider: useLegacyProviderFunctions(),
  };
}

const useLegacyProviderFunctions = () => {
  const signer = useEthersSigner();
  const getSigner = () => {
    return signer;
  }

  return {
    getSigner
  }
}

export const useContractService = () => {
  const user = useUser();
  const signer = useEthersSigner();
  const [contractService, setContractService] = useState<UserContractService | null>(null);

  useEffect(() => {
    async function initSigner() {
      if (!signer) {
        setContractService(null);
        return;
      }

      setContractService(new UserContractService(signer));
    }

    if (user.wallet.isConnected && signer) {
      initSigner();
    } else {
      setContractService(null);
    }
  }, [user.wallet.address, user.wallet.isConnected, signer]);

  return contractService;
}

/**
 * Ethers adapters to get signer from viem/wagmi
 * https://wagmi.sh/react/ethers-adapters
 */
function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  )
}