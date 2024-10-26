import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { appConfig } from '@src/config';
import { urlify } from '@market/helpers/utils';
import { Address } from 'viem';
import chainConfigs, { SupportedChainId } from '@src/config/chains';

export class Info {
  private apollo;

  constructor(chainId: SupportedChainId) {
    const config = chainConfigs[chainId];
    this.apollo = new ApolloClient({
      uri: urlify(config.urls.subgraph.root, config.urls.subgraph.dex),
      cache: new InMemoryCache(),
    });
  }

  async getPairs() {
    const query = `
      query MyQuery {
        pairs(orderBy: volumeUSD, orderDirection: desc) {
          id
          name
          volumeUSD
          reserveUSD
          block
          token0 {
            decimals
            name
            symbol
            derivedUSD
            derivedCRO
            id
            totalLiquidity
            pairDayDataBase(first: 1, orderBy: date, orderDirection: desc) {
              dailyVolumeUSD
              reserveUSD
              date
            }
            tradeVolumeUSD
          }
          token1 {
            decimals
            name
            symbol
            derivedUSD
            derivedCRO
            id
            totalLiquidity
            pairDayDataBase(first: 1, orderBy: date, orderDirection: desc) {
              dailyVolumeUSD
              reserveUSD
              date
            }
            tradeVolumeUSD
          }
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
    });
  }

  async getTokens() {
    const query = `
    query GetTokens {
      tokens(orderBy: tradeVolumeUSD, orderDirection: desc) {
        decimals
        name
        symbol
        tradeVolume
        tradeVolumeUSD
        totalLiquidity
        derivedUSD
        id
        tokenDayData(first: 1, orderBy: date, orderDirection: desc, skip: 1) {
          date
          dailyVolumeToken
          dailyVolumeUSD
          priceUSD
          totalLiquidityToken
          totalLiquidityUSD
        }
      }
    }
    `;

    return this.apollo.query({
      query: gql(query),
    });
  }
}
