import { ChainId, chainNames } from '@pancakeswap/chains'
import memoize from 'lodash/memoize'
import {
  Chain,
  cronosTestnet as cronosTestnet_,
  cronos as cronos_,
} from 'wagmi/chains'
import {defineChain} from "viem";
import {supportedTokens} from "@src/config/tokens";

export const CHAIN_QUERY_NAME = chainNames

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

// Maps chain names to chain IDs
const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

// Gets a chain ID from a chain name
export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})

export function isSupportedChainId(value: number | string): value is SupportedChainId {
  return (SUPPORTED_CHAIN_IDS as readonly number[]).includes(Number(value));
}

const cronos = {
  ...cronos_,
  rpcUrls: {
    ...cronos_.rpcUrls,
    public: {
      ...cronos_.rpcUrls,
      http: ['https://rpc.ebisusbay.com'],
    },
    default: {
      ...cronos_.rpcUrls.default,
      http: ['https://rpc.ebisusbay.com'],
    },
  },
} satisfies Chain

const cronosTestnet = {
  ...cronosTestnet_,
  rpcUrls: {
    ...cronosTestnet_.rpcUrls,
    public: {
      ...cronosTestnet_.rpcUrls,
      http: ['https://rpc.ebisusbay.biz'],
    },
    default: {
      ...cronosTestnet_.rpcUrls.default,
      http: ['https://rpc.ebisusbay.biz'],
    },
  },
} satisfies Chain

export const cronosZkEVMTestnet  = /*#__PURE__*/ defineChain({
  id: 282,
  name: 'Cronos zkEVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'zkTCRO',
    symbol: 'zkTCRO',
  },
  rpcUrls: {
    default: { http: ['https://testnet.zkevm.cronos.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Cronos zkEVM (Testnet) Explorer',
      url: 'https://explorer.zkevm.cronos.org/testnet',
    },
  },
  contracts: {
    multicall3: {
      address: '0xA44d020A117C14645E3686Db0e539657236c289F',
      blockCreated: 157022,
    },
  },
  testnet: true,
})

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = [
  ChainId.CRONOS_ZKEVM_TESTNET
]



type HexString = `0x${string}` & string;

export type AppChainConfig = {
  slug: string;
  chain: Chain;
  urls: {
    subgraph: {
      root: string;
      ryoshiDynasties: string;
      ryoshiPresale: string;
      stakedOwners: string;
      staking: string;
      farms: string;
      dex: string;
    };
  };
  contracts: {
    membership: HexString;
    auction: HexString;
    market: HexString;
    stake: HexString;
    offer: HexString;
    madAuction: HexString;
    slothtyRugsurance: HexString;
    bundle: HexString;
    gaslessListing: HexString;
    gdc: HexString;
    usdc: HexString;
    purchaseFortune: HexString;
    allianceCenter: HexString;
    battleField: HexString;
    resources: HexString;
    bank: HexString;
    barracks: HexString;
    fortune: HexString;
    rewards: HexString;
    presaleVaults: HexString;
    seasonUnlocks: HexString;
    townHall: HexString;
    vaultNft: HexString;
    ryoshiWithKnife: HexString;
    farms: HexString;
  };
}

const cronosConfig: AppChainConfig = {
  slug: 'cronos',
  chain: cronos,
  urls: {
    subgraph: {
      root: 'https://cronos-graph.ebisusbay.com:8000/subgraphs/name/ebisusbay/',
      ryoshiDynasties: 'ryoshi-dynasties-meeple',
      ryoshiPresale: 'ryoshi-presale',
      stakedOwners: 'staked-owners-2',
      staking: 'staking',
      farms: 'farms-v2',
      dex: 'exchange-v2'
    }
  },
  contracts: {
    membership: '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5',
    auction: '0xd488b38d19d5708cbda224c041a24c3e3149bc93',
    market: '0x7a3CdB2364f92369a602CAE81167d0679087e6a3',
    stake: '0xeb074cc764F20d8fE4317ab63f45A85bcE2bEcB1',
    offer: '0x016b347aeb70cc45e3bbaf324feb3c7c464e18b0',
    madAuction: '0x47E79264A9d1343C04F4A56922bE7e6177aE03a0',
    slothtyRugsurance: '0x73063E236EadC1e511FbE7313C6D8C5c651009E9',
    bundle: '0x40874F18922267cc2Ca7933828594aB5078C1065',
    gaslessListing: '0x523d6f30c4aaca133daad97ee2a0c48235bff137',
    gdc: '0xe3e564252249ab55b47b84d6a934f4cbb94233a9',
    usdc: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
    purchaseFortune: '0x04636c536537a8b7F05eDbA2cEBe1FaDd711D566',
    allianceCenter: '0x74A61DEdD269075a394932860F071D0884E7E805',
    battleField: '0xe8939d920218e0083F9e00a23eEeDfbad73d6B4D',
    resources: '0xce3f4e59834b5B52B301E075C5B3D427B6884b3d',
    bank: '0x1E16Aa4Bb965478Df310E8444CD18Fa56603A25F',
    barracks: '0xfDE081ACB68Ac6BB7B7702DEba49D99b081Bd1eF',
    fortune: '0xaF02D78F39C0002D14b95A3bE272DA02379AfF21',
    rewards: '0x0dC2ad723068B2D1ACab5083fce36E15818BABBB',
    presaleVaults: '0xd284fc59BfEeceb467b655522b9BDc34B71C55D0',
    seasonUnlocks: '0xF72A5D62B0a8Aac8eE2e4c57b35BD775637d52af',
    townHall: '0xf25AA7B9393450C97693876AfbCD84607437a1C8',
    vaultNft: '0xb2925FFC01907170493F94c1efb2Fac107a83b9F',
    ryoshiWithKnife: '0x055c517654d72A45B0d64Dc8733f8A38E27Fd49C',
    farms: '0x62eAEe24A848bEB06B8112D5A37587b3CF21F44D'
  },
}

const cronosTestnetConfig: AppChainConfig = {
  slug: 'cronos-testnet',
  chain: cronosTestnet,
  urls: {
    subgraph: {
      root: 'https://testcronos-graph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/',
      ryoshiDynasties: 'ryoshi-dynasties',
      ryoshiPresale: 'ryoshi-presale',
      stakedOwners: 'staked-owners',
      staking: 'staking',
      farms: 'farms-v2',
      dex: 'exchange-v2'
    }
  },
  contracts: {
    membership: '0x3F1590A5984C89e6d5831bFB76788F3517Cdf034',
    auction: '0xbA272524C9BFDa68741Be1A06f8376A749fc4870',
    market: '0xb3cB12e7F9e442ef799a2B7e92f65ab8710d7b27',
    stake: '0x70A9989dd73B026B34462BE158963587dD9ca16f',
    offer: '0x8Dd84fb5d7f8A504BA2398243D768C604f8Daf5E',
    madAuction: '0x84356061d598A7bCE028dB6a37b14F84cf4A5905',
    slothtyRugsurance: '0xC54821941Bb036463bDB1eea781f9b29a7f98fAc',
    bundle: '0xEbFB981D5a7A7C2133752F7787263B58495bb923',
    gaslessListing: '0xBbe0D0715AbCadb8A0Db41C0Bb7f272570907C45',
    gdc: '0xd464f36885163e124e3a15e31c0e581ba3f648ab',
    usdc: '0x1E1d0765439d0d53ee40CC4fB454C2343c84342b',
    purchaseFortune: '0xE1D0a4ae1DF871510d82144a282FF14bAcA8f2c0',
    allianceCenter: '0xD75beC9C8320D81D5B7cD0866B7F7DbC886ffeE9',
    battleField: '0x4EeDb8c80bEFB5d672F869a1bdc29Cc2f665Bb3b',
    resources: '0xDa72eE0B52A5a6d5C989f0e817c9e2AF72e572B5',
    bank: '0xeDa2FD22690e13070399605EE90E5c2F45b0c992',
    barracks: '0x5009f0D7e529b0a70e97aB78d2EC3b02394b18Db',
    fortune: '0x119adb5E05e85d55690BC4Da7b37c06BfEcF2071',
    rewards: '0xB775F2Ef8E007F6719fF0fc113048180b4482e2c',
    presaleVaults: '0x677a4B2910e0e5667907B5bf4cD4fdb188e99281',
    seasonUnlocks: '0x107ca22a421b24b0986150E51ce03b772b56440f',
    townHall: '0xEe68452B79653298Af5109Dae5cD4ABA3c4E1934',
    vaultNft: '0xa62F0C192691f5f17EBc704E1ad77ca4Ba687f74',
    ryoshiWithKnife: '0x149F2017b1C4a206d0F8684563C2F9aa519e3f64',
    farms: '0xef5E16A3849E76eF44012EEdfDF40fFeFffcdC68'
  },
}

const cronosZkEVMTestnetConfig: AppChainConfig = {
  slug: 'cronos-zk-testnet',
  chain: cronosZkEVMTestnet,
  urls: {
    subgraph: {
      root: 'https://testcronos-zkevm-graph.ebisusbay.biz:18000/subgraphs/name/ebisusbay/zkcro/',
      ryoshiDynasties: '',
      ryoshiPresale: '',
      stakedOwners: 'main',
      staking: '',
      farms: '',
      dex: ''
    }
  },
  contracts: {
    membership: '0x6618061a81Eb76aD05C227EE5aD7061a80e8a043',
    auction: ADDRESS_ZERO,
    market: '0x8a99DBE4B0B90ef6d5Dca57c04c837cA4793a217',
    stake: ADDRESS_ZERO,
    offer: ADDRESS_ZERO,
    madAuction: ADDRESS_ZERO,
    slothtyRugsurance: ADDRESS_ZERO,
    bundle: ADDRESS_ZERO,
    gaslessListing: '0xaa7D74dfCa79B2b3266B876deB5Ff77673e104C5',
    gdc: ADDRESS_ZERO,
    usdc: ADDRESS_ZERO,
    purchaseFortune: ADDRESS_ZERO,
    allianceCenter: ADDRESS_ZERO,
    battleField: ADDRESS_ZERO,
    resources: ADDRESS_ZERO,
    bank: ADDRESS_ZERO,
    barracks: ADDRESS_ZERO,
    fortune: ADDRESS_ZERO,
    rewards: ADDRESS_ZERO,
    presaleVaults: ADDRESS_ZERO,
    seasonUnlocks: ADDRESS_ZERO,
    townHall: ADDRESS_ZERO,
    vaultNft: ADDRESS_ZERO,
    ryoshiWithKnife: ADDRESS_ZERO,
    farms: ADDRESS_ZERO
  },
  // tokens: supportedTokens,
}


export const SUPPORTED_CHAIN_IDS = [
  ChainId.CRONOS,
  ChainId.CRONOS_TESTNET,
  ChainId.CRONOS_ZKEVM_TESTNET
] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

const chainConfigs: Record<SupportedChainId, AppChainConfig> = {
  [ChainId.CRONOS]: cronosConfig,
  [ChainId.CRONOS_TESTNET]: cronosTestnetConfig,
  [ChainId.CRONOS_ZKEVM_TESTNET]: cronosZkEVMTestnetConfig
}

// const wagmiChainConfigs = {
//   [ChainId.CRONOS]: cronos,
//   [ChainId.CRONOS_TESTNET]: cronosTestnet,
//   [ChainId.CRONOS_ZKEVM_TESTNET]: cronosZkEVMTestnet
// } as Record<SupportedChainId, Chain>;
//
// const chainSlugs = {
//   [ChainId.CRONOS]: 'cronos',
//   [ChainId.CRONOS_TESTNET]: 'cronos-testnet',
//   [ChainId.CRONOS_ZKEVM_TESTNET]: 'cronos-zk-testnet'
// } as const

export type ChainSlug = (typeof chainConfigs)[keyof typeof chainConfigs]['slug'];

// This is currently used for various pancake configurations. Can consider refactoring
export const CHAINS = Object.values(chainConfigs).map(({ chain }) => chain);

export default chainConfigs;