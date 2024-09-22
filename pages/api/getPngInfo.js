import { IncomingForm } from 'formidable';
import sharp from 'sharp';
import fs from 'fs/promises';
import { PNG } from 'pngjs';
import ExifReader from 'exif-reader';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function extractMetadata(buffer) {
  const metadata = {
    format: null,
    size: null,
    width: null,
    height: null,
    space: null,
    channels: null,
    depth: null,
    density: null,
    isProgressive: null,
    hasProfile: null,
    hasAlpha: null,
    prompt: null,
    workflow: null,
    fileinfo: {},
    otherMetadata: {},
    exif: {},
  };

  try {
    const sharpMetadata = await sharp(buffer).metadata();
    Object.assign(metadata, sharpMetadata);

    metadata.fileinfo = {
      width: sharpMetadata.width,
      height: sharpMetadata.height,
      format: sharpMetadata.format,
    };

    // Extract EXIF data
    if (sharpMetadata.exif) {
      try {
        const exifData = ExifReader.load(sharpMetadata.exif);
        for (const [key, value] of Object.entries(exifData)) {
          if (key === 'MakerNote') {
            metadata.parameters = value.description;
          } else if (key === 'UserComment') {
            metadata.prompt = value.description;
          } else {
            metadata.exif[key] = value.description;
          }
        }
      } catch (exifError) {
        console.error('Error parsing EXIF data:', exifError);
      }
    }

    // Extract PNG text chunks
    const png = PNG.sync.read(buffer);
    for (const chunkType in png.chunks) {
      if (chunkType === 'tEXt') {
        for (const chunk of png.chunks[chunkType]) {
          const key = chunk.keyword.toString();
          const value = chunk.text.toString();

          try {
            const parsedValue = JSON.parse(value);
            if (key === 'workflow') {
              metadata.workflow = parsedValue;
            } else {
              metadata.otherMetadata[key] = parsedValue;
            }
          } catch (e) {
            if (key === 'workflow') {
              metadata.workflow = value;
            } else {
              metadata.otherMetadata[key] = value;
            }
          }
        }
      }
    }

  } catch (error) {
    console.error('Error extracting metadata:', error);
  }

  return metadata;
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
      const metadata = await extractMetadata(buffer);

      res.status(200).json(metadata);
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Error processing image metadata: ' + error.message });
    }
  });
}