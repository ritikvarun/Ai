'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Clock, 
  Bell, 
  Inbox, 
  Calendar as CalIcon, 
  X, 
  CheckSquare, 
  Square,
  CalendarDays,
  Menu,
  CalendarRange,
  Info
} from 'lucide-react';

// Task data structure
export interface CalendarTask {
  id: string;
  title: string;
  type: 'task' | 'reminder';
  date: string | null; // YYYY-MM-DD or null for draft
  time?: string; // HH:MM
  category: 'Work' | 'Personal' | 'Meeting' | 'Health' | 'Urgent';
  description?: string;
  createdAt: number;
}

// Category styling metadata
export const CATEGORY_STYLES = {
  Work: {
    label: '💼 Work',
    bg: 'bg-indigo-500/10 dark:bg-indigo-400/10',
    border: 'border-indigo-200 dark:border-indigo-900/50',
    borderLeft: 'border-l-4 border-l-indigo-500',
    text: 'text-indigo-700 dark:text-indigo-300',
    colorHex: '#6366F1'
  },
  Personal: {
    label: '👤 Personal',
    bg: 'bg-amber-500/10 dark:bg-amber-400/10',
    border: 'border-amber-200 dark:border-amber-900/50',
    borderLeft: 'border-l-4 border-l-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    colorHex: '#D97706'
  },
  Meeting: {
    label: '🤝 Meeting',
    bg: 'bg-rose-500/10 dark:bg-rose-400/10',
    border: 'border-rose-200 dark:border-rose-900/50',
    borderLeft: 'border-l-4 border-l-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
    colorHex: '#EF4444'
  },
  Health: {
    label: '🌿 Health',
    bg: 'bg-teal-500/10 dark:bg-teal-400/10',
    border: 'border-teal-200 dark:border-teal-900/50',
    borderLeft: 'border-l-4 border-l-teal-500',
    text: 'text-teal-700 dark:text-teal-300',
    colorHex: '#0D9488'
  },
  Urgent: {
    label: '🚨 Urgent',
    bg: 'bg-pink-500/10 dark:bg-pink-400/10',
    border: 'border-pink-200 dark:border-pink-900/50',
    borderLeft: 'border-l-4 border-l-pink-500',
    text: 'text-pink-700 dark:text-pink-300',
    colorHex: '#EC4899'
  }
};

// Initial Mock Tasks (centered around June 2026 to align with mock database and system clock)
const MOCK_INITIAL_TASKS: CalendarTask[] = [
  {
    id: 'cal-1',
    title: '🚀 Launch Beta v1.1 Plan',
    type: 'task',
    date: '2026-06-22',
    time: '10:00',
    category: 'Work',
    description: 'Verify dashboard responsive alignment with users and test on real devices.',
    createdAt: Date.now() - 300000
  },
  {
    id: 'cal-2',
    title: '🌿 Gym session & stretch routine',
    type: 'reminder',
    date: '2026-06-23',
    time: '08:30',
    category: 'Health',
    description: 'Perform morning core workout and warm stretch.',
    createdAt: Date.now() - 250000
  },
  {
    id: 'cal-3',
    title: '🤝 Sync with AI Agent team',
    type: 'task',
    date: '2026-06-24',
    time: '15:00',
    category: 'Meeting',
    description: 'Discuss Next.js 16 build performance & Drizzle schema design with other agents.',
    createdAt: Date.now() - 200000
  },
  {
    id: 'cal-4',
    title: '🚨 Fix Clerk publishable key error',
    type: 'task',
    date: '2026-06-21',
    time: '09:00',
    category: 'Urgent',
    description: 'Ensure Clerk development server keys are properly set in local env.',
    createdAt: Date.now() - 150000
  },
  {
    id: 'cal-5',
    title: '🎨 Draft: Cozy Theme Guidelines',
    type: 'task',
    date: null,
    category: 'Work',
    description: 'Integrate Sage, Oat & Coral design rules in sidebar.',
    createdAt: Date.now() - 100000
  },
  {
    id: 'cal-6',
    title: '📝 Draft: Readme documentation',
    type: 'task',
    date: null,
    category: 'Personal',
    description: 'Write about AuraFlow architecture.',
    createdAt: Date.now() - 50000
  },
  {
    id: 'cal-7',
    title: '🌿 Buy fresh espresso beans',
    type: 'reminder',
    date: null,
    category: 'Health',
    description: 'Get some organic dark roast beans for the team.',
    createdAt: Date.now()
  }
];

export default function CalendarPage() {
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 5, 21)); // June 2026 default
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-21');
  
  // Quick adds / Searches / Filters
  const [draftSearch, setDraftSearch] = useState('');
  const [quickDraftTitle, setQuickDraftTitle] = useState('');
  
  // Dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CalendarTask | null>(null);
  
  // Responsive sidebar drawer toggle
  const [isDraftPanelOpen, setIsDraftPanelOpen] = useState(true);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<'task' | 'reminder'>('task');
  const [formIsDraft, setFormIsDraft] = useState(false);
  const [formDate, setFormDate] = useState('2026-06-21');
  const [formTime, setFormTime] = useState('');
  const [formCategory, setFormCategory] = useState<'Work' | 'Personal' | 'Meeting' | 'Health' | 'Urgent'>('Work');
  const [formDescription, setFormDescription] = useState('');

  // Drag and Drop active states
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [dragOverDraftPanel, setDragOverDraftPanel] = useState(false);

  // LocalStorage sync
  useEffect(() => {
    const saved = localStorage.getItem('auraflow_calendar_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        setTasks(MOCK_INITIAL_TASKS);
      }
    } else {
      setTasks(MOCK_INITIAL_TASKS);
      localStorage.setItem('auraflow_calendar_tasks', JSON.stringify(MOCK_INITIAL_TASKS));
    }
  }, []);

  const saveTasks = (newTasks: CalendarTask[]) => {
    setTasks(newTasks);
    localStorage.setItem('auraflow_calendar_tasks', JSON.stringify(newTasks));
  };

  // Date math utilities
  const formatDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigation helpers
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    } else {
      // Subtract 7 days
      const newD = new Date(currentDate);
      newD.setDate(newD.getDate() - 7);
      setCurrentDate(newD);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    } else {
      // Add 7 days
      const newD = new Date(currentDate);
      newD.setDate(newD.getDate() + 7);
      setCurrentDate(newD);
    }
  };

  const handleToday = () => {
    const today = new Date(2026, 5, 21); // Set to simulated today June 21, 2026
    setCurrentDate(today);
    setSelectedDate(formatDateKey(today));
  };

  // Month Math: generate grid
  const monthDays = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    // Start index (Monday = 0, Sunday = 6)
    const rawFirstDay = new Date(currentYear, currentMonth, 1).getDay();
    const firstDayIndex = rawFirstDay === 0 ? 6 : rawFirstDay - 1;

    const days = [];
    
    // Trailing days from previous month
    const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, prevMonthTotalDays - i);
      days.push({
        date: d,
        dateStr: formatDateKey(d),
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(currentYear, currentMonth, i);
      days.push({
        date: d,
        dateStr: formatDateKey(d),
        isCurrentMonth: true,
      });
    }

    // Leading days from next month
    const remainingCells = 42 - days.length; // Grid size of 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(currentYear, currentMonth + 1, i);
      days.push({
        date: d,
        dateStr: formatDateKey(d),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Week Math: get 7 days starting Monday
  const weekDays = useMemo(() => {
    const current = new Date(currentDate);
    const day = current.getDay();
    // Calculate difference to last Monday
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        date: d,
        dateStr: formatDateKey(d)
      });
    }
    return days;
  }, [currentDate]);

  // Quick tasks for selected day
  const selectedDayTasks = useMemo(() => {
    return tasks
      .filter(t => t.date === selectedDate)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }, [tasks, selectedDate]);

  // Draft tasks matching search filter
  const filteredDraftTasks = useMemo(() => {
    return tasks.filter(t => 
      t.date === null && 
      (t.title.toLowerCase().includes(draftSearch.toLowerCase()) || 
       (t.description || '').toLowerCase().includes(draftSearch.toLowerCase()))
    );
  }, [tasks, draftSearch]);

  // Open modal pre-configured for a date
  const openCreateModal = (dateStr?: string) => {
    setEditingTask(null);
    setFormTitle('');
    setFormType('task');
    setFormIsDraft(!dateStr);
    setFormDate(dateStr || selectedDate);
    setFormTime('');
    setFormCategory('Work');
    setFormDescription('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (task: CalendarTask, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingTask(task);
    setFormTitle(task.title);
    setFormType(task.type);
    setFormIsDraft(task.date === null);
    setFormDate(task.date || selectedDate);
    setFormTime(task.time || '');
    setFormCategory(task.category);
    setFormDescription(task.description || '');
    setIsModalOpen(true);
  };

  // Close modal and reset
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const taskDate = formIsDraft ? null : formDate;

    if (editingTask) {
      // Edit mode
      const updated = tasks.map(t => 
        t.id === editingTask.id 
          ? {
              ...t,
              title: formTitle,
              type: formType,
              date: taskDate,
              time: formIsDraft ? undefined : formTime || undefined,
              category: formCategory,
              description: formDescription
            }
          : t
      );
      saveTasks(updated);
    } else {
      // Create mode
      const newTask: CalendarTask = {
        id: `cal-t-${Date.now()}`,
        title: formTitle,
        type: formType,
        date: taskDate,
        time: formIsDraft ? undefined : formTime || undefined,
        category: formCategory,
        description: formDescription,
        createdAt: Date.now()
      };
      saveTasks([...tasks, newTask]);
    }
    closeModal();
  };

  // Quick Draft Save
  const handleQuickDraftAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDraftTitle.trim()) return;

    const newDraft: CalendarTask = {
      id: `cal-t-${Date.now()}`,
      title: quickDraftTitle.trim(),
      type: 'task',
      date: null,
      category: 'Work',
      description: 'Quickly drafted task.',
      createdAt: Date.now()
    };

    saveTasks([...tasks, newDraft]);
    setQuickDraftTitle('');
  };

  // Delete task helper
  const handleDeleteTask = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const filtered = tasks.filter(t => t.id !== id);
    saveTasks(filtered);
    if (editingTask?.id === id) {
      closeModal();
    }
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverDate(null);
    setDragOverDraftPanel(false);
  };

  // Drop onto a Date cell
  const handleDropOnDate = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          date: dateStr,
          // Retain time if it has one, or let user schedule it
        };
      }
      return t;
    });

    saveTasks(updated);
    handleDragEnd();
  };

  // Drop onto Draft Panel
  const handleDropOnDraftPanel = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          date: null, // Unschedule to draft
          time: undefined
        };
      }
      return t;
    });

    saveTasks(updated);
    handleDragEnd();
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-112px)] overflow-hidden relative font-sans text-foreground">
      {/* LEFT SECTION: CALENDAR GRID AND VIEWS */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative h-full">
        {/* Calendar control bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
          {/* Title & Month Navigation */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold min-w-[120px] select-none text-foreground leading-none">
              {viewMode === 'month' 
                ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                : `Week of ${weekDays[0].date.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`
              }
            </h1>
            
            <div className="flex items-center bg-card border border-border/80 rounded-lg p-0.5 shadow-sm">
              <button 
                onClick={handlePrev}
                className="p-1 rounded-md hover:bg-secondary cozy-transition text-muted-foreground hover:text-foreground cursor-pointer"
                title="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleToday}
                className="px-2.5 py-0.5 text-xs font-semibold rounded-md hover:bg-secondary cozy-transition text-foreground cursor-pointer select-none"
              >
                Today
              </button>
              <button 
                onClick={handleNext}
                className="p-1 rounded-md hover:bg-secondary cozy-transition text-muted-foreground hover:text-foreground cursor-pointer"
                title="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Controls: Month/Week mode, Draft panel toggler, Add task */}
          <div className="flex items-center gap-2">
            {/* View Mode selection */}
            <div className="flex items-center bg-secondary/50 border border-border/40 p-0.5 rounded-lg">
              <button 
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-md text-xs font-medium cozy-transition cursor-pointer flex items-center gap-1 select-none ${
                  viewMode === 'month' 
                    ? 'bg-card text-foreground shadow-sm font-semibold border border-border/40' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <CalendarDays size={12} /> Month
              </button>
              <button 
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-md text-xs font-medium cozy-transition cursor-pointer flex items-center gap-1 select-none ${
                  viewMode === 'week' 
                    ? 'bg-card text-foreground shadow-sm font-semibold border border-border/40' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <CalendarRange size={12} /> Week
              </button>
            </div>

            {/* Toggle Draft Sidebar (Visible on mobile, collapsible on desktop) */}
            <button 
              onClick={() => setIsDraftPanelOpen(!isDraftPanelOpen)}
              className={`p-1.5 rounded-lg border cozy-transition cursor-pointer shadow-sm relative ${
                isDraftPanelOpen 
                  ? 'bg-amber-500/10 border-amber-300 text-amber-600 dark:text-amber-400' 
                  : 'bg-card border-border hover:bg-secondary text-muted-foreground'
              }`}
              title="Toggle Draft Sidebar"
            >
              <Inbox size={15} />
              {tasks.filter(t => t.date === null).length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </button>

            {/* Add Task Button */}
            <button 
              onClick={() => openCreateModal()}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cozy-transition cursor-pointer select-none"
            >
              <Plus size={14} /> Add Event
            </button>
          </div>
        </div>

        {/* CALENDAR BODY */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1 min-h-0">
          
          {/* ============================================================== */}
          {/* MONTH VIEW                                                     */}
          {/* ============================================================== */}
          {viewMode === 'month' && (
            <div className="flex flex-col h-full min-h-[460px]">
              {/* Day names row */}
              <div className="grid grid-cols-7 border-b border-border/40 pb-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 grid-rows-6 flex-1 gap-1.5 mt-1.5 min-h-[420px]">
                {monthDays.map(({ date, dateStr, isCurrentMonth }) => {
                  const dayTasks = tasks.filter(t => t.date === dateStr);
                  const isToday = formatDateKey(new Date(2026, 5, 21)) === dateStr;
                  const isSelected = selectedDate === dateStr;
                  const isOver = dragOverDate === dateStr;

                  return (
                    <div 
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      onDoubleClick={() => openCreateModal(dateStr)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverDate !== dateStr) setDragOverDate(dateStr);
                      }}
                      onDragLeave={() => {
                        if (dragOverDate === dateStr) setDragOverDate(null);
                      }}
                      onDrop={(e) => handleDropOnDate(e, dateStr)}
                      className={`relative flex flex-col p-2 bg-card rounded-xl border cozy-transition group select-none min-h-[70px] ${
                        isCurrentMonth 
                          ? 'border-border/60 hover:border-border-cozy text-foreground' 
                          : 'border-border/30 opacity-40 text-muted-foreground'
                      } ${isSelected ? 'ring-2 ring-amber-500/40 border-amber-500 dark:border-amber-400 bg-amber-500/[0.01]' : ''} ${
                        isToday ? 'bg-orange-500/[0.03] border-orange-300 dark:border-orange-900/60' : ''
                      } ${isOver ? 'bg-secondary/70 border-dashed border-primary shadow-inner scale-[0.99]' : ''}`}
                    >
                      {/* Cell Header */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full leading-none ${
                          isToday 
                            ? 'bg-orange-500 text-white shadow-sm font-black' 
                            : isSelected 
                              ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                              : 'text-foreground/80'
                        }`}>
                          {date.getDate()}
                        </span>
                        
                        {/* Hover Quick-Add icon */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCreateModal(dateStr);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-secondary cozy-transition text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Quick add task for this date"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Cell Tasks List */}
                      <div className="flex-1 mt-1 space-y-1 overflow-y-auto max-h-[70px] pr-0.5 scrollbar-thin">
                        {dayTasks.map(task => {
                          const style = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.Work;
                          const isTaskDragged = draggedTaskId === task.id;

                          return (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, task.id)}
                              onDragEnd={handleDragEnd}
                              onClick={(e) => openEditModal(task, e)}
                              className={`p-1 text-[9px] font-semibold rounded border cursor-grab active:cursor-grabbing leading-snug truncate flex items-center gap-1 transition-all duration-200 hover:-translate-y-[0.5px] hover:shadow-sm ${
                                style.bg
                              } ${style.border} ${style.text} ${
                                isTaskDragged ? 'opacity-30 scale-95 border-dashed' : ''
                              }`}
                              title={`${task.title} (${task.category})`}
                            >
                              {task.type === 'reminder' ? (
                                <Bell size={8} className="flex-shrink-0 opacity-80" />
                              ) : (
                                <Square size={8} className="flex-shrink-0 opacity-80" />
                              )}
                              <span className="truncate flex-1">
                                {task.time ? `${task.time} ` : ''}{task.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* WEEK VIEW                                                      */}
          {/* ============================================================== */}
          {viewMode === 'week' && (
            <div className="flex flex-col h-full min-h-[460px]">
              {/* Day Columns */}
              <div className="grid grid-cols-7 flex-1 gap-3 min-h-[420px]">
                {weekDays.map(({ date, dateStr }) => {
                  const dayTasks = tasks
                    .filter(t => t.date === dateStr)
                    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
                  const isToday = formatDateKey(new Date(2026, 5, 21)) === dateStr;
                  const isSelected = selectedDate === dateStr;
                  const isOver = dragOverDate === dateStr;
                  
                  const dayName = date.toLocaleDateString('default', { weekday: 'short' });

                  return (
                    <div
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverDate !== dateStr) setDragOverDate(dateStr);
                      }}
                      onDragLeave={() => {
                        if (dragOverDate === dateStr) setDragOverDate(null);
                      }}
                      onDrop={(e) => handleDropOnDate(e, dateStr)}
                      className={`flex flex-col bg-card rounded-2xl border p-3 cozy-transition select-none min-h-[380px] ${
                        isSelected 
                          ? 'border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/10' 
                          : 'border-border/60 hover:border-border-cozy'
                      } ${isToday ? 'bg-orange-500/[0.02] border-orange-300 dark:border-orange-950/40' : ''} ${
                        isOver ? 'bg-secondary/70 border-dashed border-primary shadow-inner scale-[0.99]' : ''
                      }`}
                    >
                      {/* Column Header */}
                      <div className="flex flex-col items-center pb-2 border-b border-border/40 mb-3 text-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{dayName}</span>
                        <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full mt-1 ${
                          isToday 
                            ? 'bg-orange-500 text-white shadow-sm font-black' 
                            : isSelected 
                              ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                              : 'text-foreground'
                        }`}>
                          {date.getDate()}
                        </span>
                      </div>

                      {/* Column Content */}
                      <div className="flex-1 space-y-2 overflow-y-auto max-h-[360px] pr-0.5 scrollbar-thin">
                        {dayTasks.map(task => {
                          const style = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.Work;
                          const isTaskDragged = draggedTaskId === task.id;

                          return (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, task.id)}
                              onDragEnd={handleDragEnd}
                              onClick={(e) => openEditModal(task, e)}
                              className={`p-2.5 rounded-xl border cursor-grab active:cursor-grabbing text-left transition-all duration-200 group relative hover:-translate-y-[1px] hover:shadow-md ${
                                style.bg
                              } ${style.border} ${style.borderLeft} ${
                                isTaskDragged ? 'opacity-30 scale-95 border-dashed' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider border bg-card/65 font-mono ${style.text} ${style.border}`}>
                                  {task.category}
                                </span>
                                
                                {task.time && (
                                  <span className="text-[9px] font-semibold text-muted-foreground flex items-center gap-0.5 font-mono">
                                    <Clock size={8} /> {task.time}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-[11px] font-bold text-foreground mt-1.5 leading-snug truncate">
                                {task.title}
                              </h4>

                              {task.description && (
                                <p className="text-[9px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                  {task.description}
                                </p>
                              )}

                              {/* Task / Reminder Indicator bottom */}
                              <div className="mt-2.5 pt-1.5 border-t border-border/20 flex justify-between items-center text-[8px] text-muted-foreground/80">
                                <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                                  {task.type === 'reminder' ? (
                                    <><Bell size={8} className="text-amber-500" /> Reminder</>
                                  ) : (
                                    <><CheckSquare size={8} className="text-indigo-500" /> Task</>
                                  )}
                                </span>
                                
                                <button
                                  onClick={(e) => handleDeleteTask(task.id, e)}
                                  className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-red-500 cozy-transition cursor-pointer"
                                  title="Delete event"
                                >
                                  <Trash2 size={9} />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {dayTasks.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border/30 rounded-xl opacity-60">
                            <span className="text-xs">🏜️</span>
                            <span className="text-[9px] text-muted-foreground mt-1 select-none">Empty day</span>
                          </div>
                        )}
                      </div>

                      {/* Add Button at Column Bottom */}
                      <button
                        onClick={() => openCreateModal(dateStr)}
                        className="mt-3 py-1.5 rounded-lg border border-dashed border-border hover:border-muted-foreground/30 hover:bg-secondary text-[10px] font-bold text-muted-foreground hover:text-foreground cozy-transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Plus size={10} /> Add Item
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Selected Date Quick Actions / Agenda Detail Footer */}
        <div className="mt-4 p-3.5 bg-card border border-border/60 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <CalIcon size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Selected Date agenda</span>
              <h3 className="text-xs font-bold text-foreground">
                {new Date(selectedDate.replace(/-/g, '/')).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
              {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'Event' : 'Events'}
            </span>
            <div className="w-px h-4 bg-border/60 mx-1" />
            <button 
              onClick={() => openCreateModal(selectedDate)}
              className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 cozy-transition cursor-pointer"
            >
              <Plus size={12} /> Quick Add Here
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT SIDEBAR: DRAFT PANEL                                     */}
      {/* ============================================================== */}
      {isDraftPanelOpen && (
        <aside 
          onDragOver={(e) => {
            e.preventDefault();
            if (!dragOverDraftPanel) setDragOverDraftPanel(true);
          }}
          onDragLeave={() => {
            if (dragOverDraftPanel) setDragOverDraftPanel(false);
          }}
          onDrop={handleDropOnDraftPanel}
          className={`w-76 border-l border-border/70 bg-card/45 backdrop-blur-md flex flex-col flex-shrink-0 h-full cozy-transition ${
            dragOverDraftPanel ? 'bg-secondary border-dashed border-amber-500' : ''
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox size={16} className="text-amber-500" />
              <h2 className="text-xs font-bold tracking-tight text-foreground select-none uppercase">Draft Panel</h2>
              <span className="text-[9px] font-bold bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded-full">
                {tasks.filter(t => t.date === null).length}
              </span>
            </div>
            
            <button 
              onClick={() => setIsDraftPanelOpen(false)}
              className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Quick Add Draft input */}
          <form onSubmit={handleQuickDraftAdd} className="p-3 border-b border-border/40 flex items-center gap-2">
            <input 
              type="text" 
              value={quickDraftTitle}
              onChange={(e) => setQuickDraftTitle(e.target.value)}
              placeholder="Quick draft title..."
              className="flex-1 px-3 py-1.5 text-[11px] rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-amber-500 text-foreground"
            />
            <button 
              type="submit"
              className="p-1.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-white cozy-transition cursor-pointer"
              title="Add draft card"
            >
              <Plus size={12} />
            </button>
          </form>

          {/* Search Drafts */}
          <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2 relative bg-secondary/10">
            <Search size={11} className="text-muted-foreground absolute left-5.5" />
            <input 
              type="text" 
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              placeholder="Search drafts..."
              className="w-full pl-7 pr-3 py-1 text-[10px] rounded-md border border-border/60 bg-card focus:outline-none focus:ring-1 focus:ring-amber-500 text-foreground"
            />
          </div>

          {/* Scrollable Draft List */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 min-h-0">
            
            {/* Guide alert box */}
            <div className="p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/30 bg-amber-500/[0.02] text-[9px] text-muted-foreground leading-relaxed flex items-start gap-2 select-none">
              <Info size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Drag and drop</strong> draft items directly onto any calendar cell to schedule them. Drag scheduled items back here to unschedule.
              </span>
            </div>

            {filteredDraftTasks.map(task => {
              const style = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.Work;
              const isTaskDragged = draggedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => openEditModal(task, e)}
                  className={`p-3 rounded-xl border bg-card cursor-grab active:cursor-grabbing text-left transition-all duration-200 group relative hover:-translate-y-[1px] hover:shadow-md ${
                    style.borderLeft
                  } ${
                    isTaskDragged ? 'opacity-30 scale-95 border-dashed border-amber-400 bg-secondary' : 'border-border/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider border bg-card/65 font-mono ${style.text} ${style.border}`}>
                      {task.category}
                    </span>
                    
                    <button
                      onClick={(e) => handleDeleteTask(task.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-red-500 cozy-transition cursor-pointer"
                      title="Delete draft"
                    >
                      <Trash2 size={9} />
                    </button>
                  </div>

                  <h4 className="text-[10px] font-bold text-foreground mt-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {task.title}
                  </h4>

                  {task.description && (
                    <p className="text-[9px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed font-medium">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-2.5 pt-2 border-t border-border/20 flex justify-between items-center text-[8px] text-muted-foreground/80">
                    <span className="font-mono">Draft item</span>
                    <span className="font-semibold text-amber-500 uppercase tracking-widest text-[7px] bg-amber-500/5 px-1 rounded border border-amber-500/10">
                      Unscheduled
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredDraftTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/40 rounded-2xl select-none">
                <span className="text-xl">🏜️</span>
                <span className="text-[10px] text-muted-foreground mt-2">No draft items found</span>
                <span className="text-[9px] text-muted-foreground/75 mt-1 leading-normal px-4">
                  Add draft cards above or drag event cards here.
                </span>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* ============================================================== */}
      {/* DIALOG MODAL: CREATE OR EDIT EVENT                             */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 z-50"
          onClick={closeModal}
        >
          {/* Modal Card */}
          <div 
            className="bg-card rounded-2xl border border-border max-w-md w-full p-5 space-y-4 shadow-xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                  <CalIcon size={14} />
                </div>
                <h3 className="font-bold text-sm text-foreground">
                  {editingTask ? 'Edit Event Properties' : 'Create New Event'}
                </h3>
              </div>
              <button 
                onClick={closeModal}
                className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Type Switcher */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Event Type</label>
                <div className="grid grid-cols-2 gap-2 bg-secondary/40 p-0.5 rounded-lg border border-border/50">
                  <button
                    type="button"
                    onClick={() => setFormType('task')}
                    className={`py-1.5 rounded-md text-xs font-semibold cozy-transition cursor-pointer select-none ${
                      formType === 'task' 
                        ? 'bg-card text-foreground shadow-sm border border-border/30' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Task Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('reminder')}
                    className={`py-1.5 rounded-md text-xs font-semibold cozy-transition cursor-pointer select-none ${
                      formType === 'reminder' 
                        ? 'bg-card text-foreground shadow-sm border border-border/30' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Reminder
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Title</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Code Review with Antigravity"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-secondary/15 focus:outline-none focus:ring-1 focus:ring-amber-500 text-foreground"
                />
              </div>

              {/* Schedule / Draft toggle */}
              <div className="flex items-center justify-between py-1 bg-secondary/10 px-3 rounded-lg border border-border/40">
                <span className="text-xs font-bold text-foreground">Draft mode (schedule later)</span>
                <input 
                  type="checkbox" 
                  checked={formIsDraft}
                  onChange={(e) => setFormIsDraft(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-secondary/20 cursor-pointer accent-amber-500"
                />
              </div>

              {/* Date & Time (Conditional) */}
              {!formIsDraft && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Date</label>
                    <input 
                      type="date" 
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-secondary/15 focus:outline-none text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Time (Optional)</label>
                    <input 
                      type="time" 
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-secondary/15 focus:outline-none text-foreground"
                    />
                  </div>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Category</label>
                <select 
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-card focus:outline-none text-foreground"
                >
                  <option value="Work">💼 Work (Indigo Accent)</option>
                  <option value="Personal">👤 Personal (Amber Accent)</option>
                  <option value="Meeting">🤝 Meeting (Coral Accent)</option>
                  <option value="Health">🌿 Health & Wellness (Teal Accent)</option>
                  <option value="Urgent">🚨 Urgent Alerts (Pink Accent)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Description</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Include any contextual guidelines or checklist items..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-secondary/15 focus:outline-none focus:ring-1 focus:ring-amber-500 text-foreground resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2.5 border-t border-border/55">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(editingTask.id)}
                    className="px-3.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold text-xs flex items-center gap-1.5 cozy-transition cursor-pointer select-none"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                ) : (
                  <div />
                )}
                
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary cozy-transition cursor-pointer select-none"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-semibold text-xs cozy-transition shadow-sm cursor-pointer select-none"
                  >
                    {editingTask ? 'Save Changes' : 'Create Event'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
