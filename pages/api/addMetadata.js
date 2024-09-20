// /pages/api/addMetadata.js
import { addMetadata } from '../../lib/pngUtils';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { inputPath, outputPath, metadata } = req.body;
    try {
      await addMetadata(inputPath, outputPath, metadata);
      res.status(200).json({ message: 'Metadata added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



