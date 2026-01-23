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

const API_BASE_URL = '/api';

export const api = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },

  // Get single project
  getProject: async (id: string): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    return response.json();
  },

  // Create a new project
  createProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    return response.json();
  },

  // Update a project
  updateProject: async (id: string, project: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    return response.json();
  },

  // Delete a project
  deleteProject: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  },

  // Upload an image
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  },

  // Capture screenshot from URL
  captureScreenshot: async (url: string): Promise<{ url: string; meta: { title: string; description: string; content: string; tags: string[] } }> => {
    const response = await fetch(`${API_BASE_URL}/screenshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to capture screenshot');
    }

    const data = await response.json();
    return data;
  }
};
