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

interface StakeFortuneProps {
  address: string;
  isOpen: boolean;
  onClose: () => void;
}

const StakeFortune = ({address, isOpen, onClose}: StakeFortuneProps) => {
  const [page, setPage] = useState<ReactElement | null>(null);
  const [title, setTitle] = useState<string>('Stake Fortune');

  const handleClose = useCallback(() => {
    setPage(null);
    setTitle('Stake Fortune');
    onClose();
  }, []);

  const handleBack = useCallback(() => {
    setPage(!!page ? null : <FaqPage />);
    setTitle('Stake Fortune');
  }, [page]);

  const handleEditVault = useCallback((vault: FortuneStakingAccount, type: string) => {
    setPage(<EditVaultPage vault={vault} type={type} onReturn={handleBack} />);
    setTitle('Update Stake');
    }, []);

  const handleCreateVault = useCallback((vaultIndex: number) => {
    setPage(<CreateVaultPage vaultIndex={vaultIndex} onReturn={handleBack} />)
  }, []);

  const handleWithdrawVault = useCallback((vault: FortuneStakingAccount) => {
    setPage(<WithdrawVaultPage vault={vault} onReturn={handleBack} />);
    setTitle('Emergency Withdraw');
  }, [handleBack]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {!!page ? (
        <>{page}</>
      ) : (
        <StakePage
          onEditVault={handleEditVault}
          onCreateVault={handleCreateVault}
          onWithdrawVault={handleWithdrawVault}
        />
      )}
    </RdModal>
  )
}

export default StakeFortune;