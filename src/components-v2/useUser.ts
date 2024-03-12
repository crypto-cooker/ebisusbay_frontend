import {useContext, useEffect, useMemo, useState} from "react";
import {providers} from "ethers";
import UserContractService from "@src/core/contractService";
import ContractService from "@src/core/contractService";
import {UserContext} from "@src/components-v2/shared/contexts/user";
import {Config, useConnectorClient} from "wagmi";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {useQueryClient} from "@tanstack/react-query";
import {Account, Chain, Client, Transport} from "viem";

export const useUser = () => {
  const context = useContext(UserContext);
  const { open: connect } = useWeb3Modal();
  const queryClient = useQueryClient();
  const legacyProvider = useLegacyProviderFunctions();

  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }

  const { user, theme, disconnect, toggleTheme, onEscrowClaimed, onEscrowToggled, onStakingHarvested } = context;

  const refreshProfile = () => {
    queryClient.refetchQueries({ queryKey: ['UserProfile', user.wallet.address], exact: true});
  }

  return {
    ...user,

    theme,
    connect,
    disconnect,
    toggleTheme,
    onEscrowClaimed,
    onEscrowToggled,
    onStakingHarvested,
    refreshProfile,

    // Legacy
    address: context.user.wallet.address,
    provider: legacyProvider
  };
}

const useLegacyProviderFunctions = () => {
  const signer = useEthersSigner();
  const getSigner = () => {
    return signer;
  }

  return {
    signer,
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

  return contractService ?? (signer ? new ContractService(signer) : null);
}

/**
 * Ethers adapters to get signer from viem/wagmi
 * https://wagmi.sh/react/ethers-adapters
 */
function walletClientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useConnectorClient<Config>({ chainId });
  return useMemo(
    () => (walletClient?.chain ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}