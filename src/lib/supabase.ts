import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface ProjectRow {
  id: string;
  title: string;
  description: string;
  url: string;
  image_url: string | null;
  tags: string[];
  content: string | null;
  created_at: string;
  updated_at: string;
}

// Transform database row to frontend format
export function transformProject(row: ProjectRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    imageUrl: row.image_url || '',
    tags: row.tags || [],
    content: row.content || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
