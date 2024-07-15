import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {appConfig} from "@src/config";
import {urlify} from "@market/helpers/utils";

const config = appConfig();

class Staking {

  private apollo;

  constructor() {
    this.apollo = new ApolloClient({
      uri: urlify(config.urls.subgraph.root, config.urls.subgraph.staking),
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