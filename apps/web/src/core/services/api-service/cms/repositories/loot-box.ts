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
    const response = await this.cms.post(`lootbox/open/${id}`, null, {
      params: {
        address,
        signature
      }
    })
    return response.data;
  }

  async checkGift(address: string, signature: string) {
    const response = await this.cms.get(`lootbox/holidays/check`, {
      params: {
        address,
        signature
      }
    })
    return response.data;
  }

  async claimGift(address: string, signature: string) {
    const response = await this.cms.post(`lootbox/holidays/claim`, null, {
      params: {
        address,
        signature
      }
    })
    return response.data;
  }
}

export default LootBoxRepository;