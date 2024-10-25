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
        query GetPairs {
          pairDayDatas(orderBy: dailyVolumeUSD, orderDirection: desc) {
          dailyVolumeUSD
          pairAddress
          reserveUSD
          token0 {
            symbol
            totalLiquidity
            name
            decimals
            id
          }   
          token1 {
            symbol
            totalLiquidity
            name
            id
            decimals
          }
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
    });
  }

  async getTokens() {
    const query=`
    query GetTokens {
      tokenDayDatas {
        dailyVolumeToken
        dailyVolumeUSD
        id
        priceUSD
        totalLiquidityUSD
        token {
          decimals
          name
          symbol
          totalLiquidity
        }
      }
    }
    `

    return this.apollo.query({
      query:gql(query),
    });
  }
}
