import { useUser } from '@src/components-v2/useUser';
import React, { ChangeEvent, useContext } from 'react';
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context';
import { useAppChainConfig } from '@src/config/hooks';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@src/core/services/api-service';
import { ciEquals, formattedWideRangeAmount } from '@market/helpers/utils';
import { Box, FormControl, Select, VStack } from '@chakra-ui/react';
import { formatEther } from 'viem';
import {
  TypeOption
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/convert-vault-page/types';

interface LpContextSelectionProps {
  type: TypeOption;
  onSelected: (pairConfig: any, lpVault?: any) => void;
}

const LpContextSelection = ({ type, onSelected }: LpContextSelectionProps) => {

  const user = useUser();
  const { chainId: bankChainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);

  const { data: stakingAccount, status, error, refetch } = useQuery({
    queryKey: ['UserStakeAccount', user.address, bankChainId, 'LP'],
    queryFn: () => ApiService.forChain(bankChainId).ryoshiDynasties.getBankStakingAccount(user.address!),
    enabled: !!user.address,
  });

  const handleChangeToken = (e: ChangeEvent<HTMLSelectElement>) => {
    if (type === TypeOption.Existing) {
      const vault = stakingAccount?.lpVaults.find((vault) => vault.vaultId === e.target.value);
      if (!vault) return;

      const _pairConfig = chainConfig.lpVaults.find((v) => ciEquals(v.pair, vault.pool!));
      if (!_pairConfig) return;

      onSelected(_pairConfig, vault);
    } else {
      const _pairConfig = chainConfig.lpVaults.find((v) => v.pair === e.target.value);
      if (!_pairConfig) return;

      onSelected(_pairConfig)
    }
  }

  return (
    <VStack align='stretch'>
      <Box>LP Vault</Box>
      <FormControl maxW='250px'>
        {type === TypeOption.Existing ? (
          <Select onChange={handleChangeToken} bg='none' placeholder='--- Select a vault ---'>
            {stakingAccount?.lpVaults.map((vault) => (
              <option key={vault.vaultId} value={vault.vaultId}>
                ID: {vault.index}, Bal: {formattedWideRangeAmount(formatEther(vault.balance))}
              </option>
            ))}
          </Select>
        ) : type === TypeOption.New && (
          <Select onChange={handleChangeToken} bg='none' placeholder='--- Select an LP ---'>
            {chainConfig.lpVaults.map((vaultConfig) => (
              <option key={vaultConfig.pair} value={vaultConfig.pair}>{vaultConfig.name}</option>
            ))}
          </Select>
        )}
      </FormControl>
    </VStack>
  )
}

export default LpContextSelection;