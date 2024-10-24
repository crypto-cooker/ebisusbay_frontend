import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {appConfig} from "@src/config";
import {urlify} from "@market/helpers/utils";
import {Address} from "viem";
import chainConfigs, {SupportedChainId} from "@src/config/chains";

export class Info {

  private apollo;

  constructor(chainId: SupportedChainId) {
    const config = chainConfigs[chainId];
    this.apollo = new ApolloClient({
      uri: urlify(config.urls.subgraph.root, config.urls.subgraph.dex),
      cache: new InMemoryCache()
    });
  }

  async getPairs() {
    const query = `
    query GetPairs {
      pairDayDatas(orderBy: dailyVolumeUSD, orderDirection: desc) {
      dailyVolumeUSD
      pairAddress
      reserve0
      reserve1
      reserveUSD
      token0 {
        symbol
        totalLiquidity
        name
        id
        decimals
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
    `

    return this.apollo.query({
      query: gql(query),
    });
  }
}