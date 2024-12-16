import CmsRepository from "@src/core/services/api-service/cms/repositories/index";

class TokensRepository extends CmsRepository {

  async getSupportedTokens() {
    const response = await this.cms.get('tokens');

    return response.data;
  }

  async getCollectionMarketTokens(address: string, chainId: number) {
    const response = await this.cms.get(
      `tokens/collection/${address}`,
      {
        params: {
          chainId
        }
      }
    );

    return response.data.data;
  }
}

export default TokensRepository;