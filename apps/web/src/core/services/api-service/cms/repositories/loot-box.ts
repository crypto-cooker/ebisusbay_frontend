import { appConfig } from "@src/config";
import CmsRepository from "@src/core/services/api-service/cms/repositories/index";

class LootBoxRepository extends CmsRepository {

  async getLootBoxList() {
    const response = await this.cms.get(`lootbox/list`);
    return response.data;

  }

  async getLootBoxInfo(id: number) {
    const response = await this.cms.get(`lootbox/info/${id}`);
    return response.data;

  }

  async getLootBoxBalances(walletAddress: string) {
    const response = await this.cms.get(`lootbox/balance`, {
      params: {
        walletAddress
      }
    })
    return response.data;

  }

  async openLootBox(id: number, address: string, signature: string) {
    const response = await this.cms.post(`lootbox/open/${id}`, {
      params: {
        signature,
        address
      }
    })
    console.log(response.data, "HHHHHHHHHHHHHHHHHH")
    return response.data;
  }
}

export default LootBoxRepository;