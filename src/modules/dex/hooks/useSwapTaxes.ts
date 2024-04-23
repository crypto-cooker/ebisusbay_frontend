import { ChainId, Percent } from '@uniswap/sdk-core'
import { useEffect, useState } from 'react'
import {useUser} from "@src/components-v2/useUser";
import {BIPS_BASE} from "@dex/constants/misc";
import {ZERO_PERCENT} from "@uniswap/router-sdk";
import {useNetwork} from "wagmi";
import {useContract} from "@dex/hooks/useContract";
const FEE_ON_TRANSFER_DETECTOR_ADDRESS = '0x19C97dc2a25845C7f9d1d519c8C2d4809c58b43f'
import { WETH_ADDRESS as getWethAddress } from '@uniswap/universal-router-sdk'
import FOT_DETECTOR_ABI from '@dex/packages/uniswap/src/abis/fee-on-transfer-detector.json'

function useFeeOnTransferDetectorContract(): FeeOnTransferDetector | null {
  const { address: account } = useUser()
  const contract = useContract<FeeOnTransferDetector>(FEE_ON_TRANSFER_DETECTOR_ADDRESS, FOT_DETECTOR_ABI)

  // useEffect(() => {
  //   if (contract && account) {
  //     sendAnalyticsEvent(InterfaceEventName.WALLET_PROVIDER_USED, {
  //       source: 'useFeeOnTransferDetectorContract',
  //       contract: {
  //         name: 'FeeOnTransferDetector',
  //         address: FEE_ON_TRANSFER_DETECTOR_ADDRESS,
  //       },
  //     })
  //   }
  // }, [account, contract])
  return contract
}

// TODO(WEB-2787): add tax-fetching for other chains
const WETH_ADDRESS = getWethAddress(ChainId.MAINNET)
const AMOUNT_TO_BORROW = 10000 // smallest amount that has full precision over bps

const FEE_CACHE: { [address in string]?: { sellTax?: Percent; buyTax?: Percent } } = {}

async function getSwapTaxes(
  fotDetector: FeeOnTransferDetector,
  inputTokenAddress: string | undefined,
  outputTokenAddress: string | undefined
) {
  const addresses = []
  if (inputTokenAddress && FEE_CACHE[inputTokenAddress] === undefined) {
    addresses.push(inputTokenAddress)
  }

  if (outputTokenAddress && FEE_CACHE[outputTokenAddress] === undefined) {
    addresses.push(outputTokenAddress)
  }

  try {
    if (addresses.length) {
      const data = await fotDetector.callStatic.batchValidate(addresses, WETH_ADDRESS, AMOUNT_TO_BORROW)

      addresses.forEach((address, index) => {
        const { sellFeeBps, buyFeeBps } = data[index]
        const sellTax = new Percent(sellFeeBps.toNumber(), BIPS_BASE)
        const buyTax = new Percent(buyFeeBps.toNumber(), BIPS_BASE)

        FEE_CACHE[address] = { sellTax, buyTax }
      })
    }
  } catch (e) {
    console.warn('Failed to get swap taxes for token(s):', addresses, e)
  }

  const inputTax = (inputTokenAddress ? FEE_CACHE[inputTokenAddress]?.sellTax : ZERO_PERCENT) ?? ZERO_PERCENT
  const outputTax = (outputTokenAddress ? FEE_CACHE[outputTokenAddress]?.buyTax : ZERO_PERCENT) ?? ZERO_PERCENT

  return { inputTax, outputTax }
}

export function useSwapTaxes(inputTokenAddress?: string, outputTokenAddress?: string) {
  const fotDetector = useFeeOnTransferDetectorContract()
  const [{ inputTax, outputTax }, setTaxes] = useState({ inputTax: ZERO_PERCENT, outputTax: ZERO_PERCENT })
  const { chain } = useNetwork()

  useEffect(() => {
    if (!fotDetector || chain?.id !== ChainId.MAINNET) return
    getSwapTaxes(fotDetector, inputTokenAddress, outputTokenAddress).then(setTaxes)
  }, [fotDetector, inputTokenAddress, outputTokenAddress, chain?.id])

  return { inputTax, outputTax }
}
