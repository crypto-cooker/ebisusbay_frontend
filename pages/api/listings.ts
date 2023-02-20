import {ApiService} from "@src/core/services/api-service";
import {ListingsQuery} from "@src/core/services/api-service/mapi/queries/listings";
import {NextApiRequest, NextApiResponse} from "next";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import Listing from "@src/core/models/listing";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IPaginatedList<any>>) {
  const {query} = req;

  const response = await ApiService
    .withKey(process.env.EB_API_KEY as string)
    .getListings(new ListingsQuery(query));

  res.status(200).json(response);
}