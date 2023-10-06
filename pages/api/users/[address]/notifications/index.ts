import {deleteNotifications, getNotifications} from "@src/core/cms/endpoints/notifications";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {method, query} = req;
  res.setHeader('Cache-Control', 'no-cache');

  try {
    if (method === 'GET') {
      const response = await getNotifications(query.address, query);
      res.status(200).json(response);
    } else if (method === 'DELETE') {
      const response = await deleteNotifications(query.notificationId, query.address, query.signature);
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(404).send('Not Found');
  }
}