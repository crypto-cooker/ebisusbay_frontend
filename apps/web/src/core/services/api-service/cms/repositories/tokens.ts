import CmsRepository from "@src/core/services/api-service/cms/repositories/index";

class TokensRepository extends CmsRepository {

  async getSupportedTokens() {
    const response = await this.cms.get('tokens');

    return response.data;
  }
  
}

export default TokensRepository;