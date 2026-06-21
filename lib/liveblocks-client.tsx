'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LiveblocksProvider, 
  RoomProvider, 
  useOthers, 
  useMyPresence, 
  useUpdateMyPresence, 
  useThreads, 
  useCreateThread, 
  useCreateComment 
} from '@liveblocks/react';
import { useAppUser } from './auth-context';

// Define the shape of our collaboration hooks context
interface RealtimeContextProps {
  isLive: boolean;
  others: any[];
  myPresence: {
    activeTaskId?: string | null;
    isTyping?: boolean;
    cursor?: { x: number; y: number } | null;
  };
  updateMyPresence: (updates: any) => void;
  threads: any[];
  createThread: (args: { body: string; metadata: { taskId: string } }) => any;
  createComment: (args: { threadId: string; body: string }) => any;
}

const RealtimeContext = createContext<RealtimeContextProps | null>(null);

// Helper to check if Liveblocks environment variables are set
export function isLiveblocksConfigured() {
  const hasPubKey = !!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;
  const hasEnabled = process.env.NEXT_PUBLIC_LIVEBLOCKS_ENABLED === 'true';
  return hasPubKey || hasEnabled;
}

// -------------------------------------------------------------
// 1. MOCK COLLABORATION PROVIDER (Fallback)
// -------------------------------------------------------------
const MOCK_USERS = [
  { id: 'mock-1', info: { name: 'Alice Green', email: 'alice@auraflow.com', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice' } },
  { id: 'mock-2', info: { name: 'Bob Oatmeal', email: 'bob@auraflow.com', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob' } },
  { id: 'mock-3', info: { name: 'Chloe Coral', email: 'chloe@auraflow.com', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe' } }
];

function MockRealtimeProvider({ children, roomId }: { children: React.ReactNode, roomId: string }) {
  const { user } = useAppUser();
  const [myPresence, setMyPresence] = useState<any>({ activeTaskId: null, isTyping: false, cursor: null });
  const [others, setOthers] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);

  // Initialize mock online collaborators and comments
  useEffect(() => {
    // Generate active statuses for others
    const initialOthers = MOCK_USERS.map((mu, index) => ({
      connectionId: index + 100,
      id: mu.id,
      info: mu.info,
      presence: {
        activeTaskId: null,
        isTyping: false,
        cursor: null
      }
    }));
    setOthers(initialOthers);

    // Periodically simulate others changing focus or typing to make it feel alive
    const interval = setInterval(() => {
      setOthers(prev => prev.map(o => {
        // 20% chance to update presence
        if (Math.random() > 0.7) {
          const isTyping = Math.random() > 0.6;
          // Random task cards (or null)
          const tasks = [null, 't-1', 't-2', 't-3', 't-4', 't-5'];
          const activeTaskId = tasks[Math.floor(Math.random() * tasks.length)];
          return {
            ...o,
            presence: {
              ...o.presence,
              activeTaskId,
              isTyping: activeTaskId ? isTyping : false
            }
          };
        }
        return o;
      }));
    }, 4500);

    // Load comments
    const savedThreads = localStorage.getItem(`auraflow_threads_${roomId}`);
    if (savedThreads) {
      setThreads(JSON.parse(savedThreads));
    } else {
      // Seed some starting comments if empty
      const defaultThreads = [
        {
          id: 'thread-default-1',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          metadata: { taskId: 't-1' },
          comments: [
            {
              id: 'comment-1',
              createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
              userId: 'mock-1',
              body: 'I have started draft mockups for this page. They look cozy!',
              userName: 'Alice Green',
              userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice'
            }
          ]
        },
        {
          id: 'thread-default-2',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          metadata: { taskId: 't-3' },
          comments: [
            {
              id: 'comment-2',
              createdAt: new Date(Date.now() - 1800000).toISOString(),
              userId: 'mock-2',
              body: 'Setting up HTML5 drag events. Easing curves feel incredibly smooth.',
              userName: 'Bob Oatmeal',
              userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob'
            },
            {
              id: 'comment-3',
              createdAt: new Date(Date.now() - 600000).toISOString(),
              userId: 'mock-3',
              body: 'Awesome! Let me know if you need help polishing CSS variables.',
              userName: 'Chloe Coral',
              userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe'
            }
          ]
        }
      ];
      setThreads(defaultThreads);
      localStorage.setItem(`auraflow_threads_${roomId}`, JSON.stringify(defaultThreads));
    }

    return () => clearInterval(interval);
  }, [roomId]);

  const updateMyPresence = (updates: any) => {
    setMyPresence((prev: any) => ({ ...prev, ...updates }));
  };

  const createThread = ({ body, metadata }: { body: string; metadata: { taskId: string } }) => {
    const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username || user?.emailAddresses[0]?.emailAddress || 'Me';
    const userAvatar = user?.imageUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userName)}`;

    const newThread = {
      id: `thread-${Date.now()}`,
      createdAt: new Date().toISOString(),
      metadata,
      comments: [
        {
          id: `comment-${Date.now()}`,
          createdAt: new Date().toISOString(),
          userId: user?.id || 'current-user',
          body,
          userName,
          userAvatar
        }
      ]
    };

    const updated = [newThread, ...threads];
    setThreads(updated);
    localStorage.setItem(`auraflow_threads_${roomId}`, JSON.stringify(updated));
    return newThread;
  };

  const createComment = ({ threadId, body }: { threadId: string; body: string }) => {
    const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username || user?.emailAddresses[0]?.emailAddress || 'Me';
    const userAvatar = user?.imageUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userName)}`;

    const newComment = {
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      userId: user?.id || 'current-user',
      body,
      userName,
      userAvatar
    };

    const updated = threads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          comments: [...t.comments, newComment]
        };
      }
      return t;
    });

    setThreads(updated);
    localStorage.setItem(`auraflow_threads_${roomId}`, JSON.stringify(updated));
    return newComment;
  };

  return (
    <RealtimeContext.Provider value={{
      isLive: false,
      others,
      myPresence,
      updateMyPresence,
      threads,
      createThread,
      createComment
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}

// -------------------------------------------------------------
// 2. LIVE LIVEBLOCKS DATA CONNECTOR
// -------------------------------------------------------------
function LiveRealtimeConnector({ children }: { children: React.ReactNode }) {
  const liveOthers = useOthers();
  const [livePresence, updateLivePresence] = useMyPresence();
  const { threads: liveThreads } = useThreads();
  const liveCreateThread = useCreateThread();
  const liveCreateComment = useCreateComment();

  // Helper to parse Liveblocks CommentBody to plain text
  const parseCommentBody = (body: any): string => {
    if (!body) return '';
    if (typeof body === 'string') return body;
    if (body.blocks) {
      return body.blocks
        .map((block: any) => block.children?.map((child: any) => child.text).join('') || '')
        .join('\n');
    }
    return '';
  };

  // Maps Liveblocks structures to our unified clean structure
  const formattedOthers = liveOthers.map(o => ({
    connectionId: o.connectionId,
    id: o.id,
    info: o.info || { name: 'Anonymous', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Anon', email: 'anon@liveblocks.com' },
    presence: o.presence || { activeTaskId: null, isTyping: false, cursor: null }
  }));

  const formattedThreads = (liveThreads || []).map(t => ({
    id: t.id,
    createdAt: t.createdAt.toISOString(),
    metadata: t.metadata,
    comments: (t.comments || []).map(c => ({
      id: c.id,
      createdAt: c.createdAt.toISOString(),
      userId: c.userId,
      body: parseCommentBody(c.body),
      // Set userName and userAvatar based on user meta properties if present
      userName: (c as any).userName || 'User',
      userAvatar: (c as any).userAvatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=User'
    }))
  }));

  const handleCreateThread = ({ body, metadata }: { body: string; metadata: { taskId: string } }) => {
    // Create rich text body for Liveblocks
    const richBody = {
      version: 1 as const,
      content: [
        {
          type: 'paragraph' as const,
          children: [{ text: body }]
        }
      ]
    };
    return liveCreateThread({ body: richBody, metadata });
  };

  const handleCreateComment = ({ threadId, body }: { threadId: string; body: string }) => {
    const richBody = {
      version: 1 as const,
      content: [
        {
          type: 'paragraph' as const,
          children: [{ text: body }]
        }
      ]
    };
    return liveCreateComment({ threadId, body: richBody });
  };

  return (
    <RealtimeContext.Provider value={{
      isLive: true,
      others: formattedOthers,
      myPresence: livePresence,
      updateMyPresence: updateLivePresence,
      threads: formattedThreads,
      createThread: handleCreateThread,
      createComment: handleCreateComment
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}

// -------------------------------------------------------------
// 3. EXPORTED WRAPPER COMPONENTS
// -------------------------------------------------------------
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const isEnabled = isLiveblocksConfigured();

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      {children}
    </LiveblocksProvider>
  );
}

export function RealtimeRoom({ children, roomId }: { children: React.ReactNode, roomId: string }) {
  const isEnabled = isLiveblocksConfigured();

  if (!isEnabled) {
    return <MockRealtimeProvider roomId={roomId}>{children}</MockRealtimeProvider>;
  }

  return (
    <RoomProvider id={roomId} initialPresence={{ activeTaskId: null, isTyping: false, cursor: null }}>
      <LiveRealtimeConnector>
        {children}
      </LiveRealtimeConnector>
    </RoomProvider>
  );
}

// -------------------------------------------------------------
// 4. EXPORTED UNIFIED HOOKS
// -------------------------------------------------------------
export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeRoom provider');
  }
  return context;
}
