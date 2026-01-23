import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../services/api';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0 }) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // 如果点击的是链接本身，让链接自己处理
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    // 否则打开项目链接
    window.open(project.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative h-[420px] flex flex-col overflow-hidden rounded-2xl
                 bg-white/80 backdrop-blur-sm cursor-pointer
                 shadow-[0_4px_20px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)]
                 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.04)]
                 border border-black/[0.04] animate-fade-rise
                 before:absolute before:inset-0 before:rounded-2xl before:opacity-0
                 before:bg-gradient-to-br before:from-white/40 before:to-transparent
                 before:transition-opacity before:duration-500 hover:before:opacity-100"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* 图片容器 - 固定高度 */}
      <div className="relative h-[180px] flex-shrink-0 overflow-hidden">
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transform
                     group-hover:scale-[1.08]
                     transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
        />

        {/* 日期标签 - 重新设计 */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5
                          rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                          text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--ink)]
                          border border-white/50">
            {new Date(project.createdAt).toISOString().split('T')[0]}
          </div>
        </div>

        {/* 悬停时显示的快速链接按钮 */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full
                     bg-white/95 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                     flex items-center justify-center
                     opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                     transition-all duration-400 ease-out
                     hover:bg-[var(--accent)] hover:text-white"
        >
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* 内容区域 - 弹性填充 */}
      <div className="flex-1 flex flex-col p-5 pt-4">
        {/* 标签行 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.slice(0, 2).map((tag, i) => (
            <span
              key={tag}
              className={`text-[9px] uppercase tracking-[0.12em] font-bold px-2 py-0.5 rounded-full
                         ${i === 0
                           ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                           : 'bg-[var(--accent-2)]/10 text-[var(--accent-2)]'}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 标题 - 固定两行，带下划线动效 */}
        <h3 className="font-playfair text-lg font-bold text-[var(--ink)] leading-[1.35] mb-2 line-clamp-2 min-h-[2.7em]">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-left-bottom bg-gradient-to-r from-[var(--ink)] to-[var(--ink)]
                       bg-[length:0%_1px] bg-no-repeat
                       group-hover:bg-[length:100%_1px]
                       transition-all duration-500 ease-out"
          >
            {project.title}
          </a>
        </h3>

        {/* 描述 - 固定三行 */}
        <p className="text-[var(--muted)] text-[13px] leading-[1.7] line-clamp-3 flex-1 font-light">
          {project.description}
        </p>

        {/* 底部操作区 */}
        <div className="mt-4 pt-3 border-t border-[var(--line)]/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-2)] animate-pulse" />
            <span className="text-[10px] text-[var(--muted)] tracking-wide">Active</span>
          </div>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-[var(--ink)] uppercase tracking-[0.15em]
                       flex items-center gap-1.5 py-1
                       opacity-70 hover:opacity-100 transition-opacity duration-300
                       group/link"
          >
            <span className="relative">
              阅读全文
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-current group-hover/link:w-full transition-all duration-300" />
            </span>
            <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
