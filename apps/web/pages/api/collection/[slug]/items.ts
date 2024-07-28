import {NextApiRequest, NextApiResponse} from "next";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {ApiService} from "@src/core/services/api-service";
import WalletNft from "@src/core/models/wallet-nft";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IPaginatedList<WalletNft>>) {
  const { query } = req;
  const { slug, ...strippedQuery } = query;
  const mappedQuery = { ...strippedQuery, address: query.slug ?? query.address };

  if (!!mappedQuery.address) {

    const response = await ApiService
      .withKey(process.env.EB_API_KEY as string)
      .getCollectionItems(mappedQuery as FullCollectionsQueryParams);

    res.status(200).json(response);
  } else {
    res.status(500);
  }
}