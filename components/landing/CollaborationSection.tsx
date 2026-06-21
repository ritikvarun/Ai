'use client';

import React from 'react';
import { 
  Users, 
  MessageSquare, 
  Zap, 
  Lock, 
  MousePointer, 
  MessageCircle 
} from 'lucide-react';

export default function CollaborationSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-secondary/10 relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-pink-400/5 to-indigo-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* Copy Column */}
        <div className="w-full lg:w-1/2 text-left">
          <h2 className="text-xs font-bold text-pink-500 uppercase tracking-widest">
            Multiplayer Synchronicity
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mt-3 tracking-tight leading-tight">
            Collaborate in real-time with Liveblocks
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-4 font-medium leading-relaxed">
            Experience absolute synchronization. AuraFlow utilizes the Liveblocks engine to provide seamless multiplayer canvas states, immediate mouse tracks, and block-level lock guards to avoid editing conflicts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users size={16} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Active User Presence</h4>
                <p className="text-[10.5px] text-muted-foreground mt-1 leading-normal">
                  View who is online, track exact cursor pointer trajectories, and see what elements are selected instantly.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare size={16} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Task & Node Comments</h4>
                <p className="text-[10.5px] text-muted-foreground mt-1 leading-normal">
                  Attach discussions directly to Kanban tickets or whiteboard coordinates, ensuring context stays where it belongs.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock size={16} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Block Editing Locks</h4>
                <p className="text-[10.5px] text-muted-foreground mt-1 leading-normal">
                  AuraFlow locks notes text paragraphs and canvas blocks while a peer is editing to prevent key collisions.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap size={16} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Sub-millisecond Latency</h4>
                <p className="text-[10.5px] text-muted-foreground mt-1 leading-normal">
                  State merges are resolved using conflict-free replicated data types (CRDT) in real-time.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Graphic/Visual Column */}
        <div className="w-full lg:w-1/2 relative rounded-2xl border border-border/80 bg-card p-6 shadow-xl overflow-hidden min-h-[300px] flex flex-col justify-between">
          
          {/* Simulated Workspace Background pattern */}
          <div className="absolute inset-0 canvas-grid opacity-35 -z-10" />

          {/* Top Row: User profiles active indicators */}
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Collaborators</span>
            <div className="flex items-center -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-card bg-emerald-500 text-[8px] font-bold text-white flex items-center justify-center cursor-pointer shadow-sm">EJ</div>
              <div className="w-6 h-6 rounded-full border-2 border-card bg-indigo-500 text-[8px] font-bold text-white flex items-center justify-center cursor-pointer shadow-sm">BS</div>
              <div className="w-6 h-6 rounded-full border-2 border-card bg-amber-500 text-[8px] font-bold text-white flex items-center justify-center cursor-pointer shadow-sm">CL</div>
              <span className="text-[9px] font-bold text-muted-foreground pl-3">+4 online</span>
            </div>
          </div>

          {/* Center Graphic: Mock cursors and editor snippet */}
          <div className="my-8 relative min-h-[140px] w-full flex flex-col items-center justify-center gap-4">
            
            {/* Note Editor block mockup */}
            <div className="bg-card border border-border/80 rounded-xl p-4 max-w-sm w-full shadow-md text-left relative">
              <h5 className="text-[10px] font-bold text-foreground">📌 Team Goals Brief</h5>
              <p className="text-[9.5px] text-muted-foreground mt-2 leading-relaxed font-sans">
                We need to outline the specific styling choices for our upcoming product redesign workspace. Sage represents coziness, oats for grounding, and coral for high energy sparks.
              </p>

              {/* Cursor 1 (Emma Jenkins) */}
              <div className="absolute -top-3 -right-6 flex items-center gap-1 bg-emerald-500 text-white text-[7.5px] font-extrabold px-1.5 py-0.5 rounded shadow-sm z-15">
                <MousePointer size={8} className="fill-white" />
                <span>Emma Jenkins</span>
              </div>
              
              {/* Highlight on text block */}
              <div className="absolute bottom-2 left-6 bg-amber-500/10 border-l-2 border-amber-500 p-1 text-[8.5px] font-medium text-amber-700 dark:text-amber-400 font-sans max-w-[80%] rounded">
                "Sage represents coziness..."
              </div>
            </div>

            {/* Comment Thread mockup */}
            <div className="absolute bottom-[-16px] left-2 bg-card border border-border/80 rounded-xl p-3 shadow-lg max-w-[210px] text-left z-20 flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[7px] flex-shrink-0">BS</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-foreground">Bob Smith</span>
                  <span className="text-[7px] text-muted-foreground">3m ago</span>
                </div>
                <span className="text-[8.5px] text-muted-foreground leading-snug mt-1 block">
                  Should we also add neon violet accent tones for template files?
                </span>
              </div>
            </div>

            {/* Cursor 2 (Charlie Lee) */}
            <div className="absolute bottom-[-12px] right-8 flex items-center gap-1 bg-amber-500 text-white text-[7.5px] font-extrabold px-1.5 py-0.5 rounded shadow-sm z-15">
              <MousePointer size={8} className="fill-white" />
              <span>Charlie Lee</span>
            </div>

          </div>

          {/* Bottom Row: Connection Badge */}
          <div className="flex justify-end pt-3 border-t border-border/40 mt-2">
            <span className="inline-flex items-center gap-1.5 text-[8.5px] font-bold text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded border border-border/50">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
              Liveblocks Web Socket Enabled
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
