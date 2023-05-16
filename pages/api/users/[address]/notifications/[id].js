import {deleteNotifications} from "@src/core/cms/endpoints/notifications";

export default async function handler(req, res) {
  const {method, query} = req;
  res.setHeader('Cache-Control', 'no-cache');

  try {
    if (method === 'DELETE') {
      const response = await deleteNotifications(query.id, query.address, query.signature);
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(404).send('Not Found');
  }
}