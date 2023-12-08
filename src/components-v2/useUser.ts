import {useContext, useEffect, useMemo, useState} from "react";
import {providers} from "ethers";
import {useWeb3ModalProvider} from "@web3modal/ethers5/react";
import {getThemeInStorage} from "@src/helpers/storage";
import UserContractService from "@src/core/contractService";
import {UserContext} from "@src/components-v2/shared/contexts/user";
import {useWalletClient, WalletClient} from "wagmi";

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }

  const { user, disconnect } = context;

  return {
    ...user,

    disconnect,

    // Legacy
    address: context.user.wallet.address,
    provider: useLegacyProviderFunctions(),
    theme: getThemeInStorage() ?? 'dark'
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
  const { walletProvider } = useWeb3ModalProvider()
  const [contractService, setContractService] = useState<UserContractService | null>(null);

  useEffect(() => {
    async function initSigner() {
      const signer = user.provider.getSigner()
      if (!signer) {
        setContractService(null);
        return;
      }

      setContractService(new UserContractService(signer));
    }

    if (user.wallet.isConnected) {
      initSigner();
    } else {
      setContractService(null);
    }
  }, [user.wallet.address, user.wallet.isConnected, walletProvider]);

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