import {getNft} from "@src/core/api/endpoints/nft";

export default async function handler(req, res) {
  const {query} = req;

  const response = await getNft(query.collection, query.token);

  res.status(response.status).json(response)
}