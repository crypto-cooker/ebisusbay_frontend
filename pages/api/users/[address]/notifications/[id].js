import {deleteNotifications} from "@src/core/cms/endpoints/notifications";

export default async function handler(req, res) {
  const {method, query} = req;
  res.setHeader('Cache-Control', 's-maxage=60');

  try {
    if (method === 'DELETE') {
      const response = await deleteNotifications(query.notificationId, query.address, query.signature);
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(error.response?.status ?? 500).send(error.response?.data, 'Internal Server Error');
  }
}