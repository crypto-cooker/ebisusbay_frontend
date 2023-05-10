import {appConfig} from "@src/Config";
import {ApolloClient, InMemoryCache, gql, ApolloQueryResult} from '@apollo/client';
import {urlify} from "@src/utils";

const config = appConfig();

class RyoshiDynasties {
  private apollo;

  constructor() {
    this.apollo = new ApolloClient({
      uri: urlify(config.urls.subgraph, 'ryoshi-dynasties'),
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

  async getUserStakedFortune(address: string) {
    const query = `
      query FortuneStakingQuery($address: String) {
        fortuneStakingAccounts(where: {user: $address}) {
          user
          balance
          startTime
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
      variables: {
        address: address.toLowerCase()
      }
    });
  }
}

export default RyoshiDynasties;