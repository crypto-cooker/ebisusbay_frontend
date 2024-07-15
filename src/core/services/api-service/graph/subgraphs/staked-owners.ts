import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {appConfig} from "@src/config";
import {urlify} from "@market/helpers/utils";

const config = appConfig();

class StakedOwners {

  private apollo;

  constructor() {
    this.apollo = new ApolloClient({
      uri: urlify(config.urls.subgraph.root, config.urls.subgraph.stakedOwners),
      cache: new InMemoryCache()
    });
  }

  async getOwners(address: string, blockNumber?: number) {
    const query = {
      query: gql(`
        query owners($lastID: String, $contract: String) {
          erc721Tokens(where: {contract: $contract, id_gt: $lastID}, first: 1000) {
            id
            owner {
              id
            }
            identifier
          }
        }
      `),
      variables: {
        contract: '0xd87838a982a401510255ec27e603b0f5fea98d24'
      }
    }

    const queryBlockNumber = {
      query: gql(`
        query owners($lastID: String, $contract: String, $block: Int) {
          erc721Tokens(where: {contract: $contract, id_gt: $lastID}, first: 1000, block: {number: $block}) {
            id
            owner {
              id
            }
            identifier
          }
        }
      `),
      variables: {
        contract: '0xd87838a982a401510255ec27e603b0f5fea98d24',
        block: blockNumber
      }
    }

    return getAll(this.apollo, !!blockNumber ? queryBlockNumber : query, 'erc721Tokens');
  }
}

export default StakedOwners;

async function getAll(apolloClient: ApolloClient<any>, query: any, dataName: string) {
  let lastId = "";
  let foundData = [];
  // console.log("getSubgraphData", subgraph, query, variables, dataName)
  if (query.includes("$lastID: String")) {
    while (true) {
      query.variables["lastID"] = lastId
      let response = await apolloClient.query(query);
      let data = response.data.data[dataName];
      if (data.length == 0) break
      foundData.push(...data);
      lastId = data.slice(-1)[0]['id']
    }
  } else {
    let response = await apolloClient.query(query);
    return response.data.data[dataName];
  }
  return foundData;
}