import isZero from '@pancakeswap/utils/isZero'
import {useActiveChainId} from '@eb-pancakeswap-web/hooks/useActiveChainId'
import {useMemo} from 'react'
import {Address, encodeFunctionData, hexToBigInt, isAddress, stringify} from 'viem'

import {ChainId} from '@pancakeswap/chains'
import {isSupportedPaymasterChainId, ZyfiResponse} from '@src/config/paymaster'
import {eip712WalletActions} from 'viem/zksync'
import {useConfig, useWalletClient} from 'wagmi'
import {useGasTokenByChain} from '@eb-pancakeswap-web/hooks/use-gas-token'
import {useAppConfig} from "@src/config/hooks";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {getTransactionCount} from "@wagmi/core";


/**
 * Zyfi Paymaster for the zkSync chain
 */
export const useMarketPaymaster = (targetChainId?: ChainId) => {
  const chain = useActiveChainId()
  const chainId = targetChainId ?? chain?.chainId;

  const { data: walletClient } = useWalletClient()
  const { config: appConfig } = useAppConfig()
  const {requestSignature} = useEnforceSignature();
  const wagmiConfig = useConfig()

  const [gasToken] = useGasTokenByChain(chainId)

  /**
   * Check if the Paymaster for zkSync is available
   */
  const isPaymasterAvailable = useMemo(() => {
    return isSupportedPaymasterChainId(chainId);
  }, [chainId])

  /**
   * Check if a paymaster token is selected.
   * Default is the native token to pay gas
   */
  const isPaymasterTokenActive = useMemo(() => {
    return gasToken && gasToken.isToken && gasToken.address && isAddress(gasToken.address)
  }, [gasToken])

  async function sendPaymasterTransaction(call: any, account?: Address) {
    if (!account) throw new Error('An active wallet connection is required to send paymaster transaction')
    if (!gasToken) throw new Error('No gas token detected')
    if (!gasToken.isToken) throw new Error('Selected gas token is not an ERC20 token. Unsupported by Paymaster.')
    if (!isPaymasterAvailable || !isPaymasterTokenActive) throw new Error('Paymaster is not available or active.')

    const userSig = await requestSignature();

    const calldata = encodeFunctionData({
      abi: call.contract.abi,
      args: call.parameters.args,
      functionName: call.parameters.methodName
    })

    const modifiedSwapCall = {
      address: call.contract.address,
      calldata,
      value: call.parameters.value,
      gas: call.gas
    }

    const response = await fetch(`${appConfig.urls.cms}paymaster/market?address=${account}&signature=${userSig}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: stringify({
        call: modifiedSwapCall,
        account,
        gasTokenAddress: gasToken.address,
        chainId: chainId
      }),
    })

    if (!response.ok) throw new Error('Failed to send paymaster transaction')


    const { data } = await response.json()
    if (data.error) throw new Error('Failed to handle paymaster transaction')

    const txResponse = data as ZyfiResponse;

    const nonce = await getTransactionCount(wagmiConfig, { address: account })

    const newTx = {
      account,
      to: txResponse.txData.to,
      value: txResponse.txData.value && !isZero(txResponse.txData.value) ? hexToBigInt(txResponse.txData.value) : 0n,
      chainId: chainId,
      gas: BigInt(txResponse.gasLimit),
      maxFeePerGas: BigInt(txResponse.txData.maxFeePerGas),
      maxPriorityFeePerGas: BigInt(0),
      data: calldata,
      gasPerPubdata: BigInt(txResponse.txData.customData.gasPerPubdata),
      paymaster: txResponse.txData.customData.paymasterParams.paymaster,
      paymasterInput: txResponse.txData.customData.paymasterParams.paymasterInput,
      nonce
    }

    if (!walletClient) {
      throw new Error('Failed to execute paymaster transaction')
    }

    const client = walletClient.extend(eip712WalletActions())
    const txReq = await client.prepareTransactionRequest(newTx)
    return await client.sendTransaction(txReq)
  }

  return {
    isPaymasterAvailable,
    isPaymasterTokenActive,
    sendPaymasterTransaction,
  }
}
