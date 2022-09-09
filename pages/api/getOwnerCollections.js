import {getCollections} from "@src/core/cms/endpoints/collections";

export default async function handler(req, res) {
  const {query} = req;
  const response = await getCollections(query);

  res.status(response.status).json(response.data)
}