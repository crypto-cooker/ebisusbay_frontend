import {getCollections} from "@src/core/api/endpoints/collectioninfo";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {query} = req;

  const response = await getCollections(query);

  res.status(response.status).json(response.data)
}