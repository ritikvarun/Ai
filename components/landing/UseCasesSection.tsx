'use client';

import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  Users2, 
  Palette, 
  Briefcase, 
  CheckSquare 
} from 'lucide-react';

interface UseCaseCard {
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  features: string[];
  color: string;
}

export default function UseCasesSection() {
  const cases: UseCaseCard[] = [
    {
      title: "Founders & Startups",
      icon: Building2,
      description: "Map your business goals, draft pitch decks, schedule launch milestones, and brainstorm canvas schemas in one central workstation.",
      features: ["Pitch Deck Outline space", "Stripe payment pipeline dashboard", "AI Template strategy generator"],
      color: "border-orange-500/30 text-orange-500 bg-orange-500/5"
    },
    {
      title: "Students & Academia",
      icon: GraduationCap,
      description: "Keep track of course syllabi, compile notes, drag exam dates into calendar grids, and brainstorm essay wireframes.",
      features: ["Study Planner template", "Lecture note summarization AI", "Assignment countdown slots"],
      color: "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
    },
    {
      title: "Product Teams",
      icon: Users2,
      description: "Manage product backlogs, design whiteboard wireframes, write RFCs, and view teammates editing nodes in real-time.",
      features: ["Sprint Kanban columns", "Excalidraw UI flowchart boards", "Co-author paragraph locks"],
      color: "border-indigo-500/30 text-indigo-500 bg-indigo-500/5"
    },
    {
      title: "Creators & Artists",
      icon: Palette,
      description: "Draft scripts, establish release grids, draw storyboards, and outline content hierarchies in customized spaces.",
      features: ["Content Calendar track", "Mood board sketching canvas", "Tone-adjusting note refinement"],
      color: "border-pink-500/30 text-pink-500 bg-pink-500/5"
    },
    {
      title: "Project Managers",
      icon: Briefcase,
      description: "Maintain scope documentation, log project milestones, coordinate tasks with comments, and review velocity trends.",
      features: ["Milestone timeline grids", "Ticket assignee comments logs", "Weekly velocity insights"],
      color: "border-cyan-500/30 text-cyan-500 bg-cyan-500/5"
    },
    {
      title: "Personal Productivity",
      icon: CheckSquare,
      description: "Structure daily checklists, schedule personal tasks, organize travel plans, and build habit trackers via AI prompts.",
      features: ["Habit Tracker sandbox widget", "Daily journal note structure", "Personal calendar dashboard"],
      color: "border-slate-500/30 text-slate-500 bg-slate-500/5"
    }
  ];

  return (
    <section id="usecases" className="py-20 bg-secondary/5 relative px-6">
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
            Custom Workspaces
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mt-3 tracking-tight">
            Tailored to your specific workflows
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-4 font-medium leading-relaxed">
            Whether leading a fast-growing startup or organizing university lecture lists, AuraFlow adapts layouts to suit your needs.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((useCase, idx) => {
            const CaseIcon = useCase.icon;
            return (
              <div 
                key={idx}
                className={`rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md hover:border-border/100 transition-all duration-300 group flex flex-col justify-between text-left`}
              >
                <div>
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-border ${useCase.color.split(' ')[2]} flex-shrink-0 mb-5`}>
                    <CaseIcon size={18} className={useCase.color.split(' ')[1]} strokeWidth={2.2} />
                  </div>

                  {/* Title & Desc */}
                  <h4 className="text-sm font-bold text-foreground">
                    {useCase.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-medium mt-2 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>

                {/* Features checklist list */}
                <div className="mt-6 border-t border-border/40 pt-4 space-y-1.5 text-[9.5px] text-muted-foreground font-semibold">
                  {useCase.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
