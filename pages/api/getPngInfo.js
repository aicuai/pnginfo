import { IncomingForm } from 'formidable';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing form data' });
        return;
      }

      const file = files.file[0];
      try {
        const metadata = await sharp(file.filepath).metadata();
        res.status(200).json(metadata);
      } catch (error) {
        res.status(500).json({ error: 'Error reading PNG metadata' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}