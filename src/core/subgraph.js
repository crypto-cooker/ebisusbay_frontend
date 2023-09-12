import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import {appConfig} from "../Config";
import {caseInsensitiveCompare} from "@src/utils";
import axios from "axios";

const config = appConfig();
const APIURL = `${config.urls.subgraph}${config.chain.id === '25' ? 'offers2' : 'offers-testnet'}`;

const FIRST = 1000;

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

export const getAllOffers = async (addresses, stateFilter, lastId) => {
  const allOffersQuery = `
  query($first: Int, $addresses: [String], $state: String, $lastId: String) {
    offers(first: $first, where: {nftAddress_in: $addresses, state: $state, id_gt: $lastId}) {
        id
        hash
        offerIndex
        nftAddress
        nftId
        buyer
        seller
        coinAddress
        price
        state
        timeCreated
        timeUpdated
        timeEnded
    }
  }
`;

  const response = await new Promise((resolve) => {
    resolve(
      client.query({
        query: gql(allOffersQuery),
        variables: {
          first: FIRST,
          addresses,
          state: stateFilter,
          lastId: lastId || '',
        },
        fetchPolicy: 'no-cache',
      })
    );
  });

  const { offers } = response.data;

  return {
    data: offers,
  };
};

export const getAllCollectionOffers = async (addresses, stateFilter, lastId) => {
  const allOffersQuery = `
  query($first: Int, $addresses: [String], $state: String, $lastId: String) {
    collectionOffers(first: $first, where: {nftAddress_in: $addresses, state: $state, id_gt: $lastId}) {
        id
        offerIndex
        nftAddress
        nftId
        buyer
        seller
        coinAddress
        price
        state
        timeCreated
        timeUpdated
        timeEnded
    }
  }
`;

  const response = await new Promise((resolve) => {
    resolve(
      client.query({
        query: gql(allOffersQuery),
        variables: {
          first: FIRST,
          addresses,
          state: stateFilter,
          lastId: lastId || '',
        },
        fetchPolicy: 'no-cache',
      })
    );
  });

  const { collectionOffers } = response.data;

  return {
    data: collectionOffers,
  };
};

export const getMyOffers = async (myAddress, stateFilter, lastId) => {
  const myOffersQuery = `
  query($first: Int, $buyer: String, $state: String, $lastId: String) {
    offers(first: $first, where: {buyer: $buyer, state: $state, id_gt: $lastId}) {
        id
        hash
        offerIndex
        nftAddress
        nftId
        buyer
        seller
        coinAddress
        price
        state
        timeCreated
        timeUpdated
        timeEnded
    }
  }
`;

  const response = await new Promise((resolve) => {
    resolve(
      client.query({
        query: gql(myOffersQuery),
        variables: {
          first: FIRST,
          buyer: myAddress.toLowerCase(),
          state: stateFilter.toString(),
          lastId: lastId || '',
        },
        fetchPolicy: 'no-cache',
      })
    );
  });

  const { offers } = response.data;

  return {
    data: offers,
  };
};

export const getMyCollectionOffers = async (myAddress, stateFilter, lastId, collectionAddress = null) => {
  const myOffersQuery = `
  query($first: Int, $buyer: String, $state: String, $lastId: String) {
    collectionOffers(first: $first, where: {buyer: $buyer, state: $state, id_gt: $lastId}) {
        id
        offerIndex
        nftAddress
        nftId
        buyer
        seller
        coinAddress
        price
        state
        timeCreated
        timeUpdated
        timeEnded
    }
  }
`;

  const response = await new Promise((resolve) => {
    resolve(
      client.query({
        query: gql(myOffersQuery),
        variables: {
          first: FIRST,
          buyer: myAddress.toLowerCase(),
          state: stateFilter.toString(),
          lastId: lastId || '',
        },
        fetchPolicy: 'no-cache',
      })
    );
  });

  const { collectionOffers } = response.data;

  const filteredOffers = collectionAddress ? collectionOffers.find((o) => caseInsensitiveCompare(o.nftAddress, collectionAddress)) : collectionOffers;

  return {
    data: filteredOffers,
  };
};

export const getFilteredOffers = async (nftAddress, nftId, walletAddress) => {
  const myOffersQuery = `
  query($first: Int) {
    offers(first: 1000, where: {nftAddress: "${nftAddress.toLowerCase()}", buyer: "${walletAddress.toLowerCase()}", nftId: "${nftId}"}) {
        id
        hash
        offerIndex
        nftAddress
        nftId
        buyer
        seller
        coinAddress
        price
        state
        timeCreated
        timeUpdated
        timeEnded
    }
  }
`;

  const response = await new Promise((resolve) => {
    resolve(
      client.query({
        query: gql(myOffersQuery),
        variables: {
          first: 100,
        },
        fetchPolicy: 'no-cache',
      })
    );
  });

  const { offers } = response.data;

  return {
    data: offers,
  };
};

export const getOffersForSingleNFT = async (nftAddress, nftId) => {
  const nftOffersQuery = `
  query($first: Int) {
    offers(first: 1000, where: { nftAddress: "${nftAddress}", nftId: "${nftId}"}) {
      id
      hash
      offerIndex
      nftAddress
      nftId
      buyer
      seller
      coinAddress
      price
      state
      timeCreated
      timeUpdated
      timeEnded
    }
  }
`;

  const response = await new Promise((resolve) => {
    resolve(
      client.query({
        query: gql(nftOffersQuery),
        variables: {
          first: 100,
        },
      })
    );
  });

  const { offers } = response.data;

  return {
    data: offers,
  };
};

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

export async function getOwners(blockNumber) {
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
  let queryBlockNumber = `
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
  try {
    let data;
      if(!blockNumber) {
        data = await getSubgraphData(SUBGRAPH, query, {}, "erc721Tokens");
      } else {
        console.log("blockNumber", blockNumber)
        data = await getSubgraphData(SUBGRAPH, queryBlockNumber, {}, "erc721Tokens");
      }
      if (data) {
          // DATA HERE
          return data;
      }
  } catch {}
  return undefined
}