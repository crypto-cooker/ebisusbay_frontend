import MapiRepository from "@src/core/services/api-service/mapi/repositories/index";
import WalletsQuery from "@src/core/services/api-service/mapi/queries/wallets";
import WalletNft from "@src/core/models/wallet-nft";

class WalletsRepository extends MapiRepository {

  async get(query: WalletsQuery) {
    return await this.api.get(`v2/wallets`, {
      params: {...query.defaultParams(), ...query?.toQuery()}
    });
  }
}

export default WalletsRepository;