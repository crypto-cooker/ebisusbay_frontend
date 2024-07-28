import {getNft} from "@src/core/api/endpoints/nft";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {query} = req;

  const response = await getNft(query.collection, query.token);

  res.status(response.status).json(response)
}