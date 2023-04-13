import MapiRepository from "@src/core/services/api-service/mapi/repositories/index";
import OffersQuery from "@src/core/services/api-service/mapi/queries/offers";

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
}

export default OffersRepository;