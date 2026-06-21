'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Calendar, 
  Kanban, 
  FileText, 
  Presentation, 
  FolderOpen, 
  Cpu, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun,
  User,
  X,
  Flame,
  Wallet,
  DollarSign,
  Utensils,
  BookOpen,
  Activity,
  Compass,
  CheckSquare,
  Trophy,
  Shield,
  Layers,
  ListTodo
} from 'lucide-react';
import { useAppUser } from '@/lib/auth-context';

const iconMap: Record<string, React.ComponentType<any>> = {
  Flame,
  Wallet,
  DollarSign,
  Utensils,
  BookOpen,
  Activity,
  Compass,
  CheckSquare,
  Sparkles,
  Trophy,
  Shield,
  Layers,
  ListTodo
};

// Define the menu item structure
export interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: { light: string; dark: string };
  badge?: string;
  badgeColor?: string;
  isCustom?: boolean;
  appId?: string;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface SidebarProps {
  activePage: string;
  setActivePage: (id: string) => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  sidebarApps?: any[];
  createdApps?: any[];
  setCreatedApps?: (apps: any[]) => void;
}

export default function Sidebar({ 
  activePage, 
  setActivePage, 
  isDark, 
  setIsDark,
  sidebarApps = [],
  createdApps = [],
  setCreatedApps
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAppUser();
  const userId = user?.id || 'guest';

  const handleRemoveFromSidebar = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!setCreatedApps) return;
    const updated = createdApps.map(app => {
      if (app.id === appId) {
        return { ...app, pinned: false };
      }
      return app;
    });
    setCreatedApps(updated);
    localStorage.setItem(`auraflow_created_apps_${userId}`, JSON.stringify(updated));
  };

  // Grouped Menu Options
  const groups: MenuGroup[] = [
    {
      label: 'Workspace',
      items: [
        { 
          id: 'dashboard', 
          name: 'Dashboard', 
          icon: LayoutDashboard, 
          color: { light: '#10B981', dark: '#34D399' } // Fresh Emerald
        },
        { 
          id: 'pages', 
          name: 'Pages / Spaces', 
          icon: FolderOpen, 
          color: { light: '#EC4899', dark: '#F472B6' } // Rose Pink
        }
      ]
    },
    {
      label: 'Tools',
      items: [
        { 
          id: 'ai-assistant', 
          name: 'AI Assistant', 
          icon: Sparkles, 
          color: { light: '#EF4444', dark: '#FF6B5A' }, // Bright Coral
          badge: 'Live',
          badgeColor: 'bg-coral/10 text-coral'
        },
        { 
          id: 'calendar', 
          name: 'Calendar', 
          icon: Calendar, 
          color: { light: '#D97706', dark: '#FBBF24' } // Cozy Amber
        },
        { 
          id: 'tasks', 
          name: 'Task / Kanban', 
          icon: Kanban, 
          color: { light: '#6366F1', dark: '#818CF8' } // Pastel Indigo
        },
        { 
          id: 'notes', 
          name: 'Notes', 
          icon: FileText, 
          color: { light: '#0D9488', dark: '#2DD4BF' } // Warm Teal
        },
        { 
          id: 'whiteboard', 
          name: 'Whiteboard', 
          icon: Presentation, 
          color: { light: '#06B6D4', dark: '#22D3EE' } // Bright Cyan
        }
      ]
    },
    {
      label: 'Management',
      items: [
        { 
          id: 'template-builder', 
          name: 'AI Template Builder', 
          icon: Cpu, 
          color: { light: '#8B5CF6', dark: '#A78BFA' } // Neon Violet
        },
        { 
          id: 'settings', 
          name: 'Settings', 
          icon: Settings, 
          color: { light: '#64748B', dark: '#94A3B8' } // Slate Gray
        }
      ]
    }
  ];

  // Inject user generated custom apps
  const allGroups = [...groups];
  if (sidebarApps && sidebarApps.length > 0) {
    const customItems = sidebarApps.map(app => {
      const IconComponent = iconMap[app.icon] || Sparkles;
      return {
        id: `app_${app.id}`,
        name: app.appName,
        icon: IconComponent,
        color: { light: app.color, dark: app.color },
        isCustom: true,
        appId: app.id
      };
    });
    
    // Insert "My Apps" right after "Workspace" group
    allGroups.splice(1, 0, {
      label: 'My Apps',
      items: customItems as any[]
    });
  }

  return (
    <aside 
      className={`relative h-screen max-h-screen overflow-hidden bg-secondary/35 border-r border-border cozy-transition flex flex-col select-none ${
        isCollapsed ? 'w-[72px]' : 'w-[250px]'
      }`}
      style={{
        backgroundColor: 'var(--color-secondary-foreground-10)', // soft mix
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Header / Logo Section */}
      <div className={`p-4 flex items-center border-b border-border/60 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Cozy Premium Logo */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-400 via-pink-400 to-indigo-500 shadow-md flex-shrink-0 animate-pulse">
            <span className="text-white font-bold text-lg select-none">A</span>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-zinc-900 rounded-full"></div>
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col cozy-transition animate-in fade-in slide-in-from-left-4 duration-300">
              <span className="font-semibold text-[15px] tracking-tight leading-none bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                AuraFlow
              </span>
              <span className="text-[10px] text-muted-foreground font-medium mt-1">Notion × Miro</span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg border border-border/80 hover:bg-secondary cozy-transition text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden px-3 space-y-5 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {allGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {/* Group Label */}
            {!isCollapsed ? (
              <h3 className="px-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase opacity-80 select-none">
                {group.label}
              </h3>
            ) : (
              <div className="h-px bg-border/40 my-2 mx-1" />
            )}

            {/* Group Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activePage === item.id;
                const iconColor = isDark ? item.color.dark : item.color.light;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-[13px] font-medium cozy-transition group cursor-pointer relative ${
                      isActive 
                        ? 'bg-card text-foreground cozy-shadow border border-border/60' 
                        : 'text-muted-foreground hover:bg-card/45 hover:text-foreground border border-transparent'
                    }`}
                  >
                    {/* Active left indicator line */}
                    {isActive && (
                      <span 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-r-full cozy-transition"
                        style={{ backgroundColor: iconColor }}
                      />
                    )}

                    {/* Icon container */}
                    <div 
                      className={`flex items-center justify-center flex-shrink-0 cozy-transition ${
                        isCollapsed ? 'mx-auto w-8 h-8 rounded-lg' : ''
                      }`}
                      style={{ color: iconColor }}
                    >
                      <item.icon 
                        size={16} 
                        className={`cozy-transition group-hover:scale-110`}
                        strokeWidth={2.2}
                      />
                    </div>

                    {/* Text Label */}
                    {!isCollapsed && (
                      <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis cozy-transition">
                        {item.name}
                      </span>
                    )}

                    {/* Remove button for custom apps */}
                    {!isCollapsed && item.isCustom && (
                      <span
                        onClick={(e) => handleRemoveFromSidebar(item.appId || '', e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
                        title="Remove from sidebar"
                      >
                        <X size={12} />
                      </span>
                    )}

                    {/* Optional Badge */}
                    {!isCollapsed && item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-400/20`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip for collapsed states */}
                    {isCollapsed && (
                      <div className="absolute left-[78px] bg-popover text-popover-foreground text-xs font-semibold px-2 py-1.5 rounded-md shadow-md border border-border opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Section */}
      <div className="p-3 border-t border-b-0 border-l-0 border-r-0 border-border/70 bg-secondary/10 flex flex-col gap-2.5">
        
        {/* Theme and Expand buttons */}
        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between px-1'}`}>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg border border-border/80 hover:bg-card cozy-transition text-muted-foreground hover:text-foreground cursor-pointer shadow-sm"
            title={isDark ? "Switch to cozy light theme" : "Switch to fresh dark theme"}
          >
            {isDark ? <Sun size={14} className="text-yellow-400 animate-spin-slow" /> : <Moon size={14} className="text-indigo-500" />}
          </button>

          {isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(false)}
              className="p-2 rounded-lg border border-border/80 hover:bg-card cozy-transition text-muted-foreground hover:text-foreground cursor-pointer shadow-sm"
              aria-label="Expand sidebar"
            >
              <ChevronRight size={14} />
            </button>
          )}

          {!isCollapsed && (
            <span className="text-[10px] text-muted-foreground/80 font-medium font-mono bg-border/40 px-1.5 py-0.5 rounded">
              v1.0.4
            </span>
          )}
        </div>

        {/* User profile card */}
        <div className={`flex items-center gap-2.5 p-1 rounded-xl border border-transparent cozy-transition ${isCollapsed ? 'justify-center' : 'hover:bg-card/40 hover:border-border/30'}`}>
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-zinc-800 flex items-center justify-center border border-border text-foreground overflow-hidden">
              <User size={15} className="text-muted-foreground" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0 flex flex-col text-left">
              <span className="text-xs font-semibold truncate text-foreground leading-tight">Sarah Jenkins</span>
              <span className="text-[9px] text-muted-foreground truncate">sarah@auraflow.io</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
