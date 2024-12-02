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
        pairs(orderBy:reserveUSD, orderDirection:desc) {
          id
          name
          reserveUSD
          timestamp
          volumeUSD
          pairHourData(first: 24, orderBy: hourStartUnix, orderDirection: desc) {
            hourlyVolumeUSD
            hourStartUnix
          }
          token0 {
            id
            name
            symbol
            decimals
            derivedUSD
            totalLiquidity
          }
          token1 {
            id
            name
            symbol
            decimals
            derivedUSD
            totalLiquidity
          }
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
    });
  }

  async getPair(address: string) {
    const query = `
      query MyQuery {
        pair(id: "${address}") {
          id
          name
          reserveUSD
          timestamp
          volumeUSD
          pairHourData(first: 24, orderBy: hourStartUnix, orderDirection: desc) {
            hourlyVolumeUSD
            hourStartUnix
            reserveUSD
          }
          token0 {
            id
            name
            symbol
            decimals
            derivedUSD
            totalLiquidity
          }
          token1 {
            id
            name
            symbol
            decimals
            derivedUSD
            totalLiquidity
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
      tokens( orderBy: tradeVolumeUSD, orderDirection: desc) {
        decimals
        name
        symbol
        tradeVolume
        tradeVolumeUSD
        totalLiquidity
        derivedUSD
        id
        tokenDayData(first: 2, orderBy: date, orderDirection: desc) {
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

  async getProtocolData() {
    const query = `
      query GetProtocolData {
        overallDayDatas(orderBy: date, orderDirection: desc, first: 2) {
          dailyVolumeUSD
          totalLiquidityUSD
          totalTransactions
          date
          id
          dailyVolumeUntracked
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
    });
  }

  async getProtocolChartData() {
    const query = `
    query GetChartData {
      overallDayDatas(first: 1000, orderBy: date, orderDirection: desc) {
        dailyVolumeUSD
        totalLiquidityUSD
        totalTransactions
        date
        id
      }
    }
    `;

    return this.apollo.query({
      query: gql(query),
    });
  }

  async getPairVolumeData(address: string) {
    const query = `
      query MyQuery {
        pairDayDatas(where: {pairAddress: "${address}"}, first:1000, orderBy: date, orderDirection: desc) {
          dailyVolumeCRO
          dailyVolumeToken0
          dailyVolumeToken1
          dailyVolumeUSD
          date
          id
          pairAddress
          reserve0
          reserve1
          reserveUSD
          totalSupply
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
    });
  }

  async getProtocolChartDataTvl() {
    const query = `
    query GetTokens {
      tokens( orderBy: tradeVolumeUSD, orderDirection: desc) {
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

  async getTransactions() {
    const query = `
      query GetTransactions {
        transactions (orderBy: timestamp, orderDirection: desc) {
          timestamp
          id
          burns {
            amount1
            amount0
            amountUSD
            token0 {
              name
              symbol
              id
            }
            token1 {
              id
              name
              symbol
            }
            sender
          }
          mints {
            amountUSD
            amount0
            amount1
            token0 {
              name
              symbol
              id
            }
            token1 {
              id
              name
              symbol
            }
            sender
          }
          swaps {
            amount0In
            amount0Out
            amount1In
            amount1Out
            amountUSD
            timestamp
            id
            token0 {
              id
              name
              symbol
            }
            token1 {
              id
              name
              symbol
            }
            sender
          }
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
    });
  }

  async getTransactionsForToken(address: string) {
    const query = `
      query GetTransactions {
        transactions (
        where: {
            or: [
              { 
              burns_:
                {
                  token0:"${address}"
                }
              },{
              burns_:
                {
                  token1:"${address}"
                }
              },{ 
              mints_:
                {
                  token0:"${address}"
                }
              },{
              mints_:
                {
                  token1:"${address}"
                }
              },{ 
              swaps_:
                {
                  token0:"${address}"
                }
              },{
              swaps_:
                {
                  token1:"${address}"
                }
              }
            ]          
          },
        orderBy: timestamp, orderDirection: desc) {
          timestamp
          id
          burns {
            amount1
            amount0
            amountUSD
            token0 {
              name
              symbol
              id
            }
            token1 {
              id
              name
              symbol
            }
            sender
          }
          mints {
            amountUSD
            amount0
            amount1
            token0 {
              name
              symbol
              id
            }
            token1 {
              id
              name
              symbol
            }
            sender
          }
          swaps {
            amount0In
            amount0Out
            amount1In
            amount1Out
            amountUSD
            timestamp
            id
            token0 {
              id
              name
              symbol
            }
            token1 {
              id
              name
              symbol
            }
            sender
          }
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
    });
  }

  async getTransactionsForPair(address: string) {
    const query = `
      query GetTransactions {
        transactions (
        where: {
            or: [
              { 
              burns_:
                {
                  pair:"${address}"
                }
              },{ 
              mints_:
                {
                  pair:"${address}"
                }
              },{ 
              swaps_:
                {
                  pair:"${address}"
                }
              }
            ]          
          },
        orderBy: timestamp, orderDirection: desc) {
          timestamp
          id
          burns {
            amount1
            amount0
            amountUSD
            token0 {
              name
              symbol
              id
            }
            token1 {
              id
              name
              symbol
            }
            sender
          }
          mints {
            amountUSD
            amount0
            amount1
            token0 {
              name
              symbol
              id
            }
            token1 {
              id
              name
              symbol
            }
            sender
          }
          swaps {
            amount0In
            amount0Out
            amount1In
            amount1Out
            amountUSD
            timestamp
            id
            token0 {
              id
              name
              symbol
            }
            token1 {
              id
              name
              symbol
            }
            sender
          }
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
    });
  }

  async getTokenData(address: string) {
    const query = `
      query MyQuery {
          token(id: "${address}") {
            id
            decimals
            derivedUSD
            name
            symbol
            totalLiquidity
            totalTransactions
            tradeVolume
            tokenDayData(orderBy: date, orderDirection: desc, first: 2) {
              priceUSD
              dailyVolumeUSD
              date
              totalLiquidityUSD
              dailyVolumeToken
              dailyTxns
            }
            tradeVolumeUSD
          }
        }
      `;

    return this.apollo.query({
      query: gql(query),
    });
  }

  async getTokenVolumeData(address: string) {
    const query = `
      query MyQuery {
        token(id: "${address}") {
          tokenDayData(first: 1000, orderBy: date, orderDirection: desc) {
            dailyVolumeUSD
            dailyVolumeToken
            priceUSD
            date
            id
            totalLiquidityUSD
            totalLiquidityToken
            totalLiquidityCRO
            dailyVolumeCRO
            dailyTxns
          }
        }
      }
      `;

    return this.apollo.query({
      query: gql(query),
    });
  }

  async getPairsForToken(address: string) {
    const query = `
      query MyQuery {
         pairs(
          where: {
            or: [
              {
                token0:"${address}"
              },
              {
                token1:"${address}"
              }
            ]          
          },
        ) {
          id
          name
          reserveUSD
          timestamp
          volumeUSD
          pairHourData(first: 24, orderBy: hourStartUnix, orderDirection: desc) {
            hourlyVolumeUSD
            hourStartUnix
          }
          token0 {
            id
            name
            symbol
            decimals
            derivedUSD
            totalLiquidity
          }
          token1 {
            id
            name
            symbol
            decimals
            derivedUSD
            totalLiquidity
          }
        }
      }
      `;

    return this.apollo.query({
      query: gql(query),
    });
  }
  async search(searchString: string) {
    const query = `
      query MyQuery {
        tokens(where: {
          or: [
            { name_contains_nocase: "${searchString}" },
            { symbol_contains_nocase: "${searchString}" },
            { id: "${searchString}" }
          ]
        }) {
          id
          name
          decimals
          derivedUSD
          symbol
        }

        pairs(where: {
          or: [
            { token0_: { name_contains_nocase: "${searchString}" } },
            { token0_: { symbol_contains_nocase: "${searchString}" } },
            { token0_: { id: "${searchString}" } },
            { token1_: { name_contains_nocase: "${searchString}" } },
            { token1_: { symbol_contains_nocase: "${searchString}" } },
            { token1_: { id: "${searchString}" } },
            { name_contains_nocase: "${searchString}" },
            { id: "${searchString}" }
          ]
        }) {
          id
          name
          reserveUSD
          token0 {
            decimals
            derivedUSD
            name
            id
            symbol
          }
          token1 {
            decimals
            derivedUSD
            name
            id
            symbol
          }
        }
      }

      `;

    return this.apollo.query({
      query: gql(query),
    });
  }
}
