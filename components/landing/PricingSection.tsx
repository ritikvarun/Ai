'use client';

import React, { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface PricePlan {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  ctaText: string;
  isPopular: boolean;
  ctaLink: string;
  gradient: string;
}

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans: PricePlan[] = [
    {
      name: "Free Essentials",
      monthlyPrice: 0,
      annualPrice: 0,
      description: "Perfect for single individuals starting out with smart workspace organization.",
      features: [
        "Up to 3 Custom AI Templates",
        "5 Active Workspace Pages",
        "1 Collaborative Whiteboard Canvas",
        "10 AI Copilot Assistant prompts / day",
        "Local storage notes drafts backup"
      ],
      ctaText: "Start for Free",
      isPopular: false,
      ctaLink: "/workspace",
      gradient: "from-slate-500/10 to-zinc-500/10"
    },
    {
      name: "Professional Pro",
      monthlyPrice: 12,
      annualPrice: 10,
      description: "Best for creators, developers, and founders seeking unlimited workspaces.",
      features: [
        "Unlimited Custom AI Templates",
        "Unlimited Pages & Nested Folders",
        "Unlimited Whiteboard Canvases",
        "Unlimited Spark AI Assistant queries",
        "Advanced Excalidraw vector shapes",
        "Database cloud sync backups"
      ],
      ctaText: "Upgrade to Pro",
      isPopular: true,
      ctaLink: "/workspace",
      gradient: "from-orange-500/10 to-pink-500/10"
    },
    {
      name: "Team Collaboration",
      monthlyPrice: 29,
      annualPrice: 24,
      description: "Built for companies and agencies looking to sync in real-time.",
      features: [
        "Everything in Professional Pro",
        "Liveblocks active pointer tracking",
        "Shared folder workspace channels",
        "Workspace comments log trails",
        "Team role permissions controls",
        "Priority 24/7 Customer Support"
      ],
      ctaText: "Start Team Trial",
      isPopular: false,
      ctaLink: "/workspace",
      gradient: "from-indigo-500/10 to-purple-500/10"
    }
  ];

  return (
    <section id="pricing" className="py-20 px-6 relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/5 to-purple-300/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
            Simple Pricing
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mt-3 tracking-tight">
            Plans built for any scale of workflow
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-4 font-medium">
            Start for free and upgrade as your projects expand. Cancel or adjust billing anytime.
          </p>
        </div>

        {/* Monthly / Annual Toggle Switch */}
        <div className="flex items-center justify-center gap-3 mb-16 select-none font-bold text-xs">
          <span className={billingPeriod === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}>Bill Monthly</span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
            className={`relative h-6 w-12 rounded-full p-0.5 cursor-pointer bg-secondary border border-border/80 flex items-center transition-colors duration-200 justify-${
              billingPeriod === 'annual' ? 'end' : 'start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-orange-400 shadow-sm" />
          </button>
          <span className={billingPeriod === 'annual' ? 'text-foreground' : 'text-muted-foreground'}>
            Bill Annually
            <span className="ml-1.5 bg-green-500/15 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-full text-[9px]">Save 20%</span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, idx) => {
            const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
            
            return (
              <div 
                key={idx}
                className={`relative rounded-2xl border bg-card p-6 md:p-8 flex flex-col justify-between transition-all duration-300 shadow-sm ${
                  plan.isPopular 
                    ? 'border-orange-400 ring-1 ring-orange-400 scale-[1.02] shadow-md z-10' 
                    : 'border-border/80 hover:border-border/100'
                }`}
              >
                {/* Glow layer */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${plan.gradient} opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10`} />

                {/* Popular Badge */}
                {plan.isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  {/* Plan Name */}
                  <h4 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
                    {plan.name}
                  </h4>
                  
                  {/* Price */}
                  <div className="mt-5 flex items-baseline gap-1 text-left">
                    <span className="text-4xl font-extrabold text-foreground">${price}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">/ Month</span>
                  </div>
                  {billingPeriod === 'annual' && plan.monthlyPrice > 0 && (
                    <span className="text-[9px] text-green-500 font-bold block mt-1.5 text-left">Billed annually (${price * 12}/year)</span>
                  )}

                  {/* Description */}
                  <p className="text-[11px] text-muted-foreground font-medium mt-4 leading-relaxed text-left">
                    {plan.description}
                  </p>

                  <hr className="my-6 border-border/40" />

                  {/* Features list */}
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-[11px] text-muted-foreground font-semibold">
                        <Check size={13} className="text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Action button */}
                <div className="mt-8">
                  <Link 
                    href={plan.ctaLink}
                    className={`w-full inline-flex items-center justify-center font-bold text-xs py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      plan.isPopular 
                        ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow hover:from-orange-500 hover:to-pink-600' 
                        : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border/60'
                    }`}
                  >
                    {plan.ctaText}
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
