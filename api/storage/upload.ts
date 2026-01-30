import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Busboy from 'busboy';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminToken = process.env.ADMIN_WRITE_TOKEN;
const bucketName = 'project-images';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

export const config = {
  api: {
    bodyParser: false
  }
};

function parseBody(req: VercelRequest) {
  if (!req.body) {
    return {};
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function getHeaderToken(req: VercelRequest) {
  const header = req.headers['x-admin-token'];
  if (Array.isArray(header)) {
    return header[0];
  }
  return header || '';
}

function requireAdmin(req: VercelRequest, res: VercelResponse) {
  if (!adminToken) {
    res.status(500).json({ error: 'ADMIN_WRITE_TOKEN not configured' });
    return false;
  }
  const token = getHeaderToken(req);
  if (!token || token !== adminToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

function getFileExtension(filename?: string) {
  if (!filename) {
    return '';
  }
  const parts = filename.split('.');
  if (parts.length < 2) {
    return '';
  }
  return parts.pop() || '';
}

const parseMultipartFile = async (req: VercelRequest) => {
  return new Promise<{ buffer: Buffer; filename: string; contentType: string }>((resolve, reject) => {
    const busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: 5 * 1024 * 1024, files: 1 }
    });
    const chunks: Buffer[] = [];
    let filename = 'upload';
    let contentType = 'application/octet-stream';
    let fileReceived = false;

    busboy.on('file', (_name, file, info) => {
      fileReceived = true;
      filename = info.filename || filename;
      contentType = info.mimeType || contentType;
      file.on('data', (data: Buffer) => {
        chunks.push(data);
      });
      file.on('limit', () => {
        reject(new Error('FILE_TOO_LARGE'));
      });
    });

    busboy.on('finish', () => {
      if (!fileReceived) {
        reject(new Error('MISSING_FILE'));
        return;
      }
      resolve({ buffer: Buffer.concat(chunks), filename, contentType });
    });

    busboy.on('error', reject);
    req.pipe(busboy);
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  const contentTypeHeader = req.headers['content-type'] || '';
  let buffer: Buffer;
  let contentType: string;
  let filename: string;

  if (contentTypeHeader.includes('multipart/form-data')) {
    try {
      const file = await parseMultipartFile(req);
      buffer = file.buffer;
      contentType = file.contentType;
      filename = file.filename;
    } catch (error) {
      if (error instanceof Error && error.message === 'FILE_TOO_LARGE') {
        res.status(413).json({ error: 'File too large (max 5MB)' });
        return;
      }
      if (error instanceof Error && error.message === 'MISSING_FILE') {
        res.status(400).json({ error: 'Missing file data' });
        return;
      }
      res.status(500).json({ error: 'Failed to parse upload' });
      return;
    }
  } else {
    const body = parseBody(req);
    const rawData: string = body.data || body.base64 || '';
    contentType = body.contentType || body.mimeType || 'application/octet-stream';
    filename = body.filename || 'upload';

    if (!rawData) {
      res.status(400).json({ error: 'Missing file data' });
      return;
    }

    const base64Data = rawData.includes('base64,')
      ? rawData.split('base64,')[1]
      : rawData;
    buffer = Buffer.from(base64Data, 'base64');
  }

  const fileExtension = getFileExtension(filename);
  const safeExtension = fileExtension ? `.${fileExtension}` : '';
  const filePath = `screenshots/${Date.now()}-${Math.random().toString(36).slice(2)}${safeExtension}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, buffer, {
      contentType,
      upsert: false
    });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({
    url: `/api/storage/${bucketName}/${filePath}`,
    path: filePath
  });
}
