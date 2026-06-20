'use client';

import React, { useState, useEffect } from 'react';
import TiptapEditor from './TiptapEditor';
import { 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Copy, 
  RotateCcw, 
  FileText, 
  Check, 
  MoreVertical, 
  Palette, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Info
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  isTrash: boolean;
  color: string; // 'teal' | 'sage' | 'peach' | 'oat' | 'cyan' | 'violet'
}

const NOTE_COLORS = [
  { id: 'teal', label: 'Teal', hex: '#0D9488', bg: 'bg-teal-500/10', text: 'text-teal-500 border-teal-500/20' },
  { id: 'sage', label: 'Sage', hex: '#10B981', bg: 'bg-emerald-500/10', text: 'text-emerald-500 border-emerald-500/20' },
  { id: 'peach', label: 'Peach', hex: '#FF6B5A', bg: 'bg-rose-500/10', text: 'text-rose-500 border-rose-500/20' },
  { id: 'oat', label: 'Oatmeal', hex: '#D97706', bg: 'bg-amber-500/10', text: 'text-amber-500 border-amber-500/20' },
  { id: 'cyan', label: 'Cyan', hex: '#06B6D4', bg: 'bg-cyan-500/10', text: 'text-cyan-500 border-cyan-500/20' },
  { id: 'violet', label: 'Violet', hex: '#8B5CF6', bg: 'bg-violet-500/10', text: 'text-violet-500 border-violet-500/20' },
];

const DEFAULT_MOCK_NOTES: Note[] = [
  {
    id: 'note-1',
    title: '✨ AuraFlow Notes Guide',
    content: `<h1>✨ Notion-Style block editor</h1><p>Welcome to AuraFlow Notes! This editor offers block writing. You can type normal text or format elements.</p><p></p><blockquote>Type <strong>/</strong> to open the block command overlay. Try creating lists or headings!</blockquote><p></p><h2>Quick Guidelines</h2><ul><li><strong>AI Refine</strong>: Highlight text to see the AI Refine action. Click it to adjust tones, fix grammar, make it cozy, or change lengths.</li><li><strong>Slash Commands</strong>: Try typing <code>/</code> on a blank line to insert headings, blockquotes, lists, or code blocks.</li><li><strong>Organize</strong>: Pin important notes to the top, duplicate them, or choose beautiful colors for your panel sidebar.</li></ul>`,
    createdAt: Date.now() - 3600000 * 24 * 2, // 2 days ago
    updatedAt: Date.now() - 600000,
    isPinned: true,
    isTrash: false,
    color: 'teal'
  },
  {
    id: 'note-2',
    title: '🌿 Creative Brainstorming',
    content: `<h2>🌿 Workspace ideas</h2><p>Here are some cozy thoughts on integrating Notion & Miro panels:</p><ul><li>Create a unified left navigation bar.</li><li>Link boards and notes seamlessly.</li><li>Introduce soft HSL colors to avoid eye strain.</li></ul>`,
    createdAt: Date.now() - 3600000 * 5, // 5 hours ago
    updatedAt: Date.now() - 3600000 * 5,
    isPinned: false,
    isTrash: false,
    color: 'sage'
  },
  {
    id: 'note-3',
    title: '☕ Sunday Coffee Rituals',
    content: `<p>A cozy notes sheet to track light-roast pour-over techniques:</p><ol><li>Boil soft water to 94°C.</li><li>Rinse filter paper to remove paper taste.</li><li>Pour in circular motions slowly.</li></ol>`,
    createdAt: Date.now() - 3600000, // 1 hour ago
    updatedAt: Date.now() - 3600000,
    isPinned: false,
    isTrash: false,
    color: 'oat'
  }
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [activeColorPickerId, setActiveColorPickerId] = useState<string | null>(null);

  // Initialize and load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('auraflow_notes_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(parsed);
        // Set first non-trash note as selected
        const nonTrash = parsed.filter((n: Note) => !n.isTrash);
        if (nonTrash.length > 0) {
          setSelectedNoteId(nonTrash[0].id);
        }
      } catch (e) {
        setNotes(DEFAULT_MOCK_NOTES);
        localStorage.setItem('auraflow_notes_v2', JSON.stringify(DEFAULT_MOCK_NOTES));
        setSelectedNoteId(DEFAULT_MOCK_NOTES[0].id);
      }
    } else {
      setNotes(DEFAULT_MOCK_NOTES);
      localStorage.setItem('auraflow_notes_v2', JSON.stringify(DEFAULT_MOCK_NOTES));
      setSelectedNoteId(DEFAULT_MOCK_NOTES[0].id);
    }
  }, []);

  const saveNotesToStorage = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('auraflow_notes_v2', JSON.stringify(updatedNotes));
  };

  // Helper for relative updated time
  const formatTime = (time: number) => {
    const diff = Date.now() - time;
    if (diff < 60000) return 'Just now';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '<h1>Untitled Note</h1><p>Write some cozy thoughts...</p>',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
      isTrash: false,
      color: 'teal'
    };
    const updated = [newNote, ...notes];
    saveNotesToStorage(updated);
    setSelectedNoteId(newNote.id);
  };

  const handleUpdateNoteContent = (newContent: string) => {
    const updated = notes.map(n => 
      n.id === selectedNoteId 
        ? { ...n, content: newContent, updatedAt: Date.now() } 
        : n
    );
    saveNotesToStorage(updated);
  };

  const handleUpdateNoteTitle = (newTitle: string) => {
    const updated = notes.map(n => 
      n.id === selectedNoteId 
        ? { ...n, title: newTitle, updatedAt: Date.now() } 
        : n
    );
    saveNotesToStorage(updated);
  };

  // Duplicate a note
  const handleDuplicateNote = (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    const duplicated: Note = {
      ...note,
      id: `note-${Date.now()}`,
      title: `${note.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
    };
    const updated = [duplicated, ...notes];
    saveNotesToStorage(updated);
    setSelectedNoteId(duplicated.id);
  };

  // Move to Trash
  const handleMoveToTrash = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notes.map(n => n.id === id ? { ...n, isTrash: true } : n);
    saveNotesToStorage(updated);
    
    if (selectedNoteId === id) {
      const remainingNonTrash = updated.filter(n => !n.isTrash);
      if (remainingNonTrash.length > 0) {
        setSelectedNoteId(remainingNonTrash[0].id);
      } else {
        setSelectedNoteId('');
      }
    }
  };

  // Restore from Trash
  const handleRestoreFromTrash = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notes.map(n => n.id === id ? { ...n, isTrash: false, updatedAt: Date.now() } : n);
    saveNotesToStorage(updated);
    setSelectedNoteId(id);
  };

  // Delete Permanently
  const handlePermanentDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) {
      const updated = notes.filter(n => n.id !== id);
      saveNotesToStorage(updated);
      if (selectedNoteId === id) {
        const remainingNonTrash = updated.filter(n => !n.isTrash);
        if (remainingNonTrash.length > 0) {
          setSelectedNoteId(remainingNonTrash[0].id);
        } else {
          setSelectedNoteId('');
        }
      }
    }
  };

  // Pin / Favorite Toggle
  const handleTogglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
    saveNotesToStorage(updated);
  };

  // Change Color
  const handleSetColor = (id: string, color: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, color } : n);
    saveNotesToStorage(updated);
    setActiveColorPickerId(null);
  };

  // Start Renaming
  const handleStartRename = (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    setEditingNoteId(note.id);
    setEditTitleValue(note.title);
  };

  // Save Rename
  const handleSaveRename = (id: string) => {
    if (editTitleValue.trim()) {
      const updated = notes.map(n => n.id === id ? { ...n, title: editTitleValue.trim(), updatedAt: Date.now() } : n);
      saveNotesToStorage(updated);
    }
    setEditingNoteId(null);
  };

  // Filter and sort notes
  const activeNotes = notes.filter(n => !n.isTrash);
  const trashNotes = notes.filter(n => n.isTrash);

  const filteredNotes = activeNotes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pinned go first, then sorted by updatedAt desc
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const selectedNote = notes.find(n => n.id === selectedNoteId && !n.isTrash);

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-5 h-[calc(100vh-120px)] text-foreground overflow-hidden">
      {/* LEFT SIDEBAR PANEL: Notes directory */}
      <div className="w-full md:w-72 bg-secondary/15 rounded-2xl border border-border/60 flex flex-col h-full overflow-hidden select-none">
        {/* Search & Add button area */}
        <div className="p-4 border-b border-border/40 space-y-3 flex-shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              📚 Notebook Directory
            </span>
            <button
              onClick={handleAddNote}
              className="p-1 rounded bg-card border border-border hover:bg-secondary cursor-pointer text-muted-foreground hover:text-foreground cozy-transition shadow-sm flex items-center justify-center"
              title="New Note"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="relative">
            <Search size={13} className="absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notebook..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        {/* Note List (Middle Flex section) */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin">
          {sortedNotes.map((note) => {
            const isActive = note.id === selectedNoteId;
            const colorObj = NOTE_COLORS.find(c => c.id === note.color) || NOTE_COLORS[0];
            const isEditing = note.id === editingNoteId;

            return (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`relative group flex flex-col gap-1 p-2.5 rounded-xl border cozy-transition cursor-pointer ${
                  isActive 
                    ? 'bg-card text-foreground border-border shadow-sm font-semibold' 
                    : 'bg-transparent text-muted-foreground hover:bg-card/40 border-transparent hover:text-foreground'
                }`}
                style={{
                  borderLeft: `3px solid ${colorObj.hex}`
                }}
              >
                {/* Upper block: Icon, Title / Input, Pin indicator */}
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <FileText size={13} className="text-teal-500 flex-shrink-0" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitleValue}
                        onChange={(e) => setEditTitleValue(e.target.value)}
                        onBlur={() => handleSaveRename(note.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(note.id);
                          if (e.key === 'Escape') setEditingNoteId(null);
                        }}
                        autoFocus
                        className="w-full text-xs bg-secondary/50 border border-border rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary font-medium text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="truncate text-xs font-semibold text-foreground">
                        {note.title || 'Untitled Note'}
                      </span>
                    )}
                  </div>

                  {/* Pinned badge/indicator */}
                  {note.isPinned && !isEditing && (
                    <Pin size={11} className="text-amber-500 fill-amber-500 flex-shrink-0" />
                  )}
                </div>

                {/* Lower block: metadata & hover controls */}
                <div className="flex items-center justify-between text-[9px] text-muted-foreground mt-1">
                  <span>Updated {formatTime(note.updatedAt)}</span>
                  
                  {/* Color tag name indicator */}
                  <span className={`px-1.5 py-0.25 text-[8px] font-bold border rounded uppercase ${colorObj.text} ${colorObj.bg}`}>
                    {colorObj.label}
                  </span>
                </div>

                {/* Quick actions popup/hover bar */}
                {!isEditing && (
                  <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1.5 bg-card/90 dark:bg-zinc-800/90 border border-border/80 p-1 rounded-md shadow-md z-10 cozy-transition">
                    {/* Pin button */}
                    <button
                      onClick={(e) => handleTogglePin(e, note.id)}
                      className={`p-1 rounded hover:bg-secondary cozy-transition ${note.isPinned ? 'text-amber-500' : 'text-muted-foreground'}`}
                      title={note.isPinned ? "Unpin Note" : "Pin Note"}
                    >
                      <Pin size={11} className={note.isPinned ? 'fill-amber-500' : ''} />
                    </button>

                    {/* Color picker dropdown trigger */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveColorPickerId(activeColorPickerId === note.id ? null : note.id);
                        }}
                        className="p-1 rounded hover:bg-secondary text-muted-foreground cozy-transition"
                        title="Change Color"
                      >
                        <Palette size={11} />
                      </button>

                      {activeColorPickerId === note.id && (
                        <div 
                          className="absolute right-0 top-full mt-1.5 flex gap-1 p-1 bg-card border border-border rounded-lg shadow-lg z-50 cozy-shadow"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {NOTE_COLORS.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => handleSetColor(note.id, c.id)}
                              className="w-4.5 h-4.5 rounded-full border border-black/10 hover:scale-110 cozy-transition flex-shrink-0"
                              style={{ backgroundColor: c.hex }}
                              title={c.label}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Duplicate button */}
                    <button
                      onClick={(e) => handleDuplicateNote(e, note)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground cozy-transition"
                      title="Duplicate Note"
                    >
                      <Copy size={11} />
                    </button>

                    {/* Rename button */}
                    <button
                      onClick={(e) => handleStartRename(e, note)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground cozy-transition"
                      title="Rename Note"
                    >
                      <Edit3 size={11} />
                    </button>

                    {/* Trash/Delete button */}
                    <button
                      onClick={(e) => handleMoveToTrash(e, note.id)}
                      className="p-1 rounded hover:bg-secondary text-red-500 cozy-transition"
                      title="Move to Trash"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {sortedNotes.length === 0 && (
            <div className="text-center py-10 px-4">
              <span className="text-xl">🏜️</span>
              <p className="text-[10px] text-muted-foreground mt-2">
                {searchQuery ? 'No notes matching search' : 'No active notes'}
              </p>
            </div>
          )}
        </div>

        {/* TRASH COLLAPSIBLE SECTION */}
        <div className="border-t border-border/40 flex-shrink-0">
          <button
            onClick={() => setShowTrash(!showTrash)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-muted-foreground hover:bg-secondary/40 cozy-transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-red-500 font-bold">
              <Trash2 size={13} /> Trash ({trashNotes.length})
            </span>
            {showTrash ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>

          {showTrash && (
            <div className="max-h-40 overflow-y-auto px-2 pb-3.5 space-y-1.5 scrollbar-thin bg-red-500/5">
              {trashNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-card/60 border border-border/30 text-xs text-muted-foreground"
                >
                  <span className="truncate max-w-[120px] font-semibold text-[11px] text-foreground">
                    {note.title || 'Untitled Note'}
                  </span>
                  
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => handleRestoreFromTrash(e, note.id)}
                      className="p-1 rounded hover:bg-secondary text-green-600 cozy-transition"
                      title="Restore Note"
                    >
                      <RotateCcw size={11} />
                    </button>
                    <button
                      onClick={(e) => handlePermanentDelete(e, note.id)}
                      className="p-1 rounded hover:bg-secondary text-red-500 cozy-transition"
                      title="Delete Permanently"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}

              {trashNotes.length === 0 && (
                <div className="text-center py-4 text-[10px] text-muted-foreground">
                  Trash is empty
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT EDITOR PANEL: Tiptap Notion editor wrapper */}
      <div className="flex-1 bg-card rounded-2xl border border-border/60 cozy-shadow flex flex-col h-full overflow-hidden select-text">
        {selectedNote ? (
          <TiptapEditor
            key={selectedNote.id}
            initialContent={selectedNote.content}
            onChange={handleUpdateNoteContent}
            title={selectedNote.title}
            onTitleChange={handleUpdateNoteTitle}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none">
            <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center text-3xl mb-4 border border-border/60">
              ☕
            </div>
            <h3 className="font-bold text-sm text-foreground">Write cozy thoughts</h3>
            <p className="text-xs text-muted-foreground max-w-xs mt-1.5">
              Select an existing note from the panel directory, or click the plus button to start a fresh draft.
            </p>
            <button
              onClick={handleAddNote}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cozy-transition cursor-pointer"
            >
              <Plus size={14} /> Draft New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
