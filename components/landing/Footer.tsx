'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary/15 py-12 md:py-16 px-6 relative select-none">
      
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="col-span-2 flex flex-col text-left">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-400 via-pink-400 to-indigo-500 shadow-md">
              <span className="text-white font-bold text-sm">A</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-background rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight leading-none text-foreground">
                AuraFlow
              </span>
              <span className="text-[9px] text-muted-foreground font-medium mt-0.5">Notion × Miro</span>
            </div>
          </Link>
          <p className="text-[11px] text-muted-foreground font-medium mt-4 leading-relaxed max-w-xs">
            AuraFlow is the next-generation productivity workstation blending workspace documentation, infinite sketching canvases, and task boards with an integrated Spark AI assistant.
          </p>
        </div>

        {/* Directory Columns */}
        {[
          {
            title: "Product",
            links: [
              { name: "Features & Tools", href: "#features" },
              { name: "Interactive Showcase", href: "#showcase" },
              { name: "Pricing Tiers", href: "#pricing" },
              { name: "Live Sandbox", href: "/workspace" }
            ]
          },
          {
            title: "Resources",
            links: [
              { name: "User Docs", href: "#" },
              { name: "API Reference", href: "#" },
              { name: "Liveblocks Support", href: "#" },
              { name: "System Status", href: "#" }
            ]
          },
          {
            title: "Company",
            links: [
              { name: "About Us", href: "#" },
              { name: "Join Careers", href: "#" },
              { name: "Press Kit", href: "#" },
              { name: "Contact Team", href: "#" }
            ]
          }
        ].map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col text-left">
            <h5 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-4">
              {group.title}
            </h5>
            <ul className="space-y-2.5">
              {group.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <a 
                    href={link.href}
                    className="text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* Bottom Copyright and Social Links */}
      <div className="max-w-7xl mx-auto border-t border-border/40 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-muted-foreground font-semibold">
        
        <div>
          © {new Date().getFullYear()} AuraFlow Technologies Inc. All rights reserved.
        </div>

        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors duration-200">Twitter</a>
          <a href="#" className="hover:text-foreground transition-colors duration-200">GitHub</a>
          <a href="#" className="hover:text-foreground transition-colors duration-200">Discord</a>
          <a href="#" className="hover:text-foreground transition-colors duration-200">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors duration-200">Terms of Service</a>
        </div>

      </div>

    </footer>
  );
}
