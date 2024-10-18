import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { Field } from '../state/actions';
import { safeGetAddress } from '@dex/swap/imported/pancakeswap/web/utils';
import { useActiveChainId } from '@dex/swap/imported/pancakeswap/web/hooks/useActiveChainId';
import useNativeCurrency from '@dex/swap/imported/pancakeswap/web/hooks/useNativeCurrency';
import { useRouter } from 'next/router';
import { FRTN, STABLE_COIN, USDC, USDT } from '@pancakeswap/tokens';
import { chains } from '@src/wagmi';
import { DEFAULT_INPUT_CURRENCY } from '@dex/swap/constants/exchange';
import { ParsedUrlQuery } from 'querystring';
import { replaceBridgeState } from '../state/actions';
import { bridgeReducerAtom } from '../state/reducer';

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !Number.isNaN(parseFloat(urlParam)) ? urlParam : '';
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT;
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/;

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null;
  const address = safeGetAddress(recipient);
  if (address) return address;
  if (ENS_NAME_REGEX.test(recipient)) return recipient;
  if (ADDRESS_REGEX.test(recipient)) return recipient;
  return null;
}

export function queryParameterstoBridgeState(
  parsedQs: ParsedUrlQuery,
  nativeSymbol?: string,
  defaultCurrency?: string,
) {
  let currencyId = defaultCurrency || (nativeSymbol ?? DEFAULT_INPUT_CURRENCY);

  const recipient = validatedRecipient(parsedQs.recipient);

  return {
    currencyId,
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    recipient,
  };
}

export function useDefaultCurrency(): { currencyId: string | undefined } | undefined {
  const { chainId } = useActiveChainId();
  const [, dispatch] = useAtom(bridgeReducerAtom);
  const native = useNativeCurrency();
  const { query, isReady } = useRouter();
  const [result, setResult] = useState<{ currencyId: string | undefined } | undefined>();

  useEffect(() => {
    if (!chainId || !native || !isReady) return;
    const parsed = queryParameterstoBridgeState(
      query,
      native.symbol,
      FRTN[chainId as keyof typeof FRTN]?.address ??
        STABLE_COIN[chainId]?.address ??
        USDC[chainId as keyof typeof USDC]?.address ??
        USDT[chainId as keyof typeof USDT]?.address,
    );

    const toChain = chains.find((chain) => chain.id != chainId);

    dispatch(
      replaceBridgeState({
        typedValue: parsed.typedValue,
        currencyId: parsed.currencyId,
        fromChainId: chainId,
        toChainId: toChain?.id,
        recipient: '',
      }),
    );
    setResult({ currencyId: parsed.currencyId });
  }, [dispatch, chainId, query, native, isReady]);

  return result;
}
