import { IncomingForm } from 'formidable';
import sharp from 'sharp';
import fs from 'fs/promises';
import { PNG } from 'pngjs';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function extractPngMetadata(buffer) {
  return new Promise((resolve, reject) => {
    try {
      const png = PNG.sync.read(buffer);
      const metadata = {
        prompt: null,
        workflow: null,
        fileinfo: null,
        otherMetadata: {},
      };

      // Extract tEXt chunks
      for (const chunkType in png.chunks) {
        if (chunkType === 'tEXt') {
          for (const chunk of png.chunks[chunkType]) {
            const key = chunk.keyword.toString();
            const value = chunk.text.toString();

            try {
              const parsedValue = JSON.parse(value);
              if (key === 'prompt' || key === 'workflow' || key === 'fileinfo') {
                metadata[key] = parsedValue;
              } else {
                metadata.otherMetadata[key] = parsedValue;
              }
            } catch (e) {
              // If parsing fails, store as string
              if (key === 'prompt' || key === 'workflow' || key === 'fileinfo') {
                metadata[key] = value;
              } else {
                metadata.otherMetadata[key] = value;
              }
            }
          }
        }
      }

      resolve(metadata);
    } catch (error) {
      reject(error);
    }
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    try {
      let file;
      if (files.file) {
        file = Array.isArray(files.file) ? files.file[0] : files.file;
      } else {
        const fileKey = Object.keys(files)[0];
        file = files[fileKey];
      }

      if (!file || !file.filepath) {
        throw new Error('No file uploaded or invalid file object');
      }

      const buffer = await fs.readFile(file.filepath);
      const sharpMetadata = await sharp(buffer).metadata();
      const pngMetadata = await extractPngMetadata(buffer);

      const combinedMetadata = {
        ...sharpMetadata,
        ...pngMetadata,
      };

      res.status(200).json(combinedMetadata);
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Error processing image metadata: ' + error.message });
    }
  });
}