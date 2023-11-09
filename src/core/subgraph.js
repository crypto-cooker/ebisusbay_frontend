import axios from "axios";
import {PokerCollection} from "@src/core/services/api-service/types";


export async function getSubgraphData(subgraph, query, variables, dataName) {
  let lastId = "";
  let foundData = [];
  // console.log("getSubgraphData", subgraph, query, variables, dataName)
  if (query.includes("$lastID: String")) { 
    while (true) {
        variables["lastID"] = lastId
        let response = await axios.post(subgraph, {'query': query, 'variables': variables})
        let data = response.data.data[dataName];
        if (data.length == 0) break
        foundData.push(...data);
        lastId = data.slice(-1)[0]['id']
    }
} else {
    let response = await axios.post(subgraph, {'query': query, 'variables': variables});
    return response.data.data[dataName];
}
return foundData;
}

export async function getOwners(collection) {
  const SUBGRAPH = "https://cronos-graph.ebisusbay.com:8000/subgraphs/name/ebisusbay/staked-owners";

  let query = `
      query owners($lastID: String) {
        erc721Tokens(where: {contract: "0xd87838a982a401510255ec27e603b0f5fea98d24", id_gt: $lastID}, first: 1000) {
              id
              owner {
                    id
              }
              identifier
        }
  }
  `
  let queryDiamonds = `
      query owners($lastID: String) {
        erc721Tokens(where: {contract: "0xd87838a982a401510255ec27e603b0f5fea98d24", id_gt: $lastID}, first: 1000, block: {number: 10176588}) {
              id
              owner {
                    id
              }
              identifier
        }
  }
  `
  let queryClubs = `
      query owners($lastID: String) {
        erc721Tokens(where: {contract: "0xd87838a982a401510255ec27e603b0f5fea98d24", id_gt: $lastID}, first: 1000, block: {number: 10636179}) {
              id
              owner {
                    id
              }
              identifier
        }
  }
  `
  try {
    let data;
      if(collection == "Live") {
        data = await getSubgraphData(SUBGRAPH, query, {}, "erc721Tokens");
        // console.log("Live: ", data)
      } else if(collection == "Diamonds") {
        data = await getSubgraphData(SUBGRAPH, queryDiamonds, {}, "erc721Tokens");
        // console.log("Diamonds: ", data)
      } else if(collection == "Clubs") {
        data = await getSubgraphData(SUBGRAPH, queryClubs, {}, "erc721Tokens");
        // console.log("Clubs: ", data)
      }
      if (data) {
          // DATA HERE
          return data;
      }
  } catch {}
  return undefined
}