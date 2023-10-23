import {search} from "@src/core/api/endpoints/search";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {query} = req;

  const response = await search(query.query);

  res.status(response.status).json(response.data)
}