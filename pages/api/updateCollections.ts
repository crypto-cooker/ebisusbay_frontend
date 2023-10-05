import { update } from "@src/core/cms/endpoints/collections";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const {query, body} = req;
  try{
    const response = await update({signature: query.signature, address: query.address, collectionAddress: query.collectionAddress}, body);
    res.status(response.status).json(response.data)
  } catch(error: any) {
    res.status(error.response.status).json(error.response.data)
  }
}