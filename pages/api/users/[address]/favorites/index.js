import {addFavorite, deleteFavorite, getFavorites} from "@src/core/cms/endpoints/favorites";

export default async function handler(req, res) {
  const {method, body, query} = req;

  try {
    if (method === 'GET') {
      const response = await getFavorites(query.address);
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
    res.status(error.response?.status ?? 500).send(error.response?.data, 'Internal Server Error');
  }
}