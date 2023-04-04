import {NextApiRequest, NextApiResponse} from "next";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {ApiService} from "@src/core/services/api-service";
import {ListingsQueryParams, listingsQuerySchema} from "@src/core/services/api-service/mapi/queries/listings";
import {OwnerListing} from "@src/core/models/listing";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IPaginatedList<OwnerListing>>) {
  const { query } = req;

  if (!!query.address) {
    const address = query.address as string;

    if (typeof query.collection === 'string') query.collection = [query.collection];
    if (typeof query.tokenId === 'string') query.tokenId = [query.tokenId];
    if (typeof query.listingId === 'string') query.listingId = [query.listingId];
    const casted = listingsQuerySchema.cast(query) as ListingsQueryParams;

    const response = await ApiService
      .withKey(process.env.EB_API_KEY as string)
      .getUserUnfilteredListings(address, casted);

    res.status(200).json(response);
  } else {
    res.status(500);
  }
}