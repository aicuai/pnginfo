import { IncomingForm } from 'formidable';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { PNG } from 'pngjs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'uploads');

async function ensureUploadDir() {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

async function extractPngMetadata(buffer) {
  // ... (previous implementation remains the same)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await ensureUploadDir();

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file[0];
    const newPath = path.join(uploadDir, file.originalFilename);
    await fs.rename(file.filepath, newPath);

    const buffer = await fs.readFile(newPath);
    const sharpMetadata = await sharp(buffer).metadata();
    const pngMetadata = await extractPngMetadata(buffer);

    const combinedMetadata = {
      ...sharpMetadata,
      ...pngMetadata,
      savedPath: newPath,
    };

    res.status(200).json(combinedMetadata);
  } catch (error) {
    console.error('Error processing PNG:', error);
    res.status(500).json({ error: 'Error processing PNG metadata' });
  }
}