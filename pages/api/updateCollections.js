import { update } from "@src/core/cms/endpoints/collections";

export default async function handler(req, res) {

  const {query, body} = req;
  try{
    const response = await update({signature: query.signature, address: query.address, collectionAddress: query.collectionAddress}, body);
    res.status(response.status).json(response.data)
  }
  catch(error){
    res.status(error.response.status).json(error.response.data)
  }
}