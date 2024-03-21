import MapiRepository from "@src/core/services/api-service/mapi/repositories/index";

class OrdersRepository extends MapiRepository {

  async getSwap(id: string) {
    return await this.api.get(`swap`, {
      params: {id}
    });
  }
}

export default OrdersRepository;