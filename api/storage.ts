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

const normalizeQuery = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || '';
  }
  return value || '';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const bucket = normalizeQuery(req.query.bucket);
  const rawPath = normalizeQuery(req.query.path);

  if (!bucket || !rawPath) {
    res.status(400).json({ error: 'Missing bucket or path' });
    return;
  }

  const filePath = decodeURIComponent(rawPath);

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
