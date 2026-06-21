'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How does the Spark AI Assistant interact with my workspace?",
      answer: "Spark AI is directly integrated with AuraFlow's data layer. It doesn't just reply to text; it can schedule task cards, insert notes blocks, construct Excalidraw flowcharts, and compile custom single-page mini-app widgets. It is designed to act on commands directly."
    },
    {
      question: "Can multiple people collaborate on notes and whiteboards simultaneously?",
      answer: "Yes! AuraFlow uses the Liveblocks multiplayer framework. You can collaborate concurrently in real-time, trace each other's live mouse cursors, add comment bubbles, and edit notes text blocks without collision since a paragraph lock prevents overwrites."
    },
    {
      question: "What formatting does the Notes editor support?",
      answer: "The notes editor is built on the modern TipTap block-based framework. It supports standard markdown syntax, custom block headers, checklist items, image embeds, code block styling, and lists, allowing you to easily organize docs."
    },
    {
      question: "How does the Miro-style Whiteboard connect with tasks?",
      answer: "The whiteboard canvas is integrated with your database. You can draw diagrams and attach Kanban task ticket references to vector nodes. If you update a task's details, the reference on the whiteboard reflects that sync instantly."
    },
    {
      question: "How does the AI Template Builder generate widgets?",
      answer: "Write a prompt explaining the tool you need (e.g. 'Pomodoro widget' or 'Habit tracker'). Spark AI generates the appropriate React UI code, bundles it inside an isolated sandbox, and pins it directly to your application sidebar as a custom app."
    },
    {
      question: "Is my personal database and workspace information private?",
      answer: "Security and privacy are top priorities. AuraFlow encrypts data in transit and at rest. Your notes, canvases, templates, and chats are isolated per user/team, and we never train AI models on your private database logs."
    }
  ];

  return (
    <section id="faq" className="py-20 px-6 relative overflow-hidden">
      
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
            Common Inquiries
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-foreground mt-3 tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-4 font-medium">
            Find immediate answers regarding workspace capabilities, templates, security, and subscription plans.
          </p>
        </div>

        {/* FAQs List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm transition-all duration-300 hover:border-border/100"
              >
                
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-foreground hover:bg-secondary/20 transition-colors duration-200 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div className="text-muted-foreground flex-shrink-0 ml-4">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Accordion Answer Body */}
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[300px] border-t border-border/40 p-5' : 'max-h-0'
                  } overflow-hidden bg-secondary/5`}
                >
                  <p className="text-[11.5px] leading-relaxed text-muted-foreground font-semibold">
                    {faq.answer}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
