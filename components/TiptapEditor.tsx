'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Terminal, 
  Sparkles, 
  Check, 
  Loader2,
  Trash2
} from 'lucide-react';

interface TiptapEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

export default function TiptapEditor({ 
  initialContent, 
  onChange, 
  title, 
  onTitleChange 
}: TiptapEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiDropdown, setShowAiDropdown] = useState(false);
  
  // Slash Commands popup state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuCoords, setSlashMenuCoords] = useState({ top: 0, left: 0 });
  const [slashMenuSelectedIndex, setSlashMenuSelectedIndex] = useState(0);

  // Keep refs of slash command states to access them in keydown event handler
  const showSlashMenuRef = useRef(showSlashMenu);
  const slashMenuSelectedIndexRef = useRef(slashMenuSelectedIndex);
  const slashMenuCoordsRef = useRef(slashMenuCoords);

  useEffect(() => {
    showSlashMenuRef.current = showSlashMenu;
  }, [showSlashMenu]);

  useEffect(() => {
    slashMenuSelectedIndexRef.current = slashMenuSelectedIndex;
  }, [slashMenuSelectedIndex]);

  const slashCommands = [
    { id: 'h1', label: 'Heading 1', icon: Heading1, desc: 'Big section heading' },
    { id: 'h2', label: 'Heading 2', icon: Heading2, desc: 'Medium section heading' },
    { id: 'h3', label: 'Heading 3', icon: Heading3, desc: 'Small section heading' },
    { id: 'bullet', label: 'Bullet List', icon: List, desc: 'Create a simple bullet list' },
    { id: 'ordered', label: 'Numbered List', icon: ListOrdered, desc: 'Create a list with numbering' },
    { id: 'quote', label: 'Blockquote', icon: Quote, desc: 'Capture a quote block' },
    { id: 'codeblock', label: 'Code Block', icon: Terminal, desc: 'Write code snippets' },
    { id: 'paragraph', label: 'Normal Text', icon: Bold, desc: 'Start writing plain text' },
  ];

  const slashCommandsRef = useRef(slashCommands);

  // Initialize Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`;
          }
          return 'Press / for commands...';
        },
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      // Calculate word count
      const text = editor.getText();
      const count = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
      setWordCount(count);

      // Trigger auto-save state
      setSaveStatus('saving');

      // Slash commands check
      const { state } = editor;
      const { $from } = state.selection;
      const currentBlockText = $from.parent.textContent;
      
      // Open slash commands dropdown only if current block starts/is exactly '/'
      if (currentBlockText === '/') {
        try {
          const coords = editor.view.coordsAtPos($from.pos);
          setSlashMenuCoords({
            top: coords.top + window.scrollY + 24,
            left: coords.left + window.scrollX,
          });
          setShowSlashMenu(true);
          setSlashMenuSelectedIndex(0);
        } catch (e) {
          setShowSlashMenu(false);
        }
      } else {
        setShowSlashMenu(false);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none min-h-[350px] w-full max-w-none text-sm leading-relaxed p-4 select-text',
      },
      handleKeyDown: (view, event) => {
        if (showSlashMenuRef.current) {
          const commands = slashCommandsRef.current;
          const index = slashMenuSelectedIndexRef.current;

          if (event.key === 'ArrowDown') {
            setSlashMenuSelectedIndex((index + 1) % commands.length);
            return true;
          }
          if (event.key === 'ArrowUp') {
            setSlashMenuSelectedIndex((index - 1 + commands.length) % commands.length);
            return true;
          }
          if (event.key === 'Enter') {
            executeSlashCommand(commands[index].id);
            return true;
          }
          if (event.key === 'Escape') {
            setShowSlashMenu(false);
            return true;
          }
        }
        return false;
      }
    }
  });

  // Update content if selected note changes
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
      const text = editor.getText();
      const count = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
      setWordCount(count);
      setSaveStatus('saved');
    }
  }, [initialContent, editor]);

  // Debounced auto-save triggers onChange
  useEffect(() => {
    if (saveStatus === 'saving' && editor) {
      const timeout = setTimeout(() => {
        onChange(editor.getHTML());
        setSaveStatus('saved');
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [saveStatus, editor, onChange]);

  const executeSlashCommand = (commandId: string) => {
    if (!editor) return;

    // Delete the "/" character
    const { state } = editor;
    const { $from } = state.selection;
    editor.chain().focus().deleteRange({ from: $from.start(), to: $from.pos }).run();

    // Trigger target command
    switch (commandId) {
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'bullet':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'ordered':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'quote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'codeblock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
    }

    setShowSlashMenu(false);
  };

  // AI Refinement handler
  const handleAiRefine = async (option: string, tone?: string) => {
    if (!editor) return;
    setShowAiDropdown(false);
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    if (!selectedText.trim()) return;

    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selectedText, option, tone }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.refinedText) {
          editor.chain().focus().insertContentAt({ from, to }, data.refinedText).run();
        }
      }
    } catch (err) {
      console.error('AI Refinement failed', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden relative">
      {/* Sticky Top Editor Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b border-border bg-secondary/10 sticky top-0 z-20 flex-shrink-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition cursor-pointer text-muted-foreground hover:text-foreground ${editor.isActive('bold') ? 'bg-card text-foreground font-bold shadow-sm' : ''}`}
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition cursor-pointer text-muted-foreground hover:text-foreground ${editor.isActive('italic') ? 'bg-card text-foreground shadow-sm' : ''}`}
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition cursor-pointer text-muted-foreground hover:text-foreground ${editor.isActive('strike') ? 'bg-card text-foreground shadow-sm' : ''}`}
            title="Strikethrough"
          >
            <Strikethrough size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition cursor-pointer text-muted-foreground hover:text-foreground ${editor.isActive('code') ? 'bg-card text-foreground shadow-sm' : ''}`}
            title="Inline Code"
          >
            <Code size={14} />
          </button>

          <span className="w-px h-4 bg-border/60 mx-1" />

          {/* Heading buttons */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition cursor-pointer text-muted-foreground hover:text-foreground ${editor.isActive('heading', { level: 1 }) ? 'bg-card text-foreground shadow-sm' : ''}`}
            title="Heading 1"
          >
            <Heading1 size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition cursor-pointer text-muted-foreground hover:text-foreground ${editor.isActive('heading', { level: 2 }) ? 'bg-card text-foreground shadow-sm' : ''}`}
            title="Heading 2"
          >
            <Heading2 size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition cursor-pointer text-muted-foreground hover:text-foreground ${editor.isActive('heading', { level: 3 }) ? 'bg-card text-foreground shadow-sm' : ''}`}
            title="Heading 3"
          >
            <Heading3 size={14} />
          </button>

          <span className="w-px h-4 bg-border/60 mx-1" />

          {/* List buttons */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition cursor-pointer text-muted-foreground hover:text-foreground ${editor.isActive('bulletList') ? 'bg-card text-foreground shadow-sm' : ''}`}
            title="Bullet List"
          >
            <List size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition cursor-pointer text-muted-foreground hover:text-foreground ${editor.isActive('orderedList') ? 'bg-card text-foreground shadow-sm' : ''}`}
            title="Numbered List"
          >
            <ListOrdered size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition cursor-pointer text-muted-foreground hover:text-foreground ${editor.isActive('blockquote') ? 'bg-card text-foreground shadow-sm' : ''}`}
            title="Blockquote"
          >
            <Quote size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition cursor-pointer text-muted-foreground hover:text-foreground ${editor.isActive('codeBlock') ? 'bg-card text-foreground shadow-sm' : ''}`}
            title="Code Block"
          >
            <Terminal size={14} />
          </button>
        </div>

        {/* Saved Status Indicator */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          {saveStatus === 'saving' ? (
            <span className="flex items-center gap-1 text-orange-400 font-medium">
              <Loader2 size={10} className="animate-spin" /> Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-green-500 font-medium">
              <Check size={10} /> Saved
            </span>
          )}
          <span>•</span>
          <span>{wordCount} words</span>
        </div>
      </div>

      {/* Title & Document Content Viewport */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin select-text">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Note Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled Note"
            className="w-full text-3xl font-extrabold tracking-tight text-foreground bg-transparent border-0 outline-none focus:ring-0 focus:outline-none p-0 select-text"
          />

          <hr className="border-border/60" />

          {/* Tiptap Rich Text Editor Area */}
          <div className="editor-container select-text relative">
            {isAiLoading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded">
                <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border cozy-shadow text-xs text-muted-foreground font-semibold animate-pulse">
                  <Sparkles size={14} className="text-orange-400 animate-spin" />
                  AI is refining selected text...
                </div>
              </div>
            )}
            <EditorContent editor={editor} className="select-text" />
          </div>
        </div>
      </div>

      {/* Floating Selection Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          options={{ placement: 'top' }}
          className="flex items-center gap-1 p-1 bg-card border border-border rounded-lg shadow-md cozy-shadow"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition text-muted-foreground hover:text-foreground cursor-pointer ${editor.isActive('bold') ? 'bg-secondary text-foreground font-bold' : ''}`}
            title="Bold"
          >
            <Bold size={12} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition text-muted-foreground hover:text-foreground cursor-pointer ${editor.isActive('italic') ? 'bg-secondary text-foreground' : ''}`}
            title="Italic"
          >
            <Italic size={12} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition text-muted-foreground hover:text-foreground cursor-pointer ${editor.isActive('strike') ? 'bg-secondary text-foreground' : ''}`}
            title="Strikethrough"
          >
            <Strikethrough size={12} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded hover:bg-secondary cozy-transition text-muted-foreground hover:text-foreground cursor-pointer ${editor.isActive('code') ? 'bg-secondary text-foreground' : ''}`}
            title="Code"
          >
            <Code size={12} />
          </button>

          <span className="w-px h-4 bg-border/60 mx-1" />

          {/* AI Refine Dropdown inside bubble menu */}
          <div className="relative">
            <button
              onClick={() => setShowAiDropdown(!showAiDropdown)}
              className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 hover:bg-orange-500/25 border border-orange-500/20 text-orange-600 dark:text-orange-400 rounded text-[10px] font-bold cozy-transition cursor-pointer"
            >
              <Sparkles size={11} /> AI Refine
            </button>

            {showAiDropdown && (
              <div className="absolute right-0 bottom-full mb-1.5 w-44 bg-card border border-border rounded-lg shadow-lg cozy-shadow py-1.5 z-50 text-[11px] font-medium text-foreground">
                <button
                  onClick={() => handleAiRefine('grammar')}
                  className="w-full text-left px-3 py-1.5 hover:bg-secondary cozy-transition cursor-pointer"
                >
                  Improve Grammar
                </button>
                <button
                  onClick={() => handleAiRefine('rephrase')}
                  className="w-full text-left px-3 py-1.5 hover:bg-secondary cozy-transition cursor-pointer"
                >
                  Rephrase Text
                </button>
                <button
                  onClick={() => handleAiRefine('shorter')}
                  className="w-full text-left px-3 py-1.5 hover:bg-secondary cozy-transition cursor-pointer"
                >
                  Make Shorter
                </button>
                <button
                  onClick={() => handleAiRefine('longer')}
                  className="w-full text-left px-3 py-1.5 hover:bg-secondary cozy-transition cursor-pointer"
                >
                  Make Longer
                </button>
                <button
                  onClick={() => handleAiRefine('simplify')}
                  className="w-full text-left px-3 py-1.5 hover:bg-secondary cozy-transition cursor-pointer"
                >
                  Simplify Language
                </button>

                <div className="h-px bg-border/50 my-1" />

                {/* Sub Tone Options */}
                <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                  Change Tone
                </div>
                <button
                  onClick={() => handleAiRefine('tone', 'cozy')}
                  className="w-full text-left px-3 py-1.25 hover:bg-secondary cozy-transition pl-4.5 flex items-center gap-1 cursor-pointer"
                >
                  ☕ Cozy Warm
                </button>
                <button
                  onClick={() => handleAiRefine('tone', 'professional')}
                  className="w-full text-left px-3 py-1.25 hover:bg-secondary cozy-transition pl-4.5 flex items-center gap-1 cursor-pointer"
                >
                  💼 Professional
                </button>
                <button
                  onClick={() => handleAiRefine('tone', 'casual')}
                  className="w-full text-left px-3 py-1.25 hover:bg-secondary cozy-transition pl-4.5 flex items-center gap-1 cursor-pointer"
                >
                  ✌️ Casual
                </button>
              </div>
            )}
          </div>
        </BubbleMenu>
      )}

      {/* Floating Slash Commands Menu */}
      {showSlashMenu && (
        <div
          className="fixed w-52 max-h-60 overflow-y-auto bg-card border border-border rounded-lg shadow-lg cozy-shadow py-1.5 z-50 text-[11px] font-semibold text-foreground scrollbar-thin"
          style={{
            top: `${slashMenuCoords.top}px`,
            left: `${slashMenuCoords.left}px`,
          }}
        >
          <div className="px-2.5 py-1 text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
            Basic Blocks
          </div>
          {slashCommands.map((command, idx) => {
            const isSelected = idx === slashMenuSelectedIndex;
            return (
              <button
                key={command.id}
                onClick={() => executeSlashCommand(command.id)}
                className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2.5 cozy-transition cursor-pointer ${
                  isSelected ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                }`}
              >
                <div className="w-5 h-5 rounded bg-secondary/75 flex items-center justify-center text-foreground">
                  <command.icon size={11} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-[11px] text-foreground truncate">{command.label}</span>
                  <span className="text-[9px] text-muted-foreground truncate">{command.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Custom Styles Injection */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 350px;
        }
        .ProseMirror h1 {
          font-size: 1.875rem !important; /* 30px */
          font-weight: 800 !important;
          margin-top: 1.75rem !important;
          margin-bottom: 0.5rem !important;
          line-height: 1.25 !important;
        }
        .ProseMirror h2 {
          font-size: 1.5rem !important; /* 24px */
          font-weight: 700 !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.4rem !important;
          line-height: 1.3 !important;
        }
        .ProseMirror h3 {
          font-size: 1.25rem !important; /* 20px */
          font-weight: 600 !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.3rem !important;
          line-height: 1.4 !important;
        }
        .ProseMirror p {
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
          line-height: 1.6 !important;
        }
        .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .ProseMirror li {
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
        }
        .ProseMirror blockquote {
          border-left: 3px solid var(--border) !important;
          padding-left: 1rem !important;
          font-style: italic !important;
          margin: 1rem 0 !important;
          color: var(--muted-foreground) !important;
        }
        .ProseMirror pre {
          background: var(--muted) !important;
          padding: 0.75rem 1rem !important;
          border-radius: 6px !important;
          font-family: monospace !important;
          margin: 1rem 0 !important;
          overflow-x: auto !important;
          color: var(--foreground) !important;
        }
        .ProseMirror code {
          background: var(--muted) !important;
          padding: 0.15rem 0.3rem !important;
          border-radius: 4px !important;
          font-family: monospace !important;
          font-size: 0.85em !important;
          color: var(--foreground) !important;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--muted-foreground) !important;
          content: attr(data-placeholder) !important;
          float: left !important;
          height: 0 !important;
          pointer-events: none !important;
        }
        .ProseMirror p.is-empty::before {
          color: var(--muted-foreground) !important;
          content: attr(data-placeholder) !important;
          float: left !important;
          height: 0 !important;
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
}
