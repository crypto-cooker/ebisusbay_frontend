import {
  ExperienceEventType,
  RyoshiConfig,
  RyoshiConfigCollections,
  RyoshiConfigTraitInclusionType
} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import {isTestnet} from "@src/config";

const mainnetCollections: RyoshiConfigCollections[] = [
  {
    name: 'Ryoshi Tales: VIP',
    slug: 'ryoshi-tales-vip',
    address: '0xE49709A3B59d708f50AA3712F2E5a84b7707664C',
    chainId: 25
  },
  {
    name: 'Ryoshi Tales: Halloween',
    slug: 'ryoshi-tales-halloween',
    address: '0x54E61e2043f894475D17D344250F1983f7F7e6D3',
    chainId: 25
  },
  {
    name: 'Ryoshi Tales: Christmas',
    slug: 'ryoshi-tales-christmas',
    address: '0xe3Ef45955b507895779a6A8911bBc48E0E17B11C',
    chainId: 25
  },
  {
    name: 'Fortune Guards',
    slug: 'fortune-guards',
    address: '0x013f83434356c0a20698605eBAb337aab966AF88',
    chainId: 25
  },
  {
    name: 'Fortune Tellers',
    slug: 'fortuneteller',
    address: '0x04636c536537a8b7F05eDbA2cEBe1FaDd711D566',
    chainId: 25
  },
  {
    name: 'Ryoshi Tales',
    slug: 'ryoshi-tales',
    address: '0x562e3e2d3f69c53d5a5728e8d7f977f3de150e04',
    chainId: 25
  },
  {
    name: 'Mad Meerkat',
    slug: 'mad-meerkat',
    address: '0x89dBC8Bd9a6037Cbd6EC66C4bF4189c9747B1C56',
    chainId: 25
  },
  {
    name: 'Cowz',
    slug: 'cowz',
    address: '0xdbFDf81D1fDD2e79e8ffaDE50c219452587e9488',
    chainId: 25
  },
  {
    name: 'Aiko Legends',
    slug: 'aiko-legends',
    address: '0xFD90697db5D40B37B86C958106A342088f11AA84',
    chainId: 25
  },
  {
    name: 'Moggy Money Brokers',
    slug: 'moggy-money-brokers',
    address: '0x46055078a40358c27f7850d81f29ec857342318f',
    chainId: 388
  },
  {
    name: 'Pixel Ryoshi',
    slug: 'pixel-ryoshi',
    address: '0xe1f306e5053663a5f8127d1240dd7e3d22de7313',
    chainId: 388
  },
  {
    name: 'Mystic Sea Dragons',
    slug: 'mystic-sea-dragons',
    address: '0xb34a19ba70c865edae4696735904a414f37f48ab',
    chainId: 388
  },
  {
    name: 'Materialization Infusion Terminal',
    slug: 'materialization-infusion-terminal',
    address: '0x36fc7f007e05449d07a8129a3aca9be87b5bba01',
    chainId: 388
  }
];

const testnetCollections: RyoshiConfigCollections[] = [
  {
    name: 'Ryoshi Tales: VIP',
    slug: 'ryoshi-tales-vip',
    address: '0xCF7aedEbC5223c4C620625A560300582B77D8719',
    chainId: 338
  },
  {
    name: 'Ryoshi Tales: Halloween',
    slug: 'ryoshi-tales-halloween',
    address: '0xe51377a260043381b8B525D33B9fFBC601A1469b',
    chainId: 338
  },
  {
    name: 'Ryoshi Tales: Christmas',
    slug: 'ryoshi-tales-christmas',
    address: '0x7fb11087c21719C2e4f9Fc16408e8a97a46c92Ad',
    chainId: 338
  },
  {
    name: 'Fortune Guards',
    slug: 'fortune-guards',
    address: '0x04Bd856E96127f3ef3C45864BeAEe26F5Df5066a',
    chainId: 338
  },
  {
    name: 'Fortune Tellers',
    slug: 'fortuneteller',
    address: '0xE1D0a4ae1DF871510d82144a282FF14bAcA8f2c0',
    chainId: 338
  },
  {
    name: 'Ryoshi Tales',
    slug: 'ryoshi-tales',
    address: '0xCDC905b5cDaDE71BFd3540e632aeFfE99b9965E4',
    chainId: 338
  },
  {
    name: 'CroMorphs',
    slug: 'cromorphs',
    address: '0x0a9aDe7c04AF4902c84D120B18d69fFFe5AE099E',
    chainId: 338
  },
  {
    name: 'Everybodys Not Friends',
    slug: 'everybodys-not-friends',
    address: '0xFCd08C7BE680b36522BA87240B296377A80a01D0',
    chainId: 338
  },
  {
    name: 'Noodles Club',
    slug: 'noodles-club',
    address: '0x53973c3239388a23f99fA5D6CF85106434d27076',
    chainId: 338
  },
  {
    name: 'Pixel Ryoshi',
    slug: 'pixel-ryoshi',
    address: '0x7a74d804f95bbde5ded85271a33e748409f03a60',
    chainId: 282
  },
  {
    name: 'Moggy Money Brokers',
    slug: 'moggy-money-brokers',
    address: '0x0500aff9876f3df33e126238365c58d2733bb22a',
    chainId: 282
  },
  {
    name: 'Mystic Sea Dragons',
    slug: 'mystic-sea-dragons',
    address: '0x613e49aabe1a18d6ec50aa427c60adb1ae153872',
    chainId: 338
  },
  {
    name: 'Materialization Infusion Terminal',
    slug: 'materialization-infusion-terminal',
    address: '0xb115c623109b7998e497837ae6200ff79e49e1ee',
    chainId: 338
  }
];
const collections = isTestnet() ? testnetCollections : mainnetCollections;

export const ryoshiConfig: RyoshiConfig = {
  platform: {
    staking: {
      troops: {
        values: [
          { percentile: 5, value: 100 },
          { percentile: 10, value: 50 },
          { percentile: 20, value: 35 },
          { percentile: 100, value: 20 },
        ],
        bonus: [
          {
            value: 1000,
            traits: [
              {
                inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                type: 'miscellaneous',
                values: [
                  'red snapper'
                ]
              }
            ]
          },
          {
            value: 500,
            traits: [
              {
                inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                type: 'clothing',
                values: [
                  'diving suit'
                ]
              }
            ]
          },
          {
            value: 50,
            traits: [
              {
                inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                type: 'tools',
                values: [
                  'fishcane',
                  'fishing rod'
                ]
              }
            ]
          },
          {
            value: 20,
            traits: [
              {
                inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                type: 'miscellaneous',
                values: [
                  'barnacles',
                  'snorkel'
                ]
              }
            ]
          },
          {
            value: 10,
            traits: [
              {
                inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                type: 'mouth',
                values: [
                  'fish hook',
                ]
              },
              {
                inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                type: 'miscellaneous',
                values: [
                  'seaweed',
                ]
              }
            ]
          }
        ]
      }
    }
  },
  bank: {
    staking: {
      fortune: {
        minimum: 400,
        termLength: 90,
        maxTerms: 12,
        mitamaTroopsRatio: 20,
        startingDebt: 100,
        apr: {
          1: 0.12,
          2: 0.17,
          3: 0.2,
          4: 0.3,
          8: 0.85,
          12: 1.35,
        },
        lpApr : {
          1: 0.1,
          2: 0.12,
          3: 0.14,
          4: 0.16,
          5: 0.18,
          6: 0.20,
          7: 0.22,
          8: 0.24,
          9: 0.50,
          10: 0.75,
          11: 1.2,
          12: 1.5
        }
      },
      nft: {
        slots: {
          max: 5,
          included: 1,
          cost: [
            {frtn: 0, koban: 0},
            {frtn: 1, koban: 1},
            {frtn: 2, koban: 2},
            {frtn: 5, koban: 3},
            {frtn: 10, koban: 5},
          ]
        },
        maxMultiplier: 1.5,
        collections: [
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-vip')!,
            active: true,
            minId: 1,
            maxId: 10000,
            apr: {
              multipliers: [
                { percentile: 5, value: 0.5 },
                { percentile: 10, value: 0.3 },
                { percentile: 20, value: 0.2 },
                { percentile: 100, value: 0.1 },
              ],
              adders: [],
              ids: []
            },
            troops: {
              values: [
                { percentile: 5, value: 50 },
                { percentile: 10, value: 30 },
                { percentile: 20, value: 20 },
                { percentile: 100, value: 10 },
              ],
              bonus: [{
                value: 10,
                traits: [
                  {
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    type: 'clothing',
                    values: [
                      'bitcoin tee 1',
                      'bitcoin tee 2',
                      'bitcoin tee 3',
                      'chronos tee 1',
                      'chronos tee 2',
                      'chronos tee 3',
                      'dollar tee 1',
                      'dollar tee 2',
                      'dollar tee 3'
                    ]
                  },
                  {
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    type: 'eye wear',
                    values: [
                      'monocle'
                    ]
                  },
                  {
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    type: 'eye wear',
                    values: [
                      'monocle'
                    ]
                  }
                ]
              }]
            }
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-halloween')!,
            active: true,
            minId: 1,
            maxId: 2500,
            apr: {
              multipliers: [],
              adders: [
                { percentile: 5, value: 0.25 },
                { percentile: 10, value: 0.2 },
                { percentile: 20, value: 0.15 },
                { percentile: 100, value: 0.1 },
              ],
              ids: []
            }
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-christmas')!,
            active: true,
            minId: 1,
            maxId: 2500,
            apr: {
              multipliers: [],
              adders: [
                { percentile: 5, value: 0.25 },
                { percentile: 10, value: 0.2 },
                { percentile: 20, value: 0.15 },
                { percentile: 100, value: 0.1 },
              ],
              ids: []
            }
          },
          {
            ...collections.find(c => c.slug === 'fortune-guards')!,
            active: false,
            minId: 2,
            maxId: 5,
            apr: {
              multipliers: [],
              adders: [],
              ids: [
                { id: 2, bonus: 0.5 },
                { id: 3, bonus: 1.0 },
                { id: 4, bonus: 2.0 },
                { id: 5, bonus: 4.0 },
              ]
            }
          },
          {
            ...collections.find(c => c.slug === 'fortuneteller')!,
            active: true,
            minId: 1,
            maxId: 5,
            apr: {
              multipliers: [],
              adders: [],
              ids: [
                { id: 1, bonus: 0.25 },
                { id: 2, bonus: 0.5 },
                { id: 3, bonus: 1.0 },
                { id: 4, bonus: 2.0 },
                { id: 5, bonus: 4.0 },
              ]
            }
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales')!,
            active: true,
            minId: 1,
            maxId: 500,
            apr: {
              multipliers: [],
              adders: [
                { percentile: 5, value: 0.25 },
                { percentile: 10, value: 0.2 },
                { percentile: 20, value: 0.15 },
                { percentile: 100, value: 0.1 },
              ],
              ids: []
            }
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales')!,
            active: true,
            minId: 501,
            maxId: 700,
            apr: {
              multipliers: [],
              adders: [
                { percentile: 5, value: 0.5 },
                { percentile: 10, value: 0.4 },
                { percentile: 20, value: 0.3 },
                { percentile: 100, value: 0.2 },
              ],
              ids: []
            }
          },
          {
            ...collections.find(c => c.slug === 'pixel-ryoshi')!,
            active: true,
            minId: 1,
            maxId: 300,
            apr: {
              multipliers: [],
              adders: [
                { percentile: 5, value: 0.8 },
                { percentile: 10, value: 0.7 },
                { percentile: 20, value: 0.6 },
                { percentile: 100, value: 0.5 }
              ],
              ids: []
            },
            troops: {
              values: [
                { percentile: 5, value: 25 },
                { percentile: 10, value: 20 },
                { percentile: 20, value: 15 },
                { percentile: 100, value: 10 },
              ],
              bonus: [{
                value: 10,
                traits: [
                  {
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    type: 'clothing',
                    values: [
                      'bitcoin tee 1',
                      'bitcoin tee 2',
                      'bitcoin tee 3',
                      'chronos tee 1',
                      'chronos tee 2',
                      'chronos tee 3',
                      'dollar tee 1',
                      'dollar tee 2',
                      'dollar tee 3'
                    ]
                  },
                  {
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    type: 'eye wear',
                    values: [
                      'monocle'
                    ]
                  },
                  {
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    type: 'eye wear',
                    values: [
                      'monocle'
                    ]
                  }
                ]
              }]
            }
          },
          {
            ...collections.find(c => c.slug === 'mystic-sea-dragons')!,
            active: true,
            minId: 1,
            maxId: 4000,
            apr: {
              multipliers: [
                { percentile: 5, value: 0.5 },
                { percentile: 10, value: 0.3 },
                { percentile: 100, value: 0.2 },
              ],
              adders: [],
              ids: []
            },
            troops: {
              values: [
                { percentile: 5, value: 50 },
                { percentile: 10, value: 30 },
                { percentile: 100, value: 20 },
              ],
              bonus: [
                {
                  value: 25,
                  traits: [
                    {
                      inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                      type: 'mouth',
                      values: [
                        'grillz'
                      ]
                    },
                    {
                      inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                      type: 'head',
                      values: [
                        'glamour',
                        'fortune horns',
                        'crown'
                      ]
                    },
                    {
                      inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                      type: 'eyewear',
                      values: [
                        'monacle',
                        'deal-with-it',
                        'deal with it'
                      ]
                    },
                    {
                      inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                      type: 'eyes',
                      values: [
                        'cyberpunk',
                        'fortune',
                        'sea crystals'
                      ]
                    },
                    {
                      inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                      type: 'clothes',
                      values: [
                        'cyberpunk',
                        'fortune shirt',
                        'sea crystals',
                        'white collar',
                        'ryoshi with knife medallion',
                      ]
                    },
                    {
                      inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                      type: 'background',
                      values: [
                        'library',
                      ]
                    },
                  ]
                },
                {
                  value: 3000,
                  traits: [
                    {
                      inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                      type: 'legendary',
                      values: [
                        'dr4-gon',
                        'moggy dragon mount'
                      ]
                    }
                  ]
                },
                {
                  value: 1000,
                  traits: [
                    {
                      inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                      type: 'legendary',
                      values: [
                        'mad scientist',
                        'moon dweller',
                        'mavriks tough boy',
                        'kotori',
                        'zephyr drake',
                        'ethereal cloud serpent'
                      ]
                    }
                  ]
                },
              ],
            }
          },
          {
            ...collections.find(c => c.slug === 'moggy-money-brokers')!,
            active: true,
            minId: 1,
            maxId: 4,
            apr: {
              multipliers: [],
              adders: [],
              ids: [
                { id: 1, bonus: 0.5 },
                { id: 2, bonus: 1.0 },
                { id: 3, bonus: 2.0 },
                { id: 4, bonus: 4.0 },
              ]
            }
          },
          {
            ...collections.find(c => c.slug === 'materialization-infusion-terminal')!,
            active: true,
            minId: 1,
            maxId: 2500,
            apr: {
              multipliers: [],
              adders: [],
              ids: []
            }
          }
        ],
      }
    }
  },
  barracks: {
    staking: {
      nft: {
        slots: {
          max: 5,
          included: 1,
          cost: [
            {frtn: 0, koban: 0},
            {frtn: 1, koban: 1},
            {frtn: 2, koban: 2},
            {frtn: 5, koban: 3},
            {frtn: 10, koban: 5},
          ]
        },
        collections: [
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-vip')!,
            active: true,
            minId: 1,
            maxId: 10000,
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
            ids: [],
            bonus: [
              {
                value: 25,
                traits: [
                  {
                    type: 'clothing',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'archer suit'
                    ]
                  }
                ]
              },
              {
                value: 200,
                traits: [
                  {
                    type: 'clothing',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'golden armor'
                    ]
                  }
                ]
              },
              {
                value: 40,
                traits: [
                  {
                    type: 'clothing',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'medieval armor'
                    ]
                  }
                ]
              },
              {
                value: 75,
                traits: [
                  {
                    type: 'clothing',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'samurai'
                    ]
                  },
                  {
                    type: 'hair',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'samurai helmet'
                    ]
                  }
                ]
              }
            ]
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-halloween')!,
            active: true,
            minId: 1,
            maxId: 2500,
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
            ids: [],
            bonus: []
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales-christmas')!,
            active: true,
            minId: 1,
            maxId: 2500,
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
            ids: [],
            bonus: []
          },
          {
            ...collections.find(c => c.slug === 'fortune-guards')!,
            active: false,
            minId: 2,
            maxId: 5,
            traits: [],
            multipliers: [],
            ids: [
              { id: 2, bonus: 100 },
              { id: 3, bonus: 200 },
              { id: 4, bonus: 300 },
              { id: 5, bonus: 400 },
            ],
            bonus: []
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales')!,
            active: true,
            minId: 1,
            maxId: 500,
            traits: [
              {
                type: 'accessories',
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
            ids: [],
            bonus: []
          },
          {
            ...collections.find(c => c.slug === 'ryoshi-tales')!,
            active: true,
            minId: 501,
            maxId: 700,
            traits: [
              {
                type: 'accessory',
                inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                values: [
                  'celestial staff silver',
                  'celestial staff gold'
                ]
              },
              {
                type: 'clothing',
                inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                values: [
                  'celestial epaulettes midnight gold',
                  'celestial epaulettes maroon silver'
                ]
              },
            ],
            multipliers: [
              { percentile: 5, value: 100 },
              { percentile: 10, value: 60 },
              { percentile: 20, value: 40 },
              { percentile: 100, value: 20 },
            ],
            ids: [],
            bonus: []
          },
          {
            ...collections.find(c => c.slug === 'pixel-ryoshi')!,
            active: true,
            minId: 1,
            maxId: 300,
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
              { percentile: 5, value: 200 },
              { percentile: 10, value: 150 },
              { percentile: 20, value: 100 },
              { percentile: 100, value: 75 },
            ],
            ids: [],
            bonus: [
              {
                value: 25,
                traits: [
                  {
                    type: 'clothing',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'archer suit'
                    ]
                  }
                ]
              },
              {
                value: 200,
                traits: [
                  {
                    type: 'clothing',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'golden armor'
                    ]
                  }
                ]
              },
              {
                value: 40,
                traits: [
                  {
                    type: 'clothing',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'medieval armor'
                    ]
                  }
                ]
              },
              {
                value: 75,
                traits: [
                  {
                    type: 'clothing',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'samurai'
                    ]
                  },
                  {
                    type: 'hair',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'samurai helmet'
                    ]
                  }
                ]
              }
            ]
          },
          {
            ...collections.find(c => c.slug === 'mystic-sea-dragons')!,
            active: true,
            minId: 1,
            maxId: 4000,
            traits: [],
            multipliers: [
              { percentile: 5, value: 1000 },
              { percentile: 10, value: 300 },
              { percentile: 100, value: 275 },
            ],
            ids: [],
            bonus: [
              {
                value: 100,
                traits: [
                  {
                    type: 'background',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'washitsu'
                    ]
                  },
                  {
                    type: 'body',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'aligator',
                      'magma',
                      'rock',
                      'saiya-jin',
                      'chrono'
                    ]
                  },
                  {
                    type: 'clothes',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'admiral',
                      "king's cloak",
                      "royal guard's armor",
                      'saiya-jin'
                    ]
                  },
                  {
                    type: 'eyes',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'saiya-jin',
                      'chrono'
                    ]
                  },
                  {
                    type: 'head',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'chrono'
                    ]
                  },
                ]
              },
              {
                value: 300,
                traits: [
                  {
                    type: 'body',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'cosmic'
                    ]
                  },
                  {
                    type: 'head',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'cosmic horns'
                    ]
                  },
                ]
              },
              {
                value: 50,
                traits: [
                  {
                    type: 'clothes',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'mad scientist'
                    ]
                  },
                ]
              },
              {
                value: 200,
                traits: [
                  {
                    type: 'clothes',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'waterminator',
                      'wa-terminator'
                    ]
                  },
                  {
                    type: 'eyes',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'waterminator',
                      'wa-terminator'
                    ]
                  },
                  {
                    type: 'eyewear',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'laser visor',
                    ]
                  },
                ]
              },
              {
                value: 3000,
                traits: [
                  {
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    type: 'legendary',
                    values: [
                      'dr4-gon',
                      'moggy dragon mount'
                    ]
                  }
                ]
              },
              {
                value: 1000,
                traits: [
                  {
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    type: 'legendary',
                    values: [
                      'mad scientist',
                      'moon dweller',
                      'mavriks tough boy',
                      'kotori',
                      'zephyr drake',
                      'ethereal cloud serpent'
                    ]
                  }
                ]
              },
            ]
          },
          {
            ...collections.find(c => c.slug === 'materialization-infusion-terminal')!,
            active: true,
            minId: 1,
            maxId: 2500,
            traits: [],
            multipliers: [],
            ids: [],
            bonus: []
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
            ...collections.find(c => c.slug === 'cromorphs')!,
            active: true,
            fortune: 35000
          },
          {
            ...collections.find(c => c.slug === 'everybodys-not-friends')!,
            active: true,
            fortune: 25000
          },
          {
            ...collections.find(c => c.slug === 'noodles-club')!,
            active: true,
            fortune: 15000
          }
        ]
      }
    },
    ryoshi: {
      restockCutoff: 3000,
      upkeepDecay: 0.1,
      upkeepActiveDays: 7,
      upkeepCosts: [
        { threshold: 0, multiplier: 0 },
        { threshold: 201, multiplier: 1 },
        { threshold: 1000, multiplier: 2 },
        { threshold: 5000, multiplier: 3 },
      ],
      tradeIn: {
        tierMultiplier: [1, 2, 3],
        base: {
          100: 15,
          101: 15,
          102: 15,
          103: 10,
          104: 10,
          105: 10,
          106: 10,
          107: 10,
          108: 10,
          109: 15,
          110: 15,
          111: 15,
          112: 20,
          113: 20,
          114: 20,
          115: 20,
          116: 20,
          117: 20,
          118: 15,
          119: 15,
          120: 15,
          121: 10,
          122: 10,
          123: 10,
          124: 15,
          125: 15,
          126: 15,
          127: 10,
          128: 10,
          129: 10,
          130: 15,
          131: 15,
          132: 15,
          133: 15,
          134: 15,
          135: 15,
          136: 10,
          137: 10,
          138: 10,
          139: 10,
          140: 10,
          141: 10,
          142: 20,
          143: 20,
          144: 20,
          145: 15,
          146: 15,
          147: 15,
          148: 20,
          149: 20,
          150: 20,
          151: 10,
          152: 10,
          153: 10,
          154: 10,
          155: 10,
          156: 10,
          157: 10,
          158: 10,
          159: 10,
          1001: 25,
          1002: 50,
          1003: 100
        }
      }
    }
  },
  factions: {
    registration: {
      fortuneCost: 1500,
      mitamaCost: 1500,
      forbiddenAddresses: [
        '0x7fb11087c21719C2e4f9Fc16408e8a97a46c92Ad', // Ryoshi Christmas
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
      60,
      120,
      180,
      240,
      300,
      360
    ],
    recallTax: 0.1
  },
  reputations: {
    points: {
      battle: {
        kill: -5,
        attacker: 1,
        defender: -1
      },
      deploy: 1,
      delegated: 5,
      recall: -1
    }
  },
  experience: {
    [ExperienceEventType.DAILY_CHECK_IN]: {
      points: 5,
      coolDown: 0
    },
    [ExperienceEventType.DAILY_CHECK_IN_WITH_TASKS]: {
      points: 25,
      coolDown: 0
    },
    [ExperienceEventType.DEX_SWAP_TASK]: {
      points: 10,
      coolDown: 0
    },
    [ExperienceEventType.PURCHASE_NFT_TASK]: {
      points: 10,
      coolDown: 0
    },
    [ExperienceEventType.FARM_ACTION_TASK]: {
      points: 10,
      coolDown: 0
    },
    [ExperienceEventType.DEPLOY_TROOPS]: {
      points: 5,
      coolDown: 3600
    },
    [ExperienceEventType.TROOP_KILLED]: {
      points: 1,
      coolDown: 0
    },
    [ExperienceEventType.STAKE_VIP]: {
      points: 2,
      coolDown: 1
    },
    [ExperienceEventType.STAKE_MITAMA]: {
      points: 0.1,
      coolDown: 1
    },
    [ExperienceEventType.ITEM_SOLD_SELLER]: {
      points: 1,
      coolDown: 0,
      usd: 3
    },
    [ExperienceEventType.OFFER_ACCEPTED_SELLER]: {
      points: 1,
      coolDown: 0,
      usd: 3
    },
    [ExperienceEventType.ITEM_SOLD_BUYER]: {
      points: 0.5,
      coolDown: 0,
      usd: 3
    },
    [ExperienceEventType.CLAIM_PLATFORM_REWARD]: {
      points: 50,
      coolDown: 7,
    },
    [ExperienceEventType.COMPOUND_PLATFORM_REWARD]: {
      points: 75,
      coolDown: 7,
    },
    [ExperienceEventType.CLAIM_MARKET_STAKING_REWARD]: {
      points: 5,
      coolDown: 1,
    },
    [ExperienceEventType.VERIFY_EMAIL]: {
      points: 20,
      coolDown: 0,
    }
  },
  bonusPoints: {
    "The Iron Bastion": [3, 2, 1, 0.5],
    "The Conflagration": [3, 2, 1, 0.5],
    "Volcanic Reach": [3, 2, 1, 0.5],
    "Sea Shrine": [4, 3, 1, 0.5],
    "Mitamic Fissure": [3, 2, 1, 0.5],
    "Classy Keep": [3, 2, 1, 0.5],
    "Dragon Roost": [4, 2, 1, 0.5],
    "N'yar Spire": [3, 2, 1, 0.5],
    "Ancestor's Final Rest": [3, 2, 1, 0.5],
    "Ebisus Bay": [2, 1.5, 1, 0.5],
    "Felisgarde": [4, 2, 1, 0.5],
    "Verdant Forest": [3, 2, 1, 0.5],
    "Buccaneer Beach": [2, 1.5, 1, 0.5],
    "Omoikane's Athenaeum": [4, 2, 1, 0.5],
    "Mitagi Retreat": [3, 2, 1, 0.5],
    "Ice Shrine": [3, 2, 1, 0.5],
    "Clutch of Fukurokujo": [3, 2, 1, 0.5],
    "Orcunheim": [3, 2, 1, 0.5],
    "The Infinite Nexus": [2, 1.5, 1, 0.5],
    "Venom's Descent": [2, 1.5, 1, 0.5],
  },
  controlPointDecay: {
    "The Iron Bastion": 0.01,
    "The Conflagration": 0.01,
    "Volcanic Reach": 0.01,
    "Ice Shrine": 0.01,
    "Clutch of Fukurokujo": 0.01,
    "Orcunheim": 0.01,
  }

}

export default ryoshiConfig;