'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CalendarPage from './CalendarPage';
import KanbanPage from './KanbanPage';
import NotesPage from './NotesPage';
import PagesSpacesPage from './PagesSpacesPage';

const WhiteboardPage = dynamic(
  () => import('./WhiteboardPage'),
  { ssr: false }
);
import { 
  Sparkles, 
  Calendar as CalIcon, 
  Kanban as KanbanIcon, 
  FileText, 
  Presentation, 
  FolderOpen, 
  Cpu, 
  Settings as SettingsIcon,
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  MousePointer, 
  Square, 
  StickyNote, 
  Send,
  Hash,
  Paperclip,
  Activity,
  Bookmark,
  Share2,
  Trash
} from 'lucide-react';

interface ContentProps {
  activePage: string;
  isDark: boolean;
}

export default function DashboardContent({ activePage, isDark }: ContentProps) {
  // State for AI Chat
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hi Sarah! I am your AuraFlow AI. I can create a customized whiteboard, draft templates, or outline tasks. What are we building today?' }
  ]);

  // State for Notes
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');

  const MOCK_NOTES = [
    {
      id: 'note-1',
      title: '✨ AuraFlow Landing Copy',
      content: `# ✨ AuraFlow Landing Copy\n\nThis is the central draft layout copywriting document. AuraFlow coordinates visual whiteboard shapes with Notion-like hierarchy text editors.\n\n> "A Cozy and Fresh aesthetic keeps creative blocks away, fostering fluid thoughts and fast mockups."\n\n### Core Objectives\n- Collapsible sidebar layout with colorful Lucide icons\n- Fresh, pastel-neon accent elements configured inside globals.css\n- Interactive boards showcasing components without placeholder blocks`,
      createdAt: Date.now() - 300000,
      updatedAt: Date.now() - 300000
    },
    {
      id: 'note-2',
      title: '🚀 Deployment Roadmap',
      content: `# 🚀 Deployment Roadmap\n\nDeployment targets:\n- Dev: Vercel Preview\n- Staging: Vercel Staging + Neon branch\n- Prod: Vercel Production + Neon main DB\n\nEnsure env vars are configured correctly.`,
      createdAt: Date.now() - 250000,
      updatedAt: Date.now() - 250000
    },
    {
      id: 'note-3',
      title: '💰 Drizzle ORM Schema draft',
      content: `# 💰 Drizzle ORM Schema draft\n\nDraft schema:\n\`\`\`typescript\nexport const tasks = pgTable("tasks", {\n  id: serial("id").primaryKey(),\n  title: text("title").notNull(),\n  description: text("description"),\n  status: text("status").default("todo"),\n  dueDate: timestamp("due_date"),\n});\n\`\`\``,
      createdAt: Date.now() - 200000,
      updatedAt: Date.now() - 200000
    },
    {
      id: 'note-4',
      title: '🌱 Next.js v16 configuration',
      content: `# 🌱 Next.js v16 configuration\n\nConfig guidelines for Next.js:\n- App Router enabled\n- Turbo compilation enabled\n- Hydration mismatch prevention`,
      createdAt: Date.now() - 150000,
      updatedAt: Date.now() - 150000
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('auraflow_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(parsed);
        if (parsed.length > 0) {
          const stillExists = parsed.some((n: any) => n.id === selectedNoteId);
          if (!stillExists) {
            setSelectedNoteId(parsed[0].id);
          }
        } else {
          setSelectedNoteId('');
        }
      } catch (e) {
        setNotes(MOCK_NOTES);
        localStorage.setItem('auraflow_notes', JSON.stringify(MOCK_NOTES));
        setSelectedNoteId(MOCK_NOTES[0].id);
      }
    } else {
      setNotes(MOCK_NOTES);
      localStorage.setItem('auraflow_notes', JSON.stringify(MOCK_NOTES));
      setSelectedNoteId(MOCK_NOTES[0].id);
    }
  }, [activePage]);

  const handleAddNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '# Untitled Note\n\nWrite some cozy thoughts...',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('auraflow_notes', JSON.stringify(updated));
    setSelectedNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      const filtered = notes.filter(n => n.id !== id);
      setNotes(filtered);
      localStorage.setItem('auraflow_notes', JSON.stringify(filtered));
      if (selectedNoteId === id && filtered.length > 0) {
        setSelectedNoteId(filtered[0].id);
      } else if (filtered.length === 0) {
        setSelectedNoteId('');
      }
    }
  };

  // State for Whiteboard Sticky Notes
  const [stickies, setStickies] = useState([
    { id: '1', text: '🎯 Notion + Miro core sync flow', color: '#FEF08A', x: 80, y: 100 },
    { id: '2', text: '🎨 Design Cozy & Fresh palette', color: '#A7F3D0', x: 260, y: 60 },
    { id: '3', text: '🚀 Launch Beta (v1.1)', color: '#FECACA', x: 420, y: 150 }
  ]);
  const [newStickyText, setNewStickyText] = useState('');

  // State for Tasks
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 't1', title: 'Complete AuraFlow prototype UI', desc: 'Design collapsible sidebar and theme guidelines.', status: 'in-progress', category: 'Design', priority: 'High', color: '#818CF8' },
    { id: 't2', title: 'Connect Neon Database & Drizzle', desc: 'Verify user schema push completes without error.', status: 'todo', category: 'Database', priority: 'Medium', color: '#10B981' },
    { id: 't3', title: 'Set up Clerk auth middleware', desc: 'Ensure publishable key validations are safe.', status: 'done', category: 'Auth', priority: 'High', color: '#FF6B5A' },
    { id: 't4', title: 'Build AI template models', desc: 'Formulate template system prompts.', status: 'todo', category: 'AI', priority: 'Low', color: '#A78BFA' }
  ]);

  // Add a task helper
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Design');

  const addTask = () => {
    if (!taskTitle.trim()) return;
    const newTask = {
      id: `t_${Date.now()}`,
      title: taskTitle,
      desc: 'Interactive added item.',
      status: 'todo',
      category: taskCategory,
      priority: 'Medium',
      color: taskCategory === 'Design' ? '#818CF8' : taskCategory === 'Database' ? '#10B981' : '#A78BFA'
    };
    setKanbanTasks([...kanbanTasks, newTask]);
    setTaskTitle('');
  };

  // Chat send helper
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    
    // Fake bot reply
    setTimeout(() => {
      let botReply = "That sounds exciting! I will generate a structured Notion outline and corresponding Miro sticky note components for you.";
      if (chatInput.toLowerCase().includes('board') || chatInput.toLowerCase().includes('canvas')) {
        botReply = "Creating a Canvas blueprint right now. I will inject 3 colored cards containing the key phases.";
      } else if (chatInput.toLowerCase().includes('task') || chatInput.toLowerCase().includes('kanban')) {
        botReply = "I have queued a Kanban template called 'Fast Launch' under Tasks. Let me know if you need to assign workers.";
      }
      setChatMessages(prev => [...prev, { role: 'assistant', text: botReply }]);
    }, 1000);
  };

  // Add whiteboard sticky
  const addSticky = () => {
    if (!newStickyText.trim()) return;
    const colors = ['#FEF08A', '#A7F3D0', '#FECACA', '#C084FC', '#93C5FD'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newS = {
      id: `s_${Date.now()}`,
      text: newStickyText,
      color: randomColor,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 100
    };
    setStickies([...stickies, newS]);
    setNewStickyText('');
  };

  // Render sub-screens based on activePage
  const renderView = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Sarah 👋</h1>
                <p className="text-xs text-muted-foreground mt-1">Here is a summary of your cozy workspace dashboard.</p>
              </div>
              <div className="flex gap-2.5">
                <button className="px-3.5 py-1.5 rounded-lg border border-border/80 bg-card text-xs font-semibold text-foreground hover:bg-secondary cozy-transition shadow-sm cursor-pointer">
                  Sync Devices
                </button>
                <button className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 cozy-transition cursor-pointer">
                  <Plus size={14} /> New Space
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Spaces', value: '14', desc: '2 created this week', change: '+12%', changeColor: 'text-green-500', bg: 'border-l-4 border-l-emerald-400' },
                { label: 'Whiteboard Sticky Cards', value: stickies.length.toString(), desc: 'Live Miro interactive canvas', change: 'Interactive', changeColor: 'text-sky-500', bg: 'border-l-4 border-l-cyan-400' },
                { label: 'Task Checklist', value: `${kanbanTasks.filter(t => t.status === 'done').length}/${kanbanTasks.length}`, desc: 'Done / Total cards', change: 'Kanban linked', changeColor: 'text-indigo-500', bg: 'border-l-4 border-l-indigo-400' },
                { label: 'AI Credits Used', value: '420', desc: '1,000 allowance remaining', change: 'Renew tomorrow', changeColor: 'text-amber-500', bg: 'border-l-4 border-l-rose-400' }
              ].map((item, idx) => (
                <div key={idx} className={`bg-card p-4 rounded-xl border border-border/70 cozy-shadow flex flex-col justify-between ${item.bg}`}>
                  <div>
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                    <span className="text-2xl font-bold text-foreground block mt-1">{item.value}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground border-t border-border/40 pt-2">
                    <span>{item.desc}</span>
                    <span className={`font-semibold ${item.changeColor}`}>{item.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row Layout: Tasks / Quick Notes + AI Assistant Mini Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Recent Activities & Tasks */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card p-5 rounded-xl border border-border/70 cozy-shadow space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Activity size={15} className="text-emerald-500" /> Recent Activities
                    </h3>
                    <span className="text-[10px] bg-secondary/80 text-muted-foreground px-2 py-0.5 rounded font-medium">Auto-saved</span>
                  </div>
                  
                  <div className="space-y-3.5">
                    {[
                      { type: 'note', title: 'AuraFlow Launch Strategy', time: '10 mins ago', author: 'Sarah Jenkins', preview: 'Added outline for initial Cozy & Fresh visual launch.' },
                      { type: 'board', title: 'Product Integration Canvas', time: '1 hour ago', author: 'Sarah Jenkins', preview: 'Placed 3 sticky notes regarding Clerk setup details.' },
                      { type: 'task', title: 'Task Completed: Set up Clerk auth middleware', time: 'Yesterday', author: 'System Agent', preview: 'Drizzle schemas pushed and validated.' }
                    ].map((act, actIdx) => (
                      <div key={actIdx} className="flex gap-3 text-xs border-b border-border/30 last:border-0 pb-3 last:pb-0">
                        <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0 text-lg">
                          {act.type === 'note' ? '📝' : act.type === 'board' ? '🎨' : '✅'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground truncate">{act.title}</span>
                            <span className="text-[9px] text-muted-foreground whitespace-nowrap">{act.time}</span>
                          </div>
                          <p className="text-muted-foreground text-[11px] mt-0.5 truncate">{act.preview}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cozy Productivity Quote Widget */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-zinc-900/60 dark:to-orange-950/20 p-5 rounded-xl border border-amber-200/50 dark:border-amber-900/30 flex items-center gap-4">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">Cozy Fresh Insight</h4>
                    <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1 italic">
                      "Good workflow design is like a well-organized desk. It doesn't restrict you; it gives you the mental clarity to create freely."
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Mini AI Assistant Widget */}
              <div className="bg-card p-5 rounded-xl border border-border/70 cozy-shadow flex flex-col justify-between h-[360px]">
                <div className="space-y-3.5 flex-1 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Sparkles size={15} className="text-orange-400 animate-pulse" /> Spark AI Agent
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-secondary/40 text-muted-foreground leading-relaxed">
                      Hey Sarah! I can see you have 2 pending tasks. Would you like me to draft an initial plan for "AI template models"?
                    </div>
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-400/15 text-right font-medium ml-8">
                      Sure, make it a concise cozy template.
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask Spark AI..." 
                    className="flex-1 px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary cozy-transition text-foreground"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // redirect to AI screen
                        alert("Navigating to AI screen to fulfill query!");
                      }
                    }}
                  />
                  <button className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 cozy-transition cursor-pointer">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai-assistant':
        return (
          <div className="flex flex-col h-[calc(100vh-6rem)] border border-border/70 rounded-xl bg-card cozy-shadow overflow-hidden animate-in fade-in duration-300">
            {/* AI Assistant header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/15">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow">
                  ✨
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Spark AI Assistant</h2>
                  <p className="text-[10px] text-muted-foreground">Always active to refine, design, and structure</p>
                </div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded-full">
                Copilot Ready
              </span>
            </div>

            {/* Chat message viewport */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 border ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-gradient-to-r from-red-400 to-orange-400 text-white'
                  }`}>
                    {msg.role === 'user' ? 'S' : '🤖'}
                  </div>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border border-indigo-400/20 rounded-tr-none' 
                      : 'bg-secondary/40 text-foreground border border-border/40 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Predefined quick prompts */}
            <div className="px-4 py-2 bg-secondary/10 border-t border-border flex flex-wrap gap-2">
              <button 
                onClick={() => setChatInput('Generate a whiteboard canvas blueprint')}
                className="text-[10px] px-2.5 py-1 rounded-md border border-border/80 bg-card hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
              >
                🎨 Miro Canvas Blueprint
              </button>
              <button 
                onClick={() => setChatInput('Create a database integration checklist')}
                className="text-[10px] px-2.5 py-1 rounded-md border border-border/80 bg-card hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
              >
                📊 Database checklist
              </button>
              <button 
                onClick={() => setChatInput('Rewrite my launching notes to sound warm')}
                className="text-[10px] px-2.5 py-1 rounded-md border border-border/80 bg-card hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
              >
                ✍️ Warm rephrase
              </button>
            </div>

            {/* Message input */}
            <div className="p-3.5 border-t border-border bg-secondary/10 flex items-center gap-3">
              <button className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-card cozy-transition cursor-pointer">
                <Paperclip size={14} />
              </button>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask AI to brainstorm sticky layouts or format Notion documents..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
              <button 
                onClick={sendChatMessage}
                className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cozy-transition cursor-pointer"
              >
                Send <Send size={12} />
              </button>
            </div>
          </div>
        );

      case 'calendar':
        return <CalendarPage />;

      case 'notes':
        return <NotesPage />;

      case 'tasks':
        return <KanbanPage />;

      case 'whiteboard':
        return <WhiteboardPage isDark={isDark} />;

      case 'pages':
        return <PagesSpacesPage />;

      case 'template-builder':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Cpu size={20} className="text-indigo-500" /> AI Workspace Template Builder
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Select a block type and generate templates with coziness metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Standard Notion Block', type: 'Rich Text', duration: 'Instant', complexity: 'Low', desc: 'A traditional single document layout with quick headers.' },
                { title: 'Miro Canvas Matrix', type: 'Canvas Grid', duration: '3 sec AI gen', complexity: 'Medium', desc: 'Create grids, sticky note layouts, and connector lanes.' },
                { title: 'Synced Workspace Pro', type: 'Notion + Miro Sync', duration: '8 sec AI gen', complexity: 'High', desc: 'Full pipeline embedding task lists into canvas cards.' }
              ].map((tp, tpIdx) => (
                <div key={tpIdx} className="bg-card p-5 rounded-xl border border-border/70 cozy-shadow flex flex-col justify-between hover:-translate-y-1 transition-all duration-200">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded">
                      {tp.type}
                    </span>
                    <h3 className="font-semibold text-xs text-foreground mt-1">{tp.title}</h3>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{tp.desc}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/30 pt-3.5 mt-4 text-[9px] text-muted-foreground">
                    <span>Gen Time: {tp.duration}</span>
                    <span className="font-bold">Complexity: {tp.complexity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-bold text-foreground">AuraFlow Space Settings</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Manage details of your productivity dashboard</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/70 cozy-shadow max-w-xl space-y-5">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sarah's Profile</h2>
              
              <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-zinc-800 flex items-center justify-center border text-lg text-foreground font-semibold">
                  SJ
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">Sarah Jenkins</h3>
                  <p className="text-[10px] text-muted-foreground">sarah@auraflow.io • Member since June 2026</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-foreground">
                <div className="flex justify-between items-center">
                  <span>Enable Dark Theme default</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Linked in footer toggle</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cozy Spacing density</span>
                  <select className="px-2 py-1 text-[11px] rounded bg-secondary border border-border text-foreground focus:outline-none">
                    <option>Comfortable (Cozy default)</option>
                    <option>Compact</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span>AI Copilot Auto-Assist</span>
                  <button className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 rounded font-semibold text-[10px]">
                    Enabled
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-20 bg-card rounded-xl border border-border/50">
            <span className="text-3xl">👀</span>
            <h3 className="font-semibold text-xs mt-3 text-foreground">Page Not Found</h3>
          </div>
        );
    }
  };

  return (
    <div className={`flex-1 cozy-transition bg-background ${
      activePage === 'whiteboard'
        ? 'h-[calc(100vh-4rem)] overflow-hidden flex flex-col'
        : 'overflow-y-auto h-screen p-6 md:p-8'
    }`}>
      {renderView()}
    </div>
  );
}
