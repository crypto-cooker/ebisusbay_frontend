import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {appConfig} from "@src/config";
import {urlify} from "@market/helpers/utils";
import {Address} from "viem";

const config = appConfig();

class Exchange {

  private apollo;

  constructor() {
    this.apollo = new ApolloClient({
      uri: urlify(config.urls.subgraph.root, config.urls.subgraph.dex),
      cache: new InMemoryCache()
    });
  }

  async getPairs(addresses: Address[]) {
    const query = `
      query GetPairs($addresses: [String]) {
        pairs(where: {id_in: $addresses}) {
          id
          name
          token0 {
            id
            name
            decimals
          }
          token1 {
            id
            name
            decimals
          }
          reserve0
          reserve1
          reserveCRO
          reserveUSD
          token0Price
          token1Price
          block
          trackedReserveCRO
          untrackedVolumeUSD
          volumeToken0
          volumeToken1
          volumeUSD
          totalSupply
          totalTransactions
          timestamp
        }
      }
    `

    return this.apollo.query({
      query: gql(query),
      variables: {
        addresses: addresses.map(address => address.toLowerCase())
      }
    });
  }
}

export default Exchange;