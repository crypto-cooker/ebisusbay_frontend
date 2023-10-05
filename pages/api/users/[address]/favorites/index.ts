import {addFavorite, deleteFavorite, getUserFavorites} from "@src/core/cms/endpoints/favorites";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {method, body, query} = req;

  try {
    if (method === 'GET') {
      const response = await getUserFavorites(query.address);
      res.status(200).json(response);
    }
    if (method === 'POST') {
      const response = await addFavorite(body.tokenAddress, body.tokenId, body.address, body.signature);
      res.status(200).json(response);
    }
    if (method === 'DELETE') {
      const response = await deleteFavorite(query.tokenAddress, query.tokenId, query.address, query.signature);
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(404).send('Not Found');
  }
}