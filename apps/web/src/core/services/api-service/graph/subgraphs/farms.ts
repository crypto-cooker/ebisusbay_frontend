import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {appConfig} from "@src/config";
import {urlify} from "@market/helpers/utils";
import {getAppChainConfig} from "@src/config/hooks";

const config = appConfig();

class Farms {

  private apollo;

  constructor(chainId: number) {
    const config = getAppChainConfig(chainId ?? ChainId.CRONOS);
    this.apollo = new ApolloClient({
      uri: urlify(config.urls.subgraph.root, config.urls.subgraph.farms),
      cache: new InMemoryCache()
    });
  }

  async getUser(address: string) {
    const query = `
      query FarmUsers($address: String) {
        users(where: {address: $address}) {
          id
          address
          amount
          pool {
            id,
            pair
          }
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

export default Farms;