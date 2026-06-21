'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Kanban, 
  Presentation, 
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  MousePointer
} from 'lucide-react';

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notes' | 'kanban' | 'whiteboard' | 'ai'>('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard Space', icon: LayoutDashboard, color: 'text-emerald-500 bg-emerald-500/10' },
    { id: 'notes', name: 'Notes & Docs', icon: FileText, color: 'text-teal-500 bg-teal-500/10' },
    { id: 'kanban', name: 'Task Boards', icon: Kanban, color: 'text-indigo-500 bg-indigo-500/10' },
    { id: 'whiteboard', name: 'Whiteboard Canvas', icon: Presentation, color: 'text-cyan-500 bg-cyan-500/10' },
    { id: 'ai', name: 'Spark AI Assistant', icon: Sparkles, color: 'text-rose-500 bg-rose-500/10' }
  ];

  return (
    <section id="showcase" className="py-20 bg-secondary/15 relative px-6">
      
      {/* Visual background separation border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
            Product Showcase
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mt-3 tracking-tight">
            See AuraFlow in Action
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-4 font-medium leading-relaxed">
            Click through our key modules below to preview the premium, cozy interfaces built to accelerate your work days.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-card text-foreground border-border/80 shadow-sm' 
                    : 'text-muted-foreground bg-transparent border-transparent hover:bg-secondary/40 hover:text-foreground'
                }`}
              >
                <TabIcon size={14} className={isActive ? tab.color.split(' ')[0] : 'text-muted-foreground'} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Showcase Container */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 md:p-6 shadow-xl relative min-h-[350px] md:min-h-[460px] flex flex-col md:flex-row gap-8 overflow-hidden items-stretch">
          
          {/* Details Column */}
          <div className="w-full md:w-1/3 flex flex-col justify-between text-left">
            <div>
              {activeTab === 'dashboard' && (
                <>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full mb-4">
                    Overview Workspace
                  </div>
                  <h4 className="text-lg md:text-xl font-extrabold leading-tight">
                    Smart Central Command
                  </h4>
                  <p className="text-xs text-muted-foreground mt-3 font-medium leading-relaxed">
                    The AuraFlow dashboard workspace automatically gathers your recent edits, pending tasks, and system calendar. Pin custom template panels, write search queries, or review updates in seconds.
                  </p>
                  <ul className="space-y-2 mt-6 text-xs text-muted-foreground font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span>Aggregated layout grids</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span>Custom template pinnings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span>Fast database full-text search</span>
                    </li>
                  </ul>
                </>
              )}

              {activeTab === 'notes' && (
                <>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded-full mb-4">
                    Markdown Documents
                  </div>
                  <h4 className="text-lg md:text-xl font-extrabold leading-tight">
                    Notion-Style Block Editor
                  </h4>
                  <p className="text-xs text-muted-foreground mt-3 font-medium leading-relaxed">
                    Write documents using clean, distraction-free markdown. Embed headers, to-do checklists, blocks of code, and tables. Highlight any content block to trigger AI summaries or custom revisions instantly.
                  </p>
                  <ul className="space-y-2 mt-6 text-xs text-muted-foreground font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-teal-500" />
                      <span>Structured markdown hierarchy</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-teal-500" />
                      <span>In-line AI copy refining</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-teal-500" />
                      <span>Real-time co-author locking</span>
                    </li>
                  </ul>
                </>
              )}

              {activeTab === 'kanban' && (
                <>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded-full mb-4">
                    Task Management
                  </div>
                  <h4 className="text-lg md:text-xl font-extrabold leading-tight">
                    Kanban Status Board
                  </h4>
                  <p className="text-xs text-muted-foreground mt-3 font-medium leading-relaxed">
                    Track ticket status pipelines via drag-and-drop. Write detailed card summaries, set priority tags, assign tasks to coworkers, and let AI schedule due dates directly onto the workspace calendar.
                  </p>
                  <ul className="space-y-2 mt-6 text-xs text-muted-foreground font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-indigo-500" />
                      <span>Interactive drag-and-drop states</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-indigo-500" />
                      <span>Detailed card comments & logs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-indigo-500" />
                      <span>Automated scheduling pipelines</span>
                    </li>
                  </ul>
                </>
              )}

              {activeTab === 'whiteboard' && (
                <>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-cyan-600 bg-cyan-500/10 px-2 py-0.5 rounded-full mb-4">
                    Infinite Sketching
                  </div>
                  <h4 className="text-lg md:text-xl font-extrabold leading-tight">
                    Miro-Style Infinite Canvas
                  </h4>
                  <p className="text-xs text-muted-foreground mt-3 font-medium leading-relaxed">
                    Brainstorm without boundaries. Place sticky notes, sketch diagrams, write annotations, and generate flowcharts using natural language prompts translated into vector shapes automatically.
                  </p>
                  <ul className="space-y-2 mt-6 text-xs text-muted-foreground font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-cyan-500" />
                      <span>Excalidraw-powered infinite nodes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-cyan-500" />
                      <span>AI diagram & flowchart creator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-cyan-500" />
                      <span>Collaborative mouse pointer traces</span>
                    </li>
                  </ul>
                </>
              )}

              {activeTab === 'ai' && (
                <>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full mb-4">
                    AI Workspace Copilot
                  </div>
                  <h4 className="text-lg md:text-xl font-extrabold leading-tight">
                    Integrated Command Center
                  </h4>
                  <p className="text-xs text-muted-foreground mt-3 font-medium leading-relaxed">
                    More than a basic chat box. Spark AI connects to your databases and pages directly. Command it to schedule a card, create a workspace space folder, or compile templates under your sidebar hierarchy.
                  </p>
                  <ul className="space-y-2 mt-6 text-xs text-muted-foreground font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-rose-500" />
                      <span>Multi-turn contextual planning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-rose-500" />
                      <span>Direct node & folder creation APIs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-rose-500" />
                      <span>Voice agent command capabilities</span>
                    </li>
                  </ul>
                </>
              )}
            </div>

            {/* Launch App Link */}
            <a 
              href="/sign-in"
              className="mt-8 self-start inline-flex items-center gap-1 text-xs font-bold bg-secondary hover:bg-secondary/80 border border-border px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Open in App <ChevronRight size={13} />
            </a>
          </div>

          {/* Graphic/Mockup Column */}
          <div className="flex-1 rounded-xl border border-border/60 bg-secondary/15 p-1 relative overflow-hidden flex flex-col justify-start shadow-inner min-h-[300px]">
            
            {/* Mock Header tabs */}
            <div className="h-8 border-b border-border/40 bg-card px-3 flex items-center justify-between text-[9px] font-bold text-muted-foreground select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary/80" />
                <span>Workstation Preview</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Active</span>
              </div>
            </div>

            {/* Active Mock Screen Render */}
            <div className="flex-1 bg-background p-4 relative overflow-auto font-sans flex flex-col justify-start">
              
              {/* DASHBOARD PREVIEW */}
              {activeTab === 'dashboard' && (
                <div className="flex flex-col gap-4 text-left w-full h-full">
                  {/* Grid Widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Welcome Widget */}
                    <div className="border border-border/60 rounded-xl p-3.5 bg-card flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="absolute right-2 top-2 text-[20px]">🌤️</div>
                      <div>
                        <span className="text-[10px] text-muted-foreground font-bold">WELCOME BACK</span>
                        <h5 className="text-sm font-bold text-foreground mt-0.5">Sarah Jenkins</h5>
                        <p className="text-[9px] text-muted-foreground mt-1">You have 3 task deadlines due today. Spark AI generated 2 suggestions.</p>
                      </div>
                      <div className="h-2" />
                      <button className="self-start text-[8px] font-bold bg-secondary/80 px-2.5 py-1 rounded-md border border-border/40">Review plan</button>
                    </div>

                    {/* Quick Stats Widget */}
                    <div className="border border-border/60 rounded-xl p-3.5 bg-card flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                        <span>WORKSPACE VELOCITY</span>
                        <span className="text-emerald-500">+14%</span>
                      </div>
                      <div className="my-2 flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold">24</span>
                        <span className="text-[8px] text-muted-foreground">tickets closed this week</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[78%]" />
                        </div>
                        <span className="text-[8px] font-bold text-muted-foreground">78% Goal</span>
                      </div>
                    </div>

                  </div>

                  {/* Recent Activity lists */}
                  <div className="border border-border/40 bg-secondary/20 rounded-xl p-3">
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Recent Space Updates</h5>
                    <div className="space-y-1.5">
                      {[
                        { title: "Design Guidelines", type: "Note document edited by Bob", time: "10m ago", border: "border-teal-500" },
                        { title: "Landing Page Mockups", type: "Whiteboard canvas modified", time: "30m ago", border: "border-cyan-500" },
                        { title: "Database Architecture", type: "Kanban board card scheduled", time: "2h ago", border: "border-indigo-500" }
                      ].map((act, idx) => (
                        <div key={idx} className="bg-card p-2 rounded-lg border border-border/50 flex items-center justify-between text-[9px] shadow-sm">
                          <div className="flex items-center gap-2">
                            <span className={`w-1 h-3.5 rounded ${act.border} bg-current`} />
                            <div>
                              <span className="font-bold text-foreground block">{act.title}</span>
                              <span className="text-muted-foreground">{act.type}</span>
                            </div>
                          </div>
                          <span className="text-muted-foreground text-[8px]">{act.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* NOTES PREVIEW */}
              {activeTab === 'notes' && (
                <div className="flex flex-col text-left max-w-xl mx-auto w-full">
                  <h4 className="text-base font-extrabold text-foreground border-b border-border/40 pb-2 mb-3">
                    🚀 Product Redesign Plan - Q3
                  </h4>
                  
                  {/* Block content items */}
                  <div className="space-y-3 font-serif text-xs leading-relaxed text-foreground">
                    <p>
                      This outline document summarizes our architectural rollout strategy for the upcoming redesign of AuraFlow. We aim to consolidate the canvas APIs and optimize block loading performance.
                    </p>
                    
                    {/* H2 section header */}
                    <h5 className="text-xs font-sans font-bold text-muted-foreground tracking-wider uppercase mt-4">
                      Core Implementation Benchmarks
                    </h5>
                    
                    {/* Checklist */}
                    <div className="space-y-1.5 font-sans text-[11px] font-semibold text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded border-border" disabled />
                        <span className="line-through text-muted-foreground/60">Integrate Excalidraw infinite layout wrapper</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded border-border" disabled />
                        <span className="line-through text-muted-foreground/60">Define CSS variables mapping inside root layout</span>
                      </div>
                      <div className="flex items-center gap-2 relative bg-orange-500/5 border border-orange-500/20 px-2 py-1 rounded-md">
                        <input type="checkbox" className="rounded border-orange-400 text-orange-500" disabled />
                        <span className="text-orange-600 dark:text-orange-400">Implement in-line AI summary prompts for headers</span>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                          <Sparkles size={8} /> Refine block
                        </div>
                      </div>
                    </div>

                    {/* Blockquote */}
                    <blockquote className="border-l-2 border-border pl-3 text-muted-foreground font-medium italic mt-3 text-[11px]">
                      "Ensure live collaboration indicators show correct color codes from the brand palette."
                    </blockquote>
                  </div>
                </div>
              )}

              {/* KANBAN PREVIEW */}
              {activeTab === 'kanban' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left w-full h-full">
                  
                  {/* Column 1 */}
                  <div className="border border-border/40 bg-secondary/10 rounded-xl p-2.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground">
                      <span>TO DO</span>
                      <span className="bg-border/60 px-1.5 py-0.5 rounded">2</span>
                    </div>
                    {/* Ticket */}
                    <div className="bg-card border border-border/60 rounded-lg p-2 flex flex-col gap-1.5 shadow-sm">
                      <span className="text-[8px] bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 font-bold px-1.5 py-0.5 rounded self-start">Priority</span>
                      <span className="text-[10px] font-semibold leading-tight">Write Stripe payment integration webhook</span>
                      <span className="text-[8px] text-muted-foreground">Created 2d ago</span>
                    </div>
                    <div className="bg-card border border-border/60 rounded-lg p-2 flex flex-col gap-1.5 shadow-sm">
                      <span className="text-[8px] bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-bold px-1.5 py-0.5 rounded self-start">Task</span>
                      <span className="text-[10px] font-semibold leading-tight">Refactor responsive drawer menu width</span>
                      <span className="text-[8px] text-muted-foreground">Created 5d ago</span>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="border border-border/40 bg-secondary/10 rounded-xl p-2.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground">
                      <span>IN PROGRESS</span>
                      <span className="bg-border/60 px-1.5 py-0.5 rounded">1</span>
                    </div>
                    <div className="bg-card border border-border/60 rounded-lg p-2 flex flex-col gap-1.5 shadow-sm relative">
                      <span className="text-[8px] bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 font-bold px-1.5 py-0.5 rounded self-start">Note</span>
                      <span className="text-[10px] font-semibold leading-tight">Design Excalidraw infinite workspace grid</span>
                      {/* Active presence mouse pointer mockup */}
                      <div className="flex items-center gap-1 mt-1 border-t border-border/40 pt-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[7px]">S</div>
                        <span className="text-[8px] text-orange-500 font-bold">Sarah is editing...</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="border border-border/40 bg-secondary/10 rounded-xl p-2.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground">
                      <span>DONE</span>
                      <span className="bg-border/60 px-1.5 py-0.5 rounded">1</span>
                    </div>
                    <div className="bg-card border border-border/40 opacity-75 rounded-lg p-2 flex flex-col gap-1.5 shadow-none">
                      <span className="text-[8px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded self-start">Complete</span>
                      <span className="text-[10px] font-semibold leading-tight line-through text-muted-foreground/60">Configure Clerk user synchronization route</span>
                      <span className="text-[8px] text-muted-foreground">Archived 1h ago</span>
                    </div>
                  </div>

                </div>
              )}

              {/* WHITEBOARD PREVIEW */}
              {activeTab === 'whiteboard' && (
                <div className="w-full h-full canvas-grid border border-border/50 rounded-xl relative min-h-[220px] overflow-hidden flex items-center justify-center p-4">
                  
                  {/* Floating Canvas UI Controls */}
                  <div className="absolute top-2 left-2 bg-card border border-border/70 p-1 rounded-lg shadow-sm flex items-center gap-1 text-[8px] font-bold">
                    <span className="bg-secondary px-1.5 py-0.5 rounded border border-border">✏️ Draw</span>
                    <span className="px-1.5 py-0.5 rounded text-muted-foreground">🔲 Box</span>
                    <span className="px-1.5 py-0.5 rounded text-muted-foreground">📝 Memo</span>
                  </div>

                  {/* Vector Mock diagrams */}
                  <div className="relative w-full max-w-md mx-auto h-full flex flex-col sm:flex-row items-center justify-center gap-6 select-none mt-4">
                    
                    {/* Node 1 */}
                    <div className="w-24 bg-card border-2 border-dashed border-indigo-400 rounded-lg p-2 shadow-sm text-center flex flex-col items-center">
                      <span className="text-[8px] text-indigo-500 font-bold">USER CLIENT</span>
                      <span className="text-[9px] font-semibold mt-0.5">Next.js App</span>
                    </div>

                    {/* Connection Arrow */}
                    <div className="text-[10px] text-muted-foreground font-bold tracking-widest flex items-center">
                      ────────▶
                    </div>

                    {/* Node 2 */}
                    <div className="w-24 bg-orange-50 border-2 border-orange-400 rounded-lg p-2 shadow-sm text-center flex flex-col items-center">
                      <span className="text-[8px] text-orange-500 font-bold">SPARK AI</span>
                      <span className="text-[9px] font-semibold mt-0.5">Gemini 3.5</span>
                    </div>

                    {/* Sticky Note */}
                    <div className="absolute -bottom-1 sm:bottom-2 right-4 w-28 h-20 bg-yellow-100 dark:bg-yellow-950/40 border border-yellow-300 dark:border-yellow-900/50 p-2 text-left rotate-3 shadow-md flex flex-col justify-between">
                      <span className="text-[8.5px] font-serif leading-tight text-yellow-800 dark:text-yellow-400 font-semibold">
                        Need to optimize vector layouts for mobile viewport sizes.
                      </span>
                      <span className="text-[6.5px] text-yellow-600 dark:text-yellow-500 font-bold self-end">- Sarah</span>
                    </div>

                  </div>
                </div>
              )}

              {/* AI ASSISTANT PREVIEW */}
              {activeTab === 'ai' && (
                <div className="flex flex-col h-full w-full max-w-lg mx-auto border border-border/50 rounded-xl bg-card overflow-hidden shadow-sm text-left">
                  
                  {/* Chat dialog body */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-[9.5px]">
                    
                    {/* User Prompt */}
                    <div className="flex gap-2 justify-end">
                      <div className="bg-secondary/70 p-2 rounded-xl rounded-tr-none border border-border/40 max-w-[85%] text-foreground font-medium">
                        Create a basic marketing launch roadmap.
                      </div>
                      <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[7px] flex-shrink-0">S</div>
                    </div>

                    {/* AI Thinking / Output */}
                    <div className="flex gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 text-white flex items-center justify-center font-bold text-[7px] flex-shrink-0">
                        <Sparkles size={8} />
                      </div>
                      <div className="bg-orange-500/5 dark:bg-orange-500/10 p-2.5 rounded-xl rounded-tl-none border border-orange-500/20 max-w-[85%] text-foreground">
                        <span className="font-bold text-orange-600 dark:text-orange-400 block mb-1">AuraFlow Assistant:</span>
                        I have created a new workspace template page 📋 **Marketing Launch Roadmap** under your root Spaces directory, containing:
                        <ul className="list-disc pl-3.5 mt-1 space-y-1 font-semibold text-muted-foreground">
                          <li>Pre-configured Kanban task boards</li>
                          <li>2 task cards in 'Ideas' column</li>
                          <li>1 calendar alert for Q3 deadline</li>
                        </ul>
                        <div className="mt-2.5 flex items-center gap-1.5">
                          <button className="bg-orange-500 hover:bg-orange-600 text-white text-[7.5px] font-bold px-2 py-0.5 rounded border border-orange-600">Open page</button>
                          <button className="bg-transparent hover:bg-secondary text-muted-foreground text-[7.5px] font-bold px-2 py-0.5 rounded border border-border">Undo action</button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Input row */}
                  <div className="border-t border-border/40 p-2 bg-secondary/15 flex gap-1.5">
                    <input type="text" placeholder="Write central commands (e.g. create page, schedule card...)" className="flex-1 bg-background text-[9px] px-3 py-1.5 rounded-lg border border-border/60 focus:outline-none focus:ring-1 focus:ring-orange-400" disabled />
                    <button className="bg-orange-500 text-white text-[8px] font-bold px-3 py-1.5 rounded-lg hover:bg-orange-600">Send</button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
