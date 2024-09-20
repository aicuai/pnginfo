import { IncomingForm } from 'formidable';
import sharp from 'sharp';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import exifReader from 'exif-reader';

export const config = { api: { bodyParser: false } };

async function extractMetadata(buffer) {
  const metadata = {
    fileinfo: {},
    exif: null,
    parameters: null,
    prompt: null,
    workflow: null,
    otherMetadata: {},
  };

  try {
    const sharpMetadata = await sharp(buffer).metadata();
    const textChunks = sharpMetadata.tEXt || {};

    metadata.fileinfo = {
      width: sharpMetadata.width,
      height: sharpMetadata.height,
      format: sharpMetadata.format,
      filename: sharpMetadata.filename,
    };

    if (sharpMetadata.exif) {
      try {
        metadata.exif = exifReader(sharpMetadata.exif);
      } catch (exifError) {
        console.error('Error parsing EXIF data:', exifError);
      }
    }

    if (textChunks.parameters) {
      metadata.parameters = textChunks.parameters;
    }

    if (textChunks.prompt) {
      try {
        metadata.prompt = JSON.parse(textChunks.prompt);
      } catch (e) {
        metadata.prompt = textChunks.prompt;
      }
    }

    if (textChunks.workflow) {
      try {
        metadata.workflow = JSON.parse(textChunks.workflow);
      } catch (e) {
        metadata.workflow = textChunks.workflow;
      }
    }

    for (const [key, value] of Object.entries(textChunks)) {
      if (!['parameters', 'prompt', 'workflow'].includes(key)) {
        metadata.otherMetadata[key] = value;
      }
    }
  } catch (error) {
    console.error('Error extracting PNG metadata:', error);
  }

  return metadata;
}

// ... (sendSlackNotification and uploadFileToSlack functions remain the same)

export default async function handler(req, res) {
  // ... (the rest of the handler remains the same)
}