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
    imageUrl: row.image_url || '',
    tags: row.tags || [],
    content: row.content || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
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
  const { id } = req.query;
  const projectId = Array.isArray(id) ? id[0] : id;

  if (!projectId) {
    res.status(400).json({ error: 'Missing project id' });
    return;
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(normalizeProject(data));
    return;
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    if (!requireAdmin(req, res)) {
      return;
    }
    const body = parseBody(req);
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.url !== undefined) updateData.url = body.url;
    if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl || null;
    if (body.content !== undefined) updateData.content = body.content || null;
    if (body.tags !== undefined) {
      updateData.tags = Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === 'string'
          ? body.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
          : [];
    }

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(normalizeProject(data));
    return;
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) {
      return;
    }
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(204).end();
    return;
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
