import {search} from "@src/core/api/endpoints/search";

export default async function handler(req, res) {
  const {query} = req;

  const response = await search(query.query);

  res.status(response.status).json(response.data)
}