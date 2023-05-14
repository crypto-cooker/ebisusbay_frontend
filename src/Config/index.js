import rpcConfig from '../Assets/networks/rpc_config.json';
import rpcConfigDev from '../Assets/networks/rpc_config_dev.json';
import rpcConfigTestnet from '../Assets/networks/rpc_config_testnet.json';
import Constants from '../constants';
const { Features } = Constants;

export const environments = {
  production: 'production',
  testnet: 'testnet',
  development: 'development',
  local: 'local'
};

export const configData = {
  [environments.production]: {
    chain: {
      name: 'Cronos Mainnet Beta',
      id: '25',
      symbol: 'CRO',
    },
    urls: {
      api: 'https://api.ebisusbay.com/',
      app: 'https://app.ebisusbay.com/',
      subgraph: 'https://cronos-graph.ebisusbay.com:8000/subgraphs/name/ebisusbay/',
      cms: 'https://cms.ebisusbay.com/api/',
      explorer: 'https://cronoscan.com/',
      cdn: {
        bunnykit: 'https://ik-proxy.b-cdn.net/',
        ipfs: 'https://cdn.ltsglxy.network/ipfs/',
        arweave: 'https://cdn.ltsglxy.network/arweave/',
        proxy: 'https://cdn.ltsglxy.network/proxy/',
        storage: 'https://cdn-prod.ebisusbay.com/storage/',
        files: 'https://cdn-prod.ebisusbay.com/files/',
        app: 'https://cdn-prod.ebisusbay.com/'
      }
    },
    rpc: {
      read: 'https://rpc.ebisusbay.com/',
      write: 'https://evm.cronos.org/',
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
      cnsusd: '0xCF92513AA42bFf5cae6f28Ed5c4a108D9a328233',
      gaslessListing: '0x523d6f30c4aaca133daad97ee2a0c48235bff137',
      gdc: '0xe3e564252249ab55b47b84d6a934f4cbb94233a9',
      purchaseFortune: '0x04636c536537a8b7F05eDbA2cEBe1FaDd711D566',
      usdc: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59'
      // allianceCenter: '0xba7Eb8a6BD856b652cF9CA4ed2bbE7fE4325Da17'
    },
    tokens: {
      loot: {
        name: 'LOOT',
        symbol: 'LOOT',
        address: '0xEd34211cDD2cf76C3cceE162761A72d7b6601E2B',
      },
      mad: {
        name: 'MAD',
        symbol: 'MAD',
        address: '0x212331e1435a8df230715db4c02b2a3a0abf8c61',
      },
      trpz: {
        name: 'TRPZ',
        symbol: 'TRPZ',
        address: '0x1Cc0B25BD5105CD8905f7e9cD174435D4C890E02',
      },
      bacc: {
        name: 'BACC',
        symbol: 'BACC',
        address: '',
      },
      vrse: {
        name: 'VRSE',
        symbol: 'VRSE',
        address: '0x2ba01269eafce04c8dccc4a9887884ab66e4bcb1',
      }
    },
    collections: rpcConfig.known_contracts,
    drops: rpcConfig.drops,
    auctions: rpcConfig.auctions,
    vendors: {
      transak: {
        url: 'https://global.transak.com?apiKey=c5d03d27-59a6-49dd-9de3-5dad9471d105&isAutoFillUserData=true'
      }
    },
    tokenSale: {
      vipStart: 1682971200000,
      publicStart: 1682974800000,
      publicEnd: 1683579600000,
      memberCollections: [
        '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5', // FM
        '0x653DDF1Bb9995ecfcbDd411Dc3F9793127680B29', // Valentine
        '0x008d4Ab1D8fbC7823422a7cCFe3f1D73c09760Ab', // Holiday Hares
        '0xD961956B319A10CBdF89409C0aE7059788A4DaBb', // Cronies
        '0x54E61e2043f894475D17D344250F1983f7F7e6D3', // Ryoshi Halloween
        '0xE49709A3B59d708f50AA3712F2E5a84b7707664C', // Ryoshi VIP
        '0xf54abdcba21e7a740f98307a561b605cb3fdcf63', // Legacy VIP
        '0x584a16905ca9cb10c0a2a9caa8e37a64de48c506', // SeaShrine VIP
        '0xe3Ef45955b507895779a6A8911bBc48E0E17B11C', // Ryoshi Christmas
      ]
    }
  },
  [environments.development]: {
    chain: {
      name: 'Cronos Mainnet Beta',
      id: '25',
      symbol: 'CRO',
    },
    urls: {
      api: 'https://api.ebisusbay.biz/',
      app: 'https://app.ebisusbay.biz/',
      subgraph: 'https://cronos-graph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/',
      cms: 'https://cms.ebisusbay.biz/api/',
      explorer: 'https://cronoscan.com/',
      cdn: {
        bunnykit: 'https://ik-proxy.b-cdn.net/',
        ipfs: 'https://cdn.ltsglxy.network/ipfs/',
        arweave: 'https://cdn.ltsglxy.network/arweave/',
        proxy: 'https://cdn.ltsglxy.network/proxy/',
        storage: 'https://cdn-dev.ebisusbay.biz/storage/',
        files: 'https://cdn-dev.ebisusbay.biz/files/',
        app: 'https://cdn-dev.ebisusbay.biz/'
      }
    },
    rpc: {
      read: 'https://rpc.ebisusbay.com/',
      write: 'https://evm.cronos.org/',
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
      cnsusd: '0xCF92513AA42bFf5cae6f28Ed5c4a108D9a328233',
      gaslessListing: '0x523d6f30c4aaca133daad97ee2a0c48235bff137',
      gdc: '0xe3e564252249ab55b47b84d6a934f4cbb94233a9',
      purchaseFortune: '0x04636c536537a8b7F05eDbA2cEBe1FaDd711D566',
      usdc: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59'
    },
    tokens: {
      loot: {
        name: 'LOOT',
        symbol: 'LOOT',
        address: '0xEd34211cDD2cf76C3cceE162761A72d7b6601E2B',
      },
      mad: {
        name: 'MAD',
        symbol: 'MAD',
        address: '0x212331e1435a8df230715db4c02b2a3a0abf8c61',
      },
      trpz: {
        name: 'TRPZ',
        symbol: 'TRPZ',
        address: '0x1Cc0B25BD5105CD8905f7e9cD174435D4C890E02',
      },
      bacc: {
        name: 'BACC',
        symbol: 'BACC',
        address: '',
      },
      vrse: {
        name: 'VRSE',
        symbol: 'VRSE',
        address: '0x2ba01269eafce04c8dccc4a9887884ab66e4bcb1',
      }
    },
    collections: rpcConfigDev.known_contracts,
    drops: rpcConfigDev.drops,
    auctions: rpcConfigDev.auctions,
    vendors: {
      transak: {
        url: 'https://global-stg.transak.com?apiKey=6bdef2f9-cfab-4d58-bb79-82794642a67e&isAutoFillUserData=true'
      }
    },
    tokenSale: {
      vipStart: 1682971200000,
      publicStart: 1682974800000,
      publicEnd: 1683579600000,
      memberCollections: [
        '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5', // FM
        '0x653DDF1Bb9995ecfcbDd411Dc3F9793127680B29', // Valentine
        '0x008d4Ab1D8fbC7823422a7cCFe3f1D73c09760Ab', // Holiday Hares
        '0xD961956B319A10CBdF89409C0aE7059788A4DaBb', // Cronies,
        '0x54E61e2043f894475D17D344250F1983f7F7e6D3', // Ryoshi Halloween
        '0xE49709A3B59d708f50AA3712F2E5a84b7707664C', // Ryoshi VIP
        '0xf54abdcba21e7a740f98307a561b605cb3fdcf63', // Legacy VIP
        '0x584a16905ca9cb10c0a2a9caa8e37a64de48c506', // SeaShrine VIP
        '0xe3Ef45955b507895779a6A8911bBc48E0E17B11C', // Ryoshi Christmas
      ]
    }
  },
  [environments.testnet]: {
    chain: {
      name: 'Cronos Testnet',
      id: '338',
      symbol: 'tCRO',
    },
    urls: {
      api: 'https://testapi.ebisusbay.biz/',
      app: 'https://testapp.ebisusbay.biz/',
      subgraph: 'https://testcronos-graph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/',
      cms: 'https://testcms.ebisusbay.biz/api/',
      explorer: 'https://testnet.cronoscan.com/',
      cdn: {
        bunnykit: 'https://ik-proxy.b-cdn.net/',
        ipfs: 'https://cdn-test.ltsglxy.network/ipfs/',
        arweave: 'https://cdn-test.ltsglxy.network/arweave/',
        proxy: 'https://cdn-test.ltsglxy.network/proxy/',
        storage: 'https://cdn-test.ebisusbay.biz/storage/',
        files: 'https://cdn-test.ebisusbay.biz/files/',
        app: 'https://cdn-test.ebisusbay.biz/'
      }
    },
    rpc: {
      read: 'https://rpc.ebisusbay.biz/',
      write: 'https://evm-t3.cronos.org/',
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
      cnsusd: '0x263818f9693548446A41ad7025923612b490CB0D',
      gaslessListing: '0xBbe0D0715AbCadb8A0Db41C0Bb7f272570907C45',
      gdc: '0xd464f36885163e124e3a15e31c0e581ba3f648ab',
      allianceCenter: '0x9770d8b97A61520E008f648e7879c337D705D021',
      battleField: '0x8b85e49b5a59b113656Fa1A36efa9Aeb70DE27C1',
      purchaseFortune: '0xE1D0a4ae1DF871510d82144a282FF14bAcA8f2c0',
      usdc: '0x1E1d0765439d0d53ee40CC4fB454C2343c84342b',
      resources: '0xDa72eE0B52A5a6d5C989f0e817c9e2AF72e572B5',
      bank: '0x20C669035aA1245eFbAE95E8f0c2bBE93A6BBEB5',
      fortune: '0x119adb5E05e85d55690BC4Da7b37c06BfEcF2071'
    },
    tokens: {
      loot: {
        name: 'LOOT',
        symbol: 'LOOT',
        address: '0x2074D6a15c5F908707196C5ce982bd0598A666f9',
      },
      mad: {
        name: 'MAD',
        symbol: 'MAD',
        address: '0x4DEdeea250d2cbf54F0e156f0e9b55927094867E',
      },
      trpz: {
        name: 'TRPZ',
        symbol: 'TRPZ',
        address: '0x574deA750075145CcAD7f659A231721DFF9b5ef0',
      },
      bacc: {
        name: 'BACC',
        symbol: 'BACC',
        address: '',
      },
      vrse: {
        name: 'VRSE',
        symbol: 'VRSE',
        address: '0x100123d24a69bd8862da338129471c41e3ca8791',
      }
    },
    collections: rpcConfigTestnet.known_contracts,
    drops: rpcConfigTestnet.drops,
    auctions: rpcConfigTestnet.auctions,
    vendors: {
      transak: {
        url: 'https://global-stg.transak.com?apiKey=6bdef2f9-cfab-4d58-bb79-82794642a67e&isAutoFillUserData=true'
      }
    },
    tokenSale: {
      vipStart: 1682963727000,
      publicStart: 1682963727000,
      publicEnd: 1683579600000,
      memberCollections: [
        '0x3F1590A5984C89e6d5831bFB76788F3517Cdf034', // FM
        '0xe51377a260043381b8B525D33B9fFBC601A1469b', // Ryoshi Halloween
        '0xCF7aedEbC5223c4C620625A560300582B77D8719', // Ryoshi VIP
        '0xa937e814A2c5e99E9e86c4F34162c4F012F75a52', // Legacy VIP
        '0xa4C40C51de20d1e75E0ac83D6F043AF2f9C6Faa9', // SeaShrine VIP
        '0x7fb11087c21719C2e4f9Fc16408e8a97a46c92Ad', // Ryoshi Christmas
      ]
    }
  },
  [environments.local]: {
    chain: {
      name: 'Cronos Mainnet Beta',
      id: '25',
      symbol: 'CRO',
    },
    urls: {
      api: 'https://api.ebisusbay.com/',
      app: 'http://localhost:3000/',
      subgraph: 'https://cronos-graph.ebisusbay.com:8000/subgraphs/name/ebisusbay/',
      cms: 'http://localhost:4000/api/',
      explorer: 'https://cronoscan.com/',
      cdn: {
        bunnykit: 'https://ik-proxy.b-cdn.net/',
        ipfs: 'https://cdn.ltsglxy.network/ipfs/',
        arweave: 'https://cdn.ltsglxy.network/arweave/',
        proxy: 'https://cdn.ltsglxy.network/proxy/',
        storage: 'https://cdn-prod.ebisusbay.com/storage/',
        files: 'https://cdn-prod.ebisusbay.com/files/',
        app: 'https://cdn-prod.ebisusbay.com/'
      }
    },
    rpc: {
      read: 'https://rpc.ebisusbay.com/',
      write: 'https://evm.cronos.org/',
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
      cnsusd: '0xCF92513AA42bFf5cae6f28Ed5c4a108D9a328233',
      gaslessListing: '0x523d6f30c4aaca133daad97ee2a0c48235bff137',
      gdc: '0xe3e564252249ab55b47b84d6a934f4cbb94233a9',
      purchaseFortune: '0x04636c536537a8b7F05eDbA2cEBe1FaDd711D566',
      usdc: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59'
    },
    tokens: {
      loot: {
        name: 'LOOT',
        symbol: 'LOOT',
        address: '0xEd34211cDD2cf76C3cceE162761A72d7b6601E2B',
      },
      mad: {
        name: 'MAD',
        symbol: 'MAD',
        address: '0x212331e1435a8df230715db4c02b2a3a0abf8c61',
      },
      trpz: {
        name: 'TRPZ',
        symbol: 'TRPZ',
        address: '0x1Cc0B25BD5105CD8905f7e9cD174435D4C890E02',
      },
      bacc: {
        name: 'BACC',
        symbol: 'BACC',
        address: '',
      },
      vrse: {
        name: 'VRSE',
        symbol: 'VRSE',
        address: '0x2ba01269eafce04c8dccc4a9887884ab66e4bcb1',
      }
    },
    collections: rpcConfig.known_contracts,
    drops: rpcConfig.drops,
    auctions: rpcConfig.auctions,
    vendors: {
      transak: {
        url: 'https://global-stg.transak.com?apiKey=6bdef2f9-cfab-4d58-bb79-82794642a67e&cryptoCurrencyCode=CRO&isAutoFillUserData=true'
      }
    },
    tokenSale: {
      vipStart: 1682871200000,
      publicStart: 1682871200000,
      publicEnd: 1683579600000,
      memberCollections: [
        '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5', // FM
        '0x653DDF1Bb9995ecfcbDd411Dc3F9793127680B29', // Valentine
        '0x008d4Ab1D8fbC7823422a7cCFe3f1D73c09760Ab', // Holiday Hares
        '0xD961956B319A10CBdF89409C0aE7059788A4DaBb', // Cronies,
        '0x54E61e2043f894475D17D344250F1983f7F7e6D3', // Ryoshi Halloween
        '0xE49709A3B59d708f50AA3712F2E5a84b7707664C', // Ryoshi VIP
        '0xf54abdcba21e7a740f98307a561b605cb3fdcf63', // Legacy VIP
        '0x584a16905ca9cb10c0a2a9caa8e37a64de48c506', // SeaShrine VIP
        '0xe3Ef45955b507895779a6A8911bBc48E0E17B11C', // Ryoshi Christmas
      ]
    }
  }
};

export const imageDomains = [
  'ipfs.io',
  'app.ebisusbay.com',
  'files.ebisusbay.com',
  'gateway.ebisusbay.com',
  'ebisusbay.mypinata.cloud',
  'res.cloudinary.com',
  'ebisusbay.imgix.net',
  'metadata.cronos.domains',
  'ik.imagekit.io',
  'cdn.ebisusbay.com',
  'cdn.ebisusbay.biz',
];

/**
 * Retrieve a config value using "dot" notation.
 * Passing no key will return the entire config.
 * Note that the local env config falls back to production config for any fields not present
 *
 * @param key
 * @returns {null|*}
 */
export const appConfig = (key = '') => {
  const env = environments[currentEnv()];
  const fallbackEnv = environments.production;
  if (!env) return configData[fallbackEnv];

  const config = isLocalEnv() ?
    {...configData[environments.production], ...configData[environments.local]} :
    configData[env];

  if (!key) return config;

  const keys = key.split('.');

  return keys.reduce((o, i) => o[i], env ? config : configData[fallbackEnv]);
}

export const currentEnv = () => {
  return process.env.NEXT_PUBLIC_ENV ?? process.env.NODE_ENV ?? environments.production;
}

export const isLocalEnv = () => {
  return currentEnv() === environments.local;
}

export const isTestnet = () => {
  return currentEnv() === environments.testnet;
}

export const featureFlags = {
  [Features.AUCTION_OPTION_SALE]: false,          // Auction listing option
  [Features.GET_COLLECTION_NEW_ENDPOINT]: true,   // Paginated collections endpoint
  [Features.CMS_COLLECTIONS]: false,               // Collection editing
  [Features.VERIFIED_SWITCH_COLLECTION]: false,    // Filter verified collections
  [Features.VERIFIED_SWITCH_MARKETPLACE]: false,   // Filter verified in marketplace
  [Features.UNVERIFIED_WARNING]: false,            // Warning when buying from unverified collection
  [Features.REPORT_COLLECTION]: false,             // Report button on collection page
  [Features.NEW_CHAKRA_THEME]: false,             // Update theme
  [Features.GASLESS_LISTING]: true                //Gasless listings
}