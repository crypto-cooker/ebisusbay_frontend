import {appConfig} from "@src/Config";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const config = appConfig();

class RyoshiPresale {
  private apollo;

  constructor() {
    this.apollo = new ApolloClient({
      uri: `${config.urls.subgraph}ryoshi-presale`,
      cache: new InMemoryCache()
    });
  }

  query(query: any) {
    return this.apollo.query({
      query: gql`${query}`
    });
  }

  mutate(mutation: any) {
    return this.apollo.mutate({
      mutation: gql`${mutation}`
    });
  }

  async globalTotalPurchased() {
    const query = `
      query RyoshiPresale {
        total(id: "0") {
          total
        }
      }
    `;

    return this.apollo.query({
      query: gql(query)
    });
  }

  async userTotalPurchased(address: string) {
    const query = `
      query RyoshiPresale ($id: String) {
        accounts(where: {id: $id}) {
          balance
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
      variables: {
        id: address.toLowerCase()
      }
    });
  }
}

export default RyoshiPresale;