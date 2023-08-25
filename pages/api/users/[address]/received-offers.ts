import {ApiService} from "@src/core/services/api-service";
import {ListingsQuery} from "@src/core/services/api-service/mapi/queries/listings";
import {NextApiRequest, NextApiResponse} from "next";
import {IPaginatedList} from "@src/core/services/api-service/paginated-list";
import {Listing} from "@src/core/models/listing";
import OffersQuery, {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import {Offer} from "@src/core/models/offer";
import {OffersV2QueryParams} from "@src/core/services/api-service/mapi/queries/offersV2";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IPaginatedList<Offer>>) {
  const { address, ...query }: { address?: string } = req.query;

  if (!!address) {
    const response = await ApiService
      .withKey(process.env.EB_API_KEY as string)
      .getReceivedOffersByUser(address, query as OffersV2QueryParams);

    res.status(200).json(response);
  } else {
    res.status(500);
  }
}