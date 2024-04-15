import {appConfig} from "@src/Config";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import {PresaleVault, VaultContract} from "@src/core/services/api-service/graph/types";
import {urlify} from "@market/helpers/utils";

const config = appConfig();

class RyoshiPresale {
  private apollo;

  constructor() {
    this.apollo = new ApolloClient({
      uri: urlify(config.urls.subgraph.root, config.urls.subgraph.ryoshiPresale),
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

  async presaleVaults(address: string) {
    const query = `
      query RyoshiPresaleVaults($id: String) {
        presaleVaults(where: {beneficiary_: {id: $id}}) {
          startTime
          releasedBalance
          initalBalance
          id
          endTime
          duration
          currentBalance
          address
          beneficiary {
            id
            balance
          }
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

  async vaultContracts(address: string) {
    const query = `
      query RyoshiPresale ($id: String) {
        vaultContracts(where: {id: $id}) {
          startTime
          id
          duration
          cutoff
        }
      }
    `;

    return this.apollo.query<VaultContract[]>({
      query: gql(query),
      variables: {
        id: address.toLowerCase()
      }
    });
  }
}

export default RyoshiPresale;