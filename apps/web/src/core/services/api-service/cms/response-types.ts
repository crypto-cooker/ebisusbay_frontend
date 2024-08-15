export interface MerchantItem {
  tokenAddress: string;
  tokenId: number;
  total: number;
  remaining: number;
  name: string;
  description: string;
  image: string;
  packs: MerchantItemPack[];
}

export interface MerchantItemPack {
  id: string;
  itemsPerPack: number;
  price: number;
  available: number;
}

export interface MerchantPurchaseRequestResponse {

}