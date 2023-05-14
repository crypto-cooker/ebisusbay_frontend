export const ryoshiConfig = {
  staking: {
    bank: {
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
      ]
    }
  }
}