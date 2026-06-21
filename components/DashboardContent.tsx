'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CalendarPage from './CalendarPage';
import KanbanPage from './KanbanPage';
import NotesPage from './NotesPage';
import PagesSpacesPage from './PagesSpacesPage';
import AIAssistantPage from './AIAssistantPage';

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

import { 
  Flame,
  Wallet,
  DollarSign,
  Utensils,
  BookOpen,
  CheckSquare,
  Trophy,
  Shield,
  Layers,
  ListTodo,
  ArrowLeft,
  Pin,
  PinOff,
  Trash2,
  Loader2,
  Check,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Compass,
  Edit3,
  X
} from 'lucide-react';
import { useAppUser } from '@/lib/auth-context';

const iconMap: Record<string, React.ComponentType<any>> = {
  Flame,
  Wallet,
  DollarSign,
  Utensils,
  BookOpen,
  Activity,
  Compass,
  CheckSquare,
  Sparkles,
  Trophy,
  Shield,
  Layers,
  ListTodo
};

interface ContentProps {
  activePage: string;
  setActivePage: (id: string) => void;
  isDark: boolean;
  createdApps: any[];
  setCreatedApps: (apps: any[]) => void;
}

export default function DashboardContent({ 
  activePage, 
  setActivePage, 
  isDark, 
  createdApps, 
  setCreatedApps 
}: ContentProps) {
  const { user } = useAppUser();
  const userId = user?.id || 'guest';

  const [promptValue, setPromptValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [formInputs, setFormInputs] = useState<Record<string, Record<string, any>>>({});
  const [currentApp, setCurrentApp] = useState<any>(null);

  // Interactive customizer states
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editAppName, setEditAppName] = useState('');
  const [editAppDescription, setEditAppDescription] = useState('');

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');

  const [editingCompId, setEditingCompId] = useState<string | null>(null);
  const [editCompTitle, setEditCompTitle] = useState('');

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemText, setEditItemText] = useState('');
  const [editItemSubtitle, setEditItemSubtitle] = useState('');
  const [editItemTag, setEditItemTag] = useState('');

  const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>({});

  const [editingTableCell, setEditingTableCell] = useState<{
    sectionId: string;
    compId: string;
    rowIndex: number;
    colIndex: number;
  } | null>(null);
  const [editCellText, setEditCellText] = useState('');

  // Stats editing states
  const [editingStatIndex, setEditingStatIndex] = useState<{
    sectionId: string;
    compId: string;
    statIndex: number;
  } | null>(null);
  const [editStatLabel, setEditStatLabel] = useState('');
  const [editStatValue, setEditStatValue] = useState('');
  const [editStatDesc, setEditStatDesc] = useState('');

  // Progress editing states
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null);
  const [editProgressTitle, setEditProgressTitle] = useState('');
  const [editProgressValue, setEditProgressValue] = useState<number>(0);

  // Helper to modify checklist items immutably
  const modifyChecklistItems = (app: any, sectionId: string, compId: string, modifier: (items: any[]) => any[]) => {
    return {
      ...app,
      sections: app.sections.map((s: any) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.id !== compId) return c;
            return {
              ...c,
              items: modifier(c.items || [])
            };
          })
        };
      })
    };
  };

  // Helper to update app stats and progress metrics based on completion rate
  const updateAppStatsAndProgress = (app: any) => {
    let totalChecklistItems = 0;
    let completedChecklistItems = 0;
    app.sections.forEach((s: any) => {
      s.components.forEach((c: any) => {
        if (c.type === 'checklist') {
          c.items?.forEach((item: any) => {
            totalChecklistItems++;
            if (item.checked) completedChecklistItems++;
          });
        }
      });
    });

    const completionRate = totalChecklistItems > 0 
      ? Math.round((completedChecklistItems / totalChecklistItems) * 100) 
      : 0;

    return {
      ...app,
      sections: app.sections.map((s: any) => {
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.type === 'stats') {
              return {
                ...c,
                stats: c.stats?.map((st: any) => {
                  const labelLower = st.label.toLowerCase();
                  if (labelLower.includes('completion')) {
                    return { ...st, value: `${completionRate}%` };
                  }
                  if (labelLower.includes('pending')) {
                    const pending = totalChecklistItems - completedChecklistItems;
                    return { ...st, value: `${pending} Items` };
                  }
                  if (labelLower.includes('tasks') || labelLower.includes('habits')) {
                    return { ...st, value: `${totalChecklistItems} Items` };
                  }
                  return st;
                })
              };
            }
            if (c.type === 'progress') {
              return {
                ...c,
                value: completionRate
              };
            }
            return c;
          })
        };
      })
    };
  };

  // Checklist handlers
  const handleAddChecklistItem = (sectionId: string, compId: string) => {
    if (!currentApp) return;
    const label = newItemInputs[compId]?.trim();
    if (!label) return;

    const updatedApp = modifyChecklistItems(currentApp, sectionId, compId, (items: any[]) => [
      ...items,
      { id: `item_${Date.now()}`, label, checked: false }
    ]);

    setNewItemInputs(prev => ({ ...prev, [compId]: '' }));
    const finalApp = updateAppStatsAndProgress(updatedApp);
    setCurrentApp(finalApp);
    saveAppChanges(finalApp);
  };

  const handleDeleteChecklistItem = (sectionId: string, compId: string, itemId: string) => {
    if (!currentApp) return;

    const updatedApp = modifyChecklistItems(currentApp, sectionId, compId, (items: any[]) =>
      items.filter((i: any) => i.id !== itemId)
    );

    const finalApp = updateAppStatsAndProgress(updatedApp);
    setCurrentApp(finalApp);
    saveAppChanges(finalApp);
  };

  const handleSaveChecklistItemName = (sectionId: string, compId: string, itemId: string) => {
    if (!currentApp || !editItemText.trim()) return;

    const finalApp = modifyChecklistItems(currentApp, sectionId, compId, (items: any[]) =>
      items.map((i: any) => (i.id === itemId ? { ...i, label: editItemText.trim() } : i))
    );

    setEditingItemId(null);
    setEditItemText('');
    setCurrentApp(finalApp);
    saveAppChanges(finalApp);
  };

  // List handlers
  const handleAddListItem = (sectionId: string, compId: string) => {
    if (!currentApp) return;
    const title = newItemInputs[compId]?.trim();
    if (!title) return;

    const updatedApp = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.id !== compId) return c;
            return {
              ...c,
              items: [
                ...(c.items || []),
                {
                  id: `item_${Date.now()}`,
                  title,
                  subtitle: 'New description details',
                  tag: 'General',
                  tagColor: currentApp.color
                }
              ]
            };
          })
        };
      })
    };

    setNewItemInputs(prev => ({ ...prev, [compId]: '' }));
    setCurrentApp(updatedApp);
    saveAppChanges(updatedApp);
  };

  const handleDeleteListItem = (sectionId: string, compId: string, itemId: string) => {
    if (!currentApp) return;
    const updatedApp = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.id !== compId) return c;
            return {
              ...c,
              items: (c.items || []).filter((i: any) => i.id !== itemId)
            };
          })
        };
      })
    };
    setCurrentApp(updatedApp);
    saveAppChanges(updatedApp);
  };

  const handleSaveListItem = (sectionId: string, compId: string, itemId: string) => {
    if (!currentApp || !editItemText.trim()) return;
    const updatedApp = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.id !== compId) return c;
            return {
              ...c,
              items: (c.items || []).map((i: any) => {
                if (i.id !== itemId) return i;
                return {
                  ...i,
                  title: editItemText.trim(),
                  subtitle: editItemSubtitle.trim(),
                  tag: editItemTag.trim()
                };
              })
            };
          })
        };
      })
    };

    setEditingItemId(null);
    setEditItemText('');
    setEditItemSubtitle('');
    setEditItemTag('');
    setCurrentApp(updatedApp);
    saveAppChanges(updatedApp);
  };

  // Table handlers
  const handleAddTableRow = (sectionId: string, compId: string, headersCount: number) => {
    if (!currentApp) return;
    const newRow = Array(headersCount).fill('');
    const updatedApp = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.id !== compId) return c;
            return {
              ...c,
              rows: [...(c.rows || []), newRow]
            };
          })
        };
      })
    };
    setCurrentApp(updatedApp);
    saveAppChanges(updatedApp);
  };

  const handleDeleteTableRow = (sectionId: string, compId: string, rowIndex: number) => {
    if (!currentApp) return;
    const updatedApp = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.id !== compId) return c;
            return {
              ...c,
              rows: (c.rows || []).filter((_: any, idx: number) => idx !== rowIndex)
            };
          })
        };
      })
    };
    setCurrentApp(updatedApp);
    saveAppChanges(updatedApp);
  };

  const handleSaveTableCell = (sectionId: string, compId: string, rowIndex: number, colIndex: number) => {
    if (!currentApp) return;
    const updatedApp = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.id !== compId) return c;
            return {
              ...c,
              rows: (c.rows || []).map((row: string[], rIdx: number) => {
                if (rIdx !== rowIndex) return row;
                return row.map((cell: string, cIdx: number) => {
                  if (cIdx !== colIndex) return cell;
                  return editCellText;
                });
              })
            };
          })
        };
      })
    };

    setEditingTableCell(null);
    setEditCellText('');
    setCurrentApp(updatedApp);
    saveAppChanges(updatedApp);
  };

  // Header & Title handlers
  const handleSaveHeader = () => {
    if (!currentApp || !editAppName.trim()) return;
    const updatedApp = {
      ...currentApp,
      appName: editAppName.trim(),
      description: editAppDescription.trim()
    };
    setCurrentApp(updatedApp);
    saveAppChanges(updatedApp);
    setIsEditingHeader(false);
  };

  const handleSaveSectionTitle = (sectionId: string) => {
    if (!currentApp || !editSectionTitle.trim()) return;
    const updatedApp = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        if (s.id === sectionId) {
          return { ...s, title: editSectionTitle.trim() };
        }
        return s;
      })
    };
    setEditingSectionId(null);
    setEditSectionTitle('');
    setCurrentApp(updatedApp);
    saveAppChanges(updatedApp);
  };

  const handleSaveCompTitle = (sectionId: string, compId: string) => {
    if (!currentApp || !editCompTitle.trim()) return;
    const updatedApp = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.id === compId) {
              return { ...c, title: editCompTitle.trim() };
            }
            return c;
          })
        };
      })
    };
    setEditingCompId(null);
    setEditCompTitle('');
    setCurrentApp(updatedApp);
    saveAppChanges(updatedApp);
  };

  const handleSaveStatCard = (sectionId: string, compId: string, statIndex: number) => {
    if (!currentApp) return;
    const updatedApp = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.id !== compId) return c;
            return {
              ...c,
              stats: c.stats?.map((st: any, idx: number) => {
                if (idx !== statIndex) return st;
                return {
                  ...st,
                  label: editStatLabel.trim(),
                  value: editStatValue.trim(),
                  desc: editStatDesc.trim()
                };
              })
            };
          })
        };
      })
    };
    setEditingStatIndex(null);
    setCurrentApp(updatedApp);
    saveAppChanges(updatedApp);
  };

  const handleSaveProgressComp = (sectionId: string, compId: string) => {
    if (!currentApp) return;
    const updatedApp = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.id !== compId) return c;
            return {
              ...c,
              title: editProgressTitle.trim(),
              value: Math.max(0, Math.min(100, editProgressValue))
            };
          })
        };
      })
    };
    setEditingProgressId(null);
    setCurrentApp(updatedApp);
    saveAppChanges(updatedApp);
  };

  // Sync currentApp when activePage changes
  useEffect(() => {
    if (activePage.startsWith('app_')) {
      const appId = activePage.replace('app_', '');
      const app = createdApps.find(a => a.id === appId);
      if (app) {
        setCurrentApp(JSON.parse(JSON.stringify(app)));
      } else {
        setCurrentApp(null);
      }
    } else {
      setCurrentApp(null);
    }
  }, [activePage, createdApps]);

  const saveAppChanges = (updatedApp: any) => {
    const updatedApps = createdApps.map(a => {
      if (a.id === updatedApp.id) {
        return updatedApp;
      }
      return a;
    });
    setCreatedApps(updatedApps);
    localStorage.setItem(`auraflow_created_apps_${userId}`, JSON.stringify(updatedApps));
  };

  const handleToggleChecklist = (sectionId: string, compId: string, itemId: string) => {
    if (!currentApp) return;

    // 1. Toggled checklist item state immutably
    const updatedChecklistApp = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          components: s.components.map((c: any) => {
            if (c.id !== compId) return c;
            return {
              ...c,
              items: c.items.map((i: any) => {
                if (i.id !== itemId) return i;
                return { ...i, checked: !i.checked };
              })
            };
          })
        };
      })
    };

    // 2. Recalculate stats and progress metrics
    const finalApp = updateAppStatsAndProgress(updatedChecklistApp);

    setCurrentApp(finalApp);
    saveAppChanges(finalApp);
  };

  const handleFormSubmit = (sectionId: string, compId: string, fields: any[]) => {
    if (!currentApp) return;
    const inputs = formInputs[compId] || {};
    
    const hasValues = Object.values(inputs).some(v => v !== undefined && v !== '');
    if (!hasValues) return;

    const titleVal = inputs[fields[0]?.id] || 'New Entry';
    const descVal = inputs[fields[1]?.id] || '';
    const categoryVal = inputs[fields[2]?.id] || '';
    const numberVal = parseFloat(inputs['amount'] || inputs['expense'] || inputs[fields[0]?.id] || 0);

    // Find the first checklist, table, or list component to append the value to
    let targetCompId = '';
    const currentSection = currentApp.sections.find((s: any) => s.id === sectionId);
    if (currentSection) {
      const tc = currentSection.components.find((c: any) => ['checklist', 'table', 'list'].includes(c.type));
      if (tc) targetCompId = tc.id;
    }
    if (!targetCompId) {
      for (const s of currentApp.sections) {
        const tc = s.components.find((c: any) => ['checklist', 'table', 'list'].includes(c.type));
        if (tc) {
          targetCompId = tc.id;
          break;
        }
      }
    }

    const updated = {
      ...currentApp,
      sections: currentApp.sections.map((s: any) => {
        return {
          ...s,
          components: s.components.map((c: any) => {
            // Append data to the targeted component
            if (c.id === targetCompId) {
              if (c.type === 'checklist') {
                return {
                  ...c,
                  items: [...(c.items || []), { id: `item_${Date.now()}`, label: `${titleVal} (${categoryVal || 'General'})`, checked: false }]
                };
              }
              if (c.type === 'table') {
                const newRow = fields.map(f => {
                  const val = inputs[f.id];
                  if (f.type === 'number') {
                    const num = parseFloat(val);
                    return isNaN(num) ? '' : `$${num.toFixed(2)}`;
                  }
                  return String(val || '');
                });
                while (newRow.length < c.headers.length) {
                  newRow.push('');
                }
                return {
                  ...c,
                  rows: [...(c.rows || []), newRow]
                };
              }
              if (c.type === 'list') {
                return {
                  ...c,
                  items: [...(c.items || []), { 
                    id: `item_${Date.now()}`, 
                    title: String(titleVal), 
                    subtitle: String(descVal), 
                    tag: String(categoryVal), 
                    tagColor: currentApp.color 
                  }]
                };
              }
            }

            // Update stats
            if (c.type === 'stats') {
              return {
                ...c,
                stats: c.stats?.map((st: any) => {
                  if (st.label.toLowerCase().includes('expenses') || st.label.toLowerCase().includes('spent')) {
                    const currentVal = parseFloat(st.value.replace(/[^0-9.]/g, '')) || 0;
                    return { ...st, value: `$${(currentVal + numberVal).toFixed(2)}` };
                  }
                  if (st.label.toLowerCase().includes('balance')) {
                    const currentVal = parseFloat(st.value.replace(/[^0-9.]/g, '')) || 0;
                    return { ...st, value: `$${(currentVal - numberVal).toFixed(2)}` };
                  }
                  if (st.label.toLowerCase().includes('total habits') || st.label.toLowerCase().includes('tasks') || st.label.toLowerCase().includes('items')) {
                    const currentVal = parseInt(st.value.replace(/[^0-9]/g, '')) || 0;
                    return { ...st, value: `${currentVal + 1} Items` };
                  }
                  return st;
                })
              };
            }

            // Update chart data
            if (c.type === 'chart') {
              const catIndex = c.labels?.findIndex((l: string) => l.toLowerCase() === categoryVal.toLowerCase());
              if (catIndex !== -1 && c.data) {
                const newData = [...c.data];
                newData[catIndex] = (newData[catIndex] || 0) + numberVal;
                return { ...c, data: newData };
              }
            }

            return c;
          })
        };
      })
    };

    setFormInputs(prev => ({
      ...prev,
      [compId]: {}
    }));

    const finalApp = updateAppStatsAndProgress(updated);
    setCurrentApp(finalApp);
    saveAppChanges(finalApp);
  };

  const handleGenerateApp = async () => {
    if (!promptValue.trim()) return;
    setIsGenerating(true);
    setWarningMessage(null);
    setLoadingStep(0);

    const stepsInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await fetch('/api/ai/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptValue })
      });

      if (!response.ok) {
        throw new Error('AI generation service is currently unavailable.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const newApp = {
        id: `app_${Date.now()}`,
        appName: data.appName || "Custom Workspace",
        description: data.description || "Tailored AI interactive workspace.",
        icon: data.icon || "Sparkles",
        color: data.color || "#6366F1",
        layout: data.layout || "single-page",
        sections: data.sections || [],
        createdAt: Date.now(),
        pinned: false
      };

      const updatedApps = [newApp, ...createdApps];
      setCreatedApps(updatedApps);
      localStorage.setItem(`auraflow_created_apps_${userId}`, JSON.stringify(updatedApps));
      
      setActivePage(`app_${newApp.id}`);
      setPromptValue('');
    } catch (err: any) {
      console.error(err);
      setWarningMessage(err.message || 'Template generation failed. Please try again.');
    } finally {
      clearInterval(stepsInterval);
      setIsGenerating(false);
    }
  };

  const handleTogglePin = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const app = createdApps.find(a => a.id === appId);
    if (!app) return;

    if (!app.pinned) {
      const currentlyPinned = createdApps.filter(a => a.pinned).length;
      if (currentlyPinned >= 3) {
        setWarningMessage("Maximum of 3 apps can be added to the sidebar. Please remove one first!");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setWarningMessage(null), 4000);
        return;
      }
    }

    const updated = createdApps.map(a => {
      if (a.id === appId) {
        return { ...a, pinned: !a.pinned };
      }
      return a;
    });

    setCreatedApps(updated);
    localStorage.setItem(`auraflow_created_apps_${userId}`, JSON.stringify(updated));
  };

  const handleDeleteApp = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this workspace template?")) {
      const filtered = createdApps.filter(a => a.id !== appId);
      setCreatedApps(filtered);
      localStorage.setItem(`auraflow_created_apps_${userId}`, JSON.stringify(filtered));
      if (activePage === `app_${appId}`) {
        setActivePage('template-builder');
      }
    }
  };

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

  // Render App Preview Page
  const renderAppPreview = (app: any) => {
    if (!currentApp) return null;
    const IconComp = iconMap[currentApp.icon] || Sparkles;

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Warning messages if any */}
        {warningMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle size={14} />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Back and Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
          <div className="flex items-center gap-3 flex-1">
            <button 
              onClick={() => setActivePage('template-builder')}
              className="p-1.5 rounded-lg border border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: currentApp.color }}>
              <IconComp size={20} />
            </div>
            
            {isEditingHeader ? (
              <div className="flex items-end gap-2 flex-1 max-w-md">
                <div className="flex-1 space-y-1">
                  <input 
                    type="text" 
                    value={editAppName}
                    onChange={(e) => setEditAppName(e.target.value)}
                    placeholder="Workspace Name"
                    className="w-full px-2.5 py-1 text-sm border border-border/80 bg-card rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-bold"
                  />
                  <input 
                    type="text" 
                    value={editAppDescription}
                    onChange={(e) => setEditAppDescription(e.target.value)}
                    placeholder="Workspace Description"
                    className="w-full px-2.5 py-0.5 text-xs border border-border/60 bg-card rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-muted-foreground"
                  />
                </div>
                <button 
                  onClick={handleSaveHeader}
                  className="p-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer"
                >
                  <Check size={14} />
                </button>
                <button 
                  onClick={() => setIsEditingHeader(false)}
                  className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="text-left flex-1 group/header flex items-start gap-2">
                <div>
                  <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    {currentApp.appName}
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">{currentApp.description}</p>
                </div>
                <button 
                  onClick={() => {
                    setIsEditingHeader(true);
                    setEditAppName(currentApp.appName);
                    setEditAppDescription(currentApp.description || '');
                  }}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground/0 group-hover/header:text-muted-foreground/100 transition-all cursor-pointer"
                  title="Edit workspace details"
                >
                  <Edit3 size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => handleTogglePin(currentApp.id, e)}
              className="px-3 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-1.5 cozy-transition shadow-sm cursor-pointer"
            >
              {currentApp.pinned ? (
                <>
                  <PinOff size={13} className="text-amber-500" /> Remove from Sidebar
                </>
              ) : (
                <>
                  <Pin size={13} className="text-muted-foreground" /> Add to Sidebar
                </>
              )}
            </button>
            <button 
              onClick={(e) => handleDeleteApp(currentApp.id, e)}
              className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 cozy-transition cursor-pointer"
              title="Delete workspace"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Sections Rendering Grid */}
        <div className={currentApp.sections?.length === 1 ? "max-w-3xl mx-auto space-y-6 w-full" : "grid grid-cols-1 lg:grid-cols-2 gap-6 w-full"}>
          {currentApp.sections?.map((s: any) => (
            <div key={s.id} className="bg-card p-5 rounded-2xl border border-border/60 cozy-shadow space-y-4">
              {editingSectionId === s.id ? (
                <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                  <input 
                    type="text"
                    value={editSectionTitle}
                    onChange={(e) => setEditSectionTitle(e.target.value)}
                    className="px-2 py-0.5 text-sm border border-border/80 bg-card rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-bold"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveSectionTitle(s.id);
                      if (e.key === 'Escape') setEditingSectionId(null);
                    }}
                    autoFocus
                  />
                  <button 
                    onClick={() => handleSaveSectionTitle(s.id)}
                    className="p-1 rounded bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer"
                  >
                    <Check size={11} />
                  </button>
                  <button 
                    onClick={() => setEditingSectionId(null)}
                    className="p-1 rounded border border-border bg-card text-muted-foreground cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <h3 className="font-bold text-sm text-foreground border-b border-border/40 pb-2 flex items-center gap-2 group/sect">
                  <span className="w-1.5 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: currentApp.color }} />
                  <span>{s.title}</span>
                  <button 
                    onClick={() => {
                      setEditingSectionId(s.id);
                      setEditSectionTitle(s.title);
                    }}
                    className="p-0.5 rounded text-muted-foreground/0 group-hover/sect:text-muted-foreground/100 transition-all cursor-pointer"
                    title="Rename section"
                  >
                    <Edit3 size={11} />
                  </button>
                </h3>
              )}
              
              <div className="space-y-4">
                {s.components?.map((c: any) => {
                  switch (c.type) {
                    case 'stats':
                      return (
                        <div key={c.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
                          {c.stats?.map((st: any, idx: number) => {
                            const isEditing = editingStatIndex?.sectionId === s.id &&
                                              editingStatIndex?.compId === c.id &&
                                              editingStatIndex?.statIndex === idx;

                            return (
                              <div 
                                key={idx} 
                                className="bg-secondary/20 p-3 rounded-xl border border-border/40 flex flex-col justify-between group/stat relative overflow-hidden" 
                                style={{ borderLeft: `3px solid ${currentApp.color}` }}
                              >
                                {isEditing ? (
                                  <div className="space-y-1.5 text-left z-10 bg-card/95 absolute inset-0 p-2 flex flex-col justify-between">
                                    <input 
                                      type="text" 
                                      value={editStatLabel}
                                      onChange={(e) => setEditStatLabel(e.target.value)}
                                      className="px-1.5 py-0.5 text-[8px] font-bold border border-border bg-card rounded text-foreground uppercase tracking-wider focus:outline-none"
                                      placeholder="Label"
                                      autoFocus
                                    />
                                    <input 
                                      type="text" 
                                      value={editStatValue}
                                      onChange={(e) => setEditStatValue(e.target.value)}
                                      className="px-1.5 py-0.5 text-xs font-bold border border-border bg-card rounded text-foreground focus:outline-none"
                                      placeholder="Value"
                                    />
                                    <div className="flex gap-1 items-center">
                                      <input 
                                        type="text" 
                                        value={editStatDesc}
                                        onChange={(e) => setEditStatDesc(e.target.value)}
                                        className="px-1.5 py-0.5 text-[8px] border border-border bg-card rounded text-muted-foreground flex-1 focus:outline-none"
                                        placeholder="Description"
                                      />
                                      <button 
                                        onClick={() => handleSaveStatCard(s.id, c.id, idx)}
                                        className="p-1 rounded bg-indigo-500 text-white cursor-pointer flex-shrink-0"
                                      >
                                        <Check size={9} />
                                      </button>
                                      <button 
                                        onClick={() => setEditingStatIndex(null)}
                                        className="p-1 rounded border border-border bg-card text-muted-foreground cursor-pointer flex-shrink-0"
                                      >
                                        <X size={9} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex justify-between items-start">
                                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{st.label}</span>
                                      <button 
                                        onClick={() => {
                                          setEditingStatIndex({ sectionId: s.id, compId: c.id, statIndex: idx });
                                          setEditStatLabel(st.label);
                                          setEditStatValue(st.value);
                                          setEditStatDesc(st.desc || '');
                                        }}
                                        className="p-0.5 rounded text-muted-foreground hover:text-foreground opacity-0 group-hover/stat:opacity-100 transition-opacity cursor-pointer flex-shrink-0"
                                        title="Edit metric card"
                                      >
                                        <Edit3 size={10} />
                                      </button>
                                    </div>
                                    <span className="text-lg font-bold text-foreground mt-0.5">{st.value}</span>
                                    {st.desc && <span className="text-[9px] text-muted-foreground mt-0.5 leading-none">{st.desc}</span>}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    case 'progress':
                      return (
                        <div key={c.id} className="bg-secondary/15 p-4 rounded-xl border border-border/30 my-2 space-y-2 relative group/prog">
                          {editingProgressId === c.id ? (
                            <div className="space-y-2 text-left bg-card p-3 rounded-lg border border-border/50 shadow-sm">
                              <div className="flex gap-2">
                                <div className="flex-1 space-y-1">
                                  <label className="text-[9px] font-bold text-muted-foreground">Progress Title</label>
                                  <input 
                                    type="text" 
                                    value={editProgressTitle}
                                    onChange={(e) => setEditProgressTitle(e.target.value)}
                                    className="w-full px-2 py-0.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none"
                                  />
                                </div>
                                <div className="w-20 space-y-1">
                                  <label className="text-[9px] font-bold text-muted-foreground">Value (%)</label>
                                  <input 
                                    type="number" 
                                    min="0"
                                    max="100"
                                    value={editProgressValue}
                                    onChange={(e) => setEditProgressValue(parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-0.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-1.5 justify-end">
                                <button 
                                  onClick={() => handleSaveProgressComp(s.id, c.id)}
                                  className="px-2 py-0.5 text-[10px] rounded bg-indigo-500 text-white font-bold cursor-pointer"
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={() => setEditingProgressId(null)}
                                  className="px-2 py-0.5 text-[10px] rounded border border-border bg-card text-muted-foreground cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-center text-[11px] font-bold text-foreground">
                                <div className="flex items-center gap-1.5">
                                  <span>{c.title}</span>
                                  <button 
                                    onClick={() => {
                                      setEditingProgressId(c.id);
                                      setEditProgressTitle(c.title);
                                      setEditProgressValue(c.value || 0);
                                    }}
                                    className="p-0.5 rounded text-muted-foreground hover:text-foreground opacity-0 group-hover/prog:opacity-100 transition-opacity cursor-pointer"
                                    title="Edit progress details"
                                  >
                                    <Edit3 size={10} />
                                  </button>
                                </div>
                                <span>{c.value}%</span>
                              </div>
                              <div className="w-full bg-secondary/80 rounded-full h-2 overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${c.value}%`, backgroundColor: currentApp.color }} />
                              </div>
                            </>
                          )}
                        </div>
                      );
                    case 'checklist':
                      return (
                        <div key={c.id} className="bg-secondary/15 p-4 rounded-xl border border-border/30 my-2 space-y-3">
                          {editingCompId === c.id ? (
                            <div className="flex items-center gap-1.5 border-b border-border/10 pb-1">
                              <input 
                                type="text"
                                value={editCompTitle}
                                onChange={(e) => setEditCompTitle(e.target.value)}
                                className="px-2 py-0.5 text-[10px] font-bold border border-border bg-card rounded focus:outline-none text-foreground"
                                autoFocus
                              />
                              <button onClick={() => handleSaveCompTitle(s.id, c.id)} className="p-0.5 rounded bg-indigo-500 text-white cursor-pointer"><Check size={10} /></button>
                              <button onClick={() => setEditingCompId(null)} className="p-0.5 rounded border border-border text-muted-foreground cursor-pointer"><X size={10} /></button>
                            </div>
                          ) : (
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/10 pb-1 flex items-center justify-between group/comp">
                              <span>{c.title}</span>
                              <button 
                                onClick={() => {
                                  setEditingCompId(c.id);
                                  setEditCompTitle(c.title);
                                }}
                                className="p-0.5 rounded text-muted-foreground/0 group-hover/comp:text-muted-foreground/100 transition-all cursor-pointer"
                              >
                                <Edit3 size={9} />
                              </button>
                            </h4>
                          )}
                          <div className="space-y-2">
                            {c.items?.map((item: any) => (
                              <div key={item.id} className="flex items-center justify-between group/item py-0.5">
                                {editingItemId === item.id ? (
                                  <div className="flex items-center gap-1.5 flex-1">
                                    <input 
                                      type="text" 
                                      value={editItemText}
                                      onChange={(e) => setEditItemText(e.target.value)}
                                      className="px-2 py-0.5 text-xs rounded border border-border bg-card text-foreground flex-1 focus:outline-none focus:ring-1 focus:ring-primary"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveChecklistItemName(s.id, c.id, item.id);
                                        if (e.key === 'Escape') setEditingItemId(null);
                                      }}
                                      autoFocus
                                    />
                                    <button 
                                      onClick={() => handleSaveChecklistItemName(s.id, c.id, item.id)}
                                      className="p-1 rounded bg-indigo-500 text-white cursor-pointer"
                                    >
                                      <Check size={11} />
                                    </button>
                                    <button 
                                      onClick={() => setEditingItemId(null)}
                                      className="p-1 rounded border border-border bg-card text-muted-foreground cursor-pointer"
                                    >
                                      <X size={11} />
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none flex-1">
                                      <input 
                                        type="checkbox" 
                                        checked={item.checked}
                                        onChange={() => handleToggleChecklist(s.id, c.id, item.id)}
                                        className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary cursor-pointer transition-all duration-150"
                                        style={{ accentColor: currentApp.color }}
                                      />
                                      <span className={`transition-all duration-200 ${item.checked ? 'line-through text-muted-foreground/80' : 'text-foreground'}`}>
                                        {item.label}
                                      </span>
                                    </label>
                                    <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => {
                                          setEditingItemId(item.id);
                                          setEditItemText(item.label);
                                        }}
                                        className="p-0.5 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                                        title="Rename task"
                                      >
                                        <Edit3 size={11} />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteChecklistItem(s.id, c.id, item.id)}
                                        className="p-0.5 rounded text-muted-foreground hover:text-red-500 cursor-pointer"
                                        title="Delete task"
                                      >
                                        <Trash2 size={11} />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                            {(!c.items || c.items.length === 0) && (
                              <p className="text-[10px] text-muted-foreground italic">No checklist items yet.</p>
                            )}

                            {/* Add Item Row */}
                            <div className="pt-2 border-t border-border/10 flex items-center gap-2">
                              <input 
                                type="text"
                                placeholder="+ Add new task..."
                                value={newItemInputs[c.id] || ''}
                                onChange={(e) => setNewItemInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddChecklistItem(s.id, c.id);
                                }}
                                className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                              <button 
                                onClick={() => handleAddChecklistItem(s.id, c.id)}
                                className="p-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                                title="Add task"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    case 'form':
                      return (
                        <div key={c.id} className="bg-secondary/15 p-4 rounded-xl border border-border/30 my-2 space-y-3">
                          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/10 pb-1">{c.title}</h4>
                          <div className="space-y-2.5">
                            {c.fields?.map((f: any) => (
                              <div key={f.id} className="flex flex-col text-left space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground">{f.label}</label>
                                {f.type === 'select' ? (
                                  <select 
                                    value={formInputs[c.id]?.[f.id] || ''}
                                    onChange={(e) => setFormInputs(prev => ({
                                      ...prev,
                                      [c.id]: { ...prev[c.id], [f.id]: e.target.value }
                                    }))}
                                    className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                  >
                                    <option value="">Select...</option>
                                    {f.options?.map((opt: string) => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <input 
                                    type={f.type === 'number' ? 'number' : 'text'}
                                    placeholder={f.placeholder || ''}
                                    value={formInputs[c.id]?.[f.id] || ''}
                                    onChange={(e) => setFormInputs(prev => ({
                                      ...prev,
                                      [c.id]: { ...prev[c.id], [f.id]: e.target.value }
                                    }))}
                                    className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                )}
                              </div>
                            ))}
                            <button 
                              onClick={() => handleFormSubmit(s.id, c.id, c.fields)}
                              className="w-full py-1.5 rounded-lg text-white font-semibold text-xs shadow-sm cozy-transition cursor-pointer mt-1"
                              style={{ backgroundColor: currentApp.color }}
                            >
                              {c.submitText || 'Submit'}
                            </button>
                          </div>
                        </div>
                      );
                    case 'table':
                      return (
                        <div key={c.id} className="bg-secondary/15 p-4 rounded-xl border border-border/30 my-2 overflow-x-auto">
                          {editingCompId === c.id ? (
                            <div className="flex items-center gap-1.5 border-b border-border/10 pb-1 mb-2">
                              <input 
                                type="text"
                                value={editCompTitle}
                                onChange={(e) => setEditCompTitle(e.target.value)}
                                className="px-2 py-0.5 text-[10px] font-bold border border-border bg-card rounded focus:outline-none text-foreground"
                                autoFocus
                              />
                              <button onClick={() => handleSaveCompTitle(s.id, c.id)} className="p-0.5 rounded bg-indigo-500 text-white cursor-pointer"><Check size={10} /></button>
                              <button onClick={() => setEditingCompId(null)} className="p-0.5 rounded border border-border text-muted-foreground cursor-pointer"><X size={10} /></button>
                            </div>
                          ) : (
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/10 pb-1 mb-2 flex items-center justify-between group/comp">
                              <span>{c.title}</span>
                              <button 
                                onClick={() => {
                                  setEditingCompId(c.id);
                                  setEditCompTitle(c.title);
                                }}
                                className="p-0.5 rounded text-muted-foreground/0 group-hover/comp:text-muted-foreground/100 transition-all cursor-pointer"
                              >
                                <Edit3 size={9} />
                              </button>
                            </h4>
                          )}
                          <table className="w-full border-collapse text-xs text-foreground text-left">
                            <thead>
                              <tr className="border-b border-border/40">
                                {c.headers?.map((h: string, idx: number) => (
                                  <th key={idx} className="pb-1.5 font-bold text-muted-foreground uppercase tracking-wider text-[9px]">{h}</th>
                                ))}
                                <th className="pb-1.5 font-bold text-muted-foreground uppercase tracking-wider text-[9px] w-8"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {c.rows?.map((row: string[], rowIdx: number) => (
                                <tr key={rowIdx} className="border-b border-border/20 last:border-0 hover:bg-secondary/10 transition-all duration-100 group/row">
                                  {row.map((val: string, colIdx: number) => {
                                    const isEditing = editingTableCell?.sectionId === s.id && 
                                                      editingTableCell?.compId === c.id && 
                                                      editingTableCell?.rowIndex === rowIdx && 
                                                      editingTableCell?.colIndex === colIdx;
                                    return (
                                      <td key={colIdx} className="py-2 text-[11px] font-medium max-w-[150px] truncate relative">
                                        {isEditing ? (
                                          <div className="flex items-center gap-1 absolute inset-y-1 inset-x-0 bg-card z-10 px-1">
                                            <input 
                                              type="text" 
                                              value={editCellText}
                                              onChange={(e) => setEditCellText(e.target.value)}
                                              className="w-full px-1.5 py-0.5 text-xs rounded border border-border bg-card text-foreground"
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveTableCell(s.id, c.id, rowIdx, colIdx);
                                                if (e.key === 'Escape') setEditingTableCell(null);
                                              }}
                                              autoFocus
                                            />
                                            <button 
                                              onClick={() => handleSaveTableCell(s.id, c.id, rowIdx, colIdx)}
                                              className="p-0.5 rounded bg-indigo-500 text-white cursor-pointer"
                                            >
                                              <Check size={10} />
                                            </button>
                                          </div>
                                        ) : (
                                          <div 
                                            onClick={() => {
                                              setEditingTableCell({ sectionId: s.id, compId: c.id, rowIndex: rowIdx, colIndex: colIdx });
                                              setEditCellText(val);
                                            }}
                                            className="cursor-pointer hover:bg-secondary/30 px-1 py-0.5 rounded transition-all"
                                            title="Click to edit cell"
                                          >
                                            {val || <span className="text-muted-foreground/40 italic">Empty</span>}
                                          </div>
                                        )}
                                      </td>
                                    );
                                  })}
                                  <td className="py-2 text-right">
                                    <button 
                                      onClick={() => handleDeleteTableRow(s.id, c.id, rowIdx)}
                                      className="p-1 rounded text-muted-foreground hover:text-red-500 opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer"
                                      title="Delete row"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {(!c.rows || c.rows.length === 0) && (
                                <tr>
                                  <td colSpan={(c.headers?.length || 1) + 1} className="py-3 text-center text-[10px] text-muted-foreground italic">No data logs yet.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          <div className="mt-2.5 pt-2 border-t border-border/10 flex justify-end">
                            <button 
                              onClick={() => handleAddTableRow(s.id, c.id, c.headers?.length || 1)}
                              className="px-2 py-1 rounded bg-secondary hover:bg-secondary-foreground/10 text-muted-foreground hover:text-foreground text-[10px] font-bold flex items-center gap-1 cozy-transition cursor-pointer"
                            >
                              <Plus size={11} /> Add Row
                            </button>
                          </div>
                        </div>
                      );
                    case 'list':
                      return (
                        <div key={c.id} className="bg-secondary/15 p-4 rounded-xl border border-border/30 my-2 space-y-2">
                          {editingCompId === c.id ? (
                            <div className="flex items-center gap-1.5 border-b border-border/10 pb-1">
                              <input 
                                type="text"
                                value={editCompTitle}
                                onChange={(e) => setEditCompTitle(e.target.value)}
                                className="px-2 py-0.5 text-[10px] font-bold border border-border bg-card rounded focus:outline-none text-foreground"
                                autoFocus
                              />
                              <button onClick={() => handleSaveCompTitle(s.id, c.id)} className="p-0.5 rounded bg-indigo-500 text-white cursor-pointer"><Check size={10} /></button>
                              <button onClick={() => setEditingCompId(null)} className="p-0.5 rounded border border-border text-muted-foreground cursor-pointer"><X size={10} /></button>
                            </div>
                          ) : (
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/10 pb-1 mb-1 flex items-center justify-between group/comp">
                              <span>{c.title}</span>
                              <button 
                                onClick={() => {
                                  setEditingCompId(c.id);
                                  setEditCompTitle(c.title);
                                }}
                                className="p-0.5 rounded text-muted-foreground/0 group-hover/comp:text-muted-foreground/100 transition-all cursor-pointer"
                              >
                                <Edit3 size={9} />
                              </button>
                            </h4>
                          )}
                          <div className="space-y-2">
                            {c.items?.map((item: any) => (
                              <div key={item.id} className="group/list-item flex items-start justify-between gap-3 text-xs pb-1.5 border-b border-border/10 last:border-0 last:pb-0">
                                {editingItemId === item.id ? (
                                  <div className="space-y-2 flex-1 bg-card/40 p-2.5 rounded-lg border border-border/60 text-left">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-muted-foreground">Title</label>
                                      <input 
                                        type="text" 
                                        value={editItemText}
                                        onChange={(e) => setEditItemText(e.target.value)}
                                        className="w-full px-2 py-0.5 text-xs rounded border border-border bg-card text-foreground"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-muted-foreground">Subtitle</label>
                                      <input 
                                        type="text" 
                                        value={editItemSubtitle}
                                        onChange={(e) => setEditItemSubtitle(e.target.value)}
                                        className="w-full px-2 py-0.5 text-xs rounded border border-border bg-card text-foreground"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-muted-foreground">Tag</label>
                                      <input 
                                        type="text" 
                                        value={editItemTag}
                                        onChange={(e) => setEditItemTag(e.target.value)}
                                        className="w-full px-2 py-0.5 text-xs rounded border border-border bg-card text-foreground"
                                      />
                                    </div>
                                    <div className="flex gap-1.5 justify-end pt-1">
                                      <button 
                                        onClick={() => handleSaveListItem(s.id, c.id, item.id)}
                                        className="px-2 py-0.5 text-[10px] rounded bg-indigo-500 text-white font-bold cursor-pointer"
                                      >
                                        Save
                                      </button>
                                      <button 
                                        onClick={() => setEditingItemId(null)}
                                        className="px-2 py-0.5 text-[10px] rounded border border-border bg-card text-muted-foreground cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="text-left flex-1">
                                      <span className="font-semibold text-foreground">{item.title}</span>
                                      {item.subtitle && <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{item.subtitle}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {item.tag && (
                                        <span 
                                          className="text-[8px] px-1.5 py-0.5 rounded font-bold text-white whitespace-nowrap"
                                          style={{ backgroundColor: item.tagColor || currentApp.color }}
                                        >
                                          {item.tag}
                                        </span>
                                      )}
                                      <div className="flex items-center gap-1 opacity-0 group-hover/list-item:opacity-100 transition-opacity">
                                        <button 
                                          onClick={() => {
                                            setEditingItemId(item.id);
                                            setEditItemText(item.title);
                                            setEditItemSubtitle(item.subtitle || '');
                                            setEditItemTag(item.tag || '');
                                          }}
                                          className="p-0.5 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                                          title="Edit entry"
                                        >
                                          <Edit3 size={11} />
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteListItem(s.id, c.id, item.id)}
                                          className="p-0.5 rounded text-muted-foreground hover:text-red-500 cursor-pointer"
                                          title="Delete entry"
                                        >
                                          <Trash2 size={11} />
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                            {(!c.items || c.items.length === 0) && (
                              <p className="text-[10px] text-muted-foreground italic text-left">No list items logged.</p>
                            )}

                            {/* Add Item Row */}
                            <div className="pt-2 border-t border-border/10 flex items-center gap-2">
                              <input 
                                type="text"
                                placeholder="+ Add item title..."
                                value={newItemInputs[c.id] || ''}
                                onChange={(e) => setNewItemInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddListItem(s.id, c.id);
                                }}
                                className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                              <button 
                                onClick={() => handleAddListItem(s.id, c.id)}
                                className="p-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                                title="Add list item"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    case 'chart':
                      return (
                        <div key={c.id} className="bg-secondary/15 p-4 rounded-xl border border-border/30 my-2 space-y-3">
                          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/10 pb-1">{c.title}</h4>
                          <div className="flex justify-center items-center h-40 w-full">
                            {c.chartType === 'pie' ? (
                              <svg viewBox="0 0 200 200" className="w-32 h-32">
                                {(() => {
                                  const total = c.data?.reduce((a: number, b: number) => a + b, 0) || 1;
                                  let accAngle = 0;
                                  const colors = [currentApp.color, '#38BDF8', '#FB7185', '#FBBF24', '#A78BFA'];
                                  return c.data?.map((val: number, idx: number) => {
                                    const percentage = val / total;
                                    const angle = percentage * 360;
                                    const x1 = 100 + 85 * Math.cos((accAngle - 90) * Math.PI / 180);
                                    const y1 = 100 + 85 * Math.sin((accAngle - 90) * Math.PI / 180);
                                    accAngle += angle;
                                    const x2 = 100 + 85 * Math.cos((accAngle - 90) * Math.PI / 180);
                                    const y2 = 100 + 85 * Math.sin((accAngle - 90) * Math.PI / 180);
                                    const largeArc = angle > 180 ? 1 : 0;
                                    const pathData = `M 100 100 L ${x1} ${y1} A 85 85 0 ${largeArc} 1 ${x2} ${y2} Z`;
                                    return (
                                      <path 
                                        key={idx} 
                                        d={pathData} 
                                        fill={colors[idx % colors.length]} 
                                        className="opacity-80 hover:opacity-100 transition-opacity duration-150 cursor-help"
                                      >
                                        <title>{c.labels[idx]}: {val} ({Math.round(percentage * 100)}%)</title>
                                      </path>
                                    );
                                  });
                                })()}
                                <circle cx="100" cy="100" r="45" fill="var(--color-card)" />
                              </svg>
                            ) : c.chartType === 'bar' ? (
                              <div className="flex items-end justify-around w-full h-full pt-4 px-2">
                                {c.data?.map((val: number, idx: number) => {
                                  const max = Math.max(...c.data, 1);
                                  const heightPercentage = (val / max) * 100;
                                  return (
                                    <div key={idx} className="flex flex-col items-center w-full group">
                                      <span className="text-[8px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150 mb-0.5">{val}</span>
                                      <div 
                                        className="w-4 rounded-t transition-all duration-300"
                                        style={{ 
                                          height: `${Math.max(6, heightPercentage * 0.9)}px`, 
                                          backgroundColor: currentApp.color,
                                          opacity: 0.8
                                        }} 
                                      />
                                      <span className="text-[8px] text-muted-foreground truncate w-full text-center mt-1 max-w-[40px]">{c.labels[idx]}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <svg viewBox="0 0 300 150" className="w-full h-28">
                                {(() => {
                                  const max = Math.max(...c.data, 1);
                                  const points = c.data?.map((val: number, idx: number) => {
                                    const x = (idx / Math.max(c.data.length - 1, 1)) * 260 + 20;
                                    const y = 130 - (val / max) * 100;
                                    return { x, y };
                                  }) || [];
                                  if (points.length === 0) return null;
                                  const pathData = points.map((p: any, idx: number) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                  const fillPathData = `${pathData} L ${points[points.length - 1].x} 130 L ${points[0].x} 130 Z`;
                                  return (
                                    <>
                                      <path d={fillPathData} fill={`${currentApp.color}15`} />
                                      <path d={pathData} fill="none" stroke={currentApp.color} strokeWidth="2.5" strokeLinecap="round" />
                                      {points.map((p: any, idx: number) => (
                                        <circle 
                                          key={idx} 
                                          cx={p.x} 
                                          cy={p.y} 
                                          r="4" 
                                          fill="var(--color-card)" 
                                          stroke={currentApp.color} 
                                          strokeWidth="2" 
                                        >
                                          <title>{c.labels[idx]}: {c.data[idx]}</title>
                                        </circle>
                                      ))}
                                    </>
                                  );
                                })()}
                              </svg>
                            )}
                          </div>
                          {/* Legend */}
                          <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center pt-1.5 text-[8px] text-muted-foreground border-t border-border/10">
                            {c.labels?.map((lbl: string, idx: number) => {
                              const colors = [currentApp.color, '#38BDF8', '#FB7185', '#FBBF24', '#A78BFA'];
                              const dotColor = c.chartType === 'pie' ? colors[idx % colors.length] : currentApp.color;
                              return (
                                <div key={idx} className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
                                  <span>{lbl}: {c.data[idx]}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render sub-screens based on activePage
  const renderView = () => {
    if (activePage.startsWith('app_')) {
      const appId = activePage.replace('app_', '');
      const app = createdApps.find((a: any) => a.id === appId);
      if (!app) {
        return (
          <div className="text-center py-20 bg-card rounded-xl border border-border/50">
            <span className="text-3xl">👀</span>
            <h3 className="font-semibold text-xs mt-3 text-foreground font-sans">Workspace App Not Found</h3>
            <button 
              onClick={() => setActivePage('template-builder')}
              className="mt-4 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 cozy-transition cursor-pointer"
            >
              Back to Builder
            </button>
          </div>
        );
      }
      return renderAppPreview(app);
    }

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
          <AIAssistantPage 
            isDark={isDark} 
            activePage={activePage} 
            setActivePage={setActivePage}
            createdApps={createdApps}
            setCreatedApps={setCreatedApps}
          />
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
            {/* Warning alerts if any */}
            {warningMessage && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle size={15} />
                <span>{warningMessage}</span>
              </div>
            )}

            {/* Header section */}
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 tracking-tight">
                <Cpu size={24} className="text-indigo-500 animate-pulse" /> AI Workspace Template Builder
              </h1>
              <p className="text-xs text-muted-foreground mt-1">Enter a prompt, and AI will construct a custom single-page workspace app containing stateful components, metrics, forms, and charts.</p>
            </div>

            {/* Prompt input card */}
            <div className="bg-card p-5 rounded-2xl border border-border/70 cozy-shadow space-y-4">
              <div className="flex flex-col text-left space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Describe your app idea</label>
                <textarea 
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  placeholder="e.g., A study planner with an assignment checklist, progress metrics, recent course list, and a task logging form..."
                  disabled={isGenerating}
                  className="w-full min-h-[90px] p-3 text-xs rounded-xl border border-border bg-secondary/25 focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none transition-all duration-200"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerateApp();
                    }
                  }}
                />
              </div>

              {/* Suggestions pills */}
              <div className="flex flex-wrap gap-2 pt-1.5 items-center">
                <span className="text-[10px] text-muted-foreground font-semibold mr-1">Suggestions:</span>
                {[
                  { label: "🔥 Habit Tracker", text: "Habit tracker for daily streaks, reading, drinking water, and exercising" },
                  { label: "💰 Budget Tracker", text: "Monthly budget planner with transactions ledger, category chart, and logging form" },
                  { label: "🍲 Meal Planner", text: "Weekly meal calendar schedule with ingredients grocery list checklist and item form" },
                  { label: "📚 Study Planner", text: "Academics study hub with focus metrics, course outlines list, assignments checklists" },
                  { label: "🧭 Travel Itinerary", text: "Vacation travel itinerary timeline list, essentials packing checklist, and packing items form" }
                ].map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPromptValue(sug.text)}
                    disabled={isGenerating}
                    className="text-[10px] px-2.5 py-1 rounded-lg border border-border/80 bg-secondary/35 text-muted-foreground hover:text-foreground hover:bg-secondary cozy-transition cursor-pointer"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>

              {/* Generate button */}
              <div className="flex items-center justify-end border-t border-border/30 pt-3">
                <button
                  onClick={handleGenerateApp}
                  disabled={isGenerating || !promptValue.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-50 disabled:pointer-events-none cozy-transition cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Generating App...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} /> Generate Workspace App
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Generating Loading State */}
            {isGenerating && (
              <div className="bg-card/75 backdrop-blur-sm p-8 rounded-2xl border border-border/80 flex flex-col items-center justify-center space-y-4 cozy-shadow animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-400/20 text-indigo-500">
                  <Loader2 size={24} className="animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-foreground">AI is creating your workspace app</h4>
                  <p className="text-[10px] text-muted-foreground text-center">
                    {loadingStep === 0 && "🔮 Brainstorming workspace blueprints..."}
                    {loadingStep === 1 && "🏗️ Structuring UI sections and components..."}
                    {loadingStep === 2 && "📊 Populating layout with realistic sample data..."}
                    {loadingStep === 3 && "🎨 Injecting theme accents and styling tokens..."}
                    {loadingStep === 4 && "✨ Polishing the interactive workspace..."}
                  </p>
                </div>
                {/* Visual loading bars */}
                <div className="w-48 bg-secondary/50 rounded-full h-1 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${(loadingStep + 1) * 20}%` }} 
                  />
                </div>
              </div>
            )}

            {/* Created Apps Grid section */}
            <div className="space-y-4 text-left">
              <div className="border-b border-border/40 pb-2 flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">My Generated Workspaces</h3>
                <span className="text-[10px] bg-secondary/80 text-muted-foreground px-2 py-0.5 rounded font-bold font-mono">
                  {createdApps.length} App{createdApps.length !== 1 ? 's' : ''}
                </span>
              </div>

              {createdApps.length === 0 ? (
                <div className="bg-card p-10 rounded-2xl border border-dashed border-border/60 text-center space-y-3">
                  <span className="text-3xl block">💡</span>
                  <h4 className="font-bold text-xs text-foreground">No custom workspaces yet</h4>
                  <p className="text-[10px] text-muted-foreground max-w-sm mx-auto">Use the prompt card above to describe your app idea (e.g., Fitness Tracker, Client Project Portal) and build your custom workspace dashboard.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {createdApps.map((app) => {
                    const AppIcon = iconMap[app.icon] || Sparkles;
                    return (
                      <div 
                        key={app.id} 
                        onClick={() => setActivePage(`app_${app.id}`)}
                        className="bg-card p-5 rounded-2xl border border-border/70 hover:border-border-foreground/45 cozy-shadow flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-in fade-in"
                      >
                        <div className="space-y-3 text-left">
                          <div className="flex items-center justify-between">
                            <div 
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                              style={{ backgroundColor: app.color }}
                            >
                              <AppIcon size={16} />
                            </div>
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={(e) => handleTogglePin(app.id, e)}
                                className="p-1 rounded-md border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
                                title={app.pinned ? "Unpin from sidebar" : "Pin to sidebar"}
                              >
                                {app.pinned ? <PinOff size={11} className="text-amber-500" /> : <Pin size={11} />}
                              </button>
                              <button
                                onClick={(e) => handleDeleteApp(app.id, e)}
                                className="p-1 rounded-md border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 cozy-transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors duration-200 flex items-center gap-1">
                              {app.appName}
                              <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 text-muted-foreground" />
                            </h4>
                            <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">{app.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/30 pt-3 mt-4 text-[9px] text-muted-foreground">
                          <span className="font-medium">Created: {new Date(app.createdAt).toLocaleDateString()}</span>
                          <span className="font-bold px-1.5 py-0.5 bg-secondary/80 text-[8px] uppercase tracking-wider rounded font-mono" style={{ color: app.color }}>
                            {app.layout}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
