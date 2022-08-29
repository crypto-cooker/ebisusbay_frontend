import {getCollections} from "@src/core/api/endpoints/collectioninfo";
import {deleteNotifications, getNotifications} from "@src/core/cms/endpoints/notifications";

export default async function handler(req, res) {
  const {method, query} = req;

  try {
    if (method === 'GET') {
      const response = await getNotifications(query.address, query.signature, query);
      res.status(200).json(response);
    } else if (method === 'DELETE') {
      const response = await deleteNotifications(query.notificationId, query.address, query.signature);
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(error.response?.status ?? 500).send(error.response?.data, 'Internal Server Error');
  }
}