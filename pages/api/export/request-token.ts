import {NextApiRequest, NextApiResponse} from "next";
import crypto from "crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET' && req.query.type === 'ryoshi-dynasties/delegations') {
      const ENCRYPTION_KEY = '12345678901234567890123456789012'
      const encryptedToken = encrypt(JSON.stringify({
        address: req.query.address,
        signature: req.query.signature,
        gameId: req.query.gameId,
        type: req.query.type,
        expiry: new Date().getTime() + 3600 * 1000
      }), ENCRYPTION_KEY)

      res.json({ token: encryptedToken });
  } else {
    res.status(405).end(); // Method not allowed
  }
}

function encrypt(text: any, key: string) {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}