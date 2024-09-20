// /pages/api/getMetadata.js
import { getMetadata } from '../../lib/pngUtils';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { inputPath } = req.body;
    try {
      const metadata = await getMetadata(inputPath);
      res.status(200).json(metadata);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}