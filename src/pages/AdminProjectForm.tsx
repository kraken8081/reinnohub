import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { api, adminToken } from '../services/api';
import { ArrowLeft, Upload, Loader2, Save, Sparkles } from 'lucide-react';

type AuthStatus = 'ready' | 'missing' | 'invalid';

export default function Admin() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(adminToken.has() ? 'ready' : 'missing');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    tags: '',
    imageUrl: '',
    content: ''
  });

  const resolveImageUrl = (value: string) => {
    if (!value) {
      return '';
    }
    if (value.startsWith('data:')) {
      return value;
    }
    if (value.startsWith('/api/storage/') || value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }
    const normalizedPath = value.startsWith('screenshots/') ? value : `screenshots/${value}`;
    return `/api/storage/project-images/${normalizedPath}`;
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    let isActive = true;
    setInitializing(true);

    api.getProject(id)
      .then(project => {
        if (!isActive) {
          return;
        }
        setFormData({
          title: project.title,
          description: project.description,
          url: project.url,
          tags: project.tags.join(', '),
          imageUrl: project.imageUrl,
          content: project.content || ''
        });
      })
      .catch(error => {
        console.error('Failed to load project:', error);
        alert('Failed to load project.');
      })
      .finally(() => {
        if (isActive) {
          setInitializing(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCapture = async () => {
    if (!formData.url) {
      alert('Please enter a URL first');
      return;
    }

    setCapturing(true);
    try {
      const result = await api.captureScreenshot(formData.url);

      setFormData(prev => ({
        ...prev,
        imageUrl: result.url,
        title: result.meta.title || prev.title,
        description: result.meta.description || prev.description,
        content: result.meta.content || prev.content,
        tags: result.meta.tags.length > 0 ? result.meta.tags.join(', ') : prev.tags
      }));
    } catch (error) {
      console.error('Capture failed:', error);
      alert('Smart extract failed. Please ensure the URL is valid.');
    } finally {
      setCapturing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('图片过大，请选择小于 5MB 的文件。');
        return;
      }
      setUploading(true);
      try {
        const url = await api.uploadImage(file);
        setFormData(prev => ({ ...prev, imageUrl: resolveImageUrl(url) }));
        setAuthStatus('ready');
      } catch (error) {
        console.error('Upload failed:', error);
        const status = (error as { status?: number }).status;
        if (status === 401) {
          setAuthStatus('invalid');
          alert('管理密钥无效或未配置，请重新输入。');
          return;
        }
        alert('Upload failed, please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      if (isEdit && id) {
        await api.updateProject(id, {
          title: formData.title,
          description: formData.description,
          url: formData.url,
          imageUrl: formData.imageUrl,
          content: formData.content,
          tags: tagsArray
        });
        alert('Project updated successfully!');
        setAuthStatus('ready');
        navigate('/admin');
      } else {
        await api.createProject({
          title: formData.title,
          description: formData.description,
          url: formData.url,
          imageUrl: formData.imageUrl,
          content: formData.content,
          tags: tagsArray
        });

        alert('Project created successfully!');
        setAuthStatus('ready');
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      const status = (error as { status?: number }).status;
      if (status === 401) {
        setAuthStatus('invalid');
        alert('管理密钥无效或未配置，请重新输入。');
        return;
      }
      alert('Failed to save project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--paper)]">
      <Header />

      <main className="relative z-10 max-w-2xl mx-auto px-5 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-[var(--muted)] hover:text-[var(--ink)] mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </button>

        <div className="mb-6 rounded-xl border border-[var(--line)] bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-1">Admin Access</p>
              <p className="text-sm text-[var(--ink)]">
                {authStatus === 'ready' && '管理写入密钥已设置，可进行新增/编辑操作。'}
                {authStatus === 'missing' && '未检测到管理写入密钥，提交保存前需要输入密钥。'}
                {authStatus === 'invalid' && '管理写入密钥无效，请重新输入。'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const token = adminToken.prompt(authStatus !== 'missing');
                  setAuthStatus(token ? 'ready' : 'missing');
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--line)] text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
              >
                {authStatus === 'ready' ? '更新密钥' : '输入密钥'}
              </button>
              {authStatus !== 'missing' && (
                <button
                  type="button"
                  onClick={() => {
                    adminToken.clear();
                    setAuthStatus('missing');
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-red-200 text-red-600 hover:border-red-400 transition-colors"
                >
                  清除密钥
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--line)]">
          <h2 className="font-playfair text-3xl text-[var(--ink)] mb-8">
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL & Smart Extract */}
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">Project URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="url"
                  required
                  placeholder="https://example.com"
                  className="flex-1 px-4 py-2 rounded-lg border border-[var(--line)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                  value={formData.url}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={capturing || !formData.url}
                  className="flex items-center px-4 py-2 bg-[var(--paper)] border border-[var(--line)] rounded-lg text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[140px] justify-center"
                >
                  {capturing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2 text-[var(--accent)]" />
                  )}
                  {capturing ? 'Analyzing...' : 'Smart Fill'}
                </button>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">Enter URL to auto-generate screenshot and extract content</p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">Project Title</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 rounded-lg border border-[var(--line)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">Description (Summary)</label>
              <textarea
                name="description"
                required
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-[var(--line)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">Full Content (Extracted)</label>
              <textarea
                name="content"
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-[var(--line)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all font-mono text-sm"
                value={formData.content}
                onChange={handleChange}
                placeholder="Full article content will appear here..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                placeholder="AI, FinTech, Data"
                className="w-full px-4 py-2 rounded-lg border border-[var(--line)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">Cover Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[var(--line)] border-dashed rounded-lg hover:bg-gray-50 transition-colors relative">
                <div className="space-y-1 text-center">
                  {formData.imageUrl ? (
                    <div className="relative">
                      <img
                        src={resolveImageUrl(formData.imageUrl)}
                        alt="Preview"
                        className="mx-auto h-48 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      {uploading || capturing ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="mx-auto h-12 w-12 text-[var(--muted)] animate-spin" />
                          <p className="mt-2 text-sm text-[var(--muted)]">
                            {capturing ? 'Capturing & Analyzing...' : 'Uploading...'}
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-[var(--muted)]" />
                          <div className="flex text-sm text-gray-600 justify-center mt-4">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-[var(--accent)] hover:text-[var(--accent-2)] focus-within:outline-none">
                              <span>Upload a file</span>
                              <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || uploading || capturing || initializing}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--ink)] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ink)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="-ml-1 mr-2 h-4 w-4" />
                  Save Project
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
