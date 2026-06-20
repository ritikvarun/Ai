'use client';

import React from 'react';
import { 
  Sun, 
  Moon, 
  Search, 
  Share2, 
  Users, 
  Bell, 
  Sparkles,
  Command
} from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  activePage: string;
}

export default function Navbar({ isDark, setIsDark, activePage }: NavbarProps) {
  // Map page IDs to human-readable screen titles
  const getPageTitle = (id: string) => {
    switch (id) {
      case 'dashboard':
        return { title: 'Dashboard Space', subtitle: 'Overview & recent updates' };
      case 'ai-assistant':
        return { title: 'Spark AI Copilot', subtitle: 'Brainstorm and generate templates' };
      case 'calendar':
        return { title: 'Workspace Calendar', subtitle: 'Schedule deadlines and sync sessions' };
      case 'tasks':
        return { title: 'Task & Kanban Boards', subtitle: 'Track task cards and progress status' };
      case 'notes':
        return { title: 'Notion Documents', subtitle: 'Structured workspaces and docs' };
      case 'whiteboard':
        return { title: 'Infinite Whiteboard Canvas', subtitle: 'Miro-style nodes and sticky notes' };
      case 'pages':
        return { title: 'Spaces & Pages', subtitle: 'Workspace hierarchy directory' };
      case 'template-builder':
        return { title: 'AI Workspace Creator', subtitle: 'Generate layouts using AI prompts' };
      case 'settings':
        return { title: 'System Preferences', subtitle: 'Manage cozy layouts and configurations' };
      default:
        return { title: 'AuraFlow Workspace', subtitle: 'Notion × Miro productivity suite' };
    }
  };

  const { title, subtitle } = getPageTitle(activePage);

  return (
    <header 
      className="h-16 border-b border-border/70 px-6 flex items-center justify-between select-none bg-card/65 backdrop-blur-md cozy-transition"
      style={{
        zIndex: 40
      }}
    >
      {/* Page Title & Context */}
      <div className="flex flex-col text-left">
        <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5 leading-none">
          {title}
          {activePage === 'ai-assistant' && (
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
          )}
        </h2>
        <span className="text-[10px] text-muted-foreground font-medium mt-1 leading-none">
          {subtitle}
        </span>
      </div>

      {/* Center Section: Workspace Search */}
      <div className="hidden md:flex items-center gap-2 max-w-sm w-full mx-4 relative">
        <Search size={13} className="absolute left-3 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Quick search in nodes or pages..." 
          className="w-full pl-8 pr-12 py-1.5 rounded-lg border border-border/80 bg-secondary/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all duration-200"
        />
        <div className="absolute right-2.5 flex items-center gap-0.5 text-[9px] font-mono font-bold text-muted-foreground/80 bg-border/40 px-1 py-0.5 rounded border border-border/60">
          <Command size={8} /> K
        </div>
      </div>

      {/* Right Section: Actions & Theme Switcher */}
      <div className="flex items-center gap-3">
        {/* Collaboration widgets */}
        <div className="flex items-center -space-x-1.5 mr-2">
          <div className="w-6 h-6 rounded-full border border-card bg-emerald-500 text-[9px] font-bold text-white flex items-center justify-center cursor-help" title="Alice is editing">A</div>
          <div className="w-6 h-6 rounded-full border border-card bg-indigo-500 text-[9px] font-bold text-white flex items-center justify-center cursor-help" title="Bob is viewing">B</div>
          <div className="w-6 h-6 rounded-full border border-card bg-amber-500 text-[9px] font-bold text-white flex items-center justify-center cursor-help" title="Charlie is commenting">C</div>
          <span className="text-[9px] font-semibold text-muted-foreground pl-2">+3 online</span>
        </div>

        {/* Share Button */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-[11px] font-bold hover:bg-secondary cozy-transition text-foreground shadow-sm cursor-pointer">
          <Share2 size={12} /> Share
        </button>

        {/* Notification Bell */}
        <button className="p-1.5 rounded-lg border border-border hover:bg-secondary cozy-transition text-muted-foreground hover:text-foreground relative cursor-pointer shadow-sm">
          <Bell size={13} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        </button>

        {/* --- DYNAMIC DARK/LIGHT MODE NAVBAR TOGGLE BUTTON --- */}
        <div className="h-6 w-px bg-border/60 mx-1" />
        
        <button
          onClick={() => setIsDark(!isDark)}
          className={`relative h-8 w-14 rounded-full p-1 cursor-pointer transition-all duration-300 shadow-inner flex items-center ${
            isDark 
              ? 'bg-zinc-800 border border-zinc-700/80 justify-end' 
              : 'bg-orange-100/60 border border-orange-200/80 justify-start'
          }`}
          title={isDark ? "Switch to cozy light theme" : "Switch to fresh dark theme"}
        >
          {/* Glowing slider thumb */}
          <div 
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDark 
                ? 'bg-zinc-950 text-yellow-400 shadow-md shadow-yellow-500/20' 
                : 'bg-white text-orange-500 shadow-md shadow-orange-500/10'
            }`}
          >
            {isDark ? (
              <Sun size={13} className="animate-spin-slow" />
            ) : (
              <Moon size={13} />
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
