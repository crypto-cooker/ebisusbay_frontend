import {Box} from "@chakra-ui/react";
import React, {useContext, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {FortuneStakingAccount} from "@src/core/services/api-service/graph/types";
import {VaultType} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import EditTokenVault
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/edit-vault-page/edit-token-vault";
import EditLpVault
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/edit-vault-page/edit-lp-vault";
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";


const steps = {
  form: 'form',
  complete: 'complete'
};

interface EditVaultPageProps {
  vault: FortuneStakingAccount;
  vaultType: VaultType;
  targetField: string;
  onReturn: () => void;
}

const EditVaultPage = ({vault, vaultType, targetField, onReturn}: EditVaultPageProps) => {
  const { refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [currentStep, setCurrentStep] = useState(steps.form);
  const [fortuneToStake, setFortuneToStake] = useState(0);
  const [daysToStake, setDaysToStake] = useState(0);

  const handleEditSuccess = (amount: number, days: number) => {
    setFortuneToStake(amount);
    setDaysToStake(days);
    setCurrentStep(steps.complete);
    refreshUser();
  }

  return (
    <Box mx={1} pb={6}>
      {currentStep === steps.complete ? (
        <StakeComplete
          amount={targetField === 'amount' ? fortuneToStake : 0}
          duration={targetField === 'duration' ? daysToStake : 0}
          onReturn={onReturn}
          vaultType={vaultType}
        />
      ) : (
        <>
          {vaultType === VaultType.TOKEN ? (
            <EditTokenVault
              vault={vault}
              type={targetField}
              onSuccess={handleEditSuccess}
            />
          ) : (vaultType === VaultType.LP) && (
            <EditLpVault
              vault={vault}
              type={targetField}
              onSuccess={handleEditSuccess}
            />
          )}
        </>
      )}
    </Box>
  )
}

interface StakeCompleteProps {
  amount?: number;
  duration?: number;
  onReturn: () => void;
  vaultType: VaultType;
}

const StakeComplete = ({amount, duration, onReturn, vaultType}: StakeCompleteProps) => {
  return (
    <Box py={4}>
      {!!amount && amount > 0 && (
        <Box textAlign='center' mt={2}>
          An extra {amount} {vaultType === VaultType.LP ? 'LP' : 'FRTN'} has now been staked to this vault!
        </Box>
      )}
      {!!duration && duration > 0 && (
        <Box textAlign='center' mt={2}>
          An extra {duration} days has now been added to this vault!
        </Box>
      )}
      <Box textAlign='center' mt={8} mx={2}>
        <Box ps='20px'>
          <RdButton
            fontSize={{base: 'xl', sm: '2xl'}}
            stickyIcon={true}
            onClick={onReturn}
          >
            Back To Vaults
          </RdButton>
        </Box>
      </Box>
    </Box>
  )
}

export default EditVaultPage;