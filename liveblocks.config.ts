declare global {
  interface Liveblocks {
    // Each user's presence state in the room
    Presence: {
      activeTaskId?: string | null;
      isTyping?: boolean;
      cursor?: { x: number; y: number } | null;
    };
    
    // User metadata returned from /api/liveblocks-auth
    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
        email: string;
      };
    };

    // Liveblocks Storage (room-specific collaborative state)
    Storage: {
      // Optional room storage properties
    };
    
    // Custom metadata associated with threads/comments
    ThreadMetadata: {
      taskId: string;
    };
  }
}

export {};
