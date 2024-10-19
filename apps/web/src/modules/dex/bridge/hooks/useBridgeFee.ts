import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAppChainConfig } from '@src/config/hooks';
import { useUser } from '@src/components-v2/useUser';
import BridgeAbi from '@src/global/contracts/Bridge.json';
import { BigNumber, Contract, utils } from 'ethers';
import { useActiveChainId } from '@dex/swap/imported/pancakeswap/web/hooks/useActiveChainId';
import { Field } from '../state/actions';
import { useBridgeState } from '../state/hooks';

export function useBridgeFee() {
  const {
    currencyId,
    [Field.INPUT]: { chainId: fromChainId },
  } = useBridgeState();
  const { config } = useAppChainConfig();
  const [fee, setFee] = useState<BigNumber | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useUser();
  const chainId = useActiveChainId();

  const bridge = useMemo(() => {
    if (!currencyId) return undefined;
    return config.bridges.find((bridge) => bridge.currencyId.toLowerCase().includes(currencyId.toLowerCase()));
  }, [currencyId, config]);

  const getFee = useCallback(async () => {
    if (!bridge || !bridge.address || !user?.provider?.signer) return;
    setLoading(true);
    try {
      const contract = new Contract(bridge.address, BridgeAbi, user.provider.signer);
      const fetchedFee = await contract.fee();
      setFee(fetchedFee);
    } catch (error) {
      console.error('Error fetching bridge fee:', error);
      setFee(undefined);
    } finally {
      setLoading(false);
    }
  }, [user, fromChainId, currencyId, bridge]);

  useEffect(() => {
    if (bridge) {
      getFee();
    }
  }, [bridge, currencyId, chainId]);
  return { fee, loading };
}