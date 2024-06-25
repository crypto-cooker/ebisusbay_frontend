import {
  CurrencyState,
  DerivedSwapInfo,
  swapFormDerivedStateAtom,
  swapFormStateAtom,
  swapPageStateAtom
} from "@dex/swap/state/swap/atom";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {SwapState} from "@dex/imported/state/swap/types";
import {Currency, CurrencyAmount, Token, TradeType} from "@uniswap/sdk-core";
import {useAccount} from "wagmi";
import {Address, erc20Abi} from "viem";
import {useCallback, useEffect, useMemo, useState} from "react";
import {isAddress} from "@market/helpers/utils";
import {multicall} from "@wagmi/core";
import JSBI from "jsbi";
import {nativeOnChain} from "@dex/imported/constants/tokens";
import {useUser} from "@src/components-v2/useUser";
import {Field} from "src/modules/dex/swap/constants";
import tryParseCurrencyAmount from "@dex/swap/utils/tryParseCurrencyAmount";
import {useDebouncedTrade} from "@dex/swap/utils/useDebouncedTrade";
import {RouterPreference} from "@dex/imported/state/routing/types";
import {wagmiConfig} from "@src/wagmi";
import {useTradeExactIn, useTradeExactOut} from "pancakeswap/hooks/trades";

export function useSwapPageState() {
  return useAtom(swapPageStateAtom);
}

export function useSwapPageStateRead() {
  return useAtomValue(swapPageStateAtom);
}

export function useSwapFormState() {
  return useAtom(swapFormStateAtom);
}

export function useSwapFormDerivedState() {
  return useAtom(swapFormDerivedStateAtom);
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: (options: { newOutputHasTax: boolean; previouslyEstimatedOutput: string }) => void
  onUserInput: (field: Field, typedValue: string) => void
} {
  const [ swapPageState, setSwapPageState ] = useSwapPageState()
  const [ swapFormState, setSwapFormState ] = useSwapFormState()

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      const [currentCurrencyKey, otherCurrencyKey]: (keyof CurrencyState)[] =
        field === Field.INPUT ? ['inputCurrency', 'outputCurrency'] : ['outputCurrency', 'inputCurrency']
      const otherCurrency = swapPageState.currencyState[otherCurrencyKey]
      // the case where we have to swap the order

      console.log('useSwapActionHandlers', 'onCurrencySelection', otherCurrency, currency);
      if (otherCurrency && currency.equals(otherCurrency)) {
        setSwapPageState((prev) => ({
          ...prev,
          currencyState: {
            [currentCurrencyKey]: currency,
            [otherCurrencyKey]: prev.currencyState[currentCurrencyKey],
          }
        }));
        console.log('useSwapActionHandlers', 'SET SWAP FORM STATE', {[currentCurrencyKey]: currency})
        setSwapFormState((prev) => ({
          ...prev,
          independentField: prev.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        }))
      } else {
        console.log('useSwapActionHandlers', 'SET SWAP PAGE STATE', {[currentCurrencyKey]: currency})
        setSwapPageState((prev) => ({
          ...prev,
          currencyState: {
            ...prev.currencyState,
            [currentCurrencyKey]: currency
          }
        }));
      }
    },
    [swapFormState, swapPageState, setSwapFormState]
  )

  const onSwitchTokens = useCallback(
    ({
       newOutputHasTax,
       previouslyEstimatedOutput,
     }: {
      newOutputHasTax: boolean
      previouslyEstimatedOutput: string
    }) => {
      // To prevent swaps with FOT tokens as exact-outputs, we leave it as an exact-in swap and use the previously estimated output amount as the new exact-in amount.
      if (newOutputHasTax && swapFormState.independentField === Field.INPUT) {
        setSwapFormState((prev) => ({
          ...prev,
          typedValue: previouslyEstimatedOutput,
        }))
      } else {
        setSwapFormState((prev) => ({
          ...prev,
          independentField: prev.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        }))
      }

      setSwapPageState((prev) => ({
        ...prev,
        currencyState: {
          inputCurrency: prev.currencyState.outputCurrency,
          outputCurrency: prev.currencyState.inputCurrency,
        }
      }));
    },
    [setSwapPageState, setSwapFormState, swapFormState.independentField]
  )

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      console.log('onUserInput', field, typedValue);
      setSwapFormState((prev) => ({
        ...prev,
        independentField: field,
        typedValue,
      }))
    },
    [setSwapFormState]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
  }
}

export function useDerivedSwapInfo(state: SwapState): DerivedSwapInfo {
  const user = useUser();
  const {
    currencyState: { inputCurrency, outputCurrency },
  } = useSwapPageStateRead()
  const { independentField, typedValue } = state

  const relevantTokenBalances = useCurrencyBalances(
    user.address,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency])
  );
console.log('HI', inputCurrency, outputCurrency)

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = useMemo(
    () => tryParseCurrencyAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined),
    [inputCurrency, isExactIn, outputCurrency, typedValue]
  )

  console.log('===TRADE IN===', isExactIn, parsedAmount, outputCurrency, inputCurrency, user.address);
  console.log('===TRADE PARMS===',
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    parsedAmount,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
    RouterPreference.API,
    user.address);

  const trade = useDebouncedTrade(
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    parsedAmount,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
    RouterPreference.API,
    user.address
  )

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined)
  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined)

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  console.log('bestTradeExactIn', bestTradeExactIn);
  console.log('bestTradeExactOut', bestTradeExactOut);
  console.log('bestTradeResult', v2Trade);

  const currencyBalances = useMemo(
    () => ({
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }),
    [relevantTokenBalances]
  )

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency,
      [Field.OUTPUT]: outputCurrency,
    }),
    [inputCurrency, outputCurrency]
  )

  console.log('DERIVEDSTATE', {
    currencies,
    currencyBalances,
    parsedAmount,
    trade
  });

  return useMemo(() => ({
    currencies,
    currencyBalances,
    parsedAmount,
    trade
  }) as any, [currencies, currencyBalances, parsedAmount, trade]);
}


/**
 * Returns balances for tokens on currently-connected chainId via RPC.
 * See useTokenBalancesQuery for multichain portfolio balances via GQL.
 */
export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken ?? false) ?? [],
    [currencies]
  )
  const { chain } = useAccount()
  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies])

  const ethAccounts = useMemo(() => (containsETH ? [account] : []), [containsETH, account]);
  const ethBalance = useNativeCurrencyBalances(ethAccounts)

  console.log('===debug: useCurrencyBalances', ethBalance, tokenBalances, account, tokens, currencies, chain?.id);
  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency || currency.chainId !== chain?.id) return undefined
        if (currency.isToken) return tokenBalances[currency.address]
        if (currency.isNative) return undefined //ethBalance[account as keyof typeof ethBalance]
        return undefined
      }) ?? [],
    [account, chain?.id, currencies, ethBalance, tokenBalances]
  )
}


export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}


export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const { chain } = useAccount() // we cannot fetch balances cross-chain
  const [balances, setBalances] = useState<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    console.log('===debug: d')
    if (!address || !tokens || tokens.length === 0) {
      setBalances({});
      setLoading(false);
      return;
    }

    const fetchBalances = async () => {
      setLoading(true);
      const tokenAddresses = tokens.filter((t): t is Token => !!t && !!isAddress(t.address) && t.chainId === chain?.id).map(t => t.address);

      try {
        const calls = tokenAddresses.map(address => ({
          address: address as Address,
          functionName: 'balanceOf',
          abi: erc20Abi,
          params: [address]
        }));

        const results = await multicall(wagmiConfig as any, {
          contracts: calls
        });
        const newBalances = tokenAddresses.reduce((acc, address, index) => {
          const value = results[index];
          const amount = value ? JSBI.BigInt(value.toString()) : undefined;
          if (amount) {
            acc[address] = CurrencyAmount.fromRawAmount(tokens[index]!, amount);
          }
          return acc;
        }, {} as {[key: string]: CurrencyAmount<Token> | undefined});

        setBalances(newBalances);
      } catch (error) {
        console.error('Failed to fetch balances:', error);
        setBalances({});
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [address, tokens, chain?.id]);


  return [balances, isLoading];
}

export function useNativeCurrencyBalances(uncheckedAddresses?: (string | undefined)[]): {
  balances: { [address: string]: CurrencyAmount<Currency> | undefined },
  isLoading: boolean
} {
  const { chain } = useAccount()
  const [balances, setBalances] = useState<{ [address: string]: CurrencyAmount<Currency> | undefined }>({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!uncheckedAddresses || uncheckedAddresses.length === 0) {
        setBalances({});
        setLoading(false);
        return;
      }

      setLoading(true);
      const addresses = uncheckedAddresses.filter(isAddress).sort();

      try {
        const calls = addresses.map(address => ({
          address: address as Address,
          abi: erc20Abi,
          functionName: 'getEthBalance',
          params: [address]
        }));

        const results = await multicall(wagmiConfig as any, {contracts: calls});
        const newBalances = addresses.reduce((acc, address, index) => {
          const result = results[index];
          const value = result ? JSBI.BigInt(result.toString()) : undefined;
          if (value && chain?.id) {
            acc[address!] = CurrencyAmount.fromRawAmount(nativeOnChain(chain.id), value);
          }
          return acc;
        }, {} as {[key: string]: CurrencyAmount<Currency> | undefined});

        setBalances(newBalances);
      } catch (error) {
        console.error('Failed to fetch ETH balances:', error);
        setBalances({});
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [uncheckedAddresses, chain?.id]);

  return { balances, isLoading };
}

// export function useUpdateSwapFormState() {
//   const setSwapFormState = useSetAtom(swapFormStateAtom);
//   const setDerivedInfo = useSetAtom(swapFormDerivedStateAtom);
//
//   const updateStateForNetworkChange = useCallback((newChainId) => {
//     // Assuming some logic determines how state should update based on chain ID
//     setSwapFormState(prevState => ({
//       ...prevState,
//       focusedFieldState: {
//         ...prevState.focusedFieldState,
//         typedValue: '' // Resetting the typed value or any other fields as necessary
//       }
//     }));
//   }, [setSwapFormState]);
//
//   return { updateStateForNetworkChange, setDerivedInfo };
// }