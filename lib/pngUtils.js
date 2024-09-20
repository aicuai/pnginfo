
// /lib/pngUtils.js
import sharp from 'sharp';

export async function addMetadata(inputPath, outputPath, metadata) {
  const image = sharp(inputPath);
  const info = await image.metadata();
  const newMetadata = { ...info, ...metadata };
  
  await image
    .withMetadata(newMetadata)
    .toFile(outputPath);
}

export async function initMetadata(inputPath, outputPath, metadata) {
  const image = sharp(inputPath);
  
  await image
    .withMetadata(metadata)
    .toFile(outputPath);
}

export async function getMetadata(path) {
  const image = sharp(path);
  return await image.metadata();
}