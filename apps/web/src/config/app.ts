import {ChainId} from "@pancakeswap/chains";
import {Address} from "viem";
import chainConfigs, {SupportedChainId} from "@src/config/chains";

export enum AppEnvironment {
  PRODUCTION = 'production',
  TESTNET = 'testnet',
  DEVELOPMENT = 'development',
  LOCAL = 'local'
}

type AppConfigMap = {
  [K in AppEnvironment]: AppEnvironmentConfig;
};

type PartialAppConfig = {
  [P in keyof AppEnvironmentConfig]?: AppEnvironmentConfig[P] extends object ? Partial<AppEnvironmentConfig[P]> : AppEnvironmentConfig[P];
};

type AppCurrencies = {
  [K in SupportedChainId]: {
    global: string[];
    marketplace: {
      available: string[];
      nft: { [key: string]: string[]; };
    };
    deals: string[];
  };
};

interface AppEnvironmentConfig {
  inherits?: AppEnvironment,
  defaultChainId: SupportedChainId,
  urls: {
    api: string,
    app: string,
    cms: string,
    cmsSocket: string,
    explorer: string,
    cdn: {
      bunnykit: string,
      ipfs: string,
      arweave: string,
      proxy: string,
      storage: string,
      files: string,
      apng: string,
      app: string
    }
  }
  vendors: {
    transak: {
      apiKey: string,
      contractId: string,
      url: string,
      env: 'PRODUCTION' | 'STAGING',
      filler: string,
      postUrl: string
    }
  },
  currencies: AppCurrencies
}

const remoteConfigs: Omit<AppConfigMap, AppEnvironment.LOCAL> = {
  [AppEnvironment.PRODUCTION]: {
    defaultChainId: ChainId.CRONOS,
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
      }
    },
    vendors: {
      transak: {
        apiKey: 'c5d03d27-59a6-49dd-9de3-5dad9471d105',
        contractId: '665802a1f597abb8f3d8bdc0',
        url: 'https://global.transak.com?apiKey=c5d03d27-59a6-49dd-9de3-5dad9471d105&isAutoFillUserData=true',
        env: 'PRODUCTION',
        filler: '0xAb88cd272863b197B48762EA283f24a13f6586Dd',
        postUrl: 'https://api.transak.com/cryptocoverage/api/v1/public/one-click-protocol/nft-transaction-id'
      }
    },
    currencies : {
      [ChainId.CRONOS]: {
        global: ['cro', 'frtn'],
        marketplace: {
          available: [
            'cro',
            'wcro',
            'frtn',
            'bcro',
            'mad',
            'vrse',
            'scratch',
            'candy',
            'emit',
            'icy',
            'coom',
            'fftb',
            'mery',
            'lwv'
          ],
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
            '0x1220b4E081c04f345C572536EA531Ed2AdE691BD': ['cro', 'frtn', 'bcro', 'fftb'], // AxOl Elites
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
            '0x9b72f7d5aecee857cc3d1a1a3357aff0e342d0a8': ['cro', 'frtn', 'emit'], // Time Machine 101
            '0x146cf0ee7b6b986769782ea832e8327f9dff55e7': ['cro', 'frtn', 'emit'], // Tata's Guardians
            '0x482eBe3063ED2d2281AAfec31941705787432A1A': ['cro', 'frtn', 'emit'], // Time Machine 102: The Travellers
            '0x13C2803c4e0d0e727a6b1820EcC814550a9D7A35': ['cro', 'frtn', 'emit'], // Time Ship Blueprints
            '0x55c8f67e6D3f037297Daf94AD2bCC67CC477BEa9': ['cro', 'frtn', 'emit'], // Time Troops
            '0x1c4924f36Fe60374DB6ac206894D82F03d522933': ['cro', 'frtn', 'emit'], // Time Creatures Class A
            '0x15Af2503a934D211A1936684fEd986E7E3f417db': ['cro', 'frtn', 'emit'], // Time Creatures Class B
            '0x6cC790CAE45EC057f9637784279A475CC91cf517': ['cro', 'frtn', 'emit'], // Animated Time Gods
            '0xD0761503c7675Ab7f34aA06126F6DBDBe0b42645': ['cro', 'frtn', 'emit'], // Time Commanders
            '0x4025Ce5e92F2BA3E8aA7B46eE0A1b99F51F3C475': ['cro', 'frtn', 'emit'], // Time Creature Ships
            '0xB049eDd7E9580C0BBE708c1A3374C74066FF9E7F': ['cro', 'frtn', 'emit'], // Time Cronos Planets
            '0xfF567a62d7BF2CF984F02175C8bd485E3C4E2c0e': ['cro', 'frtn', 'emit'], // Time Ship Components
            '0x739b5380156Fa14C7956145048d52dF27EDedfCE': ['cro', 'frtn', 'emit'], // Tata's Twisted Tonics
            '0xb76415D33268391bfaE2E671f45CeDAD9bC99dc9': ['cro', 'frtn', 'emit'], // Animated Guardians
            '0xCF926cB69b860Da8c33a2a601217856536ed0bcA': ['cro', 'frtn', 'emit'], // Animated Time Machine 102s
            '0x975238Ce3c593060a9b549e1654dC992f0Bc11aC': ['cro', 'frtn', 'emit'], // Power Tonics
            '0x87e04f1d64619994a5320450E19C184a2dDE09c7': ['cro', 'frtn', 'emit'], // CroTops
            '0x35B832bE9546fCad67526Be2801228194250378A': ['cro', 'frtn', 'emit'], // Time Base
            '0x127b2ac798F961D0EbA3B10DD7B550cAa9a8E773': ['cro', 'frtn', 'emit'], // Time Base
            '0xF87A517A5CaecaA03d7cCa770789BdB61e09e05F': ['cro'], // CroSkill Brand Start
            '0xbf4E430cD0ce8b93d4760958fe4ae66cDaCDB6c6': ['cro'],
            '0x14e9ef197C0bfaf7C1328ebed7151f53616Af3C5': ['cro'],
            '0x6d54590Ed6950EcD3987778c004d4773a7e99dAC': ['cro'],
            '0x5DD5d3140Fe619Ef8F4655383283BB555E219A27': ['cro'],
            '0x635D66972453E20F5f2EA2787361C752232F07D2': ['cro'],
            '0x27fE0fA269DeAC471aC07014d6ED9973ce69bd96': ['cro'],
            '0xB77959DC7a12F7549ACC084Af01259Fc48813c89': ['cro'],
            '0x54655D5468f072D5bcE1577c4a46F701C28a41A7': ['cro'],
            '0x31B378ac025a341839CD81C4D29A8457324D3EbC': ['cro'],
            '0x77aE45b634a829B002293E554fA67ADC0EB78Bc2': ['cro'],
            '0xed9BDf3E103332C853DDb9933BA3B45acfDB9B2e': ['cro'],
            '0xB9eCFF7e01a48C434a3B8A034906e4b34Da62f90': ['cro'],
            '0xB929D3002208f405180D3C07616F88EDa45F3e14': ['cro'],
            '0x508378E99F5527Acb6eB4f0fc22f954c5783e5F9': ['cro'],
            '0xA9448e3e496f75488306195F34e49a7fCE5cbD0c': ['cro'],
            '0x0977Ee79F7f6BedE288DD0264C77B4A1b32C48e8': ['cro'],
            '0x400e237c4F88e5728E0D6088315DeCD856a10EDd': ['cro'], // CroSkill Brand End
            '0x0Ea3bE4Ca12b7B43e974264a210f4de0e273A027': ['icy'], // ICY Brand
            '0xbEa2F7082ad9B5e1138D5e94E00fbc63d7EC8612': ['icy'],
            '0x07174D2B657b2243E5C11Df2Cd3D4afD1E45DBBb': ['icy'],
            '0x4F68b2F90091B6C6012b487Faa7D267FC0Db86dE': ['icy'],
            '0x45008e129A33368119757496DA762284ff8e2565': ['icy'],
            '0x7677cbE702Ff3d0e66d3BaC0fD71Cb641A276Ae0': ['icy'],
            '0xccc598ef1b4d17d9f44a889eee38c8de53f5df00': ['icy'], // ICY Brand End
            '0x6A7808f1e84bB173D6fC53Efd9Ebc6E56380AB5E': ['cro'], // Cronos Chickens
            '0x5dd80779025679D06C9A175a7090FEEe92eA70aa': ['frtn'], // Strategy Series Vol.1,
            '0xc7c010eCc6b7704a110fFCc7A9b2F0DfC4ee8845': ['cro', 'frtn', 'coom'], // Coom Cats
            '0x7577A788247c77569794dFCd86B47d38b9347E95': ['cro', 'frtn', 'coom'], // Coom Cats VIP
            '0x08FB1f6625d034019f2F6a3E70bab2FaA55CA068': ['cro', 'frtn', 'fftb'], // Skully-X
            '0xca00aba7689e3c0f9f74e1f8d82e61c04c787734': ['cro', 'frtn', 'fftb'], // Cr00ts
            '0x0f41Ad1a8A98Cf0Be5880253d6479b5Af9071071': ['cro', 'frtn', 'fftb'], // Cr00ts-X
            '0x8333624EEb54E0c9FF6C96D41645d60463CE9b22': ['cro', 'frtn', 'fftb'], // Baby Wyverns
            '0x776BeF0d43Acdc2b49c6885C6d15F9A5308252b2': ['cro', 'frtn', 'fftb'], // Baby Monsters
            '0x13Eb301c0AC03D777dE915423B34195D56C14a21': ['cro', 'frtn', 'fftb'], // The Wyverns
            '0xb242399f3f52fcfa8b09d7d6e4C3DBe84D0644fc': ['cro', 'frtn', 'fftb'], // Tough Lions
            '0x63dF2BB08bcc9807c0ef5BD0C169FF3b4b289543': ['cro', 'frtn', 'fftb'], // Evolution Hogs
            '0xF257E02D8c5c9a405589F99859f8b28b0Ccc5474': ['cro', 'frtn', 'fftb'], // Hype Hogs
            '0xfa8cdd2925a21c78716dFcD20122A57B8eBBECF9': ['cro', 'frtn', 'fftb'], // ChiVerse Online
            '0xC5Fe01a64e63EDefC40d620A5716B90c52D444f9': ['cro', 'frtn', 'fftb'], // BOB Spaceships
            '0x257f30fbD890840FA00c2e0f043cF5Ad9A631546': ['cro', 'frtn', 'fftb'], // Alpha Invitations
            '0xaE843862c98968847273848D4947b312E93D660C': ['cro', 'frtn', 'fftb'], // BSD/LSD
            '0x50a6aA29b9E99c9B8b81069a12EeFeDAC85919B7': ['cro', 'frtn', 'fftb'], // Cronos Apes
            '0x688c9c95a7fF91cF1559cdaf098b3038Bc538BE1': ['cro', 'frtn', 'fftb'], // Cronos Baby Apes
            '0x7D89dCC2f35403cFD9B07475826F9a14a340d06A': ['cro', 'frtn', 'fftb'], // Cronos Mutant Apes
            '0x33e0b91c773D500FB4De87957740f5D200Be7371': ['cro', 'frtn', 'fftb'], // Cronos Mutant Apes - Serums
            '0xeFc73c41EF829C0B87E3245aCF033b867cCD0F84': ['cro', 'frtn', 'fftb'], // D.G.Pals Genesis I
            '0x86aabe05e885108a8797314e817488c26f0601a1': ['cro', 'frtn', 'fftb'], // D.G.P. Unlimited
            '0xa072bB6F648a4271ba9CbaF1319Fc373eF907f29': ['cro', 'frtn', 'fftb'], // D.G.Pals Limited and Special Edition
            '0x500cdf7a96a612BEb9e018035a3E89180a6732fE': ['cro', 'frtn', 'fftb'], // D.G.Pals Limited Edition
            '0x70D3ee9b000f9210C1Ce1bD2A80cBAEBe209aeb7': ['cro', 'frtn', 'fftb'], // D.G.Pals Equipment
            '0x8fb4483d92c045336974c4f8c96ad9b1fae8ac64': ['cro', 'frtn', 'fftb'], // D.G.Pals Special Edition
            '0x0B3A229aBf88abd08C2fA1f2B6c1bB815bEaf5d5': ['cro', 'frtn', 'fftb'], // The Cronos Eagles
            '0x561ffeca612917ccb8900993e9637a9e4a047e76': ['cro', 'frtn', 'mery'], // Mistery on CRO
            '0x903B9a9d58742d0699fbd5b0AC7C9C4000B7ce43': ['cro', 'frtn', 'fftb'], // Monkey Of Anarkey
            '0x8de18EB0bD2C6A6B66bf58e669aD010544937757': ['cro', 'frtn', 'fftb'], // Monkey Of Anarkey License NFT
            '0xA348E80d3943E097d373b0aC712EFeB700191FE6': ['cro', 'frtn', 'fftb'], // MoA Motorcycles
            '0xd4E29bdba77c948b04C3ACd67C1dAC17264d2983': ['cro', 'frtn', 'fftb'], // Degen Royale: Guns on Cronos
            '0x0521217B36a1482E6798692687f836c68c7F3837': ['cro', 'frtn', 'fftb'], // Sp00kies
            '0x7C144DBF04cf991d932bf6DC404C8B37c8807946': ['cro', 'frtn', 'fftb'], // Elf Citizens
            '0x7aEBFd662494299CE53feb533BFE80a749e656BC': ['cro', 'frtn', 'lwv'], // Degen Ape Cronos Club
            '0x25ea0f16e3a52db95e31f8514917a0610270e7cd': ['cro', 'frtn', 'lwv'], // TeenDACC
            '0x3fe29ffa527d712a5b202ddaeff714c12cb6aff5': ['cro', 'frtn', 'lwv'], // Snap!
            '0x4Ffca5C2790ef342c1EF25d48D1FFc8a2B4b1D9A': ['cro', 'frtn', 'lwv'], // Lightwave Booster
          },
        },
        deals: [
          'ryoshi',
          'frtn',
          'wcro',
          'bcro',
          'mad',
          'vrse',
          'scratch',
          'candy',
          'emit',
          'icy',
          'caw',
          'usdc',
          'trpz',
          'grve',
          'lcro',
          'fish',
          'aiko',
          'coom'
        ]
      },
      [ChainId.CRONOS_TESTNET]: {
        global: [],
        marketplace: {
          available: [],
          nft: {}
        },
        deals: []
      },
      [ChainId.CRONOS_ZKEVM]: {
        global: ['zkcro', 'frtn', 'vusd', 'veth'],
        marketplace: {
          available: ['zkcro', 'frtn', 'vusd', 'veth'],
          nft: {
            '0x46055078a40358c27f7850d81f29ec857342318f': ['frtn'] // Moggy Money Brokers
          }
        },
        deals: []
      },
      [ChainId.CRONOS_ZKEVM_TESTNET]: {
        global: [],
        marketplace: {
          available: [],
          nft: {}
        },
        deals: []
      }
    }
  },
  [AppEnvironment.DEVELOPMENT]: {
    defaultChainId: ChainId.CRONOS,
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
    },
    vendors: {
      transak: {
        apiKey: 'c5d03d27-59a6-49dd-9de3-5dad9471d105',
        contractId: '665802a1f597abb8f3d8bdc0',
        url: 'https://global-stg.transak.com?apiKey=6bdef2f9-cfab-4d58-bb79-82794642a67e&isAutoFillUserData=true',
        env: 'PRODUCTION',
        filler: '0xAb88cd272863b197B48762EA283f24a13f6586Dd',
        postUrl: 'https://api-stg.transak.com/cryptocoverage/api/v1/public/one-click-protocol/nft-transaction-id'
      }
    },
    currencies: {
      [ChainId.CRONOS]: {
        global: ['cro', 'frtn'],
        marketplace: {
          available: ['cro', 'wcro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch', 'candy', 'ttt', 'icy'],
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
            '0x9b72f7d5aecee857cc3d1a1a3357aff0e342d0a8': ['cro', 'frtn', 'ttt'], // Time Machine 101
            '0x146cf0ee7b6b986769782ea832e8327f9dff55e7': ['cro', 'frtn', 'ttt'], // Tata's Guardians
            '0x482eBe3063ED2d2281AAfec31941705787432A1A': ['cro', 'frtn', 'ttt'], // Time Machine 102: The Travellers
            '0x13C2803c4e0d0e727a6b1820EcC814550a9D7A35': ['cro', 'frtn', 'ttt'], // Time Ship Blueprints
            '0x55c8f67e6D3f037297Daf94AD2bCC67CC477BEa9': ['cro', 'frtn', 'ttt'], // Time Troops
            '0x1c4924f36Fe60374DB6ac206894D82F03d522933': ['cro', 'frtn', 'ttt'], // Time Creatures Class A
            '0x15Af2503a934D211A1936684fEd986E7E3f417db': ['cro', 'frtn', 'ttt'], // Time Creatures Class B
            '0x6cC790CAE45EC057f9637784279A475CC91cf517': ['cro', 'frtn', 'ttt'], // Animated Time Gods
            '0xD0761503c7675Ab7f34aA06126F6DBDBe0b42645': ['cro', 'frtn', 'ttt'], // Time Commanders
            '0x4025Ce5e92F2BA3E8aA7B46eE0A1b99F51F3C475': ['cro', 'frtn', 'ttt'], // Time Creature Ships
            '0xB049eDd7E9580C0BBE708c1A3374C74066FF9E7F': ['cro', 'frtn', 'ttt'], // Time Cronos Planets
            '0xfF567a62d7BF2CF984F02175C8bd485E3C4E2c0e': ['cro', 'frtn', 'ttt'], // Time Ship Components
            '0x739b5380156Fa14C7956145048d52dF27EDedfCE': ['cro', 'frtn', 'ttt'], // Tata's Twisted Tonics
            '0xb76415D33268391bfaE2E671f45CeDAD9bC99dc9': ['cro', 'frtn', 'ttt'], // Animated Guardians
            '0xCF926cB69b860Da8c33a2a601217856536ed0bcA': ['cro', 'frtn', 'ttt'], // Animated Time Machine 102s
            '0x975238Ce3c593060a9b549e1654dC992f0Bc11aC': ['cro', 'frtn', 'ttt'], // Power Tonics
            '0x87e04f1d64619994a5320450E19C184a2dDE09c7': ['cro', 'frtn', 'ttt'], // CroTops
            '0x35B832bE9546fCad67526Be2801228194250378A': ['cro', 'frtn', 'ttt'], // Time Base
            '0xF87A517A5CaecaA03d7cCa770789BdB61e09e05F': ['cro'], // CroSkill Brand Start
            '0xbf4E430cD0ce8b93d4760958fe4ae66cDaCDB6c6': ['cro'],
            '0x14e9ef197C0bfaf7C1328ebed7151f53616Af3C5': ['cro'],
            '0x6d54590Ed6950EcD3987778c004d4773a7e99dAC': ['cro'],
            '0x5DD5d3140Fe619Ef8F4655383283BB555E219A27': ['cro'],
            '0x635D66972453E20F5f2EA2787361C752232F07D2': ['cro'],
            '0x27fE0fA269DeAC471aC07014d6ED9973ce69bd96': ['cro'],
            '0xB77959DC7a12F7549ACC084Af01259Fc48813c89': ['cro'],
            '0x54655D5468f072D5bcE1577c4a46F701C28a41A7': ['cro'],
            '0x31B378ac025a341839CD81C4D29A8457324D3EbC': ['cro'],
            '0x77aE45b634a829B002293E554fA67ADC0EB78Bc2': ['cro'],
            '0xed9BDf3E103332C853DDb9933BA3B45acfDB9B2e': ['cro'],
            '0xB9eCFF7e01a48C434a3B8A034906e4b34Da62f90': ['cro'],
            '0xB929D3002208f405180D3C07616F88EDa45F3e14': ['cro'],
            '0x508378E99F5527Acb6eB4f0fc22f954c5783e5F9': ['cro'],
            '0xA9448e3e496f75488306195F34e49a7fCE5cbD0c': ['cro'],
            '0x0977Ee79F7f6BedE288DD0264C77B4A1b32C48e8': ['cro'],
            '0x400e237c4F88e5728E0D6088315DeCD856a10EDd': ['cro'], // CroSkill Brand End
            '0xabae2fd87bdc719165dc31a5b22316f974df5bdf': ['icy'], // ICY Brand
            '0x0Ea3bE4Ca12b7B43e974264a210f4de0e273A027': ['icy'],
            '0xbEa2F7082ad9B5e1138D5e94E00fbc63d7EC8612': ['icy'],
            '0x07174D2B657b2243E5C11Df2Cd3D4afD1E45DBBb': ['icy'],
            '0x4F68b2F90091B6C6012b487Faa7D267FC0Db86dE': ['icy'],
            '0x45008e129A33368119757496DA762284ff8e2565': ['icy'],
            '0x7677cbE702Ff3d0e66d3BaC0fD71Cb641A276Ae0': ['icy'],
            '0xccc598ef1b4d17d9f44a889eee38c8de53f5df00': ['icy'], // ICY Brand End
          }
        },
        deals: ['cro', 'wcro', 'frtn', 'bcro', 'mad', 'vrse', 'scratch', 'candy', 'ttt', 'icy']
      },
      [ChainId.CRONOS_TESTNET]: {
        global: [],
        marketplace: {
          available: [],
          nft: {}
        },
        deals: []
      },
      [ChainId.CRONOS_ZKEVM]: {
        global: ['zkcro', 'frtn'],
        marketplace: {
          available: ['zkcro', 'frtn'],
          nft: {
            '0x46055078a40358c27f7850d81f29ec857342318f': ['frtn'] // Moggy Money Brokers
          }
        },
        deals: []
      },
      [ChainId.CRONOS_ZKEVM_TESTNET]: {
        global: [],
        marketplace: {
          available: [],
          nft: {}
        },
        deals: []
      }
    }
  },
  [AppEnvironment.TESTNET]: {
    defaultChainId: ChainId.CRONOS_TESTNET,
    urls: {
      api: 'https://testapi.ebisusbay.biz/',
      app: 'https://testapp.ebisusbay.biz/',
      // cms: 'https://testcms.ebisusbay.biz/api/',
      cms: "http://localhost:4000/api/",
      cmsSocket: 'wss://testcms.ebisusbay.biz/socket/',
      // cmsSocket: 'ws://localhost:4000/socket/',
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
      }
    },
    vendors: {
      transak: {
        apiKey: '6bdef2f9-cfab-4d58-bb79-82794642a67e',
        contractId: '65f8577a2460fe929493ee7f',
        url: 'https://global-stg.transak.com?apiKey=6bdef2f9-cfab-4d58-bb79-82794642a67e&isAutoFillUserData=true',
        env: 'STAGING',
        filler: '0xcb9bd5acd627e8fccf9eb8d4ba72aeb1cd8ff5ef',
        postUrl: 'https://api-stg.transak.com/cryptocoverage/api/v1/public/one-click-protocol/nft-transaction-id'
      }
    },
    currencies : {
      [ChainId.CRONOS]: {
        global: ['cro', 'frtn'],
        marketplace: {
          available: ['cro', 'wcro', 'frtn', 'vrse'],
          nft: {
            // '0xCF7aedEbC5223c4C620625A560300582B77D8719': ['cro', 'frtn'], // Ryoshi VIP
            // '0xe51377a260043381b8B525D33B9fFBC601A1469b': ['frtn', 'vrse'],
            // '0x7fb11087c21719C2e4f9Fc16408e8a97a46c92Ad': ['frtn'],
            // '0xda72ee0b52a5a6d5c989f0e817c9e2af72e572b5': ['frtn'],
            // '0x1189C0A75e7965974cE7c5253eB18eC93F2DE4Ad': ['frtn'],
            // '0x3F1590A5984C89e6d5831bFB76788F3517Cdf034': ['frtn'],
            // '0x04Bd856E96127f3ef3C45864BeAEe26F5Df5066a': ['frtn'],
            // '0xE1D0a4ae1DF871510d82144a282FF14bAcA8f2c0': ['frtn'],
            // '0xa937e814A2c5e99E9e86c4F34162c4F012F75a52': ['cro', 'frtn'],
            // '0xa4C40C51de20d1e75E0ac83D6F043AF2f9C6Faa9': ['cro', 'frtn'],
            // '0xe9DCa9E03F31CBD538A19a89eA2cA3684AF2788f': ['cro', 'frtn'],
            // '0xa62F0C192691f5f17EBc704E1ad77ca4Ba687f74': ['cro']
          }
        },
        deals: []
      },
      [ChainId.CRONOS_TESTNET]: {
        global: ['cro', 'frtn'],
        marketplace: {
          available: ['cro', 'wcro', 'frtn', 'vrse'],
          nft: {}
        },
        deals: []
      },
      [ChainId.CRONOS_ZKEVM]: {
        global: ['cro', 'usdc'],
        marketplace: {
          available: ['cro', 'usdc'],
          nft: {}
        },
        deals: []
      },
      [ChainId.CRONOS_ZKEVM_TESTNET]: {
        global: ['cro', 'usdc'],
        marketplace: {
          available: ['cro', 'usdc'],
          nft: {}
        },
        deals: []
      }
    }
  }
}

function localAppConfig(): AppEnvironmentConfig {
  const inheritedEnv = remoteConfigs[AppEnvironment.TESTNET];
  return {
    ...inheritedEnv,
    urls: {
      ...inheritedEnv.urls,
      app: 'http://localhost:3000/',
      // cms: 'https://cms.ebisusbay.com/api/',
      cms: 'http://localhost:4000/api/',
      // cmsSocket: 'wss://cms.ebisusbay.com/socket/',
      cmsSocket: 'ws://localhost:4000/socket/',
    }
  }
}

export const appConfigs: AppConfigMap = {
  ...remoteConfigs,
  [AppEnvironment.LOCAL]: localAppConfig()
}

export default appConfigs;


// interface ChainConfig {
//   contracts: {
//     membership: HexString,
//     auction: HexString,
//     market: HexString,
//     stake: HexString,
//     offer: HexString,
//     madAuction: HexString,
//     slothtyRugsurance: HexString,
//     bundle: HexString,
//     gaslessListing: HexString,
//     gdc: HexString,
//     usdc: HexString,
//     purchaseFortune: HexString,
//     allianceCenter: HexString,
//     battleField: HexString,
//     resources: HexString,
//     bank: HexString,
//     barracks: HexString,
//     fortune: HexString,
//     rewards: HexString,
//     presaleVaults: HexString,
//     seasonUnlocks: HexString,
//     townHall: HexString,
//     vaultNft: HexString,
//     ryoshiWithKnife: HexString,
//     farms: HexString
//   },
//   subgraph: {
//     root: string,
//     ryoshiDynasties: string,
//     ryoshiPresale: string,
//     stakedOwners: string,
//     staking: string,
//     farms: string,
//     dex: string
//   }
// }
//
//
// enum ChainNetworkType {
//   MAINNET = 'mainnet',
//   TESTNET = 'testnet'
// }
//
// const networkConfigs = {
//   [ChainId.CRONOS]: {}
// }
//
// type HexString = `0x${string}` & string;