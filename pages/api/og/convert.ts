import {NextApiRequest, NextApiResponse} from 'next';
import sharp from "sharp";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (typeof url !== 'string') {
    res.status(400).send('Invalid query parameter: url');
    return;
  }

  let contentType;
  try {
    const imageResponse = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    const img = await sharp(imageResponse.data).toFormat('png').toBuffer()
    res.setHeader('Content-Type', 'image/png');
    res.send(img);
  } catch (error: any) {
    res.status(500).send('Error fetching image: ' + error.message + ' ' + contentType);
  }
};