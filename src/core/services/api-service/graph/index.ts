import RyoshiPresale from "@src/core/services/api-service/graph/subgraphs/ryoshi-presale";

class Graph {
  private ryoshiPresale;

  constructor(apiKey?: string) {
    this.ryoshiPresale = new RyoshiPresale();
  }

  async globalTotalPurchased() {
    const result = await this.ryoshiPresale.globalTotalPurchased();
    return !!result.data.total ? Number(result.data.total.total) : 0;
  }

  async userTotalPurchased(address: string) {
    const result = await this.ryoshiPresale.userTotalPurchased(address);
    return result.data.accounts.length > 0 ? Number(result.data.accounts[0].balance) : 0;
  }
}

export default Graph;