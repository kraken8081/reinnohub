import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api, Project } from '../services/api';
import { Plus, Pencil, Trash2, ArrowLeft, ExternalLink, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--paper)]">
      <Header />

      <main className="relative z-10 max-w-6xl mx-auto px-5 py-12">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-[var(--muted)] hover:text-[var(--ink)] mb-2 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </button>
            <h2 className="font-playfair text-3xl text-[var(--ink)]">Project Management</h2>
          </div>
          <button
            onClick={() => navigate('/admin/new')}
            className="flex items-center px-4 py-2 bg-[var(--ink)] text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> New Project
          </button>
        </div>

        {/* Project List */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--line)] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[var(--muted)]">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-[var(--muted)]">
              No projects found. Click "New Project" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-[var(--line)]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Cover</th>
                    <th className="px-6 py-4 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Title / Description</th>
                    <th className="px-6 py-4 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-medium text-[var(--muted)] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap w-24">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="h-12 w-16 object-cover rounded-md border border-[var(--line)]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[var(--ink)] mb-1">{project.title}</div>
                        <div className="text-xs text-[var(--muted)] line-clamp-1 max-w-md">{project.description}</div>
                        <div className="flex gap-2 mt-2">
                          {project.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted)]">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {project.createdAt.split('T')[0]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                            title="Visit Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => navigate(`/admin/edit/${project.id}`)}
                            className="text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-[var(--muted)] hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
