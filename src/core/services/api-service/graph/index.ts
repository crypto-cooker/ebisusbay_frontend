import RyoshiPresale from "@src/core/services/api-service/graph/subgraphs/ryoshi-presale";
import RyoshiDynasties from "@src/core/services/api-service/graph/subgraphs/ryoshi-dynasties";
import {
  Erc20Account,
  FortuneStakingAccount,
  StakedToken,
  StakingAccount
} from "@src/core/services/api-service/graph/types";
import {StakedTokenType} from "@src/core/services/api-service/types";

class Graph {
  private ryoshiPresale;
  private ryoshiDynasties;

  constructor(apiKey?: string) {
    this.ryoshiPresale = new RyoshiPresale();
    this.ryoshiDynasties = new RyoshiDynasties();
  }

  async globalTotalPurchased() {
    const result = await this.ryoshiPresale.globalTotalPurchased();
    return !!result.data.total ? Number(result.data.total.total) : 0;
  }

  async userTotalPurchased(address: string) {
    const result = await this.ryoshiPresale.userTotalPurchased(address);
    return result.data.accounts.length > 0 ? Number(result.data.accounts[0].balance) : 0;
  }

  async getUserStakedFortune(address: string) {
    const result = await this.ryoshiDynasties.getUserStakedFortune(address);
    return result.data.fortuneStakingAccounts.length > 0 ? result.data.fortuneStakingAccounts[0] as FortuneStakingAccount : null;
  }

  async getErc20Account(address: string) {
    const result = await this.ryoshiDynasties.getErc20Account(address);
    return result.data.erc20Accounts.length > 0 ? result.data.erc20Accounts[0] as Erc20Account : null
  }

  async getStakedTokens(address: string, type: StakedTokenType) {
    const result = await this.ryoshiDynasties.stakedTokens(address, type);
    return result.data.stakedTokens as StakedToken[];
  }

  async getBankStakingAccount(address: string) {
    const result = await this.ryoshiDynasties.stakingAccounts(address);
    return result.data.stakingAccounts.length > 0 ? result.data.stakingAccounts[0] as StakingAccount : null;
  }
}

export default Graph;