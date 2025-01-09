import React, { ReactElement, useCallback, useState } from 'react';
import { RdModal } from '@src/components-v2/feature/ryoshi-dynasties/components';
import { ArrowBackIcon } from '@chakra-ui/icons';
import FaqPage from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/faq-page';
import StakePage from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/stake-page';
import EditVaultPage from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/edit-vault-page';
import { FortuneStakingAccount } from '@src/core/services/api-service/graph/types';
import CreateVaultPage
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/create-vault-page';
import WithdrawVaultPage
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/withdraw-vault-page';
import TokenizeVaultPage
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/tokenize-vault-page';
import { SUPPORTED_CHAIN_CONFIGS, SupportedChainId } from '@src/config/chains';
import { BankStakeTokenContext, VaultType } from './context';
import BoostVaultPage from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/boost-vault-page';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@src/core/services/api-service';
import { useUser } from '@src/components-v2/useUser';
import { queryKeys } from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/constants';
import ConvertVaultPage
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/convert-vault-page';

interface StakeFortuneProps {
  address: string;
  isOpen: boolean;
  onClose: () => void;
}

const BOOSTS_ENABLED = false;

const StakeFortune = ({address, isOpen, onClose}: StakeFortuneProps) => {
  const [page, setPage] = useState<ReactElement | null>(null);
  const [title, setTitle] = useState<string>('Stake Tokens');
  const [currentChainId, setCurrentChainId] = useState<SupportedChainId>(SUPPORTED_CHAIN_CONFIGS[0].chain.id);
  const [currentVaultType, setCurrentVaultType] = useState<VaultType>(VaultType.TOKEN);
  const user = useUser();

  const { data: userVaultBoosts } = useQuery({
    queryKey: queryKeys.bankUserVaultBoosts(user.address),
    queryFn: async () => ApiService.withoutKey().ryoshiDynasties.getVaultBoosts(user.address!),
    refetchOnWindowFocus: false,
    enabled: !!user.address && BOOSTS_ENABLED,
  });

  const handleClose = async () => {
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
    setTitle('Stake Tokens');
  };

  const handleEditVault = useCallback((vault: FortuneStakingAccount, vaultType: VaultType, targetField: string) => {
    setPage(<EditVaultPage vault={vault} vaultType={vaultType} targetField={targetField} onReturn={returnHome} />);
    setTitle('Update Stake');
  }, [returnHome]);

  const handleCreateVault = useCallback((vaultIndex: number, vaults: FortuneStakingAccount[], vaultType: VaultType) => {
    handleUpdateVaultContext(vaultType);
    setPage(<CreateVaultPage vaultIndex={vaultIndex} vaults={vaults} onReturn={returnHome} />)
    setTitle(`Stake ${vaultType === VaultType.TOKEN ? 'Tokens' : 'LP'}`);
  }, [returnHome, currentVaultType]);

  const handleWithdrawVault = useCallback((vault: FortuneStakingAccount) => {
    setPage(<WithdrawVaultPage vault={vault} onReturn={returnHome} />);
    setTitle('Emergency Withdraw');
  }, [returnHome]);

  const handleTokenizeVault = useCallback((vault: FortuneStakingAccount) => {
    setPage(<TokenizeVaultPage vault={vault} onReturn={returnHome} />);
    setTitle('Tokenize Vault');
  }, [returnHome]);

  const handleBoostVault = useCallback((vault: FortuneStakingAccount) => {
    setPage(<BoostVaultPage vault={vault} onReturn={returnHome} />);
    setTitle('Boost Vault');
  }, [returnHome]);

  const handleConvertVault = useCallback((vault: FortuneStakingAccount) => {
    setPage(<ConvertVaultPage vault={vault} onReturn={returnHome} />);
    setTitle('Convert Vault');
  }, [returnHome]);

  const handleUpdateChainContext = useCallback((chainId: SupportedChainId) => {
    setCurrentChainId(chainId);
  }, []);

  const handleUpdateVaultContext = useCallback((vaultType: VaultType) => {
    setCurrentVaultType(vaultType);
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
      <BankStakeTokenContext.Provider value={{
        chainId: currentChainId,
        vaultType: currentVaultType,
        userVaultBoosts
      }}>
        {!!page ? (
          <>{page}</>
        ) : (
          <StakePage
            onEditVault={handleEditVault}
            onCreateVault={handleCreateVault}
            onWithdrawVault={handleWithdrawVault}
            onTokenizeVault={handleTokenizeVault}
            onBoostVault={handleBoostVault}
            onConvertVault={handleConvertVault}
            initialChainId={currentChainId}
            onUpdateChainContext={handleUpdateChainContext}
            onUpdateVaultContext={handleUpdateVaultContext}
          />
        )}
      </BankStakeTokenContext.Provider>
    </RdModal>
  )
}

export default StakeFortune;