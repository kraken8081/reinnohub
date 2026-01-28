import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(247,241,230,0.85)] backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="group flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white/80 shadow-sm transition-transform duration-300 hover:-rotate-2">
            <svg
              viewBox="0 0 48 48"
              className="h-6 w-6 text-[var(--ink)] transition-transform duration-300 group-hover:rotate-6"
              aria-hidden
            >
              <defs>
                <linearGradient id="reinnohub-mark" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="50%" stopColor="var(--accent-2)" />
                  <stop offset="100%" stopColor="var(--accent-3)" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="17" fill="none" stroke="url(#reinnohub-mark)" strokeWidth="1.6" />
              <path
                d="M13 22c3-5 8-7 11-7s8 2 11 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M13 26c3 5 8 7 11 7s8-2 11-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <circle cx="24" cy="24" r="2" fill="var(--accent)" />
              <circle cx="14.5" cy="24" r="1.6" fill="var(--accent-2)" />
              <circle cx="33.5" cy="24" r="1.6" fill="var(--accent-3)" />
            </svg>
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

        {/* Platform Info */}
        <div className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[var(--muted)]">
          <span>项目展示平台</span>
          <span className="h-px w-10 bg-[var(--line)]" />
          <span>数字化转型与AI应用</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
