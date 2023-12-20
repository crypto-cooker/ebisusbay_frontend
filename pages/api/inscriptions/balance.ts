import {NextApiRequest, NextApiResponse} from "next";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import WalletNft from "@src/core/models/wallet-nft";
import Croscription from "@src/third-party/croscription";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IPaginatedList<WalletNft>>) {
  const { query } = req;
  const { address  } = query;

  if (!address) return 0;

  const inscriptionApi = new Croscription();
  const inscriptionBalance = await inscriptionApi.getCrosBalance(address as string);
  res.status(200).json(inscriptionBalance);
}