import * as Yup from "yup";

export interface MerchantPurchaseRequest {
  tokenAddress: string;
  tokenId: number;
  packId: string;
  quantity: number;
}

export const merchantPurchaseRequestSchema: Yup.SchemaOf<MerchantPurchaseRequest> = Yup.object().shape({
  tokenAddress: Yup.string().required(),
  tokenId: Yup.number().required(),
  packId: Yup.string().required(),
  quantity: Yup.number().required()
}).noUnknown();