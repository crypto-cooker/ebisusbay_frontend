import {ApiService} from "@src/core/services/api-service";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!!req.query.address) {
    const response = await ApiService
      .withKey(process.env.EB_API_KEY as string)
      .getOffersOverview(req.query.address as string);

    res.status(200).json(response.data);
  } else {
    res.status(500);
  }
}