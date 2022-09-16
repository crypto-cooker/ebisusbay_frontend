import {getListings} from "@src/core/api/endpoints/listings";
import {ListingsQuery} from "@src/core/api/queries/listings";

export default async function handler(req, res) {
  const {query} = req;

  const response = await getListings(new ListingsQuery(query));

  res.status(response.status).json(response.data)
}