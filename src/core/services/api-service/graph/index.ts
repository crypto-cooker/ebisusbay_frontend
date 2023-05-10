import RyoshiPresale from "@src/core/services/api-service/graph/subgraphs/ryoshi-presale";
import RyoshiDynasties from "@src/core/services/api-service/graph/subgraphs/ryoshi-dynasties";

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
    return result.data;
  }

  async getErc20Account(address: string) {
    const result = await this.ryoshiDynasties.getErc20Account(address);
    return result.data;
  }
}

export default Graph;