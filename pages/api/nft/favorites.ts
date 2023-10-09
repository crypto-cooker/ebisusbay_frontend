import {getNftFavorites} from "@src/core/cms/endpoints/favorites";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {method, query} = req;

  try {
    if (method === 'GET') {
      const response = await getNftFavorites(query.tokenAddress, query.tokenId);
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(404).send('Not Found');
  }
}