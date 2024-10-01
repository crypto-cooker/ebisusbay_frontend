import {appConfig} from "@src/config";
import {ApolloClient, gql, InMemoryCache} from '@apollo/client';
import {urlify} from "@market/helpers/utils";
import {StakedTokenType} from "@src/core/services/api-service/types";
import {getAppChainConfig} from "@src/config/hooks";
import {ChainId} from "@pancakeswap/chains";

const config = appConfig();

class RyoshiDynasties {
  private apollo;
  private chainId;

  constructor(chainId: number) {
    const config = getAppChainConfig(chainId ?? ChainId.CRONOS);
    this.chainId = chainId;
    this.apollo = new ApolloClient({
      uri: urlify(config.urls.subgraph.root, config.urls.subgraph.ryoshiDynasties),
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

  async getErc20Account(walletAddress: string) {
    const query = `
      query ERC20Query($address: String) {
        erc20Accounts(where: {id: $address}) {
          id
          mitamaBalance
          fortuneBalance
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
      variables: {
        address: walletAddress.toLowerCase()
      }
    });
  }

  async stakedTokens(walletAddress: string, type: StakedTokenType) {
    const query = `
      query StakedTokensQuery($address: String, $type: String) {
        stakedTokens(where: {user: $address, type: $type}) {
          id
          contractAddress
          tokenId
          amount
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
      variables: {
        address: walletAddress.toLowerCase(),
        type: type.toUpperCase()
      }
    });
  }

  async stakingAccounts(walletAddress: string) {
    const query = `
      query StakingAccountsQuery($address: String) {
        stakingAccounts(where: {id: $address}) {
          id
          totalStaked
          vaults(where: {open: true}, first: 50, orderBy: startTime, orderDirection: desc) {
            balance
            id
            index
            length
            open
            startTime
            endTime
            vaultId
          }
          lpVaults(where: {open: true}, first: 50, orderBy: startTime, orderDirection: desc) {
            balance
            id
            index
            length
            open
            pool
            startTime
            endTime
            vaultId
          }
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
      variables: {
        address: walletAddress.toLowerCase(),
      }
    });
  }

  async meeple(walletAddress: string) {
    const query = `
      query UserMeeplesQuery($address: String) {
        meeple(id: $address) {
          id
          activeAmount
          lastUpkeep
          user
        }
      }
    `;

    return this.apollo.query({
      query: gql(query),
      variables: {
        address: walletAddress.toLowerCase(),
      }
    });
  }
}

export default RyoshiDynasties;