import {NextApiRequest, NextApiResponse} from "next";
import Croscription from "@src/third-party/croscription";

export default async function handler(req: NextApiRequest, res: NextApiResponse<number>) {
  const { query } = req;
  const { address  } = query;

  if (!address) return 0;

  const inscriptionApi = new Croscription();
  const inscriptionBalance = await inscriptionApi.getCrosBalance(address as string);
  res.status(200).json(inscriptionBalance);
}