import { INITIAL_ALLOWED_SLIPPAGE } from "@dex/swap/constants"
import { V2TradeAndStableSwap } from "@dex/swap/constants/types"
import useAccountActiveChain from "@eb-pancakeswap-web/hooks/useAccountActiveChain"
import { usePaymaster } from '@eb-pancakeswap-web/hooks/usePaymaster'
import { calculateGasMargin } from "@eb-pancakeswap-web/utils"
import { basisPointsToPercent } from "@eb-pancakeswap-web/utils/exchange"
import { isUserRejected } from "@eb-pancakeswap-web/utils/sentry"
import { transactionErrorToUserReadableMessage } from "@eb-pancakeswap-web/utils/transactionErrorToUserReadableMessage"
import { SwapParameters, TradeType } from '@pancakeswap/sdk'
import isZero from '@pancakeswap/utils/isZero'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useMemo } from 'react'
import {Hash, hexToBigInt, isAddress, SendTransactionReturnType} from 'viem'
import {useGasPrice, useSendTransaction} from "wagmi"


export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: any
  parameters: SwapParameters
}

interface SuccessfulCall extends SwapCallEstimate {
  gasEstimate: bigint
}

interface FailedCall extends SwapCallEstimate {
  error: string
}

interface SwapCallEstimate {
  call: SwapCall
}

// TODO: wagmi should remove?
// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: V2TradeAndStableSwap | null, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
  swapCalls: SwapCall[],
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId } = useAccountActiveChain()
  const { sendTransactionAsync } = useSendTransaction()
  const gasPrice = useGasPrice()
  const { isPaymasterAvailable, isPaymasterTokenActive, sendPaymasterTransaction } = usePaymaster()

  // const addTransaction = useTransactionAdder()

  const recipient = recipientAddress === null ? account : recipientAddress

  return useMemo(() => {
    if (!trade || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddress !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const {
              parameters: { methodName, args, value },
              contract,
            } = call
            const options = !value || isZero(value) ? {} : { value }

            return contract.estimateGas[methodName](args, options)
              .then((gasEstimate: any) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError: any) => {
                console.error('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](args, options)
                  .then((result: any) => {
                    console.error('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: 'Unexpected issue with estimating the gas. Please try again.' }
                  })
                  .catch((callError: any) => {
                    console.error('Call threw error', call, callError)

                    return { call, error: transactionErrorToUserReadableMessage(callError) }
                  })
              })
          }),
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
        )

        // // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        // const successfulEstimation = estimatedCalls.find(
        //   (el, ix, list): el is SuccessfulCall =>
        //     'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
        // )

        // if (!successfulEstimation) {
        //   const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
        //   if (errorCalls.length > 0) throw new Error(errorCalls[errorCalls.length - 1].error)
        //   throw new Error('Unexpected error. Could not estimate gas for the swap.')
        // }

        if (!bestCallOption) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          const firstNoErrorCall = estimatedCalls.find<SwapCallEstimate>(
            (call): call is SwapCallEstimate => !('error' in call),
          )
          if (!firstNoErrorCall) throw new Error('Unexpected error. Could not estimate gas for the swap.')
          bestCallOption = firstNoErrorCall
        }

        const call =
          'getCall' in bestCallOption.call
            ? await bestCallOption.call.getCall()
            : (bestCallOption.call as SwapCall & { gas?: string | bigint })

        if ('error' in call) {
          throw new Error('Route lost. Need to restart.')
        }

        if ('gas' in call && call.gas) {
          // prepared Wallchain's call have gas estimate inside
          call.gas = BigInt(call.gas)
        } else {
          call.gas =
            'gasEstimate' in bestCallOption && bestCallOption.gasEstimate
              ? calculateGasMargin(bestCallOption.gasEstimate, 2000n)
              : undefined
        }

        let sendTxResult: Promise<SendTransactionReturnType> | undefined

        if (isPaymasterAvailable && isPaymasterTokenActive) {
          sendTxResult = sendPaymasterTransaction(call, account)
        } else {
          sendTxResult = sendTransactionAsync({
            account,
            chainId,
            to: call.address,
            data: call.calldata,
            value: call.value && !isZero(call.value) ? hexToBigInt(call.value) : 0n,
            gas: call.gas,
          })
          // sendTxResult = contract.write[methodName](args, {
          //   gas: calculateGasMargin(gasEstimate),
          //   gasPrice: gasPrice.data,
          //   ...(value && !isZero(value) ? { value, account } : { account }),
          // })
        }

        return sendTxResult
          .then((response: Hash) => {
            const inputSymbol = trade.inputAmount.currency.symbol
            const outputSymbol = trade.outputAmount.currency.symbol
            const pct = basisPointsToPercent(allowedSlippage)
            const inputAmount =
              trade.tradeType === TradeType.EXACT_INPUT
                ? trade.inputAmount.toSignificant(3)
                : trade.maximumAmountIn(pct).toSignificant(3)

            const outputAmount =
              trade.tradeType === TradeType.EXACT_OUTPUT
                ? trade.outputAmount.toSignificant(3)
                : trade.minimumAmountOut(pct).toSignificant(3)

            const base = `Swap ${
              trade.tradeType === TradeType.EXACT_OUTPUT ? 'max.' : ''
            } ${inputAmount} ${inputSymbol} for ${
              trade.tradeType === TradeType.EXACT_INPUT ? 'min.' : ''
            } ${outputAmount} ${outputSymbol}`

            const recipientAddressText =
              recipientAddress && isAddress(recipientAddress) ? truncateHash(recipientAddress) : recipientAddress

            const withRecipient = recipient === account ? base : `${base} to ${recipientAddressText}`

            const translatableWithRecipient =
              trade.tradeType === TradeType.EXACT_OUTPUT
                ? recipient === account
                  ? 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol%'
                  : 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol% to %recipientAddress%'
                : recipient === account
                  ? 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol%'
                  : 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol% to %recipientAddress%'

            // addTransaction(
            //   { hash: response },
            //   {
            //     summary: withRecipient,
            //     translatableSummary: {
            //       text: translatableWithRecipient,
            //       data: {
            //         inputAmount,
            //         inputSymbol,
            //         outputAmount,
            //         outputSymbol,
            //         ...(recipient !== account && recipientAddressText && { recipientAddress: recipientAddressText }),
            //       },
            //     },
            //     type: 'swap',
            //   },
            // )
            // logSwap({
            //   account,
            //   hash: response,
            //   chainId,
            //   inputAmount,
            //   outputAmount,
            //   input: trade.inputAmount.currency,
            //   output: trade.outputAmount.currency,
            //   type: isStableSwap(trade) ? 'StableSwap' : 'V2Swap',
            // })
            // logTx({ account, chainId, hash: response })

            return response
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (isUserRejected(error)) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(`Swap failed: ${transactionErrorToUserReadableMessage(error)}`)
            }
          })
      },
      error: null,
    }
  }, [trade, account, chainId, recipient, recipientAddress, swapCalls, gasPrice, allowedSlippage])
}
