import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminToken = process.env.ADMIN_WRITE_TOKEN;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

function normalizeProject(row: any) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    imageUrl: toProxyImageUrl(row.image_url || ''),
    tags: row.tags || [],
    content: row.content || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toProxyImageUrl(imageUrl: string) {
  if (!imageUrl) {
    return '';
  }
  if (imageUrl.startsWith('/api/storage/')) {
    return imageUrl;
  }
  const match = imageUrl.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (match) {
    return `/api/storage/${match[1]}/${match[2]}`;
  }
  return imageUrl;
}

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const fresh = req.query.fresh === '1';
    if (fresh) {
      res.setHeader('Cache-Control', 'no-store');
    } else {
      // Cache on the edge to avoid hitting the database on every request.
      res.setHeader(
        'Cache-Control',
        'public, max-age=120, s-maxage=21600, stale-while-revalidate=86400'
      );
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json((data || []).map(normalizeProject));
    return;
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) {
      return;
    }
    const body = parseBody(req);
    const tags = Array.isArray(body.tags)
      ? body.tags
      : typeof body.tags === 'string'
        ? body.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [];

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: body.title,
        description: body.description,
        url: body.url,
        image_url: body.imageUrl || null,
        tags,
        content: body.content || null
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(normalizeProject(data));
    return;
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
