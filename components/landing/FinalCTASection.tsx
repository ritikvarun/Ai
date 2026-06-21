'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function FinalCTASection() {
  return (
    <section className="py-16 px-6 relative overflow-hidden">
      
      {/* Container Card */}
      <div className="max-w-5xl mx-auto rounded-3xl border border-border/80 bg-card p-8 md:p-14 text-center relative overflow-hidden shadow-2xl">
        
        {/* Colorful Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-pink-400/5 to-indigo-500/5 -z-10" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-orange-400/10 to-pink-500/10 rounded-full blur-3xl -z-10" />

        {/* Promo Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-[10px] font-bold text-orange-600 dark:text-orange-400 mb-6 shadow-sm select-none">
          <Sparkles size={10} />
          <span>Launch Your Workspace Instantly</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground tracking-tight max-w-2xl mx-auto leading-tight">
          Build your entire productivity system in one AI workspace
        </h3>

        {/* Subhead */}
        <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-4 max-w-xl mx-auto leading-relaxed">
          Join founders, product designers, and creators who use AuraFlow to brainstorm canvas concepts, write docs, and coordinate sprint lists.
        </p>

        {/* CTA Trigger */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/sign-up"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer animate-pulse"
          >
            Start for Free <ArrowRight size={15} />
          </Link>
          
          <Link 
            href="/workspace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-sm px-8 py-4 rounded-xl border border-border/80 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            Open Sandbox Workspace
          </Link>
        </div>

        {/* Bottom promo info */}
        <div className="mt-8 text-muted-foreground text-[10px] font-bold uppercase tracking-wider select-none">
          No Credit Card Required • Try Free 14-Day Pro Trial
        </div>

      </div>

    </section>
  );
}
