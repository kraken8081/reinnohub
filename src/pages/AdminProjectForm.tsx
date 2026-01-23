import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../services/api';
import { ArrowLeft, Upload, Loader2, Save, Camera, Sparkles } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    tags: '',
    imageUrl: '',
    content: ''
  });

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
      setUploading(true);
      try {
        const url = await api.uploadImage(e.target.files[0]);
        setFormData(prev => ({ ...prev, imageUrl: url }));
      } catch (error) {
        console.error('Upload failed:', error);
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

      await api.createProject({
        title: formData.title,
        description: formData.description,
        url: formData.url,
        imageUrl: formData.imageUrl,
        content: formData.content,
        tags: tagsArray
      });

      alert('Project created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project.');
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

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--line)]">
          <h2 className="font-playfair text-3xl text-[var(--ink)] mb-8">Add New Project</h2>

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
                      <img src={formData.imageUrl} alt="Preview" className="mx-auto h-48 object-cover rounded-md" />
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
              disabled={loading || uploading || capturing}
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
