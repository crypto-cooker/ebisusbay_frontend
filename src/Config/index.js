import rpcConfig from '../Assets/networks/rpc_config.json';
import rpcConfigDev from '../Assets/networks/rpc_config_dev.json';
import rpcConfigTestnet from '../Assets/networks/rpc_config_testnet.json';
import _ from 'lodash';
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
      cdn: 'https://cdn.ebisusbay.com/',
      subgraph: 'https://graph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/',
      cms: 'https://cms.ebisusbay.com/api/',
      explorer: 'https://cronoscan.com/',
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
      cnsusd: '0xCF92513AA42bFf5cae6f28Ed5c4a108D9a328233'
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
      koi: {
        name: 'KOI',
        symbol: 'KOI',
        address: '',
      },
      dbf: {
        name: 'DBF',
        symbol: 'DBF',
        address: '',
      },
    },
    collections: rpcConfig.known_contracts,
    drops: rpcConfig.drops,
    auctions: rpcConfig.auctions,
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
      cdn: 'https://cdn.ebisusbay.biz/test/',
      subgraph: 'https://graph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/',
      cms: 'https://cms.ebisusbay.biz/api/',
      explorer: 'https://cronoscan.com/',
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
      cnsusd: '0xCF92513AA42bFf5cae6f28Ed5c4a108D9a328233'
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
      koi: {
        name: 'KOI',
        symbol: 'KOI',
        address: '',
      },
      dbf: {
        name: 'DBF',
        symbol: 'DBF',
        address: '',
      },
    },
    collections: rpcConfigDev.known_contracts,
    drops: rpcConfigDev.drops,
    auctions: rpcConfigDev.auctions,
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
      cdn: 'https://cdn.ebisusbay.biz/test/',
      subgraph: 'https://testgraph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/',
      cms: 'https://testcms.ebisusbay.biz/api/',
      explorer: 'https://testnet.cronoscan.com/',
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
      bundle: '0x8522B1243c93f2fc8012bD21b86f48B4f482E3b6',
      cnsusd: '0x263818f9693548446A41ad7025923612b490CB0D'
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
      koi: {
        name: 'KOI',
        symbol: 'KOI',
        address: '',
      },
      dbf: {
        name: 'DBF',
        symbol: 'DBF',
        address: '',
      },
    },
    collections: rpcConfigTestnet.known_contracts,
    drops: rpcConfigTestnet.drops,
    auctions: rpcConfigTestnet.auctions,
  },
  [environments.local]: {
    urls: {
      api: 'https://api.ebisusbay.com/',
      cms: 'http://localhost:4000/api/',
    },
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
export const appConfig = (key) => {
  const env = environments[currentEnv()];
  const fallbackEnv = environments.production;
  if (!env) return configData[fallbackEnv];

  const config = isLocalEnv() ?
    _.merge(configData[environments.production], configData[environments.local]) :
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

export const featureFlags = {
  [Features.AUCTION_OPTION_SALE]: false,          // Auction listing option
  [Features.CMS_NOTIFICATIONS]: true,             // Notifications
  [Features.CMS_FULL_PROFILES]: true,             // User Profiles
  [Features.GET_COLLECTION_NEW_ENDPOINT]: false,   // Paginated collections endpoint
  [Features.CMS_COLLECTIONS]: false,               // Collection editing
  [Features.VERIFIED_SWITCH_COLLECTION]: false,    // Filter verified collections
  [Features.VERIFIED_SWITCH_MARKETPLACE]: false,   // Filter verified in marketplace
  [Features.INFINITE_QUERY_COLLECTION]: false,     // Paginated collections endpoint
  [Features.UNVERIFIED_WARNING]: false,            // Warning when buying from unverified collection
  [Features.REPORT_COLLECTION]: false,             // Report button on collection page
  [Features.NEW_CHAKRA_THEME]: false,             // Update theme
  [Features.GLOBAL_SEARCH]: true,                // Global search bar
  [Features.BUNDLES]: false,                      // Bundles
  [Features.GASLESS_LISTING]: false                //Gasless listings
}