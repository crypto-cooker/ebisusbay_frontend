import { INITIAL_ALLOWED_SLIPPAGE } from '@dex/swap/constants';
import { V2TradeAndStableSwap } from '@dex/swap/constants/types';
import useAccountActiveChain from '@eb-pancakeswap-web/hooks/useAccountActiveChain';
import { usePaymaster } from '@eb-pancakeswap-web/hooks/usePaymaster';
import { calculateGasMargin } from '@eb-pancakeswap-web/utils';
import { basisPointsToPercent } from '@eb-pancakeswap-web/utils/exchange';
import { isUserRejected } from '@eb-pancakeswap-web/utils/sentry';
import { transactionErrorToUserReadableMessage } from '@eb-pancakeswap-web/utils/transactionErrorToUserReadableMessage';
import isZero from '@pancakeswap/utils/isZero';
import truncateHash from '@pancakeswap/utils/truncateHash';
import { Hash, hexToBigInt, isAddress, SendTransactionReturnType } from 'viem';
import { useGasPrice, useSendTransaction } from 'wagmi';
import { useUser } from '@src/components-v2/useUser';
import { BridgeContract } from '../constants/types';
import { Field } from '../state/actions';
import { useBridgeState } from '../state/hooks';
import { toast } from 'react-toastify';
import { Contract, BigNumber } from 'ethers'; // Ensure you have BigNumber from ethers
import { useState, useMemo, useCallback } from 'react';
import { useAppChainConfig } from '@src/config/hooks';
import BridgeAbi from '@src/global/contracts/Bridge.json';
import { parseErrorMessage } from '@src/helpers/validator';
import { Currency, CurrencyAmount, Trade, TradeType } from '@pancakeswap/sdk';

export function useBridgeCallback(parsedAmount: CurrencyAmount): { callback: () => Promise<void>; executing: boolean } {
  const user = useUser();
  const { config } = useAppChainConfig();
  const [executing, setExecuting] = useState(false);
  const {
    currencyId,
    typedValue,
    [Field.INPUT]: { chainId: fromChainId },
    [Field.OUTPUT]: { chainId: toChainId },
    recipient,
  } = useBridgeState();

  const callback = useCallback(async () => {
    try {
      setExecuting(true);

      if (typeof currencyId === 'undefined') {
        toast.error('The token is not selected');
        return;
      }

      const bridge: BridgeContract | undefined = config.bridges.find((bridge) =>
        bridge.currencyId.toLocaleLowerCase().includes(currencyId.toLocaleLowerCase()),
      );

      if (typeof bridge?.address === 'undefined') {
        toast.error('Can not find the bridge contract');
        return;
      }

      // Retrieve the signer properly from the provider
      const contract = new Contract(bridge.address, BridgeAbi, user.provider.getSigner());

      // Get the fee as a BigNumber
      const fee: BigNumber = await contract.fee();
      console.log(BigInt(fee.toString()), 'type of fee');

      //Get Amount from parseAmount
      const amount = parsedAmount.numerator / parsedAmount.denominator;
      // Initiate the bridge transaction with the fee as payable value
      const tx = await contract.bridge(toChainId, user.address, amount, { value: fee });

      const hash = await tx.wait(); // Wait for the transaction to be confirmed

      return hash?.transactionHash;
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecuting(false);
    }
  }, [currencyId, fromChainId, toChainId, typedValue, parsedAmount]);

  return { callback, executing } as const;
}
