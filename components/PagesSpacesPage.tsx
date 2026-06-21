'use client';

import React, { useState, useEffect } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  Plus,
  Search,
  Grid,
  List,
  MoreVertical,
  Heart,
  Archive,
  Trash2,
  Edit2,
  Share2,
  Copy,
  ExternalLink,
  ChevronRight,
  UserPlus,
  Move,
  X,
  ArrowLeft,
  ChevronDown,
  MessageSquare,
  CheckSquare,
  Clock,
  User as UserIcon,
  Download,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import TiptapEditor from './TiptapEditor';

// Color map for spaces
const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string; accent: string; dot: string }> = {
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-100 dark:border-violet-900/40',
    accent: 'bg-violet-500',
    dot: 'bg-violet-400'
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-900/40',
    accent: 'bg-blue-500',
    dot: 'bg-blue-400'
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-900/40',
    accent: 'bg-emerald-500',
    dot: 'bg-emerald-400'
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-900/40',
    accent: 'bg-amber-500',
    dot: 'bg-amber-400'
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-100 dark:border-rose-900/40',
    accent: 'bg-rose-500',
    dot: 'bg-rose-400'
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-100 dark:border-cyan-900/40',
    accent: 'bg-cyan-500',
    dot: 'bg-cyan-400'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-900/40',
    accent: 'bg-purple-500',
    dot: 'bg-purple-400'
  },
  slate: {
    bg: 'bg-slate-50 dark:bg-slate-800/40',
    text: 'text-slate-600 dark:text-slate-450',
    border: 'border-slate-100 dark:border-slate-800/40',
    accent: 'bg-slate-500',
    dot: 'bg-slate-400'
  }
};

// Page template configuration
const TEMPLATE_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  'Project Plan': {
    bg: 'bg-blue-50/70 dark:bg-blue-950/20',
    text: 'text-blue-600 dark:text-blue-450',
    border: 'border-blue-100 dark:border-blue-900/35'
  },
  'Meeting Notes': {
    bg: 'bg-amber-50/70 dark:bg-amber-950/20',
    text: 'text-amber-600 dark:text-amber-450',
    border: 'border-amber-100 dark:border-amber-900/35'
  },
  'PRD': {
    bg: 'bg-purple-50/70 dark:bg-purple-950/20',
    text: 'text-purple-600 dark:text-purple-450',
    border: 'border-purple-100 dark:border-purple-900/35'
  },
  'Research Notes': {
    bg: 'bg-cyan-50/70 dark:bg-cyan-950/20',
    text: 'text-cyan-600 dark:text-cyan-450',
    border: 'border-cyan-100 dark:border-cyan-900/35'
  },
  'Task Plan': {
    bg: 'bg-emerald-50/70 dark:bg-emerald-950/20',
    text: 'text-emerald-600 dark:text-emerald-450',
    border: 'border-emerald-100 dark:border-emerald-900/35'
  },
  'Blank Page': {
    bg: 'bg-slate-50/70 dark:bg-slate-800/30',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-100 dark:border-slate-800/35'
  },
  'Sprint Planning': {
    bg: 'bg-indigo-50/70 dark:bg-indigo-950/20',
    text: 'text-indigo-600 dark:text-indigo-455',
    border: 'border-indigo-100 dark:border-indigo-900/35'
  },
  'Document': {
    bg: 'bg-rose-50/70 dark:bg-rose-950/20',
    text: 'text-rose-600 dark:text-rose-450',
    border: 'border-rose-100 dark:border-rose-900/35'
  },
  'Reference': {
    bg: 'bg-teal-50/70 dark:bg-teal-950/20',
    text: 'text-teal-600 dark:text-teal-450',
    border: 'border-teal-100 dark:border-teal-900/35'
  }
};

interface Space {
  id: string;
  name: string;
  description: string;
  color: string;
  favorite: boolean;
  archived: boolean;
  members: string[];
  updatedAt: number;
}

interface Page {
  id: string;
  spaceId: string;
  name: string;
  type: string;
  description: string;
  favorite: boolean;
  archived: boolean;
  commentsCount: number;
  linkedTasksCount: number;
  lastEditedBy: string;
  updatedAt: number;
  createdDate: string;
  content?: string;
}

export default function PagesSpacesPage() {
  // --- STATE VARIABLES ---
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  
  // Navigation states
  const [currentSpaceId, setCurrentSpaceId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [activeNotebookPageId, setActiveNotebookPageId] = useState<string | null>(null);
  
  // Filtering & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'name' | 'pages' | 'favorites'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Context menus & Dropdowns
  const [activeSpaceMenuId, setActiveSpaceMenuId] = useState<string | null>(null);
  const [activePageMenuId, setActivePageMenuId] = useState<string | null>(null);

  // Modals state
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [isEditSpaceOpen, setIsEditSpaceOpen] = useState(false);
  const [editSpaceId, setEditSpaceId] = useState<string | null>(null);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [editPageId, setEditPageId] = useState<string | null>(null);
  const [isMovePageOpen, setIsMovePageOpen] = useState(false);
  const [movePageId, setMovePageId] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<{ type: 'space' | 'page'; id: string } | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteSpaceId, setInviteSpaceId] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportContent, setExportContent] = useState<string>('');

  // Form Fields
  const [spaceNameInput, setSpaceNameInput] = useState('');
  const [spaceDescInput, setSpaceDescInput] = useState('');
  const [spaceColorInput, setSpaceColorInput] = useState('violet');
  
  const [pageNameInput, setPageNameInput] = useState('');
  const [pageSpaceInput, setPageSpaceInput] = useState('');
  const [pageTypeInput, setPageTypeInput] = useState('Blank Page');
  const [pageDescInput, setPageDescInput] = useState('');
  
  const [inviteEmailInput, setInviteEmailInput] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // --- INITIAL DATA SEEDING ---
  useEffect(() => {
    const savedSpaces = localStorage.getItem('auraflow_spaces');
    const savedPages = localStorage.getItem('auraflow_pages');

    if (savedSpaces && savedPages) {
      try {
        setSpaces(JSON.parse(savedSpaces));
        setPages(JSON.parse(savedPages));
      } catch (e) {
        seedInitialData();
      }
    } else {
      seedInitialData();
    }
  }, []);

  const seedInitialData = () => {
    const initialSpaces: Space[] = [
      {
        id: 'space-1',
        name: 'Productivity Hub',
        description: 'Daily planning, notes, tasks, and productivity workflows.',
        color: 'violet',
        favorite: true,
        archived: false,
        members: ['SJ', 'AM', 'JD'],
        updatedAt: Date.now()
      },
      {
        id: 'space-2',
        name: 'Work Projects',
        description: 'Project plans, documentation, and team collaboration.',
        color: 'blue',
        favorite: false,
        archived: false,
        members: ['JD', 'AM', 'TL'],
        updatedAt: Date.now() - 2 * 60 * 60 * 1000 // 2h ago
      },
      {
        id: 'space-3',
        name: 'Personal Growth',
        description: 'Courses, books, notes, goals, and life organization.',
        color: 'emerald',
        favorite: false,
        archived: false,
        members: ['SJ'],
        updatedAt: Date.now() - 24 * 60 * 60 * 1000 // yesterday
      },
      {
        id: 'space-4',
        name: 'Ideas & Research',
        description: 'Brainstorming, references, and future ideas.',
        color: 'amber',
        favorite: false,
        archived: false,
        members: ['SJ', 'SK'],
        updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 // 3 days ago
      },
      {
        id: 'space-5',
        name: 'Archive',
        description: 'Archived projects and completed work.',
        color: 'rose',
        favorite: false,
        archived: true,
        members: ['SJ', 'JD'],
        updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000 // last week
      }
    ];

    const initialPages: Page[] = [
      // Space 2: Work Projects
      {
        id: 'page-2-1',
        spaceId: 'space-2',
        name: 'Dashboard',
        type: 'Project Plan',
        description: 'Main dashboard for project tracking, milestones, and high-priority launch targets.',
        favorite: true,
        archived: false,
        commentsCount: 5,
        linkedTasksCount: 12,
        lastEditedBy: 'JD',
        updatedAt: Date.now(),
        createdDate: '12 May',
        content: '<h1>🏁 Q2 Roadmap & Dashboard</h1><p>Welcome to the central project notebook. Use this space to map sprint velocities, design specs, and checklist integrations.</p><h3>Milestones</h3><ul><li><strong>Phase 1:</strong> Core DDL Schema Draft (Completed)</li><li><strong>Phase 2:</strong> Liveblocks Auth Handshake (Completed)</li><li><strong>Phase 3:</strong> AuraFlow Pages & Spaces Organizer (In Progress)</li></ul>'
      },
      {
        id: 'page-2-2',
        spaceId: 'space-2',
        name: 'Q2 Roadmap',
        type: 'Sprint Planning',
        description: 'Product roadmap and sprint scheduling for Q2 release. Outlines goals, tasks, and velocity metrics.',
        favorite: false,
        archived: false,
        commentsCount: 8,
        linkedTasksCount: 4,
        lastEditedBy: 'AM',
        updatedAt: Date.now() - 2 * 60 * 60 * 1000,
        createdDate: '11 May',
        content: '<h1>🚀 Q2 Sprint Planning & Roadmap</h1><p>Below is our velocity log for current sprint structures.</p><blockquote>"Fluid whiteboard components allow quick layouts before coding."</blockquote><h3>Sprint Commitments</h3><ul><li>Refactor theme variables for light and dark theme sync.</li><li>Verify Clerk auth keys on staging host setups.</li></ul>'
      },
      {
        id: 'page-2-3',
        spaceId: 'space-2',
        name: 'Meeting Notes',
        type: 'Project Plan',
        description: 'Weekly sync notes with client deliverables list, action items, and technical decision reviews.',
        favorite: false,
        archived: false,
        commentsCount: 2,
        linkedTasksCount: 2,
        lastEditedBy: 'AM',
        updatedAt: Date.now() - 24 * 60 * 60 * 1000,
        createdDate: '10 May',
        content: '<h1>📅 Weekly Sync Meeting Notes</h1><p><strong>Attendees:</strong> Sarah Jenkins, Devon, Alice</p><p>Discussion focused on merging Excalidraw whiteboards with text logs.</p><h3>Action Items</h3><ul><li><strong>Sarah:</strong> Sync design templates into the template builder route.</li><li><strong>Devon:</strong> Build validation suites.</li></ul>'
      },
      {
        id: 'page-2-4',
        spaceId: 'space-2',
        name: 'PRD',
        type: 'Document',
        description: 'Product Requirement Document for the new notification system and live dashboard collaboration.',
        favorite: false,
        archived: false,
        commentsCount: 14,
        linkedTasksCount: 6,
        lastEditedBy: 'TL',
        updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        createdDate: '9 May',
        content: '<h1>📄 Product Requirement Document (PRD)</h1><h3>1. Objective</h3><p>Design a system to broadcast updates when pages are altered.</p><h3>2. Functional Requirements</h3><ul><li>Live collaborative cursors inside Tiptap editors.</li><li>Notification badge inside header bar displaying pending count.</li></ul>'
      },
      {
        id: 'page-2-5',
        spaceId: 'space-2',
        name: 'Resources & Links',
        type: 'Reference',
        description: 'Useful bookmarks, documentation links, API credentials, and styling templates for developers.',
        favorite: false,
        archived: false,
        commentsCount: 0,
        linkedTasksCount: 0,
        lastEditedBy: 'SK',
        updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        createdDate: '8 May',
        content: '<h1>🔗 Development Resources & References</h1><p>Quick lookup indexes for developer environment setups.</p><ul><li>NextJS Documentation: https://nextjs.org</li><li>Tailwind CSS: https://tailwindcss.com</li><li>Drizzle ORM: https://orm.drizzle.team</li></ul>'
      },
      // Space 1: Productivity Hub
      {
        id: 'page-1-1',
        spaceId: 'space-1',
        name: 'Daily Planner',
        type: 'Blank Page',
        description: 'Personal daily log of thoughts, exercises, schedules, and reflection points.',
        favorite: true,
        archived: false,
        commentsCount: 1,
        linkedTasksCount: 0,
        lastEditedBy: 'SJ',
        updatedAt: Date.now() - 10 * 60 * 1000,
        createdDate: '20 May',
        content: '<h1>☀️ Sarah\'s Daily Planner</h1><p>Start each day with clear thoughts. Auto-save is enabled.</p><h3>Priorities</h3><ol><li>Finalize Kanban status features.</li><li>Meditate for 15 minutes.</li></ol>'
      },
      {
        id: 'page-1-2',
        spaceId: 'space-1',
        name: 'Weekly Task List',
        type: 'Task Plan',
        description: 'Coordination of life objectives and work schedules parsed into weekly blocks.',
        favorite: false,
        archived: false,
        commentsCount: 3,
        linkedTasksCount: 8,
        lastEditedBy: 'AM',
        updatedAt: Date.now() - 3 * 60 * 60 * 1000,
        createdDate: '19 May',
        content: '<h1>📋 Weekly Goals & Agenda</h1><p>Schedule of work sprint modules for June week 3.</p><h3>Checklist</h3><ul><li>[x] Design collapsible layout</li><li>[ ] Sync Neon database endpoints</li></ul>'
      },
      // Space 3: Personal Growth
      {
        id: 'page-3-1',
        spaceId: 'space-3',
        name: 'Reading List',
        type: 'Blank Page',
        description: 'Curated list of technical articles, philosophy books, and workspace architecture journals.',
        favorite: false,
        archived: false,
        commentsCount: 0,
        linkedTasksCount: 1,
        lastEditedBy: 'SJ',
        updatedAt: Date.now() - 30 * 60 * 60 * 1000,
        createdDate: '15 May',
        content: '<h1>📚 Reading List & Books</h1><p>Books to finish before Q3 starts.</p><ul><li>Atomic Habits - James Clear</li><li>Designing Data-Intensive Applications - Martin Kleppmann</li></ul>'
      },
      // Space 4: Ideas & Research
      {
        id: 'page-4-1',
        spaceId: 'space-4',
        name: 'Startup Brainstorming',
        type: 'Research Notes',
        description: 'High-level ideas for AI productivity tooling, Excalidraw embeddings, and local workspace syncs.',
        favorite: false,
        archived: false,
        commentsCount: 4,
        linkedTasksCount: 3,
        lastEditedBy: 'SJ',
        updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        createdDate: '10 May',
        content: '<h1>💡 Startup Ideas & Incubation</h1><p>Researching market gaps in collaborative whiteboard systems.</p><blockquote>"Coziness and premium aesthetic can drive high user retention."</blockquote>'
      }
    ];

    saveToStorage(initialSpaces, initialPages);
  };

  const saveToStorage = (newSpaces: Space[], newPages: Page[]) => {
    setSpaces(newSpaces);
    setPages(newPages);
    localStorage.setItem('auraflow_spaces', JSON.stringify(newSpaces));
    localStorage.setItem('auraflow_pages', JSON.stringify(newPages));
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveSpaceMenuId(null);
      setActivePageMenuId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // --- TIME FORMATTING HELPER ---
  const getRelativeTimeString = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60 * 1000) return 'just now';
    const mins = Math.floor(diff / (60 * 1000));
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    return 'Last week';
  };

  // --- DATA OPERATIONS (SPACES) ---

  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceNameInput.trim()) return;

    const newSpace: Space = {
      id: `space-${Date.now()}`,
      name: spaceNameInput.trim(),
      description: spaceDescInput.trim() || 'No description provided.',
      color: spaceColorInput,
      favorite: false,
      archived: false,
      members: ['SJ'],
      updatedAt: Date.now()
    };

    saveToStorage([...spaces, newSpace], pages);
    setIsCreateSpaceOpen(false);
    // Reset fields
    setSpaceNameInput('');
    setSpaceDescInput('');
    setSpaceColorInput('violet');
  };

  const handleEditSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSpaceId || !spaceNameInput.trim()) return;

    const updated = spaces.map(sp => {
      if (sp.id === editSpaceId) {
        return {
          ...sp,
          name: spaceNameInput.trim(),
          description: spaceDescInput.trim(),
          color: spaceColorInput,
          updatedAt: Date.now()
        };
      }
      return sp;
    });

    saveToStorage(updated, pages);
    setIsEditSpaceOpen(false);
    setEditSpaceId(null);
    setSpaceNameInput('');
    setSpaceDescInput('');
  };

  const triggerEditSpaceModal = (space: Space, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditSpaceId(space.id);
    setSpaceNameInput(space.name);
    setSpaceDescInput(space.description);
    setSpaceColorInput(space.color);
    setIsEditSpaceOpen(true);
  };

  const handleToggleFavoriteSpace = (spaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = spaces.map(sp => {
      if (sp.id === spaceId) {
        return { ...sp, favorite: !sp.favorite, updatedAt: Date.now() };
      }
      return sp;
    });
    saveToStorage(updated, pages);
  };

  const handleToggleArchiveSpace = (spaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = spaces.map(sp => {
      if (sp.id === spaceId) {
        return { ...sp, archived: !sp.archived, updatedAt: Date.now() };
      }
      return sp;
    });
    saveToStorage(updated, pages);
  };

  const handleDeleteSpace = (spaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this space and all of its pages? This action is permanent.')) {
      const remainingSpaces = spaces.filter(sp => sp.id !== spaceId);
      const remainingPages = pages.filter(pg => pg.spaceId !== spaceId);
      saveToStorage(remainingSpaces, remainingPages);
      if (currentSpaceId === spaceId) {
        setCurrentSpaceId(null);
        setSelectedPageId(null);
      }
    }
  };

  const handleDuplicateSpace = (spaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const sourceSpace = spaces.find(sp => sp.id === spaceId);
    if (!sourceSpace) return;

    const newSpaceId = `space-${Date.now()}`;
    const newSpace: Space = {
      ...sourceSpace,
      id: newSpaceId,
      name: `${sourceSpace.name} (Copy)`,
      favorite: false,
      updatedAt: Date.now()
    };

    // Duplicate pages of this space
    const sourcePages = pages.filter(pg => pg.spaceId === spaceId);
    const duplicatedPages = sourcePages.map((pg, idx) => ({
      ...pg,
      id: `page-${Date.now()}-${idx}`,
      spaceId: newSpaceId,
      name: `${pg.name} (Copy)`,
      favorite: false,
      updatedAt: Date.now()
    }));

    saveToStorage([...spaces, newSpace], [...pages, ...duplicatedPages]);
  };

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteSpaceId || !inviteEmailInput.trim()) return;

    // Grab simple initials from email
    const emailPrefix = inviteEmailInput.split('@')[0];
    const initial = emailPrefix.substring(0, 2).toUpperCase() || 'CO';

    const updated = spaces.map(sp => {
      if (sp.id === inviteSpaceId) {
        return {
          ...sp,
          members: [...sp.members, initial],
          updatedAt: Date.now()
        };
      }
      return sp;
    });

    saveToStorage(updated, pages);
    setIsInviteOpen(false);
    setInviteSpaceId(null);
    setInviteEmailInput('');
  };

  // --- DATA OPERATIONS (PAGES) ---

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageNameInput.trim() || !pageSpaceInput) return;

    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const createdDateString = `${date.getDate()} ${months[date.getMonth()]}`;

    const getTemplateContent = (type: string) => {
      switch (type) {
        case 'Project Plan':
          return '<h1>🏁 Project Plan</h1><p>Map out core objectives, deliverables, and timelines.</p><h3>Objectives</h3><ul><li>[ ] Objective 1</li><li>[ ] Objective 2</li></ul>';
        case 'Meeting Notes':
          return `<h1>📅 Meeting Notes</h1><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p><p><strong>Attendees:</strong> Sarah Jenkins</p><h3>Agenda</h3><p>Discuss deliverables.</p><h3>Action Items</h3><ul><li>[ ] Action item 1</li></ul>`;
        case 'PRD':
          return '<h1>📄 Product Requirement Document (PRD)</h1><h3>1. Overview</h3><p>Describe what we are building and why.</p><h3>2. User Stories</h3><p>As a user, I want to...</p>';
        case 'Research Notes':
          return '<h1>🔬 Research Notes</h1><h3>Background</h3><p>Outline current research findings and references.</p><h3>Key Findings</h3><ul><li>Point 1</li></ul>';
        case 'Task Plan':
          return '<h1>📋 Task Plan</h1><p>Log key assignments and completion status.</p>';
        default:
          return '<h1>Untitled Note</h1><p>Start writing notes here...</p>';
      }
    };

    const newPage: Page = {
      id: `page-${Date.now()}`,
      spaceId: pageSpaceInput,
      name: pageNameInput.trim(),
      type: pageTypeInput,
      description: pageDescInput.trim() || 'No description provided.',
      favorite: false,
      archived: false,
      commentsCount: 0,
      linkedTasksCount: 0,
      lastEditedBy: 'SJ',
      updatedAt: Date.now(),
      createdDate: createdDateString,
      content: getTemplateContent(pageTypeInput)
    };

    const updatedPages = [...pages, newPage];
    
    // Update parent space timestamp
    const updatedSpaces = spaces.map(sp => {
      if (sp.id === pageSpaceInput) {
        return { ...sp, updatedAt: Date.now() };
      }
      return sp;
    });

    saveToStorage(updatedSpaces, updatedPages);
    setIsCreatePageOpen(false);
    
    // Open preview of the new page automatically if inside the same space
    if (currentSpaceId === pageSpaceInput) {
      setSelectedPageId(newPage.id);
    }

    // Reset fields
    setPageNameInput('');
    setPageDescInput('');
    setPageTypeInput('Blank Page');
  };

  const handleEditPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPageId || !pageNameInput.trim()) return;

    const updated = pages.map(pg => {
      if (pg.id === editPageId) {
        return {
          ...pg,
          name: pageNameInput.trim(),
          type: pageTypeInput,
          description: pageDescInput.trim(),
          updatedAt: Date.now()
        };
      }
      return pg;
    });

    saveToStorage(spaces, updated);
    setIsEditPageOpen(false);
    setEditPageId(null);
    setPageNameInput('');
    setPageDescInput('');
  };

  const triggerEditPageModal = (page: Page, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditPageId(page.id);
    setPageNameInput(page.name);
    setPageTypeInput(page.type);
    setPageDescInput(page.description);
    setIsEditPageOpen(true);
  };

  const handleToggleFavoritePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = pages.map(pg => {
      if (pg.id === pageId) {
        return { ...pg, favorite: !pg.favorite, updatedAt: Date.now() };
      }
      return pg;
    });
    saveToStorage(spaces, updated);
  };

  const handleToggleArchivePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = pages.map(pg => {
      if (pg.id === pageId) {
        return { ...pg, archived: !pg.archived, updatedAt: Date.now() };
      }
      return pg;
    });
    saveToStorage(spaces, updated);
    // If we archived the active preview page, close it
    if (selectedPageId === pageId) {
      setSelectedPageId(null);
    }
    if (activeNotebookPageId === pageId) {
      setActiveNotebookPageId(null);
    }
  };

  const handleDeletePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      const updated = pages.filter(pg => pg.id !== pageId);
      saveToStorage(spaces, updated);
      if (selectedPageId === pageId) {
        setSelectedPageId(null);
      }
      if (activeNotebookPageId === pageId) {
        setActiveNotebookPageId(null);
      }
    }
  };

  const handleDuplicatePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const sourcePage = pages.find(pg => pg.id === pageId);
    if (!sourcePage) return;

    const newPage: Page = {
      ...sourcePage,
      id: `page-${Date.now()}`,
      name: `${sourcePage.name} (Copy)`,
      favorite: false,
      updatedAt: Date.now()
    };

    saveToStorage(spaces, [...pages, newPage]);
  };

  const handleMovePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movePageId || !pageSpaceInput) return;

    const updated = pages.map(pg => {
      if (pg.id === movePageId) {
        return {
          ...pg,
          spaceId: pageSpaceInput,
          updatedAt: Date.now()
        };
      }
      return pg;
    });

    saveToStorage(spaces, updated);
    setIsMovePageOpen(false);
    setMovePageId(null);
    // If current space no longer matches this page, close the page preview
    if (currentSpaceId && currentSpaceId !== pageSpaceInput) {
      setSelectedPageId(null);
      setActiveNotebookPageId(null);
    }
  };

  const triggerMovePageModal = (page: Page, e: React.MouseEvent) => {
    e.stopPropagation();
    setMovePageId(page.id);
    setPageSpaceInput(page.spaceId);
    setIsMovePageOpen(true);
  };

  const triggerShareModal = (type: 'space' | 'page', id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShareTarget({ type, id });
    setIsShareOpen(true);
  };

  const handleExportPage = (page: Page, e: React.MouseEvent) => {
    e.stopPropagation();
    const markdown = `# ${page.name}
* **Type**: ${page.type}
* **Space**: ${spaces.find(s => s.id === page.spaceId)?.name || 'Unknown'}
* **Last Edited By**: ${page.lastEditedBy}
* **Last Updated**: ${new Date(page.updatedAt).toLocaleString()}

---

## Description
${page.description}

---
Exported from AuraFlow workspace directory.`;

    setExportContent(markdown);
    setIsExportOpen(true);
  };

  // --- COPIER UTIL ---
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // --- SELECTION & FILTERING PIPELINES ---

  // Check which spaces pass filters (Tab + Search)
  const getFilteredSpaces = () => {
    return spaces.filter(sp => {
      // Tab check
      if (activeTab === 'archived') {
        if (!sp.archived) return false;
      } else {
        if (sp.archived) return false;
        if (activeTab === 'favorites' && !sp.favorite) return false;
      }

      // Search query filter (matches space name, description, OR page titles in it)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = sp.name.toLowerCase().includes(query);
        const descMatch = sp.description.toLowerCase().includes(query);
        
        const matchingPages = pages.filter(pg => pg.spaceId === sp.id && pg.name.toLowerCase().includes(query));
        const pageMatch = matchingPages.length > 0;

        return nameMatch || descMatch || pageMatch;
      }

      return true;
    }).sort((a, b) => {
      // Sort logic
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'favorites') {
        if (a.favorite === b.favorite) return b.updatedAt - a.updatedAt;
        return a.favorite ? -1 : 1;
      }
      if (sortBy === 'pages') {
        const aPages = pages.filter(p => p.spaceId === a.id).length;
        const bPages = pages.filter(p => p.spaceId === b.id).length;
        return bPages - aPages;
      }
      // 'updated' default
      return b.updatedAt - a.updatedAt;
    });
  };

  // Get pages inside current space, matching search
  const getSpacePages = (spaceId: string) => {
    return pages.filter(pg => {
      if (pg.spaceId !== spaceId) return false;
      if (pg.archived) return false; // don't show archived pages in active space view

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = pg.name.toLowerCase().includes(query);
        const descMatch = pg.description.toLowerCase().includes(query);
        const typeMatch = pg.type.toLowerCase().includes(query);
        return nameMatch || descMatch || typeMatch;
      }
      return true;
    }).sort((a, b) => b.updatedAt - a.updatedAt); // Always sorted by last edited in list
  };

  const getRecentSpaces = () => {
    // Return top 5 recently updated/opened spaces
    return [...spaces].filter(sp => !sp.archived).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);
  };

  const activeSpace = spaces.find(sp => sp.id === currentSpaceId);
  const activePage = pages.find(pg => pg.id === selectedPageId);
  const filteredSpaces = getFilteredSpaces();
  const currentSpacePages = currentSpaceId ? getSpacePages(currentSpaceId) : [];

  // --- SUB-RENDERS ---

  const activeNotebookPage = pages.find(pg => pg.id === activeNotebookPageId);

  if (activeNotebookPageId && activeNotebookPage) {
    const parentSpace = spaces.find(sp => sp.id === activeNotebookPage.spaceId);
    return (
      <div className="w-full h-full flex flex-col p-6 md:p-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <button 
              onClick={() => setActiveNotebookPageId(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg cozy-transition cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back to space</span>
            </button>
            <ChevronRight size={12} className="text-muted-foreground/60" />
            <span className="text-muted-foreground">{parentSpace?.name}</span>
            <ChevronRight size={12} className="text-muted-foreground/60" />
            <span className="font-bold text-foreground truncate max-w-[150px]">{activeNotebookPage.name}</span>
          </div>
          
          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40 font-bold text-[9px] font-mono flex items-center gap-1">
            📖 NOTEBOOK MODE
          </span>
        </div>

        {/* Editor Container */}
        <div className="flex-1 min-h-0 bg-card rounded-xl border border-border/80 cozy-shadow flex flex-col overflow-hidden">
          <TiptapEditor
            initialContent={activeNotebookPage.content || ''}
            title={activeNotebookPage.name}
            onChange={(html) => {
              const updated = pages.map(pg => {
                if (pg.id === activeNotebookPage.id) {
                  return { ...pg, content: html, updatedAt: Date.now() };
                }
                return pg;
              });
              saveToStorage(spaces, updated);
            }}
            onTitleChange={(newTitle) => {
              const updated = pages.map(pg => {
                if (pg.id === activeNotebookPage.id) {
                  return { ...pg, name: newTitle || 'Untitled Page', updatedAt: Date.now() };
                }
                return pg;
              });
              saveToStorage(spaces, updated);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex h-full text-left relative overflow-hidden bg-background">
      {/* MAIN CONTAINER */}
      <div className={cn(
        "flex-1 flex flex-col overflow-y-auto h-full pr-1 transition-all duration-300",
        selectedPageId && "lg:mr-96" // shrink when page preview is open
      )}>
        
        {/* HEADER BREADCRUMB OR SCREEN TITLE */}
        <div className="border-b border-border/50 pb-4 mb-6">
          {currentSpaceId && activeSpace ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setCurrentSpaceId(null);
                    setSelectedPageId(null);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg cozy-transition cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Spaces</span>
                </button>
                <ChevronRight size={12} className="text-muted-foreground/60" />
                <div className="flex items-center gap-2">
                  <span className={cn("w-2.5 h-2.5 rounded-full", COLOR_CLASSES[activeSpace.color]?.dot || 'bg-purple-400')} />
                  <span className="font-bold text-base text-foreground">{activeSpace.name}</span>
                  <span className="text-xs text-muted-foreground bg-secondary/70 border border-border/40 px-2 py-0.5 rounded-md font-semibold font-mono">
                    {currentSpacePages.length} {currentSpacePages.length === 1 ? 'page' : 'pages'}
                  </span>
                </div>
              </div>

              {/* Action Buttons inside a space */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPageSpaceInput(activeSpace.id);
                    setIsCreatePageOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-xs font-bold text-white shadow-sm flex items-center gap-1.5 cozy-transition cursor-pointer"
                >
                  <Plus size={14} /> New Page
                </button>
                
                {/* Space action dropdown trigger */}
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSpaceMenuId(activeSpaceMenuId === activeSpace.id ? null : activeSpace.id);
                    }}
                    className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary cozy-transition shadow-sm cursor-pointer"
                  >
                    <MoreVertical size={14} />
                  </button>
                  
                  {activeSpaceMenuId === activeSpace.id && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-48 bg-card rounded-xl border border-border shadow-lg z-50 py-1.5 text-xs text-foreground divide-y divide-border/40"
                    >
                      <div className="py-1">
                        <button 
                          onClick={(e) => triggerEditSpaceModal(activeSpace, e)}
                          className="w-full text-left px-3.5 py-2 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                        >
                          <Edit2 size={13} className="text-muted-foreground" /> Rename & Edit
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setInviteSpaceId(activeSpace.id);
                            setIsInviteOpen(true);
                            setActiveSpaceMenuId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                        >
                          <UserPlus size={13} className="text-muted-foreground" /> Invite Collaborator
                        </button>
                        <button 
                          onClick={(e) => {
                            handleDuplicateSpace(activeSpace.id, e);
                            setActiveSpaceMenuId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                        >
                          <Copy size={13} className="text-muted-foreground" /> Duplicate Space
                        </button>
                        <button 
                          onClick={(e) => {
                            triggerShareModal('space', activeSpace.id, e);
                            setActiveSpaceMenuId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                        >
                          <Share2 size={13} className="text-muted-foreground" /> Share Link
                        </button>
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={(e) => {
                            handleToggleArchiveSpace(activeSpace.id, e);
                            setActiveSpaceMenuId(null);
                            setCurrentSpaceId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                        >
                          <Archive size={13} className="text-muted-foreground" /> Archive Space
                        </button>
                        <button 
                          onClick={(e) => {
                            handleDeleteSpace(activeSpace.id, e);
                            setActiveSpaceMenuId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 size={13} /> Delete Space
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // TITLE: All Spaces Dashboard
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  All Spaces
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Top-level folders organizing your documents. Click a space to explore its pages.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCreateSpaceOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-xs font-bold text-white shadow-sm flex items-center gap-1.5 cozy-transition cursor-pointer"
                >
                  <Plus size={14} /> New Space
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
          
          {/* SEARCH INPUT */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentSpaceId ? "Search pages in this space..." : "Search spaces or pages..."}
              className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/80 text-foreground transition-all duration-200"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* FILTERINGCONTROLS - ONLY WHEN VIEWING ALL SPACES */}
          {!currentSpaceId && (
            <div className="flex items-center flex-wrap gap-2.5 text-xs">
              
              {/* FILTER TABS */}
              <div className="flex items-center bg-secondary/50 rounded-lg p-0.75 border border-border/40 font-medium">
                {[
                  { id: 'all', label: 'All Spaces' },
                  { id: 'favorites', label: 'Favorites' },
                  { id: 'recent', label: 'Recent' },
                  { id: 'archived', label: 'Archived' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id as any);
                      // Custom Sort for 'recent' tab
                      if (t.id === 'recent') {
                        setSortBy('updated');
                      }
                    }}
                    className={cn(
                      "px-2.5 py-1.25 rounded-md text-[11px] transition-all duration-150 cursor-pointer",
                      activeTab === t.id 
                        ? 'bg-card text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* SORT DROPDOWN */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-[11px]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2 py-1 text-[11px] rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-medium"
                >
                  <option value="updated">Recently Updated</option>
                  <option value="name">Alphabetical</option>
                  <option value="pages">Most Pages</option>
                  <option value="favorites">Favorites First</option>
                </select>
              </div>

              {/* VIEW SWITCHER */}
              <div className="flex items-center border border-border bg-card rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-1 rounded cursor-pointer cozy-transition",
                    viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                  title="Grid view"
                >
                  <Grid size={13} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-1 rounded cursor-pointer cozy-transition",
                    viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                  title="List view"
                >
                  <List size={13} />
                </button>
              </div>

            </div>
          )}
        </div>

        {/* --- VIEW ROUTER: SPACES VS PAGES --- */}
        {currentSpaceId && activeSpace ? (
          
          /* SPACE DETAIL VIEW: SHOWING PAGES INSIDE ONE SPACE */
          <div className="flex-1 flex flex-col bg-card rounded-xl border border-border/80 cozy-shadow overflow-hidden min-h-[400px]">
            {currentSpacePages.length > 0 ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/15 text-muted-foreground font-semibold">
                      <th className="p-3.5 pl-5">Document Name</th>
                      <th className="p-3.5">Type/Template</th>
                      <th className="p-3.5">Updated</th>
                      <th className="p-3.5">Last Edited By</th>
                      <th className="p-3.5 pr-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {currentSpacePages.map((page) => {
                      const badgeStyle = TEMPLATE_BADGES[page.type] || TEMPLATE_BADGES['Blank Page'];
                      const isSelected = selectedPageId === page.id;
                      
                      return (
                        <tr 
                          key={page.id}
                          onClick={() => setSelectedPageId(page.id === selectedPageId ? null : page.id)}
                          className={cn(
                            "hover:bg-purple-50/20 dark:hover:bg-purple-950/5 cursor-pointer transition-colors duration-150 group",
                            isSelected && "bg-indigo-50/40 dark:bg-purple-950/10"
                          )}
                        >
                          {/* Name + Favorite */}
                          <td className="p-3.5 pl-5 font-medium text-foreground max-w-[200px] truncate">
                            <div className="flex items-center gap-3">
                              <FileText size={14} className="text-muted-foreground flex-shrink-0" />
                              <span className="truncate group-hover:text-indigo-600 dark:group-hover:text-purple-400 cozy-transition">{page.name}</span>
                              {page.favorite && (
                                <Heart size={11} className="fill-rose-500 text-rose-500 flex-shrink-0 animate-pulse" />
                              )}
                            </div>
                          </td>

                          {/* Template Badge */}
                          <td className="p-3.5">
                            <span className={cn(
                              "inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border",
                              badgeStyle.bg, badgeStyle.text, badgeStyle.border
                            )}>
                              {page.type}
                            </span>
                          </td>

                          {/* Updated Time */}
                          <td className="p-3.5 text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Clock size={11} className="text-muted-foreground/60" />
                            {getRelativeTimeString(page.updatedAt)}
                          </td>

                          {/* Last Edited By */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-zinc-800 text-[8px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-zinc-700 flex items-center justify-center font-mono">
                                {page.lastEditedBy}
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono">edited</span>
                            </div>
                          </td>

                          {/* Action cell */}
                          <td className="p-3.5 pr-5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="relative inline-block">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePageMenuId(activePageMenuId === page.id ? null : page.id);
                                }}
                                className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
                              >
                                <MoreVertical size={13} />
                              </button>

                              {activePageMenuId === page.id && (
                                <div className="absolute right-0 mt-1 w-44 bg-card rounded-xl border border-border shadow-lg z-50 py-1.25 text-left text-[11px] divide-y divide-border/40 text-foreground">
                                  <div className="py-1">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveNotebookPageId(page.id);
                                        setActivePageMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-indigo-600 dark:text-purple-400 font-bold flex items-center gap-2 cursor-pointer"
                                    >
                                      <span>✍️ Write Note</span>
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        triggerEditPageModal(page, e);
                                        setActivePageMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <Edit2 size={12} className="text-muted-foreground" /> Rename
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        handleToggleFavoritePage(page.id, e);
                                        setActivePageMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <Heart size={12} className={cn("text-muted-foreground", page.favorite && "fill-rose-500 text-rose-500")} /> 
                                      {page.favorite ? 'Unfavorite' : 'Favorite'}
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        triggerMovePageModal(page, e);
                                        setActivePageMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <Move size={12} className="text-muted-foreground" /> Move to Space
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        handleDuplicatePage(page.id, e);
                                        setActivePageMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <Copy size={12} className="text-muted-foreground" /> Duplicate
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        triggerShareModal('page', page.id, e);
                                        setActivePageMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <Share2 size={12} className="text-muted-foreground" /> Share Link
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        handleExportPage(page, e);
                                        setActivePageMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <Download size={12} className="text-muted-foreground" /> Export MD
                                    </button>
                                  </div>
                                  <div className="py-1">
                                    <button 
                                      onClick={(e) => {
                                        handleToggleArchivePage(page.id, e);
                                        setActivePageMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <Archive size={12} className="text-muted-foreground" /> Archive Page
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        handleDeletePage(page.id, e);
                                        setActivePageMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Trash2 size={12} /> Delete Page
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 py-20">
                <FileText size={32} className="text-muted-foreground/40 mb-3" />
                <h3 className="font-semibold text-xs text-foreground">No documents yet</h3>
                <p className="text-[11px] text-muted-foreground max-w-xs mt-1 leading-relaxed">
                  Spaces act as top-level folders. Add your first text page, meeting notes, or PRD inside this space!
                </p>
                <button
                  onClick={() => {
                    setPageSpaceInput(activeSpace.id);
                    setIsCreatePageOpen(true);
                  }}
                  className="mt-4 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1.5 shadow-sm cozy-transition cursor-pointer"
                >
                  <Plus size={12} /> Add Page
                </button>
              </div>
            )}
          </div>

        ) : (

          /* SPACES GRID / LIST VIEW (MAIN SCREEN) */
          <>
            {filteredSpaces.length > 0 ? (
              viewMode === 'grid' ? (
                // GRID VIEW
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-300">
                  {filteredSpaces.map((space) => {
                    const spacePages = pages.filter(p => p.spaceId === space.id && !p.archived);
                    const colorSet = COLOR_CLASSES[space.color] || COLOR_CLASSES.violet;

                    return (
                      <div 
                        key={space.id}
                        onClick={() => setCurrentSpaceId(space.id)}
                        className="bg-card p-5 rounded-2xl border border-border/75 hover:border-indigo-200 dark:hover:border-purple-900 cozy-shadow cozy-transition cursor-pointer flex flex-col justify-between group relative hover:-translate-y-0.75"
                      >
                        {/* Upper Section */}
                        <div className="space-y-3 text-left">
                          
                          {/* Folder Color Badge + Favorite & More vertical actions */}
                          <div className="flex items-center justify-between">
                            <div className={cn("p-2 rounded-xl border flex items-center justify-center", colorSet.bg, colorSet.border)}>
                              <Folder size={18} className={colorSet.text} />
                            </div>
                            
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={(e) => handleToggleFavoriteSpace(space.id, e)}
                                className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cozy-transition cursor-pointer"
                              >
                                <Heart size={12} className={cn(space.favorite && "fill-rose-500 text-rose-500")} />
                              </button>

                              <div className="relative">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSpaceMenuId(activeSpaceMenuId === space.id ? null : space.id);
                                  }}
                                  className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary cozy-transition cursor-pointer"
                                >
                                  <MoreVertical size={12} />
                                </button>
                                
                                {activeSpaceMenuId === space.id && (
                                  <div className="absolute right-0 mt-1 w-44 bg-card rounded-xl border border-border shadow-lg z-50 py-1.25 text-left text-[11px] divide-y divide-border/40 text-foreground">
                                    <div className="py-1">
                                      <button 
                                        onClick={(e) => triggerEditSpaceModal(space, e)}
                                        className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                      >
                                        <Edit2 size={12} className="text-muted-foreground" /> Rename & Color
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setInviteSpaceId(space.id);
                                          setIsInviteOpen(true);
                                          setActiveSpaceMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                      >
                                        <UserPlus size={12} className="text-muted-foreground" /> Invite Collaborator
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          handleDuplicateSpace(space.id, e);
                                          setActiveSpaceMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                      >
                                        <Copy size={12} className="text-muted-foreground" /> Duplicate Space
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          triggerShareModal('space', space.id, e);
                                          setActiveSpaceMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                      >
                                        <Share2 size={12} className="text-muted-foreground" /> Share Link
                                      </button>
                                    </div>
                                    <div className="py-1">
                                      <button 
                                        onClick={(e) => {
                                          handleToggleArchiveSpace(space.id, e);
                                          setActiveSpaceMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                      >
                                        <Archive size={12} className="text-muted-foreground" /> 
                                        {space.archived ? 'Restore Space' : 'Archive Space'}
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          handleDeleteSpace(space.id, e);
                                          setActiveSpaceMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 flex items-center gap-2 cursor-pointer"
                                      >
                                        <Trash2 size={12} /> Delete Space
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Space Name & Description */}
                          <div>
                            <h3 className="font-bold text-xs text-foreground group-hover:text-indigo-600 dark:group-hover:text-purple-400 cozy-transition">
                              {space.name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1.5 line-clamp-2">
                              {space.description}
                            </p>
                          </div>

                        </div>

                        {/* Lower Section: Pages count, avatars, updated metadata */}
                        <div className="border-t border-border/40 mt-4 pt-3.5 flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                          
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-secondary border border-border/50 font-bold font-mono">
                              {spacePages.length} {spacePages.length === 1 ? 'page' : 'pages'}
                            </span>
                            <span className="font-normal font-mono text-[9px]">
                              Updated {getRelativeTimeString(space.updatedAt)}
                            </span>
                          </div>

                          {/* Overlapping member avatars */}
                          <div className="flex items-center -space-x-1.5">
                            {space.members.slice(0, 3).map((m, idx) => (
                              <div 
                                key={idx} 
                                className="w-5.5 h-5.5 rounded-full border border-card bg-indigo-50 dark:bg-zinc-800 text-[8px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono cursor-help"
                                title="Space collaborator"
                              >
                                {m}
                              </div>
                            ))}
                            {space.members.length > 3 && (
                              <div className="w-5.5 h-5.5 rounded-full border border-card bg-secondary text-[8px] font-bold text-muted-foreground flex items-center justify-center font-mono">
                                +{space.members.length - 3}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // LIST VIEW
                <div className="space-y-3.5 animate-in fade-in duration-300">
                  {filteredSpaces.map((space) => {
                    const spacePages = pages.filter(p => p.spaceId === space.id && !p.archived);
                    const colorSet = COLOR_CLASSES[space.color] || COLOR_CLASSES.violet;

                    return (
                      <div 
                        key={space.id}
                        onClick={() => setCurrentSpaceId(space.id)}
                        className="bg-card p-4 rounded-xl border border-border/75 hover:border-indigo-200 dark:hover:border-purple-900 cozy-shadow cozy-transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                      >
                        {/* Left block: Folder, Title, Desc */}
                        <div className="flex items-center gap-4 text-left flex-1 min-w-0">
                          <div className={cn("p-2 rounded-xl border flex items-center justify-center flex-shrink-0", colorSet.bg, colorSet.border)}>
                            <Folder size={16} className={colorSet.text} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-xs text-foreground group-hover:text-indigo-600 dark:group-hover:text-purple-400 cozy-transition truncate">
                              {space.name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground leading-normal truncate mt-0.5">
                              {space.description}
                            </p>
                          </div>
                        </div>

                        {/* Right block: meta details and actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 text-[10px] text-muted-foreground font-semibold flex-shrink-0 border-t border-border/30 pt-2 sm:pt-0 sm:border-t-0">
                          
                          {/* Page Count */}
                          <span className="px-2 py-0.5 rounded-full bg-secondary border border-border/50 font-bold font-mono">
                            {spacePages.length} {spacePages.length === 1 ? 'page' : 'pages'}
                          </span>

                          {/* Updated */}
                          <span className="font-normal font-mono hidden md:inline text-[9px]">
                            Updated {getRelativeTimeString(space.updatedAt)}
                          </span>

                          {/* Member Avatars */}
                          <div className="flex items-center -space-x-1.5">
                            {space.members.slice(0, 3).map((m, idx) => (
                              <div 
                                key={idx} 
                                className="w-5 h-5 rounded-full border border-card bg-indigo-50 dark:bg-zinc-800 text-[7px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono"
                              >
                                {m}
                              </div>
                            ))}
                          </div>

                          {/* Favorite / Action buttons */}
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={(e) => handleToggleFavoriteSpace(space.id, e)}
                              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cozy-transition cursor-pointer"
                            >
                              <Heart size={11} className={cn(space.favorite && "fill-rose-500 text-rose-500")} />
                            </button>

                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSpaceMenuId(activeSpaceMenuId === space.id ? null : space.id);
                                }}
                                className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary cozy-transition cursor-pointer"
                              >
                                <MoreVertical size={11} />
                              </button>
                              
                              {activeSpaceMenuId === space.id && (
                                <div className="absolute right-0 mt-1 w-44 bg-card rounded-xl border border-border shadow-lg z-50 py-1.25 text-left text-[11px] divide-y divide-border/40 text-foreground">
                                  <div className="py-1">
                                    <button 
                                      onClick={(e) => triggerEditSpaceModal(space, e)}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <Edit2 size={12} className="text-muted-foreground" /> Rename
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setInviteSpaceId(space.id);
                                        setIsInviteOpen(true);
                                        setActiveSpaceMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <UserPlus size={12} className="text-muted-foreground" /> Invite Collaborator
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        handleDuplicateSpace(space.id, e);
                                        setActiveSpaceMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <Copy size={12} className="text-muted-foreground" /> Duplicate Space
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        triggerShareModal('space', space.id, e);
                                        setActiveSpaceMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <Share2 size={12} className="text-muted-foreground" /> Share Link
                                    </button>
                                  </div>
                                  <div className="py-1">
                                    <button 
                                      onClick={(e) => {
                                        handleToggleArchiveSpace(space.id, e);
                                        setActiveSpaceMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                    >
                                      <Archive size={12} className="text-muted-foreground" /> Archive Space
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        handleDeleteSpace(space.id, e);
                                        setActiveSpaceMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Trash2 size={12} /> Delete Space
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-16 py-24 bg-card rounded-2xl border border-border/80 cozy-shadow">
                <FolderOpen size={40} className="text-muted-foreground/35 mb-4 animate-bounce" />
                <h3 className="font-semibold text-xs text-foreground">No spaces found</h3>
                <p className="text-[11px] text-muted-foreground max-w-xs mt-1 leading-relaxed">
                  {searchQuery ? "No spaces or pages match your search criteria. Try a different query." : "Folders organize your workspace documents. Get started by creating your first space."}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setIsCreateSpaceOpen(true)}
                    className="mt-5 px-4 py-1.75 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1.5 shadow-sm cozy-transition cursor-pointer"
                  >
                    <Plus size={13} /> Create Space
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* --- PAGE PREVIEW PANEL --- */}
      {selectedPageId && activePage && (
        <div className="fixed inset-y-16 right-0 w-full sm:w-96 bg-card border-l border-border/90 shadow-2xl z-40 flex flex-col justify-between text-xs text-foreground animate-in slide-in-from-right duration-350">
          
          {/* Preview Header */}
          <div className="p-4 border-b border-border/60 flex items-center justify-between bg-secondary/10">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-indigo-50/70 text-indigo-600 dark:bg-purple-950/30 dark:text-purple-400 border border-indigo-100 dark:border-purple-900/30 font-bold text-[9px] font-mono">
                PREVIEW
              </span>
              <span className="text-muted-foreground text-[10px] font-medium font-mono">
                {spaces.find(s => s.id === activePage.spaceId)?.name || 'Space'}
              </span>
            </div>
            <button 
              onClick={() => setSelectedPageId(null)}
              className="p-1.5 rounded-lg border border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>

          {/* Preview Content */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 text-left">
            {/* Title / Name */}
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <FileText size={16} className="text-indigo-500" />
                <h2 className="text-sm font-bold text-foreground leading-snug">{activePage.name}</h2>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2.5">
                {/* Template badge */}
                <span className={cn(
                  "px-2 py-0.5 rounded-md font-bold text-[9px] border",
                  (TEMPLATE_BADGES[activePage.type] || TEMPLATE_BADGES['Blank Page']).bg,
                  (TEMPLATE_BADGES[activePage.type] || TEMPLATE_BADGES['Blank Page']).text,
                  (TEMPLATE_BADGES[activePage.type] || TEMPLATE_BADGES['Blank Page']).border
                )}>
                  {activePage.type}
                </span>

                {activePage.favorite && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450 border border-rose-100 dark:border-rose-900/35 font-bold text-[9px] flex items-center gap-1">
                    <Heart size={9} className="fill-rose-500" /> Favorite
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 bg-secondary/15 p-3.5 rounded-xl border border-border/40">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Description</h4>
              <p className="text-muted-foreground leading-relaxed text-[11px] font-medium font-sans">
                {activePage.description}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3.5 pt-1.5">
              <div className="bg-card p-3 rounded-xl border border-border/80 text-left">
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Comments</span>
                <span className="text-base font-bold text-foreground flex items-center gap-1.5 mt-1 font-mono">
                  <MessageSquare size={13} className="text-indigo-400" /> {activePage.commentsCount}
                </span>
              </div>
              <div className="bg-card p-3 rounded-xl border border-border/80 text-left">
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Linked Tasks</span>
                <span className="text-base font-bold text-foreground flex items-center gap-1.5 mt-1 font-mono">
                  <CheckSquare size={13} className="text-emerald-400" /> {activePage.linkedTasksCount}
                </span>
              </div>
            </div>

            {/* Metadata (History) */}
            <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground space-y-2.5">
              <div className="flex justify-between items-center">
                <span>Last updated:</span>
                <span className="font-mono font-semibold">{getRelativeTimeString(activePage.updatedAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Created date:</span>
                <span className="font-mono font-semibold">{activePage.createdDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last edited by:</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-zinc-800 text-[8px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono">
                    {activePage.lastEditedBy}
                  </div>
                  <span className="font-mono font-semibold text-foreground">Collaborator</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notebook Editor Main Button */}
          <div className="px-4 pt-4 border-t border-border/60 bg-secondary/10">
            <button 
              onClick={() => {
                setActiveNotebookPageId(activePage.id);
              }}
              className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 dark:bg-purple-650 dark:hover:bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cozy-transition cursor-pointer text-[11px] shadow-sm animate-pulse"
            >
              ✍️ Write in Page Notebook
            </button>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-4 bg-secondary/10 grid grid-cols-2 gap-2 text-[10px]">
            <button 
              onClick={(e) => {
                handleToggleFavoritePage(activePage.id, e);
              }}
              className="px-2.5 py-1.75 rounded-lg border border-border bg-card hover:bg-secondary font-bold text-foreground flex items-center justify-center gap-1.5 cozy-transition cursor-pointer"
            >
              <Heart size={11} className={cn(activePage.favorite && "fill-rose-500 text-rose-500")} />
              {activePage.favorite ? 'Unfavorite' : 'Favorite'}
            </button>
            <button 
              onClick={(e) => {
                triggerShareModal('page', activePage.id, e);
              }}
              className="px-2.5 py-1.75 rounded-lg border border-border bg-card hover:bg-secondary font-bold text-foreground flex items-center justify-center gap-1.5 cozy-transition cursor-pointer"
            >
              <Share2 size={11} /> Share
            </button>
            <button 
              onClick={(e) => {
                triggerEditPageModal(activePage, e);
              }}
              className="px-2.5 py-1.75 rounded-lg border border-border bg-card hover:bg-secondary font-bold text-foreground flex items-center justify-center gap-1.5 cozy-transition cursor-pointer"
            >
              <Edit2 size={11} /> Rename & Edit
            </button>
            <button 
              onClick={(e) => {
                triggerMovePageModal(activePage, e);
              }}
              className="px-2.5 py-1.75 rounded-lg border border-border bg-card hover:bg-secondary font-bold text-foreground flex items-center justify-center gap-1.5 cozy-transition cursor-pointer"
            >
              <Move size={11} /> Move Space
            </button>
            <button 
              onClick={(e) => {
                handleDuplicatePage(activePage.id, e);
              }}
              className="px-2.5 py-1.75 rounded-lg border border-border bg-card hover:bg-secondary font-bold text-foreground flex items-center justify-center gap-1.5 cozy-transition cursor-pointer"
            >
              <Copy size={11} /> Duplicate Page
            </button>
            <button 
              onClick={(e) => {
                handleExportPage(activePage, e);
              }}
              className="px-2.5 py-1.75 rounded-lg border border-border bg-card hover:bg-secondary font-bold text-foreground flex items-center justify-center gap-1.5 cozy-transition cursor-pointer"
            >
              <Download size={11} /> Export MD
            </button>
            <button 
              onClick={(e) => {
                handleToggleArchivePage(activePage.id, e);
              }}
              className="px-2.5 py-1.75 rounded-lg border border-border bg-card hover:bg-secondary font-bold text-foreground flex items-center justify-center gap-1.5 cozy-transition cursor-pointer"
            >
              <Archive size={11} /> Archive Page
            </button>
            <button 
              onClick={(e) => {
                handleDeletePage(activePage.id, e);
              }}
              className="px-2.5 py-1.75 rounded-lg border border-rose-100 bg-rose-50 dark:border-rose-950/20 dark:bg-rose-950/10 text-rose-600 hover:opacity-90 font-bold flex items-center justify-center gap-1.5 cozy-transition cursor-pointer"
            >
              <Trash2 size={11} /> Delete Document
            </button>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* ================= MODALS ================= */}
      {/* ========================================= */}

      {/* 1. CREATE SPACE MODAL */}
      {isCreateSpaceOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md p-6 rounded-2xl border border-border shadow-2xl relative text-left text-xs text-foreground">
            <button 
              onClick={() => setIsCreateSpaceOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
              <Folder className="text-indigo-500" size={16} /> Create New Space
            </h3>
            <p className="text-muted-foreground text-[11px] mb-5">
              Spaces organize pages. Customize its name, description, and folder accent.
            </p>

            <form onSubmit={handleCreateSpace} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Space Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Design System & Assets"
                  value={spaceNameInput}
                  onChange={(e) => setSpaceNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Summarize the core target or goal of this space..."
                  value={spaceDescInput}
                  onChange={(e) => setSpaceDescInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Color selector */}
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground block">Folder Accent Color</label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {Object.keys(COLOR_CLASSES).map((color) => {
                    const classes = COLOR_CLASSES[color];
                    const isSelected = spaceColorInput === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSpaceColorInput(color)}
                        className={cn(
                          "w-6 h-6 rounded-full border flex items-center justify-center cozy-transition hover:scale-110 cursor-pointer",
                          classes.accent,
                          isSelected ? "border-indigo-600 scale-105 ring-2 ring-indigo-500/20" : "border-transparent"
                        )}
                        title={color}
                      >
                        {isSelected && <Check size={11} className="text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateSpaceOpen(false)}
                  className="px-4 py-2 border border-border bg-card rounded-xl font-bold hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Create Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT SPACE MODAL */}
      {isEditSpaceOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md p-6 rounded-2xl border border-border shadow-2xl relative text-left text-xs text-foreground">
            <button 
              onClick={() => {
                setIsEditSpaceOpen(false);
                setEditSpaceId(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
              <Folder className="text-indigo-500" size={16} /> Edit Space Configuration
            </h3>
            <p className="text-muted-foreground text-[11px] mb-5">
              Change the properties of this space.
            </p>

            <form onSubmit={handleEditSpace} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Space Name</label>
                <input 
                  type="text"
                  required
                  value={spaceNameInput}
                  onChange={(e) => setSpaceNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Description</label>
                <textarea 
                  rows={3}
                  value={spaceDescInput}
                  onChange={(e) => setSpaceDescInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Color selector */}
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground block">Folder Accent Color</label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {Object.keys(COLOR_CLASSES).map((color) => {
                    const classes = COLOR_CLASSES[color];
                    const isSelected = spaceColorInput === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSpaceColorInput(color)}
                        className={cn(
                          "w-6 h-6 rounded-full border flex items-center justify-center cozy-transition hover:scale-110 cursor-pointer",
                          classes.accent,
                          isSelected ? "border-indigo-600 scale-105 ring-2 ring-indigo-500/20" : "border-transparent"
                        )}
                        title={color}
                      >
                        {isSelected && <Check size={11} className="text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditSpaceOpen(false);
                    setEditSpaceId(null);
                  }}
                  className="px-4 py-2 border border-border bg-card rounded-xl font-bold hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CREATE PAGE MODAL */}
      {isCreatePageOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md p-6 rounded-2xl border border-border shadow-2xl relative text-left text-xs text-foreground">
            <button 
              onClick={() => setIsCreatePageOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
              <FileText className="text-indigo-500" size={16} /> Create New Document
            </h3>
            <p className="text-muted-foreground text-[11px] mb-5">
              Draft notes, PRDs, task plans or agendas directly into any of your active folders.
            </p>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Document Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Q3 Launch Logistics"
                  value={pageNameInput}
                  onChange={(e) => setPageNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Add to Space</label>
                  <select 
                    value={pageSpaceInput}
                    onChange={(e) => setPageSpaceInput(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="" disabled>Select a folder...</option>
                    {spaces.filter(s => !s.archived).map(sp => (
                      <option key={sp.id} value={sp.id}>{sp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Type/Template</label>
                  <select 
                    value={pageTypeInput}
                    onChange={(e) => setPageTypeInput(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Blank Page">Blank Page</option>
                    <option value="Project Plan">Project Plan</option>
                    <option value="Meeting Notes">Meeting Notes</option>
                    <option value="PRD">PRD</option>
                    <option value="Research Notes">Research Notes</option>
                    <option value="Task Plan">Task Plan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Brief Outline/Description</label>
                <textarea 
                  rows={3}
                  placeholder="Write a brief overview of the context inside this document..."
                  value={pageDescInput}
                  onChange={(e) => setPageDescInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreatePageOpen(false)}
                  className="px-4 py-2 border border-border bg-card rounded-xl font-bold hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Create Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. EDIT PAGE NAME/DESC MODAL */}
      {isEditPageOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md p-6 rounded-2xl border border-border shadow-2xl relative text-left text-xs text-foreground">
            <button 
              onClick={() => {
                setIsEditPageOpen(false);
                setEditPageId(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
              <FileText className="text-indigo-500" size={16} /> Edit Document Details
            </h3>
            <p className="text-muted-foreground text-[11px] mb-5">
              Change name, template type, or short outline description.
            </p>

            <form onSubmit={handleEditPage} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Document Name</label>
                <input 
                  type="text"
                  required
                  value={pageNameInput}
                  onChange={(e) => setPageNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Type/Template</label>
                <select 
                  value={pageTypeInput}
                  onChange={(e) => setPageTypeInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Blank Page">Blank Page</option>
                  <option value="Project Plan">Project Plan</option>
                  <option value="Meeting Notes">Meeting Notes</option>
                  <option value="PRD">PRD</option>
                  <option value="Research Notes">Research Notes</option>
                  <option value="Task Plan">Task Plan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Brief Outline/Description</label>
                <textarea 
                  rows={3}
                  value={pageDescInput}
                  onChange={(e) => setPageDescInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditPageOpen(false);
                    setEditPageId(null);
                  }}
                  className="px-4 py-2 border border-border bg-card rounded-xl font-bold hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MOVE PAGE TO ANOTHER SPACE MODAL */}
      {isMovePageOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm p-6 rounded-2xl border border-border shadow-2xl relative text-left text-xs text-foreground">
            <button 
              onClick={() => {
                setIsMovePageOpen(false);
                setMovePageId(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
              <Move className="text-indigo-500" size={16} /> Move Document to Space
            </h3>
            <p className="text-muted-foreground text-[11px] mb-5">
              Re-organize this document by selecting a different parent folder.
            </p>

            <form onSubmit={handleMovePage} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Select Target Space</label>
                <select 
                  value={pageSpaceInput}
                  onChange={(e) => setPageSpaceInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="" disabled>Choose folder...</option>
                  {spaces.filter(s => !s.archived).map(sp => (
                    <option key={sp.id} value={sp.id}>{sp.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsMovePageOpen(false);
                    setMovePageId(null);
                  }}
                  className="px-4 py-2 border border-border bg-card rounded-xl font-bold hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Move Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. INVITE COLLABORATORS MODAL */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm p-6 rounded-2xl border border-border shadow-2xl relative text-left text-xs text-foreground">
            <button 
              onClick={() => {
                setIsInviteOpen(false);
                setInviteSpaceId(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
              <UserPlus className="text-indigo-500" size={16} /> Invite Space Collaborators
            </h3>
            <p className="text-muted-foreground text-[11px] mb-5">
              Add workspace members to help you plan, review, and draft.
            </p>

            <form onSubmit={handleAddCollaborator} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Collaborator Email</label>
                <input 
                  type="email"
                  required
                  placeholder="e.g. devon@auraflow.io"
                  value={inviteEmailInput}
                  onChange={(e) => setInviteEmailInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsInviteOpen(false);
                    setInviteSpaceId(null);
                    setInviteEmailInput('');
                  }}
                  className="px-4 py-2 border border-border bg-card rounded-xl font-bold hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. SHARE LINK MODAL */}
      {isShareOpen && shareTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm p-6 rounded-2xl border border-border shadow-2xl relative text-left text-xs text-foreground">
            <button 
              onClick={() => {
                setIsShareOpen(false);
                setShareTarget(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
              <Share2 className="text-indigo-500" size={16} /> Share Link Directory
            </h3>
            <p className="text-muted-foreground text-[11px] mb-5">
              Copy this link so other logged-in project editors can access this page directly.
            </p>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Direct URL</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    readOnly
                    value={`https://auraflow.io/spaces/${shareTarget.id}`}
                    className="flex-1 px-3 py-2 border border-border rounded-xl bg-secondary/35 focus:outline-none select-all truncate font-mono text-[10px]"
                  />
                  <button
                    onClick={() => copyToClipboard(`https://auraflow.io/spaces/${shareTarget.id}`)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cozy-transition cursor-pointer flex items-center gap-1 min-w-[70px] justify-center"
                  >
                    {copiedText ? <Check size={12} /> : "Copy"}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setIsShareOpen(false);
                    setShareTarget(null);
                  }}
                  className="px-4 py-2 border border-border bg-card rounded-xl font-bold hover:bg-secondary cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. EXPORT MARKDOWN MODAL */}
      {isExportOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg p-6 rounded-2xl border border-border shadow-2xl relative text-left text-xs text-foreground">
            <button 
              onClick={() => {
                setIsExportOpen(false);
                setExportContent('');
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
              <Download className="text-indigo-500" size={16} /> Export Markdown Outline
            </h3>
            <p className="text-muted-foreground text-[11px] mb-4">
              Copy-paste this markdown outline to move your document context to other workspace software.
            </p>

            <div className="space-y-4">
              <textarea 
                readOnly
                rows={10}
                value={exportContent}
                className="w-full p-3.5 border border-border rounded-xl bg-secondary/35 focus:outline-none font-mono text-[10px] leading-relaxed resize-none"
              />

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <Check size={12} /> Ready to copy
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(exportContent)}
                    className="px-3.5 py-1.75 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cozy-transition cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedText ? <Check size={12} /> : "Copy to Clipboard"}
                  </button>
                  <button
                    onClick={() => {
                      setIsExportOpen(false);
                      setExportContent('');
                    }}
                    className="px-3.5 py-1.75 border border-border bg-card rounded-xl font-bold hover:bg-secondary cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
