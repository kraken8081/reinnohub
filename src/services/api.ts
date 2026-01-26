import { supabase, transformProject, ProjectRow } from '../lib/supabase';

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  tags: string[];
  content?: string;
  createdAt: string;
  updatedAt?: string;
}

export const api = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }

    return (data as ProjectRow[]).map(transformProject);
  },

  // Get single project
  getProject: async (id: string): Promise<Project> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }

    return transformProject(data as ProjectRow);
  },

  // Create a new project
  createProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: project.title,
        description: project.description,
        url: project.url,
        image_url: project.imageUrl || null,
        tags: project.tags || [],
        content: project.content || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }

    return transformProject(data as ProjectRow);
  },

  // Update a project
  updateProject: async (id: string, project: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Project> => {
    const updateData: Record<string, unknown> = {};

    if (project.title !== undefined) updateData.title = project.title;
    if (project.description !== undefined) updateData.description = project.description;
    if (project.url !== undefined) updateData.url = project.url;
    if (project.imageUrl !== undefined) updateData.image_url = project.imageUrl;
    if (project.tags !== undefined) updateData.tags = project.tags;
    if (project.content !== undefined) updateData.content = project.content;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }

    return transformProject(data as ProjectRow);
  },

  // Delete a project
  deleteProject: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  },

  // Upload an image to Supabase Storage
  uploadImage: async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `screenshots/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw new Error('Failed to upload image');
    }

    // Get public URL
    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Capture screenshot - This will use an Edge Function or external service
  // For now, we'll return a placeholder and handle this differently
  captureScreenshot: async (url: string): Promise<{ url: string; meta: { title: string; description: string; content: string; tags: string[] } }> => {
    // Option 1: Use a third-party screenshot service
    // Option 2: Use Supabase Edge Functions with Puppeteer
    // For now, we'll fetch metadata only and use a placeholder image

    try {
      // Try to fetch Open Graph metadata using a CORS proxy or edge function
      // This is a simplified version - in production, use an edge function
      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);

      if (response.ok) {
        const data = await response.json();
        const meta = data.data || {};

        return {
          url: meta.screenshot?.url || meta.image?.url || '',
          meta: {
            title: meta.title || '',
            description: meta.description || '',
            content: '',
            tags: []
          }
        };
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }

    // Fallback
    return {
      url: '',
      meta: {
        title: '',
        description: '',
        content: '',
        tags: []
      }
    };
  }
};
