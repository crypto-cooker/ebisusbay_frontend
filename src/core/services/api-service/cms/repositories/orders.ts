import CmsRepository from "@src/core/services/api-service/cms/repositories/index";
import {OrderState} from "@src/core/services/api-service/types";

class OrdersRepository extends CmsRepository {

  async createDeal(request: any, address: string, signature: string) {
    const response = await this.cms.post('order/deal', request, {
      params: {
        address,
        signature
      }
    });

    return response.data;
  }

  async getDeal(id: any) {
    // stubbed for when we will proxy this request
  }

  async requestAcceptDealAuthorization(id: string, address: string, signature: string) {
    const response = await this.cms.get('order/deal/authorize', {
      params: {
        id,
        address,
        signature
      }
    });

    return response.data;
  }

  async cancelDeal(id: string, address: string, signature: string) {
    const response = await this.cms.delete('order/deal', {
      params: {
        id,
        type: OrderState.CANCELLED,
        address,
        signature
      }
    });

    return response.data;
  }

  async rejectDeal(id: string, address: string, signature: string) {
    const response = await this.cms.delete('order/deal', {
      params: {
        id,
        type: OrderState.REJECTED,
        address,
        signature
      }
    });

    return response.data;
  }
}

export default OrdersRepository;