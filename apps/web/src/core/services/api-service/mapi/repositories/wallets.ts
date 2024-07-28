import MapiRepository from "@src/core/services/api-service/mapi/repositories/index";
import WalletsQuery from "@src/core/services/api-service/mapi/queries/wallets";

class WalletsRepository extends MapiRepository {

  async get(query: WalletsQuery) {
    return await this.api.get(`v2/wallets`, {
      params: {...query.defaultParams(), ...query?.toQuery()}
    });
  }
}

export default WalletsRepository;