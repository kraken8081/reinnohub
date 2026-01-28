import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { path } = req.query;
  const segments = Array.isArray(path) ? path : typeof path === 'string' ? [path] : [];

  if (segments.length < 2) {
    res.status(400).json({ error: 'Missing storage path' });
    return;
  }

  const [bucket, ...fileParts] = segments;
  const filePath = fileParts.join('/');

  const { data, error } = await supabase.storage
    .from(bucket)
    .download(filePath);

  if (error || !data) {
    res.status(404).json({ error: error?.message || 'File not found' });
    return;
  }

  const arrayBuffer = await (data as any).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = (data as any).type || 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.status(200).send(buffer);
}
