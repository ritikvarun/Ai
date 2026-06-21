'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Presentation, 
  Download, 
  Sparkles, 
  Trash2, 
  Copy, 
  Edit3, 
  Palette, 
  FileText, 
  Check, 
  Trash,
  Settings,
  ChevronDown,
  ChevronUp,
  Circle,
  HelpCircle,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { Excalidraw, convertToExcalidrawElements, exportToBlob } from '@excalidraw/excalidraw';

interface Whiteboard {
  id: string;
  name: string;
  updatedAt: number;
  color: string; // The indicator color id: cyan, emerald, etc.
  elements: any[];
  appState: any;
}

const BOARD_COLORS = [
  { id: 'cyan', label: 'Cyan', hex: '#06B6D4', text: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
  { id: 'emerald', label: 'Emerald', hex: '#10B981', text: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'indigo', label: 'Indigo', hex: '#6366F1', text: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
  { id: 'rose', label: 'Rose', hex: '#EC4899', text: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  { id: 'amber', label: 'Amber', hex: '#D97706', text: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { id: 'coral', label: 'Coral', hex: '#EF4444', text: 'text-red-500 bg-red-500/10 border-red-500/20' },
];

const STICKY_COLORS = [
  { hex: '#FEF08A', label: 'Warm Yellow' },
  { hex: '#A7F3D0', label: 'Soft Mint' },
  { hex: '#FECACA', label: 'Rose Pastel' },
  { hex: '#C084FC', label: 'Lavender' },
  { hex: '#93C5FD', label: 'Sky Blue' },
  { hex: '#FED7AA', label: 'Peach Orange' },
];

const STROKE_COLORS = [
  '#2D2B28', // Charcoal
  '#0D9488', // Teal
  '#10B981', // Emerald
  '#EC4899', // Rose
  '#D97706', // Amber
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#FFFFFF', // White
];

const TEXT_COLORS = [
  '#2D2B28', // Charcoal
  '#D97706', // Amber
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#FFFFFF', // White
];

const INITIAL_ELEMENTS = [
  {
    id: 'intro_rect',
    type: 'rectangle',
    x: 100,
    y: 100,
    width: 260,
    height: 160,
    backgroundColor: '#A7F3D0',
    strokeColor: '#2d2b28',
    fillStyle: 'solid',
    roughness: 1.2,
    strokeWidth: 1.5,
    roundness: { type: 3 },
    groupIds: ['intro_group'],
    boundElements: [{ id: 'intro_text', type: 'text' }],
  },
  {
    id: 'intro_text',
    type: 'text',
    x: 115,
    y: 115,
    width: 230,
    height: 130,
    text: '✨ Welcome to AuraFlow!\n\nThis is a Miro-style whiteboard canvas. You can draw freely, drop sticky notes, and generate entire flowcharts with AI!',
    fontSize: 14,
    fontFamily: 1, // Hand-drawn
    textAlign: 'center',
    verticalAlign: 'middle',
    strokeColor: '#2d2b28',
    groupIds: ['intro_group'],
    containerId: 'intro_rect',
  }
];

export default function WhiteboardPage({ isDark }: { isDark: boolean }) {
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editBoardName, setEditBoardName] = useState('');
  const [activePaletteBoardId, setActivePaletteBoardId] = useState<string | null>(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  // Drawing settings states
  const [activeStickyColor, setActiveStickyColor] = useState('#FEF08A');
  const [activeStrokeColor, setActiveStrokeColor] = useState('#2D2B28');
  const [activeBackgroundColor, setActiveBackgroundColor] = useState('transparent');
  const [activeTextColor, setActiveTextColor] = useState('#2D2B28');

  // AI Generator Dialog states
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDiagramType, setAiDiagramType] = useState('flowchart');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Initialize and load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('auraflow_whiteboards_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWhiteboards(parsed);
        if (parsed.length > 0) {
          setSelectedBoardId(parsed[0].id);
        }
      } catch (e) {
        loadDefaultBoards();
      }
    } else {
      loadDefaultBoards();
    }
  }, []);

  const loadDefaultBoards = () => {
    const defaultBoards: Whiteboard[] = [
      {
        id: 'board-1',
        name: '🎨 Product Design Canvas',
        updatedAt: Date.now() - 3600000,
        color: 'cyan',
        elements: convertToExcalidrawElements(INITIAL_ELEMENTS as any),
        appState: { viewBackgroundColor: '#ffffff' }
      },
      {
        id: 'board-2',
        name: '🌿 Cozy Brainstorming',
        updatedAt: Date.now(),
        color: 'emerald',
        elements: [],
        appState: { viewBackgroundColor: '#ffffff' }
      }
    ];
    setWhiteboards(defaultBoards);
    localStorage.setItem('auraflow_whiteboards_v1', JSON.stringify(defaultBoards));
    setSelectedBoardId(defaultBoards[0].id);
  };

  const activeBoard = whiteboards.find(w => w.id === selectedBoardId);

  // Sync canvas scene when active board selection changes
  useEffect(() => {
    if (!excalidrawAPI || !activeBoard) return;
    try {
      excalidrawAPI.updateScene({
        elements: activeBoard.elements || [],
        appState: {
          ...activeBoard.appState,
          theme: isDark ? 'dark' : 'light',
        }
      });
      // Reset active color picks to reflect Excalidraw defaults if any
      setActiveStrokeColor(activeBoard.appState?.currentItemStrokeColor || '#2D2B28');
      setActiveBackgroundColor(activeBoard.appState?.currentItemBackgroundColor || 'transparent');
      setActiveTextColor(activeBoard.appState?.currentItemTextColor || '#2D2B28');
    } catch (err) {
      console.error('Failed to update Excalidraw scene:', err);
    }
  }, [selectedBoardId, excalidrawAPI]);

  // Synchronize theme changes
  useEffect(() => {
    if (!excalidrawAPI) return;
    excalidrawAPI.updateScene({
      appState: { theme: isDark ? 'dark' : 'light' }
    });
  }, [isDark, excalidrawAPI]);

  // Debounced auto-saving to local storage
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCanvasChange = (elements: readonly any[], appState: any) => {
    if (!selectedBoardId) return;

    setSaveStatus('saving');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setWhiteboards(prev => {
        const updated = prev.map(w => {
          if (w.id === selectedBoardId) {
            return {
              ...w,
              elements: [...elements],
              appState: {
                viewBackgroundColor: appState.viewBackgroundColor,
                currentItemStrokeColor: appState.currentItemStrokeColor,
                currentItemBackgroundColor: appState.currentItemBackgroundColor,
                currentItemTextColor: appState.currentItemTextColor,
              },
              updatedAt: Date.now()
            };
          }
          return w;
        });
        localStorage.setItem('auraflow_whiteboards_v1', JSON.stringify(updated));
        return updated;
      });
      setSaveStatus('saved');
    }, 1000);
  };

  // Helper for relative time
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

  // Whiteboard List Actions
  const handleAddBoard = () => {
    const randomColors = BOARD_COLORS.map(c => c.id);
    const color = randomColors[Math.floor(Math.random() * randomColors.length)];
    const newBoard: Whiteboard = {
      id: `board-${Date.now()}`,
      name: `Untitled Board ${whiteboards.length + 1}`,
      updatedAt: Date.now(),
      color,
      elements: [],
      appState: { viewBackgroundColor: '#ffffff' }
    };
    const updated = [newBoard, ...whiteboards];
    setWhiteboards(updated);
    localStorage.setItem('auraflow_whiteboards_v1', JSON.stringify(updated));
    setSelectedBoardId(newBoard.id);
  };

  const handleDuplicateBoard = (e: React.MouseEvent, board: Whiteboard) => {
    e.stopPropagation();
    const duplicated: Whiteboard = {
      ...board,
      id: `board-${Date.now()}`,
      name: `${board.name} (Copy)`,
      updatedAt: Date.now(),
    };
    const updated = [duplicated, ...whiteboards];
    setWhiteboards(updated);
    localStorage.setItem('auraflow_whiteboards_v1', JSON.stringify(updated));
    setSelectedBoardId(duplicated.id);
  };

  const handleDeleteBoard = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this whiteboard?')) {
      const filtered = whiteboards.filter(w => w.id !== id);
      setWhiteboards(filtered);
      localStorage.setItem('auraflow_whiteboards_v1', JSON.stringify(filtered));
      if (selectedBoardId === id) {
        if (filtered.length > 0) {
          setSelectedBoardId(filtered[0].id);
        } else {
          setSelectedBoardId('');
        }
      }
    }
  };

  const handleStartRename = (e: React.MouseEvent, board: Whiteboard) => {
    e.stopPropagation();
    setEditingBoardId(board.id);
    setEditBoardName(board.name);
  };

  const handleSaveRename = (id: string) => {
    if (editBoardName.trim()) {
      const updated = whiteboards.map(w => 
        w.id === id ? { ...w, name: editBoardName.trim(), updatedAt: Date.now() } : w
      );
      setWhiteboards(updated);
      localStorage.setItem('auraflow_whiteboards_v1', JSON.stringify(updated));
    }
    setEditingBoardId(null);
  };

  const handleSetIndicatorColor = (id: string, color: string) => {
    const updated = whiteboards.map(w => 
      w.id === id ? { ...w, color } : w
    );
    setWhiteboards(updated);
    localStorage.setItem('auraflow_whiteboards_v1', JSON.stringify(updated));
    setActivePaletteBoardId(null);
  };

  // Canvas Calculations & Center Node Helpers
  const getCanvasCenter = () => {
    if (!excalidrawAPI) return { x: 300, y: 300 };
    try {
      const appState = excalidrawAPI.getAppState();
      const zoom = appState.zoom.value || 1;
      const scrollX = appState.scrollX || 0;
      const scrollY = appState.scrollY || 0;

      // Approximate dimensions of the canvas element container
      const containerWidth = typeof window !== 'undefined' ? window.innerWidth - 320 : 800;
      const containerHeight = typeof window !== 'undefined' ? window.innerHeight - 100 : 600;

      return {
        x: -scrollX + (containerWidth / 2) / zoom,
        y: -scrollY + (containerHeight / 2) / zoom,
      };
    } catch (e) {
      return { x: 300, y: 300 };
    }
  };

  // Drop custom sticky note onto canvas
  const handleDropSticky = (stickyColor: string) => {
    if (!excalidrawAPI) return;
    const { x, y } = getCanvasCenter();
    
    const containerId = `sticky_rect_${Date.now()}`;
    const textId = `sticky_text_${Date.now()}`;
    const groupId = `sticky_group_${Date.now()}`;

    const rectElement = {
      id: containerId,
      type: 'rectangle',
      x: x - 90,
      y: y - 90,
      width: 180,
      height: 180,
      backgroundColor: stickyColor,
      strokeColor: '#2d2b28',
      fillStyle: 'solid',
      roughness: 1.2,
      strokeWidth: 1.5,
      roundness: { type: 3 },
      groupIds: [groupId],
      boundElements: [{ id: textId, type: 'text' }],
    };

    const textElement = {
      id: textId,
      type: 'text',
      x: x - 75,
      y: y - 75,
      width: 150,
      height: 150,
      text: 'Double-click to edit note',
      fontSize: 16,
      fontFamily: 1, // Hand-drawn
      textAlign: 'center',
      verticalAlign: 'middle',
      strokeColor: '#2d2b28',
      groupIds: [groupId],
      containerId: containerId,
    };

    const converted = convertToExcalidrawElements([rectElement, textElement] as any);
    const currentElements = excalidrawAPI.getSceneElements();

    excalidrawAPI.updateScene({
      elements: [...currentElements, ...converted],
      appState: {
        selectedElementIds: {
          [containerId]: true,
          [textId]: true,
        }
      }
    });
  };

  // Color picker selection hooks (syncs custom toolbar picks to Excalidraw appState defaults)
  const handleSetStrokeColor = (color: string) => {
    setActiveStrokeColor(color);
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        appState: { currentItemStrokeColor: color }
      });
    }
  };

  const handleSetBackgroundColor = (color: string) => {
    setActiveBackgroundColor(color);
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        appState: { currentItemBackgroundColor: color }
      });
    }
  };

  const handleSetTextColor = (color: string) => {
    setActiveTextColor(color);
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        appState: { currentItemTextColor: color }
      });
    }
  };

  // Export board to PNG blob
  const handleExportPng = async () => {
    if (!excalidrawAPI) return;
    try {
      const elements = excalidrawAPI.getSceneElements();
      if (!elements || elements.length === 0) {
        alert('Drawing canvas is empty! Add some elements first before exporting.');
        return;
      }
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      const blob = await exportToBlob({
        elements,
        appState: {
          ...appState,
          exportBackground: true,
          viewBackgroundColor: isDark ? '#141412' : '#faf9f5',
        },
        files,
        mimeType: 'image/png',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeBoard?.name || 'whiteboard'}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export to PNG:', err);
      alert('Error exporting PNG image.');
    }
  };

  // Clear Canvas Elements
  const handleClearCanvas = () => {
    if (!excalidrawAPI) return;
    if (confirm('Are you sure you want to clear all drawings and elements on this board?')) {
      excalidrawAPI.updateScene({ elements: [] });
    }
  };

  // AI Diagram Generator Fetch & Parser
  const handleGenerateAiDiagram = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);

    try {
      const response = await fetch('/api/ai/diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          type: aiDiagramType
        })
      });

      if (!response.ok) {
        throw new Error('Server returned error status');
      }

      const diagram = await response.json();
      
      if (diagram && diagram.nodes && excalidrawAPI) {
        const convertedElements = convertAiDiagramToExcalidraw(diagram);
        const currentElements = excalidrawAPI.getSceneElements();
        
        excalidrawAPI.updateScene({
          elements: [...currentElements, ...convertedElements],
        });

        // Close dialogue and reset
        setIsAiDialogOpen(false);
        setAiPrompt('');
      } else {
        alert('Failed to parse nodes from generator service.');
      }
    } catch (err) {
      console.error('Failed to generate diagram:', err);
      alert('Failed to generate diagram. Using fallback simulation...');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const convertAiDiagramToExcalidraw = (diagram: any) => {
    const elementsToConvert: any[] = [];
    const nodeMap = new Map<string, { containerId: string; textId: string; x: number; y: number; width: number; height: number }>();

    const { x: viewCenterX, y: viewCenterY } = getCanvasCenter();
    
    // Bounds tracking to center nicely
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    diagram.nodes.forEach((n: any) => {
      if (n.x < minX) minX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.x + n.width > maxX) maxX = n.x + n.width;
      if (n.y + n.height > maxY) maxY = n.y + n.height;
    });

    const diagWidth = maxX - minX;
    const diagHeight = maxY - minY;
    const offsetX = viewCenterX - (minX + diagWidth / 2);
    const offsetY = viewCenterY - (minY + diagHeight / 2);

    // Convert node structures
    diagram.nodes.forEach((node: any) => {
      const containerId = `node_${node.id}_container_${Date.now()}`;
      const textId = `node_${node.id}_text_${Date.now()}`;
      const groupId = `node_${node.id}_group_${Date.now()}`;

      const adjustedX = node.x + offsetX;
      const adjustedY = node.y + offsetY;

      nodeMap.set(node.id, {
        containerId,
        textId,
        x: adjustedX,
        y: adjustedY,
        width: node.width || 160,
        height: node.height || 70,
      });

      let excalidrawType = 'rectangle';
      if (node.type === 'ellipse') excalidrawType = 'ellipse';
      else if (node.type === 'diamond') excalidrawType = 'diamond';

      const containerElement = {
        id: containerId,
        type: excalidrawType,
        x: adjustedX,
        y: adjustedY,
        width: node.width || 160,
        height: node.height || 70,
        backgroundColor: node.backgroundColor || '#ffffff',
        strokeColor: '#2d2b28',
        fillStyle: 'solid',
        roughness: 1, // neat sketch
        strokeWidth: 1.5,
        groupIds: [groupId],
        boundElements: [{ id: textId, type: 'text' }],
      };

      const textElement = {
        id: textId,
        type: 'text',
        x: adjustedX + 10,
        y: adjustedY + 10,
        width: (node.width || 160) - 20,
        height: (node.height || 70) - 20,
        text: node.text || '',
        fontSize: 13,
        fontFamily: 2, // clean sans
        textAlign: 'center',
        verticalAlign: 'middle',
        strokeColor: '#2d2b28',
        groupIds: [groupId],
        containerId: containerId,
      };

      elementsToConvert.push(containerElement, textElement);
    });

    // Convert arrow relations
    diagram.arrows.forEach((arrow: any) => {
      const startNodeInfo = nodeMap.get(arrow.startNode);
      const endNodeInfo = nodeMap.get(arrow.endNode);

      if (startNodeInfo && endNodeInfo) {
        const arrowId = `arrow_${arrow.id}_${Date.now()}`;
        
        // Edge connections based on position
        const cx1 = startNodeInfo.x + startNodeInfo.width / 2;
        const cy1 = startNodeInfo.y + startNodeInfo.height / 2;
        const cx2 = endNodeInfo.x + endNodeInfo.width / 2;
        const cy2 = endNodeInfo.y + endNodeInfo.height / 2;

        let startX = cx1;
        let startY = cy1;
        let endX = cx2;
        let endY = cy2;

        if (Math.abs(cx1 - cx2) > Math.abs(cy1 - cy2)) {
          if (cx1 < cx2) {
            startX = startNodeInfo.x + startNodeInfo.width;
            endX = endNodeInfo.x;
          } else {
            startX = startNodeInfo.x;
            endX = endNodeInfo.x + endNodeInfo.width;
          }
        } else {
          if (cy1 < cy2) {
            startY = startNodeInfo.y + startNodeInfo.height;
            endY = endNodeInfo.y;
          } else {
            startY = startNodeInfo.y;
            endY = endNodeInfo.y + endNodeInfo.height;
          }
        }

        const arrowElement = {
          id: arrowId,
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
        };

        elementsToConvert.push(arrowElement);

        // Arrow mid labels
        if (arrow.label) {
          const midX = startX + (endX - startX) / 2;
          const midY = startY + (endY - startY) / 2;
          const labelId = `arrow_label_${arrow.id}_${Date.now()}`;
          
          const labelElement = {
            id: labelId,
            type: 'text',
            x: midX - 30,
            y: midY - 10,
            width: 60,
            height: 20,
            text: arrow.label,
            fontSize: 10,
            fontFamily: 2,
            textAlign: 'center',
            verticalAlign: 'middle',
            strokeColor: '#706b63',
          };
          elementsToConvert.push(labelElement);
        }
      }
    });

    return convertToExcalidrawElements(elementsToConvert as any);
  };

  // Filtering whiteboard list
  const filteredBoards = whiteboards.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-background text-foreground overflow-hidden">
      
      {/* LEFT BOARD LIST SIDEBAR */}
      <aside className="w-full md:w-76 border-b md:border-b-0 md:border-r border-border/70 flex flex-col h-full overflow-hidden select-none bg-sidebar flex-shrink-0">
        
        {/* Header toolbar */}
        <div className="p-4 border-b border-border/50 flex flex-col gap-3 flex-shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              🎨 Board Directory
            </span>
            <button
              onClick={handleAddBoard}
              className="p-1 rounded bg-card border border-border/80 hover:bg-secondary cursor-pointer text-muted-foreground hover:text-foreground cozy-transition shadow-sm flex items-center justify-center"
              title="New Whiteboard"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border/80 bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        {/* Directory Items List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
          {filteredBoards.map((board) => {
            const isActive = board.id === selectedBoardId;
            const colorObj = BOARD_COLORS.find(c => c.id === board.color) || BOARD_COLORS[0];
            const isEditing = board.id === editingBoardId;

            return (
              <div
                key={board.id}
                onClick={() => setSelectedBoardId(board.id)}
                className={`relative group flex flex-col gap-1 p-2.5 rounded-xl border cozy-transition cursor-pointer ${
                  isActive 
                    ? 'bg-card text-foreground border-border/80 shadow-sm font-semibold' 
                    : 'bg-transparent text-muted-foreground hover:bg-card/45 border-transparent hover:text-foreground'
                }`}
                style={{
                  borderLeft: `3.5px solid ${colorObj.hex}`
                }}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <Presentation size={13} className="text-cyan-500 flex-shrink-0" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editBoardName}
                        onChange={(e) => setEditBoardName(e.target.value)}
                        onBlur={() => handleSaveRename(board.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(board.id);
                          if (e.key === 'Escape') setEditingBoardId(null);
                        }}
                        autoFocus
                        className="w-full text-xs bg-secondary/50 border border-border rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary font-medium text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="truncate text-xs font-semibold text-foreground">
                        {board.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] text-muted-foreground mt-1">
                  <span>Updated {formatTime(board.updatedAt)}</span>
                  <span className={`px-1.5 py-0.25 text-[8px] font-bold border rounded uppercase ${colorObj.text}`}>
                    {colorObj.label}
                  </span>
                </div>

                {/* Quick actions palette hover menu */}
                {!isEditing && (
                  <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1.5 bg-card/90 dark:bg-zinc-800/90 border border-border/80 p-1 rounded-md shadow-md z-10 cozy-transition">
                    
                    {/* Palette change */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePaletteBoardId(activePaletteBoardId === board.id ? null : board.id);
                        }}
                        className="p-1 rounded hover:bg-secondary text-muted-foreground cozy-transition"
                        title="Change indicator color"
                      >
                        <Palette size={11} />
                      </button>

                      {activePaletteBoardId === board.id && (
                        <div 
                          className="absolute right-0 top-full mt-1.5 flex gap-1 p-1 bg-card border border-border rounded-lg shadow-lg z-50 cozy-shadow"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {BOARD_COLORS.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => handleSetIndicatorColor(board.id, c.id)}
                              className="w-4.5 h-4.5 rounded-full border border-black/10 hover:scale-110 cozy-transition flex-shrink-0"
                              style={{ backgroundColor: c.hex }}
                              title={c.label}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleDuplicateBoard(e, board)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground cozy-transition"
                      title="Duplicate Board"
                    >
                      <Copy size={11} />
                    </button>

                    <button
                      onClick={(e) => handleStartRename(e, board)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground cozy-transition"
                      title="Rename Board"
                    >
                      <Edit3 size={11} />
                    </button>

                    <button
                      onClick={(e) => handleDeleteBoard(e, board.id)}
                      className="p-1 rounded hover:bg-secondary text-red-500 cozy-transition"
                      title="Delete Board"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredBoards.length === 0 && (
            <div className="text-center py-10 px-4">
              <span className="text-xl">🏜️</span>
              <p className="text-[10px] text-muted-foreground mt-2">
                {searchQuery ? 'No boards matching search' : 'No whiteboards in list'}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-border/50 bg-secondary/15 flex items-center justify-between text-[9px] text-muted-foreground">
          <span>Active canvas state</span>
          <span className="font-mono bg-border/40 px-1 py-0.5 rounded">Miro Mode</span>
        </div>
      </aside>

      {/* RIGHT FULL WHITEBOARD CANVAS VIEW */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activeBoard ? (
          <>
            {/* CANVAS TOP BAR OVERLAY */}
            <div 
              className="absolute left-4 right-4 top-4 bg-card/90 backdrop-blur-md border border-border/80 px-4 py-2.5 rounded-xl shadow-md z-40 flex items-center justify-between gap-4 cozy-transition"
            >
              {/* File Title */}
              <div className="flex items-center gap-2 max-w-sm overflow-hidden text-left">
                <Presentation size={15} className="text-cyan-500 flex-shrink-0" />
                <span className="font-bold text-xs text-foreground truncate">
                  {activeBoard.name}
                </span>
                <button 
                  onClick={(e) => handleStartRename(e, activeBoard)}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer flex-shrink-0 cozy-transition"
                  title="Rename"
                >
                  <Edit3 size={10} />
                </button>
              </div>

              {/* CENTER ACTIVE DRAWING STYLING TOOLS */}
              <div className="hidden lg:flex items-center gap-5">
                {/* Stroke Color */}
                <div className="flex items-center gap-1.5 border-r border-border/50 pr-4">
                  <span className="text-[10px] text-muted-foreground font-semibold">Stroke:</span>
                  <div className="flex gap-1">
                    {STROKE_COLORS.slice(0, 5).map((col) => (
                      <button
                        key={col}
                        onClick={() => handleSetStrokeColor(col)}
                        className={`w-3.5 h-3.5 rounded-full border border-black/15 cozy-transition cursor-pointer ${
                          activeStrokeColor === col ? 'scale-125 ring-1 ring-primary' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>

                {/* Background/Fill Color */}
                <div className="flex items-center gap-1.5 border-r border-border/50 pr-4">
                  <span className="text-[10px] text-muted-foreground font-semibold">Fill:</span>
                  <div className="flex gap-1 items-center">
                    <button
                      onClick={() => handleSetBackgroundColor('transparent')}
                      className={`w-3.5 h-3.5 rounded-full border border-dashed border-muted-foreground bg-transparent hover:scale-110 cursor-pointer ${
                        activeBackgroundColor === 'transparent' ? 'ring-1 ring-primary scale-125' : ''
                      }`}
                      title="Transparent"
                    />
                    {STROKE_COLORS.slice(1, 5).map((col) => (
                      <button
                        key={col}
                        onClick={() => handleSetBackgroundColor(`${col}2e`)} // 18% opacity pastel fills
                        className={`w-3.5 h-3.5 rounded-full border border-black/15 cozy-transition cursor-pointer ${
                          activeBackgroundColor === `${col}2e` ? 'scale-125 ring-1 ring-primary' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: `${col}2e` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Text Color */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground font-semibold">Text:</span>
                  <div className="flex gap-1">
                    {TEXT_COLORS.map((col) => (
                      <button
                        key={col}
                        onClick={() => handleSetTextColor(col)}
                        className={`w-3.5 h-3.5 rounded-full border border-black/15 cozy-transition cursor-pointer ${
                          activeTextColor === col ? 'scale-125 ring-1 ring-primary' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side Options & Sync Status */}
              <div className="flex items-center gap-2">
                {/* Sync status indicator */}
                <div className="flex items-center gap-1.5 mr-2 text-[10px] text-muted-foreground font-semibold">
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={12} className="text-green-500" />
                      <span>Saved</span>
                    </>
                  )}
                </div>

                {/* AI Diagram */}
                <button
                  onClick={() => setIsAiDialogOpen(true)}
                  className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm cozy-transition cursor-pointer"
                  title="Generate Diagram with AI"
                >
                  <Sparkles size={11} /> AI Diagram
                </button>

                {/* Export PNG */}
                <button
                  onClick={handleExportPng}
                  className="px-2.5 py-1.5 bg-card border border-border/80 hover:bg-secondary text-foreground rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm cozy-transition cursor-pointer"
                  title="Export to PNG"
                >
                  <Download size={11} /> PNG
                </button>

                {/* Clear canvas */}
                <button
                  onClick={handleClearCanvas}
                  className="p-1.5 border border-border/80 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg cozy-transition cursor-pointer"
                  title="Clear Whiteboard"
                >
                  <Trash size={12} />
                </button>
              </div>
            </div>

            {/* DYNAMIC STICKY DROP DRAWER FLOATING BAR */}
            <div 
              className="absolute left-4 bottom-4 bg-card/90 backdrop-blur-md border border-border/80 px-3.5 py-2.5 rounded-xl shadow-md z-40 flex flex-col gap-2.5 cozy-transition"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
                <span>Sticky Notes Drawer</span>
                <span className="text-muted-foreground/60 cursor-help" title="Click a color to drop a Miro sticky note onto the screen">
                  <HelpCircle size={10} />
                </span>
              </div>
              <div className="flex items-center gap-2">
                {STICKY_COLORS.map((st) => (
                  <button
                    key={st.hex}
                    onClick={() => handleDropSticky(st.hex)}
                    className="w-7 h-7 rounded-lg border border-black/10 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm relative group"
                    style={{ backgroundColor: st.hex }}
                    title={`Drop ${st.label} Note`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-zinc-700">+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* EXCALIDRAW CORE CANVAS AREA */}
            <div className="w-full relative z-10 flex-1" style={{ height: '100%', minHeight: '500px' }}>
              <Excalidraw
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                onChange={handleCanvasChange}
                theme={isDark ? 'dark' : 'light'}
                UIOptions={{
                  canvasActions: {
                    loadScene: false,
                    saveToActiveFile: false,
                    export: false,
                    toggleTheme: false,
                  }
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none bg-background">
            <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center text-3xl mb-4 border border-border/60">
              🎨
            </div>
            <h3 className="font-bold text-sm text-foreground">Select a whiteboard canvas</h3>
            <p className="text-xs text-muted-foreground max-w-xs mt-1.5">
              Choose an existing whiteboard from the directory sidebar, or click the plus button to launch a new visual canvas.
            </p>
            <button
              onClick={handleAddBoard}
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cozy-transition cursor-pointer"
            >
              <Plus size={14} /> Launch New Canvas
            </button>
          </div>
        )}

        {/* AI DIAGRAM GENERATOR MODAL DIALOG */}
        {isAiDialogOpen && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-card border border-border/80 rounded-2xl shadow-xl w-full max-w-md p-5 text-left flex flex-col gap-4 animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Sparkles size={16} className="text-orange-500 animate-pulse" /> AI Diagram Generator
                </h3>
                <button
                  onClick={() => setIsAiDialogOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xs p-1 rounded hover:bg-secondary cozy-transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Diagram Options */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                  1. Diagram Layout Structure
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'flowchart', label: 'Flowchart' },
                    { id: 'mindmap', label: 'Mind Map' },
                    { id: 'system', label: 'Architecture' },
                    { id: 'journey', label: 'User Journey' },
                    { id: 'process', label: 'Process' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setAiDiagramType(opt.id)}
                      className={`px-3 py-1.5 rounded-lg border text-center font-semibold text-xs cozy-transition cursor-pointer ${
                        aiDiagramType === opt.id
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'bg-secondary/40 border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                  2. Prompt Description
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe your diagram in detail (e.g. 'A user login system that checks email validation, queries Drizzle database, and handles session caching')"
                  rows={4}
                  className="w-full p-2.5 rounded-xl border border-border bg-secondary/15 focus:outline-none focus:ring-1 focus:ring-primary text-xs text-foreground"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <HelpCircle size={12} className="text-amber-500 flex-shrink-0" />
                <span>AI will drop coordinates-centered shapes directly inside the canvas.</span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 border-t border-border/40 pt-4 mt-2">
                <button
                  onClick={() => setIsAiDialogOpen(false)}
                  disabled={isGeneratingAi}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateAiDiagram}
                  disabled={isGeneratingAi || !aiPrompt.trim()}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-sm cozy-transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} /> Generate
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
