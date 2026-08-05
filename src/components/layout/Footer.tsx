import React from 'react';
import { Shield, Github, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md py-8 text-slate-500 dark:text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-indigo-500" />
          <span>© {new Date().getFullYear()} Edukalyan Platform. Production-Ready Supabase Architecture.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-indigo-500 transition-colors flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" /> Documentation
          </a>
          <a href="#" className="hover:text-indigo-500 transition-colors flex items-center gap-1">
            <Github className="h-3.5 w-3.5" /> Repository
          </a>
          <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-500 font-mono font-semibold">
            v1.0.0 Stable
          </span>
        </div>
      </div>
    </footer>
  );
};
