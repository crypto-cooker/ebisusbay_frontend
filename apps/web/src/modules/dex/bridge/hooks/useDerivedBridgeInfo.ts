import { useMemo } from 'react';
import { useAppChainConfig } from '@src/config/hooks';
import { Field } from '@dex/bridge/state/actions';
import { useAccount } from 'wagmi';
import { useCurrencyBalance } from '@dex/swap/imported/pancakeswap/web/state/wallet/hooks';
import tryParseAmount from '@pancakeswap/utils/tryParseAmount';
import { Currency, CurrencyAmount, Trade, TradeType } from '@pancakeswap/sdk';
import { ChainId } from '@pancakeswap/chains';
import { useTokenBalanceOnCertainChain } from '@dex/hooks/use-token-balances';
import { useBridgeFee } from '../hooks/useBridgeFee';

export function useDerivedBridgeInfo(
  fromChainId: ChainId,
  toChainId: ChainId,
  typedValue: string | undefined,
  currency: Currency | undefined,
): {
  currency: { [field in Field]?: Currency };
  currencyBalance: { [field in Field]?: CurrencyAmount<Currency> };
  parsedAmount: CurrencyAmount<Currency> | undefined;
  bridge: Trade<Currency, Currency, TradeType> | undefined;
  inputError?: string;
} {
  const { address: account } = useAccount();
  const { config: toChainConfig } = useAppChainConfig(toChainId);
  const currencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined);
  const parsedAmount = tryParseAmount(typedValue, currency ?? undefined);

  const toTokenAddress: string = findToTokenAddress(toChainConfig.contracts, currency?.name);
  const toBridgeAddress = useMemo(() => {
    if (!currency) return;
    const bridge = toChainConfig.bridges.find((bridge) => {
      return bridge.currencyId.toLowerCase().includes(toTokenAddress?.toLowerCase());
    });
    return bridge?.address;
  }, [toTokenAddress, toChainConfig]);
  const { balance: toBridgeBalance, isLoading } = useTokenBalanceOnCertainChain(
    toTokenAddress,
    toChainId,
    toBridgeAddress as string,
  );
  const balanceToWarn = parseFloat(parseFloat(toBridgeBalance).toFixed(4)).toString();
  const parsedToBridgeBalance = tryParseAmount(toBridgeBalance, currency);

  const { fee } = useBridgeFee();
  const bridge = useMemo(() => {
    return {
      fee,
      fromChainId,
      toChainId,
      currency,
      amount: parsedAmount,
    };
  }, [fee, fromChainId, toChainId, currency, parsedAmount]);
  let inputError: string | undefined;
  if (!account) {
    inputError = 'Connect Wallet';
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'Enter an amount';
  }

  if (!currency) {
    inputError = inputError ?? 'Select a token';
  }

  if (currencyBalance && parsedAmount && currencyBalance.lessThan(parsedAmount)) {
    inputError = `Insufficient ${currency.symbol} balance`;
  }

  if (isLoading) inputError = 'Waiting ...';

  if (parsedToBridgeBalance && parsedAmount && parsedToBridgeBalance.lessThan(parsedAmount)) {
    inputError = `Set below ${balanceToWarn} ${currency.symbol}`;
  }

  return {
    bridge,
    currency,
    currencyBalance,
    parsedAmount,
    inputError,
  };
}

export const findToTokenAddress = (contracts: any, tokenName: string) => {
  const properties = Object.keys(contracts);
  const values: string[] = Object.values(contracts);

  return values[properties.indexOf(tokenName?.toLowerCase())];
};
