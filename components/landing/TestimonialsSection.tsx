'use client';

import React from 'react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
}

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      quote: "AuraFlow completely solved our tab-switching headaches. We moved our strategy notes from Notion and our architecture sketches from Miro onto a single AuraFlow whiteboard. The Liveblocks collaboration sync is incredibly fast and responsive.",
      name: "Marcus Aurelius",
      role: "Lead Product Designer at Rome Studio",
      initials: "MA",
      avatarBg: "bg-emerald-500"
    },
    {
      quote: "Spark AI is like having a junior product manager inside the editor. I write raw meeting transcripts and ask the assistant to auto-generate structured tasks, priority labels, and calendar events. It saves our engineering squad hours every single week.",
      name: "Sarah Lin",
      role: "Co-Founder & CTO at QuantumFlow",
      initials: "SL",
      avatarBg: "bg-orange-500"
    },
    {
      quote: "The AI template builder is pure magic. I described a custom calorie tracker and KPI dashboard in natural language, and the assistant generated a fully working widget which I pinned directly to my dashboard sidebar. It's incredibly powerful.",
      name: "Alex Mercer",
      role: "Digital Content Creator & PM",
      initials: "AM",
      avatarBg: "bg-indigo-500"
    }
  ];

  return (
    <section className="py-20 bg-secondary/5 relative px-6">
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-pink-500 uppercase tracking-widest">
            User Success
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mt-3 tracking-tight">
            Loved by builders worldwide
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-4 font-medium">
            Hear from startup founders, engineers, and digital creators who transformed their productivity layout with AuraFlow.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((test, idx) => (
            <div 
              key={idx}
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left"
            >
              <div>
                {/* 5-Star Ratings */}
                <div className="flex gap-0.5 text-amber-400 text-sm mb-4 select-none">
                  {"★".repeat(5)}
                </div>

                {/* Quote */}
                <p className="text-[11.5px] font-sans font-medium leading-relaxed text-muted-foreground italic">
                  "{test.quote}"
                </p>
              </div>

              {/* Profile details */}
              <div className="mt-6 border-t border-border/40 pt-4 flex items-center gap-3">
                
                {/* Avatar Initials */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${test.avatarBg} flex-shrink-0 shadow-sm`}>
                  {test.initials}
                </div>

                {/* Name & Role */}
                <div className="min-w-0 flex flex-col">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    {test.name}
                  </span>
                  <span className="text-[9.5px] text-muted-foreground truncate mt-0.5 font-medium">
                    {test.role}
                  </span>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
