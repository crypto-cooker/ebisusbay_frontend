import {NextApiRequest, NextApiResponse} from "next";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {ApiService} from "@src/core/services/api-service";
import {WalletsQueryParams, walletsQuerySchema} from "@src/core/services/api-service/mapi/queries/wallets";
import WalletNft from "@src/core/models/wallet-nft";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IPaginatedList<WalletNft>>) {
  const { query } = req;

  if (!!query.address) {
    const address = query.address as string;

    // Convert single collection value to array to pass validation
    if (!!query.collection && !Array.isArray(query.collection)) {
      query.collection = [query.collection];
    }

    const casted = walletsQuerySchema.cast(query) as WalletsQueryParams;

    const response = await ApiService
      .withKey(process.env.EB_API_KEY as string)
      .getWallet(address, casted);

    res.status(200).json(response);
  } else {
    res.status(500);
  }
}