import { BaseError, UnknownRpcError } from 'viem'

export const deepValidation = (prevProps: any, nextProps: any) => JSON.stringify(prevProps) === JSON.stringify(nextProps);

export const parseErrorMessage = (error: any, defaultError?: string) => {
  if (!error) return 'Unknown Error';

  if (error.name === 'AxiosError') {
    if (error.response?.data?.error?.metadata?.message) {
      return error.response.data.error.metadata.message;
    }
    if (error.response?.data?.error?.metadata?.metadata) {
      return error.response?.data.error.metadata.metadata;
    }
  }

  if (!!error.data) {
    return error.data.message;
  }

  // Contract errors
  if (error.error?.message) {
    const message = error.error.message;
    try {
      if (message.includes('viem@')) {
        const parts = message.split('\n\n');
        return capitalizeFirstLetter(parts[0].trim());
      }
      const parts = message.split(':');
      return capitalizeFirstLetter(parts[parts.length - 1].trim());
    } catch (e: any) {
      console.log('Failed to parse error message', e, error.error.message);
    }
  }

  if (error.message) {
    return error.message;
  }

  return defaultError ?? 'Unknown Error';
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function parseViemError<TError>(err: TError): BaseError | null {
  if (err instanceof BaseError) {
    return err
  }
  if (typeof err === 'string') {
    return new UnknownRpcError(new Error(err))
  }
  if (err instanceof Error) {
    return new UnknownRpcError(err)
  }
  return null
}

export function getViemErrorMessage(err: any) {
  const error = parseViemError(err)
  if (error) {
    return error.details || error.shortMessage
  }
  return String(err)
}

export class UserUnexpectedTxError extends BaseError {
  override name = 'UserUnexpectedTxError'

  constructor({ expectedData, actualData }: { expectedData: unknown; actualData: unknown }) {
    super('User initiated transaction with unexpected data', {
      metaMessages: [
        `User initiated transaction with unexpected data`,
        ``,
        `  Expected data: ${expectedData}`,
        `  Actual data: ${actualData}`,
      ],
    })
  }
}

/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 * @param t Translation function
 */
export function transactionErrorToUserReadableMessage(error: any, t: TranslateFunction) {
  let reason: string | undefined
  const parsedError = parseViemError(error)
  if (parsedError) {
    reason = parsedError.details || parsedError.shortMessage || parsedError.message
  } else {
    while (error) {
      reason = error.reason ?? error.data?.message ?? error.message ?? reason
      // eslint-disable-next-line no-param-reassign
      error = error.error ?? error.data?.originalError
    }
  }

  if (reason?.indexOf('execution reverted: ') === 0) reason = reason.substring('execution reverted: '.length)

  const formatErrorMessage = (message: string) => [message, `(${reason})`].join(' ')
  switch (reason) {
    case 'PancakeRouter: EXPIRED':
      return formatErrorMessage(
          'The transaction could not be sent because the deadline has passed. Please check that your transaction deadline is not too low.',
      )
    case 'PancakeRouter: INSUFFICIENT_OUTPUT_AMOUNT':
    case 'PancakeRouter: EXCESSIVE_INPUT_AMOUNT':
    case 'PancakeRouter: INSUFFICIENT_A_AMOUNT':
    case 'PancakeRouter: INSUFFICIENT_B_AMOUNT':
    case 'swapMulti: incorrect user balance':
    case 'Pancake: K':
      return formatErrorMessage(
        'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.',
      )
    case 'TransferHelper: TRANSFER_FROM_FAILED':
      return formatErrorMessage('The input token cannot be transferred. There may be an issue with the input token.')
    case 'Pancake: TRANSFER_FAILED':
      return formatErrorMessage(
        'The output token cannot be transferred. There may be an issue with the output token.'
      )
    case 'Too little received':
    case 'Too much requested':
    case 'STF':
      return 'This transaction will not succeed due to price movement. Try increasing your slippage tolerance. Note: fee on transfer and rebase tokens are incompatible with Pancakeswap V3.'
    case 'TF':
      return 'The output token cannot be transferred. There may be an issue with the output token. Note: fee on transfer and rebase tokens are incompatible with Pancakeswap V3.'

    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        console.error(error, reason)
        return
          'An error occurred when trying to execute this operation. You may need to increase your slippage tolerance. If that does not work, there may be an incompatibility with the token you are trading.'
      }
      return `Unknown error${reason ? `: "${reason}"` : ''}. Try increasing your slippage tolerance.`
  }
}