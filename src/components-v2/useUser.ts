import {useContext, useEffect, useState} from "react";
import {ethers} from "ethers";
import {useWeb3ModalProvider} from "@web3modal/ethers5/react";
import {getThemeInStorage} from "@src/helpers/storage";
import UserContractService from "@src/core/contractService";
import {UserContext} from "@src/components-v2/shared/contexts/user";

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
  const { walletProvider } = useWeb3ModalProvider();

  const getSigner = () => {
    console.log('getSigner?', walletProvider)
    if (!walletProvider) return;

    return new ethers.providers.Web3Provider(walletProvider)
  }

  return {
    getSigner
  }
}

export const useContractService = () => {
  const user = useUser(12);
  const { walletProvider } = useWeb3ModalProvider()
  const [contractService, setContractService] = useState<UserContractService | null>(null);

  useEffect(() => {
    async function initSigner() {
      if (!walletProvider) {
        setContractService(null);
        return;
      }

      const ethersProvider = new ethers.providers.Web3Provider(walletProvider)
      const signer = await ethersProvider.getSigner()
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
