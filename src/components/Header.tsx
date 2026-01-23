import React from 'react';
import { LayoutGrid } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(247,241,230,0.85)] backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white/80 shadow-sm">
            <LayoutGrid className="w-5 h-5 text-[var(--ink)]" />
          </div>
          <div className="leading-none">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--muted)]">
              Reinsurance Innovation
            </p>
            <h1 className="font-playfair text-xl font-semibold tracking-tight">
              <span className="text-[var(--accent)]">Re</span>
              <span className="text-[var(--ink)]">Inno</span>
              <span className="text-[var(--accent-2)]">Hub</span>
            </h1>
          </div>
        </div>

        {/* Issue Info */}
        <div className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[var(--muted)]">
          <span>2025 · 第一期</span>
          <span className="h-px w-10 bg-[var(--line)]" />
          <span>数字化转型与AI应用</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
