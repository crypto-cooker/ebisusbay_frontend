import {
  RyoshiConfig,
  RyoshiConfigCollections,
  RyoshiConfigTraitInclusionType
} from "@src/components-v2/feature/ryoshi-dynasties/game/types";

const collections: RyoshiConfigCollections[] = [
  {
    slug: 'ryoshi-tales-vip',
    address: '0xE49709A3B59d708f50AA3712F2E5a84b7707664C'
  },
  {
    slug: 'ryoshi-tales-halloween',
    address: '0x54E61e2043f894475D17D344250F1983f7F7e6D3'
  },
  {
    slug: 'ryoshi-tales-christmas',
    address: '0xe3Ef45955b507895779a6A8911bBc48E0E17B11C'
  },
  {
    slug: 'fortune-guards',
    address: '0x013f83434356c0a20698605eBAb337aab966AF88'
  },
  {
    slug: 'fortuneteller',
    address: '0x04636c536537a8b7F05eDbA2cEBe1FaDd711D566'
  },
  {
    slug: 'ryoshi-tales',
    address: '0x562e3e2d3f69c53d5a5728e8d7f977f3de150e04'
  },
  {
    slug: 'mad-meerkat',
    address: '0x89dBC8Bd9a6037Cbd6EC66C4bF4189c9747B1C56'
  },
  {
    slug: 'cowz',
    address: '0xdbFDf81D1fDD2e79e8ffaDE50c219452587e9488'
  },
  {
    slug: 'aiko-legends',
    address: '0xFD90697db5D40B37B86C958106A342088f11AA84'
  }
];

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
          1: 0.06,
          2: 0.1,
          3: 0.12,
          4: 0.15,
          8: 0.24,
          12: 0.5,
        }
      },
      nft: {
        maxSlots: 5,
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
              bonus: {
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
              }
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
                { id: 2, bonus: 0 },
                { id: 3, bonus: 0 },
                { id: 4, bonus: 0 },
                { id: 5, bonus: 0 },
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
            ...collections.find(c => c.slug === 'ryoshi-tales')!,
            active: true,
            minId: 701,
            maxId: 1000,
            apr: {
              multipliers: [],
              adders: [
                { percentile: 5, value: 0.25 },
                { percentile: 10, value: 0.2 },
                { percentile: 20, value: 0.15 },
                { percentile: 100, value: 0.1 },
              ],
              ids: [
                { id: 774, bonus: 0.75 }
              ]
            },
            troops: {
              values: [],
              bonus: {
                value: 50,
                traits: [
                  {
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    type: 'accessory',
                    values: [
                      'radiant wyvern staff'
                    ]
                  }
                ]
              }
            }
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
              { id: 2, bonus: 0 },
              { id: 3, bonus: 0 },
              { id: 4, bonus: 0 },
              { id: 5, bonus: 0 },
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
            ...collections.find(c => c.slug === 'ryoshi-tales')!,
            active: true,
            minId: 701,
            maxId: 1000,
            traits: [
              {
                type: 'accessory',
                inclusion: RyoshiConfigTraitInclusionType.EXCLUDE,
                values: [
                  'none'
                ]
              },
              {
                type: 'companion',
                inclusion: RyoshiConfigTraitInclusionType.EXCLUDE,
                values: [
                  'none'
                ]
              },
              {
                type: 'accessory',
                inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                values: [
                  'nightfall scepter of premonition'
                ]
              }
            ],
            multipliers: [
              { percentile: 5, value: 50 },
              { percentile: 10, value: 30 },
              { percentile: 20, value: 20 },
              { percentile: 100, value: 10 },
            ],
            ids: [],
            bonus: [
              {
                value: 500,
                traits: [
                  {
                    type: 'accessory',
                    inclusion: RyoshiConfigTraitInclusionType.INCLUDE,
                    values: [
                      'nightfall scepter of premonition'
                    ]
                  }
                ]
              },
            ]
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
            active: false,
            fortune: 0
          },
          {
            ...collections.find(c => c.slug === 'aiko-legends')!,
            active: false,
            fortune: 0
          },
          {
            ...collections.find(c => c.slug === 'mad-meerkat')!,
            active: false,
            fortune: 0
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
      fortuneCost: 0,
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
        '0xcF7C77967FaD74d0B5104Edd476db2C6913fb0e3', // Land Deeds
        '0x562e3e2d3f69c53d5a5728e8d7f977f3de150e04', // Ryoshi Tales,
        '0xF098C2aD290f32c8666ace27222d3E65cECE43b9', // Ryoshi Heroes
        '0xb2925FFC01907170493F94c1efb2Fac107a83b9F'  // Ryoshi Vaults
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
    ],
    recallTax: 0.01
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
  },
  experience: {
    DAILY_CHECK_IN: {
      points: 5,
      coolDown: 0
    },
    DEPLOY_TROOPS: {
      points: 5,
      coolDown: 3600
    },
    TROOP_KILLED: {
      points: 1,
      coolDown: 0
    },
    STAKE_VIP: {
      points: 2,
      coolDown: 1
    },
    STAKE_MITAMA: {
      points: 0.1,
      coolDown: 1
    },
    ITEM_SOLD_SELLER: {
      points: 1,
      coolDown: 0,
      usd: 3
    },
    OFFER_ACCEPTED_SELLER: {
      points: 1,
      coolDown: 0,
      usd: 3
    },
    ITEM_SOLD_BUYER: {
      points: 0.5,
      coolDown: 0,
      usd: 3
    },
    CLAIM_PLATFORM_REWARD: {
      points: 50,
      coolDown: 7,
    },
    COMPOUND_PLATFORM_REWARD: {
      points: 75,
      coolDown: 7,
    },
    CLAIM_MARKET_STAKING_REWARD: {
      points: 5,
      coolDown: 1,
    },
    VERIFY_EMAIL: {
      points: 20,
      coolDown: 0,
    },
  },
  bonusPoints: {
    "The Iron Bastion": [3, 2, 1, 0.5],
    "The Conflagration": [3, 2, 1, 0.5],
    "Volcanic Reach": [3, 2, 1, 0.5],
    "Seashrine": [4, 3, 1, 0.5],
    "Mitamic Fissure": [3, 2, 1, 0.5],
    "Classy Keep": [3, 2, 1, 0.5],
    "Dragons Roost": [4, 2, 1, 0.5],
    "N'yar Spire": [3, 2, 1, 0.5],
    "Ancestors Final Rest": [3, 2, 1, 0.5],
    "Ebisus Bay": [2, 1.5, 1, 0.5],
    "Felisgarde": [4, 2, 1, 0.5],
    "Verdant Forest": [3, 2, 1, 0.5],
    "Buccaneer Beach": [2, 1.5, 1, 0.5],
    "Omoikanes Athenaeum": [4, 2, 1, 0.5],
    "Mitagi Retreat": [3, 2, 1, 0.5],
    "Ice Shrine": [3, 2, 1, 0.5],
    "Clutch Of Fukurokujo": [3, 2, 1, 0.5],
    "Orcunheim": [3, 2, 1, 0.5],
    "The Infinite Nexus": [2, 1.5, 1, 0.5],
    "Venoms Descent": [2, 1.5, 1, 0.5],
  },
  controlPointDecay: {
    "The Iron Bastion": 0.01,
    "The Conflagration": 0.01,
    "Volcanic Reach": 0.01,
    "Ice Shrine": 0.01,
    "Clutch Of Fukurokujo": 0.01,
    "Orcunheim": 0.01,
  }
}

export default ryoshiConfig;