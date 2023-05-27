export const ryoshiConfig = {
  staking: {
    bank: {
      fortune: {
        minimum: 120,
        termLength: 90,
        apr: {
          1: 0.12,
          2: 0.17,
          3: 0.2,
          4: 0.3,
          8: 1.2,
          12: 2,
        }
      },
      nft: {
        maxSlots: 5,
        collections: [
          {
            slug: 'ryoshi-tales-vip',
            maxSupply: 10000,
            multipliers: [
              {percentile: 5, value: 0.5},
              {percentile: 10, value: 0.3},
              {percentile: 20, value: 0.2},
              {percentile: 100, value: 0.1},
            ]
          },
          {
            slug: 'ryoshi-tales-halloween',
            maxSupply: 2500,
            multipliers: [
              {percentile: 5, value: 0.25},
              {percentile: 10, value: 0.15},
              {percentile: 20, value: 0.1},
              {percentile: 100, value: 0.05},
            ]
          },
          {
            slug: 'ryoshi-tales-christmas',
            maxSupply: 2500,
            multipliers: [
              {percentile: 5, value: 0.25},
              {percentile: 10, value: 0.15},
              {percentile: 20, value: 0.1},
              {percentile: 100, value: 0.05},
            ]
          }
        ],
      }
    },
    barracks: {
      maxSlots: 5,
      bonusTroops: 2,
      eligibility: [
        {
          slug: 'ryoshi-tales-vip',
          traits: [
            {
              type: 'tools',
              inclusion: 'include',
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
                'tachi',
                'tanto',
                'thammer',
                'trident',
                'wakizashi',
              ]
            },
          ]
        },
        {
          slug: 'ryoshi-tales-halloween',
          traits: [
            {
              type: 'tools',
              inclusion: 'exclude',
              values: [
                'none'
              ]
            },
          ]
        },
        {
          slug: 'ryoshi-tales-christmas',
          traits: [
            {
              type: 'miscellaneous',
              inclusion: 'include',
              values: [
                'candy cane'
              ]
            },
          ]
        }
      ]
    }
  },
  rewards: {
    daily: [1, 2, 3, 5, 8, 13, 21]
  }
}