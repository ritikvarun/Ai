'use client';

import React from 'react';
import { Sparkles, Users, Layout, Play, ArrowRight, Kanban, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 flex flex-col items-center text-center px-6">
      
      {/* Decorative Glow Backgrounds */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/20 via-pink-300/10 to-indigo-300/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-24 left-1/3 w-[300px] h-[300px] bg-gradient-to-br from-orange-300/20 to-purple-300/10 rounded-full blur-2xl -z-10" />

      {/* Trust Badges / Promo Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 bg-card/60 backdrop-blur-sm text-[11px] font-bold text-foreground mb-6 shadow-sm animate-bounce">
        <Sparkles size={11} className="text-orange-500" />
        <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Spark AI Powered</span>
        <span className="h-2 w-px bg-border/80" />
        <span className="text-muted-foreground">Version 1.0 Live</span>
      </div>

      {/* Hero Headings */}
      <h1 className="max-w-4xl text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
        Your AI-Powered Workspace for{" "}
        <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-indigo-500 bg-clip-text text-transparent leading-none">
          Notes, Tasks, Whiteboards
        </span>{" "}
        & Collaboration
      </h1>
      
      <p className="max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground font-medium mt-6 leading-relaxed">
        AuraFlow is the cozy, all-in-one productivity suite that blends the documentation speed of Notion with the creative canvas of Miro, the structural clarity of Kanban, and a real-time AI copilot.
      </p>

      {/* Hero CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full justify-center">
        <Link 
          href="/sign-up"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
          Get Started for Free <ArrowRight size={16} />
        </Link>
        <a 
          href="#showcase"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card hover:bg-secondary text-foreground font-bold text-sm px-7 py-3.5 rounded-xl border border-border/80 shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Play size={14} className="fill-foreground text-foreground" /> Watch Demo
        </a>
      </div>

      {/* Secondary Trust Features */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-12 text-muted-foreground text-[11px] font-semibold tracking-wide uppercase select-none">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span>AI Assistant & Copilot</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={13} className="text-pink-500" />
          <span>Real-time Collaboration</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={13} className="text-indigo-500" />
          <span>Infinite Creative Canvas</span>
        </div>
      </div>

      {/* Premium Dashboard Preview Mockup Area */}
      <div className="relative max-w-5xl w-full mt-16 mx-auto rounded-2xl border border-border/80 bg-card/60 p-2 md:p-3 shadow-2xl backdrop-blur-sm group hover:border-border/100 transition-all duration-300">
        
        {/* Glow behind dashboard */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-pink-400/5 to-indigo-500/5 rounded-2xl -z-10" />

        {/* Dashboard Browser Frame */}
        <div className="rounded-xl border border-border/60 bg-background overflow-hidden relative shadow-inner">
          
          {/* Browser Header Bar */}
          <div className="h-10 border-b border-border/60 bg-secondary/30 px-4 flex items-center justify-between">
            {/* Window control dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
            </div>
            {/* URL bar */}
            <div className="text-[10px] text-muted-foreground bg-card/80 border border-border/50 px-8 py-1 rounded-md max-w-xs w-full select-none truncate">
              app.auraflow.io/workspace
            </div>
            {/* User Presence indicator */}
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[9px] font-semibold text-muted-foreground">Live Sync</span>
            </div>
          </div>

          {/* Dummy Dashboard Layout */}
          <div className="flex h-[320px] md:h-[450px] overflow-hidden select-none bg-background">
            
            {/* Left Mock Sidebar */}
            <div className="w-16 md:w-44 border-r border-border/50 bg-secondary/15 p-2 hidden sm:flex flex-col gap-3">
              {/* Profile Card */}
              <div className="flex items-center gap-2 p-1.5 border border-transparent rounded-lg">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex-shrink-0" />
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-[10px] font-bold truncate">Sarah Jenkins</span>
                  <span className="text-[8px] text-muted-foreground truncate">sarah@auraflow.io</span>
                </div>
              </div>
              <div className="h-px bg-border/40" />
              {/* Menu items */}
              <div className="flex flex-col gap-1">
                {[
                  { icon: Layout, label: "Dashboard", color: "text-emerald-500" },
                  { icon: FileText, label: "Notes & Docs", color: "text-teal-500" },
                  { icon: Kanban, label: "Tasks Board", color: "text-indigo-500" },
                  { icon: Sparkles, label: "AI Copilot", color: "text-rose-500" }
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[10px] font-bold ${idx === 0 ? 'bg-card shadow-sm border border-border/50' : 'text-muted-foreground'}`}>
                    <item.icon size={13} className={item.color} />
                    <span className="hidden md:inline">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Mock Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-background">
              
              {/* Mock Header */}
              <div className="h-12 border-b border-border/40 px-4 flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-bold">Marketing Launch Campaign</span>
                  <span className="text-[8px] text-muted-foreground">Project space for redesign rollout</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center -space-x-1.5">
                    <div className="w-5 h-5 rounded-full border border-card bg-emerald-500 text-[8px] font-bold text-white flex items-center justify-center">A</div>
                    <div className="w-5 h-5 rounded-full border border-card bg-indigo-500 text-[8px] font-bold text-white flex items-center justify-center">B</div>
                  </div>
                  <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-sm">Invite</button>
                </div>
              </div>

              {/* Mock Body Grid */}
              <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-3 gap-3 overflow-y-auto">
                
                {/* Board Column 1 */}
                <div className="border border-border/40 bg-secondary/10 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                    <span>💡 RESEARCH & IDEAS</span>
                    <span className="bg-border/60 px-1.5 py-0.5 rounded text-[8px]">3</span>
                  </div>
                  {/* Task Card */}
                  <div className="bg-card border border-border/60 rounded-lg p-2.5 flex flex-col gap-1.5 text-left shadow-sm">
                    <span className="text-[9px] bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 font-bold px-1.5 py-0.5 rounded self-start">Research</span>
                    <span className="text-[10px] font-semibold leading-tight">Analyze competitor landing page design templates</span>
                    <span className="text-[8px] text-muted-foreground">Assigned to Sarah</span>
                  </div>
                  <div className="bg-card border border-border/60 rounded-lg p-2.5 flex flex-col gap-1.5 text-left shadow-sm">
                    <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded self-start">Content</span>
                    <span className="text-[10px] font-semibold leading-tight">Brainstorm hero hooks with Spark AI chatbot</span>
                    <span className="text-[8px] text-muted-foreground">Ready to refine</span>
                  </div>
                </div>

                {/* Board Column 2 */}
                <div className="border border-border/40 bg-secondary/10 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                    <span>🚧 WORK IN PROGRESS</span>
                    <span className="bg-border/60 px-1.5 py-0.5 rounded text-[8px]">1</span>
                  </div>
                  <div className="bg-card border border-border/60 rounded-lg p-2.5 flex flex-col gap-1.5 text-left shadow-sm">
                    <span className="text-[9px] bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 font-bold px-1.5 py-0.5 rounded self-start">Design</span>
                    <span className="text-[10px] font-semibold leading-tight font-sans">Develop infinite whiteboard wireframes</span>
                    {/* User Presence tag on card */}
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 text-[6px] text-white flex items-center justify-center font-bold">B</div>
                      <span className="text-[7.5px] text-indigo-500 font-medium">Bob is drawing...</span>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Panel */}
                <div className="border border-border/60 bg-card rounded-xl p-3 flex flex-col justify-between text-left shadow-sm">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500">
                    <Sparkles size={11} />
                    <span>Spark AI Assistant</span>
                  </div>
                  <div className="flex-1 bg-secondary/20 rounded-lg p-2 my-2 text-[9px] font-medium text-muted-foreground flex flex-col gap-2">
                    <div className="bg-card p-1.5 rounded border border-border/30 self-start text-foreground max-w-[85%] shadow-sm">
                      Suggest headline ideas for a creative workspace SaaS app.
                    </div>
                    <div className="bg-orange-500/10 dark:bg-orange-500/5 p-1.5 rounded border border-orange-500/20 self-end text-orange-600 dark:text-orange-400 max-w-[85%] font-semibold">
                      Here are 3 options:<br/>
                      1. "Where ideas flow freely"<br/>
                      2. "Infinite canvas, structured files"
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <input type="text" placeholder="Ask Spark AI to refine..." className="w-full bg-secondary/40 border border-border/50 text-[9px] px-2 py-1 rounded focus:outline-none" disabled />
                    <button className="bg-orange-500 hover:bg-orange-600 text-white text-[8px] font-bold px-2 py-1 rounded">+</button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
