import { ChainId, chainNames, isTestnetChainId } from '@pancakeswap/chains'
import memoize from 'lodash/memoize'
import {
  Chain,
  cronosTestnet as cronosTestnet_,
  cronos as cronos_,
  cronoszkEVMTestnet as cronoszkEVMTestnet_,
  cronoszkEVM as cronoszkEVM_,
} from 'wagmi/chains'
import {chainConfig} from "viem/zksync";
import {Address} from "viem";

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
  blockExplorers: {
    default: {
      name: 'Cronos Explorer',
      url: 'https://cronoscan.com/',
      apiUrl: 'https://api.cronoscan.com/api',
    },
  },
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

export const cronosZkEVMTestnet = {
  ...cronoszkEVMTestnet_,
  ...chainConfig,
  contracts: {
    multicall3: {
      address: '0xA44d020A117C14645E3686Db0e539657236c289F',
      blockCreated: 157022,
    },
  },
} satisfies Chain

export const cronosZkEVM = {
  ...cronoszkEVM_,
  ...chainConfig,
  contracts: {
    multicall3: {
      address: '0x06f4487D7C4a5983d2660DB965Cc6d2565E4cfaA',
      blockCreated: 1,
    },
  },
} satisfies Chain

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = [
  ChainId.CRONOS_ZKEVM_TESTNET
]



type HexString = `0x${string}` & string;

export type AppChainConfig = {
  name: string; // wagmi chain name is too verbose
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
    frtnRewarder: HexString;
  };
  lpVaults: Array<{name: string, pair: Address, address1: Address, address2: Address}>
  bridges: Array<{currencyId: string, address: Address}>
}

const cronosConfig: AppChainConfig = {
  name: 'Cronos',
  slug: 'cronos',
  chain: cronos,
  urls: {
    subgraph: {
      root: 'https://cronos-graph.ebisusbay.com:8000/subgraphs/name/ebisusbay/',
      ryoshiDynasties: 'ryoshi-dynasties-lp-staking-fixed',
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
    farms: '0x62eAEe24A848bEB06B8112D5A37587b3CF21F44D',
    frtnRewarder: ADDRESS_ZERO
  },
  lpVaults: [
    {
      name: 'FRTN/CRO',
      pair: '0xFc0A8Be90566e5329caeC3d9630a603453ac7E44',
      address1: '0xaF02D78F39C0002D14b95A3bE272DA02379AfF21',
      address2: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23'
    },
    {
      name: 'FRTN/USDC',
      pair: '0xAf56DF060Ca167361c66831801E0E17bB05bb313',
      address1: '0xaF02D78F39C0002D14b95A3bE272DA02379AfF21',
      address2: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
    }
  ],
  bridges: [
    {
      currencyId: '0xaF02D78F39C0002D14b95A3bE272DA02379AfF21',
      address: '0x632FdbC1Fd2e81b44CF00da182984d9F6c2bB2B3'
    }
  ]
}

const cronosTestnetConfig: AppChainConfig = {
  name: 'Cronos Testnet',
  slug: 'cronos-testnet',
  chain: cronosTestnet,
  urls: {
    subgraph: {
      root: 'https://testcronos-graph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/',
      ryoshiDynasties: 'ryoshi-dynasties-lp-staking',
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
    farms: '0xef5E16A3849E76eF44012EEdfDF40fFeFffcdC68',
    frtnRewarder: ADDRESS_ZERO
  },
  lpVaults: [
    {
      name: 'FRTN/CRO',
      pair: '0x7c80f7062F8Caaf3DC6Baf3CE4e6e2162cB99503',
      address1: '0x119adb5E05e85d55690BC4Da7b37c06BfEcF2071',
      address2: '0x467604E174c87042fcc4412c5BC70AaBc8733016'
    }
  ],
  bridges: [
    {
      currencyId: '0x119adb5E05e85d55690BC4Da7b37c06BfEcF2071',
      address: '0x4B09F5d044e5Cf23DEF1c20cF668a0bAD9837faC'
    }
  ]
}

const cronosZkEVMTestnetConfig: AppChainConfig = {
  name: 'Cronos ZK Testnet',
  slug: 'cronos-zk-testnet',
  chain: cronosZkEVMTestnet,
  urls: {
    subgraph: {
      root: 'https://testcronos-zkevm-graph.ebisusbay.biz:18000/subgraphs/name/ebisusbay/zkcro/',
      ryoshiDynasties: 'ryoshi-dynasties',
      ryoshiPresale: '',
      stakedOwners: 'main',
      staking: '',
      farms: 'farms',
      dex: ''
    }
  },
  contracts: {
    membership: '0x6618061a81Eb76aD05C227EE5aD7061a80e8a043',
    auction: ADDRESS_ZERO,
    market: '0x2ff3b2A3D1cFa4a677DB1B132a732666284A546F',
    stake: ADDRESS_ZERO,
    offer: ADDRESS_ZERO,
    madAuction: ADDRESS_ZERO,
    slothtyRugsurance: ADDRESS_ZERO,
    bundle: ADDRESS_ZERO,
    gaslessListing: '0x10b9aF43CE896C0Fe732092AFcE1C5C3239ed403',
    gdc: ADDRESS_ZERO,
    usdc: ADDRESS_ZERO,
    purchaseFortune: ADDRESS_ZERO,
    allianceCenter: '0x7DE09B2A259d59C21D184af6Bda00117Ee0b83d5',
    battleField: '0x3d01a0CcFD1E232A238676dc765740Ecd2aA42b0',
    resources: '0x8D72E7E434Dab2c1e579BE596c248E19bB70e624',
    bank: '0x2FaE7e00E8F7ec5f9CaF2B1CC006137c4d257E4c',
    barracks: '0xe835007c10330a2dd2a60ed5c59753c7211afb23',
    fortune: '0x6f3ff3c76b6dd1d2b4cfc3846f6f1bcba757bf24',
    rewards: '0x72fFE8EA7512c96Ba0c5b868A62eEfb054F0fe38',
    presaleVaults: ADDRESS_ZERO,
    seasonUnlocks: ADDRESS_ZERO,
    townHall: '0x5694977D6c90138B93C6FBf127Af5766A84159Cb',
    vaultNft: '0x05e693aED87234129840e8a776bEB47A49e8583E',
    ryoshiWithKnife: ADDRESS_ZERO,
    farms: '0x1f76a013a77371aeed10c47a04acbf2e719926ed',
    frtnRewarder: '0x891343470d4c3b1d50adcff5527365b75874f30a'
  },
  lpVaults: [
    {
      name: 'FRTN/CRO',
      pair: '0x31b0acF3f70d664B2b70f3eF48DE95913CF13677',
      address1: '0x6f3ff3c76b6dd1d2b4cfc3846f6f1bcba757bf24',
      address2: '0xf9Bb37013de8Cd3f89b3623Af9EE1b1B32D872C9'
    }
  ],
  bridges: [
    {
      currencyId: '0x6f3ff3c76b6dd1d2b4cfc3846f6f1bcba757bf24',
      address: '0x5BFa2B69D5EF18CefBF5CD471126DE5efc1460Fa'
    }
  ]
}

const cronosZkEVMConfig: AppChainConfig = {
  name: 'Cronos ZK',
  slug: 'cronos-zk',
  chain: cronosZkEVM,
  urls: {
    subgraph: {
      root: 'https://cronos-zkevm-graph.ebisusbay.com:18000/subgraphs/name/ebisusbay/zkcro/',
      ryoshiDynasties: 'ryoshi-dynasties-lp-staking',
      ryoshiPresale: '',
      stakedOwners: 'main',
      staking: '',
      farms: 'farms',
      dex: ''
    }
  },
  contracts: {
    membership: '0x8a99DBE4B0B90ef6d5Dca57c04c837cA4793a217',
    auction: ADDRESS_ZERO,
    market: '0xaa7D74dfCa79B2b3266B876deB5Ff77673e104C5',
    stake: ADDRESS_ZERO,
    offer: ADDRESS_ZERO,
    madAuction: ADDRESS_ZERO,
    slothtyRugsurance: ADDRESS_ZERO,
    bundle: ADDRESS_ZERO,
    gaslessListing: '0x5817ebf93d826e2fb424a57B84a5bbC9B8E7a0C9',
    gdc: ADDRESS_ZERO,
    usdc: ADDRESS_ZERO,
    purchaseFortune: ADDRESS_ZERO,
    allianceCenter: '0x38F82EFA6BB840c2e4EF838F729CE736Df5da118',
    battleField: '0x18c640c37de95999E8E1b74B2881D378fd984F6B',
    resources: '0x542F3d6aA5609a97bbFB56a4C430b3F37e5fA12F',
    bank: '0x53af20897522E233dC7a00B4a24AB724d507f321',
    barracks: '0x13c7409A2A987410461310A3C34F30d6dcacBe36',
    fortune: '0x96e03fa6c5ab3a7f2e7098dd07c8935493294e26',
    rewards: '0x0dd71A640F026Ba7bF96f2792246Ff3f3249845B',
    presaleVaults: ADDRESS_ZERO,
    seasonUnlocks: ADDRESS_ZERO,
    townHall: '0xB7EAD5007CfA0dbCF573439780F66be31392824D',
    vaultNft: '0xE99b17eb4Ddb3efC6AFF08aFe83D1F80278FeC7e',
    ryoshiWithKnife: ADDRESS_ZERO,
    farms: '0xbcE43dabc90E475D3c203603782962B85aDC32d4',
    frtnRewarder: '0x918a1CF72E80bB23b8CdCe6Db31CF625c5535E70'
  },
  lpVaults: [
    {
      name: 'FRTN/zkCRO',
      pair: '0xe3bc309431b15e8fa822643b716faf2146ccb122',
      address1: '0x96e03FA6c5aB3a7F2e7098Dd07c8935493294E26',
      address2: '0xC1bF55EE54E16229d9b369a5502Bfe5fC9F20b6d'
    }
  ],
  bridges: [
    {
      currencyId: '0x96e03fa6c5ab3a7f2e7098dd07c8935493294e26',
      address: '0x7C306fc3B6Cd7A5A9A798695abe8690D29495065'
    }
  ]
}

export const SUPPORTED_CHAIN_IDS = [
  ChainId.CRONOS,
  ChainId.CRONOS_TESTNET,
  ChainId.CRONOS_ZKEVM,
  ChainId.CRONOS_ZKEVM_TESTNET
] as const

export const SUPPORTED_RD_CHAIN_IDS = [
  ChainId.CRONOS,
  ChainId.CRONOS_TESTNET,
  ChainId.CRONOS_ZKEVM,
  ChainId.CRONOS_ZKEVM_TESTNET
] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

const chainConfigs: Record<SupportedChainId, AppChainConfig> = {
  [ChainId.CRONOS]: cronosConfig,
  [ChainId.CRONOS_TESTNET]: cronosTestnetConfig,
  [ChainId.CRONOS_ZKEVM]: cronosZkEVMConfig,
  [ChainId.CRONOS_ZKEVM_TESTNET]: cronosZkEVMTestnetConfig
}

export const SUPPORTED_CHAIN_CONFIGS = Object.values(chainConfigs)
  .filter(({ chain }) => {
    return (process.env.NEXT_PUBLIC_ENV === 'testnet' && isTestnetChainId(chain.id)) ||
      (process.env.NEXT_PUBLIC_ENV !== 'testnet' && !isTestnetChainId(chain.id))
  })
  .sort((a, b) => {
    // Check if either chain is CRONOS or CRONOS_TESTNET and give them priority
    if (a.chain.id === ChainId.CRONOS || a.chain.id === ChainId.CRONOS_TESTNET) return -1;
    if (b.chain.id === ChainId.CRONOS || b.chain.id === ChainId.CRONOS_TESTNET) return 1;

    // Keep their original order if neither is CRONOS or CRONOS_TESTNET
    return 0;
  });

export const SUPPORTED_RD_CHAIN_CONFIGS = SUPPORTED_CHAIN_CONFIGS
  .filter(({ chain }) => {
    return SUPPORTED_RD_CHAIN_IDS.includes(chain.id)
  });

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
export const CHAINS = SUPPORTED_CHAIN_CONFIGS.map(({ chain }) => chain);

export const DEFAULT_CHAIN_ID = process.env.NEXT_PUBLIC_ENV === 'testnet' ? ChainId.CRONOS_TESTNET : ChainId.CRONOS;

export default chainConfigs;
