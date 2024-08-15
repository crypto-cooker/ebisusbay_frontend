import {ApiService} from "@src/core/services/api-service";
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {NextApiRequest, NextApiResponse} from "next";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {Listing} from "@src/core/models/listing";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IPaginatedList<Listing>>) {
  const {query} = req;

  const response = await ApiService
    .withKey(process.env.EB_API_KEY as string)
    .getListings(query as ListingsQueryParams);

  res.status(200).json(response);
}