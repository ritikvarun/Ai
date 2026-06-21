'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Calendar, 
  Kanban, 
  FileText, 
  Presentation, 
  Cpu, 
  Users, 
  Settings 
} from 'lucide-react';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  lightColor: string;
  darkColor: string;
  bgGlow: string;
}

export default function FeatureSection() {
  const features: FeatureCard[] = [
    {
      title: "AI Copilot Assistant",
      description: "Chat, query documents, assign deadlines, and run command-center macros seamlessly across your entire workspace workspace.",
      icon: Sparkles,
      lightColor: "#EF4444",
      darkColor: "#FF6B5A",
      bgGlow: "from-rose-500/5 to-orange-500/5"
    },
    {
      title: "Central Dashboard",
      description: "A workspace dashboard space tracking recent file updates, pending task items, today's calendar syncs, and custom app links.",
      icon: LayoutDashboard,
      lightColor: "#10B981",
      darkColor: "#34D399",
      bgGlow: "from-emerald-500/5 to-teal-500/5"
    },
    {
      title: "Workspace Calendar",
      description: "Schedule events, drag task deadlines into layout slots, set notifications, and sync schedules across active team channels.",
      icon: Calendar,
      lightColor: "#D97706",
      darkColor: "#FBBF24",
      bgGlow: "from-amber-500/5 to-orange-500/5"
    },
    {
      title: "Kanban Task Boards",
      description: "Fully interactive drag-and-drop workflow status columns. Manage assignees, details, descriptions, tags, and AI automation.",
      icon: Kanban,
      lightColor: "#6366F1",
      darkColor: "#818CF8",
      bgGlow: "from-indigo-500/5 to-purple-500/5"
    },
    {
      title: "Notion-style Notes",
      description: "Block-based structured markdown text editor. Insert lists, headers, code, images, and trigger AI to summarize or re-write.",
      icon: FileText,
      lightColor: "#0D9488",
      darkColor: "#2DD4BF",
      bgGlow: "from-teal-500/5 to-cyan-500/5"
    },
    {
      title: "Miro-style Whiteboard",
      description: "Infinite sketching canvas backed by Excalidraw. Sketch vector wireframes, add sticky notes, and generate flowcharts via AI prompts.",
      icon: Presentation,
      lightColor: "#06B6D4",
      darkColor: "#22D3EE",
      bgGlow: "from-cyan-500/5 to-sky-500/5"
    },
    {
      title: "AI Template Builder",
      description: "Write prompts to generate custom single-page widgets, trackers, or mini layout apps. Save to your custom sidebar stack instantly.",
      icon: Cpu,
      lightColor: "#8B5CF6",
      darkColor: "#A78BFA",
      bgGlow: "from-violet-500/5 to-pink-500/5"
    },
    {
      title: "Real-time Collaboration",
      description: "Powered by Liveblocks. Collaborate simultaneously with multiplayer pointer tracks, note block lock, comments, and project presence.",
      icon: Users,
      lightColor: "#EC4899",
      darkColor: "#F472B6",
      bgGlow: "from-pink-500/5 to-rose-500/5"
    },
    {
      title: "Custom Settings & Categories",
      description: "Align your space theme. Select cozy color variables, toggles, profile detail settings, and folder structures that fit your style.",
      icon: Settings,
      lightColor: "#475569",
      darkColor: "#94A3B8",
      bgGlow: "from-slate-500/5 to-zinc-500/5"
    }
  ];

  return (
    <section id="features" className="py-20 bg-secondary/10 relative px-6">
      
      {/* Structural borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
            Unrivaled Power
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mt-3 tracking-tight">
            Every Productivity tool, re-imagined with AI
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-4 font-medium leading-relaxed">
            Stop switching between Notion, Miro, Kanban, and Slack. AuraFlow consolidates your workflow tools into one cohesive, cozy canvas.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            
            return (
              <div 
                key={idx}
                className="relative rounded-2xl border border-border/70 bg-card p-6 shadow-sm hover:shadow-md hover:border-border/100 transition-all duration-300 group overflow-hidden flex flex-col justify-between"
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />

                <div>
                  {/* Icon Indicator */}
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-border bg-secondary/20 transition-all duration-300 group-hover:scale-110"
                    style={{
                      borderColor: 'rgba(230, 230, 230, 0.4)'
                    }}
                  >
                    {/* The icon utilizes a dynamic CSS variable approach or classes for colors */}
                    <div className="transition-transform duration-300 group-hover:rotate-6">
                      <Icon 
                        size={20} 
                        style={{ color: feature.lightColor }}
                        className="dark:hidden"
                        strokeWidth={2.2}
                      />
                      <Icon 
                        size={20} 
                        style={{ color: feature.darkColor }}
                        className="hidden dark:block"
                        strokeWidth={2.2}
                      />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h4 className="text-sm font-bold text-foreground mt-5">
                    {feature.title}
                  </h4>
                  <p className="text-[11.5px] text-muted-foreground font-medium mt-2 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Learn More slide arrow */}
                <div className="mt-6 flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200">
                  <span>Explore module</span>
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
