import React, { useContext, useState } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';
import { FortuneStakingAccount } from '@src/core/services/api-service/graph/types';
import RdButton from '../../../../../components/rd-button';
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps,
  VaultType
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { useSwitchNetwork } from '@eb-pancakeswap-web/hooks/useSwitchNetwork';
import ConvertNewLpVault
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/convert-vault-page/convert-new-lp-vault';
import ConvertExistingLpVault
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/convert-vault-page/convert-existing-lp-vault';

const steps = {
  choice: 'choice',
  createLp: 'createLp',
  addToLp: 'addToLp',
  complete: 'complete'
};

interface ConvertVaultPageProps {
  vault: FortuneStakingAccount;
  onReturn: () => void;
}

const ConvertVaultPage = ({ vault, onReturn }: ConvertVaultPageProps) => {
  const { chainId: selectedChainId, vaultType } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { chainId: activeChainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();

  const [currentStep, setCurrentStep] = useState(steps.choice);

  const needsNetworkChange = activeChainId !== selectedChainId;

  // Syncs wallet network to target network
  const handleSyncNetwork = async () => {
    if (needsNetworkChange) {
      await switchNetworkAsync(selectedChainId);
    }
  }

  return (
    <Box mx={1} pb={6}>
      {currentStep === steps.choice ? (
        <Box>
          <Text px={2} textAlign='center' fontSize={14} py={2}>By converting FRTN vaults to LP vaults, cool stuff may happen.</Text>
          <Text px={2} textAlign='center' fontSize={14} py={2}>Click <strong>New LP Vault</strong> to convert to a fresh LP Vault. Click <strong>Existing LP Vault</strong> to add to an existing LP vault</Text>
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
                    onClick={() => setCurrentStep(steps.createLp)}
                  >
                    New LP Vault
                  </RdButton>
                  <RdButton
                    size={{base: 'md', md: 'lg'}}
                    w={{base: 'full', sm: 'auto'}}
                    onClick={() => setCurrentStep(steps.addToLp)}
                  >
                    Existing LP Vault
                  </RdButton>
                </>
              )}
            </Stack>
          </Box>
        </Box>
      ) : currentStep === steps.createLp ? (
        <ConvertNewLpVault
          vault={vault}
          onComplete={() => setCurrentStep(steps.createLp)}
        />
      ) : currentStep === steps.addToLp ? (
        <ConvertExistingLpVault
          vault={vault}
          onComplete={() => setCurrentStep(steps.addToLp)}
        />
      ) : currentStep === steps.complete && (
        <StakeComplete
          amount={0}
          duration={0}
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

export default ConvertVaultPage;