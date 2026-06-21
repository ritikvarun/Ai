'use client';

import React from 'react';
import { Sparkles, Sun, Moon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LandingNavbarProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

export default function LandingNavbar({ isDark, setIsDark }: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-400 via-pink-400 to-indigo-500 shadow-md">
            <span className="text-white font-bold text-sm">A</span>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-background rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight leading-none">
              AuraFlow
            </span>
            <span className="text-[9px] text-muted-foreground font-medium mt-0.5">Notion × Miro</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#workflow" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#showcase" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">Showcase</a>
          <a href="#usecases" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
          <a href="#pricing" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </nav>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`relative h-7 w-12 rounded-full p-0.5 cursor-pointer transition-all duration-300 shadow-inner flex items-center bg-secondary ${
              isDark ? 'bg-zinc-800 justify-end border border-zinc-700/60' : 'bg-orange-100/60 justify-start border border-orange-200/60'
            }`}
            aria-label="Toggle Theme"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDark ? 'bg-zinc-950 text-yellow-400' : 'bg-white text-orange-500'
            }`}>
              {isDark ? <Sun size={11} /> : <Moon size={11} />}
            </div>
          </button>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link 
              href="/sign-in"
              className="hidden sm:inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary px-3 py-1.5 rounded-lg border border-transparent hover:border-border/30 transition-all cursor-pointer"
            >
              Sign In
            </Link>
            
            <Link 
              href="/sign-up"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer animate-in fade-in zoom-in duration-500"
            >
              Get Started <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}
