'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar as CalendarIcon, 
  FileText, 
  ChevronRight, 
  Info, 
  Check, 
  Tag, 
  Clock, 
  Sparkles,
  MoreVertical,
  X,
  PlusCircle,
  Folder,
  Layers,
  ArrowRightLeft,
  CalendarDays,
  StickyNote
} from 'lucide-react';

// Interfaces for our Kanban Board System
export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  priority: 'Low' | 'Medium' | 'High';
  labels: string[]; // e.g. ['Design', 'Engineering', 'Marketing', 'Research', 'Urgent']
  syncCalendar: boolean;
  syncNotes: boolean;
}

export interface KanbanColumn {
  id: string;
  name: string;
  tasks: KanbanTask[];
}

export interface KanbanBoard {
  id: string;
  name: string;
  color: string; // Hex color matching the board's accent tone
  columns: KanbanColumn[];
}

// Predefined Board Accent Colors
export const BOARD_COLORS = [
  { name: 'Indigo', hex: '#6366F1', bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400' },
  { name: 'Emerald', hex: '#10B981', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Amber', hex: '#D97706', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  { name: 'Rose', hex: '#EC4899', bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' },
  { name: 'Coral', hex: '#EF4444', bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
  { name: 'Teal', hex: '#0D9488', bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400' },
  { name: 'Violet', hex: '#8B5CF6', bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400' }
];

// Predefined labels
export const PREDEFINED_LABELS = [
  { name: 'Design', hex: '#6366F1', bg: 'bg-indigo-500/10 border-indigo-200 text-indigo-700 dark:text-indigo-300' },
  { name: 'Engineering', hex: '#0D9488', bg: 'bg-teal-500/10 border-teal-200 text-teal-700 dark:text-teal-300' },
  { name: 'Marketing', hex: '#EC4899', bg: 'bg-rose-500/10 border-rose-200 text-rose-700 dark:text-rose-300' },
  { name: 'Research', hex: '#D97706', bg: 'bg-amber-500/10 border-amber-200 text-amber-700 dark:text-amber-300' },
  { name: 'Urgent', hex: '#EF4444', bg: 'bg-red-500/10 border-red-200 text-red-700 dark:text-red-300' }
];

const MOCK_INITIAL_BOARDS: KanbanBoard[] = [
  {
    id: 'board-1',
    name: '🚀 Product Launch Sprint',
    color: '#6366F1',
    columns: [
      {
        id: 'col-1',
        name: 'Todo',
        tasks: [
          {
            id: 't-1',
            title: 'Design high-fidelity mockups',
            description: 'Create cozy Figma dashboards with pastel highlights and responsive side panels.',
            dueDate: '2026-06-25',
            priority: 'High',
            labels: ['Design', 'Marketing'],
            syncCalendar: false,
            syncNotes: false
          },
          {
            id: 't-2',
            title: 'Set up database schemas',
            description: 'Define drizzle tables for boards, columns, tasks, and notes.',
            dueDate: '2026-06-28',
            priority: 'Medium',
            labels: ['Engineering'],
            syncCalendar: false,
            syncNotes: false
          }
        ]
      },
      {
        id: 'col-2',
        name: 'In Progress',
        tasks: [
          {
            id: 't-3',
            title: 'Implement drag-and-drop mechanics',
            description: 'Write custom HTML5 event handlers for dragging task cards and column targets.',
            dueDate: '2026-06-21',
            priority: 'High',
            labels: ['Engineering', 'Design'],
            syncCalendar: true,
            syncNotes: true
          }
        ]
      },
      {
        id: 'col-3',
        name: 'Done',
        tasks: [
          {
            id: 't-4',
            title: 'AuraFlow sidebar layout',
            description: 'Complete cozy design system guidelines inside theme.md and sidebar animations.',
            dueDate: '2026-06-20',
            priority: 'Low',
            labels: ['Design'],
            syncCalendar: false,
            syncNotes: false
          }
        ]
      }
    ]
  },
  {
    id: 'board-2',
    name: '🎨 Marketing Campaign',
    color: '#EC4899',
    columns: [
      {
        id: 'col-4',
        name: 'Todo',
        tasks: [
          {
            id: 't-5',
            title: 'Draft landing copy',
            description: 'Outline the cozy and fresh aesthetic coordinates between Miro boards and Notion text docs.',
            dueDate: '2026-06-26',
            priority: 'Medium',
            labels: ['Marketing'],
            syncCalendar: false,
            syncNotes: false
          }
        ]
      },
      {
        id: 'col-5',
        name: 'In Progress',
        tasks: []
      },
      {
        id: 'col-6',
        name: 'Done',
        tasks: []
      }
    ]
  }
];

export default function KanbanPage() {
  const [boards, setBoards] = useState<KanbanBoard[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  
  // Board Creator Modal
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [boardFormName, setBoardFormName] = useState('');
  const [boardFormColor, setBoardFormColor] = useState('#6366F1');
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);

  // Column Creator / Editor Inline States
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editingColName, setEditingColName] = useState('');
  const [newColName, setNewColName] = useState('');
  const [isAddingCol, setIsAddingCol] = useState(false);

  // Task Modal (Create & Edit)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  // Task Form State
  const [taskFormTitle, setTaskFormTitle] = useState('');
  const [taskFormDescription, setTaskFormDescription] = useState('');
  const [taskFormDueDate, setTaskFormDueDate] = useState('2026-06-21'); // Defaults to June 21, 2026
  const [taskFormPriority, setTaskFormPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [taskFormLabels, setTaskFormLabels] = useState<string[]>([]);
  const [taskFormSyncCalendar, setTaskFormSyncCalendar] = useState(false);
  const [taskFormSyncNotes, setTaskFormSyncNotes] = useState(false);

  // Drag-and-drop Visual Feedback State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedSourceColId, setDraggedSourceColId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  // Load Boards from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('auraflow_kanban_boards');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBoards(parsed);
        if (parsed.length > 0) {
          setSelectedBoardId(parsed[0].id);
        }
      } catch (e) {
        setBoards(MOCK_INITIAL_BOARDS);
        localStorage.setItem('auraflow_kanban_boards', JSON.stringify(MOCK_INITIAL_BOARDS));
        setSelectedBoardId(MOCK_INITIAL_BOARDS[0].id);
      }
    } else {
      setBoards(MOCK_INITIAL_BOARDS);
      localStorage.setItem('auraflow_kanban_boards', JSON.stringify(MOCK_INITIAL_BOARDS));
      setSelectedBoardId(MOCK_INITIAL_BOARDS[0].id);
      
      // Perform initial calendar sync for pre-synced mock tasks
      syncPreInitialTasksToCalendar(MOCK_INITIAL_BOARDS);
    }
  }, []);

  const saveBoards = (newBoards: KanbanBoard[]) => {
    setBoards(newBoards);
    localStorage.setItem('auraflow_kanban_boards', JSON.stringify(newBoards));
  };

  // Helper to sync default initial tasks to Calendar on first load
  const syncPreInitialTasksToCalendar = (initialBoards: KanbanBoard[]) => {
    try {
      const calendarSaved = localStorage.getItem('auraflow_calendar_tasks');
      let calendarTasks = [];
      if (calendarSaved) {
        calendarTasks = JSON.parse(calendarSaved);
      }
      
      let updated = [...calendarTasks];
      let needsSave = false;

      initialBoards.forEach(board => {
        board.columns.forEach(col => {
          col.tasks.forEach(task => {
            if (task.syncCalendar) {
              const calTaskId = `kanban-${task.id}`;
              if (!updated.some((t: any) => t.id === calTaskId)) {
                updated.push({
                  id: calTaskId,
                  title: task.title,
                  type: 'task',
                  date: task.dueDate,
                  category: task.priority === 'High' ? 'Urgent' : 'Work',
                  description: task.description,
                  createdAt: Date.now()
                });
                needsSave = true;
              }
            }
          });
        });
      });

      if (needsSave) {
        localStorage.setItem('auraflow_calendar_tasks', JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed to sync initial tasks to calendar', e);
    }
  };

  // Find the currently selected board object
  const activeBoard = boards.find(b => b.id === selectedBoardId);

  // Sync tasks with Calendar
  const syncToCalendar = (task: KanbanTask, isDeleted: boolean = false) => {
    try {
      const saved = localStorage.getItem('auraflow_calendar_tasks');
      let calendarTasks = [];
      if (saved) {
        calendarTasks = JSON.parse(saved);
      }

      const calTaskId = `kanban-${task.id}`;
      // Filter out existing synced copy
      calendarTasks = calendarTasks.filter((t: any) => t.id !== calTaskId);

      // Re-add if it's not a deletion and sync option is checked
      if (!isDeleted && task.syncCalendar) {
        calendarTasks.push({
          id: calTaskId,
          title: task.title,
          type: 'task',
          date: task.dueDate || '2026-06-21',
          category: task.priority === 'High' ? 'Urgent' : 'Work',
          description: task.description,
          createdAt: Date.now()
        });
      }

      localStorage.setItem('auraflow_calendar_tasks', JSON.stringify(calendarTasks));
      
      // Dispatch storage event to update other pages immediately
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error syncing task with calendar:', e);
    }
  };

  // Sync tasks with Notes
  const syncToNotes = (task: KanbanTask, columnName: string, isDeleted: boolean = false) => {
    try {
      const saved = localStorage.getItem('auraflow_notes');
      let notes = [];
      if (saved) {
        notes = JSON.parse(saved);
      }

      const noteId = `kanban-${task.id}`;
      // Filter out existing linked note
      notes = notes.filter((n: any) => n.id !== noteId);

      // Re-add if it's not a deletion and sync notes is checked
      if (!isDeleted && task.syncNotes) {
        const labelsStr = task.labels.length > 0 ? task.labels.join(', ') : 'None';
        notes.push({
          id: noteId,
          title: `📝 [Task] ${task.title}`,
          content: `# 📝 Synced Task: ${task.title}\n*Linked from Kanban Board column: **${columnName}***\n\n**Priority:** ${task.priority}\n**Due Date:** ${task.dueDate}\n**Labels:** ${labelsStr}\n\n### Description\n${task.description || '*No description provided.*'}\n\n---\n*Note: Title and description changes will sync here dynamically.*`,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }

      localStorage.setItem('auraflow_notes', JSON.stringify(notes));
      
      // Dispatch storage event to update other pages immediately
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error syncing task with notes:', e);
    }
  };

  // Board CRUD Operations
  const handleCreateOrEditBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardFormName.trim()) return;

    if (editingBoardId) {
      // Edit Board Details
      const updated = boards.map(b => b.id === editingBoardId ? { ...b, name: boardFormName.trim(), color: boardFormColor } : b);
      saveBoards(updated);
    } else {
      // Create Brand New Board
      const newBoardId = `board-${Date.now()}`;
      const newBoard: KanbanBoard = {
        id: newBoardId,
        name: boardFormName.trim(),
        color: boardFormColor,
        columns: [
          { id: `col-${Date.now()}-1`, name: 'Todo', tasks: [] },
          { id: `col-${Date.now()}-2`, name: 'In Progress', tasks: [] },
          { id: `col-${Date.now()}-3`, name: 'Done', tasks: [] }
        ]
      };
      const updated = [...boards, newBoard];
      saveBoards(updated);
      setSelectedBoardId(newBoardId);
    }

    setIsBoardModalOpen(false);
    setBoardFormName('');
    setEditingBoardId(null);
  };

  const handleDeleteBoard = (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this board and all its tasks?')) {
      const filtered = boards.filter(b => b.id !== boardId);
      
      // Clean up synced items
      const targetBoard = boards.find(b => b.id === boardId);
      if (targetBoard) {
        targetBoard.columns.forEach(col => {
          col.tasks.forEach(task => {
            syncToCalendar(task, true);
            syncToNotes(task, col.name, true);
          });
        });
      }

      saveBoards(filtered);
      if (selectedBoardId === boardId && filtered.length > 0) {
        setSelectedBoardId(filtered[0].id);
      } else if (filtered.length === 0) {
        setSelectedBoardId('');
      }
    }
  };

  const openCreateBoardModal = () => {
    setEditingBoardId(null);
    setBoardFormName('');
    setBoardFormColor('#6366F1');
    setIsBoardModalOpen(true);
  };

  const openEditBoardModal = (board: KanbanBoard, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBoardId(board.id);
    setBoardFormName(board.name);
    setBoardFormColor(board.color);
    setIsBoardModalOpen(true);
  };

  // Columns CRUD Operations
  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim() || !activeBoard) return;
    if (activeBoard.columns.length >= 5) {
      alert('Maximum of 5 columns are allowed per board!');
      return;
    }

    const newColumn: KanbanColumn = {
      id: `col-${Date.now()}`,
      name: newColName.trim(),
      tasks: []
    };

    const updatedBoards = boards.map(b => {
      if (b.id === activeBoard.id) {
        return {
          ...b,
          columns: [...b.columns, newColumn]
        };
      }
      return b;
    });

    saveBoards(updatedBoards);
    setNewColName('');
    setIsAddingCol(false);
  };

  const handleDeleteColumn = (colId: string) => {
    if (!activeBoard) return;
    if (confirm('Are you sure you want to delete this column and all its tasks?')) {
      // Clean up synced events
      const targetCol = activeBoard.columns.find(c => c.id === colId);
      if (targetCol) {
        targetCol.tasks.forEach(task => {
          syncToCalendar(task, true);
          syncToNotes(task, targetCol.name, true);
        });
      }

      const updatedColumns = activeBoard.columns.filter(c => c.id !== colId);
      const updatedBoards = boards.map(b => b.id === activeBoard.id ? { ...b, columns: updatedColumns } : b);
      saveBoards(updatedBoards);
    }
  };

  const startRenameColumn = (colId: string, currentName: string) => {
    setEditingColId(colId);
    setEditingColName(currentName);
  };

  const handleRenameColumn = (colId: string) => {
    if (!editingColName.trim() || !activeBoard) return;

    const updatedColumns = activeBoard.columns.map(c => c.id === colId ? { ...c, name: editingColName.trim() } : c);
    const updatedBoards = boards.map(b => b.id === activeBoard.id ? { ...b, columns: updatedColumns } : b);
    saveBoards(updatedBoards);
    setEditingColId(null);
  };

  // Task Dialog Operations
  const openCreateTaskModal = (colId: string) => {
    setTargetColumnId(colId);
    setEditingTaskId(null);
    setTaskFormTitle('');
    setTaskFormDescription('');
    setTaskFormDueDate('2026-06-21');
    setTaskFormPriority('Medium');
    setTaskFormLabels([]);
    setTaskFormSyncCalendar(false);
    setTaskFormSyncNotes(false);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: KanbanTask, colId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetColumnId(colId);
    setEditingTaskId(task.id);
    setTaskFormTitle(task.title);
    setTaskFormDescription(task.description);
    setTaskFormDueDate(task.dueDate);
    setTaskFormPriority(task.priority);
    setTaskFormLabels(task.labels);
    setTaskFormSyncCalendar(task.syncCalendar);
    setTaskFormSyncNotes(task.syncNotes);
    setIsTaskModalOpen(true);
  };

  const handleCreateOrEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskFormTitle.trim() || !activeBoard) return;

    const col = activeBoard.columns.find(c => c.id === targetColumnId);
    if (!col) return;

    if (editingTaskId) {
      // Edit mode
      const updatedBoards = boards.map(b => {
        if (b.id === activeBoard.id) {
          const updatedColumns = b.columns.map(c => {
            const updatedTasks = c.tasks.map(t => {
              if (t.id === editingTaskId) {
                const updatedTask: KanbanTask = {
                  ...t,
                  title: taskFormTitle.trim(),
                  description: taskFormDescription.trim(),
                  dueDate: taskFormDueDate,
                  priority: taskFormPriority,
                  labels: taskFormLabels,
                  syncCalendar: taskFormSyncCalendar,
                  syncNotes: taskFormSyncNotes
                };
                
                // Trigger live synchronization
                syncToCalendar(updatedTask);
                syncToNotes(updatedTask, c.name);

                return updatedTask;
              }
              return t;
            });
            return { ...c, tasks: updatedTasks };
          });
          return { ...b, columns: updatedColumns };
        }
        return b;
      });

      saveBoards(updatedBoards);
    } else {
      // Create mode
      const newTask: KanbanTask = {
        id: `t-${Date.now()}`,
        title: taskFormTitle.trim(),
        description: taskFormDescription.trim(),
        dueDate: taskFormDueDate,
        priority: taskFormPriority,
        labels: taskFormLabels,
        syncCalendar: taskFormSyncCalendar,
        syncNotes: taskFormSyncNotes
      };

      const updatedBoards = boards.map(b => {
        if (b.id === activeBoard.id) {
          const updatedColumns = b.columns.map(c => {
            if (c.id === targetColumnId) {
              return {
                ...c,
                tasks: [...c.tasks, newTask]
              };
            }
            return c;
          });
          return { ...b, columns: updatedColumns };
        }
        return b;
      });

      saveBoards(updatedBoards);

      // Perform initial sync
      syncToCalendar(newTask);
      syncToNotes(newTask, col.name);
    }

    setIsTaskModalOpen(false);
    setEditingTaskId(null);
  };

  const handleDeleteTask = (taskId: string, colId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!activeBoard) return;
    if (confirm('Are you sure you want to delete this task?')) {
      const col = activeBoard.columns.find(c => c.id === colId);
      const taskToDelete = col?.tasks.find(t => t.id === taskId);
      
      if (taskToDelete) {
        syncToCalendar(taskToDelete, true);
        syncToNotes(taskToDelete, col?.name || '', true);
      }

      const updatedBoards = boards.map(b => {
        if (b.id === activeBoard.id) {
          const updatedColumns = b.columns.map(c => {
            if (c.id === colId) {
              return {
                ...c,
                tasks: c.tasks.filter(t => t.id !== taskId)
              };
            }
            return c;
          });
          return { ...b, columns: updatedColumns };
        }
        return b;
      });

      saveBoards(updatedBoards);
      setIsTaskModalOpen(false);
      setEditingTaskId(null);
    }
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string, sourceColId: string) => {
    setDraggedTaskId(taskId);
    setDraggedSourceColId(sourceColId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDraggedSourceColId(null);
    setDragOverColId(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDrop = (e: React.DragEvent, destColId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId || !activeBoard || !draggedSourceColId) {
      handleDragEnd();
      return;
    }

    if (draggedSourceColId === destColId) {
      handleDragEnd();
      return;
    }

    // Find the task
    const sourceCol = activeBoard.columns.find(c => c.id === draggedSourceColId);
    const task = sourceCol?.tasks.find(t => t.id === taskId);
    if (!task) {
      handleDragEnd();
      return;
    }

    // Move task: remove from source, add to destination
    const updatedBoards = boards.map(b => {
      if (b.id === activeBoard.id) {
        const destCol = b.columns.find(c => c.id === destColId);
        
        const updatedColumns = b.columns.map(c => {
          if (c.id === draggedSourceColId) {
            return {
              ...c,
              tasks: c.tasks.filter(t => t.id !== taskId)
            };
          }
          if (c.id === destColId) {
            // Also update note description if synced
            const updatedTask = { ...task };
            syncToNotes(updatedTask, destCol?.name || '');
            return {
              ...c,
              tasks: [...c.tasks, updatedTask]
            };
          }
          return c;
        });

        return { ...b, columns: updatedColumns };
      }
      return b;
    });

    saveBoards(updatedBoards);
    handleDragEnd();
  };

  // Label Selector Toggles
  const handleToggleLabel = (labelName: string) => {
    if (taskFormLabels.includes(labelName)) {
      setTaskFormLabels(taskFormLabels.filter(l => l !== labelName));
    } else {
      setTaskFormLabels([...taskFormLabels, labelName]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-112px)] w-full overflow-hidden text-foreground bg-background cozy-transition">
      
      {/* ========================================== */}
      {/* LEFT SIDE PANEL: BOARD LIST & CREATION     */}
      {/* ========================================== */}
      <div className="w-[260px] bg-secondary/15 border-r border-border/60 flex flex-col p-4 space-y-4 select-none flex-shrink-0">
        
        {/* Header Title */}
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={13} className="text-indigo-500" /> My Boards
          </span>
          <button 
            onClick={openCreateBoardModal}
            className="p-1 rounded bg-card border border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            title="Create New Board"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Board navigation list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
          {boards.map(board => {
            const isSelected = board.id === selectedBoardId;
            return (
              <div 
                key={board.id}
                onClick={() => setSelectedBoardId(board.id)}
                className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cozy-transition cursor-pointer select-none relative ${
                  isSelected 
                    ? 'bg-card text-foreground border border-border/50 shadow-sm' 
                    : 'text-muted-foreground hover:bg-card/40 hover:text-foreground border border-transparent'
                }`}
              >
                {/* Accent line on left */}
                {isSelected && (
                  <span 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                    style={{ backgroundColor: board.color }}
                  />
                )}

                {/* Left indicators & Name */}
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: board.color }}
                  />
                  <span className="truncate max-w-[130px]">{board.name}</span>
                </div>

                {/* Right controls on hover */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 cozy-transition">
                  <button 
                    onClick={(e) => openEditBoardModal(board, e)}
                    className="p-1 rounded text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                    title="Edit Board"
                  >
                    <Edit3 size={11} />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteBoard(board.id, e)}
                    className="p-1 rounded text-muted-foreground hover:bg-secondary hover:text-red-500 cursor-pointer"
                    title="Delete Board"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}

          {boards.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed border-border/40 rounded-2xl">
              <span className="text-2xl">🏜️</span>
              <p className="text-[10px] mt-2">No boards created.</p>
              <button 
                onClick={openCreateBoardModal}
                className="mt-3 px-2.5 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-[10px] font-bold"
              >
                Add Board
              </button>
            </div>
          )}
        </div>

        {/* Workspace Quick Insights */}
        <div className="bg-secondary/25 p-3 rounded-xl border border-border/40 space-y-2">
          <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Info size={11} /> Quick Stats
          </h4>
          <div className="text-[10px] text-muted-foreground space-y-1 font-medium">
            <div className="flex justify-between">
              <span>Total Columns:</span>
              <span className="font-bold text-foreground">{activeBoard?.columns.length || 0}/5</span>
            </div>
            <div className="flex justify-between">
              <span>Total Tasks:</span>
              <span className="font-bold text-foreground">
                {activeBoard?.columns.reduce((acc, c) => acc + c.tasks.length, 0) || 0}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* RIGHT SIDE PANEL: BOARD CANVAS & COLUMNS   */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50 h-full overflow-hidden">
        
        {/* Selected Board Header */}
        {activeBoard ? (
          <div className="px-6 py-4 border-b border-border/60 bg-card/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: activeBoard.color }}
              />
              <h2 className="font-bold text-base text-foreground truncate">{activeBoard.name}</h2>
              <span className="text-[10px] bg-secondary border border-border/50 text-muted-foreground px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                <Folder size={10} /> Board ID: {activeBoard.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Add Column Trigger */}
              {activeBoard.columns.length < 5 ? (
                isAddingCol ? (
                  <form onSubmit={handleAddColumn} className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <input 
                      type="text" 
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      placeholder="Column name..."
                      className="px-2.5 py-1 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      autoFocus
                    />
                    <button 
                      type="submit" 
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm"
                    >
                      Add
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsAddingCol(false)}
                      className="p-1 rounded border border-border text-muted-foreground hover:bg-secondary"
                    >
                      <X size={12} />
                    </button>
                  </form>
                ) : (
                  <button 
                    onClick={() => setIsAddingCol(true)}
                    className="px-3.5 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-1.5 cozy-transition shadow-sm cursor-pointer"
                  >
                    <PlusCircle size={14} className="text-indigo-500" /> New Column
                  </button>
                )
              ) : (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg font-medium select-none">
                  Column limit reached (5 max)
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <span className="text-4xl">🏜️</span>
            <h3 className="font-bold text-sm mt-3 text-foreground">No active board selected</h3>
            <p className="text-xs text-muted-foreground mt-1.5">Create a board on the left panel to get started.</p>
          </div>
        )}

        {/* Columns Grid Workspace */}
        {activeBoard && (
          <div className="flex-1 overflow-x-auto p-6 flex gap-5 items-start min-h-0 select-none scrollbar-thin">
            {activeBoard.columns.map(column => {
              const isOver = dragOverColId === column.id;
              
              return (
                <div 
                  key={column.id}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={() => dragOverColId === column.id && setDragOverColId(null)}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className={`w-[290px] max-h-full flex-shrink-0 bg-secondary/15 rounded-2xl border flex flex-col p-4 cozy-transition select-none ${
                    isOver 
                      ? 'bg-secondary/45 border-dashed border-indigo-400 scale-[0.99] shadow-inner' 
                      : 'border-border/40 hover:border-border/60'
                  }`}
                >
                  
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-2.5 mb-3.5 flex-shrink-0">
                    
                    {/* Header Input / Text toggle */}
                    {editingColId === column.id ? (
                      <input 
                        type="text"
                        value={editingColName}
                        onChange={(e) => setEditingColName(e.target.value)}
                        onBlur={() => handleRenameColumn(column.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameColumn(column.id)}
                        className="px-2 py-0.5 text-xs font-bold text-foreground bg-card rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary w-[160px]"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider truncate">
                          {column.name}
                        </span>
                        <span className="text-[10px] font-bold bg-card border border-border/50 text-muted-foreground px-2 py-0.5 rounded-full shadow-sm">
                          {column.tasks.length}
                        </span>
                      </div>
                    )}

                    {/* Column Options */}
                    <div className="flex items-center gap-0.5">
                      <button 
                        onClick={() => startRenameColumn(column.id, column.name)}
                        className="p-1 rounded text-muted-foreground hover:bg-card hover:text-foreground cursor-pointer"
                        title="Rename Column"
                      >
                        <Edit3 size={11} />
                      </button>
                      <button 
                        onClick={() => handleDeleteColumn(column.id)}
                        className="p-1 rounded text-muted-foreground hover:bg-card hover:text-red-500 cursor-pointer"
                        title="Delete Column"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>

                  </div>

                  {/* Tasks List inside Column */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 scrollbar-thin min-h-[100px]">
                    {column.tasks.map(task => {
                      const isTaskDragged = draggedTaskId === task.id;
                      
                      return (
                        <div 
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                          onDragEnd={handleDragEnd}
                          onClick={(e) => openEditTaskModal(task, column.id, e)}
                          className={`bg-card p-4 rounded-xl border border-border/60 cozy-shadow hover:border-border-cozy cozy-transition group relative select-none cursor-grab active:cursor-grabbing hover:-translate-y-[1px] ${
                            isTaskDragged ? 'opacity-30 scale-95 border-dashed bg-secondary/20' : ''
                          }`}
                        >
                          {/* Priority Tag & Quick actions */}
                          <div className="flex justify-between items-center mb-2.5">
                            <span 
                              className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider border font-mono select-none ${
                                task.priority === 'High' 
                                  ? 'bg-red-500/10 border-red-200 text-red-600 dark:text-red-400' 
                                  : task.priority === 'Medium'
                                    ? 'bg-amber-500/10 border-amber-200 text-amber-600 dark:text-amber-400'
                                    : 'bg-zinc-500/10 border-zinc-200 text-zinc-600 dark:text-zinc-400'
                              }`}
                            >
                              {task.priority}
                            </span>

                            <button 
                              onClick={(e) => handleDeleteTask(task.id, column.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:bg-secondary hover:text-red-500 cozy-transition cursor-pointer"
                              title="Delete Task"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>

                          {/* Task Title */}
                          <h4 className="font-semibold text-xs text-foreground leading-snug group-hover:text-indigo-500 dark:group-hover:text-indigo-400 cozy-transition">
                            {task.title}
                          </h4>

                          {/* Task Description */}
                          {task.description && (
                            <p className="text-[10px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Labels list */}
                          {task.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {task.labels.map(l => {
                                const labelStyle = PREDEFINED_LABELS.find(p => p.name === l) || PREDEFINED_LABELS[0];
                                return (
                                  <span 
                                    key={l}
                                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded border select-none ${labelStyle.bg}`}
                                  >
                                    {l}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {/* Divider */}
                          <div className="mt-3.5 pt-2.5 border-t border-border/30 flex justify-between items-center text-[9px] text-muted-foreground/80">
                            
                            {/* Due Date Indicator */}
                            <span className="flex items-center gap-1 font-semibold select-none font-mono">
                              <CalendarIcon size={10} className="text-amber-500" /> {task.dueDate}
                            </span>

                            {/* Sync Indicators */}
                            <div className="flex gap-1.5">
                              {task.syncCalendar && (
                                <span 
                                  className="p-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  title="Synced with Calendar"
                                >
                                  <CalendarDays size={10} />
                                </span>
                              )}
                              {task.syncNotes && (
                                <span 
                                  className="p-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400"
                                  title="Linked with Notes"
                                >
                                  <StickyNote size={10} />
                                </span>
                              )}
                            </div>

                          </div>

                        </div>
                      );
                    })}

                    {column.tasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/40 rounded-2xl text-center select-none text-muted-foreground">
                        <span className="text-lg">📭</span>
                        <p className="text-[10px] mt-1">Empty Column</p>
                      </div>
                    )}
                  </div>

                  {/* Add Task Trigger */}
                  <button 
                    onClick={() => openCreateTaskModal(column.id)}
                    className="mt-3 w-full py-1.5 border border-dashed border-border/80 rounded-xl hover:bg-card hover:border-indigo-400/40 text-[11px] font-semibold text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 cozy-transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Plus size={11} /> Add Task
                  </button>

                </div>
              );
            })}

            {activeBoard.columns.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                <span className="text-3xl">🏜️</span>
                <p className="text-xs text-muted-foreground mt-2">No columns created. Click "New Column" above.</p>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* DIALOG MODAL: CREATE OR EDIT KANBAN BOARD  */}
      {/* ========================================== */}
      {isBoardModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-[420px] p-6 rounded-2xl border border-border/60 cozy-shadow flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Layers size={14} className="text-indigo-500" />
                {editingBoardId ? 'Edit Board Settings' : 'Create New Board'}
              </h3>
              <button 
                onClick={() => setIsBoardModalOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleCreateOrEditBoard} className="space-y-4 text-xs">
              
              {/* Board Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider block">Board Name</label>
                <input 
                  type="text" 
                  value={boardFormName}
                  onChange={(e) => setBoardFormName(e.target.value)}
                  placeholder="e.g. Sprint Goals, Personal Projects..."
                  className="w-full px-3 py-2 border border-border/80 bg-secondary/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  required
                />
              </div>

              {/* Board Color Theme Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider block">Select Board Theme Color</label>
                <div className="grid grid-cols-7 gap-2">
                  {BOARD_COLORS.map(color => {
                    const isColorSelected = boardFormColor === color.hex;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setBoardFormColor(color.hex)}
                        className="h-8 rounded-lg flex items-center justify-center border border-black/5 cursor-pointer cozy-transition relative hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {isColorSelected && (
                          <Check size={14} className="text-white drop-shadow-md" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setIsBoardModalOpen(false)}
                  className="px-3.5 py-2 border border-border bg-card rounded-xl font-semibold text-muted-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-sm"
                >
                  {editingBoardId ? 'Save Changes' : 'Create Board'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* DIALOG MODAL: ADD OR EDIT TASK CARD        */}
      {/* ========================================== */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-[500px] p-6 rounded-2xl border border-border/60 cozy-shadow flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-500 animate-pulse" />
                {editingTaskId ? 'Edit Task Details' : 'Add New Task'}
              </h3>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateOrEditTask} className="space-y-4 text-xs">
              
              {/* Task Title */}
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider block">Task Title</label>
                <input 
                  type="text" 
                  value={taskFormTitle}
                  onChange={(e) => setTaskFormTitle(e.target.value)}
                  placeholder="Task title..."
                  className="w-full px-3 py-2 border border-border/80 bg-secondary/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                  required
                />
              </div>

              {/* Task Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase tracking-wider block">Description</label>
                <textarea 
                  value={taskFormDescription}
                  onChange={(e) => setTaskFormDescription(e.target.value)}
                  placeholder="Provide some details on what needs to be done..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border/80 bg-secondary/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none"
                />
              </div>

              {/* Grid: Due Date & Priority */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Due Date */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
                    <Clock size={11} /> Due Date
                  </label>
                  <input 
                    type="date" 
                    value={taskFormDueDate}
                    onChange={(e) => setTaskFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border/80 bg-secondary/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                    required
                  />
                </div>

                {/* Priority Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider block">Priority</label>
                  <select 
                    value={taskFormPriority}
                    onChange={(e) => setTaskFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-border/80 bg-card rounded-xl focus:outline-none text-foreground font-semibold"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

              </div>

              {/* Labels with Color-coded Tags */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
                  <Tag size={11} /> Labels
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_LABELS.map(lbl => {
                    const isSelected = taskFormLabels.includes(lbl.name);
                    return (
                      <button
                        key={lbl.name}
                        type="button"
                        onClick={() => handleToggleLabel(lbl.name)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border cursor-pointer cozy-transition ${
                          isSelected 
                            ? `${lbl.bg} ring-1 ring-primary` 
                            : 'bg-card text-muted-foreground border-border/70 hover:bg-secondary/40 hover:text-foreground'
                        }`}
                      >
                        {lbl.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sync Toggles with Calendar and Notes */}
              <div className="bg-secondary/25 p-3.5 rounded-xl border border-border/40 space-y-3.5">
                <h4 className="font-bold text-[9px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowRightLeft size={11} /> Integrations & Synced Views
                </h4>
                
                <div className="space-y-2.5">
                  
                  {/* Calendar Sync Toggle */}
                  <label className="flex items-center justify-between cursor-pointer select-none">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={13} className="text-amber-500" />
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-foreground">Sync with Calendar</span>
                        <span className="text-[9px] text-muted-foreground mt-0.5">Adds an interactive event to your Calendar view</span>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={taskFormSyncCalendar}
                      onChange={(e) => setTaskFormSyncCalendar(e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 cursor-pointer"
                    />
                  </label>

                  {/* Notes Link Sync Toggle */}
                  <label className="flex items-center justify-between cursor-pointer select-none border-t border-border/30 pt-2.5">
                    <div className="flex items-center gap-2">
                      <StickyNote size={13} className="text-teal-500" />
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-foreground">Link with Notes</span>
                        <span className="text-[9px] text-muted-foreground mt-0.5">Generates a live description document in your Notebook</span>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={taskFormSyncNotes}
                      onChange={(e) => setTaskFormSyncNotes(e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 cursor-pointer"
                    />
                  </label>

                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-between items-center pt-3.5 border-t border-border/50">
                <div>
                  {editingTaskId && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(editingTaskId, targetColumnId)}
                      className="px-3.5 py-2 text-red-600 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-bold"
                    >
                      Delete Task
                    </button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTaskModalOpen(false)}
                    className="px-3.5 py-2 border border-border bg-card rounded-xl font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-sm"
                  >
                    {editingTaskId ? 'Save Changes' : 'Create Task'}
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
