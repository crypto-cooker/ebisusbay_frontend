import { useContext, useEffect, useMemo, useState } from "react";
import { ethers, providers } from "ethers";
import UserContractService from "@src/core/contractService";
import ContractService from "@src/core/contractService";
import { UserContext } from "@src/components-v2/shared/contexts/user";
import { Config, useChainId, useConnectorClient } from "wagmi";
import { useAppKit } from '@reown/appkit/react'
import { useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { shortAddress } from "@market/helpers/utils";
import { Account, Address, Chain, Client, Transport } from "viem";
import { getTheme } from "@src/global/theme/theme";
import { useAppChainConfig } from "@src/config/hooks";

export const useUser = () => {
  const context = useContext(UserContext);
  const { open: connect } = useAppKit();
  const queryClient = useQueryClient();
  const legacyProvider = useLegacyProviderFunctions();

  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }

  const { user, theme, disconnect, toggleTheme, onEscrowClaimed, onEscrowToggled, onStakingHarvested } = context;

  const refreshProfile = () => {
    queryClient.refetchQueries({ queryKey: ['UserProfile', user.wallet.address], exact: true });
  }

  const requestTelemetry = () => {
    Sentry.captureEvent({
      message: 'requestTelemetry--hook', extra: {
        provider: legacyProvider,
        signer: legacyProvider?.signer
      }
    });
    context.requestTelemetry();
  }

  const displayName = () => {
    let username: string = shortAddress(context.user.wallet.address);
    if (user.profile?.username) {
      try {
        if (user.profile.username.startsWith('0x')) {
          username = shortAddress(ethers.utils.getAddress(user.profile.username));
        } else {
          username = user.profile.username;
        }
      } catch (e) {
        username = user.profile.username;
      }
    }

    return username;
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
    requestTelemetry,
    displayName,

    // Legacy
    address: context.user.wallet.address as Address | undefined,
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
  const chainId = useChainId();
  
  const signer = useEthersSigner();

  const [contractService, setContractService] = useState<UserContractService | null>(null);
  const {config} = useAppChainConfig(chainId);

  useEffect(() => { 
    async function initSigner() {
      if (!signer) {
        setContractService(null);
        return;
      }
      setContractService(new UserContractService(signer, config));
    }

    if (user.wallet.isConnected && signer) {
      initSigner();
    } else {
      setContractService(null);
    }


  }, [user.wallet.address, user.wallet.isConnected, signer, config]);

  return contractService ?? (signer ? new ContractService(signer, config) : null);
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
    [walletClient, chainId]
  );
}

export function useUserTheme() {
  const { theme, toggleTheme } = useUser();
  return useMemo(() => getTheme(theme), [theme]);
}