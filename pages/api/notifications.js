import {getCollections} from "@src/core/api/endpoints/collectioninfo";
import {deleteNotifications, getNotifications} from "@src/core/cms/endpoints/notifications";

export default async function handler(req, res) {
  const {method, query} = req;

  if (method === 'GET') {
    const response = await getNotifications(query.walletAddress, query);
    res.status(200).json(response.data);
  } else if (method === 'DELETE') {
    const response = await deleteNotifications(query.notificationId, query.address, query.signature);
    res.status(200).json(response.data);
  }

  res.status(500).json([]);
}