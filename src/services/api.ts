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
const ADMIN_TOKEN_STORAGE_KEY = 'admin_write_token';

type GetProjectsOptions = {
  fresh?: boolean;
};

const getStoredAdminToken = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
};

const setStoredAdminToken = (token: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
};

const clearStoredAdminToken = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
};

const promptAdminToken = (force = false) => {
  if (typeof window === 'undefined') {
    return '';
  }
  const existing = getStoredAdminToken();
  if (!force && existing) {
    return existing;
  }
  const input = window.prompt('请输入管理写入密钥', existing || '');
  if (!input) {
    return '';
  }
  setStoredAdminToken(input);
  return input;
};

const getAdminToken = () => {
  const existing = getStoredAdminToken();
  if (existing) {
    return existing;
  }
  return promptAdminToken();
};

const withAdminHeaders = () => {
  const token = getAdminToken();
  return token ? { 'x-admin-token': token } : {};
};

const parseJson = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const requireOk = async (response: Response) => {
  if (response.ok) {
    return;
  }
  const payload = await parseJson(response);
  const message = typeof payload === 'string' ? payload : payload?.error || 'Request failed';
  const error = new Error(message) as Error & { status?: number };
  error.status = response.status;
  throw error;
};

export const adminToken = {
  has: () => Boolean(getStoredAdminToken()),
  prompt: (force = false) => promptAdminToken(force),
  clear: () => clearStoredAdminToken()
};

export const api = {
  // Get all projects
  getProjects: async (options: GetProjectsOptions = {}): Promise<Project[]> => {
    const url = options.fresh
      ? `${API_BASE_URL}/projects?fresh=1`
      : `${API_BASE_URL}/projects`;
    const response = await fetch(url, options.fresh ? { cache: 'no-store' } : undefined);
    await requireOk(response);
    return (await response.json()) as Project[];
  },

  // Get latest update version (timestamp) for projects list
  getProjectsVersion: async (): Promise<string | null> => {
    const response = await fetch(`${API_BASE_URL}/projects?version=1`);
    await requireOk(response);
    const payload = (await response.json()) as { version?: string | null };
    return payload?.version ?? null;
  },

  // Get single project
  getProject: async (id: string): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    await requireOk(response);
    return (await response.json()) as Project;
  },

  // Create a new project
  createProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...withAdminHeaders()
      },
      body: JSON.stringify(project)
    });
    await requireOk(response);
    return (await response.json()) as Project;
  },

  // Update a project
  updateProject: async (id: string, project: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...withAdminHeaders()
      },
      body: JSON.stringify(project)
    });
    await requireOk(response);
    return (await response.json()) as Project;
  },

  // Delete a project
  deleteProject: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        ...withAdminHeaders()
      }
    });
    await requireOk(response);
  },

  // Upload an image to Supabase Storage
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const response = await fetch(`${API_BASE_URL}/storage/upload`, {
      method: 'POST',
      headers: {
        ...withAdminHeaders()
      },
      body: formData
    });

    await requireOk(response);
    const payload = await response.json();
    return payload.url as string;
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
