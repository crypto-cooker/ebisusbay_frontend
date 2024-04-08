import MapiRepository from "@src/core/services/api-service/mapi/repositories/index";
import {DealListQuery, dealListQuerySchema} from "@src/core/services/api-service/mapi/queries/deallist";
import {OrderState} from "@src/core/services/api-service/types";

class OrdersRepository extends MapiRepository {

  async getDeals(query?: DealListQuery) {
    await dealListQuerySchema.validate(query);

    let defaultQuery = {
      state: OrderState.ACTIVE,
      sortBy: 'listingtime',
      direction: 'desc'
    };

    return await this.api.get(`deallist`, {
      params: {...defaultQuery, ...query?.toQuery()}
    });
  }

  async getDeal(id: string) {
    return await this.api.get(`deal`, {
      params: {id}
    });
  }
}

export default OrdersRepository;