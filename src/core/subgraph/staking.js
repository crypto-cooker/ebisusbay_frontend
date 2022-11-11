import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import {appConfig} from "@src/Config";

const config = appConfig();
const APIURL = `${config.urls.subgraph}staking`;

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});


export const getStakedRyoshi = async (walletAddress) => {
  const stakingQueryy = `
  query {
    account(id: "${walletAddress}") {
      id
      ryoshiStaked
      numberRyoshiStaked
    }
  }
`;

  const response = await new Promise((resolve) => {
    resolve(
      client.query({
        query: gql(stakingQueryy),
        fetchPolicy: 'no-cache',
      })
    );
  });

  const { account } = response.data;

  return {
    data: account,
  };
};