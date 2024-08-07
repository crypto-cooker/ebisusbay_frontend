import { useQueryClient } from '@tanstack/react-query'
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { multicallReducerAtom } from '@eb-pancakeswap-web/state/multicall/reducer'
import { Abi, Address, EncodeFunctionDataParameters, Hex, decodeFunctionResult, encodeFunctionData } from 'viem'
import {
  Call,
  ListenerOptions,
  ListenerOptionsWithGas,
  addMulticallListeners,
  parseCallKey,
  removeMulticallListeners,
  toCallKey,
} from './actions'
import {multicall} from "viem/actions";
import {wagmiConfig} from "@src/wagmi";
import { useContractReads } from 'wagmi';

type ViemContractReadResult<T> =
  | { data: T; status: 'success' }
  | { error: string; status: 'reverted' };

type AbiStateMutability = 'pure' | 'view' | 'nonpayable' | 'payable'

interface CallResult {
  readonly valid: boolean
  readonly data: Hex | undefined
  readonly blockNumber: number | undefined
}

const INVALID_RESULT: CallResult = { valid: false, blockNumber: undefined, data: undefined }

// use this options object
export const NEVER_RELOAD: ListenerOptions = {
  blocksPerFetch: Infinity,
}

// the lowest level call for subscribing to contract data
function useCallsData(calls: (Call | undefined)[], options?: ListenerOptions): CallResult[] {
  const { chainId } = useActiveChainId()
  const [{ callResults }, dispatch] = useAtom(multicallReducerAtom)

  const serializedCallKeys: string = useMemo(
    () =>
      JSON.stringify(
        calls
          ?.filter((c): c is Call => Boolean(c))
          ?.map(toCallKey)
          ?.sort() ?? [],
      ),
    [calls],
  )

  // update listeners when there is an actual change that persists for at least 100ms
  useEffect(() => {
    const callKeys: string[] = JSON.parse(serializedCallKeys)
    if (!chainId || callKeys.length === 0) return undefined
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const calls = callKeys.map((key) => parseCallKey(key))
    dispatch(
      addMulticallListeners({
        chainId,
        calls,
        options,
      }),
    )

    return () => {
      dispatch(
        removeMulticallListeners({
          chainId,
          calls,
          options,
        }),
      )
    }
  }, [chainId, dispatch, options, serializedCallKeys])

  return useMemo(
    () =>
      calls.map<CallResult>((call) => {
        if (!chainId || !call) return INVALID_RESULT

        const result = callResults[chainId]?.[toCallKey(call)]
        let data
        if (result?.data && result?.data !== '0x') {
          // eslint-disable-next-line prefer-destructuring
          data = result.data
        }

        return { valid: true, data, blockNumber: result?.blockNumber }
      }),
    [callResults, calls, chainId],
  )
}

export interface CallState<T = any> {
  readonly valid: boolean
  // the result, or undefined if loading or errored/no data
  readonly result: T | undefined
  // true if the result has never been fetched
  readonly loading: boolean
  // true if the result is not for the latest block
  readonly syncing: boolean
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean
  readonly blockNumber?: number
}

const INVALID_CALL_STATE: CallState = { valid: false, result: undefined, loading: false, syncing: false, error: false }
const LOADING_CALL_STATE: CallState = { valid: true, result: undefined, loading: true, syncing: true, error: false }

function toCallState<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
>(
  callResult: ViemContractReadResult<any> | undefined,
  abi: TAbi | undefined,
  functionName: any,
  latestBlockNumber: number | undefined,
): CallState<any> {
  if (!callResult) return INVALID_CALL_STATE
  const { status, error, result } = callResult
  if (!functionName || !abi || !latestBlockNumber) return LOADING_CALL_STATE
  const success = status === 'success';
  if (success && !error) {
    return {
      valid: true,
      loading: false,
      syncing: false,
      result,
      error: !success,
      blockNumber: latestBlockNumber,
    }
  }

  console.debug('Result data parsing failed', abi, result)
  return {
    valid: true,
    loading: false,
    error: true,
    syncing: false,
    result,
    blockNumber: latestBlockNumber,
  }
}

export type SingleContractMultipleDataCallParameters<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = {
  contract: {
    abi?: TAbi
    address?: Address
  }
  // FIXME: wagmiv2
  functionName: any
  options?: ListenerOptionsWithGas
  // FIXME: wagmiv2
  args: any
}

export function useSingleContractMultipleData<TAbi extends Abi | readonly unknown[], TFunctionName extends string>({
  contract,
  args,
  functionName,
  options,
}: // FIXME: wagmiv2
SingleContractMultipleDataCallParameters<TAbi, TFunctionName>): CallState<any>[] {
  const { chainId } = useActiveChainId()

  const contracts = useMemo(
    () =>
      contract && contract.abi && contract.address && args && args.length > 0
        ? args.map((inputs: any) => ({
          address: contract.address,
          abi: contract.abi,
          functionName,
          args: inputs,
          chainId,
        }))
        : [],
    [args, contract, functionName],
  );

  // @ts-ignore
  const { data, error } = useContractReads({
    contracts,
    ...options,
  });

  const queryClient = useQueryClient()

  return useMemo(() => {
    const currentBlockNumber = queryClient.getQueryCache().find<number>({
      queryKey: ['blockNumber', chainId],
    })?.state?.data;

    return data
      ? data.map((result) => toCallState(result, contract.abi, functionName, currentBlockNumber))
      : contracts.map(() => toCallState(undefined, contract.abi, functionName, currentBlockNumber));
  }, [data, queryClient, chainId, contracts, contract.abi, functionName]);
}

const DEFAULT_OPTIONS = {
  blocksPerFetch: undefined as number | undefined,
}

export type MultipleSameDataCallParameters<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = {
  addresses: (Address | undefined)[]
  abi: TAbi
  // FIXME: wagmiv2
  functionName: any
  options?: ListenerOptionsWithGas
} & any
// GetFunctionArgs<TAbi, TFunctionName>

export function useMultipleContractSingleData<TAbi extends Abi | readonly unknown[], TFunctionName extends string>({
  abi,
  addresses,
  functionName,
  args,
  options,
}: // FIXME: wagmiv2
// MultipleSameDataCallParameters<TAbi, TFunctionName>): CallState<ContractFunctionResult<TAbi, TFunctionName>>[] {
MultipleSameDataCallParameters<TAbi, TFunctionName>): CallState<any>[] {
  const { chainId } = useActiveChainId()


  const { enabled, blocksPerFetch } = options ?? { enabled: true }

  const contracts = useMemo(
    () =>
      abi && enabled && addresses && addresses.length > 0
        ? addresses.map((address: Address) => ({
          address,
          abi,
          functionName,
          args,
          chainId,
        }))
        : [],
    [abi, addresses, functionName, args, enabled, chainId],
  );

  const { data, error, status } = useContractReads({
    contracts,
    watch: options?.blocksPerFetch || undefined,
    enabled,
  });
  
  const queryClient = useQueryClient()

  return useMemo(() => {
    const currentBlockNumber = queryClient.getQueryCache().find<number>({
      queryKey: ['blockNumber', chainId],
    })?.state?.data;

    return data
      ? data.map((result) => toCallState(result, abi, functionName, currentBlockNumber))
      : contracts.map(() => toCallState(undefined, abi, functionName, currentBlockNumber, error?.message || 'Unknown error'));
  }, [data, contracts, queryClient, chainId, abi, functionName, error]);
}

export type SingleCallParameters<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = {
  contract?: {
    abi?: TAbi
    address?: Address
  } | null
  // FIXME: wagmiv2
  // functionName: InferFunctionName<TAbi, TFunctionName, TAbiStateMutability>
  functionName: string
  options?: ListenerOptionsWithGas
} & any
// } & GetFunctionArgs<TAbi, TFunctionName>

export function useSingleCallResult<TAbi extends Abi | readonly unknown[], TFunctionName extends string>({
  contract,
  functionName,
  args,
  options,
}: // FIXME: wagmiv2
SingleCallParameters<TAbi, TFunctionName>): CallState<any> {
  const calls = useMemo<Call[]>(() => {
    return contract && contract.abi && contract.address
      ? [
          {
            address: contract.address,
            callData: encodeFunctionData({
              abi: contract.abi,
              args,
              functionName,
            } as unknown as EncodeFunctionDataParameters),
          },
        ]
      : []
  }, [contract, args, functionName])

  const result = useCallsData(calls, options)[0]

  const queryClient = useQueryClient()
  const { chainId } = useActiveChainId()

  return useMemo(() => {
    const currentBlockNumber = queryClient.getQueryCache().find<number>({
      queryKey: ['blockNumber', chainId],
    })?.state?.data
    return toCallState(result, contract?.abi, functionName, currentBlockNumber)
  }, [queryClient, chainId, result, contract?.abi, functionName])
}
