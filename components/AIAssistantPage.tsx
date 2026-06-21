'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Plus, 
  Trash2, 
  Calendar, 
  Folder, 
  FileText, 
  Settings, 
  Check, 
  X, 
  AlertTriangle, 
  Loader2, 
  Layers, 
  ChevronRight, 
  User,
  Activity,
  Presentation
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  action?: {
    type: string;
    payload: any;
    status: 'pending' | 'confirmed' | 'cancelled';
  };
}

interface AIAssistantPageProps {
  isDark: boolean;
  activePage: string;
  setActivePage: (id: string) => void;
  createdApps: any[];
  setCreatedApps: (apps: any[]) => void;
}

export default function AIAssistantPage({ 
  isDark, 
  activePage, 
  setActivePage,
  createdApps,
  setCreatedApps
}: AIAssistantPageProps) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Voice recording states
  const [isListening, setIsListening] = useState(false);
  const [listeningState, setListeningState] = useState<'idle' | 'connecting' | 'listening' | 'error'>('idle');
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  // Refs for audio context and websockets
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null); // For Web Speech fallback

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('auraflow_ai_chat_history');
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (e) {
        setMessages(getDefaultMessages());
      }
    } else {
      setMessages(getDefaultMessages());
    }
  }, []);

  // Save chat history when messages change
  const saveMessages = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    localStorage.setItem('auraflow_ai_chat_history', JSON.stringify(newMsgs));
  };

  const getDefaultMessages = (): Message[] => [
    {
      id: 'default-1',
      role: 'assistant',
      text: 'Hello Sarah! I am your Spark AI Assistant. I can help you structure tasks, plan events on the calendar, write notes, generate custom widgets, or draw flowcharts on the whiteboard. What can I help you build or organize today?',
      timestamp: Date.now()
    }
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  const clearChat = () => {
    if (confirm('Clear chat history?')) {
      saveMessages(getDefaultMessages());
    }
  };

  // Pre-defined quick prompt suggestions
  const SUGGESTIONS = [
    { label: "Create a task for tomorrow", text: "Create a high priority task for tomorrow: design high-fidelity prototypes" },
    { label: "Add meeting on calendar", text: "Add a meeting to my calendar tomorrow at 3pm about database structure review" },
    { label: "Summarize my notes", text: "Summarize the active note details" },
    { label: "Create a Kanban board", text: "Create a Kanban board named Sprint Launch" },
    { label: "Plan my week", text: "Schedule a personal reminder for Monday at 9am: Plan my weekly roadmap tasks" },
    { label: "Generate a habit tracker template", text: "Generate a custom workspace app for a Fitness and Habit tracker" }
  ];

  const handleSuggestionClick = (text: string) => {
    setChatInput(text);
  };

  const sendPrompt = async (textToSend?: string) => {
    const promptText = textToSend || chatInput;
    if (!promptText.trim() || isLoading) return;

    // Add user message
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: promptText,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMsg];
    saveMessages(updatedMessages);
    setChatInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          history: chatHistory.slice(-10), // Keep context light
          activePage
        })
      });

      if (!res.ok) {
        throw new Error('API server returned an error');
      }

      const data = await res.json();

      // Add AI reply message
      const assistantMsg: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        text: data.reply,
        timestamp: Date.now(),
        action: data.action ? {
          type: data.action.type,
          payload: data.action.payload,
          status: 'pending'
        } : undefined
      };

      saveMessages([...updatedMessages, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg-${Date.now()}-ai-err`,
        role: 'assistant',
        text: 'Sorry, I encountered an error connecting to the AI services. Please try again in a moment!',
        timestamp: Date.now()
      };
      saveMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // VOICE INTEGRATION SECTION (AssemblyAI with Web Speech Fallback)
  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  const startListening = async () => {
    setIsListening(true);
    setListeningState('connecting');
    setTranscriptionError(null);
    setInterimTranscript('');

    try {
      // 1. Get temporary token for AssemblyAI WebSocket
      const tokenRes = await fetch('/api/ai/voice-token');
      const tokenData = await tokenRes.json();

      if (tokenData.token && !tokenData.isMock) {
        // AssemblyAI Token retrieved successfully - start streaming WebSocket
        await startAssemblyAIStream(tokenData.token);
      } else {
        // Fallback: Use Browser Native Speech Recognition (webkitSpeechRecognition)
        startNativeSpeechRecognition();
      }
    } catch (e: any) {
      console.warn('AssemblyAI token fetch error, falling back to browser recognition:', e);
      startNativeSpeechRecognition();
    }
  };

  const startAssemblyAIStream = async (token: string) => {
    try {
      const wsUrl = `wss://api.assemblyai.com/v2/realtime/websocket?sample_rate=16000&token=${token}`;
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = async () => {
        setListeningState('listening');
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStreamRef.current = stream;

          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const audioCtx = new AudioContextClass({ sampleRate: 16000 });
          audioContextRef.current = audioCtx;

          const source = audioCtx.createMediaStreamSource(stream);
          const processor = audioCtx.createScriptProcessor(4096, 1, 1);
          processorNodeRef.current = processor;

          source.connect(processor);
          processor.connect(audioCtx.destination);

          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16Buffer = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              const s = Math.max(-1, Math.min(1, inputData[i]));
              int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }

            // Convert to Base64
            let binary = '';
            const bytes = new Uint8Array(int16Buffer.buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64Audio = btoa(binary);

            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ audio_data: base64Audio }));
            }
          };
        } catch (mediaErr: any) {
          console.error(mediaErr);
          setTranscriptionError('Microphone access denied or unavailable.');
          stopListening();
        }
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.text) {
          if (msg.transcription_type === 'Partial') {
            setInterimTranscript(msg.text);
          } else if (msg.transcription_type === 'Final') {
            setChatInput(prev => prev + (prev ? ' ' : '') + msg.text);
            setInterimTranscript('');
          }
        }
      };

      ws.onerror = (err) => {
        console.error('AssemblyAI socket error:', err);
        setListeningState('error');
      };

      ws.onclose = () => {
        setListeningState('idle');
      };
    } catch (err: any) {
      console.error(err);
      startNativeSpeechRecognition();
    }
  };

  const startNativeSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setListeningState('error');
      setTranscriptionError('Speech recognition is not supported in this browser. Please try Chrome/Edge.');
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      recognitionRef.current = rec;
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setListeningState('listening');
      };

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) {
          setChatInput(prev => prev + (prev ? ' ' : '') + final);
        }
        setInterimTranscript(interim);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setListeningState('error');
        setTranscriptionError(event.error === 'not-allowed' ? 'Microphone permission denied.' : 'Voice recognition error: ' + event.error);
        stopListening();
      };

      rec.onend = () => {
        setListeningState('idle');
        setIsListening(false);
      };

      rec.start();
    } catch (e: any) {
      console.error(e);
      setListeningState('error');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setListeningState('idle');
    setInterimTranscript('');

    // Cleanup AssemblyAI stream
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ terminate_session: true }));
        socketRef.current.close();
      }
      socketRef.current = null;
    }

    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    // Cleanup native speech
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // Clean up listening context on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  // CLIENT SIDE ACTION EXECUTION PIPELINE
  const handleActionConfirm = async (msgId: string, actionType: string, payload: any) => {
    // 1. Mark action as confirmed in UI
    const updated = messages.map(m => {
      if (m.id === msgId && m.action) {
        return {
          ...m,
          action: { ...m.action, status: 'confirmed' as const }
        };
      }
      return m;
    });
    saveMessages(updated);

    // 2. Perform the actual action
    try {
      await executeAppAction(actionType, payload);
      
      // Post success response from AI
      const successMsg: Message = {
        id: `msg-${Date.now()}-ai-success`,
        role: 'assistant',
        text: `✨ Action executed successfully! I've updated the database. You will see the changes on the respective page.`,
        timestamp: Date.now()
      };
      saveMessages([...updated, successMsg]);
    } catch (err: any) {
      console.error(err);
      // Post error response
      const errMsg: Message = {
        id: `msg-${Date.now()}-ai-fail`,
        role: 'assistant',
        text: `⚠️ Failed to execute action: ${err.message || 'Unknown error occurred.'}`,
        timestamp: Date.now()
      };
      saveMessages([...updated, errMsg]);
    }
  };

  const handleActionCancel = (msgId: string) => {
    const updated = messages.map(m => {
      if (m.id === msgId && m.action) {
        return {
          ...m,
          action: { ...m.action, status: 'cancelled' as const }
        };
      }
      return m;
    });
    saveMessages(updated);

    const cancelMsg: Message = {
      id: `msg-${Date.now()}-ai-cancel`,
      role: 'assistant',
      text: `Action cancelled. Let me know if you want to try anything else!`,
      timestamp: Date.now()
    };
    saveMessages([...updated, cancelMsg]);
  };

  const executeAppAction = async (type: string, payload: any) => {
    switch (type) {
      case 'ADD_CALENDAR_TASK': {
        const saved = localStorage.getItem('auraflow_calendar_tasks');
        const tasks = saved ? JSON.parse(saved) : [];
        const newTask = {
          id: `cal-t-${Date.now()}`,
          title: payload.title,
          type: payload.type || 'task',
          date: payload.date,
          time: payload.time || undefined,
          category: payload.category || 'Work',
          description: payload.description || '',
          createdAt: Date.now()
        };
        localStorage.setItem('auraflow_calendar_tasks', JSON.stringify([...tasks, newTask]));
        window.dispatchEvent(new Event('storage'));
        break;
      }
      case 'CREATE_KANBAN_BOARD': {
        const saved = localStorage.getItem('auraflow_kanban_boards');
        const boards = saved ? JSON.parse(saved) : [];
        const newBoard = {
          id: `board-${Date.now()}`,
          name: payload.name,
          color: payload.color || '#6366F1',
          columns: [
            { id: `col-${Date.now()}-1`, name: 'Todo', tasks: [] },
            { id: `col-${Date.now()}-2`, name: 'In Progress', tasks: [] },
            { id: `col-${Date.now()}-3`, name: 'Done', tasks: [] }
          ]
        };
        localStorage.setItem('auraflow_kanban_boards', JSON.stringify([...boards, newBoard]));
        window.dispatchEvent(new Event('storage'));
        break;
      }
      case 'ADD_KANBAN_TASK': {
        const saved = localStorage.getItem('auraflow_kanban_boards');
        const boards = saved ? JSON.parse(saved) : [];
        if (boards.length === 0) {
          throw new Error('No Kanban boards found. Please create a board first!');
        }
        
        // Find board
        const boardIndex = payload.boardId 
          ? boards.findIndex((b: any) => b.id === payload.boardId)
          : 0;
        
        const targetBoard = boards[boardIndex === -1 ? 0 : boardIndex];
        
        const newTask = {
          id: `t_${Date.now()}`,
          title: payload.title,
          description: payload.description || '',
          dueDate: payload.dueDate || '2026-06-21',
          priority: payload.priority || 'Medium',
          labels: payload.labels || ['Design'],
          syncCalendar: false,
          syncNotes: false
        };

        targetBoard.columns[0].tasks.push(newTask);
        localStorage.setItem('auraflow_kanban_boards', JSON.stringify(boards));
        window.dispatchEvent(new Event('storage'));
        break;
      }
      case 'CREATE_NOTE': {
        const saved = localStorage.getItem('auraflow_notes_v2');
        const notes = saved ? JSON.parse(saved) : [];
        const newNote = {
          id: `note-${Date.now()}`,
          title: payload.title || 'Untitled Note',
          content: payload.content || '<h1>Untitled Note</h1><p>Write cozily...</p>',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isPinned: false,
          isTrash: false,
          color: payload.color || 'teal'
        };
        const updatedNotes = [newNote, ...notes];
        localStorage.setItem('auraflow_notes_v2', JSON.stringify(updatedNotes));
        localStorage.setItem('auraflow_notes', JSON.stringify(updatedNotes)); // Backup for dashboard activity lists
        window.dispatchEvent(new Event('storage'));
        break;
      }
      case 'REFINE_NOTE': {
        const saved = localStorage.getItem('auraflow_notes_v2');
        const notes = saved ? JSON.parse(saved) : [];
        if (notes.length === 0) {
          throw new Error('No notes found in Notebook directory.');
        }

        // Get first note or user target
        const noteIndex = payload.noteId 
          ? notes.findIndex((n: any) => n.id === payload.noteId)
          : 0;
        
        const noteToRefine = notes[noteIndex === -1 ? 0 : noteIndex];
        
        // Strip html for simple transformation
        const cleanText = noteToRefine.content.replace(/<[^>]*>/g, ' ');

        // Perform fetch to refine API
        const res = await fetch('/api/ai/refine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            option: payload.option || 'rephrase'
          })
        });

        if (!res.ok) {
          throw new Error('Failed to run AI text refinement.');
        }

        const data = await res.json();
        
        // Wrap refined in basic paragraph html
        noteToRefine.content = `<h1>✨ Refined: ${noteToRefine.title}</h1><p>${data.refinedText}</p>`;
        noteToRefine.updatedAt = Date.now();

        localStorage.setItem('auraflow_notes_v2', JSON.stringify(notes));
        localStorage.setItem('auraflow_notes', JSON.stringify(notes));
        window.dispatchEvent(new Event('storage'));
        break;
      }
      case 'CREATE_WHITEBOARD_DIAGRAM': {
        const saved = localStorage.getItem('auraflow_whiteboards_v1');
        const boards = saved ? JSON.parse(saved) : [];
        if (boards.length === 0) {
          throw new Error('No whiteboards found. Please open the Whiteboard section first.');
        }

        // Call diagram generator endpoint
        const res = await fetch('/api/ai/diagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: payload.prompt,
            type: payload.type || 'flowchart'
          })
        });

        if (!res.ok) {
          throw new Error('Diagram generator returned an error.');
        }

        const diagram = await res.json();
        
        // Generate Excalidraw elements
        const rectsAndArrows: any[] = [];
        const nodeMap = new Map();
        
        // Map nodes
        diagram.nodes.forEach((node: any, idx: number) => {
          const containerId = `ai_node_${node.id}_container_${Date.now()}`;
          const textId = `ai_node_${node.id}_text_${Date.now()}`;
          const groupId = `ai_node_${node.id}_group_${Date.now()}`;
          
          nodeMap.set(node.id, { id: containerId, x: node.x, y: node.y, w: node.width, h: node.height });

          rectsAndArrows.push({
            id: containerId,
            type: node.type === 'ellipse' ? 'ellipse' : node.type === 'diamond' ? 'diamond' : 'rectangle',
            x: node.x,
            y: node.y,
            width: node.width || 150,
            height: node.height || 60,
            backgroundColor: node.backgroundColor || '#A7F3D0',
            strokeColor: '#2d2b28',
            fillStyle: 'solid',
            roughness: 1,
            strokeWidth: 1.5,
            roundness: { type: 3 },
            groupIds: [groupId],
            boundElements: [{ id: textId, type: 'text' }],
          });

          rectsAndArrows.push({
            id: textId,
            type: 'text',
            x: node.x + 10,
            y: node.y + 15,
            width: (node.width || 150) - 20,
            height: (node.height || 60) - 30,
            text: node.text || '',
            fontSize: 13,
            fontFamily: 2,
            textAlign: 'center',
            verticalAlign: 'middle',
            strokeColor: '#2d2b28',
            groupIds: [groupId],
            containerId: containerId,
          });
        });

        // Map arrows
        diagram.arrows.forEach((arrow: any) => {
          const start = nodeMap.get(arrow.startNode);
          const end = nodeMap.get(arrow.endNode);
          if (start && end) {
            const startX = start.x + start.w / 2;
            const startY = start.y + start.h / 2;
            const endX = end.x + end.w / 2;
            const endY = end.y + end.h / 2;

            rectsAndArrows.push({
              id: `ai_arrow_${arrow.id}_${Date.now()}`,
              type: 'arrow',
              x: startX,
              y: startY,
              points: [
                [0, 0],
                [endX - startX, endY - startY]
              ],
              strokeColor: '#2d2b28',
              strokeWidth: 1.5,
              roughness: 1,
            });
          }
        });

        // Insert elements in first whiteboard
        boards[0].elements = [...(boards[0].elements || []), ...rectsAndArrows];
        boards[0].updatedAt = Date.now();

        localStorage.setItem('auraflow_whiteboards_v1', JSON.stringify(boards));
        window.dispatchEvent(new Event('storage'));
        break;
      }
      case 'GENERATE_TEMPLATE_APP': {
        const res = await fetch('/api/ai/template', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: payload.prompt })
        });

        if (!res.ok) {
          throw new Error('Template builder generated an error.');
        }

        const data = await res.json();
        const userId = 'guest';

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
        
        // Navigate
        setActivePage(`app_${newApp.id}`);
        break;
      }
      case 'UPDATE_SETTINGS': {
        // Toggle theme / settings
        break;
      }
      default:
        console.warn('Unhandled action type:', type);
    }
  };

  // Helper function to render structured confirmation cards
  const renderActionCard = (msgId: string, action: any) => {
    const { type, payload, status } = action;
    const isPending = status === 'pending';

    let title = 'Structured Action';
    let details: React.ReactNode = null;

    if (type === 'ADD_CALENDAR_TASK') {
      title = '📅 Schedule Calendar Event';
      details = (
        <div className="space-y-1 mt-1 text-muted-foreground">
          <p><strong className="text-foreground">Event:</strong> {payload.title}</p>
          <p><strong className="text-foreground">Date:</strong> {payload.date} {payload.time ? `@ ${payload.time}` : ''}</p>
          <p><strong className="text-foreground">Category:</strong> {payload.category}</p>
          {payload.description && <p><strong className="text-foreground">Details:</strong> {payload.description}</p>}
        </div>
      );
    } else if (type === 'CREATE_KANBAN_BOARD') {
      title = '📋 Create Kanban Board';
      details = (
        <div className="space-y-1 mt-1 text-muted-foreground">
          <p><strong className="text-foreground">Board Name:</strong> {payload.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <strong className="text-foreground">Theme Color:</strong> 
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: payload.color }} />
            <span>{payload.color}</span>
          </div>
        </div>
      );
    } else if (type === 'ADD_KANBAN_TASK') {
      title = '➕ Add task to Kanban';
      details = (
        <div className="space-y-1 mt-1 text-muted-foreground">
          <p><strong className="text-foreground">Task:</strong> {payload.title}</p>
          <p><strong className="text-foreground">Priority:</strong> {payload.priority || 'Medium'}</p>
          {payload.description && <p><strong className="text-foreground">Details:</strong> {payload.description}</p>}
        </div>
      );
    } else if (type === 'CREATE_NOTE') {
      title = '📝 Write Note Document';
      details = (
        <div className="space-y-1 mt-1 text-muted-foreground">
          <p><strong className="text-foreground">Title:</strong> {payload.title}</p>
          <p><strong className="text-foreground">Folder Color:</strong> {payload.color}</p>
        </div>
      );
    } else if (type === 'REFINE_NOTE') {
      title = '✨ Run AI Note Refinement';
      details = (
        <div className="space-y-1 mt-1 text-muted-foreground">
          <p><strong className="text-foreground">Transformation:</strong> {payload.option}</p>
        </div>
      );
    } else if (type === 'CREATE_WHITEBOARD_DIAGRAM') {
      title = '🎨 Create Whiteboard Sketch';
      details = (
        <div className="space-y-1 mt-1 text-muted-foreground">
          <p><strong className="text-foreground">Prompt:</strong> "{payload.prompt}"</p>
          <p><strong className="text-foreground">Diagram Layout:</strong> {payload.type}</p>
        </div>
      );
    } else if (type === 'GENERATE_TEMPLATE_APP') {
      title = '⚙️ Generate AI Dashboard App';
      details = (
        <div className="space-y-1 mt-1 text-muted-foreground">
          <p><strong className="text-foreground">Idea Prompt:</strong> "{payload.prompt}"</p>
        </div>
      );
    }

    return (
      <div className="mt-3 p-4 rounded-xl border border-border bg-card shadow-sm space-y-3.5 text-[11px] text-foreground text-left max-w-sm">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h4 className="font-bold flex items-center gap-1.5 text-foreground leading-none">
            {title}
          </h4>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider ${
            status === 'confirmed' 
              ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
              : status === 'cancelled'
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
          }`}>
            {status.toUpperCase()}
          </span>
        </div>

        {details}

        {isPending && (
          <div className="flex gap-2 justify-end border-t border-border/40 pt-2.5">
            <button
              onClick={() => handleActionCancel(msgId)}
              className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary font-semibold text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1"
            >
              <X size={11} /> Cancel
            </button>
            <button
              onClick={() => handleActionConfirm(msgId, type, payload)}
              className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold cursor-pointer flex items-center gap-1"
            >
              <Check size={11} /> Confirm & Save
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] border border-border/70 rounded-2xl bg-card cozy-shadow overflow-hidden animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/15 select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-orange-400 via-pink-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow">
            ✨
          </div>
          <div className="text-left">
            <h2 className="text-sm font-bold text-foreground">Spark AI Assistant</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Central productivity command center</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={clearChat}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 size={13} />
          </button>
          <span className="text-[9px] font-bold px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded-full font-mono">
            Online
          </span>
        </div>
      </div>

      {/* Chat Messages Feed viewport */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-lg mx-auto py-10 select-none animate-in fade-in duration-500">
            <div className="w-14 h-14 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-center text-3xl shadow-sm">
              🤖
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">Your Cozy Central Copilot</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ask Spark AI to schedule calendar meetings, add Kanban tasks, write document outlines, format notebooks, toggle settings, or sketch flowcharts.
              </p>
            </div>

            {/* suggestion pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-4">
              {SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(sug.text)}
                  className="p-3 text-left rounded-xl border border-border bg-card hover:bg-secondary/40 text-xs text-muted-foreground hover:text-foreground cozy-transition cursor-pointer shadow-sm hover:scale-[1.01]"
                >
                  <p className="font-bold text-[10px] text-primary uppercase tracking-wider mb-0.5">Suggestion</p>
                  <p className="font-medium text-[11px] truncate leading-tight">{sug.label}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4.5 max-w-3xl mx-auto">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 border select-none shadow-sm ${
                    isUser 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-gradient-to-tr from-orange-400 via-pink-400 to-indigo-500 text-white'
                  }`}>
                    {isUser ? 'SJ' : '🤖'}
                  </div>
                  <div className="flex flex-col">
                    <div className={`p-3 px-4 rounded-2xl text-[12px] leading-relaxed shadow-sm ${
                      isUser 
                        ? 'bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border border-indigo-500/25 rounded-tr-none text-right font-medium' 
                        : 'bg-secondary/40 text-foreground border border-border/40 rounded-tl-none text-left'
                    }`}>
                      {msg.text}
                    </div>
                    {!isUser && msg.action && (
                      renderActionCard(msg.id, msg.action)
                    )}
                  </div>
                </div>
              );
            })}

            {/* real-time voice typing transcript overlay */}
            {interimTranscript && (
              <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse animate-pulse">
                <div className="w-7.5 h-7.5 rounded-full flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground border border-primary flex-shrink-0">
                  SJ
                </div>
                <div className="p-3 px-4 rounded-2xl text-[12px] bg-secondary/20 text-muted-foreground border border-dashed border-border/80 rounded-tr-none italic text-right">
                  {interimTranscript}...
                </div>
              </div>
            )}

            {/* Loading typing bubble */}
            {isLoading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-7.5 h-7.5 rounded-full flex items-center justify-center bg-gradient-to-tr from-orange-400 via-pink-400 to-indigo-500 text-white text-[10px] font-bold flex-shrink-0">
                  🤖
                </div>
                <div className="p-3 px-4.5 rounded-2xl bg-secondary/30 border border-border/40 rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Listening Banner when recording active */}
      {isListening && (
        <div className="px-4 py-2 border-t border-border flex items-center justify-between bg-orange-500/10 text-orange-600 dark:text-orange-400 select-none animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {listeningState === 'connecting' ? 'Initializing microphone stream...' : 'Listening... Speak now'}
            </span>
          </div>
          <button 
            onClick={stopListening}
            className="text-[10px] font-bold px-2 py-0.5 border border-orange-500/35 bg-card text-orange-600 hover:bg-orange-500/5 rounded cozy-transition cursor-pointer"
          >
            Done Speaking
          </button>
        </div>
      )}

      {/* Transcription error alerts */}
      {transcriptionError && (
        <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-500 text-[10px] font-medium flex items-center justify-between select-none">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={12} />
            <span>{transcriptionError}</span>
          </div>
          <button onClick={() => setTranscriptionError(null)} className="p-0.5 hover:bg-secondary rounded">
            <X size={10} />
          </button>
        </div>
      )}

      {/* Quick suggest pills inside active chat scroll */}
      {messages.length > 0 && (
        <div className="px-4 py-1.5 bg-secondary/5 border-t border-border/40 flex gap-2 overflow-x-auto select-none max-w-full whitespace-nowrap scrollbar-none scroll-smooth">
          {SUGGESTIONS.slice(0, 4).map((sug, idx) => (
            <button
              key={idx}
              onClick={() => sendPrompt(sug.text)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground cozy-transition cursor-pointer shadow-sm flex-shrink-0"
            >
              {sug.label}
            </button>
          ))}
        </div>
      )}

      {/* Text Area and Buttons footer controls */}
      <div className="p-3 border-t border-border bg-secondary/15 flex items-end gap-2.5">
        <button 
          onClick={toggleListening}
          className={`p-2.5 rounded-xl border cozy-transition shadow-sm flex-shrink-0 cursor-pointer ${
            isListening 
              ? 'bg-orange-500 border-orange-500 text-white animate-pulse'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
          title={isListening ? "Stop voice listening" : "Talk directly to AI"}
        >
          {isListening ? <MicOff size={15} /> : <Mic size={15} />}
        </button>

        <div className="flex-1 relative flex items-center">
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask AI command center to structure plans, add Kanban cards, draft documents..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendPrompt();
              }
            }}
            className="w-full pl-3.5 pr-10 py-2 text-xs rounded-xl border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none min-h-[36px] max-h-[120px] scrollbar-thin overflow-y-auto leading-relaxed"
          />
          <span className="absolute right-3 bottom-2 text-[9px] text-muted-foreground/50 select-none font-medium hidden sm:inline">
            Enter to Send
          </span>
        </div>

        <button
          onClick={() => sendPrompt()}
          disabled={isLoading || !chatInput.trim()}
          className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm flex-shrink-0 disabled:opacity-40 disabled:pointer-events-none cozy-transition cursor-pointer"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
