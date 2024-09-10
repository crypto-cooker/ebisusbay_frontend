import React, {ReactElement, useCallback, useState} from "react";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {ArrowBackIcon} from "@chakra-ui/icons";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/faq-page";
import StakePage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/stake-page";
import EditVaultPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/edit-vault-page";
import {FortuneStakingAccount} from "@src/core/services/api-service/graph/types";
import CreateVaultPage
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/create-vault-page";
import WithdrawVaultPage
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/withdraw-vault-page";
import TokenizeVaultPage
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/tokenize-vault-page";
import {DEFAULT_CHAIN_ID, SUPPORTED_CHAIN_CONFIGS, SupportedChainId} from "@src/config/chains";
import { BankStakeTokenContext } from "./context";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";

interface StakeFortuneProps {
  address: string;
  isOpen: boolean;
  onClose: () => void;
}

const StakeFortune = ({address, isOpen, onClose}: StakeFortuneProps) => {
  const [page, setPage] = useState<ReactElement | null>(null);
  const [title, setTitle] = useState<string>('Stake Fortune');
  const [currentChainId, setCurrentChainId] = useState<SupportedChainId>(SUPPORTED_CHAIN_CONFIGS[0].chain.id);
  const { chainId: activeChainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();

  const handleClose = async () => {
    if (activeChainId !== DEFAULT_CHAIN_ID) {
      await switchNetworkAsync(DEFAULT_CHAIN_ID);
    }

    returnHome();
    onClose();
  };

  const handleBack = () => {
    if (!!page) {
      returnHome();
    } else {
      setPage(<FaqPage />);
      setTitle('About Fortune Staking');
    }
  };

  const returnHome = () => {
    setPage(null);
    setTitle('Stake Fortune');
  };

  const handleEditVault = useCallback((vault: FortuneStakingAccount, type: string) => {
    setPage(<EditVaultPage vault={vault} type={type} onReturn={returnHome} />);
    setTitle('Update Stake');
  }, [returnHome]);

  const handleCreateVault = useCallback((vaultIndex: number) => {
    setPage(<CreateVaultPage vaultIndex={vaultIndex} onReturn={returnHome} />)
  }, [returnHome]);

  const handleWithdrawVault = useCallback((vault: FortuneStakingAccount) => {
    setPage(<WithdrawVaultPage vault={vault} onReturn={returnHome} />);
    setTitle('Emergency Withdraw');
  }, [returnHome]);

  const handleTokenizeVault = useCallback((vault: FortuneStakingAccount) => {
    setPage(<TokenizeVaultPage vault={vault} onReturn={returnHome} />);
    setTitle('Tokenize Vault');
  }, [returnHome]);

  const handleUpdateChainContext = useCallback((chainId: SupportedChainId) => {
    setCurrentChainId(chainId);
  }, []);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      <BankStakeTokenContext.Provider value={{chainId: currentChainId}}>
        {!!page ? (
          <>{page}</>
        ) : (
          <StakePage
            onEditVault={handleEditVault}
            onCreateVault={handleCreateVault}
            onWithdrawVault={handleWithdrawVault}
            onTokenizeVault={handleTokenizeVault}
            initialChainId={currentChainId}
            onUpdateChainContext={handleUpdateChainContext}
          />
        )}
      </BankStakeTokenContext.Provider>
    </RdModal>
  )
}

export default StakeFortune;