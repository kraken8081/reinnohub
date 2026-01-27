import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import { api, Project } from '../services/api';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-40 paper-texture" />
        <div className="absolute -top-28 left-[-8%] h-72 w-72 rounded-full bg-[var(--accent)] opacity-15 blur-3xl animate-float" />
        <div
          className="absolute top-1/4 right-[-12%] h-96 w-96 rounded-full bg-[var(--accent-2)] opacity-15 blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-[-18%] left-[20%] h-80 w-80 rounded-full bg-[var(--accent-3)] opacity-20 blur-3xl animate-float"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-12">
        {/* Hero Section - Editorial Style */}
        <section className="mb-16 animate-fade-rise relative">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-[var(--muted)] mb-6">
              <span className="h-px w-8 bg-[var(--accent)] opacity-60" />
              <span className="font-medium">项目展示平台</span>
              <span className="h-px w-8 bg-[var(--accent)] opacity-60" />
            </div>

            <h2 className="font-playfair text-5xl sm:text-6xl lg:text-7xl leading-tight text-[var(--ink)] max-w-4xl mx-auto">
              再保险<span className="text-[var(--accent)] italic pr-2">创新</span>前沿
            </h2>

            <div className="w-16 h-1 bg-[var(--line)] my-8 rounded-full" />

            <p className="text-[var(--muted)] text-lg sm:text-xl leading-relaxed max-w-2xl font-light">
              精选再保险行业数字化转型与 AI 应用的前沿项目，<br className="hidden sm:block"/>为团队提供创新灵感与技术参考。
            </p>
          </div>
        </section>

        <div className="my-10 h-px w-full bg-[var(--line)]" />

        {/* 项目计数 */}
        <div className="mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-[var(--muted)]">
          <span>最新项目</span>
          <span>{loading ? '加载中...' : `${projects.length} 个项目`}</span>
        </div>

        {/* 统一网格布局 */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-[var(--muted)] tracking-widest text-xs">LOADING...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--line)] py-8 text-center bg-[rgba(247,241,230,0.5)]">
        <p className="text-sm text-[var(--muted)] mb-2">
          <span className="font-playfair font-semibold">ReInnoHub</span> · 再保险创新中心 · 2025
        </p>
        <Link to="/admin" className="text-[10px] text-[var(--line)] hover:text-[var(--muted)] uppercase tracking-widest transition-colors">
          Admin Access
        </Link>
      </footer>
    </div>
  );
}
