import {Box, Stack, Text} from "@chakra-ui/react";
import RdButton from "../../../../../components/rd-button";
import React, {useContext, useEffect, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps,
  Vault,
  VaultType
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {
  ImportVaultComplete,
  ImportVaultForm
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/create-vault-page/import-vault";
import CreateTokenVault
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/create-vault-page/create-token-vault";
import CreateLpVault
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/create-vault-page/create-lp-vault";
import { FortuneStakingAccount } from "@src/core/services/api-service/graph/types";

const steps = {
  choice: 'choice',
  createVaultForm: 'createVaultForm',
  importVaultForm: 'importVaultForm',
  createVaultComplete: 'createVaultComplete',
  importVaultComplete: 'importVaultComplete'
};


interface CreateVaultPageProps {
  vaultIndex: number;
  vaults: FortuneStakingAccount[];
  onReturn: () => void;
}

const CreateVaultPage = ({vaultIndex, vaults, onReturn}: CreateVaultPageProps) => {
  const { config: rdConfig, refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: selectedChainId, vaultType } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chainId: activeChainId} = useActiveChainId();

  const [currentStep, setCurrentStep] = useState(steps.choice);

  const [fortuneToStake, setFortuneToStake] = useState(1250);
  const [daysToStake, setDaysToStake] = useState(rdConfig.bank.staking.fortune.termLength)

  const needsNetworkChange = activeChainId !== selectedChainId;

  const handleCreateVaultSuccess = (amount: number, days: number) => {
    setFortuneToStake(amount);
    setDaysToStake(days);
    setCurrentStep(steps.createVaultComplete);
    refreshUser();
  }

  // Syncs wallet network to target network
  const handleSyncNetwork = async () => {
    if (needsNetworkChange) {
      await switchNetworkAsync(selectedChainId);
    }
  }

  // Send them back if they changed networks past the choice step
  useEffect(() => {
    const guardedSteps = [steps.createVaultForm, steps.importVaultForm]
    if (guardedSteps.includes(currentStep) && needsNetworkChange) {
      setCurrentStep(steps.choice);
    }
  }, [needsNetworkChange]);

  return (
    <Box mx={1} pb={6}>
      {currentStep === steps.choice ? (
        <Box>
          <Text px={2} textAlign='center' fontSize={14} py={2}>Earn staking benefits by opening a staking vault. Earn APR, Mitama, and Troops for battle. Stake more to earn more.</Text>
          <Text px={2} textAlign='center' fontSize={14} py={2}>Click <strong>Create Vault</strong> for new vaults. If you have a Vault NFT, click <strong>Import Vault</strong></Text>
          <Box textAlign='center' mt={8} mx={2}>
            <Stack direction={{base: 'column', sm: 'row'}} justify='space-around'>
              {needsNetworkChange ? (
                <RdButton size={{base: 'md', md: 'lg'}} onClick={handleSyncNetwork}>
                  Switch Network
                </RdButton>
              ) : (
                <>
                  <RdButton
                    size={{base: 'md', md: 'lg'}}
                    w={{base: 'full', sm: 'auto'}}
                    onClick={() => setCurrentStep(steps.importVaultForm)}
                  >
                    Import Vault
                  </RdButton>
                  <RdButton
                    size={{base: 'md', md: 'lg'}}
                    w={{base: 'full', sm: 'auto'}}
                    onClick={() => setCurrentStep(steps.createVaultForm)}
                  >
                    Create Vault
                  </RdButton>
                </>
              )}
            </Stack>
          </Box>
        </Box>
      ) : currentStep === steps.createVaultForm ? (
        <>
          {vaultType === VaultType.LP ? (
            <CreateLpVault vaultIndex={vaultIndex} vaults={vaults} onSuccess={handleCreateVaultSuccess} />
          ) : (
            <CreateTokenVault vaultIndex={vaultIndex} onSuccess={handleCreateVaultSuccess} />
          )}
        </>
      ) : currentStep === steps.importVaultForm ? (
        <ImportVaultForm onComplete={() => setCurrentStep(steps.importVaultComplete)} />
      ) : currentStep === steps.importVaultComplete ? (
        <ImportVaultComplete onReturn={onReturn} />
      ) : currentStep === steps.createVaultComplete && (
        <StakeComplete
          amount={fortuneToStake}
          duration={daysToStake}
          onReturn={onReturn}
          vaultType={vaultType}
        />
      )}
    </Box>
  )
}

interface StakeCompleteProps {
  amount: number;
  duration: number;
  onReturn: () => void;
  vaultType: VaultType;
}

const StakeComplete = ({amount, duration, onReturn, vaultType}: StakeCompleteProps) => {
  return (
    <Box py={4}>
      <Box textAlign='center' mt={2}>
        {amount} {vaultType === VaultType.LP ? 'LP' : 'FRTN'} has now been staked for {duration} days!
      </Box>
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

export default CreateVaultPage;