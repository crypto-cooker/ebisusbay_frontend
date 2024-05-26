import RyoshiPresale from "@src/core/services/api-service/graph/subgraphs/ryoshi-presale";
import RyoshiDynasties from "@src/core/services/api-service/graph/subgraphs/ryoshi-dynasties";
import {
  Erc20Account,
  FortuneStakingAccount, Meeple, PresaleVault,
  StakedToken,
  StakingAccount, User, VaultContract
} from "@src/core/services/api-service/graph/types";
import {StakedTokenType} from "@src/core/services/api-service/types";
import Staking from "@src/core/services/api-service/graph/subgraphs/staking";
import Farms from "@src/core/services/api-service/graph/subgraphs/farms";

class Graph {
  private ryoshiPresale;
  private ryoshiDynasties;
  private staking;
  private farms;

  constructor(apiKey?: string) {
    this.ryoshiPresale = new RyoshiPresale();
    this.ryoshiDynasties = new RyoshiDynasties();
    this.staking = new Staking();
    this.farms = new Farms();
  }

  async globalTotalPurchased() {
    const result = await this.ryoshiPresale.globalTotalPurchased();
    return !!result.data.total ? Number(result.data.total.total) : 0;
  }

  async userTotalPurchased(address: string) {
    const result = await this.ryoshiPresale.userTotalPurchased(address);
    return result.data.accounts.length > 0 ? Number(result.data.accounts[0].balance) : 0;
  }

  async getPresaleVault(address: string) {
    const presaleVaults = await this.ryoshiPresale.presaleVaults(address);
    if (presaleVaults.data.presaleVaults.length < 1) return null;

    // const vaultContracts = await this.ryoshiPresale.vaultContracts(presaleVaults.data[0].id);
    // if (vaultContracts.data.length < 1) return null;

    return presaleVaults.data.presaleVaults[0] as PresaleVault;
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

  async getStakedRyoshi(address: string) {
    const result = await this.staking.getStakedRyoshi(address);
    return result.data.account;
  }

  async getUserMeeples(address: string) {
    const result = await this.ryoshiDynasties.meeple(address);
    return result.data.meeple as Meeple;
  }

  async getFarmsUser(address: string) {
    const result = await this.farms.getUser(address);
    return result.data.users as User[];
  }
}

export default Graph;