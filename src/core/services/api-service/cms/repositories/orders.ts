import CmsRepository from "@src/core/services/api-service/cms/repositories/index";

class OrdersRepository extends CmsRepository {

  async createSwap(request: any, address: string, signature: string) {
    const response = await this.cms.post('order/swap', request, {
      params: {
        address,
        signature
      }
    })
    return response.data;
  }

  async getSwap(id: any) {
    // stubbed for when we will proxy this request
  }
}

export default OrdersRepository;