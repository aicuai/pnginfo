import { IncomingForm } from 'formidable';
import sharp from 'sharp';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function extractMetadata(buffer) {
    const metadata = {
      prompt: null,
      workflow: null,
      fileinfo: {},
      otherMetadata: {},
    };
  
    try {
      const sharpMetadata = await sharp(buffer).metadata();
      const textChunks = sharpMetadata.tEXt || {};
  
      // Extract EXIF data
      if (sharpMetadata.exif) {
        try {
          const exifData = exifReader(sharpMetadata.exif);
          metadata.otherMetadata.exif = exifData;
        } catch (exifError) {
          console.error('Error parsing EXIF data:', exifError);
        }
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
  
      // Include other text chunks in otherMetadata
      for (const [key, value] of Object.entries(textChunks)) {
        if (key !== 'prompt' && key !== 'workflow') {
          metadata.otherMetadata[key] = value;
        }
      }
  
      metadata.fileinfo = {
        width: sharpMetadata.width,
        height: sharpMetadata.height,
        format: sharpMetadata.format,
      };
  
    } catch (error) {
      console.error('Error extracting PNG metadata:', error);
    }
  
    return metadata;
}

async function uploadFileToSlack(buffer, filename) {
    const slackToken = process.env.SLACK_BOT_TOKEN;
    const slackChannel = process.env.SLACK_CHANNEL_ID;
  
    if (!slackToken || !slackChannel) {
      console.warn('Slack credentials not set. Skipping file upload.');
      return null;
    }
  
    const form = new FormData();
    form.append('file', buffer, {
      filename: filename,
      contentType: 'image/png',
    });
    form.append('channel', slackChannel);
  
    try {
      const response = await axios.post('https://slack.com/api/files.uploadV2', form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${slackToken}`,
        },
      });
  
      if (response.data.ok) {
        return response.data.file.permalink;
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Error uploading file to Slack:', error);
      return null;
    }
  }

async function sendSlackNotification(metadata, fileUrl) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('Slack Webhook URL not set. Skipping notification.');
    return;
  }

  const message = {
    text: 'New image metadata processed',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New image processed*\nFilename: ${metadata.fileinfo.filename}\nResolution: ${metadata.fileinfo.width}x${metadata.fileinfo.height}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `File URL: ${fileUrl || 'Upload failed'}`
        }
      }
    ]
  };

  try {
    await axios.post(webhookUrl, message);
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  
    const form = new IncomingForm({
      keepExtensions: true,
      multiples: false,
    });
  
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form data' });
      }
  
      try {
        const file = files.file[0];
        const buffer = await fs.readFile(file.filepath);
  
        const metadata = await extractMetadata(buffer);
        metadata.fileinfo.filename = file.originalFilename;
  
        const fileUrl = await uploadFileToSlack(buffer, metadata.fileinfo.filename);
        await sendSlackNotification(metadata, fileUrl);
  
        if (fileUrl) {
          metadata.fileinfo.slackUrl = fileUrl;
        }
  
        res.status(200).json(metadata);
      } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Error processing image metadata' });
      }
    });
  }