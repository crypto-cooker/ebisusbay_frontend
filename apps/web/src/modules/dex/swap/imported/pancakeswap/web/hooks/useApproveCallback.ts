import { Currency, CurrencyAmount, ERC20Token } from '@pancakeswap/sdk'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
// import { usePaymaster } from 'hooks/usePaymaster'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHasPendingApproval, useTransactionAdder } from '@eb-pancakeswap-web/state/transactions/hooks'
import { calculateGasMargin } from '@eb-pancakeswap-web/utils'
import { getViemErrorMessage } from '@eb-pancakeswap-web/utils/errors'
import { Address, SendTransactionReturnType, encodeFunctionData, parseAbi } from 'viem'
import { useAccount } from 'wagmi'
import { useCallWithGasPrice } from './useCallWithGasPrice'
import { useTokenContract } from './useContract'
import useTokenAllowance from '@eb-pancakeswap-web/hooks/useTokenAllowance'
import {toast} from 'react-toastify';

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string,
  {
    addToTransaction = true,
    targetAmount,

    /**
     * Use paymaster if available.
     * Enable only if Gas Token Selector is present on the interface.
     */
    enablePaymaster = false,
  }: {
    addToTransaction?: boolean
    targetAmount?: bigint
    enablePaymaster?: boolean
  } = {},
) {
  const { address: account } = useAccount()
  const { callWithGasPrice } = useCallWithGasPrice()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const { allowance: currentAllowance, refetch } = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)
  // const { isPaymasterAvailable, isPaymasterTokenActive, sendPaymasterTransaction } = usePaymaster()
  const { isPaymasterAvailable, isPaymasterTokenActive, sendPaymasterTransaction } = {
    isPaymasterAvailable: false,
    isPaymasterTokenActive: false,
    sendPaymasterTransaction: () => {
      return Promise.resolve({ hash: '' })
    },
  }

  const [pending, setPending] = useState<boolean>(pendingApproval)
  const [isPendingError, setIsPendingError] = useState<boolean>(false)

  useEffect(() => {
    if (pendingApproval) {
      setPending(true)
    } else if (pending) {
      refetch().then(() => {
        setPending(false)
      })
    }
  }, [pendingApproval, pending, refetch])

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency?.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pending
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pending, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(
    async (overrideAmountApprove?: bigint, alreadyApproved = approvalState !== ApprovalState.NOT_APPROVED) => {
      if (alreadyApproved && isUndefinedOrNull(overrideAmountApprove)) {
        toast.error('Error', 'Approve was called unnecessarily')
        console.error('approve was called unnecessarily')
        setIsPendingError(true)
        return undefined
      }
      if (!token) {
        // toast.error('Error', 'No token')
        console.error('no token')
        // return undefined
      }

      if (!tokenContract) {
        toast.error('Error', `Cannot find contract of the token ${token?.address}`)
        console.error('tokenContract is null')
        setIsPendingError(true)
        return undefined
      }

      if (!amountToApprove && isUndefinedOrNull(overrideAmountApprove)) {
        toast.error('Error', 'Missing amount to approve')
        console.error('missing amount to approve')
        setIsPendingError(true)
        return undefined
      }

      if (!spender) {
        toast.error('Error', 'No spender')
        console.error('no spender')
        setIsPendingError(true)
        return undefined
      }

      let useExact = false

      const estimatedGas = await tokenContract.estimateGas
        .approve(
          [spender as Address, MaxUint256], // TODO: Fix viem
          // @ts-ignore
          {
            account: tokenContract.account,
          },
        )
        .catch((err) => {
          console.info('try estimate approve max failure', err)
          // general fallback for tokens who restrict approval amounts
          useExact = true
          return tokenContract.estimateGas
            .approve(
              [spender as Address, overrideAmountApprove ?? amountToApprove?.quotient ?? targetAmount ?? MaxUint256],
              // @ts-ignore
              {
                account: tokenContract.account,
              },
            )
            .catch((e) => {
              console.error('estimate gas failure', e)
              toast.error('Error', 'Unexpected error. Could not estimate gas for the approve.')
              setIsPendingError(true)
              return null
            })
        })

      if (!estimatedGas) return undefined
      const finalAmount =
        overrideAmountApprove ?? (useExact ? amountToApprove?.quotient ?? targetAmount ?? MaxUint256 : MaxUint256)

      let sendTxResult: Promise<SendTransactionReturnType> | undefined

      if (enablePaymaster && isPaymasterAvailable && isPaymasterTokenActive) {
        const calldata = encodeFunctionData({
          abi: parseAbi(['function approve(address spender, uint256 amount) public returns (bool)']),
          functionName: 'approve',
          args: [spender as Address, finalAmount],
        })

        const call = {
          address: tokenContract.address,
          gas: estimatedGas,
          calldata,
        }

        sendTxResult = sendPaymasterTransaction(call, account)
      } else {
        sendTxResult = callWithGasPrice(tokenContract, 'approve' as const, [spender as Address, finalAmount], {
          gas: calculateGasMargin(estimatedGas),
        }).then((response) => response.hash)
      }

      return sendTxResult
        .then((response) => {
          if (addToTransaction && token) {
            addTransaction(
              { hash: response },
              {
                summary: `Approve ${overrideAmountApprove ?? amountToApprove?.currency?.symbol}`,
                translatableSummary: {
                  text: 'Approve %symbol%',
                  data: { symbol: overrideAmountApprove?.toString() ?? amountToApprove?.currency?.symbol },
                },
                approval: { tokenAddress: token.address, spender, amount: finalAmount.toString() },
                type: 'approve',
              },
            )
          }
          return { hash: response }
        })
        .catch((error: any) => {
          // logError(error)
          console.error('Failed to approve token', error)
          toast.error('Error', getViemErrorMessage(error))
          throw error
        })
    },
    [
      approvalState,
      token,
      tokenContract,
      amountToApprove,
      spender,
      callWithGasPrice,
      targetAmount,
      toast,
      addToTransaction,
      addTransaction,
      account,
      isPaymasterAvailable,
      isPaymasterTokenActive,
      sendPaymasterTransaction,
      enablePaymaster,
    ],
  )

  const approveNoCheck = useCallback(
    async (overrideAmountApprove?: bigint) => {
      return approve(overrideAmountApprove, false)
    },
    [approve],
  )

  const approveCallback = useCallback(() => {
    return approve()
  }, [approve])

  const revokeCallback = useCallback(() => {
    return approve(0n)
  }, [approve])

  const revokeNoCheck = useCallback(() => {
    return approveNoCheck(0n)
  }, [approveNoCheck])

  return {
    approvalState,
    approveCallback,
    approveNoCheck,
    revokeCallback,
    revokeNoCheck,
    currentAllowance,
    isPendingError,
  }
}

export function useApproveCallbackFromAmount({
 token,
 minAmount,
 targetAmount,
 spender,
 addToTransaction,
}: {
  token?: ERC20Token
  minAmount?: bigint
  targetAmount?: bigint
  spender?: string
  addToTransaction?: boolean
}) {
  const amountToApprove = useMemo(() => {
    if (!minAmount || !token) return undefined
    return CurrencyAmount.fromRawAmount(token, minAmount)
  }, [minAmount, token])

  return useApproveCallback(amountToApprove, spender, {
    addToTransaction,
    targetAmount,
  })
}