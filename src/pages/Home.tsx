import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import { api, Project } from '../services/api';

const PROJECTS_CACHE_KEY = 'projects_cache_v1';
const PROJECTS_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const VALUE_ITEMS = [
  { title: '选题雷达', desc: '追踪再保险前沿议题与行业动态，避免信息滞后。' },
  { title: '项目拆解', desc: '结构化拆解方案路径、关键流程与落地难点。' },
  { title: '可复用方案', desc: '聚焦可复制的方法与组件，缩短团队试错周期。' },
  { title: '工具对比', desc: '沉淀供应商与工具差异，辅助选型决策。' }
];
const SKELETON_CARDS = Array.from({ length: 6 });

type ProjectsCachePayload = {
  version: 1;
  timestamp: number;
  data: Project[];
  listVersion: string | null;
};

const readProjectsCache = (): ProjectsCachePayload | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(PROJECTS_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as ProjectsCachePayload;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.data)) {
      return null;
    }
    if (Date.now() - parsed.timestamp > PROJECTS_CACHE_TTL_MS) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const writeProjectsCache = (data: Project[], listVersion: string | null) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const payload: ProjectsCachePayload = {
      version: 1,
      timestamp: Date.now(),
      data,
      listVersion
    };
    window.localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore cache write errors (storage full, disabled, etc.).
  }
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('全部');

  useEffect(() => {
    let isActive = true;
    const cached = readProjectsCache();
    const hasCached = Boolean(cached);

    if (cached && isActive) {
      setProjects(cached.data);
      setLoading(false);
    }

    const fetchProjects = async (fresh: boolean, listVersion: string | null) => {
      try {
        const data = await api.getProjects({ fresh });
        if (!isActive) {
          return;
        }
        setProjects(data);
        writeProjectsCache(data, listVersion);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        if (!hasCached && isActive) {
          setLoading(false);
        }
      }
    };

    const syncProjects = async () => {
      try {
        const remoteVersion = await api.getProjectsVersion();
        const cachedVersion = cached?.listVersion ?? null;

        if (remoteVersion !== cachedVersion) {
          await fetchProjects(true, remoteVersion);
          return;
        }

        if (!hasCached) {
          await fetchProjects(false, remoteVersion);
        }
      } catch (error) {
        console.error('Failed to sync project version:', error);
        if (!hasCached) {
          await fetchProjects(false, cached?.listVersion ?? null);
        }
      } finally {
        if (!hasCached && isActive) {
          setLoading(false);
        }
      }
    };

    syncProjects();

    return () => {
      isActive = false;
    };
  }, []);

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(project => {
      (project.tags || []).forEach(tag => {
        if (tag) {
          tags.add(tag);
        }
      });
    });
    return ['全部', ...Array.from(tags)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeTag === '全部') {
      return projects;
    }
    return projects.filter(project => (project.tags || []).includes(activeTag));
  }, [projects, activeTag]);

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
              <span className="font-medium">行业创新观察</span>
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

        {/* Value Proposition */}
        <section className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_1.9fr] items-start">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)] mb-3">你能在这里获得什么</p>
            <h3 className="font-playfair text-2xl sm:text-3xl text-[var(--ink)] leading-tight">
              面向再保险创新的可复用知识库
            </h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed mt-4 max-w-sm">
              以编辑视角聚合行业案例，帮助你快速判断趋势、复用方法、推动落地。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUE_ITEMS.map(item => (
              <div
                key={item.title}
                className="rounded-2xl border border-[var(--line)] bg-white/70 backdrop-blur-sm p-4 shadow-[0_6px_16px_rgba(0,0,0,0.04)]"
              >
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--accent)] mb-2">{item.title}</p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="my-10 h-px w-full bg-[var(--line)]" />

        {/* 项目计数 */}
        <div className="mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-[var(--muted)]">
          <span>最新项目</span>
          <span>
            {loading ? '加载中…' : `${filteredProjects.length} / ${projects.length} 个项目`}
          </span>
        </div>

        {/* 筛选 */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--muted)]">筛选</span>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map(tag => {
              const isActive = tag === activeTag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                    isActive
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                      : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 统一网格布局 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKELETON_CARDS.map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-[420px] rounded-2xl border border-black/[0.04] bg-white/70 backdrop-blur-sm p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)]"
              >
                <div className="h-[180px] rounded-xl skeleton" />
                <div className="mt-4 space-y-3">
                  <div className="flex gap-2">
                    <span className="h-4 w-16 rounded-full skeleton" />
                    <span className="h-4 w-12 rounded-full skeleton" />
                  </div>
                  <div className="h-5 w-5/6 rounded skeleton" />
                  <div className="h-4 w-full rounded skeleton" />
                  <div className="h-4 w-4/5 rounded skeleton" />
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-[var(--line)]/40">
                    <span className="h-3 w-16 rounded skeleton" />
                    <span className="h-3 w-12 rounded skeleton" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-10 text-center text-[var(--muted)]">
                暂无匹配项目，请尝试其他标签。
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--line)] py-8 text-center bg-[rgba(247,241,230,0.5)]">
        <p className="text-sm text-[var(--muted)] mb-2">
          <span className="font-playfair font-semibold">ReInnoHub</span> · 再保险创新中心 · 2025
        </p>
        <div className="flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.3em] text-[var(--line)]/80">
          <span>内部管理</span>
          <span className="h-px w-6 bg-[var(--line)]/70" />
          <Link
            to="/admin"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            管理入口
          </Link>
        </div>
      </footer>
    </div>
  );
}
