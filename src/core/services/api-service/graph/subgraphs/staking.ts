import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {appConfig} from "@src/Config";

const config = appConfig();

class Staking {

  private apollo;

  constructor() {
    this.apollo = new ApolloClient({
      uri: `${config.urls.subgraph}staking`,
      cache: new InMemoryCache()
    });
  }

  async getStakedRyoshi(address: string) {
    const query = `
      query GetStakedRyoshi($address: String) {
        account(id: $address) {
          id
          ryoshiStaked
          numberRyoshiStaked
        }
      }
    `

    return this.apollo.query({
      query: gql(query),
      variables: {
        address: address.toLowerCase()
      }
    });
  }
}

export default Staking;