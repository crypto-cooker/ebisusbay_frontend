import { Contract } from '@ethersproject/contracts'
import {
  ARGENT_WALLET_DETECTOR_ADDRESS,
  ChainId,
  ENS_REGISTRAR_ADDRESSES,
  MULTICALL_ADDRESSES,
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
  V2_ROUTER_ADDRESSES,
  V3_MIGRATOR_ADDRESSES,
} from '@uniswap/sdk-core'
import IUniswapV2PairJson from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import IUniswapV2Router02Json from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import NonfungiblePositionManagerJson from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import V3MigratorJson from '@uniswap/v3-periphery/artifacts/contracts/V3Migrator.sol/V3Migrator.json'
import UniswapInterfaceMulticallJson from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'
import { RPC_PROVIDERS } from '@dex/constants/providers'
import { WRAPPED_NATIVE_CURRENCY } from '@dex/constants/tokens'
import { useEffect, useMemo } from 'react'
import ARGENT_WALLET_DETECTOR_ABI from '@dex/packages/uniswap/src/abis/argent-wallet-detector.json'
import EIP_2612 from '@dex/packages/uniswap/src/abis/eip_2612.json'
import ENS_PUBLIC_RESOLVER_ABI from '@dex/packages/uniswap/src/abis/ens-public-resolver.json'
import ENS_ABI from '@dex/packages/uniswap/src/abis/ens-registrar.json'
import ERC1155_ABI from '@dex/packages/uniswap/src/abis/erc1155.json'
import ERC20_ABI from '@dex/packages/uniswap/src/abis/erc20.json'
import ERC20_BYTES32_ABI from '@dex/packages/uniswap/src/abis/erc20_bytes32.json'
import ERC721_ABI from '@dex/packages/uniswap/src/abis/erc721.json'
import {
  ArgentWalletDetector,
  EnsPublicResolver,
  EnsRegistrar,
  Erc1155,
  Erc20,
  Erc721,
  Weth,
} from '@dex/packages/uniswap/src/abis/types'
// import { NonfungiblePositionManager, UniswapInterfaceMulticall } from '@dex/packages/uniswap/src/abis/types/v3'
// import { V3Migrator } from '@dex/packages/uniswap/src/abis/types/v3/V3Migrator'
import WETH_ABI from '@dex/packages/uniswap/src/abis/weth.json'
import { getContract } from '@dex/utils/getContract'
import {useNetwork} from "wagmi";
import {useUser} from "@src/components-v2/useUser";

const { abi: IUniswapV2PairABI } = IUniswapV2PairJson
const { abi: IUniswapV2Router02ABI } = IUniswapV2Router02Json
const { abi: MulticallABI } = UniswapInterfaceMulticallJson
const { abi: NFTPositionManagerABI } = NonfungiblePositionManagerJson
const { abi: V2MigratorABI } = V3MigratorJson

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { address: account, provider } = useUser()
  const { chain } = useNetwork()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chain?.id) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chain?.id]
    if (!address) return null
    try {
      return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, provider, chain?.id, withSignerIfPossible, account]) as T
}

function useMainnetContract<T extends Contract = Contract>(address: string | undefined, ABI: any): T | null {
  const { chain } = useNetwork()
  const isMainnet = chain?.id === ChainId.MAINNET
  const contract = useContract(isMainnet ? address : undefined, ABI, false)

  return useMemo(() => {
    if (isMainnet) return contract
    if (!address) return null
    const provider = RPC_PROVIDERS[ChainId.MAINNET]
    try {
      return getContract(address, ABI, provider)
    } catch (error) {
      console.error('Failed to get mainnet contract', error)
      return null
    }
  }, [isMainnet, contract, address, ABI]) as T
}

// export function useV2MigratorContract() {
//   return useContract<V3Migrator>(V3_MIGRATOR_ADDRESSES, V2MigratorABI, true)
// }

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean) {
  const { chain } = useNetwork()
  return useContract<Weth>(
    chain?.id ? WRAPPED_NATIVE_CURRENCY[chain.id]?.address : undefined,
    WETH_ABI,
    withSignerIfPossible
  )
}

export function useERC721Contract(nftAddress?: string) {
  return useContract<Erc721>(nftAddress, ERC721_ABI, false)
}

export function useERC1155Contract(nftAddress?: string) {
  return useContract<Erc1155>(nftAddress, ERC1155_ABI, false)
}

export function useArgentWalletDetectorContract() {
  return useContract<ArgentWalletDetector>(ARGENT_WALLET_DETECTOR_ADDRESS, ARGENT_WALLET_DETECTOR_ABI, false)
}

export function useENSRegistrarContract() {
  return useMainnetContract<EnsRegistrar>(ENS_REGISTRAR_ADDRESSES[ChainId.MAINNET], ENS_ABI)
}

export function useENSResolverContract(address: string | undefined) {
  return useMainnetContract<EnsPublicResolver>(address, ENS_PUBLIC_RESOLVER_ABI)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612, false)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useV2RouterContract(): Contract | null {
  const { chain } = useNetwork()
  return useContract(chain?.id ? V2_ROUTER_ADDRESSES[chain.id] : undefined, IUniswapV2Router02ABI, true)
}

export function useInterfaceMulticall() {
  return useContract<any>(MULTICALL_ADDRESSES, MulticallABI, false)
}

export function useMainnetInterfaceMulticall() {
  return useMainnetContract<any>(
    MULTICALL_ADDRESSES[ChainId.MAINNET],
    MulticallABI
  )
}
//
// export function useV3NFTPositionManagerContract(withSignerIfPossible?: boolean): NonfungiblePositionManager | null {
//   const { address: account } = useUser()
//   const { chain } = useNetwork()
//   const contract = useContract<NonfungiblePositionManager>(
//     NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
//     NFTPositionManagerABI,
//     withSignerIfPossible
//   )
//   useEffect(() => {
//     if (contract && account) {
//       // sendAnalyticsEvent(InterfaceEventName.WALLET_PROVIDER_USED, {
//       //   source: 'useV3NFTPositionManagerContract',
//       //   contract: {
//       //     name: 'V3NonfungiblePositionManager',
//       //     address: contract.address,
//       //     withSignerIfPossible,
//       //     chainId,
//       //   },
//       // })
//     }
//   }, [account, chain?.id, contract, withSignerIfPossible])
//   return contract
// }
