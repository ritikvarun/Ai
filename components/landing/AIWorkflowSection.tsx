'use client';

import React from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Users, 
  Check, 
  MessageSquarePlus, 
  Calendar, 
  FileText, 
  Presentation, 
  Cpu, 
  TrendingUp 
} from 'lucide-react';

export default function AIWorkflowSection() {
  const steps = [
    {
      num: "01",
      title: "Organize your workspace",
      description: "Set up pages, nested folders, Kanban task boards, and sketching canvases. Structure your space to replicate your exact business layout.",
      icon: PlusCircle,
      iconColor: "text-emerald-500 bg-emerald-500/10",
      accent: "emerald"
    },
    {
      num: "02",
      title: "Let AI help you plan and create",
      description: "Ask Spark AI to refine documentation, generate Excalidraw flowcharts, build custom trackers, and auto-schedule calendar reminders.",
      icon: Sparkles,
      iconColor: "text-orange-500 bg-orange-500/10",
      accent: "orange"
    },
    {
      num: "03",
      title: "Collaborate and track progress",
      description: "Invite your teammates with active user cursors, Liveblocks multiplayer editing, board ticket logs, and shared comment bubbles.",
      icon: Users,
      iconColor: "text-indigo-500 bg-indigo-500/10",
      accent: "indigo"
    }
  ];

  const aiCapabilities = [
    {
      icon: MessageSquarePlus,
      title: "Ask AI to Create Tasks",
      desc: "Simply write 'schedule database audit for Friday' and let AI parse, tag, and assign the ticket directly on your Kanban boards.",
      color: "text-red-500 bg-red-500/10"
    },
    {
      icon: Calendar,
      title: "Smart Calendar Reminders",
      desc: "AuraFlow scans notes and discussions to flag upcoming due dates, suggesting slot options in your Calendar page automatically.",
      color: "text-amber-500 bg-amber-500/10"
    },
    {
      icon: FileText,
      title: "Refine Note Content",
      desc: "Select any paragraph to expand, summarize, change tone, fix formatting, or translate directly within the TipTap editor canvas.",
      color: "text-teal-500 bg-teal-500/10"
    },
    {
      icon: Presentation,
      title: "Generate Diagrams",
      desc: "Turn textual specifications into flowcharts, architecture diagrams, or mind maps drawn directly onto your Excalidraw whiteboard.",
      color: "text-cyan-500 bg-cyan-500/10"
    },
    {
      icon: Cpu,
      title: "Build Mini Apps & Templates",
      desc: "Prompt AI to code fully interactive custom layouts (e.g. Pomodoro widgets, custom KPI counters) loaded into sandbox sidebar slots.",
      color: "text-violet-500 bg-violet-500/10"
    },
    {
      icon: TrendingUp,
      title: "Productivity Insights",
      desc: "Receive weekly reports analyzing workspace activity, highlighting project velocity, schedule leaks, and template effectiveness.",
      color: "text-slate-500 bg-slate-500/10"
    }
  ];

  return (
    <section id="workflow" className="py-20 px-6 relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-gradient-to-tr from-rose-400/5 to-indigo-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* HOW IT WORKS SUB-SECTION */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-pink-500 uppercase tracking-widest">
              Simple & Clean
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mt-3 tracking-tight">
              Get running in three simple steps
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-4 font-medium">
              Start building your centralized ecosystem today. No tutorials or manuals required.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Connection Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-200 via-orange-200 to-indigo-200 -z-10 -translate-y-12" />

            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-6 bg-card border border-border/60 rounded-2xl shadow-sm relative group hover:border-border/100 transition-all duration-300">
                  
                  {/* Step Num Tag */}
                  <span className="absolute -top-3.5 bg-background border border-border/80 text-[10px] font-extrabold px-3 py-1 rounded-full text-muted-foreground shadow-sm">
                    Step {step.num}
                  </span>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.iconColor} mb-6 mt-2 transition-transform duration-300 group-hover:scale-115`}>
                    <StepIcon size={24} strokeWidth={2.2} />
                  </div>

                  {/* Copy */}
                  <h4 className="text-sm font-bold text-foreground">
                    {step.title}
                  </h4>
                  <p className="text-[11.5px] text-muted-foreground font-medium mt-2 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI CAPABILITIES SUB-SECTION */}
        <div className="border-t border-border/60 pt-20">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
              Spark AI Features
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mt-3 tracking-tight">
              An agentic copilot that does the work for you
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-4 font-medium">
              AuraFlow features an integrated AI assistant that goes beyond simple chat to manipulate workspace states directly.
            </p>
          </div>

          {/* AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiCapabilities.map((cap, idx) => {
              const CapIcon = cap.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl border border-border/60 bg-card hover:border-border/90 transition-all duration-300 shadow-sm">
                  
                  {/* Left Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cap.color} flex-shrink-0`}>
                    <CapIcon size={18} strokeWidth={2.2} />
                  </div>

                  {/* Right Description */}
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-foreground">
                      {cap.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-medium mt-1.5 leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
