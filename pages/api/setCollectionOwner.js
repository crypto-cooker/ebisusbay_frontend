import {setOwner} from "@src/core/cms/endpoints/collections";

export default async function handler(req, res) {
  const {query, body} = req;
  try{
    const response = await setOwner({signature: query.signature, address: query.address}, body.collectionAddress, body.ownerAddress);
    res.status(response.status).json(response.data)
  }
  catch(error){
    res.status(error.response.status).json(error.response.data)
  }
}