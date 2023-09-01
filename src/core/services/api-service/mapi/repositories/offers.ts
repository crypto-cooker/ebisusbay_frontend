import MapiRepository from "@src/core/services/api-service/mapi/repositories/index";
import OffersQuery from "@src/core/services/api-service/mapi/queries/offers";
import OffersV2Query from "@src/core/services/api-service/mapi/queries/offersV2";

class OffersRepository extends MapiRepository {

  async getOffers(query?: OffersQuery) {
    let defaultQuery = {
      page: 1,
      pageSize: 50,
      sortBy: 'price',
      direction: 'desc'
    };

    return await this.api.get(`offers`, {
      params: {...defaultQuery, ...query?.toQuery()}
    });
  }

  async getReceivedOffers(query: OffersV2Query) {

    return await this.api.get(`walletOffers`, {
      params: {...query.defaultParams(), ...query.toQuery()}
    });
  }

  async getOffersOverview(address: string) {

    return await this.api.get(`v2/offersOverview`, {
      params: {wallet: address}
    });
  }
}

export default OffersRepository;