import {
  Accordion,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  VStack
} from "@chakra-ui/react";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import { useCallback, useEffect, useState } from "react";

//contracts
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import { Vault, VaultType } from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import VaultSummary from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/vault-summary";
import { useUser } from "@src/components-v2/useUser";
import { SUPPORTED_RD_CHAIN_CONFIGS, SupportedChainId } from "@src/config/chains";
import { ApiService } from "@src/core/services/api-service";
import { FortuneStakingAccount } from "@src/core/services/api-service/graph/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/constants';

interface StakePageProps {
  onEditVault: (vault: FortuneStakingAccount, vaultType: VaultType, targetField: string) => void;
  onCreateVault: (vaultIndex: number, vaults: FortuneStakingAccount[], vaultType: VaultType) => void;
  onWithdrawVault: (vault: FortuneStakingAccount) => void;
  onTokenizeVault: (vault: FortuneStakingAccount) => void;
  onBoostVault: (vault: FortuneStakingAccount) => void;
  onConvertVault: (vault: FortuneStakingAccount) => void;
  initialChainId: SupportedChainId;
  onUpdateChainContext: (chainId: SupportedChainId) => void;
  onUpdateVaultContext: (vaultType: VaultType) => void;
}

const StakePage = ({onEditVault, onCreateVault, onWithdrawVault, onTokenizeVault, onBoostVault, onConvertVault, initialChainId, onUpdateChainContext, onUpdateVaultContext}: StakePageProps) => {
  const user = useUser();
  const [currentTab, setCurrentTab] = useState<SupportedChainId>(initialChainId);
  const [currentVaultType, setCurrentVaultType] = useState<VaultType>(VaultType.TOKEN);

  const { data: account, status, error, refetch } = useQuery({
    queryKey: queryKeys.bankUserAccount(user.address, currentTab, currentVaultType),
    queryFn: () => ApiService.forChain(currentTab).ryoshiDynasties.getBankStakingAccount(user.address!),
    enabled: !!user.address && !!currentTab,
  });

  const [vaultGroup, setVaultGroup] = useState(account?.vaults);

  const handleConnect = async () => {
    user.connect();
  }

  const handleTabChange = useCallback((chainId: SupportedChainId) => {
    setCurrentTab(chainId);
    handleVaultTypeChange(VaultType.TOKEN);
    onUpdateChainContext(chainId);
  }, []);

  const handleVaultTypeChange = useCallback((vaultType: VaultType) => {
    setVaultGroup(vaultType === VaultType.LP ? account?.lpVaults : account?.vaults);
    setCurrentVaultType(vaultType);
    onUpdateVaultContext(vaultType)
  }, [account]);

  const handleCreateVault = useCallback((vaultIndex: number, vaults: FortuneStakingAccount[], vaultType: VaultType) => {
    onCreateVault(vaultIndex, vaults, vaultType);
  }, []);

  // Set initial vaultGroup state if account query initially returns undefined
  useEffect(() => {
    if (!vaultGroup && !!account) {
      setVaultGroup(account.vaults)
    }
  }, [account]);

  return (
    <>
      <Box mx={1} pb={6}>
        {!!user.address ? (
          <>
            <Text align='center' pt={2} py={2} fontSize='sm'>Stake Fortune and Fortune LPs to earn $FRTN and receive troops for battle. Stake more to receive more troops and higher APRs.</Text>
            <Flex direction='row' justify='center' mb={2}>
              <SimpleGrid columns={2}>
                {SUPPORTED_RD_CHAIN_CONFIGS.map(({name, chain}) => (
                  <RdTabButton key={chain.id} isActive={currentTab === chain.id} onClick={() => handleTabChange(chain.id)}>
                    {name}
                  </RdTabButton>
                ))}
              </SimpleGrid>
            </Flex>
            <Box mt={4}>
              {status === 'pending' ? (
                <Center>
                  <Spinner size='lg' />
                </Center>
              ) : status === 'error' ? (
                <Center>
                  <Text>{(error as any).message}</Text>
                </Center>
              ) : (
                <>
                  <HStack justify='end' align='center' fontSize='sm'>
                    <Box>Vault Type</Box>
                    <ButtonGroup isAttached variant='outline' size='sm'>
                      <Button
                        aria-label='Fortune Token Vaults'
                        isActive={currentVaultType === VaultType.TOKEN}
                        onClick={() => handleVaultTypeChange(VaultType.TOKEN)}
                      >
                        Token
                      </Button>
                      <Button
                        aria-label='Fortune LP Vaults'
                        isActive={currentVaultType === VaultType.LP}
                        onClick={() => handleVaultTypeChange(VaultType.LP)}
                      >
                        LP
                      </Button>
                    </ButtonGroup>
                  </HStack>
                  {!!vaultGroup && vaultGroup.length > 0 ? (
                    <>
                      <Accordion defaultIndex={[0]} allowToggle>
                        {vaultGroup.map((vault, index) => (
                          <Box key={`${currentTab}${vault.vaultId}`} mt={2}>
                            <VaultSummary
                              vault={vault}
                              vaultType={currentVaultType}
                              index={index}
                              onEditVault={(type: string) => onEditVault(vault, currentVaultType, type)}
                              onWithdrawVault={() => onWithdrawVault(vault)}
                              onTokenizeVault={() => onTokenizeVault(vault)}
                              onBoostVault={() => onBoostVault(vault)}
                              onConvertVault={() => onConvertVault(vault)}
                              onClosed={refetch}
                            />
                          </Box>
                        ))}
                      </Accordion>
                    </>
                  ) : (
                    <Box mt={4} textAlign='center'>No {currentVaultType} vaults found</Box>
                  )}
                </>
              )}
            </Box>
            <Flex justifyContent='space-around' mt={8}>
              <RdButton
                fontSize={{base: 'xl', sm: '2xl'}}
                onClick={() => handleCreateVault(!!account ? account.vaults.length : 0, !!account ? account?.vaults : [], VaultType.TOKEN)}
              >
                + New FRTN Vault
              </RdButton>
              <RdButton
                fontSize={{base: 'xl', sm: '2xl'}}
                onClick={() => handleCreateVault(!!account ? account.lpVaults.length : 0, !! account ? account?.lpVaults : [], VaultType.LP)}
              >
                + New LP Vault
              </RdButton>
            </Flex>
          </>
        ) : (
          <VStack fontSize='sm' mt={2} spacing={8}>
            <Text>Receive Troops and $Mitama by staking $Fortune. Receive more by staking longer.</Text>
            <RdButton
              fontSize={{base: 'xl', sm: '2xl'}}
              stickyIcon={true}
              onClick={handleConnect}
            >
              Connect
            </RdButton>
          </VStack>
        )}
      </Box>
    </>
    
  )
}

export default StakePage;