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
      cms: 'https://cms.ebisusbay.com/api/',
      cmsSocket: 'wss://cms.ebisusbay.com/socket/',
      explorer: 'https://cronoscan.com/',
      cdn: {
        bunnykit: 'https://ik-proxy.b-cdn.net/',
        ipfs: 'https://cdn.ltsglxy.network/ipfs/',
        arweave: 'https://cdn.ltsglxy.network/arweave/',
        proxy: 'https://cdn.ltsglxy.network/proxy/',
        storage: 'https://cdn-prod.ebisusbay.com/storage/',
        files: 'https://cdn-prod.ebisusbay.com/files/',
        apng: 'https://ebisusbay-prod-no-op.b-cdn.net/',
        app: 'https://cdn-prod.ebisusbay.com/'
      },
      subgraph: {
        root: 'https://cronos-graph.ebisusbay.com:8000/subgraphs/name/ebisusbay/',
        ryoshiDynasties: 'ryoshi-dynasties-meeple',
        ryoshiPresale: 'ryoshi-presale',
        stakedOwners: 'staked-owners',
        staking: 'staking'
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
      vaultNft: ''
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
      },
      frtn: {
        name: 'FRTN',
        symbol: 'FRTN',
        address: '0xaF02D78F39C0002D14b95A3bE272DA02379AfF21',
      },
      bcro: {
        name: 'bCRO',
        symbol: 'bCRO',
        address: '0xebaceb7f193955b946cc5dd8f8724a80671a1f2f',
      },
      scratch: {
        name: 'Scratch',
        symbol: 'SCRATCH',
        address: '0x14fB0e7640e7fb7765CFA87cEc973ff5465d1c66'
      },
      candy: {
        name: 'Candy',
        symbol: 'CANDY',
        address: '0x06C04B0AD236e7Ca3B3189b1d049FE80109C7977'
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
      publicEnd: 1683586800000,
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
    },
    listings: {
      currencies : {
        available: ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch', 'candy'],
        global: ['cro', 'frtn'],
        nft: {
          '0xE49709A3B59d708f50AA3712F2E5a84b7707664C': ['frtn'],        // Ryoshi VIP
          '0x54E61e2043f894475D17D344250F1983f7F7e6D3': ['frtn'],        // Ryoshi Halloween
          '0xe3Ef45955b507895779a6A8911bBc48E0E17B11C': ['frtn'],        // Ryoshi Christmas
          '0xce3f4e59834b5B52B301E075C5B3D427B6884b3d': ['frtn'],        // Ryoshi Resources
          '0xcF7C77967FaD74d0B5104Edd476db2C6913fb0e3': ['frtn'],        // Land Deeds
          '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5': ['frtn'],        // EB FM/VIP
          '0x013f83434356c0a20698605eBAb337aab966AF88': ['frtn'],        // Fortune Guards
          '0x04636c536537a8b7F05eDbA2cEBe1FaDd711D566': ['frtn'],        // FortuneTeller
          '0xd87838a982a401510255ec27e603b0f5fea98d24': ['frtn'],        // Ryoshi Playing Cards
          '0x562e3e2d3f69c53d5a5728e8d7f977f3de150e04': ['frtn'],        // Ryoshi Tales
          '0xF098C2aD290f32c8666ace27222d3E65cECE43b9': ['frtn'],        // Ryoshi Heroes
          '0x8ac06d8CF5B371bf57723C050C1969f0f23Dbf98': ['cro', 'frtn', 'bcro'], // Project X Access Pass
          '0xa996aD2b9f240F78b063E47F552037658c4563d1': ['cro', 'frtn', 'bcro'], // Argonauts
          '0xc3cf2416a69351bf336ff671ad46d92efee4ea75': ['cro', 'frtn', 'bcro'], // Honorary Argonauts
          '0x0A37674F61a9345f32E277b15E3C9603cDe710f6': ['cro', 'frtn', 'bcro'], // Argonauts Mystery Pill
          '0xb67A1DE71c8506e4b6326d2a01c421F831b9754d': ['cro', 'frtn', 'bcro'], // Argonauts Odyssey
          '0x3A19A693a29b43BAE23F32B498d1A24D09F19878': ['cro', 'frtn', 'bcro'], // Atlantis Planets
          '0xCd8799DcFEe2d5a5bD8f26a3b4f30afb1099bCbc': ['cro', 'frtn', 'bcro'], // Atlantis Spaceships
          '0xd32c596994a07946699caea4e669c6e284a85958': ['cro', 'frtn', 'bcro'], // ArgoPetz
          '0xfa6888f9f3602e02507a2bbed661c8cb256949c8': ['cro', 'frtn', 'bcro'], // Atlantis Equipment
          '0xcbb22330413be9c5de7d80bba4b14ce99d9f3aba': ['cro', 'frtn', 'bcro'], // Atlantis Gemstones
          '0xdbFDf81D1fDD2e79e8ffaDE50c219452587e9488': ['frtn'],        // Cowz
          '0xA0edf26589AD4318DAb2354629541cfFd3e5EBDf': ['cro', 'frtn', 'bcro'], // Piggy Bank Finance
          '0x89dBC8Bd9a6037Cbd6EC66C4bF4189c9747B1C56': ['cro', 'frtn', 'mad'], // Mad Meerkat
          '0xDC5bBDb4A4b051BDB85B959eB3cBD1c8C0d0c105': ['cro', 'frtn', 'mad'], // MM Treehouse
          '0xA19bFcE9BaF34b92923b71D487db9D0D051a88F8': ['cro', 'frtn', 'mad'], // Mad Meerkat Degen
          '0x23721073592FB452C556fB9322bA4dF6A6675050': ['cro', 'frtn', 'mad'], // Mad Sacks
          '0x0aCDA31Cf1F301a7Eb8f988D47F708FbA058F8f5': ['cro', 'frtn', 'vrse'], // CronosVerse
          '0x130a6c2884325d302830179C691D328dDAd9b78C': ['cro', 'frtn', 'vrse'], // Crovilians
          '0x7Ac7D6d0d981C8A00637234f8026a4f78C5df14a': ['cro', 'frtn', 'vrse'], // Cro Snowmen
          '0x1eD88baF12Ec3fd8D2955B1b2a883e6E79a10828': ['cro', 'frtn', 'vrse'], // The CronosVerse Suites
          '0xaf038d14905409de31fb5577c460d18b1013e4f1': ['cro', 'frtn', 'vrse'], // The CronosVerse In-Game Assets
          '0xd0B45e7bFcc58C99203E60a363E2574e01B0a581': ['cro', 'frtn', 'bcro'], // 0xLuckless
          '0xad350404b1564c732f3ed6673cfd8bdf93206a97': ['cro', 'frtn', 'bcro'], // 0xLuckless v1.5
          '0xb9efdd70E93DbE4C700a229deCAf09e24C4Aef8C': ['cro', 'frtn', 'bcro'], // 0xLuckless v1.6
          '0x0d511FAA531d8D36aDE88daFcBbb9cE83Be42111': ['cro', 'frtn', 'bcro'], // 0xLuckless v2.0
          '0x5141E99523002317BE6D63214Bf300cBD8269bE6': ['cro', 'frtn', 'bcro'], // 0xluckless-v2-2
          '0x51084c32AA5ee43a0e7bD8220195da53b5c69868': ['cro', 'frtn', 'bcro'], // Trusted Cases
          '0x724900a57ED516ba023b1F5F86A92E222BC32D02': ['cro', 'frtn', 'bcro'], // Chefz Army
          '0x3fF260ce7A8dFCaDAF5E880137ee1750ceae9889': ['cro', 'frtn', 'bcro'], // The Rainbowland LANDs
          '0x9ac290d92ba63e3e741e5afd0b9da3b78c50fbb7': ['cro', 'frtn', 'bcro'], // Mythical Mafia
          '0xE46837d6Bf5b6F6C90C1B170aECBFDEc0E4425ea': ['cro', 'frtn', 'bcro'], // DegenzSkulls
          '0xb650279e3d726B0c75C984cAA55341cB87A7F501': ['cro', 'frtn', 'scratch'], // Boomer Squad
          '0x3D03292D428fd7d6C81a6E76b4A333A3d8a0E296': ['cro', 'frtn', 'scratch'], // Zoomer Squad
          '0xacDA8C2818E7a120acd0395BD1f3EF562971A7F8': ['cro', 'frtn', 'scratch'], // Zoomer Squad - Playground Game Tokens: Season 1
          '0x8Dd9975c78423480a6188F55B0767fbF4478b001': ['cro', 'frtn', 'scratch'], // Boomer Squad - Boom Rooms
          '0x8Bff49Fc633e0A3eB879449B67500812B27a97B7': ['cro', 'frtn', 'scratch'], // Boomer Squad - Room Components: Activity
          '0x995d38004314836E48485D5fE328ebC17046FE68': ['cro', 'frtn', 'scratch'], // Boomer Squad - Room Components: Bed
          '0xc6a1f1034235F3B389bAb28B75719B3475Edf4AD': ['cro', 'frtn', 'scratch'], // Boomer Squad - Room Components: Building
          '0xf27205535932c7490F227F5bED7e5f7212b455bb': ['cro', 'frtn', 'scratch'], // Boomer Squad - Room Components: Couch
          '0xEa71F7AFA9eEEee5De16ee64b76255E216952511': ['cro', 'frtn', 'scratch'], // Boomer Squad - Room Components: Desk
          '0xAE40d175F2cf9C6777c0E0830E17211c4F5A66D0': ['cro', 'frtn', 'scratch'], // Boomer Squad - Room Components: Door
          '0x18550Cc44779EA72D6Fe6389D08D8Ab234f754CB': ['cro', 'frtn', 'scratch'], // Boomer Squad - Room Components: Entertainment
          '0x48D20305Ad156e44A0f93c3312A876E56c0e9f7E': ['cro', 'frtn', 'scratch'], // Boomer Squad - Room Components: Pet
          '0xb7109F93d780FD3f01eB7EbB0FE9436449F0D8EF': ['cro', 'frtn', 'scratch'], // Boomer Squad - Room Components: Table
          '0xc5B294B557402f8706aED487e155773756A9c400': ['cro', 'frtn', 'scratch'], // Boomer Squad - Room Components: Window
          '0x4AA9F792b51954A8903967375e854Ed7EE4bCBf0': ['cro', 'frtn', 'scratch'], // Boomer Squad - Room Components: Cosmetics
          '0xccE7B3067765FfbA74744C8dB4C1Cd58Bf8D77e7': ['cro', 'frtn', 'scratch'], // Zoomer Squad - Playground Game Tokens: Season 2
          '0x1220b4E081c04f345C572536EA531Ed2AdE691BD': ['cro', 'frtn', 'bcro'], // AxOl Elites
          '0x1368a855545724B165F8c3e466ec30e1fB2A3683': ['cro', 'frtn', 'bcro'], // Football Squares S2
          '0x5c18d5eb211203eb80b591aa71a269b1e16e9eba': ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch'], // Ballies: The Gear v2
          '0xE1049178296ce004996AFb16B0816c5A95aC8482': ['cro', 'frtn', 'candy'], // Bored Candy
          '0xe4ab77ed89528d90e6bcf0e1ac99c58da24e79d5': ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch'], // CRO CROW
          '0x65AB0251d29c9C473c8d01BFfa2966F891fB1181': ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch'], // MAD CROW
          '0x937879726455531dB135F9b8D88F38dF5D4Eb13b': ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch'], // CRO CROW NEST
          '0x0f1439a290e86a38157831fe27a3dcd302904055': ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch'], // CROW PUNKS
          '0x13d13e2410A34Bfe5502D50ea4FCFBd591D7589E': ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch'], // Wrapped Cronos Punk
          '0xd33CFeF82377fef83703B9D84151a477B08Ab3b8': ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch'], // CRO CROW Airdrops
          '0xccc777777ac85999fc9fe355f25cd908060ec9ea': ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch'], // CRO CROW Customs
          '0x3d7777ff1908B54b57038A2556d6904f71468e2D': ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch'], // 3D CROW
        }
      }
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
      cms: 'https://cms.ebisusbay.biz/api/',
      cmsSocket: 'wss://cms.ebisusbay.biz/socket/',
      explorer: 'https://cronoscan.com/',
      cdn: {
        bunnykit: 'https://ik-proxy.b-cdn.net/',
        ipfs: 'https://cdn.ltsglxy.network/ipfs/',
        arweave: 'https://cdn.ltsglxy.network/arweave/',
        proxy: 'https://cdn.ltsglxy.network/proxy/',
        storage: 'https://cdn-dev.ebisusbay.biz/storage/',
        files: 'https://cdn-dev.ebisusbay.biz/files/',
        apng: 'https://ebisusbay-prod-no-op.b-cdn.net/',
        app: 'https://cdn-dev.ebisusbay.biz/'
      },
      subgraph: {
        root: 'https://cronos-graph.ebisusbay.com:8000/subgraphs/name/ebisusbay/',
        ryoshiDynasties: 'ryoshi-dynasties-meeple',
        ryoshiPresale: 'ryoshi-presale',
        stakedOwners: 'staked-owners',
        staking: 'staking'
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
      vaultNft: ''
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
      },
      frtn: {
        name: 'FRTN',
        symbol: 'FRTN',
        address: '0xaF02D78F39C0002D14b95A3bE272DA02379AfF21',
      },
      bcro: {
        name: 'bCRO',
        symbol: 'bCRO',
        address: '0xebaceb7f193955b946cc5dd8f8724a80671a1f2f',
      },
      scratch: {
        name: 'Scratch',
        symbol: 'SCRATCH',
        address: '0x14fB0e7640e7fb7765CFA87cEc973ff5465d1c66'
      },
      candy: {
        name: 'Candy',
        symbol: 'CANDY',
        address: '0x06C04B0AD236e7Ca3B3189b1d049FE80109C7977'
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
      publicEnd: 1683586800000,
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
    },
    listings: {
      currencies : {
        available: ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch'],
        global: ['cro', 'frtn'],
        nft: {
          '0xE49709A3B59d708f50AA3712F2E5a84b7707664C': ['frtn'],        // Ryoshi VIP
          '0x54E61e2043f894475D17D344250F1983f7F7e6D3': ['frtn'],        // Ryoshi Halloween
          '0xe3Ef45955b507895779a6A8911bBc48E0E17B11C': ['frtn'],        // Ryoshi Christmas
          '0xce3f4e59834b5B52B301E075C5B3D427B6884b3d': ['frtn'],        // Ryoshi Resources
          '0xcF7C77967FaD74d0B5104Edd476db2C6913fb0e3': ['frtn'],        // Land Deeds
          '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5': ['frtn'],        // EB FM/VIP
          '0x013f83434356c0a20698605eBAb337aab966AF88': ['frtn'],        // Fortune Guards
          '0x04636c536537a8b7F05eDbA2cEBe1FaDd711D566': ['frtn'],        // FortuneTeller
          '0x1eca64187AD00A86360D62f1CD4409Dc1A136B45': ['cro', 'frtn'], // Everybody's Not Friends
        }
      }
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
      cms: 'https://testcms.ebisusbay.biz/api/',
      // cms: "http://localhost:4000/api/",
      cmsSocket: 'wss://testcms.ebisusbay.biz/socket/',
      explorer: 'https://testnet.cronoscan.com/',
      cdn: {
        bunnykit: 'https://ik-proxy.b-cdn.net/',
        ipfs: 'https://cdn-test.ltsglxy.network/ipfs/',
        arweave: 'https://cdn-test.ltsglxy.network/arweave/',
        proxy: 'https://cdn-test.ltsglxy.network/proxy/',
        storage: 'https://cdn-test.ebisusbay.biz/storage/',
        files: 'https://cdn-test.ebisusbay.biz/files/',
        apng: 'https://ebisusbay-test-no-op.b-cdn.net/',
        app: 'https://cdn-test.ebisusbay.biz/'
      },
      subgraph: {
        root: 'https://testcronos-graph.ebisusbay.biz:8000/subgraphs/name/ebisusbay/',
        ryoshiDynasties: 'ryoshi-dynasties',
        ryoshiPresale: 'ryoshi-presale',
        stakedOwners: 'staked-owners',
        staking: 'staking'
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
      vaultNft: '0xa62F0C192691f5f17EBc704E1ad77ca4Ba687f74'
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
      },
      frtn: {
        name: 'FRTN',
        symbol: 'FRTN',
        address: '0x119adb5E05e85d55690BC4Da7b37c06BfEcF2071',
      },
      bcro: {
        name: 'bCRO',
        symbol: 'bCRO',
        address: '0x0A3cAaC2F607E38bF1C6533B9CB46aFAD918dE16',
      },
      scratch: {
        name: 'Scratch',
        symbol: 'SCRATCH',
        address: '0x14fB0e7640e7fb7765CFA87cEc973ff5465d1c66'
      },
      candy: {
        name: 'Candy',
        symbol: 'CANDY',
        address: '0x06C04B0AD236e7Ca3B3189b1d049FE80109C7977'
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
      publicEnd: 1683586800000,
      memberCollections: [
        '0x3F1590A5984C89e6d5831bFB76788F3517Cdf034', // FM
        '0xe51377a260043381b8B525D33B9fFBC601A1469b', // Ryoshi Halloween
        '0xCF7aedEbC5223c4C620625A560300582B77D8719', // Ryoshi VIP
        '0xa937e814A2c5e99E9e86c4F34162c4F012F75a52', // Legacy VIP
        '0xa4C40C51de20d1e75E0ac83D6F043AF2f9C6Faa9', // SeaShrine VIP
        '0x7fb11087c21719C2e4f9Fc16408e8a97a46c92Ad', // Ryoshi Christmas
      ]
    },
    listings: {
      currencies : {
        available: ['cro', 'frtn', 'vrse'],
        global: ['cro', 'frtn'],
        nft: {
          '0xCF7aedEbC5223c4C620625A560300582B77D8719': ['cro', 'frtn'], // Ryoshi VIP
          '0xe51377a260043381b8B525D33B9fFBC601A1469b': ['frtn', 'vrse'],
          '0x7fb11087c21719C2e4f9Fc16408e8a97a46c92Ad': ['frtn'],
          '0xda72ee0b52a5a6d5c989f0e817c9e2af72e572b5': ['frtn'],
          '0x1189C0A75e7965974cE7c5253eB18eC93F2DE4Ad': ['frtn'],
          '0x3F1590A5984C89e6d5831bFB76788F3517Cdf034': ['frtn'],
          '0x04Bd856E96127f3ef3C45864BeAEe26F5Df5066a': ['frtn'],
          '0xE1D0a4ae1DF871510d82144a282FF14bAcA8f2c0': ['frtn'],
          '0xa937e814A2c5e99E9e86c4F34162c4F012F75a52': ['cro', 'frtn'],
          '0xa4C40C51de20d1e75E0ac83D6F043AF2f9C6Faa9': ['cro', 'frtn'],
          '0xe9DCa9E03F31CBD538A19a89eA2cA3684AF2788f': ['cro', 'frtn']
        }
      }
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
      cms: 'https://cms.ebisusbay.com/api/',
      cmsSocket: 'wss://cms.ebisusbay.com/socket/',
      explorer: 'https://cronoscan.com/',
      cdn: {
        bunnykit: 'https://ik-proxy.b-cdn.net/',
        ipfs: 'https://cdn.ltsglxy.network/ipfs/',
        arweave: 'https://cdn.ltsglxy.network/arweave/',
        proxy: 'https://cdn.ltsglxy.network/proxy/',
        storage: 'https://cdn-prod.ebisusbay.com/storage/',
        files: 'https://cdn-prod.ebisusbay.com/files/',
        apng: 'https://ebisusbay-prod-no-op.b-cdn.net/',
        app: 'https://cdn-prod.ebisusbay.com/'
      },
      subgraph: {
        root: 'https://cronos-graph.ebisusbay.com:8000/subgraphs/name/ebisusbay/',
        ryoshiDynasties: 'ryoshi-dynasties-meeple',
        ryoshiPresale: 'ryoshi-presale',
        stakedOwners: 'staked-owners',
        staking: 'staking'
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
      vaultNft: '0xa62F0C192691f5f17EBc704E1ad77ca4Ba687f74'
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
      },
      frtn: {
        name: 'FRTN',
        symbol: 'FRTN',
        address: '0xaF02D78F39C0002D14b95A3bE272DA02379AfF21',
      },
      bcro: {
        name: 'bCRO',
        symbol: 'bCRO',
        address: '0xebaceb7f193955b946cc5dd8f8724a80671a1f2f',
      },
      scratch: {
        name: 'Scratch',
        symbol: 'SCRATCH',
        address: '0x14fB0e7640e7fb7765CFA87cEc973ff5465d1c66'
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
      publicEnd: 1683586800000,
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
    },
    listings: {
      currencies : {
        available: ['cro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch'],
        global: ['cro', 'frtn'],
        nft: {
          '0xE49709A3B59d708f50AA3712F2E5a84b7707664C': ['frtn'],        // Ryoshi VIP
          '0x54E61e2043f894475D17D344250F1983f7F7e6D3': ['frtn'],        // Ryoshi Halloween
          '0xe3Ef45955b507895779a6A8911bBc48E0E17B11C': ['frtn'],        // Ryoshi Christmas
          '0xce3f4e59834b5B52B301E075C5B3D427B6884b3d': ['frtn'],        // Ryoshi Resources
          '0xcF7C77967FaD74d0B5104Edd476db2C6913fb0e3': ['frtn'],        // Land Deeds
          '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5': ['frtn'],        // EB FM/VIP
          '0x013f83434356c0a20698605eBAb337aab966AF88': ['frtn'],        // Fortune Guards
          '0x04636c536537a8b7F05eDbA2cEBe1FaDd711D566': ['frtn'],        // FortuneTeller
        }
      }
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
  [Features.CMS_COLLECTIONS]: false,               // Collection editing
  [Features.VERIFIED_SWITCH_COLLECTION]: false,    // Filter verified collections
  [Features.VERIFIED_SWITCH_MARKETPLACE]: false,   // Filter verified in marketplace
  [Features.UNVERIFIED_WARNING]: false,            // Warning when buying from unverified collection
  [Features.REPORT_COLLECTION]: false,             // Report button on collection page
}