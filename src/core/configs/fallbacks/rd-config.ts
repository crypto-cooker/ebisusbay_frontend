import {
  RyoshiConfig,
  RyoshiConfigCollections,
  RyoshiConfigTraitInclusionType
} from "@src/components-v2/feature/ryoshi-dynasties/game/types";

const collections: RyoshiConfigCollections[] = [
  {
    slug: 'ryoshi-tales-vip',
    address: '0xE49709A3B59d708f50AA3712F2E5a84b7707664C',
    maxSupply: 10000
  },
  {
    slug: 'ryoshi-tales-halloween',
    address: '0x54E61e2043f894475D17D344250F1983f7F7e6D3',
    maxSupply: 2500
  },
  {
    slug: 'ryoshi-tales-christmas',
    address: '0xe3Ef45955b507895779a6A8911bBc48E0E17B11C',
    maxSupply: 2500
  },
  {
    slug: 'fortune-guards',
    address: '0x013f83434356c0a20698605eBAb337aab966AF88',
    maxSupply: 4
  },
  {
    slug: 'mad-meerkat',
    address: '0x89dBC8Bd9a6037Cbd6EC66C4bF4189c9747B1C56',
    maxSupply: 10000
  },
  {
    slug: 'cowz',
    address: '0xdbFDf81D1fDD2e79e8ffaDE50c219452587e9488',
    maxSupply: 10000
  },
  {
    slug: 'aiko-legends',
    address: '0xFD90697db5D40B37B86C958106A342088f11AA84',
    maxSupply: 3333
  }
];

export const ryoshiConfig: RyoshiConfig = {
  bank: {
    staking: {
      fortune: {
        minimum: 1250,
        termLength: 90,
        maxTerms: 12,
        mitamaTroopsRatio: 30,
        startingDebt: 100,
        apr: {
          1: 0.12,
          2: 0.17,
          3: 0.2,
          4: 0.3,
          8: 0.85,
          12: 1.35,
        }
      },
      nft: {
        maxSlots: 5,
        maxMultiplier: 1.5,
        collections: [
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-vip')!,
            multipliers: [
              { percentile: 5, value: 0.5 },
              { percentile: 10, value: 0.3 },
              { percentile: 20, value: 0.2 },
              { percentile: 100, value: 0.1 },
            ],
            adders: [],
            ids: []
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-halloween')!,
            multipliers: [],
            adders: [
              { percentile: 5, value: 0.25 },
              { percentile: 10, value: 0.2 },
              { percentile: 20, value: 0.15 },
              { percentile: 100, value: 0.1 },
            ],
            ids: []
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-christmas')!,
            multipliers: [],
            adders: [
              { percentile: 5, value: 0.25 },
              { percentile: 10, value: 0.2 },
              { percentile: 20, value: 0.15 },
              { percentile: 100, value: 0.1 },
            ],
            ids: []
          },
          {
            ...collections.find(c => c.slug === 'fortune-guards')!,
            multipliers: [],
            adders: [],
            ids: [
              { id: 2, bonus: 0.5 },
              { id: 3, bonus: 1.0 },
              { id: 4, bonus: 2.0 },
              { id: 5, bonus: 4.0 },
            ]
          }
        ],
      }
    }
  },
  barracks: {
    staking: {
      nft: {
        maxSlots: 5,
        collections: [
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-vip')!,
            traits: [
              {
                type: 'tools',
                inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                values: [
                  'axe',
                  'bo',
                  'bokken',
                  'bow',
                  'broadsword',
                  'harpoon',
                  'katana',
                  'kunai with chain',
                  'nagamaki',
                  'naginata',
                  'niuwedo',
                  'odachi',
                  'pickaxe',
                  'shovel',
                  'tachi',
                  'tanto',
                  'thammer',
                  'trident',
                  'oar',
                  'wakizashi',
                ]
              },
            ],
            multipliers: [
              { percentile: 5, value: 1000 },
              { percentile: 10, value: 300 },
              { percentile: 20, value: 275 },
              { percentile: 100, value: 250 },
            ],
            ids: []
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-halloween')!,
            traits: [
              {
                type: 'tools',
                inclusion: RyoshiConfigTraitInclusionType.EXCLUDE,
                values: [
                  'none'
                ]
              },
            ],
            multipliers: [
              { percentile: 5, value: 50 },
              { percentile: 10, value: 30 },
              { percentile: 20, value: 20 },
              { percentile: 100, value: 10 },
            ],
            ids: []
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-christmas')!,
            traits: [
              {
                type: 'miscellaneous',
                inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                values: [
                  'candy cane'
                ]
              },
            ],
            multipliers: [
              { percentile: 5, value: 50 },
              { percentile: 10, value: 30 },
              { percentile: 20, value: 20 },
              { percentile: 100, value: 10 },
            ],
            ids: []
          },
          {
            ...collections.find(c => c.slug === 'fortune-guards')!,
            traits: [],
            multipliers: [],
            ids: [
              { id: 2, bonus: 100 },
              { id: 3, bonus: 200 },
              { id: 4, bonus: 300 },
              { id: 5, bonus: 400 },
            ],
          }
        ]
      }
    }
  },
  townHall: {
    staking: {
      nft: {
        maxSlots: 5,
        collections: [
          {
            ...collections.find(c => c.slug === 'cowz')!,
            fortune: 35000
          },
          {
            ...collections.find(c => c.slug === 'aiko-legends')!,
            fortune: 25000
          },
          {
            ...collections.find(c => c.slug === 'mad-meerkat')!,
            fortune: 15000
          }
        ]
      }
    }
  },
  factions: {
    registration: {
      fortuneCost: 1500,
      mitamaCost: 1500,
      forbiddenAddresses: [
        '0xE49709A3B59d708f50AA3712F2E5a84b7707664C', // Ryoshi VIP
        '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5', // EB FM/VIP
        '0x584a16905ca9cb10c0a2a9caa8e37a64de48c506', // SeaShrine VIP
        '0x54E61e2043f894475D17D344250F1983f7F7e6D3', // Ryoshi Halloween
        '0xe3Ef45955b507895779a6A8911bBc48E0E17B11C', // Ryoshi Christmas
        '0x653DDF1Bb9995ecfcbDd411Dc3F9793127680B29', // Valentine
        '0x008d4Ab1D8fbC7823422a7cCFe3f1D73c09760Ab', // Holiday Hares
        '0xD961956B319A10CBdF89409C0aE7059788A4DaBb', // Cronies
        '0xf54abdcba21e7a740f98307a561b605cb3fdcf63', // Legacy VIP Art
        '0x04636c536537a8b7F05eDbA2cEBe1FaDd711D566', // FortuneTeller
        '0x013f83434356c0a20698605eBAb337aab966AF88', // Fortune Guards
        '0xce3f4e59834b5B52B301E075C5B3D427B6884b3d', // Ryoshi Resources
        '0xd87838a982a401510255ec27e603b0f5fea98d24', // Ryoshi Playing Cards
        '0xcF7C77967FaD74d0B5104Edd476db2C6913fb0e3'  // Land Deeds
      ]
    },
    editableDays: 4,
  },
  rewards: {
    daily: [
      1,
      5,
      10,
      15,
      20,
      25,
      30
    ]
  },
  presale: {
    bonus: [
      1337,
      2487,
      10322,
      24945,
      449018
    ]
  },
  armies: {
    redeploymentDelay: [
      60,
      120,
      300,
      900,
      1800,
      3600,
      10800
    ]
  },
  reputations: {
    points: {
      battle: {
        kill: -1,
        attacker: 1,
        defender: -1
      },
      deploy: 1,
      delegated: 5,
      recall: -1
    }
  }
}

export default ryoshiConfig;